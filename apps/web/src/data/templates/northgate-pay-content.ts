import {
  Banknote,
  CreditCard,
  Gauge,
  Globe,
  Layers,
  Lock,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Zap,
} from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * NORTHGATE - content for the payments infrastructure template.
 *
 * English, untranslated, and part of the artifact: a visitor downloads this
 * file and rewrites it into their own company (see `types.ts`). Sections read
 * from here and hold no copy of their own, so the product's voice lives in
 * exactly one file.
 *
 * NORTHGATE is a MULTIPAGE template - five pages rather than one scroll,
 * because the audiences are different people: a finance lead reads pricing, an
 * engineer reads the API surface, and neither wants the other's page.
 * `TemplateContent` covers the shared chrome and the home page; the extra
 * exports below carry the copy the dedicated pages need, each with a local
 * interface so the shared template contract stays untouched.
 *
 * IMPORTANT, and deliberate: this markets a payments company, it does not take
 * payments. Nothing here is a card field, a bank number, or anything that could
 * be mistaken for one - the card visual is a shape, and the calculator is
 * arithmetic on a volume figure the visitor types.
 */

/** The pages NORTHGATE ships. `home` renders when no page is asked for. */
export const NORTHGATE_PAGES = ['home', 'products', 'developers', 'pricing', 'contact'] as const;
export type NorthgatePageId = (typeof NORTHGATE_PAGES)[number];

/** The masthead each dedicated page opens with, in place of the home hero. */
export interface NorthgatePageHead {
  eyebrow: string;
  title: string;
  titleAccent: string;
  intro: string;
  /** Three figures set in mono under the masthead - the page's own proof. */
  figures: { value: string; label: string }[];
}

/** One product, told at the depth an evaluating team actually needs. */
export interface NorthgateProduct {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  capabilities: string[];
  /** Hard numbers, set in mono beside the prose. */
  spec: { label: string; value: string }[];
}

/** One node of the payment-flow diagram. Drawn from divs, never an image. */
export interface NorthgateFlowStep {
  id: string;
  title: string;
  detail: string;
  /** The latency this hop adds, set in mono in the corner of the node. */
  timing: string;
}

/** One stop on the settlement timeline. */
export interface NorthgateSettlementStop {
  time: string;
  title: string;
  detail: string;
}

/** A documented endpoint. Method and path are plain strings, never parsed. */
export interface NorthgateEndpoint {
  method: string;
  path: string;
  summary: string;
}

/**
 * A request/response pair for the fake console.
 *
 * Both bodies are plain strings printed inside a `<pre>`: no highlighter, no
 * parser, no dependency. The design gets its texture from the mono face and the
 * gutter, which is enough, and it means the panel cannot break on bad input.
 */
export interface NorthgateSnippet {
  id: string;
  title: string;
  method: string;
  path: string;
  request: string;
  response: string;
}

/** A client library, listed with the command that installs it. */
export interface NorthgateLibrary {
  language: string;
  install: string;
  version: string;
}

/**
 * A pricing tier.
 *
 * `rate` is a percentage and `fixed` is in pence, because that is how card
 * pricing is actually quoted and because the calculator does real arithmetic
 * with both. Keeping them as numbers rather than a pre-formatted string is what
 * makes the calculator honest.
 */
export interface NorthgateTier {
  id: string;
  name: string;
  blurb: string;
  rate: number;
  fixed: number;
  monthly: number;
  volumeNote: string;
  features: string[];
  cta: string;
  /** The middle tier is the one most merchants land on, so it is emphasised. */
  featured: boolean;
}

/** A compliance or scheme credential. `code` is the short form used as a mark. */
export interface NorthgateBadge {
  code: string;
  name: string;
  detail: string;
}

/** An office, addressed as correspondence would be. */
export interface NorthgateOffice {
  city: string;
  lines: string[];
  phone: string;
  hours: string;
}

