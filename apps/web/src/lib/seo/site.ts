import { routing, type Locale } from '@/i18n/routing';

/**
 * Absolute URL construction for everything search engines and social crawlers
 * read: canonicals, hreflang alternates, Open Graph, the sitemap and JSON-LD.
 *
 * Crawlers do not resolve relative URLs the way a browser does. Google ignores
 * a relative `hreflang` outright, and a relative `og:image` is simply dropped by
 * most scrapers, so a four-locale site with relative links gets no cross-language
 * signal at all and no social preview. Every helper here returns an absolute URL
 * for that reason.
 *
 * The origin comes from `NEXT_PUBLIC_APP_URL`, the same variable the OAuth
 * callbacks, the email links and the request-origin check already use, so there
 * is exactly one place that knows where this deployment lives. It MUST match the
 * hostname visitors actually land on, `www` included: a canonical that points at
 * a URL which redirects tells Google the page it just crawled is not the real
 * one, which is worse than declaring no canonical at all.
 */

/** Only used when nothing is configured, i.e. a bare local checkout. */
const FALLBACK_ORIGIN = 'http://localhost:3000';

/** The deployment's public origin, with no trailing slash. */
export function siteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (configured && configured.length > 0 ? configured : FALLBACK_ORIGIN).replace(/\/+$/, '');
}

/** Normalises a route to a leading slash and no trailing slash (root stays `/`). */
function normalisePath(path: string): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  const trimmed = withSlash.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/**
 * The path a route is served from in a given locale.
 *
 * Mirrors `localePrefix: 'as-needed'` from the routing config: the default
 * locale keeps clean URLs (`/pricing`) and every other locale is prefixed
 * (`/ja/pricing`). Derived from `routing` rather than restated, so adding a
 * language cannot leave the sitemap and the alternates behind.
 */
export function localePath(locale: Locale, path = '/'): string {
  const normalised = normalisePath(path);
  if (locale === routing.defaultLocale) return normalised;
  return normalised === '/' ? `/${locale}` : `/${locale}${normalised}`;
}

/**
 * Absolute URL for a route in a given locale.
 *
 * The home page comes out as `https://host` with NO trailing slash, which looks
 * wrong and is deliberate: Next's own metadata renderer normalises trailing
 * slashes away (the site runs with `trailingSlash: false`), so a canonical
 * built any other way would render as one string in the `<link>` tag and a
 * different one in the sitemap and the Link header. The two forms resolve to
 * the same document, but a crawler comparing strings should never have to
 * reconcile them.
 */
export function localeUrl(locale: Locale, path = '/'): string {
  const routePath = localePath(locale, path);
  return `${siteOrigin()}${routePath === '/' ? '' : routePath}`;
}

/**
 * The `hreflang` map for one route, every locale plus `x-default`.
 *
 * `x-default` points at the default locale, which is the URL a visitor with an
 * unmatched language should be sent to. Without it Google picks one itself, and
 * it does not always pick English.
 */
export function languageAlternates(path = '/'): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const locale of routing.locales) alternates[locale] = localeUrl(locale, path);
  alternates['x-default'] = localeUrl(routing.defaultLocale, path);
  return alternates;
}
