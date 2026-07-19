/**
 * Sidebar submenu definitions - the categories/tags each module exposes as a
 * dropdown under its nav item, replacing the on-page filter chips.
 *
 * Everything here is STRUCTURE + ids only (no dataset imports), so the global
 * sidebar bundle stays light. Labels resolve at render time:
 *   - `labelMode` = { ns, prefix }  → `t_<ns>(prefix + value)` (translated)
 *   - `labelMode` = 'humanize'      → the value titled-cased (free-form tags)
 *
 * A submenu item is a link to the module route with `?<param>=<value>`; the
 * page reads that param and filters itself. Keep the ids in step with the data:
 *   - components: category ids in `data/components/types.ts`
 *   - icons:      `ICON_CATEGORY_IDS` in `data/icons`
 *   - prompts:    `PROMPT_CATEGORIES` in `data/prompts/types`
 *   - tags:       derived from the gradient/palette datasets
 */

export type LabelMode =
  | { ns: 'components' | 'icons' | 'promptLibrary'; prefix: string }
  | 'humanize';

export interface SubmenuGroup {
  /** Key under `nav.groups`. */
  groupKey: string;
  /** Filter values (category ids), in display order. */
  values: string[];
}

export interface ModuleSubmenu {
  /** The `NAV_ITEMS` key this hangs off. */
  navKey: string;
  /** The module route the items link to. */
  href: string;
  /** URL query key the target page reads to apply the filter. */
  param: 'category' | 'tag';
  labelMode: LabelMode;
  /** Grouped layout (components); mutually exclusive with `values`. */
  groups?: SubmenuGroup[];
  /** Flat layout (icons, prompts, tags). */
  values?: string[];
}

/**
 * The 67 component categories, sorted into eight readable sections so the
 * submenu is browsable instead of a 67-item wall.
 */
const COMPONENT_GROUPS: SubmenuGroup[] = [
  { groupKey: 'essentials', values: ['buttons', 'cards', 'badges', 'tags'] },
  {
    groupKey: 'marketing',
    values: [
      'hero',
      'cta',
      'pricing',
      'testimonials',
      'marketing',
      'stats',
      'services',
      'about',
      'team',
      'faq',
      'bento',
      'globes',
      'marquees',
      'nature',
    ],
  },
  {
    groupKey: 'navigation',
    values: [
      'navbar',
      'sidebars',
      'footer',
      'menus',
      'dropdowns',
      'tabs',
      'pagination',
      'steppers',
      'docks',
      'tour',
      'search-bars',
    ],
  },
  {
    groupKey: 'forms',
    values: [
      'forms',
      'sign-in',
      'sign-up',
      'reset-password',
      'change-password',
      'contact',
      'file-uploads',
      'toggles',
      'color-pickers',
      'date-pickers',
      'time-pickers',
      'calendar',
    ],
  },
  {
    groupKey: 'data',
    values: ['tables', 'lists', 'file-trees', 'timeline', 'comparisons', 'progress', 'maps'],
  },
  {
    groupKey: 'media',
    values: ['images', 'galleries', 'blog', 'avatars', 'carousel', 'gradients', 'cursors'],
  },
  {
    groupKey: 'feedback',
    values: [
      'modals',
      'popover',
      'notifications',
      'alerts',
      'tooltips',
      'loaders',
      'fab',
      'animation',
      'error-pages',
    ],
  },
  { groupKey: 'commerce', values: ['cart', 'checkout', 'social'] },
];

/** Icon categories (mirrors `ICON_CATEGORY_IDS`). */
const ICON_CATEGORIES = [
  'interface',
  'arrows',
  'communication',
  'media',
  'files',
  'commerce',
  'devices',
  'weather',
  'social',
  'editing',
  'maps',
  'status',
];

/** Prompt categories (mirrors `PROMPT_CATEGORIES`). */
const PROMPT_CATEGORY_IDS = [
  'portrait',
  'headshot',
  'business',
  'fashion',
  'lifestyle',
  'cinematic',
  'travel',
  'nature',
  'fitness',
  'automotive',
  'editorial',
  'fantasy',
  'sci-fi',
  'anime',
  'artistic',
];

/** Gradient filter tags (derived from the gradient dataset). */
const GRADIENT_TAGS = [
  'blue', 'brown', 'conic', 'contrast', 'cool', 'corporate', 'dark', 'fire', 'fresh',
  'gold', 'gradient', 'green', 'luxury', 'moody', 'muted', 'nature', 'neon', 'neutral',
  'ocean', 'orange', 'pastel', 'peach', 'pink', 'purple', 'radial', 'rainbow', 'red',
  'soft', 'sunset', 'teal', 'vibrant', 'warm', 'yellow',
];

/** Palette filter tags (derived from the palette dataset). */
const PALETTE_TAGS = [
  'autumn', 'blue', 'brown', 'calm', 'contrast', 'cool', 'corporate', 'cyberpunk', 'dark',
  'earthy', 'fresh', 'gradient', 'green', 'luxury', 'monochrome', 'moody', 'muted', 'nature',
  'neon', 'neutral', 'ocean', 'orange', 'pastel', 'pink', 'playful', 'purple', 'rainbow',
  'red', 'soft', 'summer', 'sunset', 'teal', 'tech', 'vibrant', 'warm', 'yellow',
];

export const NAV_SUBMENUS: Record<string, ModuleSubmenu> = {
  components: {
    navKey: 'components',
    href: '/components',
    param: 'category',
    labelMode: { ns: 'components', prefix: 'categories.' },
    groups: COMPONENT_GROUPS,
  },
  promptLibrary: {
    navKey: 'promptLibrary',
    href: '/prompt-library',
    param: 'category',
    labelMode: { ns: 'promptLibrary', prefix: 'categories.' },
    values: PROMPT_CATEGORY_IDS,
  },
  icons: {
    navKey: 'icons',
    href: '/icons',
    param: 'category',
    labelMode: { ns: 'icons', prefix: 'categories.' },
    values: ICON_CATEGORIES,
  },
  palettes: {
    navKey: 'palettes',
    href: '/palettes',
    param: 'tag',
    labelMode: 'humanize',
    values: PALETTE_TAGS,
  },
  gradients: {
    navKey: 'gradients',
    href: '/gradients',
    param: 'tag',
    labelMode: 'humanize',
    values: GRADIENT_TAGS,
  },
};
