/**
 * The template projection the landing page is allowed to show.
 *
 * ─── Why a projection and not `TEMPLATES` ───────────────────────────────────
 * A `TemplateEntry` carries the clone prompt and the download formats — the two
 * things a paid tier buys. Anything a Server Component reads into a marketing
 * page ends up in the RSC payload and is readable from devtools whatever the UI
 * renders, so the landing page takes only what it draws: a slug to preview, a
 * name, a theme label and two badges. Previewing is open to everyone by design
 * (see `toSummary`), the prompt is not.
 *
 * Counts and ordering derive from the registry, so shipping a template updates
 * the landing page with no edit here.
 */

import { TEMPLATES, isNewTemplate } from '@/data/templates';

export interface LandingTemplate {
  slug: string;
  name: string;
  /** Key under `landing.templates.themes.<key>`. */
  themeKey: string;
  /** Drives the "New" badge. */
  isNew: boolean;
  /** Drives the multi-page badge. */
  pageCount: number;
}

/** Every template that exists — the figure quoted in the heading and the CTA. */
export const TEMPLATE_COUNT = TEMPLATES.length;

/**
 * How many tiles the showcase renders. Each is a live iframe, so this is a real
 * cost: six fills two rows of three on a desktop and stays honest about the rest
 * being one click away.
 */
const SHOWCASE_LIMIT = 6;

/**
 * Newest first — a returning visitor should see what changed, and the "New"
 * badge is meaningless if the newest template is on the second row.
 */
export const LANDING_TEMPLATES: LandingTemplate[] = [...TEMPLATES]
  .sort((a, b) => b.addedOn.localeCompare(a.addedOn) || a.name.localeCompare(b.name))
  .slice(0, SHOWCASE_LIMIT)
  .map((template) => ({
    slug: template.slug,
    name: template.name,
    themeKey: template.themeKey,
    isNew: isNewTemplate(template, new Date()),
    pageCount: template.pages?.length ?? 0,
  }));
