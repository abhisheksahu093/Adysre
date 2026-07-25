import {
  CalendarCheck,
  Camera,
  Compass,
  Globe2,
  Headset,
  MapPin,
  Mountain,
  Plane,
  Sparkles,
  Waves,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * WANDER - content for an adventurous, immersive travel & tourism website.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * Eight pages, routed by `?page=`. The identity is warm and immersive: sunset
 * orange with a cyan accent, big full-bleed "photography" stood in by vivid
 * gradient plates (a template ships no binary assets), a search hero, interactive
 * destination cards and a pinned map. Destinations, tours and figures are
 * ILLUSTRATIVE.
 */

export const WANDER_PAGES = ['home', 'destinations', 'tours', 'packages', 'gallery', 'reviews', 'about', 'contact'] as const;
export type WanderPageId = (typeof WANDER_PAGES)[number];

export const WANDER_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Plan a trip',
} as const;

export const WANDER_NAV: { id: WanderPageId; label: string }[] = [
  { id: 'destinations', label: 'Destinations' },
  { id: 'tours', label: 'Tours' },
  { id: 'packages', label: 'Packages' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'about', label: 'About' },
];

export const WANDER_PAGE_META: { id: WanderPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  ...WANDER_NAV,
  { id: 'contact', label: 'Contact' },
];

export interface WanderMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const WANDER_MASTHEADS: Record<Exclude<WanderPageId, 'home'>, WanderMasthead> = {
  destinations: {
    eyebrow: 'Destinations',
    title: 'Ninety countries, one wishlist.',
    subtitle: 'Handpicked places, each with the stays, guides and hidden corners that make them worth the flight.',
  },
  tours: {
    eyebrow: 'Tours',
    title: 'Small groups, big country.',
    subtitle: 'Led by locals who know the shortcuts, the sunsets and where to actually eat.',
  },
  packages: {
    eyebrow: 'Packages',
    title: 'Everything sorted but the surprises.',
    subtitle: 'Flights, stays and experiences bundled at a price that leaves room for the unexpected.',
  },
  gallery: {
    eyebrow: 'Gallery',
    title: 'Frames from the road.',
    subtitle: 'A wall of moments from travellers who went, and came back changed.',
  },
  reviews: {
    eyebrow: 'Reviews',
    title: 'Trips, in their own words.',
    subtitle: 'What it is actually like, told by the people who packed the bag.',
  },
  about: {
    eyebrow: 'About Wander',
    title: 'We plan the trip you would plan, if you had the time.',
    subtitle: 'A small team of obsessive travellers, local guides and a promise to sweat the details so you do not have to.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Tell us where you are dreaming of.',
    subtitle: 'A real trip designer answers, usually within a day, wherever you are in the world.',
  },
};

/** Interactive destination cards. `plate` picks a vivid gradient field. */
export const WANDER_DESTINATIONS: { name: string; country: string; price: string; plate: string; tag: string }[] = [
  { name: 'Santorini', country: 'Greece', price: 'from $1,290', plate: 'wa-plate-a', tag: 'Islands' },
  { name: 'Kyoto', country: 'Japan', price: 'from $1,640', plate: 'wa-plate-b', tag: 'Culture' },
  { name: 'Banff', country: 'Canada', price: 'from $1,180', plate: 'wa-plate-c', tag: 'Mountains' },
  { name: 'Marrakech', country: 'Morocco', price: 'from $990', plate: 'wa-plate-d', tag: 'Cities' },
  { name: 'Patagonia', country: 'Chile', price: 'from $2,100', plate: 'wa-plate-c', tag: 'Wild' },
  { name: 'Bali', country: 'Indonesia', price: 'from $1,050', plate: 'wa-plate-a', tag: 'Beaches' },
];

/** Pins for the stylised map. `x`/`y` are percentages within the map frame. */
export const WANDER_MAP_PINS: { label: string; x: number; y: number }[] = [
  { label: 'Iceland', x: 42, y: 22 },
  { label: 'Greece', x: 54, y: 40 },
  { label: 'Morocco', x: 46, y: 46 },
  { label: 'Japan', x: 84, y: 36 },
  { label: 'Bali', x: 82, y: 66 },
  { label: 'Patagonia', x: 30, y: 82 },
  { label: 'Canada', x: 22, y: 28 },
];

