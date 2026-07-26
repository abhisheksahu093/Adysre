import {
  BookOpen,
  Compass,
  Layers,
  PenTool,
  Ruler,
  ScanEye,
  Shapes,
  Sparkles,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * MARFA - content for the editorial art-director portfolio.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * MARFA is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the project list, the essays, the service ladder and
 * the per-page mastheads.
 *
 * Projects, clients and figures are ILLUSTRATIVE and authored. A template ships
 * no CMS, and an implied real commission would be a different problem.
 */

export const MARFA_PAGES = ['home', 'work', 'studio', 'words', 'contact'] as const;
export type MarfaPageId = (typeof MARFA_PAGES)[number];

export const MARFA_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Enquire',
} as const;

export const MARFA_NAV: { id: MarfaPageId; label: string }[] = [
  { id: 'home', label: 'Index' },
  { id: 'work', label: 'Work' },
  { id: 'studio', label: 'Studio' },
  { id: 'words', label: 'Words' },
  { id: 'contact', label: 'Contact' },
];

export interface MarfaMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const MARFA_MASTHEADS: Record<Exclude<MarfaPageId, 'home'>, MarfaMasthead> = {
  work: {
    eyebrow: 'Work, 2018 to 2026',
    title: 'Six long collaborations',
    subtitle:
      'Art direction and editorial design for people who make things slowly. Each of these ran for a year or more, because the good ones always do.',
  },
  studio: {
    eyebrow: 'Studio',
    title: 'A desk, a light table, time',
    subtitle:
      'An independent art director working across print, identity and the occasional screen. I take few projects and give each one an unreasonable amount of attention.',
  },
  words: {
    eyebrow: 'Words',
    title: 'On making things well',
    subtitle:
      'Short essays on typography, editing and the quiet parts of the craft. Written when there is something worth saying, which is rarer than a blog schedule would suggest.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Begin a conversation',
    subtitle:
      'Art direction, editorial and identity, for a small number of projects a year. Tell me what you are making and roughly when; I will tell you honestly if it is a fit.',
  },
};

/** One project. */
export interface MarfaProject {
  name: string;
  client: string;
  category: string;
  year: string;
  body: string;
  plate: 'mar-plate-a' | 'mar-plate-b' | 'mar-plate-c';
}

export const MARFA_PROJECTS: MarfaProject[] = [
  { name: 'The Slow Issue', client: 'Fathom Quarterly', category: 'Editorial', year: '2026', body: 'A 220-page magazine about doing less, better. Set in a single typeface across four weights, with a grid you can feel but never see.', plate: 'mar-plate-a' },
  { name: 'Salt & Stone', client: 'Maison Rivé', category: 'Identity', year: '2025', body: 'An identity for a coastal ceramicist, drawn from the marks a kiln leaves. The wordmark took eleven versions; the eleventh was the first one, refined.', plate: 'mar-plate-b' },
  { name: 'Marginalia', client: 'Peridot Press', category: 'Book design', year: '2025', body: 'A series of essay collections where the footnotes are the design. Reading them is meant to feel like being lent someone’s annotated copy.', plate: 'mar-plate-c' },
  { name: 'Fieldwork', client: 'The Aral Trust', category: 'Art direction', year: '2024', body: 'Ten years of environmental research turned into an exhibition and a book, art-directed so the data never once got in the way of the story.', plate: 'mar-plate-a' },
  { name: 'Common Ground', client: 'Borough Assembly', category: 'Identity', year: '2023', body: 'A civic identity flexible enough for nine departments and strict enough that none of them could make it ugly.', plate: 'mar-plate-b' },
  { name: 'Verso', client: 'Aster & Vine', category: 'Editorial', year: '2022', body: 'A wine merchant’s annual, printed letterpress, where the tasting notes are set like poetry because, read aloud, that is what they are.', plate: 'mar-plate-c' },
];

/** One essay. */
export interface MarfaEssay {
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
}

