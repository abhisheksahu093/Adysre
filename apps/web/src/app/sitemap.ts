import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { LANDING_LINKS } from '@/data/landing';
import { COMPONENTS } from '@/data/components';
import { TEMPLATES } from '@/data/templates';
import { hasTemplateRenderer } from '@/components/templates/registry';
import { languageAlternates, localeUrl } from '@/lib/seo/site';

/**
 * `/sitemap.xml`.
 *
 * At the app root rather than under `[locale]`, because a sitemap covers a whole
 * origin. Every route is listed ONCE, at its default-locale URL, with the other
 * three attached as `xhtml:link` alternates. Listing each locale as its own top
 * level entry would be four times the file describing the same pages, and
 * Google would still need the alternates to tell they are translations.
 *
 * ─── Where the routes come from ─────────────────────────────────────────────
 * Nothing here is a hand-written list of paths. The marketing and library
 * routes are the values of `LANDING_LINKS`, which the header, the feature cards
 * and the footer already link from; the detail pages come from the same
 * registries that `generateStaticParams` builds them from. A page that stops
 * existing therefore leaves the sitemap on its own, and a page that is added
 * arrives in it without anyone remembering to.
 *
 * ─── Why there is no `lastModified` ─────────────────────────────────────────
 * We have no real per-page modification date. Stamping build time on every URL
 * tells Google the entire site changed at once, every deploy, which is the
 * fastest way to teach a crawler that the field is noise and to stop reading it.
 * Better to say nothing than to say something false.
 */

/**
 * Every static public route, deduped.
 *
 * `LANDING_LINKS` is exactly the set of pages the marketing surface already
 * points at, which is the same set worth submitting: it carries no auth route
 * (a sign-in form has nothing to rank) and no internal preview route.
 * It does alias a few destinations, though - `app` and `customize` both resolve
 * to /components - so the Set does the deduping.
 */
function staticRoutes(): string[] {
  return [...new Set<string>(['/', ...Object.values(LANDING_LINKS)])];
}

/**
 * The component detail pages.
 *
 * The largest block by far and the reason this file is worth having: several
 * hundred pages of real content that nothing currently links to deeply enough
 * for a crawler to reach in a reasonable number of hops.
 */
function componentRoutes(): string[] {
  return COMPONENTS.map((component) => `${LANDING_LINKS.components}/${component.slug}`);
}

/**
 * The showcase sites at `/websites/<slug>`.
 *
 * Filtered by `hasTemplateRenderer` for the same reason the route's own
 * `generateStaticParams` filters by it: a template without a renderer 404s, and
 * a sitemap full of 404s is a trust problem, not a discovery one.
 */
function websiteRoutes(): string[] {
  return TEMPLATES.filter((template) => hasTemplateRenderer(template.slug)).map(
    (template) => `/websites/${template.slug}`,
  );
}

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...staticRoutes(), ...componentRoutes(), ...websiteRoutes()];

  return paths.map((path) => ({
    url: localeUrl(routing.defaultLocale, path),
    alternates: { languages: languageAlternates(path) },
  }));
}