export interface WanderTour {
  name: string;
  duration: string;
  price: string;
  rating: string;
  plate: string;
}

export const WANDER_TOURS: WanderTour[] = [
  { name: 'Cyclades island hop', duration: '9 days', price: '$2,190', rating: '4.9', plate: 'wa-plate-a' },
  { name: 'Japan, coast to temple', duration: '12 days', price: '$3,480', rating: '4.9', plate: 'wa-plate-b' },
  { name: 'Patagonia traverse', duration: '11 days', price: '$3,950', rating: '5.0', plate: 'wa-plate-c' },
];

export const WANDER_GALLERY: { plate: string; span: 'tall' | 'wide' | 'sm' }[] = [
  { plate: 'wa-plate-b', span: 'tall' },
  { plate: 'wa-plate-a', span: 'wide' },
  { plate: 'wa-plate-c', span: 'sm' },
  { plate: 'wa-plate-d', span: 'sm' },
  { plate: 'wa-plate-a', span: 'wide' },
  { plate: 'wa-plate-b', span: 'tall' },
];

export const WANDER_STEPS: { icon: typeof MapPin; title: string; body: string }[] = [
  { icon: Compass, title: 'Discover', body: 'Browse handpicked places or tell us the vibe, and we shortlist the trips worth your time.' },
  { icon: CalendarCheck, title: 'Book', body: 'Flights, stays and experiences in one basket, at one honest price, with flexible dates.' },
  { icon: Plane, title: 'Explore', body: 'A local guide and a 24/7 line in your pocket, so the only thing to plan is dinner.' },
];

export const WANDER_STATS = [
  { value: 90, suffix: '+', label: 'Countries' },
  { value: 62, suffix: 'K', label: 'Happy travellers' },
  { value: 12, suffix: '', label: 'Years on the road' },
  { value: 4, suffix: '.9', label: 'Average rating' },
];

export const WANDER_REVIEWS: { quote: string; author: string; role: string }[] = [
  { quote: 'Every detail was handled, and every day still felt like ours. That balance is impossible to fake.', author: 'Nadia & Sam', role: 'Japan, 12 days' },
  { quote: 'Our guide took us to a beach with no name and no crowd. That is the whole trip in one memory.', author: 'The Whitfields', role: 'Greece, 9 days' },
  { quote: 'I have booked my own trips for years. I will never do it again after this one.', author: 'Marcus L.', role: 'Patagonia, 11 days' },
];