export const MARFA_ESSAYS: MarfaEssay[] = [
  { date: 'May 2026', readingTime: '7 min', title: 'The grid you are meant to feel, never see', excerpt: 'A good grid is scaffolding, not architecture. The moment a reader notices it, it has failed at the one thing it was there to do.' },
  { date: 'Feb 2026', readingTime: '5 min', title: 'In praise of a single typeface', excerpt: 'Most projects need one family and the discipline to use its range. Reaching for a second is usually a failure of nerve dressed up as variety.' },
  { date: 'Oct 2025', readingTime: '9 min', title: 'Editing is a design decision', excerpt: 'The strongest layout tool I own is a red pen. Half of what makes a page feel considered is the sentence that is no longer on it.' },
  { date: 'Jun 2025', readingTime: '6 min', title: 'Why the eleventh version was the first', excerpt: 'You do not always arrive somewhere new. Sometimes the work is proving to yourself that the first instinct was right, by exhausting the alternatives.' },
];

/** One capability. */
export interface MarfaService {
  icon: typeof PenTool;
  title: string;
  body: string;
  deliverables: string[];
}

export const MARFA_SERVICES: MarfaService[] = [
  {
    icon: BookOpen,
    title: 'Editorial design',
    body: 'Magazines, books and reports where the reading experience is the brief. Grid, typography and the pace of turning a page.',
    deliverables: ['Art direction', 'Grid & type', 'Layout', 'Print liaison'],
  },
  {
    icon: Shapes,
    title: 'Identity',
    body: 'Marks and systems for people who make things carefully, built to age well rather than trend fast.',
    deliverables: ['Positioning', 'Wordmark', 'Type system', 'Guidelines'],
  },
  {
    icon: ScanEye,
    title: 'Art direction',
    body: 'The eye over a project: photography, illustration and the standard everything is held to once the studio has gone.',
    deliverables: ['Direction', 'Commissioning', 'Shoot', 'Sign-off'],
  },
  {
    icon: Layers,
    title: 'Print production',
    body: 'Paper, ink and finishing, managed to the press. The part where a design becomes an object, and where most of them are quietly ruined.',
    deliverables: ['Stock', 'Proofing', 'Press check', 'Finishing'],
  },
];

/** Studio figures. Illustrative. */
export const MARFA_FACTS = [
  { value: 6, suffix: '', label: 'Projects a year' },
  { value: 14, suffix: 'yr', label: 'Independent' },
  { value: 9, suffix: '', label: 'Awards' },
  { value: 1, suffix: '', label: 'Desk' },
];

