import {
  Hammer,
  LifeBuoy,
  PackageCheck,
  Recycle,
  Ruler,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * LUMEN - content for the multipage lighting & homeware store.
 *
 * Two layers live here and the split is deliberate:
 *
 * 1. `LUMEN_CONTENT` satisfies the shared `TemplateContent` contract, which is
 *    what every template in the gallery has and what the marketing sections
 *    (hero, about, services, why, faq, contact, footer) read from.
 * 2. Everything below it - products, cart lines, and the account/checkout copy -
 *    is LUMEN's own, because no other template is a shop. It is typed locally
 *    rather than pushed into `types.ts`: the shared interface describes what
 *    every template needs, not what one template happens to want (Rule 2).
 *
 * As with NOVA and SAFFRON the copy is English and untranslated - it is part of
 * the artifact the visitor downloads and rewrites. Sections hold no strings.
 */

/* ------------------------------------------------------------------ pages */

/**
 * The store's pages, in the order the header presents them.
 *
 * A template has no router: the preview route renders one component, so pages
 * are selected with a `?page=<id>` query string and every internal link is a
 * plain anchor. Keeping the ids in one `as const` list means the union type,
 * the link builder and the page switch can never drift apart.
 */
export const LUMEN_PAGES = [
  'home',
  'shop',
  'product',
  'cart',
  'checkout',
  'login',
  'signup',
] as const;

export type LumenPageId = (typeof LUMEN_PAGES)[number];

/** Narrow an arbitrary query value to a page the template can actually render. */
export function toLumenPage(value: string | undefined): LumenPageId {
  return LUMEN_PAGES.includes(value as LumenPageId) ? (value as LumenPageId) : 'home';
}

/** The href for a page. One helper so no component hand-writes a query string. */
export function lumenHref(page: LumenPageId): string {
  return `?page=${page}`;
}

/* --------------------------------------------------------------- products */

/**
 * Which CSS composition draws a product.
 *
 * The template ships with no images, so each product names a shape that
 * `lumen.css` builds from gradients and clip-paths. Keeping the key in the data
 * (rather than branching in a component) means adding a product is a data edit.
 */
export type LumenArt = 'pendant' | 'globe' | 'column' | 'sconce' | 'vase' | 'throw' | 'table' | 'diffuser';

/** A finish. `id` also names the `.lum-swatch--<id>` colour class in lumen.css. */
export interface LumenSwatch {
  id: string;
  label: string;
}

/** One row of the product page's specification accordion. */
export interface LumenSpecGroup {
  title: string;
  body: string;
}

export interface LumenProduct {
  id: string;
  name: string;
  /** Whole pounds and pence, formatted by `formatLumenPrice` at the edge. */
  price: number;
  category: string;
  art: LumenArt;
  swatches: LumenSwatch[];
  blurb: string;
  dimensions: string;
  material: string;
  delivery: string;
  specs: LumenSpecGroup[];
  /** Shown in the home page's featured grid as well as the shop index. */
  featured: boolean;
}

export const LUMEN_CURRENCY = '£';

/**
 * Formats a price for display.
 *
 * Deliberately not `Intl.NumberFormat`: the template renders on the server and
 * again on the client, and a locale-sensitive formatter is the classic source of
 * a hydration mismatch. A fixed symbol and two decimals render identically
 * everywhere, and re-pointing this one function is the edit a shop would make.
 */
export function formatLumenPrice(amount: number): string {
  return `${LUMEN_CURRENCY}${amount.toFixed(2)}`;
}

export const LUMEN_PRODUCTS: LumenProduct[] = [
  {
    id: 'halo-pendant',
    name: 'Halo Pendant',
    price: 245,
    category: 'Ceiling',
    art: 'pendant',
    blurb:
      'A spun brass shade over a mouth-blown opal diffuser, so the bulb never shows and the table below stays evenly lit.',
    dimensions: '320mm diameter, 210mm high, 2m braided flex',
    material: 'Spun brass, opal glass, waxed cotton flex',
    delivery: 'Dispatched within 48 hours',
    swatches: [
      { id: 'brass', label: 'Brushed brass' },
      { id: 'charcoal', label: 'Charcoal' },
      { id: 'alabaster', label: 'Alabaster' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '320mm diameter, 210mm high. Supplied with 2m of braided flex and a 120mm ceiling rose; the flex can be shortened at installation without tools.',
      },
      {
        title: 'Materials and finish',
        body: 'Shade spun from 96% recycled brass, hand-brushed and lacquered. The diffuser is mouth-blown opal glass, so no two are identical along the seam.',
      },
      {
        title: 'Lamp and wiring',
        body: 'E27 fitting, rated to 12W LED. Fully dimmable with a trailing-edge dimmer. UK and EU wiring supplied; a 3-pin plug kit is available at checkout.',
      },
      {
        title: 'Care',
        body: 'Wipe the brass with a dry cloth. Avoid solvents, which lift the lacquer. The glass is dishwasher-safe once removed from the fitting.',
      },
    ],
    featured: true,
  },
  {
    id: 'vessel-table-lamp',
    name: 'Vessel Table Lamp',
    price: 180,
    category: 'Table',
    art: 'globe',
    blurb:
      'A stoneware base turned on a wheel in Stoke, topped with a linen shade that softens the light rather than hiding it.',
    dimensions: '240mm diameter, 420mm high',
    material: 'Glazed stoneware, Belgian linen',
    delivery: 'Dispatched within 48 hours',
    swatches: [
      { id: 'clay', label: 'Raw clay' },
      { id: 'sage', label: 'Sage' },
      { id: 'charcoal', label: 'Charcoal' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '240mm diameter at the widest point, 420mm to the top of the shade. Weighs 2.1kg, so it sits without a weighted plate.',
      },
      {
        title: 'Materials and finish',
        body: 'Wheel-thrown stoneware with a matte reactive glaze. Shade is Belgian linen over a steel frame, hand-rolled at the edge.',
      },
      {
        title: 'Lamp and wiring',
        body: 'E14 fitting, rated to 8W LED. Inline rocker switch on a 1.8m fabric cord.',
      },
      {
        title: 'Care',
        body: 'The glaze is food-safe and non-porous. Brush the linen shade with a soft clothes brush; do not wet it.',
      },
    ],
    featured: true,
  },
  {
    id: 'column-floor-lamp',
    name: 'Column Floor Lamp',
    price: 395,
    category: 'Floor',
    art: 'column',
    blurb:
      'A single extruded aluminium column that throws light up the wall, for corners where a shade would only get in the way.',
    dimensions: '160mm square base, 1580mm high',
    material: 'Powder-coated aluminium, cast iron base',
    delivery: 'Made to order, 3 to 4 weeks',
    swatches: [
      { id: 'charcoal', label: 'Charcoal' },
      { id: 'alabaster', label: 'Alabaster' },
      { id: 'brass', label: 'Brushed brass' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '160mm square cast base, 1580mm to the top of the column. The base weighs 4.6kg and holds the lamp upright on rugs and boards alike.',
      },
      {
        title: 'Materials and finish',
        body: 'Extruded aluminium with a fine-texture powder coat. The internal reflector is anodised to spread the beam across the ceiling.',
      },
      {
        title: 'Lamp and wiring',
        body: 'Integrated 14W LED module, 2700K, 90 CRI, rated for 40,000 hours. Foot-operated dimmer on a 2.5m cord.',
      },
      {
        title: 'Care',
        body: 'Dust with a dry microfibre cloth. The LED module is replaceable and stocked for ten years from purchase.',
      },
    ],
    featured: true,
  },
  {
    id: 'meridian-sconce',
    name: 'Meridian Wall Sconce',
    price: 150,
    category: 'Wall',
    art: 'sconce',
    blurb:
      'A half-disc that washes the wall behind it, sized for a hallway where a projecting arm would be caught by a shoulder.',
    dimensions: '180mm diameter, 70mm projection',
    material: 'Brushed brass, sandblasted glass',
    delivery: 'Dispatched within 48 hours',
    swatches: [
      { id: 'brass', label: 'Brushed brass' },
      { id: 'ink', label: 'Ink black' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '180mm diameter with a 70mm projection from the wall. The backplate covers a standard 65mm UK back box.',
      },
      {
        title: 'Materials and finish',
        body: 'Brushed brass face with a sandblasted glass insert. IP44 rated, so it is suitable for a bathroom outside zone 1.',
      },
      {
        title: 'Lamp and wiring',
        body: 'Integrated 6W LED, 2700K, dimmable. Rear entry for surface or flush wiring; a competent electrician should fit it.',
      },
      {
        title: 'Care',
        body: 'Wipe with a dry cloth. Do not use glass cleaner on the brass face.',
      },
    ],
    featured: true,
  },
  {
    id: 'terra-vase',
    name: 'Terra Stoneware Vase',
    price: 64,
    category: 'Homeware',
    art: 'vase',
    blurb:
      'A tall, narrow vessel for a single branch. Unglazed outside, sealed within, so it holds water without a liner.',
    dimensions: '120mm diameter, 340mm high',
    material: 'Unglazed stoneware, sealed interior',
    delivery: 'Dispatched within 48 hours',
    swatches: [
      { id: 'clay', label: 'Raw clay' },
      { id: 'sage', label: 'Sage' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '120mm at the widest point, 340mm high, with a 45mm opening. Holds roughly 1.4 litres.',
      },
      {
        title: 'Materials and finish',
        body: 'Wheel-thrown stoneware fired to 1260C. The outside is left raw and will darken slightly with handling.',
      },
      {
        title: 'Care',
        body: 'Rinse by hand. Not suitable for the dishwasher, which will dull the raw surface.',
      },
    ],
    featured: true,
  },
  {
    id: 'flint-throw',
    name: 'Flint Linen Throw',
    price: 120,
    category: 'Homeware',
    art: 'throw',
    blurb:
      'Stonewashed Belgian linen woven in Portugal, heavy enough to hang properly over the arm of a chair.',
    dimensions: '1300mm x 1900mm',
    material: '100% Belgian linen, 260gsm',
    delivery: 'Dispatched within 48 hours',
    swatches: [
      { id: 'linen', label: 'Natural linen' },
      { id: 'sage', label: 'Sage' },
      { id: 'ink', label: 'Ink black' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '1300mm by 1900mm with a 40mm hand-turned hem on all four sides.',
      },
      {
        title: 'Materials and finish',
        body: '260gsm Belgian flax, stonewashed twice so it arrives soft rather than needing a season of use.',
      },
      {
        title: 'Care',
        body: 'Machine wash at 30C with a mild detergent. Line dry. It will soften with every wash and should not be ironed.',
      },
    ],
    featured: true,
  },
  {
    id: 'ash-side-table',
    name: 'Ash Side Table',
    price: 310,
    category: 'Furniture',
    art: 'table',
    blurb:
      'A solid ash top on three tapered legs, cut to sit level with the arm of most sofas so a cup never has to travel.',
    dimensions: '420mm diameter, 520mm high',
    material: 'Solid oiled ash',
    delivery: 'Made to order, 3 to 4 weeks',
    swatches: [
      { id: 'oak', label: 'Natural ash' },
      { id: 'ink', label: 'Ink black' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '420mm diameter top, 520mm high, 28mm top thickness. Legs are set at 8 degrees for stability on soft flooring.',
      },
      {
        title: 'Materials and finish',
        body: 'Solid European ash from FSC-certified stock, finished with three coats of hardwax oil. Grain and colour vary between pieces.',
      },
      {
        title: 'Assembly',
        body: 'Legs arrive detached and thread into brass inserts by hand. No tools and no glue; allow five minutes.',
      },
      {
        title: 'Care',
        body: 'Wipe with a damp cloth. Re-oil once a year, or sooner if the surface begins to feel dry.',
      },
    ],
    featured: false,
  },
  {
    id: 'ember-diffuser',
    name: 'Ember Ceramic Diffuser',
    price: 58,
    category: 'Homeware',
    art: 'diffuser',
    blurb:
      'A small glazed bottle with reeds cut to length, scented with cedar, black pepper and a little smoke.',
    dimensions: '90mm diameter, 180mm high',
    material: 'Glazed ceramic, rattan reeds',
    delivery: 'Dispatched within 48 hours',
    swatches: [
      { id: 'clay', label: 'Raw clay' },
      { id: 'charcoal', label: 'Charcoal' },
    ],
    specs: [
      {
        title: 'Dimensions',
        body: '90mm diameter, 180mm to the neck. Holds 200ml, which lasts about four months in a normal room.',
      },
      {
        title: 'Scent',
        body: 'Cedarwood, black pepper and a trace of birch tar. Blended in Somerset without phthalates or synthetic musks.',
      },
      {
        title: 'Care',
        body: 'Turn the reeds once a week. Refills are sold separately and use the same bottle.',
      },
    ],
    featured: false,
  },
];

/** The product the `product` page details. Named so the page never indexes [0]. */
export const LUMEN_FEATURED_PRODUCT_ID = 'halo-pendant';

/* ------------------------------------------------------------------- cart */

/** A line in the demo basket. Quantities are React state, never persisted. */
export interface LumenCartLine {
  productId: string;
  swatchId: string;
  quantity: number;
}

/**
 * The basket the template opens with.
 *
 * A shop template with an empty cart shows nothing, so the demo starts with two
 * lines. Adding from the product page appends to this in local state; nothing is
 * written to storage or sent anywhere.
 */
export const LUMEN_CART: LumenCartLine[] = [
  { productId: 'halo-pendant', swatchId: 'brass', quantity: 2 },
  { productId: 'flint-throw', swatchId: 'linen', quantity: 1 },
];

/** Look a product up by id. Returns undefined for a line the catalogue lost. */
export function findLumenProduct(id: string): LumenProduct | undefined {
  return LUMEN_PRODUCTS.find((product) => product.id === id);
}

/* -------------------------------------------------------------- shop copy */

export interface LumenShopCommonCopy {
  cart: string;
  cartCount: string;
  signIn: string;
  account: string;
  addToCart: string;
  added: string;
  free: string;
  continueShopping: string;
  backToShop: string;
  demoNotice: string;
  contactSent: string;
  /**
   * Names for landmarks and controls that have no visible text. They are read
   * aloud, so they are content and belong here with everything else a visitor
   * would want to reword.
   */
  mainNav: string;
  breadcrumbNav: string;
  materialsStrip: string;
  openMenu: string;
  closeMenu: string;
}

export interface LumenShopIndexCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  countLabel: string;
  viewLabel: string;
}

