import {
  BadgeCheck,
  CalendarClock,
  ClipboardList,
  Compass,
  Handshake,
  Ruler,
  ScrollText,
  Trees,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * VERDANT - content for the real-estate agency template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * VERDANT is the first MULTIPAGE template, so this module carries more than the
 * shared `TemplateContent` shape: the listings themselves, and the copy for the
 * three pages beyond the home page. Those extras are typed locally rather than
 * pushed into `types.ts`, because a listing with beds and baths is this
 * template's domain, not every template's.
 */

/** The pages the template can render. `home` is what an unknown id falls back to. */
export const VERDANT_PAGES = ['home', 'listings', 'about', 'contact'] as const;
export type VerdantPageId = (typeof VERDANT_PAGES)[number];

/** Sales state shown as a chip on every listing card. */
export type VerdantStatus = 'For sale' | 'Under offer' | 'New listing';

/**
 * Which CSS composition a card draws in place of a photograph. The template
 * ships no image assets, so each listing picks one of three gradient "window"
 * treatments (see `verdant.css`) and the grid still reads as varied.
 */
export type VerdantView = 'a' | 'b' | 'c';

export interface VerdantListing {
  /** Stable key, also the filter/rendering identity. */
  id: string;
  title: string;
  /** Neighbourhood, printed under the title. */
  area: string;
  /** Coarse grouping the filter chips work on. */
  district: string;
  /** Formatted for display - a template has no locale layer to format through. */
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  status: VerdantStatus;
  view: VerdantView;
  summary: string;
}

/**
 * The book. Nine homes, ordered as the agency would show them: the two it is
 * proudest of first, since the home page features the opening three.
 */
export const VERDANT_LISTINGS: VerdantListing[] = [
  {
    id: 'laurelhurst-craftsman',
    title: 'Restored 1912 Craftsman',
    area: 'Laurelhurst',
    district: 'Eastside',
    price: '$1,285,000',
    beds: 4,
    baths: 3,
    sqft: 3140,
    status: 'For sale',
    view: 'a',
    summary:
      'Quarter-sawn oak throughout, a rebuilt sleeping porch and a garden that backs onto the park path. Seismic retrofit completed in 2023.',
  },
  {
    id: 'council-crest-modern',
    title: 'Cantilevered house above Council Crest',
    area: 'Council Crest',
    district: 'West Hills',
    price: '$2,340,000',
    beds: 3,
    baths: 3,
    sqft: 3620,
    status: 'New listing',
    view: 'c',
    summary:
      'Two glazed volumes stepped down the slope, with a 40-foot span over the ravine and a view that runs from Mount Hood to the river.',
  },
  {
    id: 'irvington-foursquare',
    title: 'Brick Foursquare on Thompson',
    area: 'Irvington',
    district: 'Eastside',
    price: '$1,050,000',
    beds: 4,
    baths: 2,
    sqft: 2870,
    status: 'Under offer',
    view: 'b',
    summary:
      'Original leaded glass, a coach house converted to a studio in 2019, and one of the last uncut lots on the block.',
  },
  {
    id: 'sellwood-cottage',
    title: 'Cottage two blocks from Oaks Park',
    area: 'Sellwood-Moreland',
    district: 'Eastside',
    price: '$735,000',
    beds: 2,
    baths: 1,
    sqft: 1480,
    status: 'For sale',
    view: 'a',
    summary:
      'A 1926 cottage with the porch reopened, new sash windows cut to the original profile and a detached workshop off the alley.',
  },
  {
    id: 'willamette-heights-rebuild',
    title: 'Cedar-clad rebuild on Aspen Avenue',
    area: 'Willamette Heights',
    district: 'West Hills',
    price: '$1,690,000',
    beds: 4,
    baths: 3,
    sqft: 3010,
    status: 'For sale',
    view: 'b',
    summary:
      'Taken back to the frame in 2021: mass-timber stair, heat-pump heating and a kitchen that opens onto a terrace above Forest Park.',
  },
  {
    id: 'riverplace-loft',
    title: 'Corner loft at RiverPlace',
    area: 'South Waterfront',
    district: 'Riverfront',
    price: '$865,000',
    beds: 2,
    baths: 2,
    sqft: 1620,
    status: 'New listing',
    view: 'c',
    summary:
      'Eleventh floor, glass on two sides, and a deeded slip on the marina below. The building rebuilt its envelope in 2022.',
  },
  {
    id: 'ladds-tudor',
    title: 'Tudor on the Ladd Circle',
    area: 'Ladd’s Addition',
    district: 'Eastside',
    price: '$975,000',
    beds: 3,
    baths: 2,
    sqft: 2240,
    status: 'For sale',
    view: 'a',
    summary:
      'Facing the rose garden, with the original plaster arches intact and a basement dug out and waterproofed for a fourth bedroom.',
  },
  {
    id: 'skyline-barn',
    title: 'Barn conversion off Skyline',
    area: 'Forest Park',
    district: 'West Hills',
    price: '$1,420,000',
    beds: 3,
    baths: 2,
    sqft: 2560,
    status: 'Under offer',
    view: 'b',
    summary:
      'A 1948 dairy barn on 1.4 acres, converted in 2018 with the original trusses left exposed across a double-height living room.',
  },
  {
    id: 'macadam-terrace',
    title: 'Terrace apartment on Macadam',
    area: 'Johns Landing',
    district: 'Riverfront',
    price: '$612,000',
    beds: 1,
    baths: 1,
    sqft: 980,
    status: 'For sale',
    view: 'c',
    summary:
      'A quiet one-bedroom with a 300-square-foot terrace over the greenway, five minutes from the streetcar at Gibbs.',
  },
];

/**
 * Filter chips for the listings page. `all` is authored rather than derived so
 * its label is written copy like every other string the visitor reads.
 */
export const VERDANT_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Every home' },
  { id: 'Eastside', label: 'Eastside' },
  { id: 'West Hills', label: 'West Hills' },
  { id: 'Riverfront', label: 'Riverfront' },
];

