import {
  Bath,
  BedDouble,
  Bike,
  Compass,
  Flame,
  Grape,
  Leaf,
  Mountain,
  Sunrise,
  UtensilsCrossed,
  Waves,
  Wind,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * SOLSTICE - content for the boutique hotel template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * SOLSTICE is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the rooms, the menus, the experiences and the
 * per-page mastheads. Those extras are typed locally rather than pushed into
 * `types.ts`, because "nightly rate" is this template's domain.
 *
 * Rates and figures are ILLUSTRATIVE and authored. A template ships no booking
 * engine, and a rate that implied live availability would be dishonest.
 */

export const SOLSTICE_PAGES = ['home', 'rooms', 'dining', 'experiences', 'contact'] as const;
export type SolsticePageId = (typeof SOLSTICE_PAGES)[number];

export const SOLSTICE_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
} as const;

export const SOLSTICE_NAV: { id: SolsticePageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'dining', label: 'Dining' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'contact', label: 'Contact' },
];

export interface SolsticeMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const SOLSTICE_MASTHEADS: Record<Exclude<SolsticePageId, 'home'>, SolsticeMasthead> = {
  rooms: {
    eyebrow: 'The rooms',
    title: 'Fourteen rooms, no two the same',
    subtitle:
      'The building is four hundred years old and refused to be divided evenly. We stopped fighting it, and every room kept its own proportions.',
  },
  dining: {
    eyebrow: 'The table',
    title: 'One menu, written each morning',
    subtitle:
      'What arrives from the valley decides what is served. The kitchen writes the card after the delivery, not before.',
  },
  experiences: {
    eyebrow: 'The days',
    title: 'Things worth getting up for',
    subtitle:
      'All of them start at the door. None of them require a car, and most of them end back here in time for dinner.',
  },
  contact: {
    eyebrow: 'Reservations',
    title: 'Come and stay',
    subtitle:
      'Write to us with your dates. Someone who works here answers, and they will tell you honestly which room suits you.',
  },
};

/** One room. */
export interface SolsticeRoom {
  icon: typeof BedDouble;
  name: string;
  aspect: string;
  rate: string;
  body: string;
  details: string[];
  /** Which plate treatment the card uses. */
  plate: 'sol-plate' | 'sol-plate-warm' | 'sol-plate-cool';
}

export const SOLSTICE_ROOMS: SolsticeRoom[] = [
  {
    icon: BedDouble,
    name: 'Valley',
    aspect: 'South facing, first floor',
    rate: 'from €240',
    body: 'The smallest of the rooms and the one people ask for again. A deep window seat, the valley in front of it, and nothing else competing for the view.',
    details: ['28 m²', 'Queen bed', 'Rain shower', 'Window seat'],
    plate: 'sol-plate-warm',
  },
  {
    icon: Mountain,
    name: 'Ridge',
    aspect: 'East facing, second floor',
    rate: 'from €310',
    body: 'Under the original roof beams, with the light arriving early. If you are the sort of person who wakes at six anyway, this is the room that rewards it.',
    details: ['36 m²', 'King bed', 'Free-standing bath', 'Beamed ceiling'],
    plate: 'sol-plate-cool',
  },
  {
    icon: Sunrise,
    name: 'Orchard',
    aspect: 'West facing, ground floor',
    rate: 'from €280',
    body: 'Doors straight onto the walled orchard, which is quiet enough that people take their breakfast out there without being told they can.',
    details: ['34 m²', 'King bed', 'Private terrace', 'Garden access'],
    plate: 'sol-plate',
  },
  {
    icon: Bath,
    name: 'The Long Room',
    aspect: 'Dual aspect, top floor',
    rate: 'from €420',
    body: 'The whole of the top floor. Two windows at either end, a bath under one of them, and enough distance between the bed and the desk to forget the desk.',
    details: ['58 m²', 'King bed', 'Sitting room', 'Dual aspect'],
    plate: 'sol-plate-warm',
  },
];

/** A course or section of the menu. */
export interface SolsticeDish {
  icon: typeof UtensilsCrossed;
  course: string;
  title: string;
  body: string;
}

