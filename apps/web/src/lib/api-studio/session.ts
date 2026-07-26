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
 * The dev stand-in session. Reads the seeded tenant's real id, because rows
 * written under it carry a foreign key onto `organizations`.
 *
 * Cookie grammar: `<role>`, or `anonymous` to exercise the denied path.
 * An unrecognised role falls back to Owner, never to a silent deny.
 */
async function resolveDevSession(cookie: string | undefined): Promise<PlatformSession | null> {
  if (cookie === 'anonymous') return null;

  const org = await prisma.organization.findFirst({
    where: { slug: DEMO_ORG_SLUG, ...notDeleted },
    select: { id: true },
  });
  // No seeded tenant means the database is not set up. Returning null lets the
  // route answer honestly instead of inventing a tenant id and writing rows
  // that belong to nobody.
  if (!org) return null;

  const role: SystemRole = cookie && isSystemRole(cookie) ? cookie : 'Owner';
  return {
    userId: `demo-user-${org.id}`,
    tenantId: org.id,
    roles: [role],
    permissions: [],
  };
}
