import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { LOCALE_COOKIE, isSecureContext, localeCookieOptions } from './i18n/locale-cookie';
import { canonicalLinkHeader } from './lib/seo/canonical-header';
import {
  SESSION_HINT_COOKIE,
  SESSION_HINT_VALUE,
  sessionHintOptions,
} from './lib/auth/session-hint';

/** Matches `lib/auth/cookies.ts`. Named here so the proxy imports no node code. */
const REFRESH_COOKIE = 'refresh_token';

/**
 * Resolves the active locale for every page request (URL prefix → cookie →
 * Accept-Language → default) and rewrites to the matching /[locale] route.
 *
 * This is what Next.js 16 calls a PROXY. It was `middleware.ts` until that
 * convention was deprecated; only the filename changed. The contract (request
 * in, response or rewrite out) and the matcher below are untouched.
 *
 * NOTE: auth is enforced per-route/per-page, not here (Website Intelligence
 * gates its endpoints via `lib/website-intel/auth` and its pages via a session
 * redirect). If app-wide auth ever moves in here it must COMPOSE with the i18n
 * handler rather than replace it - Next.js runs a single proxy, so a second
 * `export default` here would silently disable i18n.
 *
 * ─── Why this is no longer just `createMiddleware(routing)` ─────────────────
 * Two things have to happen to the response next-intl produces, and both need a
 * real response object, which only exists here:
 *
 *   1. The locale cookie gets `HttpOnly`, which next-intl's own config cannot
 *      set (see `i18n/locale-cookie.ts`).
 *   2. Every page gets a `rel="canonical"` Link header.
 *
 * Both are cheap header work on a response that has already been decided. The
 * locale routing itself is untouched.
 */
const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);

  /**
   * Re-set the locale cookie with `HttpOnly`.
   *
   * Only when next-intl actually wrote one: it skips the cookie when the value
   * has not changed, and setting it unconditionally here would put a
   * `Set-Cookie` on every response for no reason.
   */
  const locale = response.cookies.get(LOCALE_COOKIE)?.value;
  if (locale) response.cookies.set(LOCALE_COOKIE, locale, localeCookieOptions());

  /**
   * Keep the readable session hint in step with the real session cookie.
   *
   * Written from the HTTP-only refresh cookie, which only the server can see,
   * so the statically rendered pages can stop asking the server who is signed
   * in on behalf of visitors who plainly are not. See `lib/auth/session-hint`
   * for why this is safe and why it lives here; the short version is that it
   * carries one bit and authorises nothing.
   *
   * Written only when it disagrees with the truth, so the common case (an
   * anonymous visitor with no cookies at all, or a signed-in one who already
   * has the flag) adds no `Set-Cookie` to the response.
   */
  const signedIn = request.cookies.has(REFRESH_COOKIE);
  const hinted = request.cookies.get(SESSION_HINT_COOKIE)?.value === SESSION_HINT_VALUE;
  if (signedIn && !hinted) {
    response.cookies.set({ ...sessionHintOptions(isSecureContext()), value: SESSION_HINT_VALUE });
  } else if (!signedIn && hinted) {
    response.cookies.set({ ...sessionHintOptions(isSecureContext()), value: '', maxAge: 0 });
  }

  /**
   * Declare the canonical URL as an HTTP header.
   *
   * The `<link rel="canonical">` tag is the one crawlers and auditors look for,
   * and it can only be emitted by a page that knows its own path - which, in
   * the App Router, means each page writing its own `generateMetadata`. Reading
   * the path in a layout would mean calling `headers()`, and that opts EVERY
   * page out of static rendering, which is a far worse trade than the tag is
   * worth.
   *
   * The header form has neither problem. It is equally authoritative to Google,
   * and here it is derived from the request path, so every route has a correct
   * canonical from the day this ships, whether or not anyone has got round to
   * its metadata yet. Pages that do declare the tag simply agree with it.
   *
   * Appended, never assigned: next-intl has already put the hreflang alternates
   * in this same header, and overwriting them would trade one signal for
   * another.
   *
   * Skipped on a redirect: next-intl answers `/en/pricing` with a 307 to
   * `/pricing`, and a canonical on the hop would name a URL that is itself not
   * canonical. The response at the destination carries the right one.
   */
  if (response.status < 300 || response.status >= 400) {
    const canonical = canonicalLinkHeader(request.nextUrl.pathname, request.nextUrl.search);
    if (canonical) response.headers.append('Link', canonical);
  }

  return response;
}

export const config = {
  // Skip API routes, the public dynamic-QR redirect (/q/<slug> must resolve
  // without a locale prefix), Next internals and anything with a file extension
  // (/logo/adysre.svg must not be locale-rewritten, and neither /robots.txt nor
  // /sitemap.xml must be).
  //
  // `.*/opengraph-image` is skipped for a subtler reason. Next builds the
  // `og:image` URL from the route segment the image lives in, so it always
  // carries the locale: `/en/opengraph-image`. With `localePrefix: 'as-needed'`
  // the proxy would answer that with a 307 to the unprefixed path, which puts a
  // redirect in front of every social scrape. The scrapers follow it, but a
  // card that fails is a card nobody sees, and there is no reason to make them
  // ask twice. Skipped here, the prefixed URL is served directly.
  //
  // `api/` carries its trailing slash for the same reason `q/` does: without it
  // the exclusion is a PREFIX match, and any page whose path merely starts with
  // those letters (/api-studio) is skipped by the locale rewrite and 404s. The
  // route handlers this means to skip all live under `/api/`, so the slash
  // costs nothing and stops the next such page from being a mystery.
  matcher: '/((?!api/|q/|_next|_vercel|.*/opengraph-image|.*\\..*).*)',
};
