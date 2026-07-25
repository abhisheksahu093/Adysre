import {
  Building2,
  Clock,
  Gem,
  Globe,
  Handshake,
  PhoneCall,
  Rocket,
  Route,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * CRESTLINE - content for a single-page corporate-services consultancy.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * The shape is a calm, green, "clarity" corporate site: a sticky header with a
 * "Book a Consultation" CTA, a hero with an orbiting service diagram over a
 * quiet particle field, a trusted-by marquee, a value/approach band with a
 * four-step process, numbered services, a dark "why" panel with counters, an
 * FAQ, a contact form and a footer. The firm, figures and logos are
 * ILLUSTRATIVE and authored - a template ships no CMS and no photography.
 */

export const CRESTLINE_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Book a Consultation',
} as const;

/**
 * The pages this template ships. The template routes by `?page=` itself, so the
 * links work identically in the preview, a card iframe and a downloaded project.
 */
export const CRESTLINE_PAGES = ['home', 'about', 'services', 'contact'] as const;
export type CrestlinePageId = (typeof CRESTLINE_PAGES)[number];

export const CRESTLINE_NAV: { id: CrestlinePageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About Us' },
  { id: 'services', label: 'Our Services' },
  { id: 'contact', label: 'Contact Us' },
];

/** The header that opens every page except home. */
export interface CrestlineMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const CRESTLINE_MASTHEADS: Record<Exclude<CrestlinePageId, 'home'>, CrestlineMasthead> = {
  about: {
    eyebrow: 'About us',
    title: 'A senior team built around one simple idea.',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
  },
  services: {
    eyebrow: 'Our services',
    title: 'Focused expertise, senior throughout.',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. A small set of services we know well.',
  },
  contact: {
    eyebrow: 'Contact',
    title: "Tell us where you're headed.",
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Book a consultation and we will tell you honestly how we can help.',
  },
};

/** The four principles, for the About page. */
export const CRESTLINE_VALUES: { icon: typeof Building2; title: string; body: string }[] = [
  { icon: Gem, title: 'Integrity', body: 'Straight answers and no hidden agenda. We tell you what we would do in your position.' },
  { icon: Target, title: 'Precision', body: 'Careful, checked work. The details are where corporate services quietly go wrong.' },
  { icon: Handshake, title: 'Partnership', body: 'We are on your side of the table, invested in the outcome rather than the billable hour.' },
  { icon: Rocket, title: 'Momentum', body: 'We keep things moving. Clear next steps after every conversation, every time.' },
];

/** The service pills that orbit the hero figure. Illustrative. */
export const CRESTLINE_ORBIT: { icon: typeof Building2; label: string }[] = [
  { icon: Building2, label: 'Corporate Structuring' },
  { icon: Globe, label: 'Cross-Border Advisory' },
  { icon: ShieldCheck, label: 'Compliance & Governance' },
];

/** The reassurances under the hero CTAs. */
export const CRESTLINE_CHECKS = ['No lock-in contracts', 'Senior-led teams', 'Fixed-fee clarity'];

/** The central hero card figure. */
export const CRESTLINE_HERO_STAT = { brand: 'CRESTLINE', value: 100, suffix: '%', caption: 'senior-led' };

/** The four numbered services. Icons live here, so this module is client-only. */
export const CRESTLINE_SERVICES: { icon: typeof Building2; title: string; body: string }[] = [
  {
    icon: Building2,
    title: 'Corporate Structuring & Setup',
    body: 'Entity design, incorporation and holding structures. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    icon: Globe,
    title: 'Cross-Border Expansion',
    body: 'Structured support for entering new markets with confidence. Sed do eiusmod tempor incididunt ut labore.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance & Governance',
    body: 'Filings, policies and the controls that keep you audit-ready. Ut enim ad minim veniam, quis nostrud.',
  },
  {
    icon: TrendingUp,
    title: 'Operations Advisory',
    body: 'Payments, scalability and the numbers behind the roadmap. Duis aute irure dolor in reprehenderit.',
  },
];

/** The four-step engagement process. */
export const CRESTLINE_STEPS: { title: string; body: string }[] = [
  { title: 'Discovery Call', body: 'A short, sharp conversation to understand where you are and where you want to be.' },
  { title: 'Tailored Proposal', body: 'A fixed-fee plan with clear scope, milestones and the senior people who will do the work.' },
  { title: 'Onboarding', body: 'We fold into your team fast, gather what we need once, and get moving without the churn.' },
  { title: 'Ongoing Partnership', body: 'A steady rhythm of reviews and advice, so the complicated parts stay simple over time.' },
];

/** The counters on the dark "why" panel. Illustrative. */
export const CRESTLINE_STATS = [
  { value: 24, suffix: 'h', label: 'Response time' },
  { value: 100, suffix: '%', label: 'Senior-led teams' },
  { value: 12, suffix: '', label: 'Years advising' },
  { value: 40, suffix: '+', label: 'Clients served' },
];

