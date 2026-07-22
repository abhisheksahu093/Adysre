import {
  Clapperboard,
  Compass,
  Gauge,
  Layers,
  Megaphone,
  MonitorSmartphone,
  Package,
  PenTool,
  Shapes,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * KITE - content for the creative/branding agency template.
 *
 * English and deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Every section
 * reads from this module and holds no strings of its own.
 *
 * KITE is MULTIPAGE, so this file carries more than the shared `TemplateContent`
 * shape: the case-study book, the engagement packages, the process rail and the
 * studio roster. Those are typed locally rather than pushed into `types.ts`,
 * because "a case study has a sector and a measurable result" is this template's
 * domain, not every template's.
 */

/** The pages the template can render. `home` is what an unknown id falls back to. */
export const KITE_PAGES = ['home', 'work', 'services', 'studio', 'contact'] as const;
export type KitePageId = (typeof KITE_PAGES)[number];

/**
 * Which CSS composition a case-study card draws in place of a photograph. The
 * template ships no image assets, so each project picks one of four gradient
 * "canvas" treatments (see `kite.css`) and a six-card grid still reads as varied.
 */
export type KiteCanvas = 'a' | 'b' | 'c' | 'd';

/** The disciplines the work page filters on. Authored, so the chips are copy. */
export type KiteDiscipline = 'Identity' | 'Campaign' | 'Packaging' | 'Digital';

export interface KiteCaseStudy {
  /** Stable key, also the rendering and filter identity. */
  id: string;
  client: string;
  /** What the client sells - printed as the card's first metadata column. */
  sector: string;
  /** Year the work shipped. Strings, because these are labels not maths. */
  year: string;
  discipline: KiteDiscipline;
  title: string;
  /** One measurable outcome. The reason this card exists. */
  result: string;
  summary: string;
  /** Disciplines that made up the engagement, listed as chips on the card. */
  scope: string[];
  canvas: KiteCanvas;
}

/**
 * The book. Six projects, newest first, because a creative agency's most recent
 * work is the only argument it has about what it can do now. The home page
 * features the opening three.
 */
export const KITE_CASE_STUDIES: KiteCaseStudy[] = [
  {
    id: 'halberd-coffee',
    client: 'Halberd Coffee',
    sector: 'Food and drink',
    year: '2025',
    discipline: 'Identity',
    title: 'A roaster that stopped apologising for being expensive',
    result: 'Subscription sign-ups up 62% in two quarters',
    summary:
      'Halberd was pricing at the top of the market and speaking like a supermarket own-label. We rebuilt the identity around the roast log: a numbered, dated system that puts the evidence of care on the front of the bag.',
    scope: ['Positioning', 'Identity', 'Packaging', 'Site'],
    canvas: 'a',
  },
  {
    id: 'northbank',
    client: 'Northbank',
    sector: 'Consumer fintech',
    year: '2025',
    discipline: 'Campaign',
    title: 'Repositioning a savings app as an argument, not a feature',
    result: 'Qualified demo requests up 41% across the Series B raise',
    summary:
      'Nine competitors were selling the same interest rate. We moved Northbank off the number and onto the habit, then built a campaign platform that survived four markets and two product launches without a rewrite.',
    scope: ['Strategy', 'Campaign platform', 'Film', 'Media toolkit'],
    canvas: 'b',
  },
  {
    id: 'tallgrass-cycles',
    client: 'Tallgrass Cycles',
    sector: 'Sporting goods',
    year: '2024',
    discipline: 'Packaging',
    title: 'Packaging that survives a warehouse and a living room',
    result: 'Returns down 18%, and a Dieline award for the carton system',
    summary:
      'Every frame arrived in a box that told the courier nothing and the buyer less. One structural system now covers eleven SKUs, prints in two colours and doubles as the assembly instructions.',
    scope: ['Structural design', 'Packaging system', 'Illustration'],
    canvas: 'c',
  },
  {
    id: 'osmia-skin',
    client: 'Osmia Skin',
    sector: 'Beauty',
    year: '2024',
    discipline: 'Campaign',
    title: 'A launch built on one uncomfortable sentence',
    result: 'First production run sold out in nine days',
    summary:
      'The founder had a clinical claim and no permission to make it. We built the launch around the trial data itself, set in the type of a lab report, and let the restraint do the persuading.',
    scope: ['Naming', 'Launch campaign', 'Art direction', 'Retail'],
    canvas: 'd',
  },
  {
    id: 'fourteen-hills',
    client: 'Fourteen Hills Records',
    sector: 'Music',
    year: '2024',
    discipline: 'Identity',
    title: 'One grid, forty releases, no new design hours',
    result: '40 releases shipped by the label with no external design spend',
    summary:
      'A five-person label was buying artwork per release and getting a catalogue that looked like five labels. We handed them a generative grid and a two-page rulebook their own A and R team runs.',
    scope: ['Identity system', 'Art direction', 'Toolkit', 'Training'],
    canvas: 'b',
  },
  {
    id: 'verso-health',
    client: 'Verso Health',
    sector: 'Digital health',
    year: '2023',
    discipline: 'Digital',
    title: 'Merging two clinic brands into one that patients trust',
    result: '60 sites rebranded in 14 weeks, appointment completion up 12%',
    summary:
      'Two clinic groups merged and neither name could survive. We named the third thing, designed the booking flow that carries it, and wrote the signage spec that let 60 sites change over in a single quarter.',
    scope: ['Naming', 'Identity', 'Product design', 'Environmental'],
    canvas: 'a',
  },
];

/**
 * Filter chips for the work page. `all` is authored rather than derived so its
 * label is written copy like every other string the visitor reads.
 */
export const KITE_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Everything' },
  { id: 'Identity', label: 'Identity' },
  { id: 'Campaign', label: 'Campaign' },
  { id: 'Packaging', label: 'Packaging' },
  { id: 'Digital', label: 'Digital' },
];

