import 'server-only';
import { cookies } from 'next/headers';
import { prisma, notDeleted } from '@adysre/database';
import { ACCESS_COOKIE, verifyAccessToken, type PlatformSession } from '@/lib/auth/access-token';
import { DEV_SESSION_COOKIE } from './auth-policy';
import type { SystemRole } from '@adysre/types';

/**
 * Server-side session resolution for the API Studio endpoints.
 *
 * Production has exactly one path: a verified `access_token`. No token, no
 * secret, or a bad one resolves to `null` and every route answers 401. Failing
 * closed means a bug denies access rather than handing a request runner to
 * anyone who can reach the URL.
 *
 * Development has a fallback, because the API often is not running locally and
 * an unusable module is not a testable one. It differs from the Website
 * Intelligence fallback in one way that matters: API Studio WRITES rows with a
 * tenant foreign key, so the dev session must carry the seeded tenant's real
 * UUID rather than the string "demo". Without a seeded database there is no
 * honest tenant to attribute writes to, and the routes say so.
 *
 * `API_STUDIO_STRICT_AUTH=true` disables the fallback, to rehearse production
 * behaviour locally or in CI.
 */

/** The demo tenant every unauthenticated dev request is attributed to. */
const DEMO_ORG_SLUG = 'demo';

/**
 * The database could not be reached while resolving who the caller is.
 *
 * Distinct from "not signed in", because the two need opposite answers: an
 * unauthenticated caller is told to sign in (401), while an unreachable
 * database is an operator's problem the caller can do nothing about (503).
 * Answering 401 for a connection failure would send people to fix their
 * credentials over an outage.
 */
export class StorageUnavailableError extends Error {
  constructor(message = 'The database could not be reached.') {
    super(message);
    this.name = 'StorageUnavailableError';
  }
}

function isSystemRole(value: string): value is SystemRole {
  return ['Owner', 'Admin', 'Manager', 'Member', 'Custom'].includes(value);
}

/**
 * Resolve the current session, or `null` when the caller is unauthenticated.
 *
 * @throws when running in production without `JWT_ACCESS_SECRET`: a missing
 * secret is the whole trust model absent, which must fail loudly rather than
 * wave requests through.
 */
export async function getSession(): Promise<PlatformSession | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  const secret = process.env.JWT_ACCESS_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (token) {
    // A present-but-invalid token is an explicit "no". Never fall through to
    // the dev session, or an attacker could downgrade by sending garbage.
    if (secret) return verifyAccessToken(token, secret);
    if (isProd) {
      throw new Error('JWT_ACCESS_SECRET is not set; cannot verify API Studio sessions.');
    }
  }

  if (isProd || process.env.API_STUDIO_STRICT_AUTH === 'true') return null;

  return resolveDevSession(store.get(DEV_SESSION_COOKIE)?.value);
}

/**
 * The dev stand-in session.
 *
 * Both ids are REAL rows from the seeded tenant, and that is not cosmetic: every
 * table here carries `created_by`/`updated_by` as `uuid`, so a synthetic id like
 * `demo-user-<org>` is rejected by Postgres on insert. Reads would work and
 * every write would fail - which is exactly the shape of bug this once had.
 *
 * Cookie grammar: `<role>`, or `anonymous` to exercise the denied path.
 * An unrecognised role falls back to Owner, never to a silent deny.
 */
async function resolveDevSession(cookie: string | undefined): Promise<PlatformSession | null> {
  if (cookie === 'anonymous') return null;

  let org: { id: string } | null;
  let user: { id: string } | null;
  try {
    org = await prisma.organization.findFirst({
      where: { slug: DEMO_ORG_SLUG, ...notDeleted },
      select: { id: true },
    });
    // The seed's Owner. Any user in the tenant will do; what matters is that the
    // id is one the database will accept as an actor.
    user = org
      ? await prisma.user.findFirst({
          where: { tenantId: org.id, ...notDeleted },
          orderBy: { createdAt: 'asc' },
          select: { id: true },
        })
      : null;
  } catch {
    // No database, wrong credentials, migrations never run. Reported as what it
    // is rather than escaping as a 500 with a stack trace in the response.
    throw new StorageUnavailableError();
  }

  // No seeded tenant means the database is not set up. Returning null lets the
  // route answer honestly instead of inventing a tenant id and writing rows
  // that belong to nobody.
  if (!org) return null;

  // A tenant with no user is a half-seeded database: reads would work and every
  // write would fail on the actor column. Saying so points at `pnpm db:seed`
  // instead of leaving a 503 with no cause.
  if (!user) {
    throw new StorageUnavailableError(
      'The tenant has no users. Run `pnpm db:seed` to finish setting up the database.',
    );
  }

  const role: SystemRole = cookie && isSystemRole(cookie) ? cookie : 'Owner';
  return {
    userId: user.id,
    tenantId: org.id,
    roles: [role],
    permissions: [],
  };
}