export const SOLSTICE_MENU: SolsticeDish[] = [
  { icon: Leaf, course: 'To begin', title: 'Garden, raw and pickled', body: 'Whatever came out of the walled garden that morning, some of it cured, some of it an hour old.' },
  { icon: Flame, course: 'From the fire', title: 'Hearth-cooked, over vine', body: 'One protein, cooked slowly over prunings from the vineyard behind the house.' },
  { icon: Waves, course: 'From the coast', title: 'Two hours from the water', body: 'Delivered on the morning boat, which is why the card is written after it arrives.' },
  { icon: Grape, course: 'To finish', title: 'Cellar and orchard', body: 'Fruit from the orchard, and something from a cellar that predates the current building.' },
];

/** A thing to do. */
export interface SolsticeExperience {
  icon: typeof Compass;
  title: string;
  duration: string;
  body: string;
}

export const SOLSTICE_EXPERIENCES: SolsticeExperience[] = [
  { icon: Sunrise, title: 'Walk the ridge before breakfast', duration: '90 min', body: 'Two hundred metres of climb and the whole valley underneath it. We will pack coffee.' },
  { icon: Grape, title: 'The cellar, with the person who fills it', duration: '2 hrs', body: 'Six wines from within forty kilometres, poured by someone who knows the growers by name.' },
  { icon: Bike, title: 'Ride the old rail line', duration: 'Half day', body: 'Flat, shaded and almost entirely traffic-free. Bicycles are in the courtyard; take them.' },
  { icon: UtensilsCrossed, title: 'Cook the fire menu', duration: '3 hrs', body: 'A morning at the hearth with the kitchen, then you eat what you made for lunch.' },
  { icon: Wind, title: 'Swim the quarry lake', duration: '2 hrs', body: 'Twenty minutes on foot, cold all year, and empty on almost every day of it.' },
  { icon: Compass, title: 'Nothing, deliberately', duration: 'All day', body: 'The library, the orchard and a jug of something. It is a legitimate choice and we will not disturb you.' },
];

/** Illustrative figures. */
export const SOLSTICE_FACTS = [
  { value: 14, suffix: '', label: 'Rooms' },
  { value: 400, suffix: 'yr', label: 'Old, the walls' },
  { value: 40, suffix: 'km', label: 'Everything on the list' },
  { value: 2, suffix: '', label: 'Michelin keys' },
];

