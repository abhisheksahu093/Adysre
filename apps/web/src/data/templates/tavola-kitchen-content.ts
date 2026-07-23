import { BadgeCheck, Leaf, Truck, MonitorSmartphone } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * TAVOLA - a modern kitchen-to-table restaurant, in English.
 *
 * The template is MULTIPAGE, BILINGUAL and MULTI-CURRENCY, which shapes every
 * decision in this file:
 *
 * - Pages are addressed by `?page=`, not by a router, so the same markup works
 *   in the preview route, in a card iframe and in a downloaded project.
 * - Every human-readable string lives here and has a twin in
 *   `tavola-kitchen-content-ja.ts`. Components read the ACTIVE bundle, never
 *   this module directly, which is what makes the language picker change the
 *   whole page rather than only the header.
 * - Money is a plain number in ONE base currency (USD). Nothing downstream
 *   stores a formatted price, so switching currency moves every figure on the
 *   page at once. The base is deliberately NOT translated - a converted price
 *   must be identical in both languages.
 *
 * `tavola-locale-parity.test.ts` holds the two bundles to that contract.
 */

/* ------------------------------------------------------------------ routing */

export const TAVOLA_PAGES = ['home', 'menu', 'services', 'blog', 'contact', 'cart'] as const;
export type TavolaPageId = (typeof TAVOLA_PAGES)[number];

/** An internal link. Query-string routing - see the note above. */
export function tavolaHref(page: TavolaPageId, hash?: string): string {
  return `?page=${page}${hash ? `#${hash}` : ''}`;
}

/** Resolve a raw `?page=` value, falling back to home rather than rendering nothing. */
export function toTavolaPage(value?: string): TavolaPageId {
  return TAVOLA_PAGES.includes(value as TavolaPageId) ? (value as TavolaPageId) : 'home';
}

/* ------------------------------------------------------------------- shapes */

export interface TavolaCategory {
  id: string;
  label: string;
}

export interface TavolaDish {
  id: string;
  categoryId: string;
  name: string;
  blurb: string;
  /** Base price in USD. Converted at render; never translated. */
  price: number;
  rating: number;
  reviews: number;
  /** Minutes to prepare - shown on the menu page. */
  minutes: number;
  /** Drives the CSS-drawn plate, so the template ships without image assets. */
  palette: 'tomato' | 'herb' | 'saffron' | 'char' | 'cream' | 'berry';
  /** Optional ribbon, already localised. */
  badge?: string;
}

export interface TavolaPost {
  id: string;
  title: string;
  excerpt: string;
  /** Pre-formatted per locale: a date is prose here, not a timestamp. */
  date: string;
  readMinutes: number;
  author: string;
  palette: 'tomato' | 'herb' | 'saffron' | 'char' | 'cream' | 'berry';
}

export interface TavolaReview {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  date: string;
}

export interface TavolaStep {
  id: string;
  title: string;
  body: string;
}

/** Every string the restaurant renders outside `TemplateContent`. */
export interface TavolaCopy {
  common: {
    mainNav: string;
    openMenu: string;
    closeMenu: string;
    cart: string;
    cartCount: string;
    signIn: string;
    signUp: string;
    order: string;
    /** Names the header's currency and language pickers, which show only a value. */
    currencyLabel: string;
    languageLabel: string;
    addToCart: string;
    added: string;
    from: string;
    minutes: string;
    reviews: string;
    readMore: string;
    viewAll: string;
    previous: string;
    next: string;
  };
  home: {
    heroBadge: string;
    heroDiscount: string;
    heroDelivery: string;
    heroReviews: string;
    dishesEyebrow: string;
    dishesTitle: string;
    stepsEyebrow: string;
    stepsTitle: string;
    stepsSubtitle: string;
    simpleEyebrow: string;
    simpleTitle: string;
    simpleBody: string;
    simplePoints: string[];
    blogEyebrow: string;
    blogTitle: string;
    reviewsEyebrow: string;
    reviewsTitle: string;
  };
  menu: {
    title: string;
    subtitle: string;
    all: string;
    empty: string;
    /** `{count}` is replaced with the number of dishes shown. */
    count: string;
  };
  services: {
    title: string;
    subtitle: string;
  };
  blog: {
    title: string;
    subtitle: string;
    readTime: string;
    by: string;
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    guests: string;
    date: string;
    notes: string;
    submit: string;
    sent: string;
    hours: string;
    hoursValue: string[];
    address: string;
    addressValue: string;
    phone: string;
    phoneValue: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyCta: string;
    item: string;
    quantity: string;
    remove: string;
    subtotal: string;
    delivery: string;
    deliveryFree: string;
    total: string;
    checkout: string;
    note: string;
  };
}