/** Column headings for the metadata row on every case-study card. */
export const KITE_META_LABELS = {
  client: 'Client',
  sector: 'Sector',
  year: 'Year',
  result: 'Result',
} as const;

export interface KitePackage {
  id: string;
  name: string;
  /** Formatted for display - a template has no locale layer to format through. */
  price: string;
  duration: string;
  summary: string;
  includes: string[];
  /** The one the studio steers most clients toward, given visual weight. */
  featured: boolean;
}

/**
 * Engagement shapes, priced. Publishing the number is the point: it filters the
 * enquiry list before a call rather than after three.
 */
export const KITE_PACKAGES: KitePackage[] = [
  {
    id: 'sprint',
    name: 'Brand sprint',
    price: 'From $18,000',
    duration: 'Three weeks',
    summary:
      'For founders who need a position they can defend in a pitch next month, and a look that holds until the real system is worth building.',
    includes: [
      'Two founder sessions and six customer interviews',
      'Positioning statement and messaging hierarchy',
      'Logotype, palette, type and a twelve-page guide',
      'One launch asset set: deck, site header, social',
    ],
    featured: false,
  },
  {
    id: 'identity',
    name: 'Full identity',
    price: 'From $65,000',
    duration: 'Ten weeks',
    summary:
      'The whole argument, built to be run by your team. Strategy, the system, and the rulebook that keeps it intact after we leave the room.',
    includes: [
      'Category audit, stakeholder programme, customer research',
      'Naming where the name has to change',
      'Identity system: logotype, type, palette, motion, sound',
      'Component library, brand site and a two-day handover',
    ],
    featured: true,
  },
  {
    id: 'campaign',
    name: 'Campaign platform',
    price: 'From $40,000',
    duration: 'Six weeks',
    summary:
      'One idea with enough structure to run for eighteen months across markets, rather than four executions that expire in March.',
    includes: [
      'Audience and media strategy',
      'Platform idea with three proof executions',
      'Film treatment and art direction',
      'Toolkit and adaptation rules for in-house teams',
    ],
    featured: false,
  },
  {
    id: 'retainer',
    name: 'Studio on call',
    price: '$12,000 a month',
    duration: 'Six-month minimum',
    summary:
      'A standing half-week of the same three people, for teams whose brand is live and moving. No tickets, no rebriefing.',
    includes: [
      'Twenty studio hours a week, named team',
      'Weekly working session in your calendar',
      'Quarterly system review and guide updates',
      'First call on production and film capacity',
    ],
    featured: false,
  },
];

