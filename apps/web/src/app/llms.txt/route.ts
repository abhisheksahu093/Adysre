import { routing } from '@/i18n/routing';
import { siteOrigin } from '@/lib/seo/site';
import { SITE_NAME } from '@/lib/seo/metadata';
import { LANDING_LINKS } from '@/data/landing';
import {
  COMPONENT_COUNT,
  GRADIENT_COUNT,
  ICON_COUNT,
  PALETTE_COUNT,
  PATTERN_COUNT,
  TEXTURE_COUNT,
} from '@/data/library-stats';

/**
 * `/llms.txt` - what this site is, for a language model reading it.
 *
 * The convention (llmstxt.org) is a Markdown file at the origin root: one H1
 * naming the site, a blockquote summarising it, then sections of links with a
 * sentence each. It is the robots.txt of retrieval - a crawler that renders no
 * JavaScript and follows no menus still gets an accurate map of what is here
 * and what each part is for.
 *
 * Sits at the app root outside `[locale]`, for the same reason robots.txt does:
 * it is fetched once, per origin, at a fixed path. The proxy skips any path
 * containing a dot, so this is never locale-rewritten.
 *
 * Every figure and every path is read from the catalogues and the link map that
 * the pages themselves render from, so this file cannot drift into describing a
 * library that no longer exists. Nothing here is typed twice.
 */

/** One entry in a section: an absolute URL, its name, and why it exists. */
interface Entry {
  path: string;
  name: string;
  note: string;
}

function section(origin: string, title: string, entries: Entry[]): string {
  const lines = entries.map(({ path, name, note }) => `- [${name}](${origin}${path}): ${note}`);
  return `## ${title}\n\n${lines.join('\n')}`;
}

export function GET(): Response {
  const origin = siteOrigin();
  const locales = routing.locales.join(', ');

  const body = [
    `# ${SITE_NAME}`,
    '',
    `> ${SITE_NAME} is an AI-first business operating system: a multi-tenant platform` +
      ' that hosts business modules on one shared core (authentication, roles and' +
      ' permissions, organisations, files, audit and AI), alongside a design library of' +
      ` ${COMPONENT_COUNT}+ components, ${ICON_COUNT}+ icons and ${PALETTE_COUNT}+ palettes` +
      ' that is also published to npm as the `adysre` package.',
    '',
    `Content is served in ${routing.locales.length} languages (${locales}); the default` +
      ' locale is served unprefixed and every other locale under its own path prefix.' +
      ' Each page declares its canonical URL and its alternates, so prefer the canonical.',
    '',
    section(origin, 'The library', [
      {
        path: LANDING_LINKS.components,
        name: 'Components',
        note: `${COMPONENT_COUNT}+ React and Tailwind components, each with source you can copy.`,
      },
      {
        path: LANDING_LINKS.icons,
        name: 'Icons',
        note: `${ICON_COUNT}+ open-source icons, searchable and copyable as JSX or SVG.`,
      },
      {
        path: LANDING_LINKS.palettes,
        name: 'Palettes',
        note: `${PALETTE_COUNT}+ colour palettes with accessible pairings.`,
      },
      {
        path: LANDING_LINKS.gradients,
        name: 'Gradients',
        note: `${GRADIENT_COUNT}+ CSS gradients, copyable as classes or plain CSS.`,
      },
      {
        path: LANDING_LINKS.patterns,
        name: 'Patterns',
        note: `${PATTERN_COUNT}+ tiling CSS background patterns.`,
      },
      {
        path: LANDING_LINKS.textures,
        name: 'Textures',
        note: `${TEXTURE_COUNT}+ CSS textures for surfaces and backgrounds.`,
      },
      {
        path: LANDING_LINKS.templates,
        name: 'Templates',
        note: 'Full page templates assembled from the component library.',
      },
    ]),
    '',
    section(origin, 'Tools and modules', [
      {
        path: LANDING_LINKS.designPlayground,
        name: 'Design Playground',
        note: 'A visual editor for composing pages from library blocks.',
      },
      {
        path: LANDING_LINKS.codeStudio,
        name: 'Code Studio',
        note: 'A browser IDE for editing and previewing a project.',
      },
      {
        path: LANDING_LINKS.apiStudio,
        name: 'API Studio',
        note: 'A self-hosted HTTP client for building and running requests.',
      },
      {
        path: LANDING_LINKS.rules,
        name: 'Business Rules',
        note: 'A visual builder for business rules, executable across frameworks.',
      },
      {
        path: LANDING_LINKS.websiteIntelligence,
        name: 'Website Intelligence',
        note: 'Scans a URL for SEO, performance and accessibility findings.',
      },
      {
        path: LANDING_LINKS.aiTools,
        name: 'AI Tools',
        note: 'Local-only utilities: email signatures, SEO audit, ATS scanner, resume builder.',
      },
    ]),
    '',
    section(origin, 'About', [
      { path: LANDING_LINKS.pricing, name: 'Pricing', note: 'Plans and what each includes.' },
      { path: LANDING_LINKS.docs, name: 'Documentation', note: 'Guides for using the platform.' },
      { path: LANDING_LINKS.contact, name: 'Contact', note: 'How to reach the team.' },
    ]),
    '',
    section(origin, 'Legal', [
      { path: LANDING_LINKS.terms, name: 'Terms', note: 'Terms of service.' },
      { path: LANDING_LINKS.privacy, name: 'Privacy', note: 'Privacy policy and data handling.' },
      { path: LANDING_LINKS.dmca, name: 'DMCA', note: 'Copyright and takedown policy.' },
    ]),
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // Same caching posture as the sitemap: cheap to rebuild, safe to hold, and
      // revalidated often enough that a new module appears within the day.
      'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