export const MARFA_CONTENT: TemplateContent = {
  brand: 'Marfa',

  nav: MARFA_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Art director, editorial & identity',
    title: 'Design that reads',
    titleAccent: 'like a held breath',
    subtitle:
      'An independent art director working in print, identity and the occasional screen, for a handful of projects a year, each given more attention than is strictly reasonable.',
    ctaPrimary: 'See the work',
    ctaSecondary: 'Enquire',
    stats: [
      { value: 6, suffix: '', label: 'Projects a year' },
      { value: 14, suffix: 'yr', label: 'Independent' },
      { value: 9, suffix: '', label: 'Awards' },
    ],
  },

  marquee: ['Editorial', 'Identity', 'Art direction', 'Typography', 'Book design', 'Print', 'Letterpress'],

  about: {
    eyebrow: 'Studio',
    title: 'Small on purpose, slow by choice',
    body: [
      'I work alone, from one desk, on a small number of projects a year. That is not a stage before growth; it is the whole plan. The work I care about needs the kind of attention that does not survive being spread across a team of ten.',
      'Everything starts on paper and ends at a press. I set my own type, I commission the photography, and I do the press check in person, because the difference between good and finished happens in the last ten per cent, and that is the part everyone else skips.',
    ],
    points: [
      'One desk, six projects a year',
      'Print-first, from grid to press check',
      'One typeface, used to its limit',
      'Edited hard. The red pen is a design tool',
    ],
  },

  services: {
    eyebrow: 'What I do',
    title: 'Four things, done properly',
    subtitle: 'Editorial, identity and the direction that holds them together. I do not do decks, and I will tell you who does.',
    items: MARFA_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How I work',
    title: 'Read, sketch, set, press',
    subtitle: 'The order rarely changes. Most of the thinking happens before a single line is drawn, which is why the drawing goes quickly.',
    items: [
      { icon: Compass, title: 'Read', body: 'Weeks with the material before a single layout. You cannot design a thing you have not properly understood.' },
      { icon: PenTool, title: 'Sketch', body: 'On paper, at speed, badly. Twenty rough directions to find the one worth taking seriously.' },
      { icon: Ruler, title: 'Set', body: 'The grid and the type, built once and honoured throughout, so the whole thing reads as one hand.' },
      { icon: ScanEye, title: 'Direct', body: 'Photography and illustration commissioned to the idea, held to a standard, never bought off a shelf.' },
      { icon: Layers, title: 'Refine', body: 'The unglamorous middle: kerning, widows, the tenth pass that nobody will consciously notice.' },
      { icon: Sparkles, title: 'Press', body: 'On stock, with ink, checked in person. The design becomes an object here or it does not become one at all.' },
    ],
  },

  faq: {
    eyebrow: 'Practical',
    title: 'Before you enquire',
    items: [
      {
        question: 'What does a project cost?',
        answer:
          'Editorial and identity work generally starts around £18,000 and most land between there and £60,000, depending on extent and how much of the production I manage. I quote the whole thing, not an hourly rate, because good work should not be penalised for being done efficiently. Tell me the budget and I will tell you honestly what fits.',
      },
      {
        question: 'How long does it take?',
        answer:
          'Rarely less than three months, often more. I work on few things at once so each gets real attention, which means the timeline is as much about my calendar as your scope. I will give you an honest start date rather than the one you want to hear.',
      },
      {
        question: 'Do you work on screen, or only print?',
        answer:
          'Print first, but not only. I take on identity and the occasional editorial site where the same care applies. What I do not do is a website as an afterthought to a book. If the screen matters, it gets designed properly or handed to someone who will.',
      },
      {
        question: 'Will you work with my printer?',
        answer:
          'Gladly, and I will push them. Half my job is production, and a design is only as good as the press it comes off. If you do not have a printer I trust, I will bring one. The finishing is not the place to save money.',
      },
      {
        question: 'Do you take on small projects?',
        answer:
          'Sometimes, if the thing is interesting and the fit is right. A single beautifully-made object can be as satisfying as a season-long identity. Ask. The worst I will do is point you to someone better suited.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell me what you’re making',
    subtitle:
      'What it is, roughly when, and what you can spend. All three, ideally. The third one saves us both a fortnight of politeness.',
    fields: { name: 'Your name', email: 'Email', message: 'What are you making?' },
    submit: 'Send it',
    details: [
      { label: 'Enquiries', value: 'studio@marfa.design' },
      { label: 'Studio', value: 'By appointment, Lisbon' },
      { label: 'Telephone', value: '+351 21 099 4420' },
      { label: 'Elsewhere', value: 'Instagram · Are.na' },
    ],
  },

  footer: {
    tagline: 'Editorial, identity and art direction, made slowly, one desk at a time.',
    columns: [
      { title: 'Studio', links: ['Work', 'Services', 'Words', 'Recognition', 'Contact'] },
      { title: 'Disciplines', links: ['Editorial', 'Identity', 'Art direction', 'Book design', 'Print'] },
      { title: 'Elsewhere', links: ['Instagram', 'Are.na', 'Newsletter', 'Press', 'Colophon'] },
    ],
    legal: '© 2026 Marfa Studio. Projects shown are illustrative.',
  },
};

export const MARFA_PROMPT = `Design a five-page portfolio website for an independent editorial art director called Marfa.

Visual direction: light, editorial and unhurried. The antithesis of a dark, effects-heavy portfolio. A warm ivory ground (#f6f2ea), near-black ink for text, and a single muted terracotta accent used sparingly. Huge whitespace, hairline rules, a strict but invisible grid. A large, elegant serif for display headlines paired with a clean grotesque for body and a mono for labels. It should feel like a well-set magazine that happens to be a website.

Motion: anime.js v4, restrained and slow. Motion in service of reading, never spectacle. The signatures are a scroll-linked PARALLAX on the project plates (the image drifts slower than the page inside its frame), and a TEXT-MASK reveal where display headlines rise word by word out of clipped rows as they enter. Add MAGNETIC thumbnails on the work index (each drifts gently toward the cursor), a slow editorial marquee, count-up figures and staggered reveals.

Critical: the parallax and word reveals must degrade under prefers-reduced-motion: parallax drops its transform, masked words resolve to fully visible, and magnetic drift only engages for a real mouse. Nothing may hide content if the script never runs.

Pages: index (home), work, studio (about), words (essays), contact. Work is six long collaborations with client, category and year. Words is short essays on craft.

Tone: a designer who works alone and slowly: considered, quietly confident, honest about time and cost. Photography is stood in for by soft duotone plates.`;
