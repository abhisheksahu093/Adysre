import {
  Building2,
  Handshake,
  KeyRound,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * HAVEN - content for a luxury real-estate website.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * Seven pages, routed by `?page=`. The identity is quiet luxury: a white ground,
 * a deep forest green with a warm sand accent, 3D-inspired property cards, a live
 * mortgage calculator and a modern, dashboard-clean layout. Listings, agents and
 * figures are ILLUSTRATIVE (a template ships no photography, so imagery is soft
 * green plates).
 */

export const HAVEN_PAGES = ['home', 'properties', 'details', 'agents', 'pricing', 'about', 'contact'] as const;
export type HavenPageId = (typeof HAVEN_PAGES)[number];

export const HAVEN_LABELS = {
  skipToContent: 'Skip to content',
  menu: 'Menu',
  close: 'Close menu',
  cta: 'Book a viewing',
} as const;

export const HAVEN_NAV: { id: HavenPageId; label: string }[] = [
  { id: 'properties', label: 'Properties' },
  { id: 'details', label: 'A residence' },
  { id: 'agents', label: 'Agents' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'about', label: 'About' },
];

export const HAVEN_PAGE_META: { id: HavenPageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  ...HAVEN_NAV,
  { id: 'contact', label: 'Contact' },
];

export interface HavenMasthead {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export const HAVEN_MASTHEADS: Record<Exclude<HavenPageId, 'home'>, HavenMasthead> = {
  properties: {
    eyebrow: 'Properties',
    title: 'Homes worth coming home to.',
    subtitle: 'A curated collection of residences, each chosen for the way it lives, not just the way it looks.',
  },
  details: {
    eyebrow: 'A residence',
    title: 'The Cedar House.',
    subtitle: 'Four bedrooms, an acre of quiet, and the kind of light architects talk about. A closer look.',
  },
  agents: {
    eyebrow: 'Our agents',
    title: 'People who know the street, not just the listing.',
    subtitle: 'Senior agents with the local knowledge and the patience to find the one that fits.',
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Fair, transparent, no surprises.',
    subtitle: 'One clear fee for a full-service sale or search. What you see is what you pay.',
  },
  about: {
    eyebrow: 'About Haven',
    title: 'A different kind of estate agency.',
    subtitle: 'Fewer listings, more attention. We represent homes we would happily live in ourselves.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let us find your next address.',
    subtitle: 'Book a viewing or a valuation. A senior agent, not a call centre, gets back to you.',
  },
};

export interface HavenProperty {
  name: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  area: string;
  plate: string;
  tag: string;
}

export const HAVEN_PROPERTIES: HavenProperty[] = [
  { name: 'The Cedar House', location: 'Ashford Hills', price: '$2,450,000', beds: 4, baths: 3, area: '3,200 sqft', plate: 'hv-plate-a', tag: 'New' },
  { name: 'Marlow Penthouse', location: 'Riverside', price: '$3,180,000', beds: 3, baths: 3, area: '2,400 sqft', plate: 'hv-plate-b', tag: 'Featured' },
  { name: 'Willow Cottage', location: 'Elmswood', price: '$1,290,000', beds: 3, baths: 2, area: '1,850 sqft', plate: 'hv-plate-c', tag: 'For sale' },
  { name: 'The Glass Villa', location: 'Cliffside', price: '$4,600,000', beds: 5, baths: 5, area: '5,100 sqft', plate: 'hv-plate-a', tag: 'Luxury' },
  { name: 'Aster Townhouse', location: 'Old Town', price: '$980,000', beds: 2, baths: 2, area: '1,400 sqft', plate: 'hv-plate-c', tag: 'For sale' },
  { name: 'Meadow Barn', location: 'North Vale', price: '$1,760,000', beds: 4, baths: 3, area: '2,900 sqft', plate: 'hv-plate-b', tag: 'New' },
];

export interface HavenAgent {
  name: string;
  title: string;
  plate: string;
  deals: string;
}

export const HAVEN_AGENTS: HavenAgent[] = [
  { name: 'Eleanor Voss', title: 'Principal, Luxury', plate: 'hv-plate-a', deals: '180+ sales' },
  { name: 'Theo Marsh', title: 'Senior agent, City', plate: 'hv-plate-b', deals: '140+ sales' },
  { name: 'Priya Anand', title: 'Senior agent, Country', plate: 'hv-plate-c', deals: '210+ sales' },
  { name: 'Daniel Roe', title: 'New homes lead', plate: 'hv-plate-a', deals: '95+ sales' },
];

export const HAVEN_STEPS: { icon: typeof Search; title: string; body: string }[] = [
  { icon: Search, title: 'Search', body: 'Tell us the life you want, not just the postcode. We shortlist homes that actually fit.' },
  { icon: KeyRound, title: 'Tour', body: 'Private viewings on your schedule, with an agent who answers the awkward questions honestly.' },
  { icon: Handshake, title: 'Own', body: 'One agent from offer to keys, handling the paperwork so completion is the calm part.' },
];

export const HAVEN_STATS = [
  { value: 1200, suffix: '+', label: 'Homes sold' },
  { value: 24, suffix: '', label: 'Neighbourhoods' },
  { value: 8, suffix: 'K', label: 'Happy owners' },
  { value: 99, suffix: '%', label: 'Would refer' },
];

export const HAVEN_TESTIMONIALS: { quote: string; author: string; role: string }[] = [
  { quote: 'They talked us out of two houses before finding the right one. That honesty is why we came back to sell.', author: 'The Harpers', role: 'Bought in Ashford Hills' },
  { quote: 'Sold above asking in nine days, and I never once felt like a transaction. Rare.', author: 'Marianne C.', role: 'Sold in Riverside' },
  { quote: 'Our agent knew the street, the neighbours and the light at 4pm. That is the whole job, done well.', author: 'Owen & Ruth', role: 'Bought in Elmswood' },
];

/** Defaults for the interactive mortgage calculator (illustrative). */
export const HAVEN_MORTGAGE = {
  price: 1290000,
  downPercent: 20,
  ratePercent: 5.4,
  years: 30,
  priceMin: 300000,
  priceMax: 5000000,
};

export const HAVEN_CONTENT: TemplateContent = {
  brand: 'Haven',

  nav: HAVEN_NAV.map((item) => ({ href: `?page=${item.id}`, label: item.label })),

  hero: {
    badge: 'A curated collection of residences',
    title: 'Find the home that',
    titleAccent: 'finds you back.',
    subtitle:
      'A boutique estate agency for people who care how a home lives, not just how it lists. Fewer properties, more attention, and agents who know the street.',
    ctaPrimary: 'Browse residences',
    ctaSecondary: 'Book a valuation',
    stats: [
      { value: 1200, suffix: '+', label: 'Homes sold' },
      { value: 24, suffix: '', label: 'Neighbourhoods' },
      { value: 99, suffix: '%', label: 'Would refer' },
    ],
  },

  marquee: ['Forbes', 'Architectural Digest', 'Dwell', 'The Times', 'Robb Report', 'Elle Decor'],

  about: {
    eyebrow: 'About Haven',
    title: 'A different kind of estate agency.',
    body: [
      'Haven was built on a quiet conviction: that a home is the biggest, most personal decision most people make, and it deserves more than a listing and a lockbox.',
      'So we carry fewer properties, give each one a senior agent, and only represent homes we would happily live in ourselves. It is a slower way to work, and a much better way to buy.',
    ],
    points: [
      'Fewer listings, a senior agent on each',
      'One clear fee, no hidden costs',
      'Local knowledge, street by street',
      'One agent from offer to keys',
    ],
  },

  services: {
    eyebrow: 'What we do',
    title: 'Full service, either side of the sale.',
    subtitle: 'Buying or selling, one team handles the whole of it, so the stressful parts stay quiet.',
    items: [
      { icon: Building2, title: 'Buying', body: 'A curated shortlist, honest advice and viewings on your schedule until the right one appears.' },
      { icon: TrendingUp, title: 'Selling', body: 'Considered pricing, beautiful presentation and a negotiation run in your interest, not the clock’s.' },
      { icon: KeyRound, title: 'New homes', body: 'Early access to developments we trust, with the reservations handled and the small print read.' },
      { icon: ShieldCheck, title: 'Valuations', body: 'A grounded, defensible figure for a sale, a purchase or simply knowing where you stand.' },
    ],
  },

  why: {
    eyebrow: 'Why Haven',
    title: 'The details that decide it.',
    subtitle: 'The quiet advantages that turn a stressful move into a good decision, well made.',
    items: [
      { icon: Sparkles, title: 'Curated listings', body: 'Every home is one we would live in. No filler, no bait, no wasted viewings.' },
      { icon: Handshake, title: 'Expert agents', body: 'Senior, local and patient. The person you meet is the person who sees it through.' },
      { icon: ShieldCheck, title: 'Transparent pricing', body: 'One clear fee, agreed upfront. What you see is exactly what you pay.' },
      { icon: KeyRound, title: 'Seamless closing', body: 'The paperwork, chased and checked, so completion day is the calm one.' },
    ],
  },

  faq: {
    eyebrow: 'Questions',
    title: 'Good to know.',
    items: [
      { question: 'How do your fees work?', answer: 'One clear fee, agreed before we start, for a full-service sale or search. No hidden costs, no surprises at completion, and nothing charged if a sale falls through for reasons outside your control.' },
      { question: 'Do you only handle luxury homes?', answer: 'No. We carry homes across a wide range of prices; the common thread is that each is one we would happily live in ourselves, not a particular price bracket.' },
      { question: 'Can you help me sell and buy at once?', answer: 'That is one of the things we do best. A single agent coordinates both chains, so the timing lines up and you are never caught between two homes.' },
      { question: 'How accurate is the mortgage calculator?', answer: 'It is a good guide, not a quote. It estimates a monthly repayment from the price, deposit, rate and term; your lender will confirm the real figures for your circumstances.' },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Let us find your next address.',
    subtitle: 'Book a viewing or a valuation. A senior agent, not a call centre, gets back to you.',
    fields: { name: 'Your name', email: 'Email', message: 'What are you looking for?' },
    submit: 'Book a viewing',
    details: [
      { label: 'Office', value: 'hello@haven.estate' },
      { label: 'Call', value: '+1 (212) 555 0173' },
      { label: 'Visit', value: '8 Ashford Row, Old Town' },
      { label: 'Hours', value: 'Mon to Sat, 9 to 7' },
    ],
  },

  footer: {
    tagline: 'A boutique estate agency. Fewer listings, more attention, agents who know the street.',
    columns: [
      { title: 'Explore', links: ['Properties', 'A residence', 'Agents', 'Pricing', 'Valuations'] },
      { title: 'Agency', links: ['About', 'Careers', 'Press', 'Contact'] },
      { title: 'Legal', links: ['Terms', 'Privacy', 'Complaints', 'Accessibility'] },
    ],
    legal: '© 2026 Haven Estates. A template. Listings, agents and figures are illustrative.',
  },
};

export const HAVEN_PROMPT = `Design a seven-page website (Home, Properties, Property Details, Agents, Pricing, About, Contact) for a luxury boutique estate agency called Haven, in a modern, quietly luxurious style.

Visual direction: white and dark forest green (#1f4d36) with a warm sand accent, a clean sans, generous whitespace and a modern, dashboard-clean layout. 3D-INSPIRED property cards with real depth (soft layered shadow, a subtle hover lift/tilt), and "photography" stood in by soft green gradient plates (a template ships no binary assets).

Motion: Anime.js for scroll reveals, staggered headlines and count-ups; a clip-path image reveal on property cards; a hover lift on the 3D cards; a live, interactive MORTGAGE CALCULATOR (sliders for price, deposit, rate and term that recompute the monthly payment in real time); a press marquee; Lenis smooth scroll. Everything degrades under prefers-reduced-motion.

Sections (Home): a header with a Book-a-viewing CTA; a hero with a headline whose second line is the accent, a subtitle, two CTAs, trust stats and a floating featured-property card (price, beds/baths/area); a press marquee; a curated properties grid of 3D cards with clip-reveal plates, price and specs; a what-we-do row; the mortgage calculator; featured agents as cards; a why-Haven row; a three-step how-it-works; discreet numbers; owner testimonials; an FAQ; a closing invitation; a footer. Inner pages open with a masthead and recompose the shared sections; Property Details also shows the calculator.

Tone: assured, warm, precise. Fewer listings, more attention.`;
