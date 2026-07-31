/**
 * The locale cookie's name and flags, in one place.
 *
 * ─── Why this is not just next-intl's default ───────────────────────────────
 * next-intl writes `NEXT_LOCALE` with `Path` and `SameSite` and nothing else,
 * which means it is sent over plain http on a site that is otherwise https-only
 * and is readable by any script on the page. Neither is dramatic for a value
 * that says "ja", but a `Set-Cookie` without `Secure` on a production response
 * is exactly what a scanner flags, and there is no reason to be the site that
 * has one.
 *
 * ─── Why `httpOnly` is applied in the proxy, not here ───────────────────────
 * next-intl's `localeCookie` option does not accept `httpOnly` at all: its type
 * is a `Pick` that leaves the flag out, because the library's own client-side
 * navigation writes this cookie with `document.cookie`. We removed that write
 * (the language switcher posts to `/api/locale` instead, and the proxy rewrites
 * the cookie on the way out), so nothing in the browser needs to read or write
 * it and the flag is safe to add. It has to be added where a real response
 * object exists, which is the proxy.
 *
 * Deliberately free of imports so both the proxy (edge runtime) and the route
 * handler (node runtime) can take it without dragging anything along.
 */

/** Must match what next-intl reads; it is the library's default name. */
export const LOCALE_COOKIE = 'NEXT_LOCALE';

/**
 * One year.
 *
 * A language preference is not a session: someone who picked Hindi last month
 * still wants Hindi, and a short-lived cookie means the site quietly reverts to
 * whatever `Accept-Language` says.
 */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * `Secure` is conditional for the same reason the auth cookies' is: on a plain
 * http localhost a secure cookie is never stored at all, so locale detection
 * would silently stop working in development only.
 */
export function isSecureContext(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Lax rather than Strict. Strict withholds the cookie on every cross-site
 * navigation, so someone arriving from a search result or a shared link would
 * land in the default locale despite having chosen another.
 */
const SAME_SITE = 'lax' as const;

/** The flags next-intl's own routing config is allowed to set. */
export const LOCALE_COOKIE_ROUTING_OPTIONS = {
  name: LOCALE_COOKIE,
  maxAge: LOCALE_COOKIE_MAX_AGE,
  sameSite: SAME_SITE,
  secure: isSecureContext(),
  path: '/',
} as const;

/** The complete set, `httpOnly` included, for callers that own the response. */
export function localeCookieOptions() {
  return {
    ...LOCALE_COOKIE_ROUTING_OPTIONS,
    /**
     * Nothing in the browser reads this cookie: the locale reaches React
     * through the URL and the server-resolved `locale` param, never through
     * `document.cookie`. So it can be closed off, and one more thing an XSS
     * could quietly rewrite stops being reachable.
     */
    httpOnly: true,
  };
}
