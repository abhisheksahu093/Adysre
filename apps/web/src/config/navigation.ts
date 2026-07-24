import {
  Library,
  Blocks,
  Shapes,
  Palette,
  Blend,
  Grid2x2,
  Waves,
  PenTool,
  LayoutTemplate,
  Radar,
  type LucideIcon,
} from 'lucide-react';

/**
 * Sidebar navigation - the single source of truth for the app shell.
 *
 * Labels are translation KEYS, not text: the sidebar and each module page look
 * them up against `messages/<locale>.json` at render time. Adding a module
 * means one entry here plus the matching keys under `nav.*` in every catalogue.
 */
export interface NavItem {
  /** Key under the `nav` namespace, e.g. 'dashboard' → nav.dashboard. */
  key: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  comingSoon?: boolean;
  /** Key under `nav.descriptions`, when the page shows a subtitle. */
  descriptionKey?: string;
}

export const NAV_ITEMS: NavItem[] = [
  // Dashboard is hidden for now - re-add this entry to bring it back:
  // { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  {
    key: 'promptLibrary',
    href: '/prompt-library',
    icon: Library,
    descriptionKey: 'promptLibrary',
  },
  {
    key: 'components',
    href: '/components',
    icon: Blocks,
  },
  {
    key: 'icons',
    href: '/icons',
    icon: Shapes,
    descriptionKey: 'icons',
  },
  {
    key: 'palettes',
    href: '/palettes',
    icon: Palette,
    descriptionKey: 'palettes',
  },
  {
    key: 'gradients',
    href: '/gradients',
    icon: Blend,
    descriptionKey: 'gradients',
  },
  {
    key: 'patterns',
    href: '/patterns',
    icon: Grid2x2,
    descriptionKey: 'patterns',
  },
  {
    key: 'textures',
    href: '/textures',
    icon: Waves,
    descriptionKey: 'textures',
  },
  {
    key: 'designPlayground',
    href: '/design-playground',
    icon: PenTool,
    descriptionKey: 'designPlayground',
  },
  {
    key: 'templates',
    href: '/templates',
    icon: LayoutTemplate,
    descriptionKey: 'templates',
  },
  {
    key: 'websiteIntelligence',
    href: '/website-intelligence',
    icon: Radar,
    descriptionKey: 'websiteIntelligence',
  },
  // Settings is hidden until the module lands - re-add this entry to bring it
  // back. The route, its translations and its permission are all still in place,
  // so this is the only line that has to change:
  // {
  //   key: 'settings',
  //   href: '/settings',
  //   icon: Settings,
  //   permission: 'org:setting:manage',
  //   comingSoon: true,
  //   descriptionKey: 'settings',
  // },
];

/** Look up a nav entry by route - lets a page derive its own title and icon. */
export function getNavItem(href: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.href === href);
}

/**
 * The app's home route once inside the shell - the first sidebar item.
 *
 * The marketing "open workspace" links and the post-auth redirects all point
 * here rather than hardcoding a route, so hiding or reordering the menu moves
 * the entry point with it. (Dashboard used to be home; it's hidden for now.)
 */
export const APP_HOME: string = NAV_ITEMS[0]?.href ?? '/prompt-library';
