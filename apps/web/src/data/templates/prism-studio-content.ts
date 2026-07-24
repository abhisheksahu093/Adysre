import {
  Aperture,
  Boxes,
  Clapperboard,
  Compass,
  Frame,
  Layers,
  MonitorPlay,
  PenTool,
  Shapes,
  Sparkles,
  Type,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * PRISM - content for the creative studio template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * PRISM is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the project list, the process steps, the service
 * ladder and the per-page mastheads.
 *
 * The projects and figures are ILLUSTRATIVE and authored. A template ships no
 * CMS, and a case study implying a real client would be a different problem
 * entirely.
 */

export const PRISM_PAGES = ['home', 'work', 'studio', 'services', 'contact'] as const;
export type PrismPageId = (typeof PRISM_PAGES)[number];

export const PRISM_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
} as const;

export const PRISM_NAV: { id: PrismPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'work', label: 'Work' },
  { id: 'studio', label: 'Studio' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

export interface PrismMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const PRISM_MASTHEADS: Record<Exclude<PrismPageId, 'home'>, PrismMasthead> = {
  work: {
    eyebrow: 'Work',
    title: 'Selected, not everything',
    subtitle:
      'Eight projects we would show you in a room. The rest exists, and we will talk about it if you ask.',
  },
  studio: {
    eyebrow: 'Studio',
    title: 'Eleven people, one room',
    subtitle:
      'We stayed small on purpose. The people you meet at the pitch are the people who do the work, which is a low bar that most studios still fail.',
  },
  services: {
    eyebrow: 'Services',
    title: 'What we are actually good at',
    subtitle:
      'Identity, motion and the systems that keep them alive after we leave. We do not do media buying, and we will tell you who does.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Start something',
    subtitle:
      'Tell us what it is, when it needs to exist, and roughly what you can spend. All three, ideally — the third one saves everybody a fortnight.',
  },
};

/** One project. */
export interface PrismProject {
  name: string;
  client: string;
  year: string;
  disciplines: string[];
  body: string;
  plate: 'pri-plate' | 'pri-plate-b' | 'pri-plate-c';
}

export const PRISM_PROJECTS: PrismProject[] = [
  { name: 'Continuum', client: 'Havlin Type', year: '2026', disciplines: ['Identity', 'Type design'], body: 'A variable typeface and the identity built on it, where the weight axis carries the brand rather than a logo.', plate: 'pri-plate-c' },
  { name: 'Slow Radio', client: 'Nordwelle', year: '2025', disciplines: ['Identity', 'Motion'], body: 'A public broadcaster rebuilt around its archive, with an identity that changes with what is playing.', plate: 'pri-plate' },
  { name: 'Field Notes', client: 'Ostara', year: '2025', disciplines: ['Art direction', 'Web'], body: 'Ten years of research turned into something you could actually read on a train.', plate: 'pri-plate-b' },
  { name: 'Understory', client: 'Kelp Bio', year: '2025', disciplines: ['Identity', 'Packaging'], body: 'A marine biotech that needed to look like a laboratory rather than a wellness brand.', plate: 'pri-plate-c' },
  { name: 'Third Signal', client: 'Meridian Labs', year: '2024', disciplines: ['Motion', 'Film'], body: 'Sixty seconds explaining a thing that takes an engineer forty minutes.', plate: 'pri-plate' },
  { name: 'Groundwork', client: 'Civic Trust', year: '2024', disciplines: ['Design system', 'Web'], body: 'One system across nine councils, built so a non-designer could not make it ugly.', plate: 'pri-plate-b' },
  { name: 'Nocturne', client: 'Aster Records', year: '2024', disciplines: ['Art direction', 'Packaging'], body: 'A reissue series where the sleeve is generated from the waveform of the record inside it.', plate: 'pri-plate-c' },
  { name: 'Longhand', client: 'Pell & Co', year: '2023', disciplines: ['Identity'], body: 'A hundred-year-old bookbinder that wanted to stop looking a hundred years old.', plate: 'pri-plate' },
];

/** One step of the process, plotted along the motion path. */
export interface PrismStep {
  title: string;
  body: string;
}

export const PRISM_PROCESS: PrismStep[] = [
  { title: 'Interrogate', body: 'A fortnight of asking uncomfortable questions before anybody opens a design tool.' },
  { title: 'Position', body: 'One sentence everybody in your company can repeat without reading it off a slide.' },
  { title: 'Make', body: 'Three directions, shown at full size in context, never as a mood board.' },
  { title: 'Hand over', body: 'A system, documented, plus the training so it survives us leaving.' },
];

/** One service. */
export interface PrismService {
  icon: typeof PenTool;
  title: string;
  body: string;
  deliverables: string[];
}

export const PRISM_SERVICES: PrismService[] = [
  {
    icon: Shapes,
    title: 'Identity',
    body: 'The mark, the type, the colour and the rules that keep them coherent when you are not in the room.',
    deliverables: ['Positioning', 'Mark and wordmark', 'Type system', 'Guidelines'],
  },
  {
    icon: Clapperboard,
    title: 'Motion',
    body: 'How the identity behaves. Titles, transitions, product motion and the timing that makes them feel like one thing.',
    deliverables: ['Motion principles', 'Title system', 'Product motion', 'Source files'],
  },
  {
    icon: Layers,
    title: 'Design systems',
    body: 'The version of the brand that lives in code, built so the people using it cannot easily break it.',
    deliverables: ['Component library', 'Tokens', 'Documentation', 'Team training'],
  },
  {
    icon: Frame,
    title: 'Art direction',
    body: 'Photography, illustration and the standard everything is held to once we have gone.',
    deliverables: ['Direction', 'Shoot production', 'Retouch standard', 'Asset library'],
  },
];

/** Studio figures. Illustrative. */
export const PRISM_FACTS = [
  { value: 11, suffix: '', label: 'People' },
  { value: 9, suffix: 'yr', label: 'Years' },
  { value: 62, suffix: '', label: 'Projects' },
  { value: 4, suffix: '', label: 'D&AD pencils' },
];

export const PRISM_CONTENT: TemplateContent = {
  brand: 'Prism',

  nav: PRISM_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Studio — Rotterdam',
    title: 'Brands that',
    titleAccent: 'behave',
    subtitle:
      'An eleven-person studio doing identity, motion and the systems that keep them alive after we hand over.',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Start something',
    stats: [
      { value: 62, suffix: '', label: 'Projects' },
      { value: 9, suffix: 'yr', label: 'Years' },
      { value: 11, suffix: '', label: 'People' },
    ],
  },

  marquee: ['Identity', 'Motion', 'Design systems', 'Art direction', 'Type design', 'Packaging', 'Film'],

  about: {
    eyebrow: 'Studio',
    title: 'Small, and staying that way',
    body: [
      'Eleven people in one room in Rotterdam. We have turned down the growth conversation three times, because every studio we admired got worse at exactly the point it got bigger.',
      'What that buys you is boring and worth a lot: the people who pitch are the people who do the work, and there is nobody to hand your project to when something more interesting arrives.',
    ],
    points: [
      'The people at the pitch do the work',
      'Three directions, always shown in context',
      'Systems documented so they outlive us',
      'We say no to work we would do badly',
    ],
  },

  services: {
    eyebrow: 'Services',
    title: 'What we are actually good at',
    subtitle: 'Four things. We do not do media buying, and we will happily tell you who does.',
    items: PRISM_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How we work',
    title: 'Four steps, in this order, every time',
    subtitle:
      'The order is the method. Skipping the first one is why most rebrands end up being a logo change.',
    items: [
      { icon: Compass, title: 'Interrogate', body: 'A fortnight of uncomfortable questions before anybody opens a design tool.' },
      { icon: Type, title: 'Position', body: 'One sentence your whole company can repeat without reading it off a slide.' },
      { icon: Aperture, title: 'Make', body: 'Three directions, at full size, in context. Never a mood board.' },
      { icon: Boxes, title: 'Hand over', body: 'A documented system plus the training that makes it survive us leaving.' },
      { icon: MonitorPlay, title: 'Stay reachable', body: 'Six months of questions answered at no charge, because that is when they arise.' },
      { icon: Sparkles, title: 'Revisit at a year', body: 'A day, on us, to see what drifted and what we got wrong.' },
    ],
  },

  faq: {
    eyebrow: 'Practical',
    title: 'The questions that come before a brief',
    items: [
      {
        question: 'What does a project cost?',
        answer:
          'Identity work starts around €45,000 and most land between there and €120,000. Motion and systems are quoted separately because their scope varies far more. If your budget is below that, say so anyway — we will tell you honestly whether it is doable and, if not, who does good work at that level.',
      },
      {
        question: 'How long does it take?',
        answer:
          'Ten to sixteen weeks for identity, from kickoff to handover. The variable is almost never us; it is how quickly your side can make decisions. We will tell you at week two whether the timeline is realistic.',
      },
      {
        question: 'Do you work with in-house teams?',
        answer:
          'Most of our best work is that. We build the system and your team runs it, which is why the handover includes training rather than a PDF. If you have no in-house team we will say so early, because a system with nobody to maintain it decays within a year.',
      },
      {
        question: 'Can we see more than the eight projects?',
        answer:
          'Yes, in a room. Some of the work we are proudest of is under embargo or was never public, and a portfolio page is the wrong place for a conversation about it.',
      },
      {
        question: 'Will you do just a logo?',
        answer:
          'No, and not to be difficult. A mark without a position behind it is a drawing, and we would be taking your money for something that will not work. If a mark is genuinely all you need, we can point you at three people who do it beautifully.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Start something',
    subtitle:
      'What it is, when it needs to exist, and roughly what you can spend. All three, ideally — the third one saves everybody a fortnight of dancing.',
    fields: { name: 'Your name', email: 'Email', message: 'What are you making?' },
    submit: 'Send it',
    details: [
      { label: 'New work', value: 'hello@prism.studio' },
      { label: 'Studio', value: 'Katendrecht, Rotterdam' },
      { label: 'Telephone', value: '+31 10 340 88 21' },
      { label: 'Elsewhere', value: 'Instagram · Are.na' },
    ],
  },

  footer: {
    tagline: 'Identity, motion and the systems that keep them alive.',
    columns: [
      { title: 'Studio', links: ['Work', 'Services', 'Process', 'People', 'Contact'] },
      { title: 'Disciplines', links: ['Identity', 'Motion', 'Design systems', 'Art direction', 'Type'] },
      { title: 'Elsewhere', links: ['Instagram', 'Are.na', 'LinkedIn', 'Newsletter', 'Colophon'] },
    ],
    legal: '© 2026 Prism Studio BV. Projects shown are illustrative.',
  },
};

export const PRISM_PROMPT = `Design a five-page website for an eleven-person creative studio in Rotterdam called Prism.

Visual direction: flat black and loud. No glass, no blur, no gradient panels, no shadow — structure comes from type size and full-bleed colour fields. Bone (#f2f0eb) rather than pure white, because #fff on flat black vibrates at display size. One acid accent (#ccff2f) at 16:1, rationed to one use per viewport. Display type runs to 12vw with sharply negative tracking and sub-1 line-height, and those settings live only on the display class because they are wrong at body size. An italic serif is used for one accent word per heading.

Motion: anime.js, and the loudest of any template here. The signature is a scroll-linked TIMELINE rather than independent animations: a process section where a marker travels a curved SVG path via createMotionPath while the path lights up behind it, both on one playhead at position 0 so they can never drift. Also a horizontal work rail — a tall section with a sticky row inside it, translated on the scroll playhead so vertical scrolling becomes horizontal travel. Never call preventDefault; the page scrolls normally throughout, which is the difference between this and scroll-jacking.

Critical: scroll-linked motion moves content, so with prefers-reduced-motion the rail must stop being scrubbed and become an ordinary scrollable row, or three quarters of the work becomes unreachable.

Pages: home, work, studio, services, contact. Work is eight projects with client, year and disciplines. Photography is stood in for by flat two-colour fields with grain.

Tone: a studio that turns work down. Specific, slightly blunt, prices stated out loud.`;