/** Column headings for the metadata row under each listing title. */
export const VERDANT_METRICS = {
  beds: 'Beds',
  baths: 'Baths',
  sqft: 'Sq ft',
} as const;

/** Copy for the featured block on the home page. */
export const VERDANT_FEATURED = {
  eyebrow: 'Currently with us',
  title: 'Three houses worth a Saturday morning',
  subtitle:
    'We take on around forty homes a year, which is how every one of them gets a floor plan drawn, a survey read and a broker who has stood in the basement.',
  cta: 'See all listings',
  ctaHref: '?page=listings',
} as const;

/** Copy for the dedicated listings page. */
export const VERDANT_LISTINGS_PAGE = {
  eyebrow: 'The book',
  title: 'Homes we are representing this season',
  subtitle:
    'Updated every Tuesday. Prices are as instructed by the seller, square footage is measured on site rather than taken from the county record.',
  filterLegend: 'Filter by district',
  resultsSuffix: 'homes shown',
  empty: 'No homes in that district this week. Ask us what is coming.',
} as const;

/** Copy for the dedicated about page, beyond the shared `about` block. */
export const VERDANT_ABOUT_PAGE = {
  teamEyebrow: 'The brokers',
  teamTitle: 'Four people, one office on Broadway',
  team: [
    {
      name: 'Marisol Reyes',
      role: 'Principal broker',
      bio: 'Founded Verdant in 2012 after nine years valuing period property for the county assessor. Handles the West Hills and anything with a structural question mark.',
    },
    {
      name: 'Daniel Achebe',
      role: 'Broker, eastside',
      bio: 'Grew up four blocks from Ladd Circle and has sold on it eleven times. Reads a 1920s permit file faster than anyone we know.',
    },
    {
      name: 'Priya Raghunathan',
      role: 'Buyer representation',
      bio: 'Twelve years on the buying side, including six advising relocating families on schools, commute and the parts of a survey that actually matter.',
    },
    {
      name: 'Tomas Lindqvist',
      role: 'Surveys and floor plans',
      bio: 'Measures and draws every home we list. If a plan says 2,240 square feet, Tomas walked it with a laser and signed the drawing.',
    },
  ],
  milestonesEyebrow: 'How we got here',
  milestones: [
    { year: '2012', label: 'Opened above a bookshop on Broadway with two brokers and eight listings' },
    { year: '2016', label: 'Began measuring and drawing every home we represent, in house' },
    { year: '2020', label: 'Added a buyer-only team so the two sides of a deal never share a broker' },
    { year: '2024', label: 'Passed 600 homes sold, with an average of 19 days from listing to accepted offer' },
  ],
} as const;

