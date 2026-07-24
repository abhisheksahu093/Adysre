import {
  Accessibility,
  Activity,
  BadgeCheck,
  FileCode2,
  Gauge,
  History,
  Images,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

/**
 * Website Intelligence platform - the catalogue of what it analyses.
 *
 * Single source of truth for both surfaces that describe the platform: the
 * home-page section and the in-app overview page. Labels are TRANSLATION KEYS
 * (Rule 6): the id resolves to `websiteIntel.capabilities.<id>.title` / `.desc`,
 * `websiteIntel.dashboard.<id>` and so on, so adding a capability is one entry
 * here plus the matching keys in every catalogue.
 *
 * Tech-stack names are proper nouns and ship as data, not keys - the same way
 * the install section keeps package names untranslated.
 */

export interface IntelCapability {
  /** Stable id; key under `websiteIntel.capabilities.<id>`. */
  id: string;
  icon: LucideIcon;
}

/** The eleven analyses a single scan produces. */
export const INTEL_CAPABILITIES: IntelCapability[] = [
  { id: 'performance', icon: Gauge },
  { id: 'seo', icon: Search },
  { id: 'accessibility', icon: Accessibility },
  { id: 'bestPractices', icon: BadgeCheck },
  { id: 'security', icon: ShieldCheck },
  { id: 'webVitals', icon: Activity },
  { id: 'technology', icon: Layers },
  { id: 'assets', icon: Images },
  { id: 'html', icon: FileCode2 },
  { id: 'recommendations', icon: Sparkles },
  { id: 'history', icon: History },
];

/** Dashboard sections; each id resolves to `websiteIntel.dashboard.<id>`. */
export const INTEL_DASHBOARD_SECTIONS = [
  'overview',
  'performance',
  'seo',
  'accessibility',
  'security',
  'assets',
  'network',
  'technologies',
  'recommendations',
  'timeline',
] as const;

/**
 * The stack the platform is built on. Proper nouns, so untranslated. Grouped so
 * the overview page can show what does what.
 */
export interface IntelStackGroup {
  /** Key under `websiteIntel.stack.<id>`. */
  id: string;
  items: string[];
}

export const INTEL_STACK: IntelStackGroup[] = [
  { id: 'frontend', items: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Recharts'] },
  { id: 'backend', items: ['Node.js', 'Fastify', 'Prisma', 'PostgreSQL'] },
  { id: 'scanning', items: ['Playwright', 'Lighthouse', 'axe-core', 'Cheerio'] },
  { id: 'infra', items: ['BullMQ', 'Redis', 'Docker', 'S3'] },
];

/**
 * Headline figures shown as stat tiles. The analysis and format counts derive
 * from the catalogues above so they can never drift from what is actually
 * listed (Rule 6); the rest are illustrative platform figures.
 */
export const INTEL_STATS = [
  { value: INTEL_CAPABILITIES.length, suffix: '', id: 'analyses' },
  { value: 500, suffix: '+', id: 'rules' },
  { value: 4, suffix: '', id: 'formats' },
  { value: 0, suffix: '', id: 'paidAi' },
];

/** Report export formats offered. Extensions are proper nouns. */
export const INTEL_REPORT_FORMATS = ['PDF', 'CSV', 'JSON', 'Markdown'] as const;

/** The in-app route the platform lives at, referenced by nav and the home CTA. */
export const INTEL_ROUTE = '/website-intelligence';
