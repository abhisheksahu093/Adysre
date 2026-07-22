import {
  ClipboardCheck,
  Compass,
  Cpu,
  Gauge,
  Handshake,
  Layers,
  LineChart,
  Network,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * PINNACLE - content for the management & strategy consultancy template.
 *
 * English, untranslated, and part of the artifact: a visitor downloads this file
 * and rewrites it into their own firm (see `types.ts`). Sections read from here
 * and hold no copy of their own, so the firm's voice lives in exactly one place
 * and re-branding never touches a component.
 *
 * PINNACLE is a MULTIPAGE template - five pages rather than one long scroll,
 * because a consultancy's buyer arrives with a specific question (what do you
 * do, what have you delivered, who would run this, how do I reach you) and a
 * single scroll answers none of them well. `TemplateContent` carries the shared
 * chrome and the home page; the extra exports below carry the copy the dedicated
 * pages need, each with a local interface so the shared contract stays untouched.
 */

/** The pages PINNACLE ships. `home` renders when no page is asked for. */
export const PINNACLE_PAGES = ['home', 'expertise', 'insights', 'team', 'contact'] as const;
export type PinnaclePageId = (typeof PINNACLE_PAGES)[number];

/** The masthead each dedicated page opens with, in place of the home hero. */
export interface PinnaclePageHead {
  eyebrow: string;
  title: string;
  intro: string;
  /** Two short figures set beside the title, so a masthead still says something. */
  facts: { value: string; label: string }[];
}

/** One practice area, told at the depth a chief executive actually needs. */
export interface PinnaclePractice {
  /** Two digits, rendered as the oversized index on the expertise list. */
  index: string;
  name: string;
  summary: string;
  /** What the team is engaged to produce, in the client's language. */
  deliverables: string[];
  /** Typical engagement length - the first question every buyer asks. */
  duration: string;
  lead: string;
}

/** A completed engagement, stated as an outcome rather than an activity. */
export interface PinnacleCase {
  sector: string;
  client: string;
  challenge: string;
  /** The measurable result. `value` is the headline figure on the card. */
  outcome: { value: string; label: string }[];
  duration: string;
}

/** One phase of the engagement model, drawn on the numbered rail. */
export interface PinnaclePhase {
  step: string;
  title: string;
  body: string;
  duration: string;
  /** What the client is holding when the phase ends. */
  deliverable: string;
}

/**
 * One bar in the results dashboard. `before` and `after` are percentages of the
 * bar's full width, so the section draws itself from data with no magic numbers
 * in the markup.
 */
export interface PinnacleMetric {
  label: string;
  before: number;
  after: number;
  /** The change, already phrased - the chart states it, it is not inferred. */
  delta: string;
}

/** A published article. Date, author and read time are what a reader scans for. */
export interface PinnacleInsight {
  title: string;
  standfirst: string;
  category: string;
  author: string;
  /** Long form, already localised into English - it is display copy, not data. */
  date: string;
  readTime: string;
}

/** A partner. `initials` drives the CSS monogram disc, since there are no images. */
export interface PinnaclePartner {
  initials: string;
  name: string;
  role: string;
  focus: string;
  /** Sectors this partner personally carries, shown as pills. */
  sectors: string[];
}

/** An office, addressed the way correspondence would be. */
export interface PinnacleOffice {
  city: string;
  lines: string[];
  phone: string;
  hours: string;
}