/* ----------------------------------------------------------------- catalogue */

export const TAVOLA_CATEGORIES: TavolaCategory[] = [
  { id: 'signature', label: 'Signature' },
  { id: 'pasta', label: 'Pasta' },
  { id: 'grill', label: 'From the grill' },
  { id: 'garden', label: 'Garden' },
  { id: 'dessert', label: 'Dessert' },
];

export const TAVOLA_DISHES: TavolaDish[] = [
  {
    id: 'harvest-bowl',
    categoryId: 'garden',
    name: 'Harvest Grain Bowl',
    blurb: 'Charred broccolini, farro, soft egg and a lemon-tahini dressing finished with dukkah.',
    price: 16.5,
    rating: 4.8,
    reviews: 214,
    minutes: 15,
    palette: 'herb',
    badge: 'Chef’s pick',
  },
  {
    id: 'san-marzano',
    categoryId: 'pasta',
    name: 'San Marzano Rigatoni',
    blurb: 'Slow-cooked tomato, torn basil, aged pecorino and a spoon of chilli butter.',
    price: 26.88,
    rating: 4.9,
    reviews: 388,
    minutes: 20,
    palette: 'tomato',
    badge: 'Most loved',
  },
  {
    id: 'wild-mushroom',
    categoryId: 'pasta',
    name: 'Wild Mushroom Tagliatelle',
    blurb: 'Hand-cut ribbons, girolles, thyme cream and a shave of black truffle.',
    price: 55.0,
    rating: 4.9,
    reviews: 176,
    minutes: 22,
    palette: 'char',
  },
  {
    id: 'coal-chicken',
    categoryId: 'grill',
    name: 'Coal-Roast Chicken',
    blurb: 'Brined overnight, roasted over embers, served with burnt lemon and green sauce.',
    price: 32.4,
    rating: 4.7,
    reviews: 291,
    minutes: 28,
    palette: 'saffron',
  },
  {
    id: 'saffron-risotto',
    categoryId: 'signature',
    name: 'Saffron Risotto',
    blurb: 'Carnaroli rice, bone marrow butter and saffron bloomed in white wine.',
    price: 29.6,
    rating: 4.8,
    reviews: 152,
    minutes: 25,
    palette: 'saffron',
  },
  {
    id: 'sea-bream',
    categoryId: 'grill',
    name: 'Whole Sea Bream',
    blurb: 'Salt-baked and opened at the table, with fennel, caper and blood orange.',
    price: 41.0,
    rating: 4.9,
    reviews: 118,
    minutes: 30,
    palette: 'cream',
  },
  {
    id: 'garden-burrata',
    categoryId: 'garden',
    name: 'Burrata & Heritage Tomato',
    blurb: 'Pugliese burrata, tomatoes picked that morning, basil oil and sourdough crumb.',
    price: 16.7,
    rating: 4.6,
    reviews: 203,
    minutes: 10,
    palette: 'tomato',
  },
  {
    id: 'olive-focaccia',
    categoryId: 'signature',
    name: 'Rosemary Focaccia',
    blurb: 'Twenty-four hour ferment, Taggiasca olives, sea salt and new-season oil.',
    price: 10.7,
    rating: 4.7,
    reviews: 264,
    minutes: 8,
    palette: 'cream',
  },
  {
    id: 'chocolate-tart',
    categoryId: 'dessert',
    name: 'Bitter Chocolate Tart',
    blurb: 'Seventy-percent ganache, olive oil, sea salt and crème fraîche.',
    price: 12.5,
    rating: 4.8,
    reviews: 187,
    minutes: 12,
    palette: 'char',
  },
  {
    id: 'fig-cheesecake',
    categoryId: 'dessert',
    name: 'Fig Leaf Cheesecake',
    blurb: 'Baked slow, infused with fig leaf, served with roasted autumn figs.',
    price: 13.8,
    rating: 4.7,
    reviews: 142,
    minutes: 12,
    palette: 'berry',
  },
  {
    id: 'short-rib',
    categoryId: 'grill',
    name: 'Red Wine Short Rib',
    blurb: 'Six hours in Barolo, pressed overnight, glazed to order with smoked mash.',
    price: 38.5,
    rating: 4.9,
    reviews: 226,
    minutes: 26,
    palette: 'berry',
  },
  {
    id: 'citrus-salad',
    categoryId: 'garden',
    name: 'Winter Citrus & Chicory',
    blurb: 'Blood orange, pink grapefruit, bitter leaves, pistachio and honey vinegar.',
    price: 14.2,
    rating: 4.5,
    reviews: 96,
    minutes: 10,
    palette: 'saffron',
  },
];

