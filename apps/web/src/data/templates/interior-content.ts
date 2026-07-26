import { Armchair, Compass, Feather, Gem, Layers, PencilRuler, Ruler, Sun } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * SOLÈNE - content for a luxury interior-design studio.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * Seven editorial pages, routed by `?page=`. The identity is quiet luxury: warm
 * ivory, a single brass accent, a large elegant serif, generous whitespace and
 * big "photography" (soft duotone plates - a template ships no binary assets).
 * Projects, clients and figures are ILLUSTRATIVE.
 */

export const SOLENE_PAGES = ['home', 'projects', 'services', 'portfolio', 'about', 'testimonials', 'contact'] as const;
export type SolenePageId = (typeof SOLENE_PAGES)[number];

export const SOLENE_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Start a project',
} as const;

export const SOLENE_NAV: { id: SolenePageId; label: string }[] = [
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'about', label: 'Studio' },
  { id: 'testimonials', label: 'Voices' },
];

export const SOLENE_PAGE_META: { id: SolenePageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  ...SOLENE_NAV,
  { id: 'contact', label: 'Contact' },
];

export interface SoleneMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const SOLENE_MASTHEADS: Record<Exclude<SolenePageId, 'home'>, SoleneMasthead> = {
  projects: {
    eyebrow: 'Projects',
    title: 'Rooms that hold their quiet.',
    subtitle: 'A selection of residences and spaces, each designed to feel inevitable rather than decorated.',
  },
  services: {
    eyebrow: 'Services',
    title: 'From first sketch to the last cushion.',
    subtitle: 'Full interior architecture, styling and art direction, held by one senior team from beginning to end.',
  },
  portfolio: {
    eyebrow: 'Portfolio',
    title: 'A closer look at the work.',
    subtitle: 'Details, materials and light. The parts a photograph flattens and a room remembers.',
  },
  about: {
    eyebrow: 'The studio',
    title: 'A small studio with a long attention span.',
    subtitle: 'We take few projects and give them everything. Restraint, patience, and materials that age well.',
  },
  testimonials: {
    eyebrow: 'Voices',
    title: 'What it is like to work with us.',
    subtitle: 'In the words of the people who now live inside the work.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about your space.',
    subtitle: 'We take a handful of projects a year. If ours is the right fit, we would love to hear from you.',
  },
};

/** Featured projects. `plate` picks a duotone field; photography is stood in. */
export const SOLENE_PROJECTS: { name: string; place: string; year: string; plate: string }[] = [
  { name: 'Maison Aral', place: 'Provence', year: '2026', plate: 'sol-plate-a' },
  { name: 'The Linden House', place: 'Copenhagen', year: '2025', plate: 'sol-plate-b' },
  { name: 'Atelier Ono', place: 'Kyoto', year: '2025', plate: 'sol-plate-c' },
  { name: 'Cliff Residence', place: 'Amalfi', year: '2024', plate: 'sol-plate-d' },
];

/** Portfolio gallery, sized by footprint for a considered masonry. */
export const SOLENE_PORTFOLIO: { name: string; category: string; plate: string; span: 'tall' | 'wide' | 'sm' }[] = [
  { name: 'Reading corner', category: 'Living', plate: 'sol-plate-b', span: 'tall' },
  { name: 'Brass & oak kitchen', category: 'Kitchen', plate: 'sol-plate-a', span: 'wide' },
  { name: 'Stone bath', category: 'Bath', plate: 'sol-plate-c', span: 'sm' },
  { name: 'The long table', category: 'Dining', plate: 'sol-plate-d', span: 'sm' },
  { name: 'Linen bedroom', category: 'Bedroom', plate: 'sol-plate-a', span: 'wide' },
  { name: 'Garden room', category: 'Sunroom', plate: 'sol-plate-b', span: 'tall' },
];

/** The numbers, discreet. */
export const SOLENE_STATS = [
  { value: 18, suffix: '', label: 'Years' },
  { value: 60, suffix: '+', label: 'Homes' },
  { value: 9, suffix: '', label: 'Countries' },
  { value: 7, suffix: '', label: 'Awards' },
];

/** Client voices. */
export const SOLENE_TESTIMONIALS: { quote: string; author: string; role: string }[] = [
  { quote: 'They gave us a home that feels like it has always been ours. Nothing shouts, and yet every room is a pleasure.', author: 'Elise & Marc', role: 'Maison Aral' },
  { quote: 'A rare studio that listens first and designs second. The restraint is the luxury.', author: 'Johan V.', role: 'The Linden House' },
  { quote: 'Every material has aged into something better. Two years on, it looks more right, not less.', author: 'Aiko T.', role: 'Atelier Ono' },
];

export const SOLENE_SERVICES: { icon: typeof Armchair; title: string; body: string }[] = [
  { icon: PencilRuler, title: 'Interior architecture', body: 'Plans, joinery and the structural choices that decide how light and life move through a home.' },
  { icon: Armchair, title: 'Furnishing & styling', body: 'Pieces chosen and often made, layered until a room feels complete without feeling finished.' },
  { icon: Layers, title: 'Materials & finishes', body: 'Stone, timber, plaster and brass, specified to age gracefully and reward a second look.' },
  { icon: Sun, title: 'Lighting design', body: 'The quiet engineering of atmosphere, so a space feels right at noon and at midnight.' },
];