export const PINNACLE_CONTENT: TemplateContent = {
  brand: 'Pinnacle',

  // Query hrefs, not anchors: the header drives the page switch inside the
  // template itself, so the preview route needs no router to navigate.
  nav: [
    { href: '?page=expertise', label: 'Expertise' },
    { href: '?page=insights', label: 'Insights' },
    { href: '?page=team', label: 'Team' },
    { href: '?page=contact', label: 'Contact' },
  ],

  hero: {
    badge: 'Chicago · Toronto · London',
    title: 'Strategy that survives',
    titleAccent: 'contact with the operation',
    subtitle:
      'Pinnacle Advisory Group works with executive teams in industrial manufacturing, healthcare services and financial services. We take the decisions that have been deferred for two quarters and close them in twelve weeks, with the operating detail already worked out.',
    ctaPrimary: 'Start a conversation',
    ctaSecondary: 'See our expertise',
    stats: [
      { value: 240, suffix: '+', label: 'Engagements delivered since 2009' },
      { value: 94, suffix: '%', label: 'Clients who commission a second engagement' },
      { value: 1, suffix: '.8B', label: 'Recurring value released for clients (USD)' },
    ],
  },

  marquee: [
    'Halvorsen Industrial Group',
    'Northbrook Health Network',
    'Castellan Capital Partners',
    'Merrow & Fields',
    'Arcadia Energy Systems',
    'Delaney Consumer Brands',
    'Westmark Logistics',
    'Ardent Software',
  ],

  about: {
    eyebrow: 'The firm',
    title: 'Small enough that the partner is in the room',
    body: [
      'Pinnacle was founded in Chicago in 2009 by three partners who had spent a decade inside large strategy houses and were tired of selling work that a different team then delivered. The arrangement here has not changed since: the partner who scopes the engagement runs it, and there is no second bench to hand it to.',
      'Twenty-eight consultants, three offices, and a deliberate ceiling on how many engagements run at once. We turn down roughly one in three approaches, usually because the question is already answered inside the client and what is missing is the decision rather than the analysis.',
    ],
    points: [
      'A named partner on the work every week, not at the readout',
      'Fixed fee agreed before the engagement letter is signed',
      'Findings shared as they emerge, never held back for a final deck',
      'Implementation support included for ninety days after handover',
    ],
  },

  services: {
    eyebrow: 'What we do',
    title: 'Six practices, one operating standard',
    subtitle:
      'Each practice is led by a partner who still does the work. Engagements that cross practices are staffed once, by the people already on them.',
    items: [
      {
        icon: Compass,
        title: 'Corporate Strategy',
        body: 'Where to compete and where to stop. Portfolio reviews, market entry cases and the three-year plan that a board can actually fund.',
      },
      {
        icon: Gauge,
        title: 'Operating Performance',
        body: 'Cost-to-serve, throughput and working capital. We size the opportunity in week two and hand over a plan owned by line managers.',
      },
      {
        icon: Handshake,
        title: 'Transaction Advisory',
        body: 'Commercial diligence, synergy cases and the first hundred days of integration, run alongside the deal team rather than after it.',
      },
      {
        icon: Cpu,
        title: 'Technology & Data',
        body: 'Platform decisions, data architecture and the automation business case, assessed on payback rather than on vendor roadmap.',
      },
      {
        icon: Users,
        title: 'Organisation Design',
        body: 'Spans, layers, accountability and the operating model that follows a merger, a spin-off or a change of chief executive.',
      },
      {
        icon: ShieldCheck,
        title: 'Risk & Regulation',
        body: 'Regulatory change programmes for financial services and healthcare clients, from gap assessment to supervisory response.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Pinnacle',
    title: 'What a client notices in the first fortnight',
    subtitle: 'Four commitments we have made in writing since 2009, and still keep.',
    items: [
      {
        icon: ClipboardCheck,
        title: 'A fixed fee, agreed first',
        body: 'Scope and price are settled before work starts. If the question changes, we re-scope in writing rather than raising a variation at the end.',
      },
      {
        icon: LineChart,
        title: 'Numbers you can audit',
        body: 'Every figure in a Pinnacle deliverable traces to a source your finance team can open. The model ships with the report.',
      },
      {
        icon: Layers,
        title: 'Built to be handed over',
        body: 'The plan is written for the manager who has to run it on Monday, and we stay available for ninety days while they do.',
      },
      {
        icon: Network,
        title: 'One team across three offices',
        body: 'Chicago, Toronto and London share a single engagement record. Nothing is re-explained because the work crossed a border.',
      },
    ],
  },

  faq: {
    eyebrow: 'Common questions',
    title: 'What prospective clients ask first',
    items: [
      {
        question: 'How do you price an engagement?',
        answer:
          'A fixed fee, quoted against a written scope, before the engagement letter is signed. Diagnostics start at 65,000 dollars and a full twelve-week programme typically runs between 240,000 and 420,000 dollars depending on the number of sites in scope. There are no time-and-materials engagements.',
      },
      {
        question: 'How long does a typical engagement run?',
        answer:
          'A diagnostic is four weeks. A full strategy or performance programme is twelve to sixteen weeks, structured as four phases with a decision point at the end of each. Integration support runs longer and is scoped separately.',
      },
      {
        question: 'Who actually does the work?',
        answer:
          'A partner and two to four consultants. The partner who scoped the engagement is on it every week, reads the analysis and presents it. We do not separate selling from delivery, which is why we cap how many engagements run at once.',
      },
      {
        question: 'Will you work alongside our internal team?',
        answer:
          'Almost always. The strongest engagements are joint teams with client members named in the engagement letter, because the plan is more likely to be carried out by people who built it. We ask for two to three days a week from each named client member.',
      },
      {
        question: 'What happens after the final presentation?',
        answer:
          'Ninety days of implementation support is included: a fortnightly working session, access to the models, and a partner on the phone. After that we step back unless you commission a separate implementation engagement.',
      },
      {
        question: 'Do you work with companies of our size?',
        answer:
          'Our clients range from private companies with 80 million dollars in revenue to listed groups above 6 billion. The engagement shape differs; the staffing rule does not. Below roughly 40 million we usually recommend a specialist rather than take the work.',
      },
    ],
  },

  contact: {
    eyebrow: 'Contact',
    title: 'Describe the decision you are facing',
    subtitle:
      'Send an outline and a partner will reply within one business day with a view on whether we are the right firm, and a proposed shape if we are. There is no charge for the first conversation.',
    fields: {
      name: 'Full name',
      email: 'Work email address',
      message: 'The decision you are facing',
    },
    submit: 'Send enquiry',
    details: [
      {
        label: 'Principal office',
        value: '212 North Wacker Drive, Suite 2400, Chicago, IL 60606',
      },
      { label: 'Telephone', value: '+1 (312) 555-0164' },
      { label: 'New engagements', value: 'engagements@pinnacleadvisory.example' },
      { label: 'Response time', value: 'One business day, from a partner' },
    ],
  },

  footer: {
    tagline:
      'Pinnacle Advisory Group. Strategy, performance and transaction advisory for executive teams in industrial, healthcare and financial services. Founded in Chicago in 2009.',
    columns: [
      {
        title: 'Practices',
        links: [
          'Corporate Strategy',
          'Operating Performance',
          'Transaction Advisory',
          'Organisation Design',
        ],
      },
      { title: 'Firm', links: ['Our team', 'Insights', 'Offices', 'Careers'] },
      {
        title: 'Notices',
        links: ['Terms of engagement', 'Privacy notice', 'Modern slavery statement', 'Accessibility'],
      },
    ],
    legal: '© 2026 Pinnacle Advisory Group LLC. All rights reserved.',
  },
};

/** Mastheads for the four dedicated pages, keyed by page id. */
export const PINNACLE_PAGE_HEADS: Record<Exclude<PinnaclePageId, 'home'>, PinnaclePageHead> = {
  expertise: {
    eyebrow: 'Expertise',
    title: 'Six practices, and what each one is engaged to deliver',
    intro:
      'Every practice below is led by a partner in daily client work. What follows is the question each is called in for, what you receive at the end, and how long it usually takes.',
    facts: [
      { value: '6', label: 'Practices' },
      { value: '4–16 wks', label: 'Typical engagement' },
    ],
  },
  insights: {
    eyebrow: 'Insights',
    title: 'What we are learning in the field',
    intro:
      'Short pieces written by the partners running the work, published when we have something worth saying rather than on a content calendar. Roughly one a fortnight.',
    facts: [
      { value: '2009', label: 'Publishing since' },
      { value: '6 min', label: 'Median read' },
    ],
  },
  team: {
    eyebrow: 'Team',
    title: 'The partners who answer for the work',
    intro:
      'Twenty-eight consultants across three offices, led by six partners. Each partner carries engagements personally, which is the reason we cap how many run at once.',
    facts: [
      { value: '28', label: 'Consultants' },
      { value: '11 yrs', label: 'Median partner tenure' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Three offices, one engagement record',
    intro:
      'New enquiries are read by a partner, not by a business development team. Existing engagements should go directly to the partner leading the work.',
    facts: [
      { value: '3', label: 'Offices' },
      { value: '1 day', label: 'Reply time' },
    ],
  },
};

/** The expertise page - the same six practices, told at depth. */
export const PINNACLE_PRACTICES: PinnaclePractice[] = [
  {
    index: '01',
    name: 'Corporate Strategy',
    summary:
      'Called in when a portfolio has drifted, a market has moved, or a board has funded a plan nobody believes. We rebuild the case from the demand side up, test it against the operation, and set out what to fund and what to close.',
    deliverables: [
      'Portfolio review with a fund, hold or exit position on every business unit',
      'Three-year plan with a bottom-up revenue model your finance team owns',
      'Market entry case including the cost of the first two years of losses',
    ],
    duration: '10–14 weeks',
    lead: 'Adaeze Okonjo',
  },
  {
    index: '02',
    name: 'Operating Performance',
    summary:
      'Cost-to-serve, throughput, yield and working capital. We size the opportunity in the first fortnight so the executive team can decide whether to continue, then build the plan with the line managers who will run it.',
    deliverables: [
      'Opportunity map sized by site, line and customer segment',
      'Ninety-day implementation plan with a named owner on every action',
      'Weekly operating review pack the client keeps running after handover',
    ],
    duration: '12–16 weeks',
    lead: 'Rafael Duarte',
  },
  {
    index: '03',
    name: 'Transaction Advisory',
    summary:
      'Commercial diligence for acquirers and their lenders, synergy cases that survive the first budget cycle, and the integration plan for the hundred days after close. We work alongside the deal team rather than behind it.',
    deliverables: [
      'Commercial diligence report with a stress-tested revenue bridge',
      'Synergy case split into cost, revenue and one-off, each with an owner',
      'Day-one and hundred-day integration plan with a decision calendar',
    ],
    duration: '4–9 weeks',
    lead: 'Marta Lindqvist',
  },
  {
    index: '04',
    name: 'Technology & Data',
    summary:
      'Platform and architecture decisions assessed on payback rather than on a vendor roadmap. We look at what the estate actually costs to run, what the migration will genuinely take, and what the automation case is worth after change management.',
    deliverables: [
      'Estate assessment with run cost by application and by business capability',
      'Target architecture and a sequenced migration plan with cost per wave',
      'Automation business case modelled net of change and retraining cost',
    ],
    duration: '8–12 weeks',
    lead: 'Tobias Renner',
  },
  {
    index: '05',
    name: 'Organisation Design',
    summary:
      'Spans, layers, accountability and the operating model that follows a merger, a spin-off or a new chief executive. We start from the decisions the organisation has to make, not from the boxes it currently has.',
    deliverables: [
      'Decision map showing who decides, who is consulted and where it stalls',
      'Target structure with spans, layers and a costed transition path',
      'Role charters for the top three layers, written and agreed',
    ],
    duration: '8–12 weeks',
    lead: 'Priyanka Menon',
  },
  {
    index: '06',
    name: 'Risk & Regulation',
    summary:
      'Regulatory change programmes for financial services and healthcare clients: gap assessment against the incoming rule, remediation plan, and the evidence pack that a supervisor will accept without a second request.',
    deliverables: [
      'Gap assessment mapped clause by clause to current controls',
      'Remediation programme with a supervisory reporting calendar',
      'Evidence pack and control testing protocol handed to internal audit',
    ],
    duration: '10–20 weeks',
    lead: 'Callum Reyes',
  },
];

/** Completed engagements, stated as outcomes. Figures are the point of the card. */
export const PINNACLE_CASES: PinnacleCase[] = [
  {
    sector: 'Industrial manufacturing',
    client: 'A family-held components group, four plants',
    challenge:
      'Margin had fallen for six consecutive quarters while volume held. Nobody could say which products were losing money.',
    outcome: [
      { value: '18.4%', label: 'Gross margin, up from 11.9%' },
      { value: '$31M', label: 'Working capital released' },
    ],
    duration: '14 weeks',
  },
  {
    sector: 'Healthcare services',
    client: 'A regional network of 22 outpatient clinics',
    challenge:
      'Two acquisitions had left three scheduling systems, four contracts with the same payer, and a nine-day booking lag.',
    outcome: [
      { value: '2.6 days', label: 'Average booking lag, from 9.1' },
      { value: '$14.7M', label: 'Annual run-rate saving' },
    ],
    duration: '16 weeks',
  },
  {
    sector: 'Financial services',
    client: 'A mid-market lender preparing for supervisory review',
    challenge:
      'An incoming capital rule touched 61 controls, and the internal gap assessment had been open for eleven months.',
    outcome: [
      { value: '61 of 61', label: 'Controls evidenced at first submission' },
      { value: '0', label: 'Supervisory follow-up requests' },
    ],
    duration: '20 weeks',
  },
  {
    sector: 'Consumer goods',
    client: 'A branded food producer entering two new markets',
    challenge:
      'The board had funded a launch plan built on distributor forecasts that had never been tested against shelf data.',
    outcome: [
      { value: '$46M', label: 'Avoided spend on the weaker market' },
      { value: '11 months', label: 'Time to positive contribution' },
    ],
    duration: '9 weeks',
  },
];

/** The engagement model, drawn on the numbered rail. */
export const PINNACLE_PROCESS: PinnaclePhase[] = [
  {
    step: '01',
    title: 'Frame',
    body: 'A partner spends four days with the executive team and the data, and writes down the question the engagement will answer. If the question is already answered, we say so and stop here.',
    duration: 'Week 1',
    deliverable: 'A one-page engagement charter, signed by both sides',
  },
  {
    step: '02',
    title: 'Size',
    body: 'We quantify the opportunity from primary data before we design anything, so the executive team can decide whether the prize justifies the programme. Findings are shared as they emerge.',
    duration: 'Weeks 2–4',
    deliverable: 'A sized opportunity map with the model attached',
  },
  {
    step: '03',
    title: 'Design',
    body: 'The plan is built with the managers who will run it, in working sessions rather than in a room down the hall. Every action carries a named owner, a date and a number it is expected to move.',
    duration: 'Weeks 5–11',
    deliverable: 'An implementation plan owned by line management',
  },
  {
    step: '04',
    title: 'Hand over',
    body: 'We run the first two operating reviews with your team and then watch them run the next four. Ninety days of partner access is included, and no invoice follows it.',
    duration: 'Weeks 12–24',
    deliverable: 'A running operating rhythm and ninety days of support',
  },
];

/**
 * The results dashboard. Percentages are of the bar's full width, chosen so the
 * visual jump matches the stated change rather than exaggerating it.
 */
export const PINNACLE_METRICS: PinnacleMetric[] = [
  { label: 'Gross margin, industrial client', before: 38, after: 74, delta: '+6.5 points' },
  { label: 'Order-to-cash days, logistics client', before: 82, after: 41, delta: '−50%' },
  { label: 'Clinic booking lag, healthcare client', before: 91, after: 26, delta: '−71%' },
  { label: 'Platform run cost, software client', before: 66, after: 38, delta: '−42%' },
  { label: 'Forecast accuracy, consumer client', before: 44, after: 88, delta: '+44 points' },
];

/** The insights page. Dates are display copy, already written out. */
export const PINNACLE_INSIGHTS: PinnacleInsight[] = [
  {
    title: 'The cost programme that survives its second year',
    standfirst:
      'Most cost programmes deliver in year one and give it back in year two. The difference is almost never the analysis; it is whether the operating review that policed the plan outlived the consultants.',
    category: 'Operating Performance',
    author: 'Rafael Duarte',
    date: '4 June 2026',
    readTime: '7 min read',
  },
  {
    title: 'Synergy cases fail on the revenue line, not the cost line',
    standfirst:
      'Across 40 integrations we reviewed, cost synergies landed within 8 percent of the case. Revenue synergies landed at 34 percent of it. Here is what the eight successful cases did differently at diligence.',
    category: 'Transaction Advisory',
    author: 'Marta Lindqvist',
    date: '21 May 2026',
    readTime: '9 min read',
  },
  {
    title: 'Stop buying platforms to fix an accountability problem',
    standfirst:
      'When a decision stalls at three levels, a new system moves the stall rather than removing it. A short test for telling a technology problem from an organisation one before the procurement starts.',
    category: 'Technology & Data',
    author: 'Tobias Renner',
    date: '7 May 2026',
    readTime: '6 min read',
  },
  {
    title: 'What a supervisor is actually reading in your evidence pack',
    standfirst:
      'Regulators rarely reject a remediation plan on substance. They send it back because the evidence cannot be traced to a control owner. Three structural fixes that removed follow-up requests entirely.',
    category: 'Risk & Regulation',
    author: 'Callum Reyes',
    date: '23 April 2026',
    readTime: '5 min read',
  },
  {
    title: 'The portfolio review nobody wants to run',
    standfirst:
      'Every executive team can name the business unit that should be closed. Very few close it. On the three arguments that keep a loss-making unit alive, and how to answer each with a number.',
    category: 'Corporate Strategy',
    author: 'Adaeze Okonjo',
    date: '9 April 2026',
    readTime: '8 min read',
  },
  {
    title: 'Spans and layers are a symptom, not the diagnosis',
    standfirst:
      'Cutting a layer from an organisation that has not agreed who decides what simply produces a flatter version of the same delay. Start from the decision map, and the structure follows from it.',
    category: 'Organisation Design',
    author: 'Priyanka Menon',
    date: '26 March 2026',
    readTime: '6 min read',
  },
];

/** The partners. Monogram discs stand in for photography. */
export const PINNACLE_PARTNERS: PinnaclePartner[] = [
  {
    initials: 'AO',
    name: 'Adaeze Okonjo',
    role: 'Managing Partner · Corporate Strategy',
    focus:
      'Leads the firm and its strategy practice. Seventeen years advising boards on portfolio and market-entry decisions, with particular depth in family-held industrial groups moving to professional management.',
    sectors: ['Industrial', 'Consumer goods', 'Private equity'],
  },
  {
    initials: 'RD',
    name: 'Rafael Duarte',
    role: 'Partner · Operating Performance',
    focus:
      'Runs cost-to-serve and throughput programmes across multi-site operations. Previously plant director for a components manufacturer, which is why his plans are written for line managers.',
    sectors: ['Manufacturing', 'Logistics', 'Energy'],
  },
  {
    initials: 'ML',
    name: 'Marta Lindqvist',
    role: 'Partner · Transaction Advisory',
    focus:
      'Commercial diligence and integration for acquirers and their lenders. Has led diligence on 63 transactions and been retained post-close on 21 of them.',
    sectors: ['Private equity', 'Healthcare', 'Software'],
  },
  {
    initials: 'TR',
    name: 'Tobias Renner',
    role: 'Partner · Technology & Data',
    focus:
      'Platform economics, data architecture and automation cases. Assesses estates on run cost and payback, and has advised against migration on roughly a third of the engagements he has scoped.',
    sectors: ['Software', 'Financial services', 'Retail'],
  },
  {
    initials: 'PM',
    name: 'Priyanka Menon',
    role: 'Partner · Organisation Design',
    focus:
      'Operating models after mergers, spin-offs and leadership change. Starts from the decisions an organisation has to make and works back to the structure that lets it make them.',
    sectors: ['Healthcare', 'Industrial', 'Public sector'],
  },
  {
    initials: 'CR',
    name: 'Callum Reyes',
    role: 'Partner · Risk & Regulation',
    focus:
      'Regulatory change programmes for lenders, insurers and clinical networks. Formerly a supervisor at a national financial regulator, which shapes how his evidence packs are built.',
    sectors: ['Financial services', 'Insurance', 'Healthcare'],
  },
];

/** Offices, addressed as correspondence would be. */
export const PINNACLE_OFFICES: PinnacleOffice[] = [
  {
    city: 'Chicago',
    lines: ['212 North Wacker Drive', 'Suite 2400', 'Chicago, IL 60606'],
    phone: '+1 (312) 555-0164',
    hours: 'Monday to Friday, 8:00 to 18:30 CT',
  },
  {
    city: 'Toronto',
    lines: ['The Corvel Building', '85 Wellington Street West, 14th Floor', 'Toronto, ON M5J 1L2'],
    phone: '+1 (416) 555-0138',
    hours: 'Monday to Friday, 8:30 to 18:00 ET',
  },
  {
    city: 'London',
    lines: ['Fenmore House', '18 Threadneedle Walk', 'London EC2R 8HP'],
    phone: '+44 20 7946 0117',
    hours: 'Monday to Friday, 8:30 to 18:00 GMT',
  },
];

/**
 * Standing labels the multipage chrome needs. They are user-facing strings, so
 * they belong here rather than inline in a component - even the short ones.
 */
export const PINNACLE_LABELS = {
  home: 'Home',
  headerCta: 'Start a conversation',
  skipToContent: 'Skip to content',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',

  clientsLabel: 'Selected clients',

  figureCaption: 'Engagement dashboard, week 12',
  figureLegendBefore: 'At start',
  figureLegendAfter: 'At handover',

  processEyebrow: 'How an engagement runs',
  processTitle: 'Four phases, and a decision point at the end of each',
  processSubtitle:
    'The same shape every time, so an executive team always knows what happens next, what it costs and what they are holding at the end of it.',
  processDeliverable: 'You receive',

  resultsEyebrow: 'Results',
  resultsTitle: 'Measured at handover, not at the readout',
  resultsSubtitle:
    'Five figures from recent engagements, each taken from the client system rather than from our own model.',

  casesEyebrow: 'Selected engagements',
  casesTitle: 'What the work produced',
  casesSubtitle:
    'Clients are described rather than named, because most of this work sits under a confidentiality agreement. Figures are taken from the client ledger at handover.',
  casesChallenge: 'The situation',
  casesDuration: 'Engagement length',

  practiceDeliverables: 'What you receive',
  practiceDuration: 'Typical length',
  practiceLead: 'Practice lead',

  insightsReadMore: 'Read the piece',
  insightsBy: 'By',

  teamSectors: 'Sectors carried',

  officesEyebrow: 'Offices',
  officesTitle: 'Where to find us',
  hoursLabel: 'Hours',
  telephoneLabel: 'Telephone',

  formNotice:
    'This form is not monitored for urgent matters. Please do not send commercially sensitive information before an engagement letter is in place.',
  formSuccess: 'Received. A partner will reply within one business day.',
  formSent: 'Enquiry sent',

  servicesMore: 'See all six practices',
  ctaEyebrow: 'Next step',
  ctaTitle: 'One conversation is usually enough to know',
  ctaBody:
    'Forty-five minutes with a partner, no charge and no proposal attached. If we are not the right firm we will say so and suggest who is.',
  ctaAction: 'Book the conversation',
} as const;

/** The prompt a visitor copies to generate a site in this spirit. */
export const PINNACLE_PROMPT = `Design a five-page website for a management and strategy consultancy called Pinnacle (Pinnacle Advisory Group), founded in Chicago in 2009. Pages: Home, Expertise, Insights, Team, Contact.

Art direction:
- Corporate but striking. Warm sand #f3f0ee is the reading surface, near-black ink #141413 is the type and the one deep inverted band, and a single confident brand blue #2563eb carries eyebrows, rules, counters and the primary button. Nothing else is coloured.
- Type does the work: display headings at clamp(2.6rem, 8vw, 120px) with a light-but-solid weight of 450 to 550, tight leading near 0.98 and a measure capped in ch so it re-wraps rather than stretching. Body copy stays at 16px with generous 1.6 leading.
- Very generous geometry: section padding around 96 to 128px, panels at 40 to 65px radius, buttons fully pill-shaped, and wide gutters that let single columns breathe.
- One deep inverted section only - a near-black results band roughly two thirds down the home page - so the inversion reads as emphasis rather than as a theme.
- No photography anywhere. The signature visuals are all CSS: an editorial figure built from layered gradient panels, a numbered process rail with a connecting line that runs through it, a results dashboard drawn as paired before/after bars from plain divs, and partner portraits as monogram discs.

Structure: a shared sticky header with a wordmark, query-string page links and a pill call to action, plus a shared footer with three link columns over an ink band. Home carries the display hero with three counters, a client logo marquee, an editorial about block, a six-card practice grid, the numbered process rail, the inverted results dashboard, a reasons grid and an FAQ accordion. Expertise lists each practice at length with deliverables, engagement length and the partner who leads it, then selected engagements with measurable outcomes. Insights is a dated article list with author and read time. Team is monogram discs with roles and the sectors each partner carries. Contact is three offices beside an enquiry form.

Motion: everything eases on cubic-bezier(0.16, 1, 0.3, 1). Staggered reveals that fade and rise 20px, counters that run once on entry, a slow marquee, dashboard bars that grow from zero, and cards that lift 4px on hover. All of it removed under prefers-reduced-motion.

Voice: precise, unhurried, commercial. Named sectors, real engagement lengths, outcomes stated as percentages and currency. No exclamation marks and no marketing adjectives.`;
