/**
 * Components Platform schema - the contract every component entry conforms to.
 *
 * Mirrors the Prompt Library's approach for the same reason: everything
 * filterable is a `const` list, and the types derive from it. A typo in a
 * category or framework fails `pnpm typecheck` instead of silently producing an
 * entry no filter can reach - the failure mode that bites at 700 entries.
 *
 * ─── Two deliberate softenings of the spec ──────────────────────────────────
 * 1. `code` is a PARTIAL record over frameworks. The spec wants all six for
 *    every component (4,200 variants). Requiring them would mean nothing ships
 *    until all six exist; instead a component ships with what it has and the UI
 *    only offers the tabs that are present.
 * 2. Translatable text lives in `content/<locale>/`, not here - same split as
 *    the prompts. Metadata is defined once; a missing translation falls back to
 *    English per field rather than blocking the entry.
 */

export const COMPONENT_CATEGORIES = [
  { id: 'buttons', target: 30 },
  { id: 'cards', target: 40 },
  { id: 'hero', target: 40 },
  { id: 'navbar', target: 25 },
  { id: 'footer', target: 20 },
  { id: 'authentication', target: 15 },
  { id: 'forms', target: 35 },
  { id: 'pricing', target: 20 },
  { id: 'testimonials', target: 20 },
  { id: 'faq', target: 15 },
  { id: 'features', target: 30 },
  { id: 'dashboards', target: 20 },
  { id: 'tables', target: 20 },
  { id: 'tabs', target: 15 },
  { id: 'carousel', target: 15 },
  { id: 'modals', target: 20 },
  { id: 'loaders', target: 40 },
  { id: 'timeline', target: 15 },
  { id: 'calculators', target: 10 },
  { id: 'ecommerce', target: 30 },
  { id: 'ai', target: 30 },
  { id: 'landing', target: 80 },
  { id: 'marketing', target: 20 },
  { id: 'animation', target: 50 },
  { id: 'backgrounds', target: 40 },
  { id: 'charts', target: 25 },
  { id: 'services', target: 30 },
  { id: 'about', target: 15 },
  { id: 'popover', target: 20 },
  { id: 'notifications', target: 20 },
  { id: 'sidebars', target: 15 },
  { id: 'dropdowns', target: 20 },
  { id: 'fab', target: 10 },
  { id: 'alerts', target: 15 },
  { id: 'docks', target: 10 },
  { id: 'comparisons', target: 15 },
  { id: 'galleries', target: 20 },
  { id: 'pagination', target: 15 },
  { id: 'admin', target: 20 },
  { id: 'marquees', target: 15 },
  { id: 'maps', target: 15 },
  { id: 'steppers', target: 15 },
  { id: 'gradients', target: 20 },
  { id: 'avatars', target: 15 },
  { id: 'badges', target: 15 },
  { id: 'calendar', target: 15 },
  { id: 'cursors', target: 15 },
  { id: 'date-pickers', target: 15 },
  { id: 'time-pickers', target: 15 },
  { id: 'color-pickers', target: 15 },
  { id: 'file-trees', target: 15 },
  { id: 'file-uploads', target: 15 },
  { id: 'lists', target: 15 },
  { id: 'menus', target: 15 },
  { id: 'progress', target: 15 },
  { id: 'search-bars', target: 15 },
  { id: 'tags', target: 15 },
  { id: 'toggles', target: 15 },
  { id: 'tooltips', target: 15 },
  { id: 'tour', target: 15 },
  { id: 'cta', target: 15 },
  { id: 'sign-in', target: 15 },
  { id: 'sign-up', target: 15 },
  { id: 'stats', target: 15 },
  { id: 'team', target: 15 },
  { id: 'error-pages', target: 15 },
  { id: 'globes', target: 15 },
  { id: 'bento', target: 15 },
  { id: 'social', target: 15 },
  { id: 'contact', target: 15 },
  { id: 'cart', target: 15 },
  { id: 'checkout', target: 15 },
  { id: 'change-password', target: 15 },
  { id: 'reset-password', target: 15 },
  { id: 'blog', target: 15 },
  { id: 'images', target: 15 },
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number]['id'];

