/**
 * Landing page structure.
 *
 * ─── How this file works ────────────────────────────────────────────────────
 * This module holds STRUCTURE ONLY: which modules the marketing page promotes,
 * in what order, with which icon and destination. Every user-facing string is a
 * translation key resolved against `messages/<locale>.json` under the `landing`
 * namespace, so wording changes never touch a component (Rule 6, and the same
 * pattern the pricing and navigation data already follow).
 *
 * Numbers (stats) are plain values formatted per locale at render time so digit
 * grouping stays correct across English, Japanese, Chinese and Hindi.
 *
 * Colours come from the accent tokens in `@adysre/theme`; a module names a token
 * family (`primary` / `secondary` / `accent`) rather than a hex value, and the
 * component maps that to token-based utility classes. No hardcoded colours here.
 */

import {
  Blocks,
  Shapes,
  Palette,
  Blend,
  Library,
  LayoutTemplate,
  MousePointerClick,
  Wand2,
  Rocket,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { APP_HOME } from '@/config/navigation';

/** Accent families available to a landing module, each backed by a theme token. */
export type Accent = 'primary' | 'secondary' | 'accent';

export interface FeatureModule {
  /** Stable id; also the key under `landing.features.items.<id>`. */
  id: string;
  /** In-app destination this module links to. */
  href: string;
  icon: LucideIcon;
  accent: Accent;
  /** Renders a "coming soon" pill and softens the card affordance. */
  comingSoon?: boolean;
}

/**
 * The modules promoted in the feature grid, in display order. These map onto the
 * live sidebar routes so the landing page can never advertise a page that isn't
 * reachable from the app shell.
 */
export const FEATURE_MODULES: FeatureModule[] = [
  { id: 'components', href: '/components', icon: Blocks, accent: 'primary' },
  { id: 'icons', href: '/icons', icon: Shapes, accent: 'secondary' },
  { id: 'palettes', href: '/palettes', icon: Palette, accent: 'accent' },
  { id: 'gradients', href: '/gradients', icon: Blend, accent: 'primary' },
  { id: 'promptLibrary', href: '/prompt-library', icon: Library, accent: 'secondary' },
  { id: 'templates', href: '/templates', icon: LayoutTemplate, accent: 'accent', comingSoon: true },
];

export interface WorkflowStep {
  /** Key under `landing.workflow.steps.<id>`. */
  id: string;
  icon: LucideIcon;
}

/** The three-step "how teams use it" strip. */
export const WORKFLOW_STEPS: WorkflowStep[] = [
  { id: 'browse', icon: MousePointerClick },
  { id: 'tailor', icon: Wand2 },
  { id: 'ship', icon: Rocket },
];

export interface Stat {
  /** Key under `landing.stats.items.<id>`. */
  id: string;
  /** Plain number, formatted per locale. */
  value: number;
  /** Optional suffix appended after the formatted number, e.g. "+". */
  suffix?: string;
}

/**
 * Headline metrics. Placeholders until the API reports live figures; kept as
 * numbers so each locale groups digits its own way at render.
 */
export const STATS: Stat[] = [
  { id: 'components', value: 240, suffix: '+' },
  { id: 'icons', value: 6400, suffix: '+' },
  { id: 'prompts', value: 120, suffix: '+' },
  { id: 'teams', value: 18000, suffix: '+' },
];

/** In-app hrefs used across the header nav, feature cards and footer. */
export const LANDING_LINKS = {
  // Entry point into the app shell. Follows the sidebar, so it never points at
  // a hidden page (dashboard is hidden for now).
  app: APP_HOME,
  components: '/components',
  icons: '/icons',
  palettes: '/palettes',
  gradients: '/gradients',
  promptLibrary: '/prompt-library',
  templates: '/templates',
  pricing: '/pricing',
  contact: '/contact',
  docs: '/docs',
  terms: '/legal/terms',
  privacy: '/legal/privacy',
  dmca: '/legal/dmca',
} as const;

/** FAQ entries, keyed under `landing.faq.items.<id>`. */
export const FAQ_ITEMS = ['what', 'frameworks', 'templates', 'pricing', 'team'] as const;

/**
 * The launch banner pinned above the header.
 *
 * `id` doubles as the dismissal key: once someone closes the bar, the id is
 * stored and the bar stays hidden until you change the id here (for the next
 * announcement), at which point it shows again for everyone. Copy lives under
 * `landing.announcement.*`; `href` points at the page being announced.
 */
export const ANNOUNCEMENT = {
  id: 'launch-2026-07-icons-gradients',
  href: LANDING_LINKS.icons,
  icon: Sparkles,
} as const;
