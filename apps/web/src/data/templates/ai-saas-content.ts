import {
  Blocks,
  BrainCircuit,
  Gauge,
  GitBranch,
  Layers,
  LineChart,
  Lock,
  MessagesSquare,
  Plug,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * NEBULA - content for a premium, animated AI-SaaS website.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * Eight pages, routed by `?page=` (the site routes itself, so links work in the
 * preview, the gallery iframe, the standalone /websites/ai-saas route and a
 * downloaded project). The identity is neon-on-dark glassmorphism with an
 * animated gradient mesh; the product, logos and figures are ILLUSTRATIVE.
 */

export const NEBULA_PAGES = [
  'home',
  'features',
  'solutions',
  'pricing',
  'integrations',
  'about',
  'blog',
  'contact',
] as const;
export type NebulaPageId = (typeof NEBULA_PAGES)[number];

export const NEBULA_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Get started',
  signIn: 'Sign in',
} as const;

export const NEBULA_NAV: { id: NebulaPageId; label: string }[] = [
  { id: 'features', label: 'Features' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'integrations', label: 'Integrations' },
  { id: 'about', label: 'About' },
  { id: 'blog', label: 'Blog' },
];

/** Every page, home first, for the registry's `pages` (the header nav omits home). */
export const NEBULA_PAGE_META: { id: NebulaPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  ...NEBULA_NAV,
  { id: 'contact', label: 'Contact' },
];

export interface NebulaMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const NEBULA_MASTHEADS: Record<Exclude<NebulaPageId, 'home'>, NebulaMasthead> = {
  features: {
    eyebrow: 'Features',
    title: 'One workspace, every model.',
    subtitle: 'Route to the best model for each task, keep your data in one place, and ship AI features without stitching five tools together.',
  },
  solutions: {
    eyebrow: 'Solutions',
    title: 'Built for the teams that ship.',
    subtitle: 'From support to sales to engineering, Nebula adapts to the work instead of asking your team to adapt to it.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Simple pricing that scales with you.',
    subtitle: 'Start free, scale when it pays off. Every plan includes the full model router and unlimited members.',
  },
  integrations: {
    eyebrow: 'Integrations',
    title: 'Connect the tools you already trust.',
    subtitle: 'A hundred and more native connectors, plus an API and webhooks for the ones we have not built yet.',
  },
  about: {
    eyebrow: 'About',
    title: 'We are building the calm layer over AI.',
    subtitle: 'A small, senior team obsessed with making powerful models feel simple, safe and fast for real teams.',
  },
  blog: {
    eyebrow: 'Blog',
    title: 'Notes from the frontier.',
    subtitle: 'What we are learning about shipping AI in production, without the hype.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Talk to a human, not a bot.',
    subtitle: 'Book a walkthrough or ask us anything. A senior engineer answers, usually within the hour.',
  },
};

/** The animated hero counters. Illustrative. */
export const NEBULA_STATS = [
  { value: 40, suffix: 'M+', label: 'Tasks automated' },
  { value: 99, suffix: '.99%', label: 'Uptime' },
  { value: 4, suffix: 'x', label: 'Faster shipping' },
  { value: 12, suffix: 'K', label: 'Teams onboard' },
];

/** The feature cards. Icons live here, so this module is client-only. */
export const NEBULA_FEATURES: { icon: typeof Blocks; title: string; body: string }[] = [
  { icon: BrainCircuit, title: 'Model router', body: 'Every request lands on the best model for the job, automatically, with a fallback when one is slow.' },
  { icon: Workflow, title: 'Visual workflows', body: 'Chain prompts, tools and data into flows your whole team can read, edit and trust.' },
  { icon: Layers, title: 'One memory layer', body: 'Your docs, tickets and history in a single grounded context, so answers cite the real thing.' },
  { icon: Gauge, title: 'Realtime analytics', body: 'Cost, latency and quality per workflow, streamed live, so nothing surprises you at month end.' },
  { icon: Lock, title: 'Private by default', body: 'Your data is never trained on. Least-privilege access, every call logged, SOC 2 in the box.' },
  { icon: Zap, title: 'Edge fast', body: 'Sub-second responses from a global edge, so the interface never makes anyone wait.' },
];

