import { isLockedFor, type AccessLevel } from '@/lib/access';
import { ATELIER_CONTENT, ATELIER_PROMPT } from './atelier-nord-content';
import { AURORA_CONTENT, AURORA_PROMPT } from './aurora-fitness-content';
import { CADENCE_CONTENT, CADENCE_PROMPT } from './cadence-academy-content';
import { KITE_CONTENT, KITE_PROMPT } from './kite-studio-content';
import { VANTA_CONTENT, VANTA_PROMPT } from './vanta-markets-content';
import { LUMEN_CONTENT, LUMEN_PROMPT } from './lumen-store-content';
import { LUMIERE_CONTENT, LUMIERE_PROMPT } from './lumiere-salon-content';
import { MERIDIAN_CONTENT, MERIDIAN_PROMPT } from './meridian-law-content';
import { NORTHGATE_CONTENT, NORTHGATE_PROMPT } from './northgate-pay-content';
import { NOVA_CONTENT, NOVA_PROMPT } from './nova-analytics-content';
import { PINNACLE_CONTENT, PINNACLE_PROMPT } from './pinnacle-advisory-content';
import { PULSE_CONTENT, PULSE_PROMPT } from './pulse-clinic-content';
import { VERDANT_CONTENT, VERDANT_PROMPT } from './verdant-realty-content';
import { SAFFRON_CONTENT, SAFFRON_PROMPT } from './saffron-table-content';
import { TAVOLA_CONTENT, TAVOLA_PROMPT } from './tavola-kitchen-content';
import { HALCYON_CONTENT, HALCYON_NAV, HALCYON_PROMPT } from './halcyon-ai-content';
import { SCULPT_CONTENT, SCULPT_NAV, SCULPT_PROMPT } from './sculpt-audio-content';
import { SOLSTICE_CONTENT, SOLSTICE_NAV, SOLSTICE_PROMPT } from './solstice-hotel-content';
import { CIRRUS_CONTENT, CIRRUS_NAV, CIRRUS_PROMPT } from './cirrus-analytics-content';
import { PRISM_CONTENT, PRISM_NAV, PRISM_PROMPT } from './prism-studio-content';
import {
  TEMPLATE_SECTIONS,
  type TemplateEntry,
  type TemplateSummary,
  type TemplateTier,
} from './types';

/**
 * Templates - the registry.
 *
 * Adding a template is four steps:
 *   1. Author its sections under `src/components/templates/<slug>/`.
 *   2. Author its content module in this folder.
 *   3. Add an entry here.
 *   4. Register its renderer in `components/templates/registry.ts` and its
 *      exportable sources in `scripts/generate-template-sources.mjs`.
 *
 * Nothing else needs to change: the gallery, the dialog, the preview route and
 * the downloads are all driven by this list.
 */
