import {
  Aperture,
  Camera,
  Clapperboard,
  Film,
  Layers,
  Moon,
  MoveDiagonal,
  Sparkles,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * NOCTIS - content for the photography portfolio template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * NOCTIS is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the series list, the per-page mastheads, the journal
 * entries and the studio figures.
 *
 * The series, clients and figures are ILLUSTRATIVE and authored. A template
 * ships no CMS and no photographs - the imagery is stood in for by duotone
 * fields with grain, so a downloaded template implies no real commission.
 */

export const NOCTIS_PAGES = ['home', 'work', 'about', 'journal', 'contact'] as const;
export type NoctisPageId = (typeof NOCTIS_PAGES)[number];

export const NOCTIS_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Commission',
} as const;

export const NOCTIS_NAV: { id: NoctisPageId; label: string }[] = [
  { id: 'home', label: 'Index' },
  { id: 'work', label: 'Series' },
  { id: 'about', label: 'Studio' },
  { id: 'journal', label: 'Journal' },
  { id: 'contact', label: 'Contact' },
];

export interface NoctisMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const NOCTIS_MASTHEADS: Record<Exclude<NoctisPageId, 'home'>, NoctisMasthead> = {
  work: {
    eyebrow: 'Series, 2019 to 2026',
    title: 'Eight bodies of work',
    subtitle:
      'Long-form series rather than singles. Each one is a place returned to until it gave something up. Most took a year, one took four.',
  },
  about: {
    eyebrow: 'Studio',
    title: 'Available light, after dark',
    subtitle:
      'A photographer working the hour most people are indoors. Architecture, coastlines and the sodium-lit edges of cities, shot on film, printed by hand.',
  },
  journal: {
    eyebrow: 'Journal',
    title: 'Notes from the field',
    subtitle:
      'Where a series came from, what the shoot was actually like, and the mistakes worth admitting to. Updated when there is something true to say.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Commission or print',
    subtitle:
      'Editorial and architectural commissions, plus a small edition of hand-made prints. Tell me the place and the deadline; I will tell you honestly if the light works.',
  },
};

/** One photographic series. */
export interface NoctisSeries {
  name: string;
  place: string;
  year: string;
  frames: string;
  tags: string[];
  body: string;
  plate: 'noc-plate-a' | 'noc-plate-b' | 'noc-plate-c';
}

export const NOCTIS_SERIES: NoctisSeries[] = [
  { name: 'Sodium', place: 'Osaka', year: '2026', frames: '48 frames', tags: ['Cityscape', 'Film'], body: 'The last streets in the ward still lit by sodium lamps, photographed the winter before they were swapped for LED.', plate: 'noc-plate-a' },
  { name: 'Low Water', place: 'Hebrides', year: '2025', frames: '31 frames', tags: ['Coast', 'Long exposure'], body: 'Twelve tides on the same beach, each a single thirty-minute exposure, so the sea becomes fog and the rocks stay sharp.', plate: 'noc-plate-b' },
  { name: 'Concrete Hours', place: 'Marseille', year: '2025', frames: '54 frames', tags: ['Architecture'], body: 'Le Corbusier’s Unité at the four hours nobody photographs it, because that is when it stops looking like an idea and starts looking lived in.', plate: 'noc-plate-c' },
  { name: 'Terminus', place: 'Trieste', year: '2024', frames: '40 frames', tags: ['Architecture', 'Night'], body: 'A port at the end of its shift: cranes, empty offices, the specific blue that only exists for eight minutes after sunset.', plate: 'noc-plate-a' },
  { name: 'Understory', place: 'Aokigahara', year: '2024', frames: '27 frames', tags: ['Landscape', 'Fog'], body: 'A forest that eats sound, shot in the two weeks a year the fog sits below the canopy rather than above it.', plate: 'noc-plate-b' },
  { name: 'Salt', place: 'Camargue', year: '2023', frames: '36 frames', tags: ['Landscape', 'Aerial'], body: 'Salt pans from forty metres up, where the water runs from white to rust and the geometry is entirely accidental.', plate: 'noc-plate-c' },
  { name: 'Third Shift', place: 'Rotterdam', year: '2023', frames: '44 frames', tags: ['Documentary'], body: 'The people who keep a port running while the city sleeps, photographed over eleven nights with their permission and their coffee.', plate: 'noc-plate-a' },
  { name: 'Blue Hour', place: 'Faroe', year: '2022', frames: '33 frames', tags: ['Coast', 'Weather'], body: 'A month waiting for weather on islands where the weather is the subject. Most days it won.', plate: 'noc-plate-b' },
];

/** One journal entry. */
export interface NoctisJournalEntry {
  date: string;
  readingTime: string;
  title: string;
  excerpt: string;
  tag: string;
}