export interface KiteProcessStep {
  /** Printed as the oversized numeral on the rail. */
  number: string;
  title: string;
  duration: string;
  body: string;
}

/** The five-step rail. Durations are real, which is why they are uneven. */
export const KITE_PROCESS: KiteProcessStep[] = [
  {
    number: '01',
    title: 'Interrogate',
    duration: 'Week one',
    body: 'We read the category, talk to your customers and ask the two questions your team has been avoiding in front of each other.',
  },
  {
    number: '02',
    title: 'Position',
    duration: 'Weeks two to three',
    body: 'One sentence you can defend against a competitor, a board and a journalist. Everything after this is a consequence of it.',
  },
  {
    number: '03',
    title: 'Design',
    duration: 'Weeks four to seven',
    body: 'Three routes, shown once, argued properly. We take one forward and stop showing options, because choice is not a deliverable.',
  },
  {
    number: '04',
    title: 'System',
    duration: 'Weeks eight to nine',
    body: 'The rules, the components and the edge cases. Built so a marketing manager in another timezone gets it right without calling us.',
  },
  {
    number: '05',
    title: 'Launch',
    duration: 'Week ten and after',
    body: 'We art-direct the first campaign, sit in the first two weeks of production, and hand over a guide your team has already used.',
  },
];

export interface KiteTeamMember {
  name: string;
  role: string;
  bio: string;
  /** Initials for the CSS avatar, so the studio page ships no photography. */
  initials: string;
}

/** Nine people in one room, five of whom the client actually meets. */
export const KITE_TEAM: KiteTeamMember[] = [
  {
    name: 'Ivy Marchetti',
    role: 'Founder and creative director',
    initials: 'IM',
    bio: 'Fifteen years art-directing, seven of them running the design floor at a network shop before deciding nine people could do it better than ninety. Leads every engagement personally.',
  },
  {
    name: 'Sun-woo Park',
    role: 'Design director',
    initials: 'SP',
    bio: 'Draws the systems. Typeface work for two foundries and an obsession with the twelfth application of a logotype rather than the first.',
  },
  {
    name: 'Callum Iheanacho',
    role: 'Strategy director',
    initials: 'CI',
    bio: 'Came from category planning, not from a strategy course. Writes the sentence, then defends it in the room where the budget lives.',
  },
  {
    name: 'Freya Lindholm',
    role: 'Motion and film lead',
    initials: 'FL',
    bio: 'Cuts the film, builds the motion language, and insists a brand has a rhythm before it has an animation. Shot on four continents last year.',
  },
  {
    name: 'Dov Abramson',
    role: 'Production director',
    initials: 'DA',
    bio: 'Owns the dates. Nine years in print and retail production, which is why our packaging specs come back from the plant unchanged.',
  },
];

/** Copy for the featured-work block on the home page. */
export const KITE_FEATURED = {
  eyebrow: 'Recent',
  title: 'Three we would show a stranger',
  subtitle:
    'We take twelve engagements a year. Each one gets the founder, the design director and the strategist in the room, which is the only reason the numbers below exist.',
  cta: 'See the whole book',
  ctaHref: '?page=work',
} as const;

/** Copy for the dedicated work page. */
export const KITE_WORK_PAGE = {
  eyebrow: 'The book',
  title: 'Work',
  titleOutline: 'that argues',
  subtitle:
    'Six engagements from the last three years, with the outcome the client measured rather than the one we would like to claim. Filter by what we were hired to do.',
  filterLegend: 'Filter by discipline',
  resultsSuffix: 'projects shown',
  empty: 'Nothing in that discipline yet. Ask us what is in production.',
} as const;

/** Copy for the dedicated services page. */
export const KITE_SERVICES_PAGE = {
  eyebrow: 'Engagements',
  title: 'What it',
  titleOutline: 'costs',
  subtitle:
    'Four shapes, priced publicly. Anything genuinely bespoke is quoted off the same rate card, and we will tell you on the first call if your budget does not reach the work you are describing.',
  packagesEyebrow: 'Pricing',
  packagesTitle: 'Four ways to work with us',
  featuredLabel: 'Most engagements',
  includesLabel: 'What is included',
  packageCta: 'Start this conversation',
  processEyebrow: 'How it runs',
  processTitle: 'Ten weeks, in five moves',
} as const;