export const TEMPLATES: TemplateEntry[] = [
  {
    slug: 'prism-studio',
    name: 'Prism',
    taglineKey: 'prism',
    tier: 'free',
    themeKey: 'agency',
    sections: TEMPLATE_SECTIONS,
    prompt: PRISM_PROMPT,
    // React targets only: the work rail and the motion path are scrubbed to
    // the scrollbar, which a hand-authored static build cannot reproduce.
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-23',
    pages: PRISM_NAV.map((item) => ({ id: item.id, label: item.label })),
    entry: {
      file: 'prism-template',
      symbol: 'PrismTemplate',
      stylesheet: 'prism.css',
      scope: 'prism',
    },
    content: PRISM_CONTENT,
  },
  {
    slug: 'cirrus-analytics',
    name: 'Cirrus',
    taglineKey: 'cirrus',
    tier: 'free',
    themeKey: 'finance',
    sections: TEMPLATE_SECTIONS,
    prompt: CIRRUS_PROMPT,
    // React targets only: the charts are scrubbed to the scrollbar, which a
    // hand-authored static build cannot reproduce.
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-23',
    pages: CIRRUS_NAV.map((item) => ({ id: item.id, label: item.label })),
    entry: {
      file: 'cirrus-template',
      symbol: 'CirrusTemplate',
      stylesheet: 'cirrus.css',
      scope: 'cirrus',
    },
    content: CIRRUS_CONTENT,
  },
  {
    slug: 'solstice-hotel',
    name: 'Solstice',
    taglineKey: 'solstice',
    tier: 'free',
    themeKey: 'hospitality',
    sections: TEMPLATE_SECTIONS,
    prompt: SOLSTICE_PROMPT,
    // React targets only: the line-splitting rewrites markup at runtime, which
    // a hand-authored static build cannot reproduce.
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-23',
    pages: SOLSTICE_NAV.map((item) => ({ id: item.id, label: item.label })),
    entry: {
      file: 'solstice-template',
      symbol: 'SolsticeTemplate',
      stylesheet: 'solstice.css',
      scope: 'solstice',
    },
    content: SOLSTICE_CONTENT,
  },
  {
    slug: 'sculpt-audio',
    name: 'Sculpt',
    taglineKey: 'sculpt',
    tier: 'free',
    themeKey: 'hardware',
    sections: TEMPLATE_SECTIONS,
    prompt: SCULPT_PROMPT,
    // React targets only: this template's character is its spring physics and
    // its draggable control, neither of which survives a no-script build.
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-23',
    pages: SCULPT_NAV.map((item) => ({ id: item.id, label: item.label })),
    entry: {
      file: 'sculpt-template',
      symbol: 'SculptTemplate',
      stylesheet: 'sculpt.css',
      scope: 'sculpt',
    },
    content: SCULPT_CONTENT,
  },
  {
    slug: 'halcyon-ai',
    name: 'Halcyon',
    taglineKey: 'halcyon',
    tier: 'free',
    themeKey: 'saas',
    sections: TEMPLATE_SECTIONS,
    prompt: HALCYON_PROMPT,
    // React targets only. The static builds are hand-authored HTML with no
    // script, and this template's whole character is its anime.js motion -
    // a no-JS build would be a different, worse template wearing its name.
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-23',
    pages: HALCYON_NAV.map((item) => ({ id: item.id, label: item.label })),
    entry: {
      file: 'halcyon-template',
      symbol: 'HalcyonTemplate',
      stylesheet: 'halcyon.css',
      scope: 'halcyon',
    },
    content: HALCYON_CONTENT,
  },
  {
    slug: 'nova-analytics',
    name: 'Nova',
    taglineKey: 'nova',
    tier: 'free',
    themeKey: 'saas',
    sections: TEMPLATE_SECTIONS,
    prompt: NOVA_PROMPT,
    downloads: ['nextjs', 'react', 'tailwind', 'html'],
    addedOn: '2026-07-22',
    entry: {
      file: 'nova-template',
      symbol: 'NovaTemplate',
      stylesheet: 'nova.css',
      scope: 'nova',
    },
    content: NOVA_CONTENT,
  },
  {
    slug: 'saffron-table',
    name: 'Saffron',
    taglineKey: 'saffron',
    tier: 'free',
    themeKey: 'restaurant',
    sections: TEMPLATE_SECTIONS,
    prompt: SAFFRON_PROMPT,
    downloads: ['nextjs', 'react', 'tailwind', 'html'],
    addedOn: '2026-07-22',
    entry: {
      file: 'saffron-template',
      symbol: 'SaffronTemplate',
      stylesheet: 'saffron.css',
      scope: 'saffron',
    },
    content: SAFFRON_CONTENT,
  },
  {
    slug: 'pulse-clinic',
    name: 'Pulse',
    taglineKey: 'pulse',
    tier: 'free',
    themeKey: 'health',
    sections: TEMPLATE_SECTIONS,
    prompt: PULSE_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    entry: {
      file: 'pulse-template',
      symbol: 'PulseTemplate',
      stylesheet: 'pulse.css',
      scope: 'pulse',
    },
    content: PULSE_CONTENT,
  },
  {
    slug: 'aurora-fitness',
    name: 'Aurora',
    taglineKey: 'aurora',
    tier: 'premium',
    themeKey: 'fitness',
    sections: TEMPLATE_SECTIONS,
    prompt: AURORA_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    entry: {
      file: 'aurora-template',
      symbol: 'AuroraTemplate',
      stylesheet: 'aurora.css',
      scope: 'aurora',
    },
    content: AURORA_CONTENT,
  },
  {
    slug: 'atelier-nord',
    name: 'Atelier Nord',
    taglineKey: 'atelier',
    tier: 'premium',
    themeKey: 'architecture',
    sections: TEMPLATE_SECTIONS,
    prompt: ATELIER_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    entry: {
      file: 'atelier-template',
      symbol: 'AtelierTemplate',
      stylesheet: 'atelier.css',
      scope: 'atelier',
    },
    content: ATELIER_CONTENT,
  },
  {
    slug: 'verdant-realty',
    name: 'Verdant',
    taglineKey: 'verdant',
    tier: 'premium',
    themeKey: 'realEstate',
    sections: TEMPLATE_SECTIONS,
    prompt: VERDANT_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'listings', label: 'Listings' },
      { id: 'about', label: 'About' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'verdant-template',
      symbol: 'VerdantTemplate',
      stylesheet: 'verdant.css',
      scope: 'verdant',
    },
    content: VERDANT_CONTENT,
  },
  {
    slug: 'meridian-law',
    name: 'Meridian',
    taglineKey: 'meridian',
    tier: 'premium',
    themeKey: 'legal',
    sections: TEMPLATE_SECTIONS,
    prompt: MERIDIAN_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'practices', label: 'Practices' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'meridian-template',
      symbol: 'MeridianTemplate',
      stylesheet: 'meridian.css',
      scope: 'meridian',
    },
    content: MERIDIAN_CONTENT,
  },
  {
    slug: 'lumen-store',
    name: 'Lumen',
    taglineKey: 'lumen',
    tier: 'premium',
    themeKey: 'ecommerce',
    sections: TEMPLATE_SECTIONS,
    prompt: LUMEN_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'shop', label: 'Shop' },
      { id: 'product', label: 'Product' },
      { id: 'cart', label: 'Cart' },
      { id: 'checkout', label: 'Checkout' },
      { id: 'login', label: 'Sign in' },
      { id: 'signup', label: 'Sign up' },
    ],
    entry: {
      file: 'lumen-template',
      symbol: 'LumenTemplate',
      stylesheet: 'lumen.css',
      scope: 'lumen',
    },
    content: LUMEN_CONTENT,
  },
  {
    slug: 'kite-studio',
    name: 'Kite',
    taglineKey: 'kite',
    tier: 'free',
    themeKey: 'agency',
    sections: TEMPLATE_SECTIONS,
    prompt: KITE_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'work', label: 'Work' },
      { id: 'services', label: 'Services' },
      { id: 'studio', label: 'Studio' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'kite-template',
      symbol: 'KiteTemplate',
      stylesheet: 'kite.css',
      scope: 'kite',
    },
    content: KITE_CONTENT,
  },
  {
    slug: 'vanta-markets',
    name: 'Vanta',
    taglineKey: 'vanta',
    tier: 'premium',
    themeKey: 'finance',
    sections: TEMPLATE_SECTIONS,
    prompt: VANTA_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'markets', label: 'Markets' },
      { id: 'platform', label: 'Platform' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'vanta-template',
      symbol: 'VantaTemplate',
      stylesheet: 'vanta.css',
      scope: 'vanta',
    },
    content: VANTA_CONTENT,
  },
  {
    slug: 'cadence-academy',
    name: 'Cadence',
    taglineKey: 'cadence',
    tier: 'free',
    themeKey: 'education',
    sections: TEMPLATE_SECTIONS,
    prompt: CADENCE_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'courses', label: 'Courses' },
      { id: 'course', label: 'Course detail' },
      { id: 'mentors', label: 'Mentors' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'cadence-template',
      symbol: 'CadenceTemplate',
      stylesheet: 'cadence.css',
      scope: 'cadence',
    },
    content: CADENCE_CONTENT,
  },
  {
    slug: 'tavola-kitchen',
    name: 'Tavola',
    taglineKey: 'tavola',
    tier: 'premium',
    themeKey: 'restaurant',
    sections: TEMPLATE_SECTIONS,
    prompt: TAVOLA_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-23',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'menu', label: 'Menu' },
      { id: 'services', label: 'Services' },
      { id: 'blog', label: 'Blog' },
      { id: 'contact', label: 'Contact' },
      { id: 'cart', label: 'Cart' },
    ],
    entry: {
      file: 'tavola-template',
      symbol: 'TavolaTemplate',
      stylesheet: 'tavola.css',
      scope: 'tavola',
    },
    content: TAVOLA_CONTENT,
  },
  {
    slug: 'lumiere-salon',
    name: 'Lumière',
    taglineKey: 'lumiere',
    tier: 'premium',
    themeKey: 'beauty',
    sections: TEMPLATE_SECTIONS,
    prompt: LUMIERE_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'services', label: 'Services' },
      { id: 'shop', label: 'Shop' },
      { id: 'product', label: 'Product' },
      { id: 'cart', label: 'Cart' },
      { id: 'booking', label: 'Booking' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'lumiere-template',
      symbol: 'LumiereTemplate',
      stylesheet: 'lumiere.css',
      scope: 'lumiere',
    },
    content: LUMIERE_CONTENT,
  },
  {
    slug: 'northgate-pay',
    name: 'Northgate',
    taglineKey: 'northgate',
    tier: 'premium',
    themeKey: 'payments',
    sections: TEMPLATE_SECTIONS,
    prompt: NORTHGATE_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'products', label: 'Products' },
      { id: 'developers', label: 'Developers' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'northgate-template',
      symbol: 'NorthgateTemplate',
      stylesheet: 'northgate.css',
      scope: 'northgate',
    },
    content: NORTHGATE_CONTENT,
  },
  {
    slug: 'pinnacle-advisory',
    name: 'Pinnacle',
    taglineKey: 'pinnacle',
    tier: 'premium',
    themeKey: 'consulting',
    sections: TEMPLATE_SECTIONS,
    prompt: PINNACLE_PROMPT,
    downloads: ['nextjs', 'react'],
    addedOn: '2026-07-22',
    pages: [
      { id: 'home', label: 'Home' },
      { id: 'expertise', label: 'Expertise' },
      { id: 'insights', label: 'Insights' },
      { id: 'team', label: 'Team' },
      { id: 'contact', label: 'Contact' },
    ],
    entry: {
      file: 'pinnacle-template',
      symbol: 'PinnacleTemplate',
      stylesheet: 'pinnacle.css',
      scope: 'pinnacle',
    },
    content: PINNACLE_CONTENT,
  },
];