/** The "how it works" steps. */
export const NEBULA_STEPS: { icon: typeof Blocks; title: string; body: string }[] = [
  { icon: Plug, title: 'Connect', body: 'Link your tools and data in minutes. Nebula grounds every answer in what you already have.' },
  { icon: GitBranch, title: 'Compose', body: 'Drag prompts, models and actions into a workflow. No glue code, no vendor lock-in.' },
  { icon: Sparkles, title: 'Ship', body: 'Publish to an app, an API or your product, and watch cost and quality in one dashboard.' },
];

/** Illustrative integration names for the connector grid. */
export const NEBULA_INTEGRATIONS = [
  'Slack', 'Notion', 'Linear', 'GitHub', 'Figma', 'Segment',
  'Snowflake', 'Zendesk', 'Salesforce', 'HubSpot', 'Stripe', 'Postgres',
];

export interface NebulaPlan {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  featured: boolean;
  cta: string;
}

export const NEBULA_PLANS: NebulaPlan[] = [
  {
    name: 'Starter',
    price: '$0',
    cadence: 'forever',
    blurb: 'For a first project and a small team finding their feet.',
    features: ['Full model router', 'Up to 3 workflows', '10K tasks / month', 'Community support'],
    featured: false,
    cta: 'Start free',
  },
  {
    name: 'Team',
    price: '$49',
    cadence: 'per month',
    blurb: 'For teams shipping AI features to real users.',
    features: ['Unlimited workflows', '1M tasks / month', 'Realtime analytics', 'Priority support', 'SSO & audit log'],
    featured: true,
    cta: 'Start free trial',
  },
  {
    name: 'Scale',
    price: 'Custom',
    cadence: 'per year',
    blurb: 'For platforms with volume, controls and an SLA.',
    features: ['Volume pricing', 'Dedicated edge', 'Private models', 'SOC 2 & DPA', 'Solutions engineer'],
    featured: false,
    cta: 'Talk to us',
  },
];

