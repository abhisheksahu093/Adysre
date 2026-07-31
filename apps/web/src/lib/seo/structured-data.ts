import { routing, type Locale } from '@/i18n/routing';
import { PRICING_PLANS } from '@/data/pricing';
import { SUPPORT_EMAIL } from '@/config/site';
import { SITE_NAME } from './metadata';
import { localeUrl, siteOrigin } from './site';

/**
 * schema.org descriptions of what this site is, emitted as JSON-LD.
 *
 * ─── The one rule ───────────────────────────────────────────────────────────
 * Structured data must describe what the page actually SHOWS. Google treats a
 * mismatch as spam and can demote the whole domain for it, so every value here
 * is derived from the same source the page renders from: prices come from
 * `PRICING_PLANS`, FAQ text comes from the catalogue the FAQ section reads, the
 * locale list comes from `routing`. Nothing is restated by hand, which is what
 * keeps the two from drifting apart on the next copy change.
 *
 * The nodes are linked by `@id` into one graph rather than emitted as four
 * unrelated blocks, so a crawler understands that the same organisation
 * publishes the site and makes the application.
 */

/** JSON-LD is plain JSON; this models it without reaching for `any`. */
export type JsonLdValue = string | number | boolean | null | JsonLdValue[] | JsonLdObject;
export interface JsonLdObject {
  [key: string]: JsonLdValue | undefined;
}

/** Stable node identifiers, so nodes can reference each other across blocks. */
function ids() {
  const origin = siteOrigin();
  return {
    organisation: `${origin}/#organization`,
    website: `${origin}/#website`,
    application: `${origin}/#application`,
  };
}

/** Who publishes this site. */
function organisationNode(): JsonLdObject {
  const origin = siteOrigin();
  return {
    '@type': 'Organization',
    '@id': ids().organisation,
    name: SITE_NAME,
    url: `${origin}/`,
    // Absolute, because a crawler fetching the logo has no page to resolve
    // against. This is the same file the header wordmark renders.
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/logo/adysre.svg`,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SUPPORT_EMAIL,
      availableLanguage: [...routing.locales],
    },
  };
}

/** The site itself, in the locale being served. */
function websiteNode(locale: Locale, description: string): JsonLdObject {
  return {
    '@type': 'WebSite',
    '@id': ids().website,
    name: SITE_NAME,
    url: localeUrl(locale, '/'),
    description,
    inLanguage: locale,
    publisher: { '@id': ids().organisation },
  };
}

/**
 * The product, priced from the live plan data.
 *
 * An `AggregateOffer` rather than one `Offer` per plan: the plans are tiers of a
 * single product, and the range is what a search result can usefully show. The
 * bounds are computed from `PRICING_PLANS`, so a price change on the pricing
 * page changes this too.
 */
function applicationNode(locale: Locale, description: string): JsonLdObject {
  const prices = PRICING_PLANS.map((plan) => plan.price);

  return {
    '@type': 'SoftwareApplication',
    '@id': ids().application,
    name: SITE_NAME,
    url: localeUrl(locale, '/'),
    description,
    // Browser-based, so there is no OS requirement to declare beyond the web.
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    publisher: { '@id': ids().organisation },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: prices.length,
    },
  };
}

/** One question and its answer, already translated. */
export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * The FAQ, mirroring the `<details>` list the landing page renders.
 *
 * Takes already-translated strings rather than reaching for the catalogue
 * itself: this module stays synchronous and free of request context, and the
 * caller is the component that already resolved those exact strings for the
 * markup, which is what guarantees the two agree.
 */
function faqNode(entries: readonly FaqEntry[]): JsonLdObject {
  return {
    '@type': 'FAQPage',
    mainEntity: entries.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

export interface HomeGraphInput {
  locale: Locale;
  /** The page's meta description, reused so the graph cannot contradict it. */
  description: string;
  faq: readonly FaqEntry[];
}

/** The complete graph for the landing page. */
export function homePageGraph({ locale, description, faq }: HomeGraphInput): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organisationNode(),
      websiteNode(locale, description),
      applicationNode(locale, description),
      faqNode(faq),
    ],
  };
}
