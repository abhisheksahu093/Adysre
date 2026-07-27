import 'server-only';
import { cookies } from 'next/headers';
import {
  ACCESS_COOKIE,
  DEV_SESSION_COOKIE,
  PUBLIC_DEMO_COOKIE,
  UNMINTED_SANDBOX,
  isSandboxId,
  publicDemoSession,
  verifyAccessToken,
  resolveDevSession,
  canWrite,
  type IntelSession,
} from './policy';

export { canWrite };
export type { IntelSession };

/**
 * Server-side session resolution for the Website Intelligence endpoints.
 *
 * ─── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * The scan/schedule/notification endpoints were built ungated. This is the
 * trust boundary that gates them. It deliberately does NOT rebuild the
 * platform's auth (that lives in `apps/api`, AUTHENTICATION_RBAC.md) - it
 * *consumes* it: the API sets an HTTP-only `access_token` JWT on login, and we
 * verify that same token here with the shared `JWT_ACCESS_SECRET`. Roles ride
 * in the token, so the decision needs no round trip to the API - the API need
 * not even be running.
 *
 * All the policy (verification, role rules, the dev fallback) is pure and lives
 * in `./policy`; this module only reads cookies and env and hands off.
 */

/**
 * Resolve the current session, or `null` when the caller is unauthenticated.
 *
 * Production: the ONLY path is a verified `access_token`. No token, no secret,
 * or a bad/expired token → `null`. Defaulting closed means a bug denies access
 * rather than handing the endpoints to anyone.
 *
 * Development: the API often is not running, so a strict gate would make the
 * local Website Intelligence page and endpoints unusable. A real verified token
 * still wins, but absent one we fall back to a demo Owner so the app stays
 * usable. The `adysre_intel_dev` cookie tunes it (`<role>@<tenant>`): a role name
 * tests that role, `@<tenant>` simulates a second org, `anonymous` exercises the
 * denied path. `WEBSITE_INTEL_STRICT_AUTH=true` disables the fallback entirely
 * (to rehearse production behaviour locally / CI).
 *
 * Production, no token: a public demo sandbox rather than a locked door. The web
 * app cannot sign anybody in until `apps/api` is deployed beside it, so a strict
 * gate there did not protect the module - it made it unreachable, and every
 * visitor who clicked Website Intelligence landed on a login form that cannot
 * succeed. Each anonymous visitor instead gets their OWN tenant (see
 * {@link publicDemoSession}), so the demo works end to end and nobody can read
 * or delete anybody else's records. Set `WEBSITE_INTEL_STRICT_AUTH=true` to
 * restore the locked door the moment real sign-in is live.
 *
 * ─── REMOVE WHEN AUTH LANDS ─────────────────────────────────────────────────
 * When platform auth is wired end-to-end in the web app, delete the dev
 * fallback and the public demo below; the verified-JWT path is the permanent one.
 */
export async function getSession(): Promise<IntelSession | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  const secret = process.env.JWT_ACCESS_SECRET;
  const isProd = process.env.NODE_ENV === 'production';

  if (token) {
    if (secret) {
      // A present-but-invalid token is an explicit "no"; never fall through to
      // a demo session, or an attacker could downgrade by sending garbage.
      return verifyAccessToken(token, secret);
    }
    if (isProd) {
      // A configured secret is the whole trust model; its absence in production
      // is a deployment fault that must fail loudly, not wave requests through.
      throw new Error(
        'JWT_ACCESS_SECRET is not set; cannot verify Website Intelligence sessions.',
      );
    }
  }

  // The one switch that still denies everything unauthenticated.
  if (process.env.WEBSITE_INTEL_STRICT_AUTH === 'true') return null;

  if (isProd) return publicDemoSandbox(store);

  return resolveDevSession(store.get(DEV_SESSION_COOKIE)?.value);
}

/** A visitor keeps their sandbox for a week, then starts fresh. */
const SANDBOX_TTL_SECONDS = 60 * 60 * 24 * 7;

/**
 * The anonymous visitor's own sandbox, minted on first use.
 *
 * Route Handlers may set cookies and Server Components may not, so the write is
 * attempted and its refusal is expected rather than exceptional: a page render
 * needs no tenant of its own, and the first API call the page makes mints the
 * real one. Minting here rather than in middleware keeps the whole demo inside
 * this module (Rule 2) - nothing global changes to support it.
 */
function publicDemoSandbox(store: Awaited<ReturnType<typeof cookies>>): IntelSession {
  const existing = store.get(PUBLIC_DEMO_COOKIE)?.value;
  if (isSandboxId(existing)) return publicDemoSession(existing);

  const minted = crypto.randomUUID().replaceAll('-', '');
  try {
    store.set(PUBLIC_DEMO_COOKIE, minted, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: SANDBOX_TTL_SECONDS,
    });
    return publicDemoSession(minted);
  } catch {
    return publicDemoSession(UNMINTED_SANDBOX);
  }
}
