import {
  Boxes,
  Braces,
  Cpu,
  Database,
  GitBranch,
  Gauge,
  Layers,
  LineChart,
  Lock,
  Radar,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * HALCYON - content for the AI platform template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * HALCYON is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the capability grid, the model roster, the pricing
 * ladder and the per-page mastheads. Those extras are typed locally rather than
 * pushed into `types.ts`, because "tokens per second" is this template's
 * domain, not every template's.
 *
 * Every figure below is ILLUSTRATIVE and authored, not fetched. A template
 * ships no network layer, and a metrics panel that implied live numbers would
 * be dishonest, so the copy says so where a reader might wonder.
 */

/** The pages the template can render. `home` is what an unknown id falls back to. */
export const HALCYON_PAGES = ['home', 'platform', 'pricing', 'about', 'contact'] as const;
export type HalcyonPageId = (typeof HALCYON_PAGES)[number];

/** Chrome the template renders itself, kept out of the content object. */
export const HALCYON_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  currentPage: 'Current page',
} as const;

export const HALCYON_NAV: { id: HalcyonPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'platform', label: 'Platform' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

/** A page's opening band: what it is, in one line. */
export interface HalcyonMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const HALCYON_MASTHEADS: Record<Exclude<HalcyonPageId, 'home'>, HalcyonMasthead> = {
  platform: {
    eyebrow: 'The platform',
    title: 'One control plane for every model you run',
    subtitle:
      'Routing, evaluation, caching and observability in a single layer, so switching providers is a config change rather than a migration.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Pay for what you serve',
    subtitle:
      'Per-token pricing with no seat minimum. Every plan includes the full platform; the tiers differ in throughput, retention and support.',
  },
  about: {
    eyebrow: 'About',
    title: 'We build the boring layer under the interesting part',
    subtitle:
      'A team of infrastructure engineers who kept rebuilding the same routing and evaluation stack, and decided to make it once, properly.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Tell us what you are building',
    subtitle:
      'An engineer answers, not a form queue. Most teams are running inference through Halcyon within a day.',
  },
};

/** One capability in the platform grid. */
export interface HalcyonCapability {
  icon: typeof Cpu;
  title: string;
  body: string;
  /** The one number that makes the claim concrete. */
  metric: string;
  metricLabel: string;
}

export const HALCYON_CAPABILITIES: HalcyonCapability[] = [
  {
    icon: Radar,
    title: 'Adaptive routing',
    body: 'Send each request to the model that answers it best, scored on live quality and cost rather than a fixed preference order.',
    metric: '38%',
    metricLabel: 'median cost reduction',
  },
  {
    icon: Gauge,
    title: 'Semantic caching',
    body: 'Cache on meaning, not on string equality, so paraphrased questions hit the same entry and never reach a model.',
    metric: '4.1x',
    metricLabel: 'effective hit rate',
  },
  {
    icon: LineChart,
    title: 'Continuous evaluation',
    body: 'Every deployment replays your graded set before it takes traffic, and rolls back on its own if quality drops.',
    metric: '2,400',
    metricLabel: 'graded cases per run',
  },
  {
    icon: Workflow,
    title: 'Structured pipelines',
    body: 'Compose retrieval, tools and generation as a typed graph. Each node is independently versioned, cached and traced.',
    metric: '11ms',
    metricLabel: 'orchestration overhead',
  },
  {
    icon: Database,
    title: 'Managed retrieval',
    body: 'Chunking, embedding and reranking behind one endpoint, with incremental reindexing as your corpus changes.',
    metric: '92%',
    metricLabel: 'recall @ 10',
  },
  {
    icon: ShieldCheck,
    title: 'Policy enforcement',
    body: 'Redaction, jailbreak detection and per-tenant rate limits applied at the edge, before a prompt reaches a provider.',
    metric: '0',
    metricLabel: 'prompts stored by default',
  },
];

/** A model available through the router. */
export interface HalcyonModel {
  name: string;
  vendor: string;
  context: string;
  /** Illustrative latency, first token. */
  latency: string;
  strengths: string[];
}

export const HALCYON_MODELS: HalcyonModel[] = [
  { name: 'Meridian 3 Opus', vendor: 'Meridian', context: '400k', latency: '480ms', strengths: ['Reasoning', 'Long context'] },
  { name: 'Meridian 3 Flash', vendor: 'Meridian', context: '200k', latency: '120ms', strengths: ['Throughput', 'Cost'] },
  { name: 'Kestrel L', vendor: 'Northwind', context: '128k', latency: '260ms', strengths: ['Code', 'Tools'] },
  { name: 'Kestrel S', vendor: 'Northwind', context: '64k', latency: '90ms', strengths: ['Classification'] },
  { name: 'Atlas Vision', vendor: 'Atlas', context: '96k', latency: '540ms', strengths: ['Vision', 'Documents'] },
  { name: 'Ember 7B', vendor: 'Self-hosted', context: '32k', latency: '40ms', strengths: ['Private', 'Edge'] },
];

/** One tier on the pricing page. */
export interface HalcyonPlan {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: string[];
  cta: string;
  /** Renders the tier as the recommended one. Exactly one should be true. */
  featured?: boolean;
}

export const HALCYON_PLANS: HalcyonPlan[] = [
  {
    name: 'Build',
    price: '$0',
    cadence: 'to start',
    summary: 'For prototypes and the first production workload.',
    features: [
      '1M tokens included each month',
      'Adaptive routing across 6 models',
      'Semantic cache, 7-day retention',
      'Community support',
    ],
    cta: 'Start building',
  },
  {
    name: 'Scale',
    price: '$0.40',
    cadence: 'per 1M tokens',
    summary: 'For teams serving real traffic with a quality bar.',
    features: [
      'Unlimited throughput',
      'Continuous evaluation and auto-rollback',
      'Managed retrieval, 90-day retention',
      'Private models and BYO keys',
      'Slack channel with an engineer',
    ],
    cta: 'Start free trial',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'annual',
    summary: 'For regulated workloads and dedicated capacity.',
    features: [
      'Everything in Scale',
      'VPC or on-premise deployment',
      'SOC 2 Type II, HIPAA, data residency',
      'Reserved capacity and volume pricing',
      '99.99% uptime SLA',
    ],
    cta: 'Talk to us',
  },
];

/** A milestone on the about page. */
export interface HalcyonMilestone {
  year: string;
  title: string;
  body: string;
}

export const HALCYON_MILESTONES: HalcyonMilestone[] = [
  { year: '2022', title: 'The third rewrite', body: 'Two of us had built the same routing and evaluation layer at three companies. We stopped and wrote it once.' },
  { year: '2023', title: 'First production traffic', body: 'A support product moved its whole inference path across in an afternoon. It is still running on it.' },
  { year: '2024', title: 'Evaluation shipped', body: 'Replaying a graded set before every deploy turned out to matter more than routing. It became the default.' },
  { year: '2025', title: 'Self-hosted models', body: 'The router stopped caring where a model lives. Your own weights on your own hardware became one more route.' },
];

/** Named figures on the about page. Illustrative. */
export const HALCYON_FACTS = [
  { value: 41, suffix: '', label: 'Engineers' },
  { value: 9, suffix: '', label: 'Countries' },
  { value: 1200, suffix: '+', label: 'Teams building' },
  { value: 99, suffix: '.99%', label: 'Uptime, trailing year' },
];

export const HALCYON_CONTENT: TemplateContent = {
  brand: 'Halcyon',

  nav: HALCYON_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Now routing to self-hosted models',
    title: 'Ship AI features',
    titleAccent: 'without the plumbing',
    subtitle:
      'Halcyon is the control plane between your product and every model you use. Route, cache, evaluate and observe from one typed API, and change providers without changing code.',
    ctaPrimary: 'Start building',
    ctaSecondary: 'Read the docs',
    stats: [
      { value: 38, suffix: '%', label: 'Lower cost per request' },
      { value: 11, suffix: 'ms', label: 'Routing overhead' },
      { value: 1200, suffix: '+', label: 'Teams building' },
    ],
  },

  marquee: [
    'Adaptive routing',
    'Semantic cache',
    'Continuous evaluation',
    'Managed retrieval',
    'Policy enforcement',
    'Typed pipelines',
    'Full-trace observability',
  ],

  about: {
    eyebrow: 'Why Halcyon',
    title: 'The model is the easy part',
    body: [
      'Getting a good answer from a model takes an afternoon. Getting a good answer every time, at a price you can defend, from a provider you can replace, is the part that takes a year.',
      'Halcyon is that year, already done. It sits between your product and the models, and it is the only thing your code talks to.',
    ],
    points: [
      'One API across every provider and your own weights',
      'Quality measured continuously, not argued about',
      'Costs that fall as the router learns your traffic',
      'No prompt or completion stored unless you ask',
    ],
  },

  services: {
    eyebrow: 'Platform',
    title: 'Everything between the request and the answer',
    subtitle:
      'Six systems that most teams end up building badly. They are the product, not add-ons, and every plan includes all of them.',
    items: HALCYON_CAPABILITIES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How it fits',
    title: 'A day to adopt, not a quarter',
    subtitle:
      'Halcyon is a base URL and a key. Point your existing client at it and nothing else has to change on the first day.',
    items: [
      { icon: Braces, title: 'Drop-in compatible', body: 'Speaks the API your SDK already speaks. Change the base URL and your calls keep working.' },
      { icon: GitBranch, title: 'Versioned everything', body: 'Prompts, pipelines and routing policies are versioned artifacts you can diff, review and roll back.' },
      { icon: Layers, title: 'Bring your own models', body: 'A self-hosted checkpoint is just another route, scored and cached like any hosted one.' },
      { icon: Lock, title: 'Private by default', body: 'Nothing is retained unless you turn retention on. Redaction runs before a prompt leaves your VPC.' },
      { icon: Zap, title: 'Fails to a good answer', body: 'A provider outage reroutes mid-flight. Your users see a slower response, not an error page.' },
      { icon: Boxes, title: 'One bill', body: 'Every provider, your own capacity and the platform on a single invoice, broken down per feature.' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'The things engineers ask first',
    items: [
      {
        question: 'Do I have to rewrite my prompts?',
        answer:
          'No. Halcyon accepts the request shape your SDK already sends. Routing, caching and evaluation happen around your prompt, not to it. Prompt management exists if you want it, and is entirely optional.',
      },
      {
        question: 'What happens when a provider goes down?',
        answer:
          'The router detects the failure on the failing request and reissues it to the next-best model within the same call. Your application sees one slower response rather than an error, and the incident shows up in the trace.',
      },
      {
        question: 'How do you decide which model is "best"?',
        answer:
          'From your graded set, not ours. You supply examples with expected outcomes; every candidate model is scored against them continuously, and routing weights follow those scores alongside live latency and cost.',
      },
      {
        question: 'Can we run this in our own cloud?',
        answer:
          'Yes, on the Enterprise plan. The control plane runs in your VPC and no request data leaves it. The same deployment supports data residency requirements in the EU, UK and Australia.',
      },
      {
        question: 'Is anything stored?',
        answer:
          'Not by default. Prompts and completions pass through and are discarded; only metadata needed for billing and metrics is kept. Retention is opt-in per project, and redaction runs before storage when you enable it.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us what you are building',
    subtitle:
      'An engineer reads every message. If you are moving an existing workload across, mention the provider and we will send the migration notes for it.',
    fields: { name: 'Your name', email: 'Work email', message: 'What are you building?' },
    submit: 'Send message',
    details: [
      { label: 'Email', value: 'engineering@halcyon.dev' },
      { label: 'Docs', value: 'docs.halcyon.dev' },
      { label: 'Status', value: 'status.halcyon.dev' },
      { label: 'Office', value: 'Lisbon, remote-first' },
    ],
  },

  footer: {
    tagline: 'The control plane between your product and every model you use.',
    columns: [
      { title: 'Platform', links: ['Routing', 'Caching', 'Evaluation', 'Retrieval', 'Observability'] },
      { title: 'Developers', links: ['Documentation', 'API reference', 'Changelog', 'Status', 'SDKs'] },
      { title: 'Company', links: ['About', 'Careers', 'Security', 'Privacy', 'Contact'] },
    ],
    legal: '© 2026 Halcyon Systems. Figures shown are illustrative.',
  },
};

/**
 * The prompt that reproduces this template, offered on the detail dialog.
 * Written as a brief rather than a description, because that is what a model
 * responds to.
 */
export const HALCYON_PROMPT = `Design a five-page website for an AI infrastructure company called Halcyon that sits between a product and the models it calls.

Visual direction: glassmorphism done seriously. A deep blue-black ground with a slow-moving four-colour gradient mesh behind everything, and frosted panels floating on it — 7-11% white fill, a 1px light top edge, one blur layer deep, never stacked. Violet is the brand, with cyan and magenta only inside gradients and glows. Inter for type, tight tracking on display sizes, a mono micro-label above each section.

Motion: anime.js throughout. Sections fade, rise and unblur once as they enter the viewport. The mesh is parallaxed to scroll and drifts on a long alternating loop, using transforms only. Counters count up when scrolled to. Everything collapses to no motion under prefers-reduced-motion.

Pages: home, platform, pricing, about, contact. Home carries a hero with three live-looking metrics, a capability grid, a comparison of the routing decision, an FAQ and a contact band. Keep body copy off the mesh and on panels so contrast holds.

Tone: engineers writing for engineers. Concrete numbers, no adjectives about being revolutionary.`;