export const WANDER_CONTENT: TemplateContent = {
  brand: 'Wander',

  nav: WANDER_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'Trips designed by people who go',
    title: 'Find your next',
    titleAccent: 'somewhere.',
    subtitle:
      'Handpicked destinations, local guides and everything booked in one place. Tell us the feeling you are chasing and we will find the place that gives it.',
    ctaPrimary: 'Plan a trip',
    ctaSecondary: 'Browse destinations',
    stats: [
      { value: 90, suffix: '+', label: 'Countries' },
      { value: 62, suffix: 'K', label: 'Travellers' },
      { value: 4, suffix: '.9', label: 'Rating' },
    ],
  },

  marquee: ['Condé Nast', 'Lonely Planet', 'Nat Geo', 'Skyscanner', 'Airbnb', 'Booking', 'Google Reviews'],

  about: {
    eyebrow: 'About Wander',
    title: 'We plan the trip you would plan, with more time and better contacts.',
    body: [
      'Wander started with a simple frustration: the best trips take weeks to plan, and the tools make it harder, not easier. So we built a team of obsessive travellers and local guides to do the planning, and left the wandering to you.',
      'Everything is handpicked and honestly priced. No inflated packages, no places we would not send our own friends, and a real person on the end of the line at any hour.',
    ],
    points: [
      'Every stay and guide personally vetted',
      'One honest price, flights to farewells',
      'Local experts in ninety countries',
      'A 24/7 line, wherever you land',
    ],
  },

  services: {
    eyebrow: 'Ways to travel',
    title: 'However you like to move.',
    subtitle: 'From slow islands to high passes, choose the shape of the trip and we will fill in the rest.',
    items: [
      { icon: Waves, title: 'Islands & coast', body: 'Slow mornings, warm water and the kind of beach you have to be shown.' },
      { icon: Mountain, title: 'Mountains & trails', body: 'High passes, clear air and huts with a view worth the climb.' },
      { icon: Globe2, title: 'Cities & culture', body: 'The museums and the back streets, timed so you skip the queues.' },
      { icon: Camera, title: 'Wildlife & wild', body: 'Safaris, glaciers and the far corners, with guides who read the land.' },
    ],
  },

  why: {
    eyebrow: 'Why Wander',
    title: 'The trip, handled. The wandering, yours.',
    subtitle: 'The things that turn a good holiday into the one you keep talking about.',
    items: [
      { icon: Sparkles, title: 'Handpicked', body: 'Every stay, guide and experience is chosen by a human who has been there.' },
      { icon: MapPin, title: 'Local experts', body: 'Guides who know the shortcuts, the sunsets and where to actually eat.' },
      { icon: CalendarCheck, title: 'Flexible', body: 'Change dates or plans without the penalty games. Life happens.' },
      { icon: Headset, title: '24/7 support', body: 'A real person a tap away, in your timezone or theirs, the whole trip.' },
    ],
  },

  faq: {
    eyebrow: 'Good to know',
    title: 'Before you pack.',
    items: [
      { question: 'Can you build a custom trip?', answer: 'That is most of what we do. Tell us the feeling, the dates and the budget, and a trip designer builds an itinerary just for you, usually within a day.' },
      { question: 'What is included in a package?', answer: 'Flights, stays, listed experiences and your local guide. We are upfront about what is not included, so the price you see is the price you pay.' },
      { question: 'What if plans change?', answer: 'Most bookings are flexible, and where a supplier is not, we tell you before you pay. Life happens, and we would rather keep you than a cancellation fee.' },
      { question: 'Is it safe to travel with you?', answer: 'Every partner is vetted, you get a 24/7 support line, and our guides are trained and insured. We travel to these places ourselves.' },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Tell us where you are dreaming of.',
    subtitle: 'A real trip designer answers, usually within a day, wherever you are in the world.',
    fields: { name: 'Your name', email: 'Email', message: 'Where do you want to go?' },
    submit: 'Start planning',
    details: [
      { label: 'Plan a trip', value: 'hello@wander.travel' },
      { label: 'Call', value: '+1 (415) 555 0132' },
      { label: 'Support', value: '24/7, worldwide' },
      { label: 'Elsewhere', value: 'Instagram · YouTube' },
    ],
  },

  footer: {
    tagline: 'Handpicked destinations, local guides and everything booked in one place. Go further.',
    columns: [
      { title: 'Travel', links: ['Destinations', 'Tours', 'Packages', 'Gallery', 'Reviews'] },
      { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
      { title: 'Support', links: ['Help centre', 'Booking terms', 'Insurance', 'Safety'] },
    ],
    legal: '© 2026 Wander Travel Co. A template. Destinations and figures are illustrative.',
  },
};

export const WANDER_PROMPT = `Design an eight-page website (Home, Destinations, Tours, Packages, Gallery, Reviews, About, Contact) for an adventurous travel & tourism brand called Wander, in an immersive, warm, full-bleed style.

Visual direction: sunset warmth. A cream ground for content, a coral orange (#ff6a3d) with a cyan accent (#17b6c9), and big FULL-BLEED "photography" stood in by vivid gradient plates (a template ships no binary assets). Rounded, generous, adventurous.

Motion: Anime.js for scroll reveals, staggered headlines and count-ups; a clip-path IMAGE REVEAL on destination cards; hover-zoom inside fixed frames; a stylised MAP with pulsing location pins; a partner-logo marquee; Lenis smooth scroll. Everything degrades under prefers-reduced-motion - plates resolve visible, pins and marquee stop.

Sections (Home): a header transparent over the hero that solidifies on scroll, with a Plan-a-trip CTA; a FULL-BLEED immersive hero over a sunset gradient plate with a headline whose second word is the cyan accent, a subtitle and a search bar (destination + when); a partner marquee; an interactive destinations grid with clip-reveal plates, price and hover-zoom; ways-to-travel categories; featured tours with duration, price and rating; a stylised world map with pulsing pins; a why-book-with-us row; a three-step how-it-works; a gallery masonry; discreet numbers; traveller reviews; an FAQ; a closing invitation; a footer. Inner pages open with a masthead and recompose the shared sections.

Tone: warm, inspiring, expert. The trip handled, the wandering yours.`;
