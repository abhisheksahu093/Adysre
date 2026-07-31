/**
 * A readable flag saying whether a session cookie exists. NOT a credential.
 *
 * ─── The problem it solves ──────────────────────────────────────────────────
 * The home page is statically prerendered, so it cannot read cookies while
 * rendering: calling `cookies()` would opt the page out of static rendering and
 * cost every visitor a server render. The account chrome in the header
 * therefore has to ask the browser who is signed in, which meant that EVERY
 * anonymous visitor paid, on the critical path:
 *
 *   GET  /api/auth/me       401   ← there is no session
 *   POST /api/auth/refresh  401   ← ...so `authFetch` tried to recover one
 *
 * Two round trips and two red errors in the console, on a marketing page whose
 * visitors are overwhelmingly signed out. Lighthouse reports both under
 * "Browser errors were logged to the console", and the browser logs a failed
 * request whether or not the JavaScript handles it.
 *
 * ─── Why a hint rather than the session itself ──────────────────────────────
 * The real cookies are HTTP-only and must stay that way: that is precisely what
 * stops an XSS payload from stealing a session. This carries no token, no
 * identity and no claim - one bit, meaning "it is worth asking". The answer
 * still comes from the server, which still checks the real cookie.
 *
 * So it must never be treated as proof of anything. Someone can set it in a
 * console; all that buys them is a request that answers 401, exactly as it does
 * today. Authorisation is decided server-side, every time, unchanged.
 *
 * ─── Why the proxy writes it ────────────────────────────────────────────────
 * Set from the proxy on every page response, from the presence of the real
 * refresh cookie, which makes it self-healing: a visitor who signed in before
 * this existed gets the hint on their very next page load, so nobody is shown
 * as signed out while their session is still valid. Writing it only at sign-in
 * would have left every existing session looking anonymous until it expired.
 *
 * Deliberately free of imports so the edge-runtime proxy can take it without
 * dragging anything along.
 */

/** Name of the flag. Prefixed like the app's other first-party cookies. */
export const SESSION_HINT_COOKIE = 'adysre_session';

/** The only value it ever holds. The name carries the meaning. */
export const SESSION_HINT_VALUE = '1';

/**
 * Flags for the hint.
 *
 * `httpOnly` is deliberately FALSE, and it is the only cookie in the app of
 * which that is true: a flag the browser cannot read is a flag that cannot do
 * its job. Everything else matches the auth cookies, including `secure` being
 * conditional so the flag still works on a plain-http localhost.
 *
 * No `maxAge`: a session cookie, cleared when the browser closes, and rewritten
 * from the real cookie on the next page load anyway.
 */
export function sessionHintOptions(secure: boolean) {
  return {
    name: SESSION_HINT_COOKIE,
    sameSite: 'lax' as const,
    secure,
    path: '/',
    httpOnly: false,
  };
}

/**
 * Whether this browser is likely to have a session, read from `document`.
 *
 * "Likely" is the whole contract. A true answer means asking the server is
 * worthwhile; it never means the caller may show anything privileged.
 */
export function hasSessionHint(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((entry) => entry.trim().startsWith(`${SESSION_HINT_COOKIE}=${SESSION_HINT_VALUE}`));
}
