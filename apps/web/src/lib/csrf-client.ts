import { CSRF_HEADER } from './auth/csrf-shared';

/**
 * Browser side of the double-submit CSRF check.
 *
 * Reads the token from a cookie that is deliberately NOT HttpOnly, because the
 * page's own JavaScript has to echo it back in a header. That is safe: the
 * token authorises nothing by itself, it only proves the request came from a
 * page on this origin, and an XSS able to read it could simply make the request
 * directly.
 */

const CSRF_COOKIE = 'adysre_csrf';

function readCookie(name: string): string | null {
  // Anchored to a boundary so `adysre_csrf_other` cannot match `adysre_csrf`.
  const match = new RegExp(`(?:^|;\\s*)${name}=([^;]*)`).exec(document.cookie);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

/**
 * The current token, fetching one if the browser does not have it yet.
 *
 * A first-time visitor submitting a protected form has no cookie, so the naive
 * version fails once and works after a refresh, which is a maddening bug to
 * report. Fetching on demand makes that case work the first time.
 */
export async function csrfToken(): Promise<string | null> {
  const existing = readCookie(CSRF_COOKIE);
  if (existing) return existing;

  try {
    await fetch('/api/auth/csrf', { credentials: 'same-origin' });
  } catch {
    // Offline. Return null and let the request fail on its own terms rather
    // than throwing something unrelated from here.
    return null;
  }
  return readCookie(CSRF_COOKIE);
}

/** Headers for a state-changing request, CSRF token included when available. */
export async function csrfHeaders(): Promise<Record<string, string>> {
  const token = await csrfToken();
  return token ? { [CSRF_HEADER]: token } : {};
}