/** Copy for the dedicated studio page. */
export const KITE_STUDIO_PAGE = {
  eyebrow: 'The studio',
  title: 'Nine people,',
  titleOutline: 'one room',
  subtitle:
    'Kite opened in 2017 in a former print works in Rotterdam. We have stayed deliberately small, and turned down the work that would have made us big.',
  teamEyebrow: 'Who you meet',
  teamTitle: 'The five you will be in a room with',
  valuesEyebrow: 'How we operate',
  valuesTitle: 'Four rules we have not broken',
  values: [
    {
      title: 'No juniors on the pitch and seniors off the project',
      body: 'The people in the first meeting are the people doing the work. If that changes, we tell you the week it changes and why.',
    },
    {
      title: 'Three routes, shown once',
      body: 'We present three directions in a single session, argue for one, and then stop presenting. Endless options are a way of avoiding a decision.',
    },
    {
      title: 'The system outlives the launch',
      body: 'Every engagement ends with rules your team can run. We would rather not be needed in month seven than be needed forever.',
    },
    {
      title: 'Twelve projects a year, no more',
      body: 'It is the number at which the founder can be genuinely on every project. Beyond it we would be selling a name rather than a studio.',
    },
  ],
  milestonesEyebrow: 'Nine years',
  milestones: [
    { year: '2017', label: 'Opened in a print works in Rotterdam with three people and one client' },
    { year: '2019', label: 'Added strategy in house after losing an argument we should have won' },
    { year: '2021', label: 'First full identity above six figures, for a client who is still with us' },
    { year: '2023', label: 'Built the motion and film team rather than keep subcontracting the last mile' },
    { year: '2026', label: 'Nine people, 128 projects shipped, twelve engagements a year by choice' },
  ],
} as const;

/** Copy for the dedicated contact page, beyond the shared `contact` block. */
export const KITE_CONTACT_PAGE = {
  title: 'Start',
  titleOutline: 'something',
  budgetLabel: 'Rough budget',
  budgetOptions: [
    'Under $25,000',
    '$25,000 to $60,000',
    '$60,000 to $150,000',
    'Above $150,000',
    'Not sure yet',
  ],
  studiosEyebrow: 'Where we are',
  studios: [
    {
      name: 'Rotterdam',
      address: 'Keilestraat 14, 3029 BS Rotterdam',
      hours: 'Monday to Thursday in the studio, Friday for making things.',
    },
    {
      name: 'New York',
      address: '71 Grand Street, Floor 4, New York NY 10013',
      hours: 'A three-person desk, open Tuesday to Friday.',
    },
  ],
  sentTitle: 'Brief received',
  sentBody:
    'Thank you. Ivy reads every enquiry and replies within two working days, usually with a date rather than a deck.',
} as const;

/** Chrome that is not section copy: menu labels, skip link, card affordances. */
export const KITE_UI = {
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  headerCta: 'Start a project',
  headerCtaHref: '?page=contact',
  viewCaseStudy: 'Read the case study',
  workNav: 'Work filters',
  scrollHint: 'Scroll',
} as const;

