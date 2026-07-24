import {
  Activity,
  Binary,
  Building2,
  FileCheck2,
  Fingerprint,
  GitCompare,
  KeyRound,
  Landmark,
  Layers3,
  Network,
  ScrollText,
  ShieldCheck,
  Split,
  Timer,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * CIRRUS - content for the financial analytics template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * CIRRUS is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the chart series, the metric tiles, the security
 * controls and the pricing ladder. Those extras are typed locally rather than
 * pushed into `types.ts`, because "reconciliation lag" is this template's
 * domain.
 *
 * ─── Every number here is authored, and the copy says so ───────────────────
 * A template ships no data layer. A financial dashboard implying live figures
 * would be worse than dishonest, so the series below are illustrative, the
 * footer states it, and the charts are captioned as sample data.
 */

export const CIRRUS_PAGES = ['home', 'product', 'security', 'pricing', 'contact'] as const;
export type CirrusPageId = (typeof CIRRUS_PAGES)[number];

export const CIRRUS_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
} as const;

export const CIRRUS_NAV: { id: CirrusPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'product', label: 'Product' },
  { id: 'security', label: 'Security' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
];

export interface CirrusMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const CIRRUS_MASTHEADS: Record<Exclude<CirrusPageId, 'home'>, CirrusMasthead> = {
  product: {
    eyebrow: 'Product',
    title: 'Every ledger, reconciled continuously',
    subtitle:
      'Connect your processors, banks and ledgers once. Cirrus normalises them into one schema and keeps them agreeing with each other.',
  },
  security: {
    eyebrow: 'Security',
    title: 'Built for the audit you have not scheduled yet',
    subtitle:
      'Least privilege by default, every read logged, and the controls documented in a way your auditor can actually verify.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Priced on volume, not seats',
    subtitle:
      'Everyone at your company can have a login. You pay for the transactions we reconcile, and the price falls as they grow.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'See it against your own data',
    subtitle:
      'Thirty minutes, your ledger, our engineer. We will show you the breaks you have right now, or tell you that you have none.',
  },
};

/** One tile in the metric strip. */
export interface CirrusMetric {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  /** Period-over-period movement. Sign drives colour AND an arrow glyph. */
  delta: number;
  /** Illustrative sparkline. */
  series: number[];
}

export const CIRRUS_METRICS: CirrusMetric[] = [
  {
    label: 'Settled volume',
    value: 4.82,
    prefix: '$',
    suffix: 'B',
    decimals: 2,
    delta: 12.4,
    series: [38, 41, 39, 46, 52, 49, 58, 63, 61, 72, 78, 84],
  },
  {
    label: 'Reconciliation lag',
    value: 41,
    suffix: 's',
    delta: -63.8,
    series: [92, 88, 79, 74, 66, 58, 55, 49, 46, 44, 42, 41],
  },
  {
    label: 'Unmatched breaks',
    value: 12,
    delta: -71.2,
    series: [64, 58, 51, 44, 39, 33, 28, 24, 19, 16, 14, 12],
  },
  {
    label: 'Ledgers connected',
    value: 38,
    delta: 8.6,
    series: [18, 20, 21, 24, 26, 27, 29, 31, 33, 35, 37, 38],
  },
];

/** The headline chart on the home page. Illustrative. */
export const CIRRUS_VOLUME_SERIES = [
  22, 26, 24, 31, 35, 33, 42, 47, 44, 53, 58, 56, 66, 71, 69, 78, 84, 81, 92, 97,
];

/** Monthly break counts, for the bar chart. Illustrative. */
export const CIRRUS_BREAKS_SERIES = [64, 58, 51, 44, 39, 33, 28, 24, 19, 16, 14, 12];

/** One capability on the product page. */
export interface CirrusCapability {
  icon: typeof Activity;
  title: string;
  body: string;
}

export const CIRRUS_CAPABILITIES: CirrusCapability[] = [
  { icon: GitCompare, title: 'Continuous reconciliation', body: 'Matching runs on arrival, not overnight. A break is surfaced in seconds, while the counterparty still remembers the transaction.' },
  { icon: Layers3, title: 'One normalised schema', body: 'Thirty-eight source formats collapse into a single ledger model, so a query written once works across every processor you use.' },
  { icon: Split, title: 'Deterministic matching', body: 'Rules you can read, version and test, rather than a model that scores. When a match is wrong you can see exactly which rule did it.' },
  { icon: ScrollText, title: 'Immutable audit trail', body: 'Every match, override and adjustment is append-only and attributable. Nothing in the history can be edited, including by us.' },
  { icon: Network, title: 'Streaming exports', body: 'Push the reconciled ledger into your warehouse continuously, or pull it as of any point in time.' },
  { icon: Timer, title: 'Point-in-time queries', body: 'Ask what the books said on a date, as they were understood on that date, not as they have since been corrected.' },
];

