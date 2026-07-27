import 'server-only';
import type { NextResponse } from 'next/server';
import { UNAUTHENTICATED } from '@/lib/api/response';
import { ACCESS_COOKIE, verifyAccessToken, type PlatformSession } from './access-token';
import { accessTokenSecret, isProduction } from './config';
import { readAccessCookie } from './cookies';

/**
 * "Who is this" for route handlers, resolved from the access token alone.
 *
 * No database round trip: the token is signed, so verifying the signature and
 * expiry is enough to trust its claims. That is the whole reason roles and
 * permissions ride inside it.
 *
 * This is the platform-wide guard. The API Studio module has its own
 * (`lib/api-studio/guard.ts`) that adds a permission check and a development
 * fallback; both verify the same cookie with the same secret, so a session
 * issued here works there.
 */

type Authenticated = { ok: true; session: PlatformSession };
type Denied = { ok: false; response: NextResponse };

/** The verified session, or null when there is no usable credential. */
export async function getAuthSession(): Promise<PlatformSession | null> {
  const token = await readAccessCookie();
  if (!token) return null;

  let secret: string;
  try {
    secret = accessTokenSecret();
  } catch (error) {
    // A missing or placeholder secret is the entire trust model absent. In
    // production that must be loud rather than a silent stream of 401s that
    // looks like a login bug.
    if (isProduction()) throw error;
    console.error(
      `[auth] ${error instanceof Error ? error.message : String(error)} Sessions cannot be verified.`,
    );
    return null;
  }

  return verifyAccessToken(token, secret);
}

/**
 * Require a session, or produce the 401 to return.
 *
 * Used as the first line of every authenticated handler:
 *
 *   const auth = await requireAuth();
 *   if (!auth.ok) return auth.response;
 *   // auth.session is a verified principal from here on
 */
export async function requireAuth(): Promise<Authenticated | Denied> {
  const session = await getAuthSession();
  if (!session) return { ok: false, response: UNAUTHENTICATED() };
  return { ok: true, session };
}

/** The access cookie name, re-exported so handlers need one import. */
export { ACCESS_COOKIE };
