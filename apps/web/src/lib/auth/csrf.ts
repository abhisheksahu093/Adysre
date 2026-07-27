import 'server-only';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
import { isProduction } from './config';
import { safeCompareHex } from './tokens';
import { CSRF_COOKIE, CSRF_HEADER } from './csrf-shared';

/**
 * Double-submit CSRF tokens for the highest-value operations.
 *
 * ## Why this exists on top of SameSite=Lax
 *
 * `SameSite=Lax` already stops the browser attaching session cookies to a
 * cross-site POST, and `verifyOrigin` rejects a mismatched Origin header. That
 * is the bulk of the protection. This adds a third check for the handful of
 * operations where a successful forgery is unrecoverable: changing a password,
 * which locks the real owner out.
 *
 * It is not applied everywhere on purpose. A token on every endpoint becomes
 * ceremony that gets copy-pasted without thought, and ceremony nobody
 * understands is not security. Three checks on the operations that matter beats
 * one check nobody maintains on all of them.
 *
 * ## Why double-submit rather than a server-side token store
 *
 * The token is written to a readable cookie and must be echoed back in a
 * header. A cross-site attacker can cause the cookie to be SENT but cannot READ
 * it, so they cannot produce the matching header. That requires no server
 * state, which matters on serverless where there is nowhere cheap to keep it.
 *
 * The cookie is deliberately NOT HttpOnly: the browser's own JavaScript has to
 * read it to set the header. That is safe here because the token authorises
 * nothing on its own; it only proves the request came from a page on this
 * origin. An XSS that could read it could simply make the request directly.
 */

// Names live in a shared module so the browser half can import them without
// pulling in `server-only`. Re-exported here so server callers need one import.
export { CSRF_COOKIE, CSRF_HEADER } from './csrf-shared';

/**
 * Issue a CSRF token, reusing the existing one when there is one.
 *
 * Rotating it on every page load would break any tab opened before the newest
 * one, which users experience as a form that fails once and works after a
 * refresh: the most confusing possible symptom.
 */
export async function ensureCsrfToken(): Promise<string> {
  const store = await cookies();
  const existing = store.get(CSRF_COOKIE)?.value;
  if (existing && existing.length === 64) return existing;

  const token = randomBytes(32).toString('hex');
  store.set(CSRF_COOKIE, token, {
    // Readable by JavaScript, unlike the session cookies.
    httpOnly: false,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
  });
  return token;
}

/**
 * Whether a request carries a valid CSRF token.
 *
 * Compared in constant time. The comparison is not the likely attack here, but
 * a `!==` on a secret is the kind of thing that gets copied into a place where
 * it does matter.
 */
export async function verifyCsrf(request: Request): Promise<boolean> {
  const store = await cookies();
  const cookieToken = store.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  // Absent on either side is a failure, not a pass. A missing token must never
  // mean "skip the check", or the check is optional to anyone who omits it.
  if (!cookieToken || !headerToken) return false;

  return safeCompareHex(cookieToken, headerToken);
}
