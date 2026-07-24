import {
  Battery,
  Bluetooth,
  Boxes,
  Cpu,
  Ear,
  Headphones,
  Home,
  Radio,
  Recycle,
  Speaker,
  Sparkle,
  Waves,
  Wrench,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * SCULPT - content for the smart-audio hardware template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * SCULPT is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the product line, the acoustic specifications, the
 * support articles and the per-page mastheads. Those extras are typed locally
 * rather than pushed into `types.ts`, because "driver diameter" is this
 * template's domain, not every template's.
 *
 * Every figure is ILLUSTRATIVE and authored, not measured. A template ships no
 * data layer, and a spec sheet implying a real lab result would be dishonest.
 */

export const SCULPT_PAGES = ['home', 'products', 'technology', 'support', 'contact'] as const;
export type SculptPageId = (typeof SCULPT_PAGES)[number];

export const SCULPT_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
} as const;

export const SCULPT_NAV: { id: SculptPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'technology', label: 'Technology' },
  { id: 'support', label: 'Support' },
  { id: 'contact', label: 'Contact' },
];

export interface SculptMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const SCULPT_MASTHEADS: Record<Exclude<SculptPageId, 'home'>, SculptMasthead> = {
  products: {
    eyebrow: 'The range',
    title: 'Four objects, one acoustic family',
    subtitle:
      'Each one is voiced against the same reference curve, so a room with all four sounds like one system rather than four opinions.',
  },
  technology: {
    eyebrow: 'Technology',
    title: 'What the soft edges are hiding',
    subtitle:
      'A cabinet with no visible seam still has to move air. Here is the engineering underneath the surface.',
  },
  support: {
    eyebrow: 'Support',
    title: 'Built to be opened',
    subtitle:
      'Every part that wears out is a part you can replace, with a guide and a screwdriver we ship you.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Talk to someone who has heard them',
    subtitle:
      'Our support team works in the same room as the acoustics bench. Ask about a room, not just a product.',
  },
};

/** One object in the range. */
export interface SculptProduct {
  icon: typeof Speaker;
  name: string;
  role: string;
  price: string;
  body: string;
  specs: { label: string; value: string }[];
}

export const SCULPT_PRODUCTS: SculptProduct[] = [
  {
    icon: Speaker,
    name: 'Sculpt One',
    role: 'Bookshelf',
    price: '£690',
    body: 'The reference of the range. A two-way sealed cabinet that disappears into a shelf and stops behaving like furniture the moment it plays.',
    specs: [
      { label: 'Drivers', value: '110mm mid-bass, 25mm dome' },
      { label: 'Response', value: '48Hz – 22kHz' },
      { label: 'Amplifier', value: '2 × 50W Class D' },
      { label: 'Cabinet', value: 'Cast mineral composite' },
    ],
  },
  {
    icon: Radio,
    name: 'Sculpt Room',
    role: 'Floorstanding',
    price: '£1,480',
    body: 'The same voicing with the low end intact. A ported column tuned to sit near a wall, because that is where people actually put them.',
    specs: [
      { label: 'Drivers', value: '2 × 130mm bass, 90mm mid, 25mm dome' },
      { label: 'Response', value: '32Hz – 22kHz' },
      { label: 'Amplifier', value: '3 × 60W Class D' },
      { label: 'Cabinet', value: 'Cast mineral composite' },
    ],
  },
  {
    icon: Headphones,
    name: 'Sculpt Close',
    role: 'Headphones',
    price: '£420',
    body: 'Open-backed, voiced to the same curve as the speakers, so mixing on one and listening on the other agree with each other.',
    specs: [
      { label: 'Driver', value: '46mm planar magnetic' },
      { label: 'Response', value: '12Hz – 40kHz' },
      { label: 'Impedance', value: '32Ω' },
      { label: 'Weight', value: '328g' },
    ],
  },
  {
    icon: Home,
    name: 'Sculpt Hub',
    role: 'Source',
    price: '£340',
    body: 'The thing everything else connects to. Roon-ready, AirPlay 2, and a physical volume wheel because a phone is a bad remote.',
    specs: [
      { label: 'Inputs', value: 'Optical, coax, USB-C, analogue' },
      { label: 'DAC', value: '32-bit / 384kHz' },
      { label: 'Network', value: 'Wi-Fi 6E, Gigabit ethernet' },
      { label: 'Latency', value: '18ms end to end' },
    ],
  },
];

/** An engineering claim on the technology page. */
export interface SculptTech {
  icon: typeof Cpu;
  title: string;
  body: string;
  figure: string;
  figureLabel: string;
}