export const NOCTIS_JOURNAL: NoctisJournalEntry[] = [
  { date: 'Jun 2026', readingTime: '6 min', title: 'Why I still shoot sodium on film', tag: 'Craft', excerpt: 'Digital sensors read sodium light as a sickly green and fight you the whole way. Film just accepts it, and the acceptance is the picture.' },
  { date: 'Mar 2026', readingTime: '9 min', title: 'Twelve tides, one beach, one exposure each', tag: 'Field notes', excerpt: 'Low Water was supposed to take a weekend. It took a month, because a thirty-minute exposure gives you exactly one chance per tide.' },
  { date: 'Nov 2025', readingTime: '5 min', title: 'The eight minutes that matter', tag: 'Light', excerpt: 'There is a blue after sunset that a camera can hold and the eye cannot. It lasts eight minutes and it is the only reason I own a tripod.' },
  { date: 'Aug 2025', readingTime: '7 min', title: 'On photographing buildings that are famous', tag: 'Essay', excerpt: 'Everyone has seen the Unité. The job is not to take the photograph again. It is to wait until it stops performing for the camera.' },
];

/** One capability. */
export interface NoctisService {
  icon: typeof Camera;
  title: string;
  body: string;
  deliverables: string[];
}

export const NOCTIS_SERVICES: NoctisService[] = [
  {
    icon: Aperture,
    title: 'Editorial commissions',
    body: 'Assignments for magazines and brands that want the series treatment rather than a single hero shot.',
    deliverables: ['Concept', 'Location scout', 'Shoot', 'Hand-graded scans'],
  },
  {
    icon: MoveDiagonal,
    title: 'Architecture',
    body: 'Buildings shot the way their architects wish they were, at the hour that flatters the concrete rather than the render.',
    deliverables: ['Timing plan', 'Large format', 'Interiors', 'Retouch'],
  },
  {
    icon: Film,
    title: 'Prints',
    body: 'A small edition of hand-made silver and pigment prints, signed, numbered, and shipped flat.',
    deliverables: ['Editions of 12', 'Archival paper', 'Signed', 'Certificate'],
  },
  {
    icon: Clapperboard,
    title: 'Motion',
    body: 'The same eye, moving. Short films and title sequences for the series that want to breathe.',
    deliverables: ['Direction', 'Colour grade', 'Sound', 'Delivery'],
  },
];

/** Studio figures. Illustrative. */
export const NOCTIS_FACTS = [
  { value: 8, suffix: '', label: 'Series' },
  { value: 14, suffix: 'yr', label: 'Behind the lens' },
  { value: 313, suffix: '', label: 'Nights on location' },
  { value: 6, suffix: '', label: 'Awards' },
];