export const NEBULA_CONTENT: TemplateContent = {
  brand: 'Nebula',

  nav: NEBULA_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'New: the Nebula model router',
    title: 'The AI workspace',
    titleAccent: 'that ships itself.',
    subtitle:
      'Route to any model, ground it in your data, and compose it into workflows your whole team can trust. One calm interface over all of AI.',
    ctaPrimary: 'Start for free',
    ctaSecondary: 'Watch the demo',
    stats: [
      { value: 40, suffix: 'M+', label: 'Tasks automated' },
      { value: 99, suffix: '.99%', label: 'Uptime' },
      { value: 4, suffix: 'x', label: 'Faster shipping' },
    ],
  },

  marquee: ['Northwind', 'Vela', 'Foldwork', 'Cobalt', 'Atlas', 'Meridian', 'Lumen', 'Kepler'],

  about: {
    eyebrow: 'How it works',
    title: 'From connected to shipped, in three moves.',
    body: [
      'Nebula sits between your team and every model, so you stop wiring APIs and start composing outcomes.',
      'Connect your data once, compose a workflow visually, and ship it to an app or an endpoint, with cost and quality in view the whole time.',
    ],
    points: [
      'No glue code between models and tools',
      'Grounded answers that cite your real data',
      'Cost, latency and quality on one dashboard',
      'Your data is never trained on',
    ],
  },

  services: {
    eyebrow: 'Features',
    title: 'Everything you need to ship AI, in one place.',
    subtitle: 'The model router, the memory layer, the workflows and the analytics, designed together so nothing leaks between the seams.',
    items: NEBULA_FEATURES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'Why Nebula',
    title: 'Powerful models, finally calm.',
    subtitle: 'The hard parts, handled, so your team spends its time on the product and not the plumbing.',
    items: [
      { icon: LineChart, title: 'See every dollar', body: 'Cost and quality per workflow, live. No more month-end bill shock.' },
      { icon: Lock, title: 'Safe by default', body: 'Least privilege, full audit trail, SOC 2. Your data stays yours.' },
      { icon: MessagesSquare, title: 'One senior team', body: 'A real engineer answers, usually within the hour, not a chatbot.' },
      { icon: Zap, title: 'Fast everywhere', body: 'Sub-second from a global edge, so the interface never makes anyone wait.' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions, answered.',
    items: [
      { question: 'Do you train on my data?', answer: 'Never. Your data is used only to answer your requests, is encrypted in transit and at rest, and is deletable on demand. Training on customer data is off by design.' },
      { question: 'Which models can I use?', answer: 'All the frontier ones and the good open ones, plus your own. The router picks the best for each task and falls back automatically when one is slow or down.' },
      { question: 'How long does it take to set up?', answer: 'Most teams ship their first workflow in an afternoon. Connect your tools, compose a flow, publish. No glue code, no infrastructure to run.' },
      { question: 'Is there a free plan?', answer: 'Yes. Starter is free forever with the full model router and up to three workflows. You only pay when it is clearly paying off.' },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: "Let's get you set up.",
    subtitle: 'Book a walkthrough or ask us anything. A senior engineer, not a bot, answers, usually within the hour.',
    fields: { name: 'Your name', email: 'Work email', message: 'What are you building?' },
    submit: 'Get a walkthrough',
    details: [
      { label: 'Email', value: 'hello@nebula.ai' },
      { label: 'Sales', value: 'sales@nebula.ai' },
      { label: 'Response', value: 'Within the hour, weekdays' },
      { label: 'Status', value: 'status.nebula.ai' },
    ],
  },

  footer: {
    tagline: 'The calm layer over AI. Route any model, ground it in your data, ship it as a workflow.',
    columns: [
      { title: 'Product', links: ['Features', 'Solutions', 'Pricing', 'Integrations', 'Changelog'] },
      { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
      { title: 'Resources', links: ['Docs', 'API', 'Status', 'Security'] },
    ],
    legal: '© 2026 Nebula, Inc. A template. Product, logos and figures are illustrative.',
  },
};

export const NEBULA_PROMPT = `Design an eight-page website (Home, Features, Solutions, Pricing, Integrations, About, Blog, Contact) for a premium AI-SaaS platform called Nebula - "the calm layer over AI".

Visual direction: neon-on-dark glassmorphism. A near-black indigo ground, a slowly drifting animated GRADIENT MESH (violet #7c5cff, neon cyan #34e5ff, magenta #ff5cf0), frosted-glass panels with hairline borders, big tight sans-serif display with a spaced mono for labels. Floating UI: chips and a live "dashboard" glass panel with animated bars and counters hovering beside the hero.

Motion: Anime.js for scroll reveals, staggered word/letter headline reveals, count-up stats and the animated dashboard; Lenis for buttery smooth scroll; CSS for the ambient gradient-mesh drift and floating glass (transform only, for perf). Magnetic primary buttons, hover-lift glass cards, a section-marker glow.

Critical: everything degrades under prefers-reduced-motion - the mesh and floats stop, counters render final, reveals resolve visible. Nothing hides content if the script never runs.

Sections (Home): sticky glass nav with a Get-started CTA; hero with a badge, a two-line headline whose second line is the accent, subtitle, two CTAs and a floating live dashboard panel over the mesh; a client-logo marquee; animated stat counters; a feature grid of glass cards; a three-step "how it works"; a why/benefits row; an integrations grid; a pricing teaser with three plans; an FAQ; a closing CTA; a footer. Inner pages open with a masthead and recompose the shared sections. Photography is stood in for by gradient/mesh fields.

Tone: confident, precise, calm. Powerful AI made simple. Neon where it earns attention, restraint everywhere else.`;