export const KITE_CONTENT: TemplateContent = {
  brand: 'Kite',

  /*
   * Query hrefs, not anchors: the preview route reads `?page=` and hands the id
   * back to the template, so navigation needs neither a router nor a link
   * component. A downloaded copy behaves identically.
   */
  nav: [
    { href: '?page=home', label: 'Home' },
    { href: '?page=work', label: 'Work' },
    { href: '?page=services', label: 'Services' },
    { href: '?page=studio', label: 'Studio' },
    { href: '?page=contact', label: 'Contact' },
  ],

  hero: {
    badge: 'Branding studio, Rotterdam and New York',
    /*
     * Two halves, because the hero sets them differently: `title` prints solid
     * and `titleAccent` prints as the oversized outlined word. Splitting the
     * headline here rather than in the component keeps the copy editable.
     */
    title: 'We build brands that pick',
    titleAccent: 'a fight',
    subtitle:
      'Kite is nine people who take twelve engagements a year. Positioning, identity, campaigns and the systems that keep them intact once we have gone.',
    ctaPrimary: 'See the work',
    ctaSecondary: 'What it costs',
    stats: [
      { value: 128, suffix: '', label: 'Projects shipped since 2017' },
      { value: 12, suffix: '', label: 'Engagements a year, by choice' },
      { value: 31, suffix: '%', label: 'Median lift clients measured' },
    ],
  },

  marquee: [
    'Positioning',
    'Naming',
    'Identity systems',
    'Campaign platforms',
    'Packaging',
    'Motion and film',
    'Art direction',
    'Digital product',
  ],

  about: {
    eyebrow: 'About Kite',
    title: 'Started by an art director who was tired of presenting nine routes',
    body: [
      'Ivy Marchetti spent seven years running a design floor at a network agency, where the process was to show a client so many options that whichever one they picked, nobody could be blamed. The work got safer every year and the results got smaller.',
      'Kite opened in 2017 with the opposite rule. Three routes, shown once, with an argument attached to each. We take the client through why one of them is right, and then we stop presenting and start building the system that makes it hold.',
    ],
    points: [
      'The founder is on every engagement, from first call to handover',
      'Twelve projects a year, so nobody is on four at once',
      'Every project ends with rules your own team can run',
    ],
  },

  services: {
    eyebrow: 'What we do',
    title: 'Six disciplines, one room',
    subtitle:
      'We do not have departments, and we do not hand a project between them. The same five people carry an engagement from the first interview to the launch film.',
    items: [
      {
        icon: Compass,
        title: 'Positioning and strategy',
        body: 'Category audit, customer interviews and one sentence you can defend in front of a board. Written before anything is drawn.',
      },
      {
        icon: Shapes,
        title: 'Identity systems',
        body: 'Logotype, type, palette, motion and sound, built as a system with the twelfth application designed rather than the first.',
      },
      {
        icon: Megaphone,
        title: 'Campaign platforms',
        body: 'One idea structured to run eighteen months across markets, with adaptation rules your in-house team can follow without us.',
      },
      {
        icon: Package,
        title: 'Packaging and retail',
        body: 'Structural and graphic design specified to the plant, with production sat in by Dov so the first run comes back right.',
      },
      {
        icon: Clapperboard,
        title: 'Motion and film',
        body: 'A rhythm before an animation. Freya cuts the launch film and writes the motion language the rest of the system inherits.',
      },
      {
        icon: MonitorSmartphone,
        title: 'Digital product design',
        body: 'The site, the booking flow, the component library. Designed against real content and handed over as code-ready specs.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Kite',
    title: 'What twelve projects a year buys you',
    subtitle:
      'We could take thirty. These are the four things that would quietly stop being true if we did.',
    items: [
      {
        icon: Users,
        title: 'The people who pitched, doing the work',
        body: 'No handover to a delivery team. Ivy, Sun-woo and Callum are on your project from the first interview to the last file.',
      },
      {
        icon: Target,
        title: 'A position, not a mood board',
        body: 'Every engagement produces one sentence and the evidence behind it. If we cannot write it, we have not finished the strategy.',
      },
      {
        icon: Layers,
        title: 'Systems that survive us',
        body: 'Rules, components and edge cases, handed over in a two-day session. Fourteen Hills has shipped forty releases without calling.',
      },
      {
        icon: Gauge,
        title: 'Dates that hold',
        body: 'Production is owned by a director, not a spreadsheet. We have moved one launch date in three years, and we moved it early.',
      },
    ],
  },

  faq: {
    eyebrow: 'Before you write',
    title: 'What clients ask on the first call',
    items: [
      {
        question: 'What does a full identity actually cost?',
        answer:
          'Full identity engagements start at $65,000 and most land between $65,000 and $140,000 depending on naming, motion and how many markets the system has to serve. The brand sprint at $18,000 exists for founders who are not there yet, and it is a real piece of work rather than a taster.',
      },
      {
        question: 'How long until we can launch?',
        answer:
          'Ten weeks from kickoff for a full identity, three for a sprint, six for a campaign platform. Those dates assume one decision-maker with the authority to approve. If approval runs through a committee, tell us on the first call and we will build the extra fortnight into the plan rather than discover it in week six.',
      },
      {
        question: 'Do you present multiple routes?',
        answer:
          'Three, in a single session, with an argument attached to each and a recommendation. After that session we take one route forward and stop showing alternatives. Studios that present nine routes are distributing the risk of the decision, not doing more work.',
      },
      {
        question: 'Will you work with our in-house design team?',
        answer:
          'Most of our engagements have one, and it is the reason the handover is two full days rather than a PDF. Your team joins the system phase, argues with the rules while they can still change, and leaves owning them.',
      },
      {
        question: 'What if we do not like any of the three routes?',
        answer:
          'It has happened twice in nine years, and both times the fault was in the strategy rather than the design. We go back to the positioning at our cost, because a fourth round of visuals against a brief nobody believes is how a project dies slowly.',
      },
      {
        question: 'Do you take equity instead of fees?',
        answer:
          'No. We have tried it, it distorted the advice we gave, and we stopped. Fees are invoiced in three stages against agreed milestones and there is no media commission anywhere in our model.',
      },
    ],
  },

  contact: {
    eyebrow: 'Get in touch',
    title: 'Tell us what you are up against',
    subtitle:
      'A launch, a merger, a category that has stopped listening. Ivy reads everything that arrives here and replies within two working days.',
    fields: { name: 'Your name', email: 'Work email', message: 'What are you working on' },
    submit: 'Send the brief',
    details: [
      { label: 'New business', value: 'hello@kite.example' },
      { label: 'Telephone', value: '+31 10 555 0182' },
      { label: 'Studio', value: 'Keilestraat 14, Rotterdam' },
    ],
  },

  footer: {
    tagline:
      'A nine-person branding studio in Rotterdam and New York. Twelve engagements a year, and the founder on every one.',
    columns: [
      {
        title: 'Studio',
        links: ['About Kite', 'The team', 'How we work', 'Careers'],
      },
      {
        title: 'Work',
        links: ['Identity', 'Campaigns', 'Packaging', 'Digital product'],
      },
      {
        title: 'Engage',
        links: ['Brand sprint', 'Full identity', 'Campaign platform', 'Studio on call'],
      },
    ],
    legal: '© 2026 Kite Studio BV. Registered in Rotterdam. All rights reserved.',
  },
};

/**
 * A sixth service icon is unused by `services.items` on purpose - `PenTool` and
 * `Zap` are re-exported here so the studio page's value list can carry marks
 * without importing lucide twice. Keeping every icon choice in the content
 * module is what lets a visitor re-brand the template from one file.
 */
export const KITE_VALUE_ICONS = [PenTool, Target, Layers, Zap] as const;

/** The prompt a visitor copies to generate a site in this spirit. */
export const KITE_PROMPT = `Design a five-page website for a bold nine-person creative and branding agency called Kite.

Pages: home, work, services, studio, contact. A shared header and footer wrap all five, the nav marks the current page, and every page opens with its own oversized masthead.

Art direction:
- Off-black #0e0e10 everywhere, with a hot gradient pair running magenta #ff2d78 into tangerine #ff8a3d, and one acid #d6ff3f highlight used sparingly for chips and underlines. Warm off-white #f7f5f2 for body text.
- Enormous display type: clamp up to about 120px, tracking around -0.04em, mixed case rather than all caps, and one word per headline set as an outlined outline-only word using text-stroke.
- Very large radii, 40 to 65px on cards and panels, and fully pill-shaped buttons and chips.
- No photography anywhere. Case-study cards are gradient compositions built from layered conic, radial and repeating-linear gradients, in four variants so a six-card grid does not repeat. A blurred mesh blob drifts slowly behind the hero.

Sections: a hero with a badge, the huge two-part headline, two pill CTAs and three counters; a kinetic marquee of capabilities; three featured case studies as tilting cards with client, sector, year and a measured result; a six-card services grid; a "why us" grid; an accordion FAQ. The work page is a filterable six-card grid with discipline chips. The services page carries four priced engagement packages and an animated five-step numbered process rail with a connecting line. The studio page carries the founding story, four operating rules, five people with CSS initial avatars and a dated timeline. Contact pairs a form with a budget select and two studio addresses.

Motion: everything eases on cubic-bezier(0.16, 1, 0.3, 1). Sections stagger in and rise 28px, counters count once, the marquee scrolls continuously, work cards tilt in perspective on hover, the mesh blob drifts, and the process rail draws its connecting line as it enters. All of it is static under prefers-reduced-motion.

Voice: confident and specific. Real client names, sectors, years, measured results and published prices. No exclamation marks.`;
