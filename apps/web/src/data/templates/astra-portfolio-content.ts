import {
  Camera,
  Compass,
  Layers,
  MonitorSmartphone,
  PenTool,
  Rocket,
  Shapes,
  Sparkles,
  Wand2,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * ASTRA - content for the single-page, bento-style portfolio.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * This is a SINGLE-PAGE template in the editorial "personal brand" shape: a
 * big portrait hero, a star-punctuated marquee, an about, a BENTO work grid of
 * differently-sized blocks, a featured-writing highlight, services, a stats
 * callout and a closing CTA. It carries more than the shared `TemplateContent`
 * shape to cover those.
 *
 * The persona, projects and figures are ILLUSTRATIVE and authored - a template
 * ships no CMS and no photographs, so the imagery is stood in for by duotone
 * blocks.
 */

export const ASTRA_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: "Let's talk",
} as const;

/** In-page anchors. A single-page site navigates by hash, not by route. */
export const ASTRA_NAV: { id: string; label: string }[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'journal', label: 'Journal' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

/** Headline figures. Illustrative. */
export const ASTRA_STATS = [
  { value: 12, suffix: '', label: 'Years designing' },
  { value: 140, suffix: '+', label: 'Projects launched' },
  { value: 52, suffix: '', label: 'Happy clients' },
  { value: 7, suffix: '', label: 'Awards' },
];

/**
 * One bento block of work. `span` maps to a grid footprint so the layout reads
 * as curated blocks rather than a uniform grid.
 */
export interface AstraProject {
  name: string;
  category: string;
  year: string;
  span: 'lg' | 'wide' | 'tall' | 'sm';
  plate: 'ast-plate-a' | 'ast-plate-b' | 'ast-plate-c';
}

export const ASTRA_PROJECTS: AstraProject[] = [
  { name: 'Lumen Rebrand', category: 'Brand identity', year: '2026', span: 'lg', plate: 'ast-plate-a' },
  { name: 'Orbit Banking', category: 'Product design', year: '2025', span: 'sm', plate: 'ast-plate-b' },
  { name: 'Field Guide', category: 'Editorial', year: '2025', span: 'tall', plate: 'ast-plate-c' },
  { name: 'Nova Store', category: 'E-commerce', year: '2024', span: 'sm', plate: 'ast-plate-b' },
  { name: 'Meridian Motion', category: 'Art direction', year: '2024', span: 'wide', plate: 'ast-plate-a' },
  { name: 'Kelp Packaging', category: 'Packaging', year: '2023', span: 'sm', plate: 'ast-plate-c' },
];

/** One writing highlight. */
export interface AstraJournalEntry {
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
  tag: string;
}

export const ASTRA_JOURNAL: AstraJournalEntry[] = [
  { date: 'Jun 2026', readingTime: '6 min', tag: 'Process', title: 'Design in the open, decide in the room', excerpt: 'Sharing rough work early is the fastest way to a good result, and the scariest, which is exactly why it works.' },
  { date: 'Mar 2026', readingTime: '8 min', tag: 'Craft', title: 'A grid is a promise, not a prison', excerpt: 'The best layouts feel effortless because the grid did the arguing in private, before anyone saw the page.' },
  { date: 'Dec 2025', readingTime: '5 min', tag: 'Career', title: 'On staying a generalist on purpose', excerpt: 'Specialising is safer advice. Being the person who can do the whole thing has, for me, been the more interesting bet.' },
];

/** One service. */
export interface AstraService {
  icon: typeof PenTool;
  title: string;
  body: string;
  deliverables: string[];
}

export const ASTRA_SERVICES: AstraService[] = [
  {
    icon: Shapes,
    title: 'Brand & identity',
    body: 'Marks, type and the system that keeps them coherent when you are not in the room to police it.',
    deliverables: ['Positioning', 'Logo & wordmark', 'Type system', 'Guidelines'],
  },
  {
    icon: MonitorSmartphone,
    title: 'Product & web',
    body: 'Interfaces designed to be built, from the first messy sketch to a system a team can ship against.',
    deliverables: ['UX & flows', 'UI design', 'Design systems', 'Prototypes'],
  },
  {
    icon: Camera,
    title: 'Art direction',
    body: 'Photography, illustration and the standard everything is held to once the project has left my desk.',
    deliverables: ['Direction', 'Commissioning', 'Shoot', 'Retouch'],
  },
  {
    icon: Wand2,
    title: 'Motion',
    body: 'How the work behaves. Title sequences, product motion and the timing that makes it feel like one thing.',
    deliverables: ['Principles', 'Storyboards', 'Animation', 'Delivery'],
  },
];

export const ASTRA_CONTENT: TemplateContent = {
  brand: 'Astra',

  nav: ASTRA_NAV.map((item) => ({ href: `#${item.id}`, label: item.label })),

  hero: {
    badge: 'Nova Kessler, multidisciplinary designer',
    title: 'Design with a',
    titleAccent: 'point of view',
    subtitle:
      'A multidisciplinary designer working across brand, product and motion, for founders and studios who want one person with taste to own the whole thing.',
    ctaPrimary: "Let's talk",
    ctaSecondary: 'See the work',
    stats: [
      { value: 12, suffix: '', label: 'Years designing' },
      { value: 140, suffix: '+', label: 'Projects' },
      { value: 52, suffix: '', label: 'Clients' },
    ],
  },

  marquee: ['Brand', 'Product', 'Motion', 'Art direction', 'Editorial', 'Packaging', 'Identity'],

  about: {
    eyebrow: 'About',
    title: 'A generalist, unapologetically',
    body: [
      'I have spent twelve years refusing to pick a lane. Brand one month, a product interface the next, a motion piece after that, because the interesting problems rarely respect the boundaries between disciplines, and the best solutions borrow from all of them.',
      'What that buys a client is coherence. When one person holds the brand, the product and the way it moves, the seams disappear, and the seams are usually where a project quietly falls apart.',
    ],
    points: [
      'One person across brand, product and motion',
      'Taste, backed by a reason for every decision',
      'Systems, so the work outlives the engagement',
      'Direct, weekly, no account-manager telephone game',
    ],
  },

  services: {
    eyebrow: 'Services',
    title: 'What I can make with you',
    subtitle: 'Four disciplines, one sensibility. Most projects use two of them; the ambitious ones use all four.',
    items: ASTRA_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How I work',
    title: 'Open, fast, decided together',
    subtitle: 'No mystery, no big reveal. You see the work as it forms, and we make the calls in the room.',
    items: [
      { icon: Compass, title: 'Frame', body: 'A short, sharp discovery to agree what winning looks like before anyone opens a design tool.' },
      { icon: PenTool, title: 'Explore', body: 'Directions, rough and plentiful, shown in context, never a single precious option defended to the death.' },
      { icon: Layers, title: 'Refine', body: 'The chosen direction built into a real system, with the unglamorous craft that makes it hold together.' },
      { icon: Rocket, title: 'Ship', body: 'Files, docs and a walkthrough, handed over so the work keeps working after I have gone.' },
      { icon: Sparkles, title: 'Revisit', body: 'A check-in at a few months, on me, to see what drifted and what I got wrong.' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Before you get in touch',
    items: [
      {
        question: 'Do you really do all of that well?',
        answer:
          'Fair question. I do brand, product and motion to a professional standard and I am honest about the edges of what I do. I bring in a specialist when a project genuinely needs one rather than fake it. The value is coherence across the disciplines, not being the single best in the world at any one.',
      },
      {
        question: 'What does a project cost?',
        answer:
          'Most engagements start around €8,000 and run to the mid-five figures depending on scope. I quote the whole project rather than an hourly rate, so good work is not penalised for being done efficiently. Tell me the budget and I will tell you honestly what fits.',
      },
      {
        question: 'How soon can you start?',
        answer:
          'I take a couple of projects at a time and I am straight about the queue. Get in touch with rough timing and I will tell you the real next opening rather than the date you want to hear.',
      },
      {
        question: 'Do you work with in-house teams?',
        answer:
          'Often. I slot in as the senior generalist a small team cannot justify hiring, set the direction and the system, and leave it documented so the team can run with it. No black boxes.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Have something in mind?',
    subtitle:
      'Tell me what it is, when it needs to exist, and roughly the budget. All three, ideally. The third one saves us both a week of dancing around it.',
    fields: { name: 'Your name', email: 'Email', message: 'What are you making?' },
    submit: 'Send it',
    details: [
      { label: 'Email', value: 'hello@astra.studio' },
      { label: 'Based', value: 'Copenhagen · remote worldwide' },
      { label: 'Response', value: 'Usually within a day' },
      { label: 'Elsewhere', value: 'Instagram · Dribbble · Read.cv' },
    ],
  },

  footer: {
    tagline: 'Multidisciplinary design with a point of view.',
    columns: [
      { title: 'Site', links: ['About', 'Work', 'Journal', 'Services', 'Contact'] },
      { title: 'Disciplines', links: ['Brand', 'Product', 'Motion', 'Editorial', 'Packaging'] },
      { title: 'Elsewhere', links: ['Instagram', 'Dribbble', 'Read.cv', 'LinkedIn', 'Newsletter'] },
    ],
    legal: '© 2026 Nova Kessler. Projects shown are illustrative.',
  },
};

export const ASTRA_PROMPT = `Design a single-page personal portfolio for a multidisciplinary designer, in a light, editorial, "bento" style.

Visual direction: light and bold. A warm off-white ground (#f4f2ec), near-black ink, and one confident cobalt accent (#324bff). Big sans-serif display type set tight, a mono for labels, and a recurring STAR / sparkle motif used as a bullet, a section marker and a slowly rotating badge. The layout is block-modular and editorial rather than a dense uniform grid: generous whitespace, hairline rules, curated blocks.

Motion: anime.js v4, plus a couple of CSS ambient touches. The signatures are a BENTO WORK GRID, project blocks of different footprints (a big feature block, a tall one, a wide one, small ones) whose duotone imagery scales gently on hover, and a continuously ROTATING STAR badge. Add a star-punctuated marquee, count-up stats, and reveal / stagger on scroll.

Critical: everything degrades under prefers-reduced-motion: the star stops rotating, the marquee stops, counters render at final value, reveals resolve visible, hover-scale is a nicety not a dependency. Nothing may hide content if the script never runs.

Sections, top to bottom (single page, hash navigation): sticky header with a "Let's talk" CTA; hero with a large portrait block beside the name, role, headline and stats; a star marquee of disciplines; about; a bento work grid; a featured-writing (journal) highlight; four services; a stats callout; a short FAQ; a contact CTA with form; footer.

Tone: a confident generalist with taste. Warm, direct, a point of view. Photography is stood in for by duotone blocks.`;