export const SCULPT_TECH: SculptTech[] = [
  {
    icon: Waves,
    title: 'Room correction that measures',
    body: 'Six microphones sweep the room on setup and again whenever the Hub notices the response has drifted. Correction is applied in the analogue domain, after the DAC.',
    figure: '±1.5dB',
    figureLabel: 'in-room deviation, 100Hz–10kHz',
  },
  {
    icon: Boxes,
    title: 'A cabinet with no parallel walls',
    body: 'Cast in a mineral composite rather than assembled from panels, so there is no seam to buzz and no internal standing wave to damp out afterwards.',
    figure: '0',
    figureLabel: 'panel joints in the enclosure',
  },
  {
    icon: Cpu,
    title: 'Crossover in the digital domain',
    body: 'Each driver gets its own amplifier and its own filter, which removes the passive crossover and the phase error that comes with it.',
    figure: '3',
    figureLabel: 'independent amplifier channels',
  },
  {
    icon: Bluetooth,
    title: 'Wireless that is not lossy',
    body: 'Speakers talk to the Hub on a dedicated 5GHz link rather than Bluetooth, so the signal that reaches the driver is the one that left the source.',
    figure: '24/192',
    figureLabel: 'wireless, uncompressed',
  },
  {
    icon: Battery,
    title: 'Standby that is honest',
    body: 'Under half a watt asleep, and it actually sleeps: no listener, no telemetry, no keeping the network awake.',
    figure: '0.4W',
    figureLabel: 'measured standby draw',
  },
  {
    icon: Recycle,
    title: 'Designed to be opened',
    body: 'Eight screws to the driver, four to the amplifier board. Both are stocked as spare parts for ten years from the day a model is discontinued.',
    figure: '10yr',
    figureLabel: 'spare-part commitment',
  },
];

/** A support article. */
export interface SculptArticle {
  icon: typeof Wrench;
  title: string;
  body: string;
  minutes: string;
}

export const SCULPT_ARTICLES: SculptArticle[] = [
  { icon: Ear, title: 'Placing a pair in a real room', body: 'Where to start, what to listen for, and why the corner is not always wrong.', minutes: '6 min' },
  { icon: Wrench, title: 'Replacing a mid-bass driver', body: 'Eight screws and a connector. The guide includes torque figures and a part number.', minutes: '12 min' },
  { icon: Sparkle, title: 'Running a room sweep', body: 'What the six microphones are doing, and how to read the correction it applies.', minutes: '8 min' },
  { icon: Radio, title: 'Adding a second pair', body: 'Grouping, delay compensation, and keeping one system rather than two.', minutes: '5 min' },
];

/** Illustrative company figures. */
export const SCULPT_FACTS = [
  { value: 11, suffix: 'yr', label: 'Building speakers' },
  { value: 4, suffix: '', label: 'Objects in the range' },
  { value: 96, suffix: '%', label: 'Repaired, not replaced' },
  { value: 38000, suffix: '+', label: 'Rooms listening' },
];