export const SOLENE_CONTENT: TemplateContent = {
  brand: 'Solène',

  nav: SOLENE_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Interior design studio',
    title: 'Interiors with a',
    titleAccent: 'quiet confidence.',
    subtitle:
      'A small studio designing residences and spaces that feel inevitable. Considered, unhurried, and built to age well.',
    ctaPrimary: 'Start a project',
    ctaSecondary: 'View projects',
    stats: [
      { value: 18, suffix: '', label: 'Years' },
      { value: 60, suffix: '+', label: 'Homes' },
      { value: 9, suffix: '', label: 'Countries' },
    ],
  },

  marquee: ['AD', 'Elle Decor', 'Cereal', 'Kinfolk', 'Dezeen', 'Wallpaper', 'The World of Interiors'],

  about: {
    eyebrow: 'The studio',
    title: 'We design few homes, and give each one everything.',
    body: [
      'Solène is a small studio in the old sense: a handful of people who take a handful of projects and stay with them from the first sketch to the last cushion.',
      'We believe restraint is the real luxury. The best rooms do not announce themselves; they simply feel right, and keep feeling right for years.',
    ],
    points: [
      'One senior team, first sketch to final styling',
      'Materials chosen to age, not to date',
      'A few projects a year, never more',
      'Quiet by intention, considered in every detail',
    ],
  },

  services: {
    eyebrow: 'Services',
    title: 'From first sketch to the last cushion.',
    subtitle: 'Full interior architecture, furnishing, materials and light, held by one senior team from beginning to end.',
    items: SOLENE_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'Our approach',
    title: 'How a Solène room comes to be.',
    subtitle: 'A slow, deliberate way of working, because the rooms that last are rarely the ones made in a hurry.',
    items: [
      { icon: Compass, title: 'Listen', body: 'We begin with how you live, not with a look. The brief is a conversation, not a form.' },
      { icon: Ruler, title: 'Draw', body: 'Plans, elevations and materials, resolved on paper until the room already works.' },
      { icon: Feather, title: 'Make', body: 'Trusted makers and honest materials, detailed and overseen down to the joinery.' },
      { icon: Gem, title: 'Style', body: 'The final layer, added slowly, until nothing more is needed and nothing is missing.' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Before you get in touch.',
    items: [
      { question: 'What size of project do you take?', answer: 'Whole homes and considered spaces, from an apartment to a country house. We take a small number a year so each gets our full attention.' },
      { question: 'Do you work outside your city?', answer: 'Often. Roughly half of our work is elsewhere, and travel is part of how we understand a place, its light and its makers.' },
      { question: 'How long does a home take?', answer: 'A full interior is usually nine to eighteen months from first sketch to the last cushion. Good rooms are rarely made in a hurry.' },
      { question: 'How do fees work?', answer: 'A design fee for the thinking and drawings, then a transparent margin on procurement. We quote the whole engagement, not by the hour.' },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about your space.',
    subtitle: 'We take a handful of projects a year. If ours is the right fit, we would love to hear from you.',
    fields: { name: 'Your name', email: 'Email', message: 'Tell us about the project' },
    submit: 'Send enquiry',
    details: [
      { label: 'Studio', value: 'hello@solene.studio' },
      { label: 'Visit', value: '14 Rue de Seine, Paris' },
      { label: 'New work', value: 'Booking from autumn 2026' },
      { label: 'Elsewhere', value: 'Instagram · Pinterest' },
    ],
  },

  footer: {
    tagline: 'A small interior-design studio. Considered, unhurried, built to age well.',
    columns: [
      { title: 'Studio', links: ['Projects', 'Services', 'Portfolio', 'Studio', 'Voices'] },
      { title: 'Contact', links: ['Enquiries', 'Press', 'Careers', 'Visit'] },
      { title: 'Elsewhere', links: ['Instagram', 'Pinterest', 'Journal', 'Newsletter'] },
    ],
    legal: '© 2026 Solène Studio. A template. Projects and figures are illustrative.',
  },
};

export const SOLENE_PROMPT = `Design a seven-page website (Home, Projects, Services, Portfolio, About, Testimonials, Contact) for a luxury interior-design studio called Solène, in a minimal, editorial, quiet-luxury style.

Visual direction: warm ivory ground (#f6f2ea), near-black warm ink, and one restrained brass accent (#a9843f). A large elegant SERIF for display (system serif stack, no web font) against a clean sans for body, a small mono for labels. Generous whitespace, hairline rules, big "photography" stood in by soft two-tone duotone plates (a template ships no binary assets). The layout is editorial and unhurried rather than dense.

Motion: Anime.js for scroll reveals and staggered serif headline lifts, plus a signature CLIP-PATH IMAGE REVEAL (plates unmask from the bottom as they enter), gentle parallax on plates, count-up numbers, and a press-logo marquee. Lenis for buttery smooth scroll. Hover: a slow image zoom inside a fixed frame. Everything degrades under prefers-reduced-motion - plates resolve visible, marquee and reveals stop.

Sections (Home): a minimal serif header with a Start-a-project CTA; an editorial hero, a large headline whose second line is the brass accent beside a tall duotone plate; a press marquee; a two-column studio philosophy; a featured-projects grid with clip-reveal plates and hover zoom; the services, set as a numbered editorial list; a considered portfolio masonry; discreet numbers; client voices; an FAQ; a closing invitation; a footer. Inner pages open with a masthead and recompose the shared sections.

Tone: refined, calm, confident. Restraint is the luxury.`;