export const NORTHGATE_CONTENT: TemplateContent = {
  brand: 'Northgate',

  // Query hrefs, not anchors: the header drives the page switch inside the
  // template itself, so the preview route needs no router to navigate.
  nav: [
    { href: '?page=products', label: 'Products' },
    { href: '?page=developers', label: 'Developers' },
    { href: '?page=pricing', label: 'Pricing' },
    { href: '?page=contact', label: 'Contact' },
  ],

  hero: {
    badge: 'Acquiring · Payouts · Terminals · Risk',
    title: 'Payments infrastructure',
    titleAccent: 'for companies that read the logs',
    subtitle:
      'Northgate is a licensed acquirer and payments platform. One API for card acceptance, one for payouts, and a settlement file you can reconcile without a support ticket. Built in Leeds, operating across 38 settlement currencies.',
    ctaPrimary: 'Read the API reference',
    ctaSecondary: 'See pricing',
    stats: [
      { value: 214, suffix: 'ms', label: 'Median authorisation latency' },
      { value: 38, suffix: '', label: 'Settlement currencies' },
      { value: 92, suffix: '%', label: 'First-attempt approval rate' },
    ],
  },

  marquee: [
    'Halden Grocers',
    'Ferrolane Logistics',
    'Aster & Vale',
    'Northbank Rail',
    'Kestrel Fitness Group',
    'Copperline Coffee',
    'Studio Voxel',
    'Wrenfield Pharmacy',
    'Marlow Interiors',
  ],

  about: {
    eyebrow: 'The company',
    title: 'Started by the engineer who kept getting paged at 03:00',
    body: [
      'Northgate was founded in 2016 by Marek Bielawski, who had spent six years on the payments team at a UK marketplace and had run out of patience with gateways that returned a generic decline and no reason code. The first version of the platform was a reconciliation tool he wrote so his own finance team would stop emailing him about missing settlements.',
      'The company now holds an FCA authorisation as a payment institution, connects directly to Visa and Mastercard, and processes for roughly 4,100 merchants across the UK and the EEA. Ninety-one people, of whom fifty-two are engineers, and an on-call rota that still includes the founder.',
    ],
    points: [
      'Every decline returns a scheme reason code and a plain-English cause',
      'Direct scheme connections, so there is no gateway between you and the network',
      'Settlement files published at 07:00 local, on the same schema since 2018',
      'Status page and incident history public since the first outage in 2017',
    ],
  },

  services: {
    eyebrow: 'Platform',
    title: 'Six surfaces, one ledger',
    subtitle:
      'Everything below writes to the same ledger and appears in the same settlement file. Adding a product does not add a reconciliation problem.',
    items: [
      {
        icon: CreditCard,
        title: 'Payments API',
        body: 'Card acceptance across Visa, Mastercard, Amex and the major wallets, with 3-D Secure 2.2 exemption handling and network tokens issued at first authorisation.',
      },
      {
        icon: Banknote,
        title: 'Payouts',
        body: 'Faster Payments and SEPA Instant disbursements from a funded balance, with idempotent submission and a webhook on every state change.',
      },
      {
        icon: Smartphone,
        title: 'Terminals',
        body: 'Countertop and portable readers on the same account as your online volume, provisioned over the air and reconciled into one settlement file.',
      },
      {
        icon: ShieldCheck,
        title: 'Risk and fraud',
        body: 'Rules and a scoring model trained on your own approval history, with every decision returned in the authorisation response rather than in a nightly report.',
      },
      {
        icon: Layers,
        title: 'Platforms',
        body: 'Sub-merchant onboarding, split settlement and per-seller payout schedules for marketplaces operating under your own licence or ours.',
      },
      {
        icon: RefreshCcw,
        title: 'Reconciliation',
        body: 'A settlement file keyed on your own reference, with interchange, scheme fees and our margin itemised per transaction rather than pooled.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Northgate',
    title: 'What an engineering team notices in the first fortnight',
    subtitle:
      'Four things we hold ourselves to, published rather than promised, and measured on the status page.',
    items: [
      {
        icon: Gauge,
        title: '99.995% authorisation uptime',
        body: 'Measured across the last twelve rolling months on the authorisation path, excluding nothing. The figure and the incident history are on the status page.',
      },
      {
        icon: Zap,
        title: '214ms median, 480ms at p99',
        body: 'Round trip from request received to response written, measured at our edge in London and Frankfurt, published weekly rather than quoted from a good day.',
      },
      {
        icon: Lock,
        title: 'PCI DSS 4.0 Level 1 and PSD2 SCA',
        body: 'Assessed annually by a QSA. Hosted fields keep card data out of your systems entirely, so your scope is a SAQ A rather than an audit.',
      },
      {
        icon: Globe,
        title: 'Settlement in 38 currencies',
        body: 'Settle in the currency you sell in or convert at a published mid-market rate plus 35 basis points. No spread hidden inside the settlement figure.',
      },
    ],
  },

  faq: {
    eyebrow: 'Common questions',
    title: 'What teams ask before they integrate',
    items: [
      {
        question: 'How quickly do funds settle?',
        answer:
          'Card volume settles on T+1 by default, cut off at 22:00 UK time, with funds in the nominated account by 07:00 the following working day. T+0 settlement is available on the Scale tier for merchants trading above one million pounds a month. Payouts over Faster Payments clear in seconds and SEPA Instant within ten seconds.',
      },
      {
        question: 'Is there a contract or a minimum term?',
        answer:
          'No minimum term on Standard or Scale, and thirty days notice either way. Interchange Plus is a twelve-month agreement because it is priced against your own volume mix. We do not use early termination fees.',
      },
      {
        question: 'Can we migrate our existing card credentials?',
        answer:
          'Yes. We run a PCI-compliant bulk import with your current provider, and your stored credentials arrive as network tokens on our side. A migration of two million credentials typically takes nine working days end to end, most of which is waiting on the incumbent.',
      },
      {
        question: 'What happens during an incident?',
        answer:
          'The status page updates within four minutes of detection, with an owner named. Authorisation traffic fails over between our London and Frankfurt regions automatically. A written post-incident review is published within five working days, including the timeline and the remediation.',
      },
      {
        question: 'Do you support marketplaces and platforms?',
        answer:
          'Yes. You can onboard sub-merchants under our licence with KYB handled by our onboarding API, or operate under your own permission and use us purely for acquiring. Split settlement is computed at authorisation, so the seller ledger is correct before the money moves.',
      },
      {
        question: 'How is support structured?',
        answer:
          'Every account has a named implementation engineer for the first ninety days. After that, technical support is answered by engineers on rota, with a fifteen-minute response target on production-impacting issues for Scale and Interchange Plus.',
      },
    ],
  },

  contact: {
    eyebrow: 'Talk to us',
    title: 'Speak with a solutions engineer',
    subtitle:
      'Describe your volume, your mix and what you are running today, and you will get a written answer within one working day from an engineer rather than a form response. Do not include card, account or customer data in this message.',
    fields: {
      name: 'Full name',
      email: 'Work email',
      message: 'What are you building',
    },
    submit: 'Request a call',
    details: [
      { label: 'Sales', value: 'sales@northgatepay.example' },
      { label: 'Technical support', value: 'support@northgatepay.example' },
      { label: 'Telephone', value: '+44 113 496 0182' },
      { label: 'Registered office', value: 'Northgate Payments Ltd, 8 Wellington Quay, Leeds LS1 4AP' },
    ],
  },

  footer: {
    tagline:
      'Northgate Payments Ltd. Acquiring, payouts and terminals on one ledger. Authorised by the Financial Conduct Authority as a payment institution, reference 794412.',
    columns: [
      {
        title: 'Products',
        links: ['Payments API', 'Payouts', 'Terminals', 'Risk and fraud', 'Platforms'],
      },
      {
        title: 'Developers',
        links: ['API reference', 'Client libraries', 'Webhooks', 'Sandbox', 'Status page'],
      },
      {
        title: 'Company',
        links: ['Pricing', 'Compliance', 'Security', 'Careers', 'Contact'],
      },
    ],
    legal:
      '© 2026 Northgate Payments Ltd. Registered in England and Wales, company number 10442817. Authorised by the Financial Conduct Authority under the Payment Services Regulations 2017, reference 794412.',
  },
};

/** Mastheads for the four dedicated pages, keyed by page id. */
export const NORTHGATE_PAGE_HEADS: Record<Exclude<NorthgatePageId, 'home'>, NorthgatePageHead> = {
  products: {
    eyebrow: 'Products',
    title: 'Four surfaces,',
    titleAccent: 'one settlement file',
    intro:
      'Acceptance, disbursement, in-person and risk are separate products with separate APIs, but they share a balance, a ledger and a reconciliation format. You can adopt them one at a time without a second integration.',
    figures: [
      { value: '38', label: 'Settlement currencies' },
      { value: '4,100', label: 'Merchants live' },
      { value: 'T+1', label: 'Default settlement' },
    ],
  },
  developers: {
    eyebrow: 'Developers',
    title: 'A REST API',
    titleAccent: 'that behaves like one',
    intro:
      'Predictable resources, idempotency keys on every write, signed webhooks with replay, and a sandbox that returns the same error codes as production. The reference below is the whole surface, not a selection.',
    figures: [
      { value: '214ms', label: 'Median authorisation' },
      { value: '99.995%', label: 'Rolling 12-month uptime' },
      { value: '2016-11-04', label: 'API version in force' },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Published rates,',
    titleAccent: 'itemised statements',
    intro:
      'Three ways to pay, all quoted as a percentage plus a fixed fee per transaction. Interchange and scheme fees appear as separate lines on your statement, so you can see what is ours and what is the network.',
    figures: [
      { value: '1.4% + 20p', label: 'UK consumer cards, Standard' },
      { value: '0.30%', label: 'Interchange Plus margin' },
      { value: '£0', label: 'Set-up and monthly, Standard' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Engineers answer',
    titleAccent: 'the technical questions',
    intro:
      'Sales enquiries are routed to a solutions engineer who has integrated the platform, not to a queue. Existing merchants should use the support address or the console, which reaches the on-call rota directly.',
    figures: [
      { value: '< 1 day', label: 'Sales response target' },
      { value: '15 min', label: 'Production issue response' },
      { value: '24/7', label: 'On-call coverage' },
    ],
  },
};

/** The products page - the four surfaces, told at depth. */
export const NORTHGATE_PRODUCTS: NorthgateProduct[] = [
  {
    id: 'payments',
    name: 'Payments',
    tagline: 'Card acceptance, direct to the schemes',
    summary:
      'A single authorisation endpoint for cards, wallets and open banking, with 3-D Secure 2.2 handled for you and exemptions applied where the risk score supports them. Card data is captured by hosted fields we serve, so it never touches your infrastructure and your PCI scope stays at SAQ A.',
    capabilities: [
      'Visa, Mastercard, American Express, Discover and JCB on direct connections',
      'Apple Pay, Google Pay and Click to Pay with no additional integration',
      'Network tokens issued at first authorisation and refreshed automatically',
      '3-D Secure 2.2 with TRA and low-value exemption logic applied per transaction',
      'Partial captures, incremental authorisations and multi-capture for delayed fulfilment',
      'Account updater on stored credentials, run nightly against the schemes',
    ],
    spec: [
      { label: 'Median authorisation', value: '214ms' },
      { label: 'p99 authorisation', value: '480ms' },
      { label: 'Approval rate, UK consumer', value: '92.4%' },
      { label: 'Default settlement', value: 'T+1 by 07:00' },
    ],
  },
  {
    id: 'payouts',
    name: 'Payouts',
    tagline: 'Money out, on the same balance',
    summary:
      'Disburse to sellers, contractors or customers from the balance your acceptance volume funds. Submissions are idempotent, every state change raises a signed webhook, and a returned payment reconciles against the original reference rather than arriving as an unexplained credit.',
    capabilities: [
      'Faster Payments to UK accounts, cleared in seconds, 24 hours a day',
      'SEPA Instant to EEA accounts, cleared within ten seconds',
      'Batch submission of up to 50,000 instructions in a single request',
      'Confirmation of Payee checked before submission, with the match result returned',
      'Scheduled and on-demand payout runs per seller, with per-seller holdbacks',
      'Returns and recalls matched to the original instruction reference',
    ],
    spec: [
      { label: 'Faster Payments clearing', value: '< 10s' },
      { label: 'SEPA Instant clearing', value: '< 10s' },
      { label: 'Batch ceiling', value: '50,000' },
      { label: 'Payout fee', value: '20p per instruction' },
    ],
  },
  {
    id: 'terminals',
    name: 'Terminals',
    tagline: 'In-person volume on the same account',
    summary:
      'Countertop and portable readers that authorise against the same API as your online traffic and settle into the same file. Devices are provisioned over the air from the console, and a reader that loses connectivity queues offline authorisations within a limit you set.',
    capabilities: [
      'Contactless, chip and PIN, Apple Pay and Google Pay on every device',
      'Over-the-air provisioning and configuration from the console, no engineer visit',
      'Offline authorisation with a per-device floor limit you control',
      'Tipping, surcharge and receipt configuration per location',
      'Semi-integrated mode, so the till never enters PCI scope',
      'Same-day device replacement across mainland UK',
    ],
    spec: [
      { label: 'Devices supported', value: 'NG-210, NG-410, NG-620' },
      { label: 'Connectivity', value: 'Wi-Fi, 4G, Bluetooth' },
      { label: 'In-person rate', value: '1.2% + 8p' },
      { label: 'Battery, portable', value: '14 hours' },
    ],
  },
  {
    id: 'fraud',
    name: 'Risk and fraud',
    tagline: 'A decision, with the reason attached',
    summary:
      'Every authorisation is scored before it reaches the network, using rules you write and a model trained on your own approval and chargeback history. The score, the contributing signals and the rule that fired all come back in the authorisation response, so a decline is explainable at the moment it happens.',
    capabilities: [
      'Rules written against any field on the request, versioned and testable in sandbox',
      'A model retrained weekly on your own outcomes, never a shared global score',
      'Device fingerprinting and velocity checks across your whole account',
      'Chargeback representment assembled automatically from the transaction record',
      'Blocklists and allowlists at card, device, email and address level',
      'Scheme fraud ratios monitored continuously against VAMP and Mastercard ECP thresholds',
    ],
    spec: [
      { label: 'Scoring latency', value: '11ms' },
      { label: 'Fraud rate, portfolio', value: '0.041%' },
      { label: 'Chargeback rate', value: '0.28%' },
      { label: 'Representment win rate', value: '61%' },
    ],
  },
];

/**
 * The payment-flow diagram, on the home page.
 *
 * Five nodes rather than the true dozen: this is the version an engineer draws
 * on a whiteboard, and a diagram that is honest about being a simplification is
 * more use than one that is exhaustive and unreadable.
 */
export const NORTHGATE_FLOW: NorthgateFlowStep[] = [
  {
    id: 'checkout',
    title: 'Your checkout',
    detail: 'Hosted fields collect the credential in an iframe we serve and return a token.',
    timing: '0ms',
  },
  {
    id: 'edge',
    title: 'Northgate edge',
    detail: 'London or Frankfurt, whichever answers first. Request signed and idempotency checked.',
    timing: '+9ms',
  },
  {
    id: 'risk',
    title: 'Risk engine',
    detail: 'Rules and model scored together, with the exemption decision made here.',
    timing: '+11ms',
  },
  {
    id: 'scheme',
    title: 'Card scheme',
    detail: 'Direct connection to Visa or Mastercard, no intermediate gateway.',
    timing: '+168ms',
  },
  {
    id: 'issuer',
    title: 'Issuer',
    detail: 'Authorisation returned with the scheme reason code preserved verbatim.',
    timing: '+26ms',
  },
];

/** The settlement timeline, on the products page. */
export const NORTHGATE_SETTLEMENT: NorthgateSettlementStop[] = [
  {
    time: '22:00',
    title: 'Cut-off',
    detail:
      'The processing day closes. Everything authorised and captured before this point settles in tonight’s file.',
  },
  {
    time: '23:40',
    title: 'Capture file submitted',
    detail:
      'Captures are batched and presented to the schemes. Interchange is calculated per transaction at this point, not estimated.',
  },
  {
    time: '05:15',
    title: 'Funding instruction issued',
    detail:
      'Net settlement is instructed to your nominated account, with refunds, chargebacks and fees already netted.',
  },
  {
    time: '07:00',
    title: 'Settlement file published',
    detail:
      'The file appears in the console and over SFTP, keyed on your own reference, with interchange, scheme fees and our margin itemised per line.',
  },
];

/** The developers page reference. Method and path are display strings only. */
export const NORTHGATE_ENDPOINTS: NorthgateEndpoint[] = [
  {
    method: 'POST',
    path: '/v1/payments',
    summary: 'Create and authorise a payment against a token or a stored credential.',
  },
  {
    method: 'POST',
    path: '/v1/payments/{id}/capture',
    summary: 'Capture all or part of a previously authorised payment.',
  },
  {
    method: 'POST',
    path: '/v1/payments/{id}/refund',
    summary: 'Refund a captured payment, in full or partially, against the original credential.',
  },
  {
    method: 'GET',
    path: '/v1/payments',
    summary: 'List payments, filtered by status, reference, date range or settlement batch.',
  },
  {
    method: 'POST',
    path: '/v1/payouts',
    summary: 'Submit a single payout or a batch of up to 50,000 instructions.',
  },
  {
    method: 'GET',
    path: '/v1/balances',
    summary: 'Read available and pending balances per currency, with the next funding date.',
  },
  {
    method: 'GET',
    path: '/v1/settlements/{id}/lines',
    summary: 'Read a settlement batch line by line, with interchange and fees itemised.',
  },
  {
    method: 'POST',
    path: '/v1/webhook_endpoints',
    summary: 'Register an endpoint and receive the signing secret used to verify deliveries.',
  },
];

/**
 * Console contents. Written as plain strings on purpose - see the interface
 * note above. Indentation is significant because it is what the reader sees.
 */
export const NORTHGATE_SNIPPETS: NorthgateSnippet[] = [
  {
    id: 'payment',
    title: 'Authorise a payment',
    method: 'POST',
    path: '/v1/payments',
    request: `curl https://api.northgatepay.example/v1/payments \\
  -H "Authorization: Bearer ngp_live_9f2c..." \\
  -H "Idempotency-Key: ord_88213-a" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 4250,
    "currency": "GBP",
    "token": "tok_2Rf8Xq4mVn",
    "reference": "ORD-88213",
    "capture": true
  }'`,
    response: `HTTP/1.1 201 Created
x-northgate-request-id: req_7Kd0Wm

{
  "id": "pay_3QhLm2Vx",
  "status": "captured",
  "amount": 4250,
  "currency": "GBP",
  "reference": "ORD-88213",
  "network": "visa",
  "scheme_response": "00",
  "risk": { "score": 7, "decision": "accept" },
  "exemption": "transaction_risk_analysis",
  "settlement": { "batch": "stl_2026_02_11", "date": "2026-02-12" },
  "fees": { "total": 80, "interchange": 43, "scheme": 7, "northgate": 30 },
  "latency_ms": 198
}`,
  },
  {
    id: 'payout',
    title: 'Send a payout',
    method: 'POST',
    path: '/v1/payouts',
    request: `curl https://api.northgatepay.example/v1/payouts \\
  -H "Authorization: Bearer ngp_live_9f2c..." \\
  -H "Idempotency-Key: run_2026_02_11-seller_412" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 128400,
    "currency": "GBP",
    "destination": "acct_5Yb1Rk",
    "rail": "faster_payments",
    "reference": "PAYOUT-412-FEB"
  }'`,
    response: `HTTP/1.1 202 Accepted
x-northgate-request-id: req_0Pz4Nb

{
  "id": "po_8Vn4Tc",
  "status": "submitted",
  "amount": 128400,
  "currency": "GBP",
  "rail": "faster_payments",
  "cop_result": "full_match",
  "expected_arrival": "2026-02-11T14:22:09Z",
  "reference": "PAYOUT-412-FEB",
  "fee": 20
}`,
  },
];

/** Client libraries, listed with the command that installs them. */
export const NORTHGATE_LIBRARIES: NorthgateLibrary[] = [
  { language: 'Node.js', install: 'npm install @northgate/node', version: '6.4.2' },
  { language: 'Python', install: 'pip install northgate', version: '5.1.0' },
  { language: 'Ruby', install: 'gem install northgate', version: '4.9.3' },
  { language: 'Go', install: 'go get northgatepay.example/go/v3', version: '3.7.1' },
  { language: 'PHP', install: 'composer require northgate/northgate-php', version: '4.2.6' },
  { language: 'Java', install: 'implementation "example.northgatepay:sdk:2.8.4"', version: '2.8.4' },
];

/**
 * The three published rates.
 *
 * Numbers, not strings, because the calculator multiplies them - see the
 * interface note. `monthly` is in pounds and `fixed` in pence, which is how the
 * arithmetic is done and how the statement reads.
 */
export const NORTHGATE_TIERS: NorthgateTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    blurb:
      'Blended pricing with nothing to negotiate. Suits companies processing under one million pounds a month who want the rate on the website to be the rate on the statement.',
    rate: 1.4,
    fixed: 20,
    monthly: 0,
    volumeNote: 'Up to £1m per month',
    features: [
      'All products, no feature gating',
      'T+1 settlement by 07:00',
      'Hosted fields and network tokens',
      'Risk rules and model scoring',
      'Email support, one working day',
    ],
    cta: 'Start integrating',
    featured: false,
  },
  {
    id: 'scale',
    name: 'Scale',
    blurb:
      'A lower blended rate and a faster settlement cycle, for companies whose volume is predictable enough to commit to. Most merchants above a million a month land here.',
    rate: 1.1,
    fixed: 15,
    monthly: 249,
    volumeNote: '£1m to £15m per month',
    features: [
      'Everything in Standard',
      'T+0 settlement available',
      'Named implementation engineer',
      'Fifteen-minute production response',
      'Custom risk models on your own outcomes',
      'Quarterly interchange optimisation review',
    ],
    cta: 'Talk to sales',
    featured: true,
  },
  {
    id: 'interchange',
    name: 'Interchange Plus',
    blurb:
      'Interchange and scheme fees passed through at cost with a fixed Northgate margin on top. Priced against your own mix, so it wins on debit-heavy volume and on card-present.',
    rate: 0.3,
    fixed: 9,
    monthly: 950,
    volumeNote: 'Above £15m per month',
    features: [
      'Everything in Scale',
      'Interchange and scheme fees at cost',
      'Dedicated settlement schema and SFTP drop',
      'Direct scheme reporting access',
      'Contractual uptime and latency commitments',
      'Twelve-month agreement',
    ],
    cta: 'Request a quote',
    featured: false,
  },
];

/** Compliance and scheme credentials, shown as a ruled strip. */
export const NORTHGATE_COMPLIANCE: NorthgateBadge[] = [
  {
    code: 'PCI',
    name: 'PCI DSS 4.0, Level 1',
    detail: 'Assessed annually by a Qualified Security Assessor. Attestation available on request.',
  },
  {
    code: 'FCA',
    name: 'FCA authorised payment institution',
    detail: 'Reference 794412. Merchant funds safeguarded in segregated accounts under the PSRs.',
  },
  {
    code: 'PSD2',
    name: 'PSD2 strong customer authentication',
    detail: '3-D Secure 2.2 with exemption handling applied per transaction, not per account.',
  },
  {
    code: 'ISO',
    name: 'ISO/IEC 27001:2022',
    detail: 'Certified information security management, scope covering the whole platform.',
  },
  {
    code: 'SOC',
    name: 'SOC 2 Type II',
    detail: 'Twelve-month observation window, report issued each March under NDA.',
  },
];

/** Offices, addressed as correspondence would be. */
export const NORTHGATE_OFFICES: NorthgateOffice[] = [
  {
    city: 'Leeds',
    lines: ['Northgate Payments Ltd', '8 Wellington Quay', 'Leeds LS1 4AP'],
    phone: '+44 113 496 0182',
    hours: 'Monday to Friday, 08:00 to 18:30 GMT',
  },
  {
    city: 'London',
    lines: ['Fourth Floor, Carden House', '19 Britton Street', 'London EC1M 5UA'],
    phone: '+44 20 7946 0311',
    hours: 'Monday to Friday, 08:30 to 18:30 GMT',
  },
  {
    city: 'Amsterdam',
    lines: ['Northgate Payments Europe B.V.', 'Keizersgracht 240', '1016 EZ Amsterdam'],
    phone: '+31 20 808 0164',
    hours: 'Monday to Friday, 09:00 to 18:00 CET',
  },
];

/**
 * Standing labels the multipage chrome needs. They are user-facing strings, so
 * they belong here rather than inline in a component - even the short ones.
 * The calculator's locale and currency live here too, because changing the
 * template's market should be a content edit, not a code edit.
 */
export const NORTHGATE_LABELS = {
  home: 'Home',
  headerCta: 'Talk to sales',
  skipToContent: 'Skip to content',

  marqueeLabel: 'Merchants processing on Northgate',

  flowEyebrow: 'Authorisation path',
  flowTitle: 'Where the 214 milliseconds go',
  flowSubtitle:
    'The whole round trip, drawn end to end. Every hop below is measured and published; the figures are medians from the last complete week.',
  flowTotalLabel: 'Median round trip',
  flowTotal: '214ms',

  consoleEyebrow: 'The API',
  consoleTitle: 'One endpoint, one response, no surprises',
  consoleSubtitle:
    'A payment is a single POST. The response carries the fee breakdown, the risk decision and the settlement batch, so nothing has to be looked up afterwards.',
  consoleRequest: 'Request',
  consoleResponse: 'Response',
  consoleCopy: 'Copy request',
  consoleCopied: 'Copied to clipboard',
  consoleCopyFailed: 'Copy unavailable in this browser',

  terminalEyebrow: 'In person',
  terminalTitle: 'The NG-410, and the volume behind it',
  terminalBody:
    'A portable reader with fourteen hours of battery, 4G and Wi-Fi, and semi-integrated mode so your till never enters PCI scope. It authorises against the same API as your website and lands in the same settlement file.',
  terminalCta: 'See the terminal range',
  terminalCardLabel: 'Illustrative device artwork. No card details are collected on this page.',
  /*
   * The strings printed on the decorative reader and card. The card "number" is
   * bullet glyphs on purpose: it must not read as a number, because the artwork
   * must never be mistakable for a payment form.
   */
  terminalDevice: 'NG-410',
  terminalAmount: '£42.50',
  terminalCardDigits: '•••• •••• •••• ••••',
  terminalCardName: 'Northgate',

  complianceEyebrow: 'Compliance',
  complianceTitle: 'Assessed, certified, and happy to show the paperwork',
  complianceSubtitle:
    'Every credential below is current and every report is available to a prospective merchant under NDA.',

  productsCapabilities: 'What it does',
  productsCta: 'Discuss this product',

  settlementEyebrow: 'Settlement',
  settlementTitle: 'One processing day, four fixed points',
  settlementSubtitle:
    'The same four timestamps every working day since 2018. The schema has not changed, so neither has your reconciliation job.',

  endpointsEyebrow: 'Reference',
  endpointsTitle: 'The whole surface',
  endpointsSubtitle:
    'Eight resources, versioned by date rather than by number, with the version pinned per API key. A new version never arrives without you asking for it.',
  endpointsMethod: 'Method',
  endpointsPath: 'Path',
  endpointsSummary: 'Description',

  librariesEyebrow: 'Client libraries',
  librariesTitle: 'Generated from the same specification',
  librariesSubtitle:
    'Each library is generated from the OpenAPI document that describes the API, then hand-reviewed. They release together, on the same day.',
  librariesVersion: 'Latest',

  webhooksEyebrow: 'Webhooks',
  webhooksTitle: 'Signed, ordered, replayable',
  webhooksSubtitle:
    'Deliveries are signed with a per-endpoint secret, retried on an exponential schedule for 72 hours, and replayable from the console for any window in the last 30 days.',
  webhookEvents: [
    'payment.authorised',
    'payment.captured',
    'payment.refunded',
    'payment.disputed',
    'payout.submitted',
    'payout.settled',
    'payout.returned',
    'settlement.published',
  ],

  calcEyebrow: 'Estimate',
  calcTitle: 'What the rate costs on your volume',
  calcSubtitle:
    'Arithmetic on the figures you enter, using the published rates. It estimates card processing fees only, and excludes chargeback and interchange variance.',
  calcVolumeLabel: 'Monthly card volume',
  calcAverageLabel: 'Average transaction value',
  calcTransactionsLabel: 'Transactions per month',
  calcFeeLabel: 'Estimated monthly fees',
  calcEffectiveLabel: 'Effective rate',
  calcMonthlyLabel: 'Platform fee',
  calcRateLabel: 'Rate',
  calcNote:
    'An estimate for comparison only, not a quote. Interchange Plus is shown with the Northgate margin applied to volume; interchange and scheme fees are passed through at cost and vary by card type.',
  calcLocale: 'en-GB',
  calcCurrency: 'GBP',

  pricingCompareEyebrow: 'Included everywhere',
  pricingCompareTitle: 'Not gated by tier',
  pricingIncluded: [
    'Every product and every API resource',
    'Hosted fields, network tokens and account updater',
    'Signed webhooks with 30-day replay',
    'Sandbox with production error parity',
    'Settlement files over console and SFTP',
    'Status page, incident history and post-incident reviews',
  ],
  pricingPerTransaction: 'per transaction',
  pricingPerMonth: 'per month',
  /* Units, kept here so re-pricing the template for another market is a content
     edit: the tier numbers are numbers, and these are how they are spoken. */
  pricingCurrencySymbol: '£',
  pricingRateUnit: '%',
  pricingFixedUnit: 'p',
  pricingNoMonthly: 'No monthly fee',
  pricingFeatured: 'Most merchants',

  officesEyebrow: 'Offices',
  officesTitle: 'Three places to find us',
  telephoneLabel: 'Telephone',
  hoursLabel: 'Hours',

  formNotice:
    'This form is for enquiries only. Do not send card numbers, bank account details or any customer data through it. Northgate never asks for card details by email or telephone.',
  formSuccess: 'Received. A solutions engineer will reply within one working day.',
  formSent: 'Enquiry sent',

  ctaEyebrow: 'Next step',
  ctaTitle: 'Read the reference, then send one request',
  ctaBody:
    'A sandbox key is issued in the console without a sales conversation, and it returns the same error codes production does. When you are ready to talk commercials, an engineer takes the call.',
  ctaPrimary: 'Open the API reference',
  ctaSecondary: 'Talk to sales',

  aboutFounder: 'Marek Bielawski, founder and principal engineer',
} as const;

/** The prompt a visitor copies to generate a site in this spirit. */
export const NORTHGATE_PROMPT = `Design a five-page website for a payments infrastructure and merchant services company called Northgate, a licensed UK acquirer founded in 2016 by an engineer. Pages: Home, Products, Developers, Pricing, Contact.

Art direction:
- Precise, technical and expensive. Near-white #fbfbfd as the page, deep indigo #10132b as the ink, and an electric indigo-to-cyan gradient (#4338ff to #12c9e8) used only for accents, rules and one or two display words. Dark inverted bands in near-black indigo for contrast between light sections.
- Oversized display type set in a tight-tracked grotesque, clamping up to roughly 110px on the hero, with a monospace face carrying every figure, code block, eyebrow and label.
- Large radii, 32px to 48px, on cards and panels. Hairline rules everywhere else. Subtle glass panels floating over soft gradient washes, never a drop shadow that reads as a card lifting off the page.
- No photography and no icon illustration. Every signature visual is CSS: a fake API request and response console in monospace with a copy button, a payment-flow diagram built from boxes and connecting lines that draw themselves left to right, a settlement timeline on a vertical rule, and a card terminal drawn entirely from gradients.
- Motion on cubic-bezier(0.16, 1, 0.3, 1): reveal on scroll, figures counting up once, a slow logo marquee, and the flow diagram's connectors drawing in sequence. Everything static under prefers-reduced-motion.

Structure: a shared header with query-string navigation and a shared footer with three link columns and an FCA authorisation line. Home carries the oversized hero with three counted figures, a merchant marquee, the platform grid, the flow diagram, the API console, the terminal visual and an FAQ accordion. Products describes acceptance, payouts, terminals and risk at length, each with a measured-figures panel, plus the settlement timeline. Developers is an API reference: endpoint table, two request and response pairs, client libraries and webhook events. Pricing carries three published tiers and a working calculator that does real arithmetic on a monthly volume the visitor types. Contact carries three offices and an enquiry form.

Voice: technical, specific, unhurried. Real latencies, real settlement times, interchange-style rates quoted as a percentage plus pence, PCI DSS and PSD2 compliance lines. No exclamation marks and no marketing adjectives.

Critical: this markets payment services, it does not process payments. Never build a card entry form. The card and terminal visuals are decorative only, with no inputs and no autocomplete attributes. The contact form is front-end only and must not ask for card or bank details.`;
