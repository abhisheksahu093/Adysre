import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Resolves the active locale for every page request (URL prefix → cookie →
 * Accept-Language → default) and rewrites to the matching /[locale] route.
 *
 * NOTE: this app still has no auth route protection. When that lands it must
 * compose with this middleware rather than replace it - Next.js runs a single
 * middleware, so a second `export default` here would silently disable i18n.
 */
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next internals and anything with a file extension
  // (/prompts/categories/portrait.svg must not be locale-rewritten).
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