export const SCULPT_CONTENT: TemplateContent = {
  brand: 'Sculpt',

  nav: SCULPT_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Sculpt Room — now shipping',
    title: 'Sound you can',
    titleAccent: 'put your hands on',
    subtitle:
      'Speakers cast in one piece, voiced against one curve, and built so every part that wears out is a part you can replace yourself.',
    ctaPrimary: 'See the range',
    ctaSecondary: 'How they are made',
    stats: [
      { value: 32, suffix: 'Hz', label: 'Low-end reach' },
      { value: 10, suffix: 'yr', label: 'Spare parts stocked' },
      { value: 4, suffix: '', label: 'Objects, one family' },
    ],
  },

  marquee: [
    'Cast mineral cabinet',
    'Active crossover',
    'Room correction',
    'Replaceable drivers',
    'Uncompressed wireless',
    'Ten-year parts',
  ],

  about: {
    eyebrow: 'The idea',
    title: 'A speaker should be an object, not an appliance',
    body: [
      'Most speakers are a box with a grille, designed to be ignored. We wanted the opposite: something with weight and a surface worth touching, that also happens to measure well.',
      'The soft shapes are not decoration. A cast enclosure with no parallel walls and no panel joins is quieter than an assembled one, and it happens to look like something you would keep.',
    ],
    points: [
      'One acoustic voicing across every product',
      'Every wearing part replaceable with a screwdriver',
      'Correction measured in your room, not assumed',
      'Ten years of spare parts after a model retires',
    ],
  },

  services: {
    eyebrow: 'The range',
    title: 'Four objects that belong together',
    subtitle:
      'Buy one and it works alone. Buy another and the Hub makes them one system, delay-matched and voiced identically.',
    items: SCULPT_PRODUCTS.map(({ icon, name, body }) => ({ icon, title: name, body })),
  },

  why: {
    eyebrow: 'Why it sounds like this',
    title: 'The engineering under the surface',
    subtitle:
      'Nothing here is exotic. It is the set of decisions you make when the cabinet is cast rather than assembled and every driver has its own amplifier.',
    items: SCULPT_TECH.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  faq: {
    eyebrow: 'Questions',
    title: 'What people ask before buying',
    items: [
      {
        question: 'Do I need the Hub?',
        answer:
          'Not for one pair. Every speaker takes optical, coax and analogue directly. The Hub matters when you add a second pair or want room correction across a whole space, because that is where delay compensation and a shared measurement live.',
      },
      {
        question: 'Can I really replace a driver myself?',
        answer:
          'Yes. Eight screws and one connector, with a torque figure in the guide and the correct driver on the shelf as a part number rather than a service ticket. We ship the screwdriver with every speaker for the same reason.',
      },
      {
        question: 'How close to a wall can they go?',
        answer:
          'Sculpt Room is tuned for wall placement, roughly 10–30cm out. Sculpt One is sealed and much less sensitive to it. After a room sweep the correction accounts for whatever you actually did, which is usually not what the manual suggested.',
      },
      {
        question: 'Is the wireless link lossy?',
        answer:
          'No. Speakers talk to the Hub on a dedicated 5GHz link carrying uncompressed 24-bit/192kHz, not Bluetooth. Bluetooth is there for a guest with a phone, and it is the only path in the system that compresses anything.',
      },
      {
        question: 'What happens when a model is discontinued?',
        answer:
          'Spare parts stay stocked for ten years from the discontinuation date — drivers, amplifier boards, feet and grilles. Firmware keeps receiving security and compatibility updates for the same period.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us about the room',
    subtitle:
      'Dimensions, what is on the floor, and where you would like them to go. We will tell you which pair, or that you do not need the bigger one.',
    fields: { name: 'Your name', email: 'Email', message: 'Tell us about the room' },
    submit: 'Send message',
    details: [
      { label: 'Support', value: 'help@sculptaudio.com' },
      { label: 'Listening room', value: 'By appointment, Copenhagen' },
      { label: 'Phone', value: '+45 33 12 88 40' },
      { label: 'Spares', value: 'parts.sculptaudio.com' },
    ],
  },

  footer: {
    tagline: 'Cast in one piece. Voiced to one curve. Built to be opened.',
    columns: [
      { title: 'Products', links: ['Sculpt One', 'Sculpt Room', 'Sculpt Close', 'Sculpt Hub', 'Accessories'] },
      { title: 'Support', links: ['Guides', 'Spare parts', 'Firmware', 'Warranty', 'Contact'] },
      { title: 'Company', links: ['About', 'Acoustics', 'Sustainability', 'Press', 'Stockists'] },
    ],
    legal: '© 2026 Sculpt Audio ApS. Specifications shown are illustrative.',
  },
};

export const SCULPT_PROMPT = `Design a five-page website for a smart-audio hardware company called Sculpt that makes cast, seamless speakers.

Visual direction: neumorphism done carefully. A mid-tone cool-grey ground (#e9ebf1) with surfaces the same colour as the page, lifted by a white highlight top-left and a soft grey shadow bottom-right. Copper as the single accent. Crucially, fix the two things neumorphism normally gets wrong: body text is near-black for real contrast rather than grey-on-grey, and every interactive surface carries a 1px border plus a solid focus ring, because a control lifted by shadow alone is invisible to anyone who cannot see the shadow.

Motion: anime.js throughout, and physical rather than optical — surfaces are objects. Entrances use a spring (mass 1, stiffness 120, damping 16) so panels arrive with one small overshoot. Buttons depress under the pointer and spring back. The hero carries a genuinely draggable control built with createDraggable, which is also a real range input underneath so it works from the keyboard and is announced properly.

Pages: home, products, technology, support, contact. Products is four objects with spec tables; technology is the engineering claims with a hard number each; support is repair guides, because the whole product argument is that it can be opened.

Tone: engineers who care about measurement, writing plainly. Concrete figures, no adjectives about immersive experiences.`;