export const TAVOLA_STEPS: TavolaStep[] = [
  {
    id: 'quality',
    title: 'Quality Food',
    body: 'One menu, cooked to order. Nothing is held under a lamp and nothing is finished in advance.',
  },
  {
    id: 'fresh',
    title: 'Fresh Produce',
    body: 'Market boxes land at 6am. What is not good enough that morning comes off the menu.',
  },
  {
    id: 'delivery',
    title: 'Fastest Delivery',
    body: 'Insulated boxes, a two-mile radius and a rider on the road within eight minutes.',
  },
  {
    id: 'order',
    title: 'Easy to Order',
    body: 'Four taps from menu to doorstep, with your last order saved for next time.',
  },
];

/** Icons live apart from the localised copy, so a translation cannot break one. */
export const TAVOLA_STEP_ICONS = {
  quality: BadgeCheck,
  fresh: Leaf,
  delivery: Truck,
  order: MonitorSmartphone,
} as const;

export const TAVOLA_POSTS: TavolaPost[] = [
  {
    id: 'ember',
    title: 'What cooking over embers actually changes',
    excerpt:
      'Live fire is not a garnish. It changes how a protein holds moisture, and it is why the chicken rests eleven minutes before it reaches you.',
    date: '16 Sep 2026',
    readMinutes: 10,
    author: 'Marco Belli',
    palette: 'char',
  },
  {
    id: 'market',
    title: 'A morning on the market run',
    excerpt:
      'Six suppliers, one van and a decision to make about every crate. The menu you read at dinner was settled before eight.',
    date: '16 Sep 2026',
    readMinutes: 10,
    author: 'Ana Ruiz',
    palette: 'herb',
  },
  {
    id: 'pasta',
    title: 'Why our pasta is rolled twice a day',
    excerpt:
      'Fresh sheets stiffen within hours. Rolling at ten and again at four is the difference between silk and cardboard.',
    date: '16 Sep 2026',
    readMinutes: 10,
    author: 'Marco Belli',
    palette: 'saffron',
  },
];

export const TAVOLA_REVIEWS: TavolaReview[] = [
  {
    id: 'r1',
    quote:
      'We ordered for eight and everything arrived hot, sealed and labelled. The rigatoni was better than most places manage on the plate, let alone in a box.',
    name: 'Priya Raman',
    role: 'Ordered twice this month',
    rating: 4.5,
    date: '20 Dec 2026',
  },
  {
    id: 'r2',
    quote:
      'Booked a table for a birthday. They read the note about the nut allergy and the kitchen sent out a separate dessert without being asked twice.',
    name: 'Daniel Okafor',
    role: 'Table for six',
    rating: 5,
    date: '26 Dec 2026',
  },
  {
    id: 'r3',
    quote:
      'The short rib is the reason I stopped cooking on Fridays. Delivery said thirty minutes and it was twenty-two, which never happens.',
    name: 'Mei Tanaka',
    role: 'Regular since 2024',
    rating: 4.5,
    date: '30 Dec 2026',
  },
];

/* ---------------------------------------------------------------- copy (en) */