export const NOCTIS_CONTENT: TemplateContent = {
  brand: 'Noctis',

  nav: NOCTIS_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Photographer, working after dark',
    title: 'Pictures of the',
    titleAccent: 'quiet hours',
    subtitle:
      'I photograph architecture, coastlines and cities in the hour they empty out: on film, printed by hand, in long series rather than singles.',
    ctaPrimary: 'See the series',
    ctaSecondary: 'Commission',
    stats: [
      { value: 8, suffix: '', label: 'Series' },
      { value: 14, suffix: 'yr', label: 'Behind the lens' },
      { value: 313, suffix: '', label: 'Nights out' },
    ],
  },

  marquee: ['Architecture', 'Coast', 'Long exposure', 'Film', 'Blue hour', 'Documentary', 'Editions'],

  about: {
    eyebrow: 'Studio',
    title: 'One person, a tripod, and patience',
    body: [
      'I work alone, mostly at night, and mostly waiting. A series takes as long as the light takes to happen: twelve tides, or a fortnight of the wrong weather, or one clear evening a year.',
      'Everything is shot on film and printed by hand, not out of nostalgia but because the process forces the discipline: you cannot fix a bad frame in the darkroom, so you learn not to take it.',
    ],
    points: [
      'Shot on film, scanned and printed by hand',
      'Series, not singles. I return until it gives something up',
      'The hour most people are indoors',
      'Editions kept small and signed',
    ],
  },

  services: {
    eyebrow: 'What I do',
    title: 'Commissions, prints and motion',
    subtitle: 'Four ways to work together. Prints ship worldwide; commissions I take a handful of a year.',
    items: NOCTIS_SERVICES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  why: {
    eyebrow: 'How a shoot goes',
    title: 'Scout, wait, expose, print',
    subtitle: 'The order rarely changes. The waiting is where the picture is decided; the shutter is almost an afterthought.',
    items: [
      { icon: Moon, title: 'Scout', body: 'Days walking the place at every hour, so I know exactly where to stand before the light arrives.' },
      { icon: Aperture, title: 'Wait', body: 'The unglamorous part. Weather, tide and the eight minutes of blue that make the whole trip worth it.' },
      { icon: Camera, title: 'Expose', body: 'Large format, one frame at a time, because film costs enough to make you think first.' },
      { icon: Layers, title: 'Develop', body: 'Hand processing and scanning, where the grade is decided rather than discovered on a screen later.' },
      { icon: Film, title: 'Print', body: 'Silver or pigment, on archival paper, until the print matches what the place actually felt like.' },
      { icon: Sparkles, title: 'Edition', body: 'Signed, numbered, kept to twelve. Scarcity is a promise to the people who bought the first one.' },
    ],
  },

  faq: {
    eyebrow: 'Practical',
    title: 'Before you commission',
    items: [
      {
        question: 'What does a commission cost?',
        answer:
          'Editorial day rates start around €2,400 plus film, processing and travel. A full architectural series is quoted as a project because the variable is the waiting, not the shooting. A building that needs a specific season costs more than one that does not. Tell me the budget and I will tell you honestly whether it is enough.',
      },
      {
        question: 'How long does a shoot take?',
        answer:
          'A single assignment is a day or two. A series is weeks, because I am waiting for light that happens on its own schedule. I will give you an honest window up front, and I will not pretend the weather is under my control.',
      },
      {
        question: 'Why film, in 2026?',
        answer:
          'Because the constraint improves the work. Thirty-six frames and no screen to chimp at forces you to see before you shoot. It is slower and more expensive, and for the kind of pictures I make, both of those are the point.',
      },
      {
        question: 'Can I buy a print of a series I have seen?',
        answer:
          'Most of them, yes, in editions of twelve on archival paper. Some frames are held back for exhibition or are simply not strong enough as singles. Ask about a specific one and I will tell you what is available and at what size.',
      },
      {
        question: 'Do you licence images for commercial use?',
        answer:
          'Selectively. Existing frames can be licensed for editorial and considered commercial use; I do not do stock, and I keep the right to say no to a use that misreads the work. Send the brief and we will talk.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell me the place',
    subtitle:
      'The location, the deadline, and roughly the budget. All three, ideally: the third one saves us both a week of politeness.',
    fields: { name: 'Your name', email: 'Email', message: 'The place, and when' },
    submit: 'Send it',
    details: [
      { label: 'Commissions', value: 'studio@noctis.photo' },
      { label: 'Prints', value: 'prints@noctis.photo' },
      { label: 'Based', value: 'Rotterdam, travelling' },
      { label: 'Elsewhere', value: 'Instagram · Are.na' },
    ],
  },

  footer: {
    tagline: 'Photographs of the quiet hours, on film, printed by hand.',
    columns: [
      { title: 'Work', links: ['Series', 'Prints', 'Motion', 'Exhibitions', 'Contact'] },
      { title: 'Subjects', links: ['Architecture', 'Coast', 'Cityscape', 'Documentary', 'Landscape'] },
      { title: 'Elsewhere', links: ['Instagram', 'Are.na', 'Newsletter', 'Press', 'Colophon'] },
    ],
    legal: '© 2026 Noctis. Imagery shown is illustrative; no photographs ship with this template.',
  },
};

export const NOCTIS_PROMPT = `Design a five-page portfolio website for a night photographer called Noctis.

Visual direction: cinematic and dark. Near-black ground (#0b0c0f), bone-white type rather than pure white, a single warm amber accent (#f5a623) used sparingly. No glass or gradient panels. Depth comes from full-bleed duotone image fields with film grain, hairline rules and generous negative space. A grotesque display face broken into hand-set lines, with one italic serif accent word per heading. The imagery is stood in for by duotone plates because a template ships no photographs.

Motion: anime.js v4, tuned to feel like a slow shutter rather than a bounce. The signature is a CURTAIN-WIPE image reveal: as each plate enters the viewport it is unmasked with an animated clip-path (inset), so the picture is drawn open rather than faded in. Pair it with clipped display lines that lift out of the baseline, a letter-by-letter hero cascade, count-up figures, and a scroll-scrubbed horizontal FILM-STRIP rail on the series page where vertical scroll becomes horizontal travel.

Critical: scroll-linked motion moves content, so under prefers-reduced-motion the rail must degrade to an ordinary horizontally scrollable row and every clip-path reveal must resolve to fully visible, or the work becomes unreachable.

Pages: index (home), series (work), studio (about), journal, contact. Series is eight bodies of work with place, year, frame count and tags. Journal is short field notes.

Tone: a photographer who works alone and waits for light: specific, unhurried, honest about cost and weather.`;