export const SOLSTICE_CONTENT: TemplateContent = {
  brand: 'Solstice',

  nav: SOLSTICE_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Douro Valley, Portugal',
    title: 'A house at the top',
    titleAccent: 'of a very old valley',
    subtitle:
      'Fourteen rooms in a four-hundred-year-old quinta, a kitchen that writes its menu each morning, and a great deal of nothing to do.',
    ctaPrimary: 'Check dates',
    ctaSecondary: 'See the rooms',
    stats: [
      { value: 14, suffix: '', label: 'Rooms' },
      { value: 400, suffix: 'yr', label: 'Old walls' },
      { value: 40, suffix: 'km', label: 'Sourcing radius' },
    ],
  },

  marquee: ['Douro Valley', 'Fourteen rooms', 'Hearth kitchen', 'Walled orchard', 'Cellar of 400', 'Two Michelin keys'],

  about: {
    eyebrow: 'The house',
    title: 'It was a working quinta long before it was a hotel',
    body: [
      'The walls went up in 1618 to store wine, and for most of four centuries that is exactly what they did. The floors are uneven, the windows are where the light was needed rather than where symmetry wanted them, and none of the fourteen rooms is the same shape.',
      'We restored it slowly and changed as little as we could get away with. What is new is honest about being new; what is old was left alone.',
    ],
    points: [
      'Fourteen rooms, no two alike',
      'Everything on the menu from within forty kilometres',
      'A cellar that predates the current building',
      'No cars needed once you arrive',
    ],
  },

  services: {
    eyebrow: 'The rooms',
    title: 'Fourteen rooms, no two the same',
    subtitle:
      'The building refused to divide evenly, so we stopped trying. Each room kept the proportions the walls gave it.',
    items: SOLSTICE_ROOMS.map(({ icon, name, body }) => ({ icon, title: name, body })),
  },

  why: {
    eyebrow: 'The days',
    title: 'Things worth getting up for',
    subtitle: 'All of them start at the door, and most end back here in time for dinner.',
    items: SOLSTICE_EXPERIENCES.map(({ icon, title, body }) => ({ icon, title, body })),
  },

  faq: {
    eyebrow: 'Before you come',
    title: 'The practical things',
    items: [
      {
        question: 'How do we get there?',
        answer:
          'Porto is ninety minutes by car, and the drive along the river for the last thirty of them is the best part of it. There is also a train to Pinhão and we will collect you from the station, which we would recommend if you would rather not drive the valley roads.',
      },
      {
        question: 'Is dinner included?',
        answer:
          'Breakfast is. Dinner is served six nights a week and is booked separately, because the kitchen sets a number each morning based on what arrived. Guests get first refusal, and we will ask when you check in rather than when you book.',
      },
      {
        question: 'Can you cater for dietary requirements?',
        answer:
          'Yes, and better with notice. Since the menu is written each morning, telling us a week ahead means the kitchen orders differently rather than removing something from a plate. Tell us when you book.',
      },
      {
        question: 'Are children welcome?',
        answer:
          'In the Orchard and Long Room, both of which have the space for it. The building has a great many uneven stone stairs and no lift, which is worth knowing before you commit to the top floor with a toddler.',
      },
      {
        question: 'What is there to do if it rains?',
        answer:
          'The library, the cellar and the kitchen, in roughly that order. The fire is lit from October and nobody has ever complained about a wet afternoon here, which we suspect says more about the wine than the weather.',
      },
    ],
  },

  contact: {
    eyebrow: 'Reservations',
    title: 'Come and stay',
    subtitle:
      'Send us your dates and how many of you there are. Someone who works here will answer, and they will tell you honestly which room suits you rather than which one is dearest.',
    fields: { name: 'Your name', email: 'Email', message: 'Dates, and anything we should know' },
    submit: 'Send enquiry',
    details: [
      { label: 'Reservations', value: 'stay@solsticequinta.com' },
      { label: 'Telephone', value: '+351 254 738 210' },
      { label: 'Address', value: 'Quinta do Solstício, Douro' },
      { label: 'Nearest station', value: 'Pinhão, 12 km' },
    ],
  },

  footer: {
    tagline: 'A house at the top of a very old valley.',
    columns: [
      { title: 'Stay', links: ['Rooms', 'Rates', 'The Long Room', 'Gift stays', 'Availability'] },
      { title: 'Eat', links: ['The table', 'The cellar', 'Breakfast', 'Private dining', 'Cookery'] },
      { title: 'Find us', links: ['Getting here', 'The valley', 'Journal', 'Press', 'Contact'] },
    ],
    legal: '© 2026 Quinta do Solstício. Rates shown are illustrative.',
  },
};

export const SOLSTICE_PROMPT = `Design a five-page website for a fourteen-room boutique hotel in the Douro Valley called Solstice, set in a 400-year-old quinta.

Visual direction: elegant and editorial, made of restraint rather than ornament. A warm ivory ground (#f7f3ed) with near-black ink, and clay as the single accent used almost never — a rule, a small-caps label, one word per band. Display type is a system serif stack (Iowan, Palatino, Georgia) so the template ships no font files; everything else is a sans. Enormous vertical space, measure capped around 62ch, no more than two type sizes per section. Photography is stood in for by layered gradient plates with grain over them, marked decorative.

Motion: anime.js, and slow — roughly double the duration you would normally use, with a long out(4) easing and no overshoot, because paper does not bounce. The signature is splitText: headings break into lines and each rises out of its own clipped box like a title card. Use it on headings only, never body copy, and keep accessible:true so the original text stays available to screen readers. Plates uncover with a clip-path wipe and drift on scroll.

Pages: home, rooms, dining, experiences, contact. Rooms is four rooms with rate, aspect and a detail list; dining is a four-course card written each morning; experiences is six things to do, one of which is deliberately nothing.

Tone: an innkeeper writing, not a marketer. Specific, dry, occasionally funny. No "nestled", no "luxurious", no "unforgettable".`;