/** Copy for the dedicated contact page, beyond the shared `contact` block. */
export const VERDANT_CONTACT_PAGE = {
  officesEyebrow: 'Where to find us',
  offices: [
    {
      name: 'Broadway office',
      address: '1841 NE Broadway, Suite 3, Portland OR 97232',
      hours: 'Monday to Friday, 9am to 6pm. Saturday viewings by arrangement.',
    },
    {
      name: 'Sellwood desk',
      address: '8102 SE 13th Avenue, Portland OR 97202',
      hours: 'Thursday to Saturday, 10am to 4pm.',
    },
  ],
  sentTitle: 'Request received',
  sentBody: 'Thank you. A broker will reply within one business day, usually the same afternoon.',
} as const;

/** Chrome that is not section copy: menu labels, skip link, current-page hint. */
export const VERDANT_UI = {
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  headerCta: 'Book a valuation',
  headerCtaHref: '?page=contact',
  listingsNav: 'Listing filters',
  viewListing: 'Arrange a viewing',
} as const;

export const VERDANT_CONTENT: TemplateContent = {
  brand: 'Verdant',

  /*
   * Query hrefs, not anchors: the preview route reads `?page=` and hands it to
   * the template, so navigation works with no router and no client-side link
   * component. A downloaded copy keeps working the same way.
   */
  nav: [
    { href: '?page=home', label: 'Home' },
    { href: '?page=listings', label: 'Listings' },
    { href: '?page=about', label: 'About' },
    { href: '?page=contact', label: 'Contact' },
  ],

  hero: {
    badge: 'Portland, the west hills and the river',
    title: 'The house is the easy part.',
    titleAccent: 'We handle everything under it',
    subtitle:
      'Verdant represents around forty homes a year across Portland. Every one gets a measured floor plan, a read of the permit file and a broker who has been in the crawl space before you have.',
    ctaPrimary: 'Browse listings',
    ctaSecondary: 'Book a valuation',
    stats: [
      { value: 612, suffix: '', label: 'Homes sold since 2012' },
      { value: 19, suffix: ' days', label: 'Median time to offer' },
      { value: 98, suffix: '%', label: 'Of asking price achieved' },
    ],
  },

  marquee: [
    'Laurelhurst',
    'Irvington',
    'Sellwood-Moreland',
    'Council Crest',
    'Ladd’s Addition',
    'Willamette Heights',
    'Forest Park',
    'South Waterfront',
  ],

  about: {
    eyebrow: 'About Verdant',
    title: 'Started by a valuer who was tired of guessed square footage',
    body: [
      'Marisol Reyes spent nine years valuing period property for the county assessor, and watched the same houses come back to market with numbers nobody had checked. A porch counted as living space. A converted attic with no permit. Two thousand square feet that measured seventeen hundred.',
      'Verdant opened in 2012 above a bookshop on Broadway with a rule that has not moved since: we measure and draw every home we represent, and we say what the survey found even when it costs us the instruction.',
    ],
    points: [
      'Every listing measured on site and drawn to scale',
      'Permit history read and summarised before we price',
      'Buyer and seller are never represented by the same broker',
    ],
  },

  services: {
    eyebrow: 'What we do',
    title: 'Four things, done properly',
    subtitle:
      'A small book is a deliberate choice. It is what lets each of these be real work rather than a line on a listing agreement.',
    items: [
      {
        icon: Ruler,
        title: 'Measured survey',
        body: 'Tomas walks every room with a laser and draws the plan to scale. Square footage on a Verdant listing is a measurement, not a county estimate.',
      },
      {
        icon: ScrollText,
        title: 'Permit and title read',
        body: 'We pull the permit file and the title before we price. Unpermitted work is disclosed in the brochure, not discovered in escrow.',
      },
      {
        icon: Compass,
        title: 'Buyer representation',
        body: 'A separate team, so nobody sits on both sides of a deal. Priya will tell you to walk away from a house we listed if that is the right answer.',
      },
      {
        icon: Handshake,
        title: 'Sale management',
        body: 'One broker from valuation to keys, with a weekly written update. You never explain your own house to a new person mid-sale.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Verdant',
    title: 'What forty homes a year buys you',
    subtitle:
      'We could list three times as many. These are the four things that would stop being true if we did.',
    items: [
      {
        icon: BadgeCheck,
        title: 'A price you can defend',
        body: 'Valuations come with the three comparables they rest on and the adjustments made to each. Homes we list sell at a median 98% of asking.',
      },
      {
        icon: CalendarClock,
        title: 'Nineteen days, typically',
        body: 'Median time from listing to accepted offer across 2024 and 2025. Correct pricing does more for that number than any amount of marketing.',
      },
      {
        icon: ClipboardList,
        title: 'Nothing found late',
        body: 'Survey, permits and title are read before launch, so the questions a buyer asks in week three were answered in the brochure in week one.',
      },
      {
        icon: Trees,
        title: 'People who live here',
        body: 'All four brokers live within three miles of the office. The advice about a block comes from walking it, not from the sales history.',
      },
    ],
  },

  faq: {
    eyebrow: 'Common questions',
    title: 'What sellers ask us first',
    items: [
      {
        question: 'What is your commission, and is it negotiable?',
        answer:
          'We charge 2.5% of the sale price to represent a seller, with the buyer-side fee agreed separately and disclosed in writing before launch. It is negotiable on homes above two million, and we will say so rather than wait to be asked.',
      },
      {
        question: 'How long does a valuation take?',
        answer:
          'About ninety minutes on site, then three working days for the written valuation with its comparables and the measured plan. There is no charge and no obligation to instruct us.',
      },
      {
        question: 'Do you take homes outside Portland?',
        answer:
          'Within about twenty-five miles, so Lake Oswego, Milwaukie and the Columbia bank included. Beyond that we would be selling a market we do not walk, and we will refer you to someone who does.',
      },
      {
        question: 'What happens if the survey finds something bad?',
        answer:
          'It goes in the brochure. A foundation crack or unpermitted attic conversion disclosed at launch costs a few thousand dollars in price. The same thing found by a buyer in week five costs the sale.',
      },
      {
        question: 'Can I use Verdant to buy as well as sell?',
        answer:
          'Yes, and you will have two different brokers. Priya leads buyer representation precisely so that no Verdant broker ever advises both sides of the same transaction.',
      },
    ],
  },

  contact: {
    eyebrow: 'Get in touch',
    title: 'Tell us about the house',
    subtitle:
      'A valuation, a viewing or a question about a block you are considering. Marisol reads everything that comes through this form and answers within a business day.',
    fields: { name: 'Your name', email: 'Email address', message: 'Which home, or which street' },
    submit: 'Send request',
    details: [
      { label: 'Email', value: 'brokers@verdant.example' },
      { label: 'Telephone', value: '+1 (503) 555-0148' },
      { label: 'Office', value: '1841 NE Broadway, Suite 3, Portland' },
    ],
  },

  footer: {
    tagline: 'A small Portland agency that measures the house before it prices it.',
    columns: [
      { title: 'Buying', links: ['Current listings', 'Buyer representation', 'Neighbourhood notes', 'Mortgage introductions'] },
      { title: 'Selling', links: ['Book a valuation', 'Measured surveys', 'Marketing approach', 'Fees explained'] },
      { title: 'Agency', links: ['About Verdant', 'Our brokers', 'Careers', 'Licensing'] },
    ],
    legal: '© 2026 Verdant Property LLC. Licensed in Oregon. All rights reserved.',
  },
};

/** The prompt a visitor copies to generate a site in this spirit. */
export const VERDANT_PROMPT = `Design a four-page website for a small, premium real-estate agency called Verdant.

Pages: home, listings, about, contact. A shared header and footer wrap all four, and the header nav marks the current page.

Art direction:
- Deep forest green #0d2f24 against a warm sand #e8e2d5, with a single brass #c9a227 accent used for eyebrows, chips and one primary button. Nothing else is coloured.
- Modern grotesque type: tight -0.02em tracking on large headings, uppercase eyebrows at 0.28em, and tabular figures for prices and square footage.
- Photography is replaced by CSS: each property block is a stack of gradients reading as sky, facade and planting, plus a floor-plan line drawing built from repeating linear gradients. No image assets anywhere.
- Generous cards, 20px corners, hairline borders and a soft low shadow. Lots of whitespace between sections.

Sections: a forest-green hero with a badge, two-line headline, two calls to action and three counters; a neighbourhood marquee; a featured grid of three homes; a "why us" grid; an accordion FAQ. The listings page is a nine-card grid with district filter chips and a price / beds / baths / square-feet metadata row on every card. About carries the founding story, a four-person broker list and a dated timeline. Contact pairs a form with office addresses and opening hours.

Motion: sections fade and rise 18px on entry, counters count once, the marquee scrolls, cards lift 4px on hover, and everything is static under prefers-reduced-motion.

Voice: concrete and unsentimental. Real neighbourhoods, real prices, real square footage, no exclamation marks.`;
