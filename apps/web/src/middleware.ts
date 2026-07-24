import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Resolves the active locale for every page request (URL prefix → cookie →
 * Accept-Language → default) and rewrites to the matching /[locale] route.
 *
 * NOTE: auth is enforced per-route/per-page, not here (Website Intelligence
 * gates its endpoints via `lib/website-intel/auth` and its pages via a session
 * redirect). If app-wide auth ever moves into middleware it must COMPOSE with
 * this i18n middleware rather than replace it - Next.js runs a single
 * middleware, so a second `export default` here would silently disable i18n.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, the public dynamic-QR redirect (/q/<slug> must resolve
  // without a locale prefix), Next internals and anything with a file extension
  // (/logo/adysre.svg must not be locale-rewritten).
  matcher: '/((?!api|q/|_next|_vercel|.*\\..*).*)',
};
