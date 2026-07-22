import { Activity, Boxes, Brain, GaugeCircle, LineChart, Lock, Radar, Workflow } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * NOVA - content for the AI analytics template.
 *
 * The template's own copy, in English, deliberately untranslated: it is part of
 * the artifact a visitor downloads and rewrites (see `types.ts`). Sections read
 * from here and hold no strings, so this file is the only place the product's
 * story is told.
 */
export const NOVA_CONTENT: TemplateContent = {
  brand: 'Nova',

  nav: [
    { href: '#about', label: 'About' },
    { href: '#services', label: 'Platform' },
    { href: '#why', label: 'Why Nova' },
    { href: '#faq', label: 'FAQ' },
  ],

  hero: {
    badge: 'Now with streaming anomaly detection',
    title: 'Every metric your team argues about,',
    titleAccent: 'settled in one place',
    subtitle:
      'Nova reads your warehouse, watches every pipeline and tells you what changed before the dashboard does. No cron jobs, no guesswork, no 2am pages.',
    ctaPrimary: 'Start free trial',
    ctaSecondary: 'Watch the 2-min tour',
    stats: [
      { value: 4, suffix: 'x', label: 'Faster root cause' },
      { value: 92, suffix: '%', label: 'Alerts that matter' },
      { value: 30, suffix: 'B', label: 'Rows scanned daily' },
    ],
  },

  marquee: ['Snowflake', 'BigQuery', 'Databricks', 'dbt', 'Kafka', 'Postgres', 'Looker', 'Segment'],

  about: {
    eyebrow: 'About us',
    title: 'We built the tool our own data team kept asking for',
    body: [
      'Nova started inside a fintech data platform, where seven analysts spent their mornings reconciling numbers that should have agreed. The dashboards were fine. The pipelines were fine. Nobody could say which one had moved.',
      'So we wrote a service that watched the warehouse itself - every table, every freshness window, every silent schema change - and explained the delta in plain language. Four years later that service is Nova.',
    ],
    points: [
      'Founded by data engineers, not dashboard vendors',
      'SOC 2 Type II, audited annually',
      'Deploys in your own VPC in under an hour',
    ],
  },

  services: {
    eyebrow: 'The platform',
    title: 'Four surfaces, one source of truth',
    subtitle:
      'Each piece works on its own. Together they close the loop from a raw table to the decision someone makes on Monday.',
    items: [
      {
        icon: Radar,
        title: 'Signal detection',
        body: 'Streaming models learn each metric’s normal rhythm and flag the break, not the noise. Seasonality and launches included.',
      },
      {
        icon: Workflow,
        title: 'Lineage graph',
        body: 'Trace any number back through every join, model and source. Click a node to see exactly which commit changed it.',
      },
      {
        icon: Brain,
        title: 'Narrative reports',
        body: 'Nova writes the weekly summary your stakeholders actually read, with the caveats an analyst would have added.',
      },
      {
        icon: Boxes,
        title: 'Warehouse-native',
        body: 'Runs where your data already lives. Nothing is copied out, nothing is cached in someone else’s cloud.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Nova',
    title: 'Built for the team that gets paged',
    subtitle: 'Four decisions we made early that you will feel on your first bad morning.',
    items: [
      {
        icon: GaugeCircle,
        title: 'Answers in seconds',
        body: 'Incident context loads in under two seconds against a 30-billion-row warehouse, because detection runs beside the data.',
      },
      {
        icon: Lock,
        title: 'Your perimeter, your keys',
        body: 'Self-hosted or in-VPC by default. Nova never needs egress to read a row, and every query is logged for audit.',
      },
      {
        icon: LineChart,
        title: 'Fewer, better alerts',
        body: 'Teams that switch to Nova cut alert volume by 92% in the first month, without losing a single real incident.',
      },
      {
        icon: Activity,
        title: 'Adopted, not installed',
        body: 'A guided first week walks each analyst through their own tables. Median time to first caught incident: four days.',
      },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'The questions procurement always asks',
    items: [
      {
        question: 'Does Nova move our data anywhere?',
        answer:
          'No. Detection runs as scheduled queries inside your own warehouse, and only aggregate statistics leave it. In self-hosted mode nothing leaves at all.',
      },
      {
        question: 'How long does a proof of concept take?',
        answer:
          'Most teams connect a warehouse in about forty minutes and see their first real anomaly inside a week. We do not gate the trial on a sales call.',
      },
      {
        question: 'What happens to our existing dashboards?',
        answer:
          'They stay exactly where they are. Nova annotates them - it is the layer that explains why a chart moved, not a replacement for the chart.',
      },
      {
        question: 'Can we bring our own models?',
        answer:
          'Yes. Every detector is a Python class with a documented interface, so you can register your own alongside the built-in ones.',
      },
      {
        question: 'How is Nova priced?',
        answer:
          'Per monitored table, billed monthly, with a flat cap once you pass a thousand. No per-seat pricing - analysts should not have to ration access.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Talk to an engineer, not a rep',
    subtitle:
      'Tell us what broke last quarter and we will show you what Nova would have caught. Replies come from the people who build it, usually the same day.',
    fields: { name: 'Full name', email: 'Work email', message: 'What are you trying to fix?' },
    submit: 'Send message',
    details: [
      { label: 'Email', value: 'hello@nova.example' },
      { label: 'Sales', value: '+1 (415) 555-0134' },
      { label: 'Office', value: '312 Bryant St, San Francisco' },
    ],
  },

  footer: {
    tagline: 'Warehouse-native analytics monitoring for teams who own their numbers.',
    columns: [
      { title: 'Product', links: ['Signal detection', 'Lineage graph', 'Narrative reports', 'Changelog'] },
      { title: 'Company', links: ['About', 'Careers', 'Customers', 'Security'] },
      { title: 'Resources', links: ['Docs', 'API reference', 'Status', 'Community'] },
    ],
    legal: '© 2026 Nova Analytics, Inc. All rights reserved.',
  },
};

/** The prompt a visitor copies to generate a page in this spirit. */
export const NOVA_PROMPT = `Design a single-page marketing website for a warehouse-native data analytics product called Nova.

Art direction:
- Near-black background (#05060a) with a soft violet-to-cyan gradient mesh behind the hero, and a faint dotted grid overlay.
- Glassmorphic cards: 1px translucent white borders, heavy blur, very low-opacity fills.
- Type: a tight geometric sans for headings with -0.03em tracking, and a monospace face for eyebrows, stat values and labels, uppercase with wide tracking.
- Accent colours: violet #7c5cff and cyan #22d3ee, used only for gradients, focus rings and one primary button. Everything else is white at 40-70% opacity.

Sections in order: sticky blurred header with anchor nav, hero with badge + two-line headline + subtext + two CTAs + three animated counters, a scrolling logo marquee, about with a two-column story and a checklist, a four-card platform grid, a "why us" grid with numbered cards, an accordion FAQ, a contact section with a form beside contact details, and a footer with three link columns.

Motion: sections fade and rise 16px as they enter the viewport, counters count up once, the marquee scrolls infinitely, cards lift slightly on hover, and everything collapses to static under prefers-reduced-motion.

Voice: specific and technical. Real numbers, no placeholder copy, no exclamation marks.`;