export const TAVOLA_COPY: TavolaCopy = {
  common: {
    mainNav: 'Main navigation',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    cart: 'Basket',
    cartCount: 'items in basket',
    signIn: 'Login',
    signUp: 'Sign up',
    order: 'Order now',
    currencyLabel: 'Currency',
    languageLabel: 'Language',
    addToCart: 'Add to Cart',
    added: 'Added',
    from: 'from',
    minutes: 'min',
    reviews: 'reviews',
    readMore: 'Read More',
    viewAll: 'View full menu',
    previous: 'Previous',
    next: 'Next',
  },
  home: {
    heroBadge: 'Kitchen open · 11:00 – 23:00',
    heroDiscount: '15% Discount for 2 orders',
    heroDelivery: 'Delivery 20 Min',
    heroReviews: '2,400+ reviews',
    dishesEyebrow: 'On the pass',
    dishesTitle: 'Our Popular Dishes',
    stepsEyebrow: 'The short version',
    stepsTitle: 'How does it Work',
    stepsSubtitle: 'Four things we refuse to compromise on, from the market run to your door.',
    simpleEyebrow: 'Why Tavola',
    simpleTitle: 'Simple Way of Eating Delicious',
    simpleBody:
      'One kitchen, one menu and a room built around it. Order to the table, to the counter or to your door - the food leaves the pass the same way either way.',
    simplePoints: ['Online Order', 'Pre Booking', 'Menu Variety', '24/4 Service'],
    blogEyebrow: 'From the kitchen',
    blogTitle: 'Latest Blog',
    reviewsEyebrow: 'In their words',
    reviewsTitle: 'Customers Reaction',
  },
  menu: {
    title: 'The Menu',
    subtitle:
      'Everything is cooked to order. Prices convert live - pick your currency in the header.',
    all: 'Everything',
    empty: 'Nothing on the menu matches that filter yet.',
    count: '{count} dishes',
  },
  services: {
    title: 'How we serve you',
    subtitle:
      'The same kitchen, four ways to reach it. Every route is staffed by the people who cooked the food.',
  },
  blog: {
    title: 'From the kitchen',
    subtitle: 'Notes on produce, fire and the small decisions that reach your plate.',
    readTime: 'min read',
    by: 'by',
  },
  contact: {
    title: 'Book a table',
    subtitle: 'Tell us when and how many. We answer every request within the hour, in service.',
    name: 'Your name',
    email: 'Email',
    guests: 'Guests',
    date: 'Preferred date',
    notes: 'Anything we should know',
    submit: 'Request a table',
    sent: 'Thank you - we will confirm by email shortly.',
    hours: 'Hours',
    hoursValue: ['Mon – Thu · 11:00 – 22:00', 'Fri – Sat · 11:00 – 23:30', 'Sunday · 12:00 – 21:00'],
    address: 'Find us',
    addressValue: '18 Prospect Row, London E2 8AA',
    phone: 'Call the pass',
    phoneValue: '+44 20 7946 0812',
  },
  cart: {
    title: 'Your basket',
    empty: 'Your basket is empty.',
    emptyCta: 'Browse the menu',
    item: 'Item',
    quantity: 'Quantity',
    remove: 'Remove',
    subtotal: 'Subtotal',
    delivery: 'Delivery',
    deliveryFree: 'Free over 40',
    total: 'Total',
    checkout: 'Go to checkout',
    note: 'Prices convert at a fixed illustrative rate. Swap in your own rates before launch.',
  },
};

/* ------------------------------------------------------ template content (en) */

