import {
  Flower2,
  GraduationCap,
  HandHeart,
  Leaf,
  Scissors,
  Sparkles,
  Timer,
  Waves,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * LUMIERE - content for the multipage salon, spa and beauty shop.
 *
 * Same two-layer split as LUMEN, for the same reason:
 *
 * 1. `LUMIERE_CONTENT` satisfies the shared `TemplateContent` contract that every
 *    template in the gallery has, so the marketing sections (hero, about,
 *    services, why, faq, contact, footer) render from one known shape.
 * 2. Everything else on this page - treatment menus, stylists, the product
 *    catalogue, the booking form - is LUMIERE's own. It is typed locally rather
 *    than pushed into `types.ts`: the shared interface describes what every
 *    template needs, not what one template happens to want (Rule 2).
 *
 * The copy is English and untranslated. A template is an artifact the visitor
 * downloads and rewrites, so its words ship with it; the app chrome around it is
 * what gets translation keys. No section holds a string of its own.
 */

/* ------------------------------------------------------------------ pages */

/**
 * The salon's pages, in the order the header presents them.
 *
 * A template has no router: the preview route renders one component, so pages
 * are selected with a `?page=<id>` query string and every internal link is a
 * plain anchor. Keeping the ids in one `as const` list means the union type, the
 * link builder and the page switch cannot drift apart.
 */
export const LUMIERE_PAGES = [
  'home',
  'services',
  'shop',
  'product',
  'cart',
  'booking',
  'contact',
] as const;

export type LumierePageId = (typeof LUMIERE_PAGES)[number];

/** Narrow an arbitrary query value to a page the template can actually render. */
export function toLumierePage(value: string | undefined): LumierePageId {
  return LUMIERE_PAGES.includes(value as LumierePageId) ? (value as LumierePageId) : 'home';
}

/** The href for a page. One helper so no component hand-writes a query string. */
export function lumiereHref(page: LumierePageId): string {
  return `?page=${page}`;
}

/* ------------------------------------------------------------- treatments */

/**
 * One treatment on the menu.
 *
 * `duration` is minutes as a number rather than a formatted string so the menu
 * can total a course or sort by length later without re-parsing prose, and
 * `price` is pounds for the same reason. Both are formatted at the edge.
 */
export interface LumiereTreatment {
  id: string;
  name: string;
  /** Minutes in the chair, chair turnaround excluded. */
  duration: number;
  price: number;
  description: string;
  /** Shown as a small pill on the treatment card, e.g. "with a senior stylist". */
  note?: string;
}

/**
 * A group of treatments.
 *
 * `art` names the CSS composition that draws the category's arch panel, keeping
 * the choice of visual in the data rather than in a branch inside a component -
 * adding a category is then a data edit.
 */
export interface LumiereServiceCategory {
  id: string;
  name: string;
  tagline: string;
  art: LumiereArch;
  treatments: LumiereTreatment[];
}

/** Which arch composition `lumiere.css` paints behind a category panel. */
export type LumiereArch = 'petal' | 'wave' | 'halo' | 'bloom';

export const LUMIERE_SERVICE_CATEGORIES: LumiereServiceCategory[] = [
  {
    id: 'hair',
    name: 'Hair',
    tagline: 'Cut dry, finished by hand, and shaped so it falls the same way at home.',
    art: 'petal',
    treatments: [
      {
        id: 'signature-cut',
        name: 'Signature cut and finish',
        duration: 75,
        price: 96,
        description:
          'A consultation in daylight, a wash at the basin with a scalp massage, then a dry cut so the shape is judged on hair that behaves as yours does.',
        note: 'Senior stylist',
      },
      {
        id: 'restyle',
        name: 'Restyle consultation and cut',
        duration: 105,
        price: 148,
        description:
          'For a change of length or direction. Thirty minutes of talking and looking before a comb is picked up, with a written note of how to keep it.',
        note: 'Director',
      },
      {
        id: 'gloss-refresh',
        name: 'Gloss and tone refresh',
        duration: 45,
        price: 68,
        description:
          'An ammonia-free demi-permanent gloss that closes the cuticle, evens brass and adds shine without moving the depth of your colour.',
      },
      {
        id: 'balayage',
        name: 'Hand-painted balayage',
        duration: 180,
        price: 265,
        description:
          'Freehand lightening painted through the mid-lengths, softened at the root so the regrowth line stays invisible for four to five months.',
        note: 'Includes gloss',
      },
      {
        id: 'blow-dry',
        name: 'Blow-dry and set',
        duration: 45,
        price: 52,
        description:
          'Round brush or wrap set, finished with a light cream rather than lacquer so the hair still moves when you leave.',
      },
      {
        id: 'keratin',
        name: 'Smoothing treatment',
        duration: 150,
        price: 210,
        description:
          'A formaldehyde-free keratin service that cuts drying time by roughly half and lasts twelve to sixteen weeks on most hair types.',
      },
    ],
  },
  {
    id: 'skin',
    name: 'Skin',
    tagline: 'Facials built around a diagnosis, not a menu of add-ons.',
    art: 'halo',
    treatments: [
      {
        id: 'lumiere-facial',
        name: 'The Lumière facial',
        duration: 90,
        price: 165,
        description:
          'Double cleanse, enzyme resurfacing, lymphatic massage and a cold porcelain finish. The protocol is chosen after a magnified skin reading.',
        note: 'Most booked',
      },
      {
        id: 'express-glow',
        name: 'Express radiance facial',
        duration: 45,
        price: 88,
        description:
          'A lunchtime reset: cleanse, mandelic acid peel at 8%, hyaluronic mask and SPF. No redness, no downtime, no shine.',
      },
      {
        id: 'barrier-repair',
        name: 'Barrier repair treatment',
        duration: 75,
        price: 142,
        description:
          'For skin left sensitised by retinoids or acids. Ceramide and oat-lipid layering under cool LED, with a two-week home protocol written out.',
      },
      {
        id: 'microneedling',
        name: 'Micro-channel collagen therapy',
        duration: 80,
        price: 235,
        description:
          'Adjustable-depth micro-needling with a peptide serum, worked in a course of three at four-week intervals. A patch test is taken beforehand.',
        note: 'Patch test required',
      },
    ],
  },
  {
    id: 'body',
    name: 'Body',
    tagline: 'Rooms kept at 24 degrees, with the phones left at the desk.',
    art: 'wave',
    treatments: [
      {
        id: 'deep-tissue',
        name: 'Deep tissue massage',
        duration: 60,
        price: 105,
        description:
          'Slow, firm work through the shoulders, neck and lower back with a warmed arnica and camphor oil. Pressure is checked twice, then left alone.',
      },
      {
        id: 'aromatherapy',
        name: 'Aromatherapy full body',
        duration: 90,
        price: 148,
        description:
          'A blend chosen from six single oils at the start of the treatment, worked long and even from the feet upward. Hot towels close the session.',
      },
      {
        id: 'body-polish',
        name: 'Rose and salt body polish',
        duration: 50,
        price: 92,
        description:
          'Fine Camargue salt and rose oil exfoliation at the wet table, followed by a shea and neroli wrap while the scalp is worked.',
      },
      {
        id: 'pregnancy',
        name: 'Pregnancy massage',
        duration: 60,
        price: 112,
        description:
          'Side-lying on a bolstered bed with unscented sweet almond oil. Available from the second trimester with your midwife noted on the record.',
        note: 'From 14 weeks',
      },
    ],
  },
  {
    id: 'hands',
    name: 'Hands and feet',
    tagline: 'Filed by hand, painted thin, cured properly.',
    art: 'bloom',
    treatments: [
      {
        id: 'lumiere-manicure',
        name: 'Lumière manicure',
        duration: 55,
        price: 58,
        description:
          'Dry file, cuticle work with oil rather than clippers, a hand and forearm massage, and two thin coats with a wipeable top.',
      },
      {
        id: 'gel-overlay',
        name: 'Gel overlay and colour',
        duration: 70,
        price: 74,
        description:
          'A soakable gel worn on the natural nail, cured in a low-heat lamp. Removal is included free within four weeks of the appointment.',
      },
      {
        id: 'spa-pedicure',
        name: 'Spa pedicure',
        duration: 75,
        price: 82,
        description:
          'A warm soak with milk and rose, hard-skin work with a glass file, foot and calf massage, then colour or a buffed natural finish.',
      },
    ],
  },
];

/* --------------------------------------------------------------- stylists */

/** Someone on the floor. `initials` draws the CSS portrait, so there is no photo. */
export interface LumiereStylist {
  id: string;
  name: string;
  initials: string;
  role: string;
  /** What they are actually best at, in their own words on the booking form. */
  specialism: string;
  years: number;
  days: string;
}

export const LUMIERE_STYLISTS: LumiereStylist[] = [
  {
    id: 'camille',
    name: 'Camille Roux',
    initials: 'CR',
    role: 'Founder and creative director',
    specialism: 'Restyles, curtain fringes and grown-out colour corrections',
    years: 19,
    days: 'Tuesday to Friday',
  },
  {
    id: 'noor',
    name: 'Noor Haddad',
    initials: 'NH',
    role: 'Senior colourist',
    specialism: 'Hand-painted balayage and tonal work on dark hair',
    years: 12,
    days: 'Wednesday to Saturday',
  },
  {
    id: 'ines',
    name: 'Inès Marchetti',
    initials: 'IM',
    role: 'Lead facialist',
    specialism: 'Barrier repair, rosacea-prone skin and post-procedure care',
    years: 15,
    days: 'Tuesday, Thursday, Saturday',
  },
  {
    id: 'theo',
    name: 'Théo Lambert',
    initials: 'TL',
    role: 'Massage therapist',
    specialism: 'Deep tissue, jaw and shoulder tension, pregnancy massage',
    years: 9,
    days: 'Monday, Wednesday, Friday',
  },
  {
    id: 'anyone',
    name: 'First available',
    initials: 'FA',
    role: 'No preference',
    specialism: 'We will match you to the therapist with the right training',
    years: 0,
    days: 'Any opening day',
  },
];

/* --------------------------------------------------------------- products */

/**
 * Which CSS composition draws a product.
 *
 * The template ships with no images, so each product names a vessel that
 * `lumiere.css` builds from gradients and border-radius. As with the arch keys,
 * the choice lives in the data so a new product needs no component change.
 */
export type LumiereVessel = 'bottle' | 'jar' | 'dropper' | 'tube' | 'compact' | 'mist';

/**
 * A shade or size option. `id` also names the `.lumi-shade--<id>` class, which is
 * a conic-gradient swatch rather than a flat disc - the point being that a shade
 * is never one colour in the hand.
 */
export interface LumiereVariant {
  id: string;
  label: string;
}

export interface LumiereProduct {
  id: string;
  name: string;
  /** Pounds, formatted by `formatLumierePrice` at the edge. */
  price: number;
  /** Matches a `LumiereProductCategory.id`, which is what the shop filters on. */
  category: string;
  vessel: LumiereVessel;
  size: string;
  blurb: string;
  /** The two or three actives someone would actually check the label for. */
  ingredients: string;
  usage: string;
  variants: LumiereVariant[];
  featured: boolean;
}

export interface LumiereProductCategory {
  id: string;
  name: string;
  description: string;
}

export const LUMIERE_PRODUCT_CATEGORIES: LumiereProductCategory[] = [
  {
    id: 'hair',
    name: 'Hair',
    description: 'What we use at the basin, in the same size we buy it in.',
  },
  {
    id: 'skin',
    name: 'Skin',
    description: 'Short formulas with the active listed at a percentage on the front.',
  },
  {
    id: 'body',
    name: 'Body',
    description: 'Oils and balms blended for us in Grasse, bottled in Kent.',
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    description: 'The scent of the treatment rooms, and two others it sits beside.',
  },
];

export const LUMIERE_CURRENCY = '£';

/**
 * Formats a price for display.
 *
 * Deliberately not `Intl.NumberFormat`: the template renders on the server and
 * again on the client, and a locale-sensitive formatter is the classic source of
 * a hydration mismatch. A fixed symbol and two decimals render identically
 * everywhere, and re-pointing this one function is the edit a salon would make.
 */
export function formatLumierePrice(amount: number): string {
  return `${LUMIERE_CURRENCY}${amount.toFixed(2)}`;
}

/** Minutes to something a person reads. Kept beside the data it formats. */
export function formatLumiereDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} hr`;
  return `${hours} hr ${rest} min`;
}

export const LUMIERE_PRODUCTS: LumiereProduct[] = [
  {
    id: 'lait-cleansing-milk',
    name: 'Lait Douceur Cleansing Milk',
    price: 42,
    category: 'skin',
    vessel: 'bottle',
    size: '200ml',
    blurb:
      'The first cleanse used in every facial here. It lifts sunscreen and pigment without stripping, and rinses clean rather than leaving a film.',
    ingredients: 'Sweet almond oil, oat kernel extract, glycerin 6%, no fragrance',
    usage:
      'Massage two pumps into dry skin for a minute, add water to emulsify, then rinse with a soft cloth. Morning and evening.',
    variants: [
      { id: 'rose', label: 'Unscented' },
      { id: 'neroli', label: 'Neroli' },
    ],
    featured: true,
  },
  {
    id: 'serum-lumiere',
    name: 'Sérum Lumière 12%',
    price: 78,
    category: 'skin',
    vessel: 'dropper',
    size: '30ml',
    blurb:
      'A stabilised vitamin C serum in an airless amber dropper, at the highest strength we have found people can wear daily without flushing.',
    ingredients: 'Ethyl ascorbic acid 12%, ferulic acid 0.5%, vitamin E, squalane',
    usage:
      'Four drops on clean dry skin each morning, before moisturiser and always under SPF. Keep the bottle out of direct light.',
    variants: [
      { id: 'amber', label: '30ml' },
      { id: 'champagne', label: '50ml refill' },
    ],
    featured: true,
  },
  {
    id: 'baume-nuit',
    name: 'Baume Nuit Barrier Balm',
    price: 56,
    category: 'skin',
    vessel: 'jar',
    size: '50ml',
    blurb:
      'A thick occlusive balm for the night after a peel, or for the fortnight in February when everything stings.',
    ingredients: 'Ceramide NP, cholesterol, shea butter 18%, panthenol 5%',
    usage:
      'A pea-sized amount pressed over serum as the last step at night. Use nightly for two weeks, then as needed.',
    variants: [
      { id: 'rose', label: '50ml jar' },
      { id: 'mauve', label: '15ml travel' },
    ],
    featured: false,
  },
  {
    id: 'huile-cheveux',
    name: 'Huile de Finition Hair Oil',
    price: 38,
    category: 'hair',
    vessel: 'dropper',
    size: '50ml',
    blurb:
      'What the stylists reach for at the end of a blow-dry. Light enough for a fine fringe, and it does not go greasy by the afternoon.',
    ingredients: 'Camellia oil, marula oil, vitamin E, silicone-free',
    usage:
      'Two drops warmed between the palms and drawn through the ends of dry hair. Add a third drop only if the ends still lift.',
    variants: [
      { id: 'champagne', label: 'Original' },
      { id: 'amber', label: 'Rich, for coarse hair' },
    ],
    featured: true,
  },
  {
    id: 'masque-restaurateur',
    name: 'Masque Restaurateur',
    price: 46,
    category: 'hair',
    vessel: 'jar',
    size: '250ml',
    blurb:
      'A weekly bond-building mask for hair that has been lightened. It reads rich in the jar and rinses out without weighing the roots down.',
    ingredients: 'Hydrolysed keratin, maleic acid, murumuru butter, cationic conditioners',
    usage:
      'On towel-dried hair, mid-lengths to ends, left five minutes and rinsed cool. Once a week, twice after a lightening service.',
    variants: [
      { id: 'rose', label: '250ml' },
      { id: 'mauve', label: '500ml salon size' },
    ],
    featured: true,
  },
  {
    id: 'shampooing-clair',
    name: 'Shampooing Clair',
    price: 32,
    category: 'hair',
    vessel: 'bottle',
    size: '300ml',
    blurb:
      'A low-lather sulphate-free shampoo that keeps gloss and toner in for longer. It takes two pumps, not four.',
    ingredients: 'Coco-glucoside, glycerin, rice protein, pH 5.0',
    usage:
      'Two pumps emulsified in wet hands, worked at the scalp only, rinsed for a full minute. Follow with the mask or a conditioner.',
    variants: [
      { id: 'champagne', label: '300ml' },
      { id: 'mauve', label: '1L refill' },
    ],
    featured: false,
  },
  {
    id: 'huile-corps',
    name: 'Huile de Corps Rose et Néroli',
    price: 64,
    category: 'body',
    vessel: 'bottle',
    size: '150ml',
    blurb:
      'The oil used in the polish treatment, bottled with a proper glass pipette so it does not run down the outside of the bottle.',
    ingredients: 'Sweet almond oil, rosehip seed oil, neroli absolute, damask rose',
    usage:
      'Warm four pumps in the hands and press into damp skin straight out of the bath, working from the ankles upward.',
    variants: [
      { id: 'rose', label: 'Rose and neroli' },
      { id: 'amber', label: 'Amber and cedar' },
    ],
    featured: true,
  },
  {
    id: 'creme-mains',
    name: 'Crème Mains Riche',
    price: 26,
    category: 'body',
    vessel: 'tube',
    size: '75ml',
    blurb:
      'Left on the basin in every treatment room. It sinks in fast enough that you can pick up a phone straight afterwards.',
    ingredients: 'Shea butter 12%, urea 5%, glycerin, allantoin',
    usage:
      'A short ribbon worked over the backs of the hands and the cuticles, after washing and before bed.',
    variants: [
      { id: 'neroli', label: 'Neroli' },
      { id: 'rose', label: 'Unscented' },
    ],
    featured: false,
  },
  {
    id: 'eau-de-parfum',
    name: 'Eau de Parfum Onze',
    price: 118,
    category: 'fragrance',
    vessel: 'mist',
    size: '50ml',
    blurb:
      'The scent of the ground floor at eleven in the morning: white flowers over a warm resin, without the sweetness that usually comes with them.',
    ingredients: 'Neroli, orange flower absolute, iris root, benzoin, cedar',
    usage:
      'Two sprays at the collarbone rather than the wrist, where the warmth is steadier and the drydown lasts about six hours.',
    variants: [
      { id: 'neroli', label: '50ml' },
      { id: 'champagne', label: '10ml purse spray' },
    ],
    featured: true,
  },
  {
    id: 'brume-oreiller',
    name: 'Brume d’Oreiller',
    price: 34,
    category: 'fragrance',
    vessel: 'mist',
    size: '100ml',
    blurb:
      'A linen and pillow mist of lavender cut with vetiver, so it reads calm rather than medicinal.',
    ingredients: 'Lavandin oil, vetiver, chamomile extract, alcohol-free base',
    usage:
      'Three sprays over the pillow and the turned-back sheet twenty minutes before bed, so the alcohol-free base has dried.',
    variants: [
      { id: 'mauve', label: 'Lavender and vetiver' },
      { id: 'amber', label: 'Fig leaf' },
    ],
    featured: false,
  },
  {
    id: 'poudre-teint',
    name: 'Poudre Teint Voile',
    price: 48,
    category: 'skin',
    vessel: 'compact',
    size: '9g',
    blurb:
      'A finely milled finishing powder in four depths, used to set a facial before a client goes back out to a meeting.',
    ingredients: 'Rice starch, silica, mica, no talc and no fragrance',
    usage:
      'Pressed, not swept, over the centre of the face with the flat of a brush. Build it in two passes rather than one heavy one.',
    variants: [
      { id: 'champagne', label: 'Voile 01, fair' },
      { id: 'rose', label: 'Voile 02, light' },
      { id: 'amber', label: 'Voile 03, medium' },
      { id: 'mauve', label: 'Voile 04, deep' },
    ],
    featured: false,
  },
  {
    id: 'gommage-corps',
    name: 'Gommage Sel de Camargue',
    price: 52,
    category: 'body',
    vessel: 'jar',
    size: '300g',
    blurb:
      'The salt scrub from the body polish, ground fine enough to use on the chest and the backs of the arms.',
    ingredients: 'Camargue sea salt, rose oil, jojoba esters, magnesium',
    usage:
      'On damp skin in the shower, worked in circles from the feet up, then rinsed without soap. Twice a week at most.',
    variants: [
      { id: 'rose', label: '300g' },
      { id: 'mauve', label: '600g' },
    ],
    featured: false,
  },
];

/** The product the `product` page details. Named so the page never indexes [0]. */
export const LUMIERE_FEATURED_PRODUCT_ID = 'serum-lumiere';

/** Look a product up by id. Returns undefined for a line the catalogue lost. */
export function findLumiereProduct(id: string): LumiereProduct | undefined {
  return LUMIERE_PRODUCTS.find((product) => product.id === id);
}

/* ------------------------------------------------------------------- cart */

/** A line in the demo basket. Quantities are React state, never persisted. */
export interface LumiereCartLine {
  productId: string;
  variantId: string;
  quantity: number;
}

/**
 * The basket the template opens with.
 *
 * A shop with an empty basket shows nothing, so the demo starts with two lines.
 * Adding from the product page appends to this in local state; nothing is written
 * to storage and nothing is sent anywhere.
 */
export const LUMIERE_CART: LumiereCartLine[] = [
  { productId: 'serum-lumiere', variantId: 'amber', quantity: 1 },
  { productId: 'huile-cheveux', variantId: 'champagne', quantity: 2 },
];

/* -------------------------------------------------------------- salon copy */

/** Strings every page shares: the header, the footer and the basket affordance. */
export interface LumiereCommonCopy {
  cart: string;
  cartCount: string;
  book: string;
  addToCart: string;
  added: string;
  free: string;
  from: string;
  duration: string;
  price: string;
  backToShop: string;
  demoNotice: string;
  /** Names the header's currency and language pickers, which show only a value. */
  currencyLabel: string;
  languageLabel: string;
  /**
   * Names for landmarks and controls with no visible text. They are read aloud,
   * so they are content and belong here with everything else a salon would want
   * to reword.
   */
  mainNav: string;
  breadcrumbNav: string;
  marqueeLabel: string;
  openMenu: string;
  closeMenu: string;
}

/** The heading block that opens a page below the header. */
export interface LumiereMastheadCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
}

export interface LumiereServicesPageCopy {
  masthead: LumiereMastheadCopy;
  menuLabel: string;
  bookTreatment: string;
  noteLabel: string;
  courseTitle: string;
  courseBody: string;
  courseCta: string;
}

export interface LumiereShopPageCopy {
  masthead: LumiereMastheadCopy;
  filterLabel: string;
  allLabel: string;
  countOne: string;
  countMany: string;
  /** The home page's link into the shop. Distinct from the filter chip's label. */
  viewAll: string;
}

export interface LumiereProductPageCopy {
  breadcrumb: string;
  shopLabel: string;
  variantLabel: string;
  quantityLabel: string;
  decrease: string;
  increase: string;
  detailsTitle: string;
  ingredientsLabel: string;
  usageLabel: string;
  sizeLabel: string;
  relatedTitle: string;
  relatedSubtitle: string;
}

export interface LumiereCartPageCopy {
  masthead: LumiereMastheadCopy;
  empty: string;
  remove: string;
  removed: string;
  summaryTitle: string;
  subtotal: string;
  shipping: string;
  shippingNote: string;
  total: string;
  checkout: string;
  checkoutNote: string;
  lineTotalLabel: string;
  continue: string;
}

/** One control on the booking form. `options` present means it is a `<select>`. */
export interface LumiereFormFieldCopy {
  id: string;
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  hint?: string;
  options?: { value: string; label: string }[];
}

export interface LumiereBookingPageCopy {
  masthead: LumiereMastheadCopy;
  detailsTitle: string;
  aboutYouTitle: string;
  serviceField: LumiereFormFieldCopy;
  stylistField: LumiereFormFieldCopy;
  dateField: LumiereFormFieldCopy;
  timeField: LumiereFormFieldCopy;
  personFields: LumiereFormFieldCopy[];
  notesField: LumiereFormFieldCopy;
  submit: string;
  confirmed: string;
  policyTitle: string;
  policyPoints: string[];
}

export interface LumiereContactPageCopy {
  masthead: LumiereMastheadCopy;
  formTitle: string;
  hoursTitle: string;
  hours: { day: string; open: string }[];
  gettingHereTitle: string;
  gettingHere: string[];
}

export interface LumiereSalonCopy {
  common: LumiereCommonCopy;
  services: LumiereServicesPageCopy;
  shop: LumiereShopPageCopy;
  product: LumiereProductPageCopy;
  cart: LumiereCartPageCopy;
  booking: LumiereBookingPageCopy;
  contact: LumiereContactPageCopy;
  /** The stylist strip, shown on the home page and again on booking. */
  team: { eyebrow: string; title: string; subtitle: string; yearsLabel: string; daysLabel: string };
  /** Drifting testimonial marquee on the home page. */
  testimonials: { quote: string; author: string }[];
}

/**
 * Every string the salon's own pages render.
 *
 * The booking form is described here as well as rendered, which is what keeps it
 * honest: the fields are declared, there is no payment field anywhere in the
 * object, and the confirmation copy that says nothing was booked ships beside the
 * submit label so it cannot be dropped by accident.
 */
export const LUMIERE_SALON: LumiereSalonCopy = {
  common: {
    cart: 'Basket',
    cartCount: 'items in basket',
    book: 'Book an appointment',
    addToCart: 'Add to basket',
    added: 'Added to your basket',
    free: 'Free',
    from: 'From',
    duration: 'Duration',
    price: 'Price',
    backToShop: 'Back to the shop',
    demoNotice: 'Design template. No appointment is reserved and nothing is charged.',
    currencyLabel: 'Currency',
    languageLabel: 'Language',
    mainNav: 'Main',
    breadcrumbNav: 'Breadcrumb',
    marqueeLabel: 'What clients say',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },

  services: {
    masthead: {
      eyebrow: 'The treatment menu',
      title: 'Four rooms, twenty minutes of talking, then the work',
      subtitle:
        'Every price below is the price you pay. Consultations are unhurried and free, and no treatment is sold to you in the chair.',
    },
    menuLabel: 'Treatments',
    bookTreatment: 'Book this treatment',
    noteLabel: 'Note',
    courseTitle: 'Courses of three',
    courseBody:
      'Facials and micro-channel therapy work in sequence rather than singly. A course of three taken within twelve weeks is charged at ten per cent less, paid on the day of each visit rather than upfront.',
    courseCta: 'Ask about a course',
  },

  shop: {
    masthead: {
      eyebrow: 'The shop',
      title: 'What we use at the basin, in the size we buy it',
      subtitle:
        'Twelve formulas, blended for the salon and sold in the same bottles the therapists reach for. Every active is on the front of the label at a percentage.',
    },
    filterLabel: 'Filter by category',
    allLabel: 'Everything',
    countOne: 'product',
    countMany: 'products',
    viewAll: 'See the whole range',
  },

  product: {
    breadcrumb: 'Shop',
    shopLabel: 'Shop',
    variantLabel: 'Shade and size',
    quantityLabel: 'Quantity',
    decrease: 'Decrease quantity',
    increase: 'Increase quantity',
    detailsTitle: 'What is in it',
    ingredientsLabel: 'Key ingredients',
    usageLabel: 'How to use it',
    sizeLabel: 'Size',
    relatedTitle: 'Used alongside it',
    relatedSubtitle:
      'Chosen because the therapists layer them in the same order on the bed, not because they sell together.',
  },

  cart: {
    masthead: {
      eyebrow: 'Basket',
      title: 'Your basket',
      subtitle:
        'Collect in the salon on your next visit, or have it sent. Retail orders and treatment bookings are kept separate.',
    },
    empty: 'Your basket is empty. The shop has all twelve formulas.',
    remove: 'Remove',
    removed: 'Item removed from your basket',
    summaryTitle: 'Summary',
    subtotal: 'Subtotal',
    shipping: 'Delivery',
    shippingNote: 'Free delivery over £75, or collect from the salon at no charge.',
    total: 'Total',
    checkout: 'Continue to checkout',
    checkoutNote:
      'This is a front-end design template, so checkout goes no further than this page and no payment details are ever requested.',
    lineTotalLabel: 'Line total',
    continue: 'Keep shopping',
  },

  booking: {
    masthead: {
      eyebrow: 'Appointments',
      title: 'Tell us what you would like, and when',
      subtitle:
        'Requests are answered by a person, usually within two hours during opening times. Nothing is held until we have written back to confirm it.',
    },
    detailsTitle: 'The appointment',
    aboutYouTitle: 'About you',
    serviceField: {
      id: 'lumiere-booking-service',
      label: 'Treatment',
      type: 'select',
      autoComplete: 'off',
      placeholder: 'Choose a treatment',
      hint: 'Not sure which one? Choose the closest and we will advise.',
      /* No `options`: the treatment list is derived from the menu itself, so a
         second copy here could disagree with the page that prices it. */
    },
    stylistField: {
      id: 'lumiere-booking-stylist',
      label: 'Therapist',
      type: 'select',
      autoComplete: 'off',
      placeholder: 'Choose a therapist',
      /* Derived from `LUMIERE_STYLISTS`, for the same reason. */
    },
    dateField: {
      id: 'lumiere-booking-date',
      label: 'Preferred date',
      type: 'date',
      autoComplete: 'off',
      placeholder: '',
      hint: 'We hold a small number of same-week openings for existing clients.',
    },
    timeField: {
      id: 'lumiere-booking-time',
      label: 'Preferred time',
      type: 'select',
      autoComplete: 'off',
      placeholder: 'Choose a time',
      options: [
        { value: 'morning-early', label: 'Morning, 09.00 to 11.00' },
        { value: 'morning-late', label: 'Late morning, 11.00 to 13.00' },
        { value: 'afternoon', label: 'Afternoon, 13.00 to 16.00' },
        { value: 'evening', label: 'Evening, 16.00 to 19.30' },
      ],
    },
    personFields: [
      {
        id: 'lumiere-booking-name',
        label: 'Full name',
        type: 'text',
        autoComplete: 'name',
        placeholder: 'Elodie Bertrand',
      },
      {
        id: 'lumiere-booking-email',
        label: 'Email address',
        type: 'email',
        autoComplete: 'email',
        placeholder: 'you@example.com',
      },
      {
        id: 'lumiere-booking-phone',
        label: 'Telephone',
        type: 'tel',
        autoComplete: 'tel',
        placeholder: '020 7946 0114',
        hint: 'Used only to confirm the appointment or to tell you a therapist is unwell.',
      },
    ],
    notesField: {
      id: 'lumiere-booking-notes',
      label: 'Anything we should know',
      type: 'textarea',
      autoComplete: 'off',
      placeholder:
        'Allergies, a colour history, pregnancy, or the last time your hair was lightened.',
    },
    submit: 'Send appointment request',
    confirmed:
      'Request received. This is a design template, so no appointment has been reserved and nobody has been contacted.',
    policyTitle: 'Before you come',
    policyPoints: [
      'A patch test is taken at least 48 hours before any colour or micro-channel treatment',
      'Please give 24 hours notice to move an appointment, or half the fee is charged',
      'Arriving more than 15 minutes late shortens the treatment rather than the one after it',
      'Children are welcome in the salon but not in the treatment rooms',
    ],
  },

  contact: {
    masthead: {
      eyebrow: 'Find us',
      title: 'A townhouse on Chiltern Street, two floors and a courtyard',
      subtitle:
        'The desk answers the telephone between opening and close. Outside those hours the form below reaches the same inbox.',
    },
    formTitle: 'Send a message',
    hoursTitle: 'Opening hours',
    hours: [
      { day: 'Monday', open: 'Closed' },
      { day: 'Tuesday', open: '09.00 to 18.00' },
      { day: 'Wednesday', open: '09.00 to 20.00' },
      { day: 'Thursday', open: '09.00 to 20.00' },
      { day: 'Friday', open: '09.00 to 19.00' },
      { day: 'Saturday', open: '08.30 to 17.00' },
      { day: 'Sunday', open: 'Closed' },
    ],
    gettingHereTitle: 'Getting here',
    gettingHere: [
      'Baker Street is a six-minute walk; Bond Street is twelve minutes on foot',
      'Bus routes 2, 13, 30, 74 and 274 stop on Marylebone Road',
      'Resident bays on Chiltern Street are pay-by-app until 18.30, free on Sundays',
      'The ground floor and the courtyard room are step-free; the first floor is not',
    ],
  },

  team: {
    eyebrow: 'The floor',
    title: 'Eleven people, and the four you are most likely to sit with',
    subtitle:
      'Everyone here trains on a Monday when the salon is closed. It is why the diary loses a day and why the work stays consistent.',
    yearsLabel: 'years on the floor',
    daysLabel: 'Usually in',
  },

  testimonials: [
    {
      quote: 'The first cut in years that still looked deliberate three weeks later.',
      author: 'Priya, client since 2021',
    },
    {
      quote: 'Inès read my skin properly and then talked me out of half of what I came in asking for.',
      author: 'Hannah, Marylebone',
    },
    {
      quote: 'They wrote the balayage formula on my record so the next visit matched exactly.',
      author: 'Cecile, client since 2019',
    },
    {
      quote: 'Quiet rooms, no upselling at the end, and the tea arrives before the treatment does.',
      author: 'Marcus, Fitzrovia',
    },
    {
      quote: 'My hair took a smoothing treatment without going flat, which nobody had managed before.',
      author: 'Yemi, client since 2022',
    },
  ],
};

/* ---------------------------------------------------- shared page content */

export const LUMIERE_CONTENT: TemplateContent = {
  brand: 'Lumière',

  nav: [
    { href: '?page=services', label: 'Treatments' },
    { href: '?page=shop', label: 'Shop' },
    { href: '?page=booking', label: 'Book' },
    { href: '?page=contact', label: 'Visit' },
  ],

  hero: {
    badge: 'Chiltern Street, Marylebone. Open Tuesday to Saturday',
    title: 'Unhurried beauty,',
    titleAccent: 'kept between visits',
    subtitle:
      'A salon and treatment house on two floors of a Marylebone townhouse. Hair, skin, body and hands, with a small range of formulas blended for the rooms they are used in.',
    ctaPrimary: 'Book an appointment',
    ctaSecondary: 'See the treatment menu',
    stats: [
      { value: 19, suffix: 'yr', label: 'Since Camille opened the first floor' },
      { value: 11, suffix: '', label: 'Therapists and stylists on the floor' },
      { value: 92, suffix: '%', label: 'Of clients rebook before they leave' },
    ],
  },

  marquee: [
    'Cold porcelain finish',
    'Hand-painted balayage',
    'Formaldehyde-free smoothing',
    'Barrier repair protocols',
    'Camargue salt polish',
    'Low-heat gel curing',
    'Magnified skin reading',
    'Grasse-blended oils',
  ],

  about: {
    eyebrow: 'The house',
    title: 'One townhouse, no chains, and a Monday spent training',
    body: [
      'Camille Roux took the first floor of 34 Chiltern Street in 2007 with two chairs and a basin plumbed into what had been a kitchen. The treatment rooms came in 2014, the courtyard room in 2019, and the shop the year after that because clients kept asking what was in the bottles.',
      'We stay one building and eleven people on purpose. It is small enough that your colour formula is written on a card by the person who mixed it, and that the same therapist can see you through a course of three without the diary breaking.',
    ],
    points: [
      'Consultations are free, unhurried and never end in a sale you did not ask for',
      'Colour formulas, allergies and patch test dates are kept on your record',
      'The salon closes on Mondays so every stylist trains on paid time',
    ],
  },

  services: {
    eyebrow: 'What we do',
    title: 'Four disciplines, kept under one roof so they can work together',
    subtitle:
      'A colour appointment and a barrier-repair facial in the same week need to know about each other. Here they do, because the notes sit on one record.',
    items: [
      {
        icon: Scissors,
        title: 'Hair, cut dry',
        body: 'Shapes judged on hair as it behaves rather than as it sits wet, then finished by hand so it falls the same way at home on a Tuesday.',
      },
      {
        icon: Sparkles,
        title: 'Skin, read first',
        body: 'Every facial opens with a magnified reading and a written note. The protocol is chosen afterwards, which is why no two are identical.',
      },
      {
        icon: Waves,
        title: 'Body, properly quiet',
        body: 'Two rooms at 24 degrees with the phones left at the desk. Pressure is checked twice at the start and then left alone.',
      },
      {
        icon: Flower2,
        title: 'Hands and feet',
        body: 'Dry filing, cuticle work with oil rather than clippers, thin coats and a low-heat lamp that will not burn through the nail plate.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Lumière',
    title: 'Four things you will notice, mostly on the way home',
    subtitle:
      'None of them photograph well. All of them are the difference between a treatment that lasts a day and one that lasts a season.',
    items: [
      {
        icon: Timer,
        title: 'The diary has air in it',
        body: 'Appointments are booked with a fifteen-minute margin, so a consultation that runs long does not shorten the person after you.',
      },
      {
        icon: HandHeart,
        title: 'Nothing is sold in the chair',
        body: 'Therapists are salaried and take no product commission. If a formula is recommended it is written down, not put in your hand.',
      },
      {
        icon: Leaf,
        title: 'Short formulas, printed strengths',
        body: 'Our range lists the active and its percentage on the front of the bottle. Refills are stocked for every size above 200ml.',
      },
      {
        icon: GraduationCap,
        title: 'A closed Monday',
        body: 'Every stylist and therapist trains on Mondays on paid time, with an external educator in the building once a month.',
      },
    ],
  },

  faq: {
    eyebrow: 'Before you book',
    title: 'The questions the desk answers most',
    items: [
      {
        question: 'Do I need a patch test',
        answer:
          'Yes for any colour service and for micro-channel therapy, taken at least 48 hours beforehand and repeated every six months. It takes five minutes and can be done on a walk-in during opening hours.',
      },
      {
        question: 'How far ahead should I book',
        answer:
          'Two to three weeks for a cut, four to five for balayage or a smoothing treatment. We keep a small number of same-week openings back for existing clients, so it is worth telephoning.',
      },
      {
        question: 'What happens if I need to move an appointment',
        answer:
          'Give us 24 hours and there is no charge. Inside 24 hours we ask for half the treatment fee, because a colour slot rarely refills on the day.',
      },
      {
        question: 'Is the building accessible',
        answer:
          'The ground floor, the shop and the courtyard treatment room are step-free with a wide door and an accessible washroom. The first floor is reached by stairs only, so hair appointments can be moved downstairs on request.',
      },
      {
        question: 'Can I buy the products without an appointment',
        answer:
          'The shop is open to anyone during salon hours, and the desk will match a formula to your skin or hair without booking you in for anything.',
      },
      {
        question: 'Do you take gift vouchers',
        answer:
          'Vouchers are issued for any amount, valid for eighteen months, and can be spent on treatments, products or both. They are written by hand at the desk rather than emailed.',
      },
    ],
  },

  contact: {
    eyebrow: 'Write to us',
    title: 'A question the menu does not answer',
    subtitle:
      'Colour histories, accessibility, group bookings and gift vouchers all reach the same inbox, which is read by the desk rather than by a system.',
    fields: {
      name: 'Full name',
      email: 'Email address',
      message: 'How can we help',
    },
    submit: 'Send message',
    details: [
      { label: 'Email', value: 'desk@lumiere.example' },
      { label: 'Telephone', value: '020 7946 0114' },
      { label: 'Address', value: '34 Chiltern Street, London W1U 7QH' },
      { label: 'Open', value: 'Tuesday to Saturday, closed Monday and Sunday' },
    ],
  },

  footer: {
    tagline:
      'A salon and treatment house on Chiltern Street. Hair, skin, body and hands, with a small range blended for the rooms it is used in.',
    columns: [
      { title: 'Treatments', links: ['Hair', 'Skin', 'Body', 'Hands and feet'] },
      { title: 'Shop', links: ['Hair', 'Skin', 'Body', 'Fragrance'] },
      { title: 'Visit', links: ['Opening hours', 'Getting here', 'Gift vouchers', 'Accessibility'] },
    ],
    legal: '© 2026 Lumière Maison Ltd. Registered in England, 06133482.',
  },
};

/** The prompt a visitor copies to generate a salon in this spirit. */
export const LUMIERE_PROMPT = `Design a multipage website for Lumière, a luxury beauty salon and treatment house in Marylebone that also sells its own range of formulas.