export function getTemplate(slug: string): TemplateEntry | undefined {
  return TEMPLATES.find((template) => template.slug === slug);
}

/** Templates added within this window carry the "New" badge. */
const NEW_FOR_DAYS = 45;

export function isNewTemplate(template: TemplateEntry, now: Date): boolean {
  const added = new Date(template.addedOn).getTime();
  if (Number.isNaN(added)) return false;
  return (now.getTime() - added) / 86_400_000 <= NEW_FOR_DAYS;
}

/**
 * Strip a template to the serializable fields a Client Component may receive,
 * enforcing the paywall as it goes.
 *
 * ─── WHY THE REDACTION LIVES HERE ───────────────────────────────────────────
 * Hiding the Copy and Download buttons is not access control: the summary list
 * is serialised into the RSC payload, so a prompt left on the object is
 * readable from devtools whatever the UI shows. A locked template therefore
 * leaves the server with `prompt: null` and no download formats, and the lock
 * in the dialog is only the polite version of the same decision.
 *
 * Previewing stays open to everyone on purpose - you cannot sell a template
 * nobody is allowed to look at.
 */
export function toSummary(
  template: TemplateEntry,
  level: AccessLevel = 'free',
  now: Date = new Date(),
): TemplateSummary {
  const locked = isLockedFor(template.tier, level);

  return {
    slug: template.slug,
    name: template.name,
    taglineKey: template.taglineKey,
    tier: template.tier,
    themeKey: template.themeKey,
    sections: template.sections,
    pages: template.pages ?? [],
    downloads: locked ? [] : template.downloads,
    isNew: isNewTemplate(template, now),
    locked,
    prompt: locked ? null : template.prompt,
  };
}

/** The gallery's payload for a given entitlement level. */
export function templateSummaries(level: AccessLevel, now: Date = new Date()): TemplateSummary[] {
  return TEMPLATES.map((template) => toSummary(template, level, now));
}

/** Templates a visitor on `level` may download, newest-shaped list unchanged. */
export function templatesForTier(tier: TemplateTier): TemplateEntry[] {
  return TEMPLATES.filter((template) => template.tier === tier);
}

export * from './types';