export const TAVOLA_CONTENT: TemplateContent = {
  brand: 'Tavola',
  nav: [
    { href: tavolaHref('home'), label: 'Home' },
    { href: tavolaHref('menu'), label: 'Menu' },
    { href: tavolaHref('services'), label: 'Services' },
    { href: tavolaHref('blog'), label: 'Blog' },
    { href: tavolaHref('contact'), label: 'Contact' },
  ],
  hero: {
    badge: 'Kitchen open · 11:00 – 23:00',
    // Trailing space is deliberate - see the hero in `tavola-home-page`.
    title: 'From Our Kitchen to ',
    titleAccent: 'Your Table',
    subtitle:
      'Located in the heart of the city, our kitchen cooks one menu to order - for the room, the counter and your door.',
    ctaPrimary: 'Explore Food',
    ctaSecondary: 'Book a table',
    stats: [
      { value: 20, suffix: ' min', label: 'Average delivery' },
      { value: 2400, suffix: '+', label: 'Reviews' },
      { value: 12, suffix: '', label: 'Dishes on the pass' },
    ],
  },
  marquee: [
    'Cooked to order',
    'Market produce daily',
    'Live fire grill',
    'Twenty-minute delivery',
    'Pasta rolled twice a day',
  ],
  about: {
    eyebrow: 'Why Tavola',
    title: 'Simple Way of Eating Delicious',
    body: [
      'One kitchen, one menu and a room built around it. Nothing is finished in advance and nothing waits under a lamp.',
      'Order to the table, to the counter or to your door - the food leaves the pass the same way either way.',
    ],
    points: ['Online Order', 'Pre Booking', 'Menu Variety', '24/4 Service'],
  },
  services: {
    eyebrow: 'The short version',
    title: 'How does it Work',
    subtitle: 'Four things we refuse to compromise on, from the market run to your door.',
    items: [
      {
        icon: BadgeCheck,
        title: 'Quality Food',
        body: 'One menu, cooked to order. Nothing is held under a lamp and nothing is finished in advance.',
      },
      {
        icon: Leaf,
        title: 'Fresh Produce',
        body: 'Market boxes land at 6am. What is not good enough that morning comes off the menu.',
      },
      {
        icon: Truck,
        title: 'Fastest Delivery',
        body: 'Insulated boxes, a two-mile radius and a rider on the road within eight minutes.',
      },
      {
        icon: MonitorSmartphone,
        title: 'Easy to Order',
        body: 'Four taps from menu to doorstep, with your last order saved for next time.',
      },
    ],
  },
  why: {
    eyebrow: 'On the pass',
    title: 'Our Popular Dishes',
    subtitle: 'What the kitchen sends out most, and what it is known for.',
    items: [
      {
        icon: BadgeCheck,
        title: 'San Marzano Rigatoni',
        body: 'Slow-cooked tomato, torn basil, aged pecorino and a spoon of chilli butter.',
      },
      {
        icon: Leaf,
        title: 'Harvest Grain Bowl',
        body: 'Charred broccolini, farro, soft egg and a lemon-tahini dressing finished with dukkah.',
      },
      {
        icon: Truck,
        title: 'Coal-Roast Chicken',
        body: 'Brined overnight, roasted over embers, served with burnt lemon and green sauce.',
      },
    ],
  },
  faq: {
    eyebrow: 'Before you order',
    title: 'Questions we get asked',
    items: [
      {
        question: 'How far do you deliver?',
        answer:
          'Two miles from the kitchen, which keeps the food under twenty minutes in the box. Beyond that we would rather you came to us.',
      },
      {
        question: 'Can you cook around allergies?',
        answer:
          'Yes, and we would rather know at the point of order than at the table. Every dish is cooked to order, so substitutions are usually straightforward.',
      },
      {
        question: 'Do you take walk-ins?',
        answer:
          'The counter is kept for walk-ins every service. Tables are worth booking, especially Thursday to Saturday.',
      },
      {
        question: 'Which currencies can I pay in?',
        answer:
          'Prices display in four currencies so you can quote a figure to anyone. Payment settles in the local currency at checkout.',
      },
    ],
  },
  contact: {
    eyebrow: 'Book a table',
    title: 'Tell us when and how many',
    subtitle: 'We answer every request within the hour, in service.',
    fields: { name: 'Your name', email: 'Email', message: 'Anything we should know' },
    submit: 'Request a table',
    details: [
      { label: 'Find us', value: '18 Prospect Row, London E2 8AA' },
      { label: 'Call the pass', value: '+44 20 7946 0812' },
      { label: 'Email', value: 'pass@tavola.restaurant' },
    ],
  },
  footer: {
    tagline: 'One kitchen, cooked to order, from our kitchen to your table.',
    columns: [
      { title: 'Product', links: ['Home', 'Menu', 'Services', 'Blog', 'Contact Us'] },
      { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Licenses', 'Allergens'] },
      { title: 'About', links: ['Company', 'Community', 'Blog', 'Careers', 'Suppliers'] },
    ],
    legal: 'Tavola Kitchen. All rights reserved.',
  },
};

/* ------------------------------------------------------------------- prompt */

export const TAVOLA_PROMPT = `Design a premium multipage restaurant website called Tavola - a modern kitchen-to-table restaurant that both seats guests and delivers.

Pages: Home, Menu, Services, Blog, Contact, Cart. Navigation is by query string (?page=), no router.

Home: a hero reading "From Our Kitchen to Your Table" with the last two words in the accent colour, a plated dish rendered in CSS with two floating cards (a discount pill and a delivery-time pill), then Our Popular Dishes as a horizontal rail of dish cards with rating, price and Add to Cart; How does it Work as four icon cards; a Simple Way of Eating Delicious split with a checklist; Latest Blog as three cards; Customers Reaction as three review cards.

Palette: white paper, a warm coral accent (#f2564b), a deep navy footer, soft blush wash behind the hero. Type: a warm humanist sans, generous line height, large tracking-tight headings.

The site is bilingual (English and Japanese) and multi-currency (USD, EUR, GBP, JPY). Every string is localised, including dish names and blog posts. Prices are stored once as plain numbers in USD and converted at render, so switching currency updates every figure at once.

Voice: confident, specific, no marketing adjectives. Name real produce and real times. No exclamation marks.`;