export const CRESTLINE_CONTENT: TemplateContent = {
  brand: 'Crestline',

  nav: CRESTLINE_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Corporate services, simplified',
    title: 'Clarity at every',
    titleAccent: 'level.',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.',
    ctaPrimary: 'Book a Consultation',
    ctaSecondary: 'Explore Services',
    stats: [
      { value: 24, suffix: 'h', label: 'Response time' },
      { value: 100, suffix: '%', label: 'Senior-led' },
      { value: 40, suffix: '+', label: 'Clients' },
    ],
  },

  marquee: ['Northwind', 'Vela Group', 'Harbor & Co', 'Meridian', 'Foldwork', 'Cobalt', 'Atlas Retail'],

  about: {
    eyebrow: 'Our approach',
    title: 'Clarity at every level, from the first call to a long-term partnership.',
    body: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore. We keep the complicated parts simple, so your team can spend its time on the work that moves the business.',
    ],
    points: [
      'One senior team from first call to delivery',
      'Fixed-fee clarity, no surprise invoices',
      'Structured onboarding that respects your time',
      'A steady rhythm of reviews and advice',
    ],
  },

  services: {
    eyebrow: 'Our services',
    title: "Everything you need, nothing you don't.",
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    items: CRESTLINE_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'Why Crestline',
    title: 'A partner that keeps the complicated parts simple.',
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore.',
    items: [
      { icon: Target, title: 'Straight to the point', body: 'Clear advice, no jargon and no billable-hour theatre. You always know where you stand.' },
      { icon: ShieldCheck, title: 'Built on trust', body: 'Discreet, senior and accountable. The people you meet are the people who do the work.' },
      { icon: Clock, title: 'Always on time', body: 'A twenty-four hour response promise and deadlines we treat as commitments, not hopes.' },
      { icon: Users, title: 'One senior team', body: 'No account-manager telephone game. One team owns your engagement end to end.' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions, answered.',
    items: [
      {
        question: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?',
        answer:
          'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
      {
        question: 'Sed do eiusmod tempor incididunt ut labore et dolore?',
        answer:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
      },
      {
        question: 'Ut enim ad minim veniam, quis nostrud exercitation?',
        answer:
          'Sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
      },
      {
        question: 'Duis aute irure dolor in reprehenderit in voluptate?',
        answer:
          'Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: "Let's talk about what's next.",
    subtitle:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tell us where you are headed and we will tell you honestly how we can help.',
    fields: { name: 'Your name', email: 'Work email', message: 'How can we help?' },
    submit: 'Book a Consultation',
    details: [
      { label: 'Email', value: 'hello@crestline.co' },
      { label: 'Offices', value: 'Chicago · London · Singapore' },
      { label: 'Response', value: 'Within 24 hours' },
      { label: 'Hours', value: 'Mon to Fri, 9 to 6' },
    ],
  },

  footer: {
    tagline: 'Corporate advisory, compliance and management services, made clear.',
    columns: [
      { title: 'Company', links: ['Home', 'About Us', 'Our Services', 'Contact Us'] },
      { title: 'Services', links: ['Corporate Structuring', 'Cross-Border Expansion', 'Compliance', 'Operations Advisory'] },
      { title: 'Get in touch', links: ['hello@crestline.co', '+1 (312) 555 0140', 'Chicago', 'London'] },
    ],
    legal: '© 2026 Crestline Advisory. A template. Figures and clients are illustrative.',
  },
};

/** Icons for the process steps, paired to CRESTLINE_STEPS by index. */
export const CRESTLINE_STEP_ICONS = [PhoneCall, Route, Rocket, Users];

export const CRESTLINE_PROMPT = `Design a four-page website (Home, About Us, Our Services, Contact Us) for a corporate-services consultancy called Crestline, in a calm, trustworthy, "clarity" style.

Visual direction: light and confident. A white ground, near-black green-tinted ink, and one deep forest-green accent (#157e49). Big tight sans-serif display type, a spaced mono for eyebrows and labels, generous whitespace and hairline rules. The signature is a quiet, animated PARTICLE / dot field behind the hero and one ORBITING service diagram: concentric rings with floating service pills circling a central "100% senior-led" card.

Motion: anime.js v4, plus a couple of CSS ambient touches. Reveal and stagger on scroll, count-up stats, the slowly rotating orbit ring, and the drifting particle field. A dark forest-green "why" panel carries large counters (24h response, 100% senior-led).

Critical: everything degrades under prefers-reduced-motion: the orbit and particles stop, counters render at their final value, reveals resolve visible. Nothing may hide content if the script never runs.

Pages (navigated by ?page=, the template routes itself so links work in any host): Home is the hero, a "trusted by" marquee, an approach band with a four-step engagement process, four numbered service cards, a dark "why" panel with counters and reasons, an FAQ and a contact CTA. About, Services and Contact each open with a page masthead (eyebrow, big title, subtitle) and recompose the shared sections; About adds a four-value grid. Sticky header that gains a blur on scroll, with a "Book a Consultation" CTA; hero with a badge, a two-line headline whose second word is the accent, subtitle, two CTAs, three reassurance checks, and the orbit figure; a footer with Company / Services / Get in touch columns.

Tone: senior, discreet, plain-spoken. Corporate services made simple. Photography is stood in for by soft green gradient fields.`;