export interface LumenProductPageCopy {
  breadcrumb: string;
  finishLabel: string;
  quantityLabel: string;
  decrease: string;
  increase: string;
  specsTitle: string;
  altViewLabel: string;
  relatedTitle: string;
  relatedSubtitle: string;
  detailLabels: { dimensions: string; material: string; delivery: string };
}

export interface LumenCartPageCopy {
  eyebrow: string;
  title: string;
  empty: string;
  remove: string;
  removed: string;
  summaryTitle: string;
  subtotal: string;
  shipping: string;
  shippingNote: string;
  total: string;
  checkout: string;
  lineTotalLabel: string;
}

export interface LumenCheckoutFieldCopy {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
}

export interface LumenCheckoutPageCopy {
  eyebrow: string;
  title: string;
  contactTitle: string;
  shippingTitle: string;
  paymentTitle: string;
  paymentNotice: string;
  contactFields: LumenCheckoutFieldCopy[];
  shippingFields: LumenCheckoutFieldCopy[];
  paymentFields: LumenCheckoutFieldCopy[];
  summaryTitle: string;
  place: string;
  confirmedTitle: string;
  confirmedBody: string;
  orderReference: string;
}

export interface LumenAccountPageCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  fields: LumenCheckoutFieldCopy[];
  submit: string;
  submitted: string;
  altPrompt: string;
  altAction: string;
  altHref: string;
  extraLabel: string;
  extraHref: string;
}