Pages: home, treatment menu, shop, product detail, basket, booking request, visit and contact. Every page shares a header carrying a serif wordmark, four nav links, a basket count and a book button, plus a footer with three link columns. Each page opens with its own masthead.

Art direction:
- Warm blush paper (#f7efe9) with deep plum ink (#2c1b2e), a champagne rose-gold accent (#c8a06a) used only for ornament and a darker champagne for any accent text, and a soft mauve secondary.
- A high-contrast serif display face at up to 110px against a clean sans for all UI, buttons and labels.
- Very generous radii: 40 to 65px on panels, full pills on buttons and chips. Soft layered shadows, never a hard border.
- Signature shapes are arches and petals: treatment categories sit in arch-topped panels, a large arch drifts slowly behind the hero, and a rose-gold hairline with a diamond at its centre divides sections.
- Products are drawn, not photographed: bottles, jars, droppers and compacts composed from gradients and border-radius, with conic-gradient discs standing in for shades.

Pages in detail: home runs a hero with three counters, a drifting testimonial marquee, featured products, the house story, the four disciplines, a why-us grid, the team and an accordion FAQ. The treatment menu lists four categories with every treatment's duration in minutes and its price. The shop filters a twelve-product grid by category with pill chips and an announced result count. Product detail has a large composed vessel, shade discs, a quantity stepper and add to basket. Booking is a request form for treatment, therapist, date and time with a confirmation message and no payment fields anywhere.

Motion: cubic-bezier(0.16, 1, 0.3, 1) throughout. Sections rise 22px as they enter, counters count once, cards lift on hover, the hero arch drifts, and everything stands still under prefers-reduced-motion.

Voice: warm, precise, British. Real durations, prices, ingredients and opening hours. No exclamation marks.`;