/**
 * Framework tabs, in display order.
 *
 * Note these are not six independent stacks: `html` is markup, `css` is the
 * unstyled-markup companion, `tailwind` restyles the same markup, and
 * react/nextjs/typescript overlap heavily. They're modelled as one flat axis
 * because that's what the spec's tab strip calls for.
 */
export const FRAMEWORKS = [
  { id: 'html', label: 'HTML', lang: 'html', ext: 'html' },
  { id: 'css', label: 'CSS', lang: 'css', ext: 'css' },
  { id: 'tailwind', label: 'Tailwind CSS', lang: 'html', ext: 'html' },
  { id: 'react', label: 'React', lang: 'jsx', ext: 'jsx' },
  { id: 'nextjs', label: 'Next.js', lang: 'tsx', ext: 'tsx' },
  { id: 'typescript', label: 'TypeScript', lang: 'tsx', ext: 'tsx' },
] as const;

export type Framework = (typeof FRAMEWORKS)[number]['id'];

export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Sort orders offered by the index page. */
export const SORT_ORDERS = [
  'newest',
  'popular',
  'downloads',
  'trending',
  'updated',
  'copied',
  'alphabetical',
] as const;
export type SortOrder = (typeof SORT_ORDERS)[number];

/** A package a component needs, with its install command derived per manager. */
export interface Dependency {
  /** npm package name, e.g. 'framer-motion'. */
  name: string;
  /** Semver range as it should appear in package.json. */
  version: string;
  /** Links to the package page; defaults to npm. */
  url?: string;
}

export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  /** Key under `components.props.<key>` - descriptions are translated. */
  descriptionKey: string;
  example?: string;
}

export interface ComponentVariant {
  id: string;
  /** Key under `components.variants.<key>`. */
  labelKey: string;
}

export interface ComponentEntry {
  /** URL segment. Unique, kebab-case, stable - it's the permalink. */
  slug: string;
  category: ComponentCategory;
  /** Lowercase keywords. Drives search alongside title/description. */
  tags: string[];
  difficulty: Difficulty;
  author: string;
  /** ISO date (YYYY-MM-DD). Drives "newest" and the New badge. */
  createdAt: string;
  updatedAt: string;
  /** SPDX id, e.g. 'MIT'. */
  license: string;
  version: string;

  /**
   * Source per framework. Partial on purpose - the tab strip renders only the
   * keys present, so a component with two variants is shippable today and can
   * grow to six without a schema change.
   */
  code: Partial<Record<Framework, string>>;

  dependencies?: Dependency[];
  props?: PropDoc[];
  variants?: ComponentVariant[];

  github?: string;
  /** Path to a downloadable zip under public/. */
  download?: string;

  featured?: boolean;
  /**
   * Components are free (spec). The flag exists because the spec's own search
   * filter and admin CMS reference it - but it is NOT the paywall. If it ever
   * becomes one, gate it server-side like the prompts, never in the card.
   */
  premium?: boolean;

  /** Popularity counters. Static until an analytics backend exists. */
  stats?: {
    views?: number;
    copies?: number;
    downloads?: number;
  };
}

/** Every framework this component actually ships, in display order. */
export function availableFrameworks(entry: ComponentEntry): Framework[] {
  return FRAMEWORKS.filter((f) => entry.code[f.id] !== undefined).map((f) => f.id);
}

/** How long a component counts as New - matches the prompt library. */
export const NEW_WINDOW_DAYS = 30;

export function isNewComponent(entry: ComponentEntry, now: number = Date.now()): boolean {
  const created = new Date(entry.createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return (now - created) / 86_400_000 <= NEW_WINDOW_DAYS;
}