export interface LumenShopCopy {
  common: LumenShopCommonCopy;
  shop: LumenShopIndexCopy;
  product: LumenProductPageCopy;
  cart: LumenCartPageCopy;
  checkout: LumenCheckoutPageCopy;
  login: LumenAccountPageCopy;
  signup: LumenAccountPageCopy;
}

/**
 * Every string the shop pages render.
 *
 * The payment block is described here as well as rendered, so the fact that it
 * is inert is a property of the content rather than a comment in a component:
 * the fields are placeholders, they are disabled, and the notice that says so
 * ships alongside them and cannot be dropped by accident.
 */
export const LUMEN_SHOP: LumenShopCopy = {
  common: {
    cart: 'Basket',
    cartCount: 'items in basket',
    signIn: 'Sign in',
    account: 'Account',
    addToCart: 'Add to basket',
    added: 'Added to your basket',
    free: 'Free',
    continueShopping: 'Continue shopping',
    backToShop: 'Back to all products',
    demoNotice: 'Design template. Nothing here is ordered, charged or sent.',
    contactSent: 'Message received. We reply within one working day.',
    mainNav: 'Main',
    breadcrumbNav: 'Breadcrumb',
    materialsStrip: 'Materials',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  shop: {
    eyebrow: 'All products',
    title: 'Eight pieces, kept in stock',
    subtitle:
      'We hold a small range and make it well rather than carrying a catalogue. Lighting is wired for UK and EU supply; homeware ships flat from the same workshop.',
    countLabel: 'products',
    viewLabel: 'View details',
  },

  product: {
    breadcrumb: 'Shop',
    finishLabel: 'Finish',
    quantityLabel: 'Quantity',
    decrease: 'Decrease quantity',
    increase: 'Increase quantity',
    specsTitle: 'Specification',
    altViewLabel: 'alternate view',
    relatedTitle: 'Pairs well with',
    relatedSubtitle: 'Chosen because the finishes and the light temperature match, not because they sell.',
    detailLabels: {
      dimensions: 'Dimensions',
      material: 'Materials',
      delivery: 'Delivery',
    },
  },

  cart: {
    eyebrow: 'Basket',
    title: 'Your basket',
    empty: 'Your basket is empty. The shop index has the full range.',
    remove: 'Remove',
    removed: 'Item removed from your basket',
    summaryTitle: 'Order summary',
    subtotal: 'Subtotal',
    shipping: 'Shipping',
    shippingNote: 'Free UK delivery on orders over £150. Made-to-order pieces ship separately.',
    total: 'Total',
    checkout: 'Proceed to checkout',
    lineTotalLabel: 'Line total',
  },

  checkout: {
    eyebrow: 'Checkout',
    title: 'Where should it go',
    contactTitle: 'Contact',
    shippingTitle: 'Shipping address',
    paymentTitle: 'Payment (demo only)',
    paymentNotice:
      'This is a front-end design template. The payment fields below are disabled placeholders, no card details are collected, and no payment is processed.',
    contactFields: [
      {
        id: 'checkout-email',
        label: 'Email address',
        type: 'email',
        autoComplete: 'email',
        placeholder: 'you@example.com',
      },
      {
        id: 'checkout-phone',
        label: 'Phone (for the courier)',
        type: 'tel',
        autoComplete: 'tel',
        placeholder: '07700 900123',
      },
    ],
    shippingFields: [
      {
        id: 'checkout-name',
        label: 'Full name',
        type: 'text',
        autoComplete: 'name',
        placeholder: 'Alex Whitfield',
      },
      {
        id: 'checkout-line1',
        label: 'Address',
        type: 'text',
        autoComplete: 'address-line1',
        placeholder: '14 Corve Street',
      },
      {
        id: 'checkout-city',
        label: 'Town or city',
        type: 'text',
        autoComplete: 'address-level2',
        placeholder: 'Ludlow',
      },
      {
        id: 'checkout-postcode',
        label: 'Postcode',
        type: 'text',
        autoComplete: 'postal-code',
        placeholder: 'SY8 1DA',
      },
    ],
    /*
     * Placeholder-only, disabled, and never given a `cc-*` autocomplete token -
     * a browser must have no reason to offer a real card to this form.
     */
    paymentFields: [
      {
        id: 'demo-card-name',
        label: 'Name on card (demo field, disabled)',
        type: 'text',
        autoComplete: 'off',
        placeholder: 'Demo field — not collected',
      },
      {
        id: 'demo-card-number',
        label: 'Card number (demo field, disabled)',
        type: 'text',
        autoComplete: 'off',
        placeholder: 'Demo field — not collected',
      },
      {
        id: 'demo-card-expiry',
        label: 'Expiry (demo field, disabled)',
        type: 'text',
        autoComplete: 'off',
        placeholder: 'Demo field — not collected',
      },
    ],
    summaryTitle: 'Order summary',
    place: 'Place order',
    confirmedTitle: 'Order placed',
    confirmedBody:
      'This is a design template, so nothing was charged and nothing will arrive. In a live store this is where the confirmation and the tracking reference would sit.',
    orderReference: 'Reference LUM-0000-DEMO',
  },

  login: {
    eyebrow: 'Account',
    title: 'Sign in',
    subtitle:
      'Order history, saved addresses and the trade discount all live behind one account. We do not send marketing to it.',
    fields: [
      {
        id: 'login-email',
        label: 'Email address',
        type: 'email',
        autoComplete: 'email',
        placeholder: 'you@example.com',
      },
      {
        id: 'login-password',
        label: 'Password',
        type: 'password',
        autoComplete: 'current-password',
        placeholder: 'At least 10 characters',
      },
    ],
    submit: 'Sign in',
    submitted: 'Demo form — no account was signed in',
    altPrompt: 'No account yet',
    altAction: 'Create one',
    altHref: '?page=signup',
    extraLabel: 'Forgot your password',
    extraHref: '?page=login',
  },

  signup: {
    eyebrow: 'Account',
    title: 'Create an account',
    subtitle:
      'It takes a minute and saves you retyping an address every time. Trade customers can add a VAT number afterwards.',
    fields: [
      {
        id: 'signup-name',
        label: 'Full name',
        type: 'text',
        autoComplete: 'name',
        placeholder: 'Alex Whitfield',
      },
      {
        id: 'signup-email',
        label: 'Email address',
        type: 'email',
        autoComplete: 'email',
        placeholder: 'you@example.com',
      },
      {
        id: 'signup-password',
        label: 'Password',
        type: 'password',
        autoComplete: 'new-password',
        placeholder: 'At least 10 characters',
      },
    ],
    submit: 'Create account',
    submitted: 'Demo form — no account was created',
    altPrompt: 'Already have an account',
    altAction: 'Sign in',
    altHref: '?page=login',
    extraLabel: 'I accept the terms of sale and the privacy notice',
    extraHref: '?page=home',
  },
};

/* ---------------------------------------------------- shared page content */

export const LUMEN_CONTENT: TemplateContent = {
  brand: 'Lumen',

  nav: [
    { href: '?page=shop', label: 'Shop' },
    { href: '?page=home#about', label: 'Workshop' },
    { href: '?page=home#services', label: 'Services' },
    { href: '?page=home#faq', label: 'Support' },
  ],

  hero: {
    badge: 'The Halo collection, made to order in Ludlow',
    title: 'Light shaped for',
    titleAccent: 'the rooms you actually live in',
    subtitle:
      'Lumen makes a small range of lighting and homeware in one workshop in Shropshire. Spun brass, mouth-blown glass, oiled ash. Nothing arrives flat-packed in three boxes.',
    ctaPrimary: 'Shop the collection',
    ctaSecondary: 'Read the material notes',
    stats: [
      { value: 12, suffix: 'yr', label: 'Guarantee on every fitting' },
      { value: 48, suffix: 'h', label: 'UK dispatch on stock items' },
      { value: 96, suffix: '%', label: 'Recycled brass by weight' },
    ],
  },

  marquee: [
    'Brushed brass',
    'Mouth-blown opal glass',
    'Oiled European ash',
    'Belgian linen',
    'Wheel-thrown stoneware',
    'Powder-coated aluminium',
    'Waxed cotton flex',
    'Sandblasted glass',
  ],

  about: {
    eyebrow: 'The workshop',
    title: 'One building, eight people, no third-party factory',
    body: [
      'Lumen began in 2016 as a metal shop on Corve Street that spun brass shades for architects. The architects kept asking where they could buy the shades, and by 2019 there were enough answers to call it a shop.',
      'We still make everything within forty metres of the spinning lathe. That limits how much we can sell, which is the point: a range of eight pieces can be held in stock, repaired for a decade and finished by someone who signs the underside.',
    ],
    points: [
      'Every fitting is wired and tested by hand before it is boxed',
      'Spare parts stocked for ten years from the date of purchase',
      'Packaging is moulded paper pulp and paper tape, no polystyrene',
    ],
  },

  services: {
    eyebrow: 'What is included',
    title: 'The parts of buying a lamp that usually go wrong',
    subtitle:
      'Shipping, fitting and what happens two years later are all part of the product, so they are priced into it rather than sold back to you.',
    items: [
      {
        icon: Truck,
        title: 'Delivery that gives a time',
        body: 'Stock items leave within 48 hours on a tracked next-day service. You get a two-hour window the evening before, not a full day at home.',
      },
      {
        icon: Ruler,
        title: 'Fitting notes, drawn to scale',
        body: 'Every ceiling piece ships with a template showing drop heights over a table, an island and a stairwell, so the flex is cut once.',
      },
      {
        icon: Hammer,
        title: 'Repairs, not replacements',
        body: 'Send a damaged shade back and we re-spin or re-lacquer it. Out of warranty it is charged at cost plus return postage.',
      },
      {
        icon: PackageCheck,
        title: 'Thirty days to change your mind',
        body: 'Return anything unfitted within thirty days for a full refund, including the outward postage. Made-to-order pieces are the exception.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Lumen',
    title: 'Four decisions you will notice after the box is open',
    subtitle:
      'None of these make a product photograph better. All of them make the piece easier to live with once it is on the wall.',
    items: [
      {
        icon: Sparkles,
        title: 'No visible bulb, anywhere',
        body: 'Every fitting carries an opal or sandblasted diffuser, so a bare filament never sits in your eyeline from a sofa or a dining chair.',
      },
      {
        icon: ShieldCheck,
        title: 'A twelve-year guarantee',
        body: 'Wiring, switches and LED modules are covered for twelve years. We keep the drawings, so a fitting from 2019 can still be repaired.',
      },
      {
        icon: Recycle,
        title: 'Brass with a history',
        body: 'Our brass is 96% recycled by weight, sourced from a UK smelter, and the offcuts from spinning go straight back to it.',
      },
      {
        icon: LifeBuoy,
        title: 'Someone who has held it',
        body: 'Support is two people in the workshop. They can tell you the weight of a shade because they have carried it across the room.',
      },
    ],
  },

  faq: {
    eyebrow: 'Support',
    title: 'What people ask before they order',
    items: [
      {
        question: 'Will a pendant work with my ceiling height',
        answer:
          'Over a dining table, hang the shade 750mm to 900mm above the surface. The Halo Pendant ships with 2m of flex, which covers ceilings up to about 3.2m; longer drops are made to order at no extra cost.',
      },
      {
        question: 'Are the fittings dimmable',
        answer:
          'Yes, with a trailing-edge dimmer. Older leading-edge dimmers will make an LED buzz, so if you are unsure send us the model number and we will check it.',
      },
      {
        question: 'How long does a made-to-order piece take',
        answer:
          'Three to four weeks for the Column Floor Lamp and the Ash Side Table. You get a photograph of the finished piece before it is packed.',
      },
      {
        question: 'Do you ship outside the UK',
        answer:
          'We ship to the EU, Norway and Switzerland on a delivered-duty-paid service, so the price at checkout is the price at the door. Lighting is supplied with the correct plug for the destination.',
      },
      {
        question: 'Is there a trade discount',
        answer:
          'Architects, interior designers and hospitality buyers get 25% from the first order. Create an account, add your practice details, and the price updates within a working day.',
      },
    ],
  },

  contact: {
    eyebrow: 'Visit',
    title: 'The showroom is the workshop',
    subtitle:
      'You are welcome to come and see a fitting lit before you buy one. Saturdays are quiet and the lathe is off, which makes it easier to talk.',
    fields: {
      name: 'Full name',
      email: 'Email address',
      message: 'What are you trying to light',
    },
    submit: 'Send message',
    details: [
      { label: 'Email', value: 'workshop@lumen.example' },
      { label: 'Telephone', value: '+44 1584 555 0142' },
      { label: 'Address', value: '14 Corve Street, Ludlow SY8 1DA' },
      { label: 'Open', value: 'Thursday to Saturday, 10.00 to 17.00' },
    ],
  },

  footer: {
    tagline:
      'Lighting and homeware made in one workshop in Shropshire, held in stock and repaired for a decade.',
    columns: [
      { title: 'Shop', links: ['Ceiling', 'Table and floor', 'Wall', 'Homeware'] },
      { title: 'Company', links: ['The workshop', 'Materials', 'Trade programme', 'Stockists'] },
      { title: 'Help', links: ['Delivery', 'Returns', 'Repairs', 'Contact'] },
    ],
    legal: '© 2026 Lumen Works Ltd. Registered in England, 09384712.',
  },
};

/** The prompt a visitor copies to generate a store in this spirit. */
export const LUMEN_PROMPT = `Design a multipage ecommerce website for Lumen, a premium minimalist lighting and homeware shop that makes everything in one UK workshop.

Pages: home, shop index, product detail, basket, checkout, sign in, create account. Every page shares a header with a wordmark, four nav links, a sign-in link and a basket icon carrying an item count, and a footer with three link columns.

Art direction:
- Warm off-white paper (#fbfaf8) with a slightly deeper second surface for alternating bands, charcoal #1c1c1e text, and a single amber accent #e0a458 used only for eyebrows, prices, focus rings and one primary button.
- Refined system sans throughout, -0.02em tracking on headings, uppercase 11px eyebrows with 0.24em tracking.
- Editorial product grid: generous whitespace, hairline rules instead of card borders, very soft shadows under product visuals only.
- Product imagery is composed from CSS gradients and clip-paths - a spun shade, a stoneware vessel, a tall column - never photographs.

Pages in detail: home runs hero with three counters, a materials marquee, a featured product grid, workshop story, services, why-us, an accordion FAQ and a contact form. Product detail has a large composed visual, price, finish swatches, a quantity stepper, add to basket, a specification accordion and related products. Basket has line items with steppers and remove buttons beside a sticky order summary. Checkout has contact and shipping fields, a clearly inert demo payment block, a summary sidebar and a confirmation state. Sign in and create account are single narrow columns.

Motion: sections fade and rise 18px as they enter view, counters count up once, product visuals lift 4px on hover, and everything is static under prefers-reduced-motion.

Voice: plain, specific, British. Real dimensions, materials and delivery windows. No exclamation marks.`;
