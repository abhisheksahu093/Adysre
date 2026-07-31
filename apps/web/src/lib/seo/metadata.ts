import type { Metadata } from 'next';
import { routing, type Locale } from '@/i18n/routing';
import { languageAlternates, localeUrl, siteOrigin } from './site';

/**
 * The metadata every indexable page shares: canonical, hreflang, Open Graph and
 * a Twitter card.
 *
 * One builder rather than four hand-written blocks per page, because these tags
 * only work when they agree with each other. A canonical that points at one URL
 * while `og:url` points at another is a contradiction a crawler resolves by
 * trusting neither.
 *
 * Pages call this from `generateMetadata` and may spread extra keys over the
 * result; nothing here is per-page except the title, description and path.
 */

/**
 * BCP 47 tags for Open Graph's `og:locale`, which wants an underscored
 * language_TERRITORY pair rather than the bare language code the routes use.
 *
 * Keyed by `Locale`, so adding a language to `routing.locales` fails the build
 * here until its territory is chosen, rather than silently emitting a locale
 * Facebook and LinkedIn ignore.
 */
const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ja: 'ja_JP',
  zh: 'zh_CN',
  hi: 'hi_IN',
};

/**
 * The brand name, as it appears in `og:site_name` and the JSON-LD graph.
 *
 * Not a translated string: an organisation's name is the same in every locale,
 * and search engines reconcile a brand across languages by matching it exactly.
 */
export const SITE_NAME = 'ADYSRE';

export interface PageSeoInput {
  /** The active locale; drives `og:locale` and which alternate is canonical. */
  locale: Locale;
  /** Route WITHOUT a locale prefix, e.g. `/pricing`. Defaults to the home page. */
  path?: string;
  title: string;
  description: string;
}

/**
 * Canonical + alternates + Open Graph + Twitter for one page.
 *
 * The canonical is the CURRENT locale's URL, not the default locale's. Locales
 * are alternates of one another, not duplicates: telling Google that `/ja` is a
 * copy of `/` would drop the Japanese page from the index entirely.
 *
 * `og:image` is deliberately absent. It comes from the `opengraph-image` file
 * convention, which Next resolves per route segment and hashes for cache
 * busting; setting it here by hand would override that with a URL nothing keeps
 * up to date.
 */
export function pageMetadata({ locale, path = '/', title, description }: PageSeoInput): Metadata {
  const url = localeUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      // Every other locale this page exists in, so a crawler that lands on one
      // knows the set rather than treating each as an unrelated page.
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
    },
    twitter: {
      // The large card is the only one worth having for a product page; the
      // default `summary` renders a thumbnail most people scroll past.
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

/**
 * Crawling and snippet rules, applied once at the root.
 *
 * `max-image-preview: large` is the one that visibly changes results: without
 * it Google shows a thumbnail instead of a full-width image on Discover and
 * mobile search. The `-1` values remove Google's default caps on snippet length
 * and video preview length.
 */
export const ROBOTS_METADATA: NonNullable<Metadata['robots']> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

/** Absolute base for relative metadata URLs, required for `alternates` to resolve. */
export function metadataBaseUrl(): URL {
  return new URL(siteOrigin());
}