/** One control on the security page. */
export interface CirrusControl {
  icon: typeof ShieldCheck;
  title: string;
  body: string;
  standard: string;
}

export const CIRRUS_CONTROLS: CirrusControl[] = [
  { icon: KeyRound, title: 'Least privilege by default', body: 'A new user can read nothing. Access is granted per ledger and expires unless it is renewed.', standard: 'SOC 2 CC6.1' },
  { icon: Fingerprint, title: 'Every read is logged', body: 'Not just writes. Who looked at which ledger, when, and from where, retained for seven years.', standard: 'SOC 2 CC7.2' },
  { icon: Binary, title: 'Encrypted with your keys', body: 'Bring your own KMS key. Revoke it and the data is unreadable, including to us, within the hour.', standard: 'ISO 27001 A.10' },
  { icon: Building2, title: 'Data residency', body: 'EU, UK, US or Australia. Data does not leave the region you pick, including backups and logs.', standard: 'GDPR Art. 44' },
  { icon: FileCheck2, title: 'Evidence, not assertions', body: 'Control evidence is exportable on demand, so your auditor tests the system rather than reading our description of it.', standard: 'SOC 2 Type II' },
  { icon: Landmark, title: 'Segregation of duties', body: 'The person who creates an adjustment cannot approve it. Enforced in the data model, not in a policy document.', standard: 'SOX 404' },
];

/** A pricing tier. */
export interface CirrusPlan {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

export const CIRRUS_PLANS: CirrusPlan[] = [
  {
    name: 'Team',
    price: '$1,200',
    cadence: 'per month',
    summary: 'Up to 2 million reconciled transactions a month.',
    features: ['Unlimited users', '6 ledger connections', 'Daily warehouse export', 'Email support'],
    cta: 'Start a trial',
  },
  {
    name: 'Growth',
    price: '$4,800',
    cadence: 'per month',
    summary: 'Up to 20 million, with continuous export.',
    features: [
      'Unlimited users and ledgers',
      'Streaming export',
      'Point-in-time queries',
      'Custom matching rules',
      'Shared Slack channel',
    ],
    cta: 'Start a trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'annual',
    summary: 'Unlimited volume, your region, your keys.',
    features: [
      'Everything in Growth',
      'BYO KMS key and data residency',
      'SOC 2 evidence on demand',
      'Segregation-of-duties enforcement',
      '99.99% SLA, named engineer',
    ],
    cta: 'Talk to sales',
  },
];

export const CIRRUS_CONTENT: TemplateContent = {
  brand: 'Cirrus',

  nav: CIRRUS_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'SOC 2 Type II · ISO 27001',
    title: 'Know what your books say',
    titleAccent: 'before month end',
    subtitle:
      'Cirrus reconciles every processor, bank and ledger you use, continuously. Breaks surface in seconds instead of at close, and the audit trail is written as it happens.',
    ctaPrimary: 'Book a walkthrough',
    ctaSecondary: 'See the product',
    stats: [
      { value: 41, suffix: 's', label: 'Median reconciliation lag' },
      { value: 38, suffix: '', label: 'Source formats supported' },
      { value: 99, suffix: '.99%', label: 'Platform uptime' },
    ],
  },

  marquee: [
    'Continuous reconciliation',
    'One normalised schema',
    'Deterministic matching',
    'Immutable audit trail',
    'Point-in-time queries',
    'Streaming exports',
  ],

  about: {
    eyebrow: 'The problem',
    title: 'Close takes eleven days because nothing agrees',
    body: [
      'Every processor reports differently, every bank settles on its own schedule, and the ledger is reconciled once a month by someone with a spreadsheet. By the time a break is found, nobody remembers the transaction that caused it.',
      'Cirrus does the matching continuously and deterministically. The result is not a faster close so much as the absence of one — the books are already right on the last day of the month.',
    ],
    points: [
      'Breaks surfaced in seconds, not at close',
      'Rules you can read, version and test',
      'Every match and override attributable',
      'The ledger as it stood on any past date',
    ],
  },

