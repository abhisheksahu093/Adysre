import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Resolves the active locale for every page request (URL prefix → cookie →
 * Accept-Language → default) and rewrites to the matching /[locale] route.
 *
 * This is what Next.js 16 calls a PROXY. It was `middleware.ts` until that
 * convention was deprecated; only the filename changed. The contract (request
 * in, response or rewrite out), the matcher below and next-intl's handler are
 * untouched, which is why the handler is still `createMiddleware` - that is the
 * library's export name, not the file convention.
 *
 * NOTE: auth is enforced per-route/per-page, not here (Website Intelligence
 * gates its endpoints via `lib/website-intel/auth` and its pages via a session
 * redirect). If app-wide auth ever moves in here it must COMPOSE with this i18n
 * handler rather than replace it - Next.js runs a single proxy, so a second
 * `export default` here would silently disable i18n.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, the public dynamic-QR redirect (/q/<slug> must resolve
  // without a locale prefix), Next internals and anything with a file extension
  // (/logo/adysre.svg must not be locale-rewritten).
  //
  // `api/` carries its trailing slash for the same reason `q/` does: without it
  // the exclusion is a PREFIX match, and any page whose path merely starts with
  // those letters (/api-studio) is skipped by the locale rewrite and 404s. The
  // route handlers this means to skip all live under `/api/`, so the slash
  // costs nothing and stops the next such page from being a mystery.
  matcher: '/((?!api/|q/|_next|_vercel|.*\\..*).*)',
};
