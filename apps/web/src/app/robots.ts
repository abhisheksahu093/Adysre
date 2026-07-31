import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo/site';

/**
 * `/robots.txt`.
 *
 * Sits at the app root, outside `[locale]`, because robots.txt is per-ORIGIN:
 * a crawler fetches exactly one, at the root, and would never look for
 * `/ja/robots.txt`. The proxy already skips any path containing a dot, so this
 * is not locale-rewritten.
 *
 * ─── What is disallowed and why ─────────────────────────────────────────────
 * Only routes that waste crawl budget or would rank as thin duplicates:
 *
 *   /api/               Not documents. A crawled endpoint is a wasted request
 *                       at best and an audit-log entry at worst.
 *   /preview/, /template-preview/
 *                       Chrome-less renders of sections and templates, framed
 *                       by the gallery pages. Indexed on their own they are
 *                       near-duplicates of the page that embeds them.
 *   /website-intelligence-report/
 *                       One report per scanned URL, owned by the tenant that
 *                       ran it. Not ours to publish.
 *   /q/                 The dynamic QR redirect. It exists to bounce, so an
 *                       index entry for it is always a dead end.
 *
 * Auth pages are NOT disallowed: sign-in and register are legitimate landing
 * points people search for by name. They carry no content worth ranking, which
 * is a `noindex` decision on the page, not a crawl decision here.
 *
 * Disallow is not access control. Anything that must not be read needs the
 * permission check it already has; this only shapes what crawlers spend time on.
 */
export default function robots(): MetadataRoute.Robots {
  const origin = siteOrigin();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/preview/', '/template-preview/', '/website-intelligence-report/', '/q/'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    // Declares which hostname is the real one, for the crawlers that still read
    // it. The canonical tags are what actually settle it.
    host: origin,
  };
}