  services: {
    eyebrow: 'Product',
    title: 'Six things that make close a non-event',
    subtitle:
      'None of them is machine learning. Financial reconciliation needs to be explainable to an auditor, which means it needs to be deterministic.',
    items: CIRRUS_CAPABILITIES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'Security',
    title: 'Controls your auditor can test',
    subtitle:
      'Every control below maps to a clause and produces exportable evidence, because an assertion in a PDF is not a control.',
    items: CIRRUS_CONTROLS.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  faq: {
    eyebrow: 'Questions',
    title: 'What finance teams ask first',
    items: [
      {
        question: 'How long does connecting a ledger take?',
        answer:
          'Most processors and banks are a credential and a callback, so under an hour. A custom or in-house ledger is a file format we map for you, which is typically two or three days including the test cycle you will want to run against historical data.',
      },
      {
        question: 'Does it replace our accounting system?',
        answer:
          'No. Cirrus sits between your sources and whatever you close in. It reconciles and normalises, then pushes the result into your existing system and your warehouse. Nobody has to change where they do their work.',
      },
      {
        question: 'Why deterministic matching rather than a model?',
        answer:
          'Because an auditor will ask why a particular transaction matched, and "the model scored it 0.94" is not an answer that survives the question. Rules are readable, versioned and testable, and when one is wrong you can see which one and fix it.',
      },
      {
        question: 'What happens to a break we override?',
        answer:
          'The override is recorded with the person, the timestamp and the reason, and it cannot be edited afterwards by anyone including us. The original unmatched state stays in the history, so a point-in-time query still shows what the books said before the correction.',
      },
      {
        question: 'Can we host it ourselves?',
        answer:
          'On Enterprise, yes: your VPC and your KMS key, with no transaction data leaving your account. The alternative most teams take is data residency in their region, which covers the same requirement with none of the operational burden.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'See it against your own data',
    subtitle:
      'Thirty minutes with an engineer and a sample of your ledger. We will show you the breaks you have today, or tell you that you have none — which does happen, and we will say so.',
    fields: { name: 'Your name', email: 'Work email', message: 'Which ledgers are you reconciling?' },
    submit: 'Book a walkthrough',
    details: [
      { label: 'Sales', value: 'sales@cirrus.finance' },
      { label: 'Security', value: 'security@cirrus.finance' },
      { label: 'Trust centre', value: 'trust.cirrus.finance' },
      { label: 'Offices', value: 'London · New York · Singapore' },
    ],
  },

  footer: {
    tagline: 'Continuous reconciliation for finance teams who would rather not have a close.',
    columns: [
      { title: 'Product', links: ['Reconciliation', 'Matching rules', 'Exports', 'Point-in-time', 'Integrations'] },
      { title: 'Trust', links: ['Security', 'Compliance', 'Sub-processors', 'Status', 'Trust centre'] },
      { title: 'Company', links: ['About', 'Customers', 'Careers', 'Press', 'Contact'] },
    ],
    legal: '© 2026 Cirrus Financial Systems Ltd. All figures and charts shown are illustrative sample data.',
  },
};

export const CIRRUS_PROMPT = `Design a five-page website for a financial reconciliation platform called Cirrus, aimed at finance teams at scale-ups.

Visual direction: clean and sleek, built from alignment rather than from a material. Pure white ground, near-black ink, one indigo accent that is safe as type. Structure comes from 1px hairlines at 8% ink, not shadows — there is exactly one shadow token and one element per page may use it. Radii are 6px everywhere including the charts, because a 20px radius on a data panel reads as a consumer app rather than an instrument. All figures are tabular-lining so columns of digits align. Green and red exist only for financial direction, never decoratively, both clear 4.5:1, and each is paired with an arrow glyph so the sign is not carried by hue alone.

Motion: anime.js, precise and quick — 12px of travel, 560ms, out(3), nothing overshoots. The signature is a line chart that draws itself scrubbed to the scrollbar via onScroll({sync}) rather than on a timer, so the reader controls the plot and it reads as data rather than decoration. Set pathLength=1 on the path so draw values are fractions regardless of the data. Under reduced motion the chart renders complete, because a chart that never finishes drawing is a chart with missing data.

Pages: home, product, security, pricing, contact. Security maps every control to a clause (SOC 2, ISO, SOX) and to exportable evidence.

Tone: written for a finance lead who has been sold to before. Concrete, unexcited, and explicit that every number on the page is sample data.`;
