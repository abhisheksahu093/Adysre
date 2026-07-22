import {
  ArrowRightLeft,
  Banknote,
  BellRing,
  BookOpen,
  Building2,
  Cpu,
  Gauge,
  Globe,
  Landmark,
  Layers,
  LineChart,
  Lock,
  Percent,
  Repeat,
  ScrollText,
  ShieldCheck,
  Timer,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TemplateContent } from './types';

/**
 * VANTA - content for the trading and investing platform template.
 *
 * English, deliberately untranslated: a template's own copy is part of the
 * artifact a visitor downloads and rewrites (see `types.ts`). Sections read from
 * here and hold no strings of their own.
 *
 * VANTA is MULTIPAGE, so this module carries more than the shared
 * `TemplateContent` shape: the instrument book, the plan ladder, the platform
 * capability list and the per-page mastheads. Those extras are typed locally
 * rather than pushed into `types.ts`, because "spread in basis points" is this
 * template's domain, not every template's.
 *
 * Every figure below is ILLUSTRATIVE and authored, not fetched. A template ships
 * no network layer, and a market page that quietly implied live prices would be
 * dishonest - so the copy says so on the pages themselves and the footer repeats
 * it as a standing disclaimer.
 */

/** The pages the template can render. `home` is what an unknown id falls back to. */
export const VANTA_PAGES = ['home', 'markets', 'platform', 'pricing', 'contact'] as const;
export type VantaPageId = (typeof VANTA_PAGES)[number];

/**
 * Direction of travel for a quote. Drives colour only through a token pair
 * (`--vanta-up` / `--vanta-down`), never a hard-coded value in markup, and is
 * always paired with a sign in the text so colour is not the sole carrier of
 * meaning (WCAG 1.4.1).
 */
export type VantaTrend = 'up' | 'down';

/**
 * Which of the six authored sparkline silhouettes an instrument draws.
 *
 * The template ships no chart library and no image assets, so a "chart" is a
 * clip-path polygon declared in `vanta.css`. Six shapes is enough that a
 * fourteen-row table never repeats a neighbour, and the shape is art direction
 * rather than data - the row's numbers are the information.
 */
export type VantaSpark = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

/** One quote in the scrolling ticker strip that sits under the header. */
export interface VantaTicker {
  symbol: string;
  last: string;
  change: string;
  trend: VantaTrend;
}

/**
 * The strip. Ordered as a desk would pin them: index futures, then the megacaps,
 * then the two macro instruments everything else is read against.
 */
export const VANTA_TICKERS: VantaTicker[] = [
  { symbol: 'ESZ5', last: '6,412.25', change: '+0.42%', trend: 'up' },
  { symbol: 'NQZ5', last: '23,118.75', change: '+0.61%', trend: 'up' },
  { symbol: 'AAPL', last: '232.14', change: '+1.28%', trend: 'up' },
  { symbol: 'MSFT', last: '486.90', change: '-0.34%', trend: 'down' },
  { symbol: 'NVDA', last: '178.62', change: '+2.07%', trend: 'up' },
  { symbol: 'TSLA', last: '291.45', change: '-1.86%', trend: 'down' },
  { symbol: 'SPY', last: '638.71', change: '+0.39%', trend: 'up' },
  { symbol: 'EURUSD', last: '1.0842', change: '-0.12%', trend: 'down' },
  { symbol: 'XAUUSD', last: '3,214.80', change: '+0.74%', trend: 'up' },
  { symbol: 'BTCUSD', last: '94,310', change: '-2.41%', trend: 'down' },
  { symbol: 'US10Y', last: '4.186%', change: '+3.2bp', trend: 'up' },
  { symbol: 'BRENT', last: '71.44', change: '-0.58%', trend: 'down' },
];

/** Grouping the markets page filters on. Authored, so the chips read as copy. */
export type VantaAssetClass = 'Equities' | 'ETFs' | 'Futures' | 'FX & metals' | 'Digital assets';

export interface VantaInstrument {
  /** Stable key and the ticker printed in mono at the head of the row. */
  symbol: string;
  name: string;
  assetClass: VantaAssetClass;
  last: string;
  /** Absolute move, already signed - the template has no locale formatter. */
  change: string;
  changePct: string;
  /** Typical dealing spread, quoted the way the desk quotes it. */
  spread: string;
  /** Session volume, abbreviated as a trading screen would abbreviate it. */
  volume: string;
  spark: VantaSpark;
  trend: VantaTrend;
}

/**
 * The board. Fourteen instruments across five asset classes, weighted towards
 * equities because that is what the filter lands on first.
 */
export const VANTA_INSTRUMENTS: VantaInstrument[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc',
    assetClass: 'Equities',
    last: '232.14',
    change: '+2.93',
    changePct: '+1.28%',
    spread: '1.0 bp',
    volume: '48.2M',
    spark: 'a',
    trend: 'up',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp',
    assetClass: 'Equities',
    last: '486.90',
    change: '-1.66',
    changePct: '-0.34%',
    spread: '1.2 bp',
    volume: '19.7M',
    spark: 'd',
    trend: 'down',
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corp',
    assetClass: 'Equities',
    last: '178.62',
    change: '+3.62',
    changePct: '+2.07%',
    spread: '1.4 bp',
    volume: '204.6M',
    spark: 'b',
    trend: 'up',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc',
    assetClass: 'Equities',
    last: '291.45',
    change: '-5.52',
    changePct: '-1.86%',
    spread: '1.8 bp',
    volume: '96.1M',
    spark: 'e',
    trend: 'down',
  },
  {
    symbol: 'ASML',
    name: 'ASML Holding NV',
    assetClass: 'Equities',
    last: '742.30',
    change: '+8.10',
    changePct: '+1.10%',
    spread: '2.6 bp',
    volume: '1.4M',
    spark: 'c',
    trend: 'up',
  },
  {
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    assetClass: 'ETFs',
    last: '638.71',
    change: '+2.48',
    changePct: '+0.39%',
    spread: '0.8 bp',
    volume: '61.9M',
    spark: 'a',
    trend: 'up',
  },
  {
    symbol: 'QQQ',
    name: 'Invesco QQQ Trust',
    assetClass: 'ETFs',
    last: '552.08',
    change: '+3.41',
    changePct: '+0.62%',
    spread: '0.9 bp',
    volume: '38.4M',
    spark: 'b',
    trend: 'up',
  },
  {
    symbol: 'IEAC',
    name: 'iShares Core EUR Corp Bond',
    assetClass: 'ETFs',
    last: '128.44',
    change: '-0.21',
    changePct: '-0.16%',
    spread: '3.1 bp',
    volume: '2.2M',
    spark: 'f',
    trend: 'down',
  },
  {
    symbol: 'ESZ5',
    name: 'E-mini S&P 500, Dec 2025',
    assetClass: 'Futures',
    last: '6,412.25',
    change: '+26.75',
    changePct: '+0.42%',
    spread: '0.25 pt',
    volume: '1.28M',
    spark: 'a',
    trend: 'up',
  },
  {
    symbol: 'NQZ5',
    name: 'E-mini Nasdaq 100, Dec 2025',
    assetClass: 'Futures',
    last: '23,118.75',
    change: '+140.25',
    changePct: '+0.61%',
    spread: '0.50 pt',
    volume: '486K',
    spark: 'c',
    trend: 'up',
  },
  {
    symbol: 'CLF6',
    name: 'WTI Crude, Jan 2026',
    assetClass: 'Futures',
    last: '68.12',
    change: '-0.44',
    changePct: '-0.64%',
    spread: '0.01 pt',
    volume: '312K',
    spark: 'e',
    trend: 'down',
  },
  {
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    assetClass: 'FX & metals',
    last: '1.0842',
    change: '-0.0013',
    changePct: '-0.12%',
    spread: '0.2 pip',
    volume: '4.1B',
    spark: 'f',
    trend: 'down',
  },
  {
    symbol: 'XAUUSD',
    name: 'Gold spot / US Dollar',
    assetClass: 'FX & metals',
    last: '3,214.80',
    change: '+23.60',
    changePct: '+0.74%',
    spread: '0.14 pt',
    volume: '812K',
    spark: 'b',
    trend: 'up',
  },
  {
    symbol: 'BTCUSD',
    name: 'Bitcoin / US Dollar',
    assetClass: 'Digital assets',
    last: '94,310',
    change: '-2,329',
    changePct: '-2.41%',
    spread: '4.0 bp',
    volume: '$3.9B',
    spark: 'd',
    trend: 'down',
  },
];

/**
 * Filter chips for the markets page. `all` is authored rather than derived so
 * its label is written copy like every other string the visitor reads.
 */
export const VANTA_MARKET_FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'All instruments' },
  { id: 'Equities', label: 'Equities' },
  { id: 'ETFs', label: 'ETFs' },
  { id: 'Futures', label: 'Futures' },
  { id: 'FX & metals', label: 'FX & metals' },
  { id: 'Digital assets', label: 'Digital assets' },
];

/** Column headings and chrome for the instrument board. */
export const VANTA_MARKETS_PAGE = {
  columns: {
    instrument: 'Instrument',
    last: 'Last',
    change: 'Change',
    spread: 'Typical spread',
    volume: 'Session volume',
    trend: 'Five-day shape',
  },
  filterLegend: 'Filter by asset class',
  resultsSuffix: 'instruments listed',
  empty: 'Nothing quoted in that class on this board.',
  snapshotNote:
    'Board snapshot taken at 16:00 New York time. Figures on this page are illustrative and do not represent a live feed.',
} as const;

/** Copy for the order-book panel on the markets page. */
export const VANTA_ORDER_BOOK = {
  eyebrow: 'Depth of book',
  title: 'Ten levels, aggregated across venues',
  body: 'Vanta aggregates displayed liquidity from fourteen lit venues and four dark pools, then routes the child orders itself. This ladder shows how one mid-cap name looks two minutes before the close.',
  symbol: 'AAPL',
  asksLabel: 'Asks',
  bidsLabel: 'Bids',
  priceLabel: 'Price',
  sizeLabel: 'Size',
  spreadLabel: 'Spread',
  spreadValue: '0.01 / 1.0 bp',
  /* Five levels a side. Ladder depth bars are drawn in CSS, not from this size. */
  asks: [
    { price: '232.22', size: '1,240' },
    { price: '232.20', size: '2,860' },
    { price: '232.18', size: '4,105' },
    { price: '232.16', size: '6,730' },
    { price: '232.15', size: '9,420' },
  ],
  bids: [
    { price: '232.14', size: '8,980' },
    { price: '232.13', size: '6,240' },
    { price: '232.11', size: '3,915' },
    { price: '232.09', size: '2,470' },
    { price: '232.07', size: '1,105' },
  ],
} as const;

/**
 * The candlestick block on the home page. Only the direction of each session is
 * data; the body heights and wicks are art direction and live in `vanta.css`,
 * because a hand-drawn candle chart is a composition, not a dataset.
 */
export const VANTA_CANDLES = {
  eyebrow: 'Chart engine',
  title: 'Sixteen sessions, drawn in the browser',
  body: 'The charting surface renders on the GPU with no canvas library and no image tiles, which is why it stays at sixty frames while a hundred and twenty instruments stream behind it.',
  symbol: 'NVDA · 1D',
  rangeLabel: 'Range',
  rangeValue: '164.20 — 181.95',
  sessions: [
    'up',
    'up',
    'down',
    'up',
    'up',
    'down',
    'down',
    'up',
    'up',
    'up',
    'down',
    'up',
    'down',
    'up',
    'up',
    'up',
  ] as const satisfies readonly VantaTrend[],
} as const;

/**
 * The portfolio donut. The wedge geometry is a single authored conic-gradient in
 * `vanta.css`; these percentages are the same numbers written out, so the legend
 * and the ring never disagree.
 */
export const VANTA_ALLOCATION = {
  eyebrow: 'Portfolio view',
  title: 'One position sheet, every account',
  body: 'Holdings across brokerage, retirement and margin accounts consolidate into a single exposure view, with drift against your target weights recalculated on every fill.',
  totalLabel: 'Sample portfolio',
  totalValue: '$482,610',
  driftLabel: 'Largest drift from target',
  driftValue: '+3.4 pts, US equities',
  legend: [
    { label: 'US equities', value: '42%' },
    { label: 'International equities', value: '21%' },
    { label: 'Fixed income', value: '18%' },
    { label: 'Commodities', value: '11%' },
    { label: 'Cash and equivalents', value: '8%' },
  ],
} as const;

/** One capability block on the platform page. */
export interface VantaPlatformFeature {
  icon: LucideIcon;
  title: string;
  body: string;
  /** The single number that makes the claim checkable. Mono, always. */
  metric: string;
  metricLabel: string;
}

/** Copy for the platform page. */
export const VANTA_PLATFORM_PAGE = {
  eyebrow: 'The platform',
  title: 'Built by people who have been stopped out by their own software',
  subtitle:
    'Vanta is one stack: matching-adjacent order routing, a streaming quote layer and a chart surface that renders locally. No third-party terminal bolted on at the edges.',
  features: [
    {
      icon: Gauge,
      title: 'Smart order routing',
      body: 'Orders are sliced against displayed depth on fourteen lit venues, with a resting share sent to four dark pools. Routing logic is published, and every fill carries the venue that printed it.',
      metric: '12 ms',
      metricLabel: 'Median order acknowledgement',
    },
    {
      icon: LineChart,
      title: 'Local chart surface',
      body: 'Charts render in the browser against a local tick buffer, so pan and zoom never wait on a round trip. Forty-one studies ship with the platform, including volume profile and anchored VWAP.',
      metric: '60 fps',
      metricLabel: 'Sustained with 120 streams',
    },
    {
      icon: Layers,
      title: 'Bracket and conditional orders',
      body: 'Attach a stop and a target at entry, or build a chain that arms only when a second instrument trades through a level. Conditions evaluate server side so they survive a closed laptop.',
      metric: '9 types',
      metricLabel: 'Order types on every venue',
    },
    {
      icon: Cpu,
      title: 'Strategy sandbox',
      body: 'Write a strategy in TypeScript or Python, replay it against eight years of consolidated tape, then promote it to paper and to live from the same file. Backtests declare their slippage model.',
      metric: '8 yrs',
      metricLabel: 'Tick history for replay',
    },
    {
      icon: BellRing,
      title: 'Alerts that reach you',
      body: 'Price, spread, volume and news alerts fire to push, email and webhook. A webhook alert carries a signed payload, so a downstream system can trust it without polling.',
      metric: '<1 s',
      metricLabel: 'Alert to delivery, p95',
    },
    {
      icon: ArrowRightLeft,
      title: 'Documented API',
      body: 'REST for account and position state, WebSocket for the quote and fill stream, FIX 4.4 for institutional flow. Sandbox keys are issued instantly and rate limits are published per endpoint.',
      metric: '3 APIs',
      metricLabel: 'REST, WebSocket and FIX',
    },
  ] as const satisfies readonly VantaPlatformFeature[],
  reliabilityEyebrow: 'Operations',
  reliabilityTitle: 'What the desk holds itself to',
  reliability: [
    { metric: '99.98%', label: 'Platform availability during market hours, trailing twelve months' },
    { metric: '12 ms', label: 'Median order acknowledgement, measured at the gateway' },
    { metric: '31 ms', label: 'Ninety-ninth percentile acknowledgement on the same path' },
    { metric: '0', label: 'Trading halts caused by Vanta infrastructure since 2022' },
  ],
  stackEyebrow: 'Coverage',
  stackTitle: 'Where the orders go',
  stack: [
    { name: 'Lit venues', detail: 'Fourteen, across the United States, London and Frankfurt' },
    { name: 'Dark pools', detail: 'Four, with minimum acceptable quantity set per order' },
    { name: 'Clearing', detail: 'Self-cleared in the US, agency clearing through a Tier 1 bank in Europe' },
    { name: 'Market data', detail: 'Consolidated tape plus direct feeds on the three largest venues' },
  ],
} as const;

/** One plan on the pricing ladder. */
export interface VantaPlan {
  id: string;
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  /** The commission line, kept separate because it is what people compare. */
  commission: string;
  /** Readonly so the literal `as const` ladder below still satisfies the shape. */
  features: readonly string[];
  cta: string;
  /** Exactly one plan is featured; the card border and label follow it. */
  featured: boolean;
}

/** Copy and the ladder for the pricing page. */
export const VANTA_PRICING_PAGE = {
  eyebrow: 'Pricing',
  title: 'Three plans, and a fee schedule with no asterisks',
  subtitle:
    'Every plan clears through the same venues at the same speed. What changes is the data depth, the number of live strategies and how much of the routing you control.',
  featuredLabel: 'Most accounts',
  cadenceNote: 'Billed monthly, cancel from the account page. Prices exclude applicable sales tax.',
  plans: [
    {
      id: 'core',
      name: 'Core',
      price: '$0',
      cadence: 'per month',
      tagline: 'For investors placing a handful of orders a month.',
      commission: '$0 commission on US equities and ETFs',
      features: [
        'Real-time top-of-book on US equities and ETFs',
        'Market, limit, stop and bracket orders',
        'Twelve chart studies and two saved layouts',
        'Fractional investing from $1 per order',
        'Statements, tax lots and annual reporting',
      ],
      cta: 'Open a Core account',
      featured: false,
    },
    {
      id: 'active',
      name: 'Active',
      price: '$19',
      cadence: 'per month',
      tagline: 'For traders who need depth, speed and a strategy or two running.',
      commission: '$0.35 per futures contract, $0 on equities and ETFs',
      features: [
        'Ten levels of depth on every listed venue',
        'All forty-one chart studies and unlimited layouts',
        'Three live strategies plus unlimited backtests',
        'Conditional and algorithmic order types',
        'Webhook alerts with signed payloads',
        'Priority routing with per-venue reporting',
      ],
      cta: 'Start on Active',
      featured: true,
    },
    {
      id: 'desk',
      name: 'Desk',
      price: '$149',
      cadence: 'per month',
      tagline: 'For small funds and family offices running several books.',
      commission: 'Negotiated schedule from 0.15 bp on notional',
      features: [
        'Everything in Active, across up to twelve accounts',
        'Direct feeds on the three largest venues',
        'FIX 4.4 session with a named onboarding engineer',
        'Twenty live strategies and dedicated replay capacity',
        'Allocation, block trading and post-trade give-up',
        'Named coverage on the London or New York desk',
      ],
      cta: 'Talk to the desk',
      featured: false,
    },
  ] as const satisfies readonly VantaPlan[],
  feeEyebrow: 'Fee schedule',
  feeTitle: 'What a trade actually costs',
  feeColumns: { item: 'Charge', core: 'Core', active: 'Active', desk: 'Desk' },
  fees: [
    { item: 'US equities and ETFs', core: '$0', active: '$0', desk: '$0' },
    { item: 'Futures, per contract', core: '$0.85', active: '$0.35', desk: 'From $0.19' },
    { item: 'FX, per million notional', core: '$28', active: '$18', desk: 'From $11' },
    { item: 'Options, per contract', core: '$0.65', active: '$0.35', desk: 'From $0.20' },
    { item: 'Currency conversion', core: '0.35%', active: '0.15%', desk: '0.08%' },
    { item: 'Outbound wire', core: '$18', active: '$18', desk: 'Waived' },
    { item: 'Inactivity or custody fee', core: 'None', active: 'None', desk: 'None' },
  ],
  feeNote:
    'Regulatory pass-through charges, exchange fees and stamp duty apply on top and are itemised on every contract note. Figures on this page are illustrative for a design template.',
} as const;

/**
 * Per-page mastheads. Every page beyond home opens with its own eyebrow, title
 * and lead so the five pages never read as the same page twice; home opens with
 * the hero instead, which is why `home` is absent from this record.
 */
export const VANTA_MASTHEADS: Record<
  Exclude<VantaPageId, 'home'>,
  { eyebrow: string; title: string; titleAccent: string; subtitle: string; meta: { label: string; value: string }[] }
> = {
  markets: {
    eyebrow: 'Markets',
    title: 'Nine thousand instruments,',
    titleAccent: 'one quote layer',
    subtitle:
      'Equities, ETFs, futures, spot FX, metals and digital assets, quoted from the same aggregated book and dealt on the same routing path.',
    meta: [
      { label: 'Instruments', value: '9,412' },
      { label: 'Venues', value: '18' },
      { label: 'Quote update', value: '~40 ms' },
    ],
  },
  platform: {
    eyebrow: 'Platform',
    title: 'The stack under',
    titleAccent: 'every fill',
    subtitle:
      'Routing, streaming quotes, charting and strategy replay are one system with one release train, which is why the parts behave the same on a Tuesday and on a print day.',
    meta: [
      { label: 'Median ack', value: '12 ms' },
      { label: 'Availability', value: '99.98%' },
      { label: 'Chart studies', value: '41' },
    ],
  },
  pricing: {
    eyebrow: 'Pricing',
    title: 'Read the schedule',
    titleAccent: 'before you fund',
    subtitle:
      'Three plans and one published fee table. Nothing is priced on a call, and the pass-through charges are itemised rather than folded into a spread.',
    meta: [
      { label: 'Plans', value: '3' },
      { label: 'Equity commission', value: '$0' },
      { label: 'Custody fee', value: 'None' },
    ],
  },
  contact: {
    eyebrow: 'Contact',
    title: 'A desk that answers',
    titleAccent: 'while markets are open',
    subtitle:
      'Order questions reach a licensed trader, not a script. Onboarding, API keys and institutional coverage each have their own route below.',
    meta: [
      { label: 'Desk hours', value: '24/5' },
      { label: 'First response', value: '<4 min' },
      { label: 'Offices', value: '2' },
    ],
  },
};

/** Copy for the contact page beyond the shared `contact` block. */
export const VANTA_CONTACT_PAGE = {
  deskEyebrow: 'Direct routes',
  deskTitle: 'Reach the right person first time',
  desks: [
    {
      name: 'Trading desk',
      detail: 'Order status, routing questions and anything time sensitive while a market is open.',
      value: 'desk@vanta.example · +1 (212) 555-0163',
    },
    {
      name: 'Onboarding',
      detail: 'Account opening, transfers in, and suitability or entity documentation.',
      value: 'onboarding@vanta.example',
    },
    {
      name: 'API and integrations',
      detail: 'Sandbox keys, FIX sessions, webhook signing and rate-limit increases.',
      value: 'developers@vanta.example',
    },
    {
      name: 'Institutional coverage',
      detail: 'Block trading, allocation, give-up and negotiated commission schedules.',
      value: 'institutional@vanta.example',
    },
  ],
  officesEyebrow: 'Offices',
  offices: [
    {
      name: 'New York',
      address: '48 Wall Street, 11th Floor, New York NY 10005',
      hours: 'Desk staffed 04:00 to 20:00 Eastern, Monday to Friday.',
    },
    {
      name: 'London',
      address: '30 Finsbury Square, London EC2A 1AG',
      hours: 'Desk staffed 07:00 to 22:00 London, Monday to Friday.',
    },
  ],
  sentTitle: 'Message queued',
  sentBody:
    'Thank you. The desk replies within four minutes while a market is open, and by 09:00 local otherwise. This form is a front-end demonstration and sends nothing.',
} as const;

/** Chrome that is not section copy: menu labels, skip link, standing disclaimer. */
export const VANTA_UI = {
  skipToContent: 'Skip to content',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  headerCta: 'Open an account',
  headerCtaHref: '?page=contact',
  tickerLabel: 'Illustrative market snapshot',
  liveLabel: 'Snapshot',
  gainLabel: 'Up',
  lossLabel: 'Down',
  chartAlt: 'Decorative price chart composed in CSS',
  /**
   * The standing disclaimer. Rendered in the footer on every page, because a
   * site that looks like a broker has to say plainly that it is not one.
   */
  disclaimer:
    'Design template only. Vanta is a fictional brand, every price, fee and statistic on this site is illustrative, and nothing here is financial advice or an offer to deal.',
  riskLine:
    'Capital is at risk. Leveraged products can lose more than the amount deposited.',
} as const;

export const VANTA_CONTENT: TemplateContent = {
  brand: 'Vanta',

  /*
   * Query hrefs, not anchors: the preview route reads `?page=` and hands it to
   * the template, so navigation works with no router and no client-side link
   * component. A downloaded copy keeps working the same way.
   */
  nav: [
    { href: '?page=home', label: 'Home' },
    { href: '?page=markets', label: 'Markets' },
    { href: '?page=platform', label: 'Platform' },
    { href: '?page=pricing', label: 'Pricing' },
    { href: '?page=contact', label: 'Contact' },
  ],

  hero: {
    badge: 'Multi-asset execution · New York and London',
    title: 'Trade the whole book',
    titleAccent: 'at desk latency',
    subtitle:
      'Vanta routes retail and professional flow across eighteen venues on a single stack: aggregated depth, a chart surface that renders locally, and a fee schedule published in full.',
    ctaPrimary: 'Open an account',
    ctaSecondary: 'See the markets board',
    stats: [
      { value: 12, suffix: ' ms', label: 'Median order acknowledgement' },
      { value: 9412, suffix: '', label: 'Instruments quoted' },
      { value: 340, suffix: 'k', label: 'Funded accounts' },
    ],
  },

  /* Venues, not quotes: the coloured quote strip is its own component. */
  marquee: [
    'NYSE',
    'NASDAQ',
    'CBOE',
    'CME Group',
    'IEX',
    'ARCA',
    'London Stock Exchange',
    'Deutsche Börse',
    'Euronext',
    'ICE Futures',
  ],

  about: {
    eyebrow: 'About Vanta',
    title: 'Started by four people who spent a decade fixing other firms’ routers',
    body: [
      'Vanta was built in 2019 by a routing team that had spent ten years inside two agency brokers, watching good orders get worse on the way to the venue. Slippage was blamed on the market when it was usually the path.',
      'So the path is the product. Vanta publishes its routing logic, prints the venue on every fill, and reports acknowledgement latency at the median and the ninety-ninth percentile rather than as one flattering average.',
    ],
    points: [
      'Client assets held in segregated custody, reconciled daily',
      'Routing logic published, venue printed on every fill',
      'One fee schedule for everyone on a plan, with no negotiated spreads',
    ],
  },

  services: {
    eyebrow: 'What you can trade',
    title: 'Five asset classes on one ticket',
    subtitle:
      'The same order ticket, the same margin view and the same position sheet, whether the instrument settles in two days or two seconds.',
    items: [
      {
        icon: Landmark,
        title: 'Equities and ETFs',
        body: 'Six thousand listed names across the United States, the United Kingdom and the euro area, commission free, with typical spreads under 1.2 basis points on large caps.',
      },
      {
        icon: LineChart,
        title: 'Futures and options',
        body: 'Index, energy, metals and rates futures from $0.35 a contract on Active, with margin recalculated intraday rather than at the close.',
      },
      {
        icon: Globe,
        title: 'FX and metals',
        body: 'Twenty-eight currency pairs and four metals, quoted from eleven liquidity providers at typical spreads of 0.2 pips on EURUSD in London hours.',
      },
      {
        icon: Wallet,
        title: 'Fractional investing',
        body: 'Buy $1 of any listed share and hold it as a real fractional entitlement, with dividends apportioned to the cent and shown in the tax lot.',
      },
      {
        icon: Repeat,
        title: 'Scheduled investing',
        body: 'Standing orders into a portfolio or a single name, executed in the closing auction so a recurring buy is never the widest trade of the day.',
      },
      {
        icon: Banknote,
        title: 'Cash and treasuries',
        body: 'Uninvested balances sweep into a treasury fund paying the prevailing rate, disclosed net of the fee rather than as a headline yield.',
      },
    ],
  },

  why: {
    eyebrow: 'Why Vanta',
    title: 'Four things we can be measured on',
    subtitle:
      'Every claim below is a number a client can check on their own statement, which is the only kind of claim worth printing.',
    items: [
      {
        icon: Timer,
        title: 'Execution you can audit',
        body: 'Median acknowledgement of 12 ms and 31 ms at the ninety-ninth percentile, measured at the gateway. Every fill carries its venue, and monthly execution reports go out unprompted.',
      },
      {
        icon: Lock,
        title: 'Assets held apart',
        body: 'Client money sits in segregated accounts at two custodian banks, reconciled daily and reported monthly. Vanta does not lend client stock without a separate, revocable agreement.',
      },
      {
        icon: Percent,
        title: 'One published schedule',
        body: 'The fee table is the whole arrangement. No payment for order flow, no spread markup on FX, and pass-through charges itemised line by line on the contract note.',
      },
      {
        icon: ShieldCheck,
        title: 'Regulated in both books',
        body: 'Vanta Securities LLC is a registered broker-dealer and SIPC member; Vanta Markets Ltd is authorised by the Financial Conduct Authority. Entity and protections are shown before you fund.',
      },
    ],
  },

  faq: {
    eyebrow: 'Before you fund',
    title: 'What new accounts ask the desk',
    items: [
      {
        question: 'How is Vanta paid if equity commission is zero.',
        answer:
          'On plan subscriptions, futures and options commission, currency conversion and the spread the treasury sweep pays us, all of which are on the fee schedule. Vanta takes no payment for order flow, which is why routing can be optimised for price rather than for rebate.',
      },
      {
        question: 'What happens to my positions if Vanta fails.',
        answer:
          'Client assets are held in segregated custody at two banks and are not on the Vanta balance sheet. US accounts are covered by SIPC up to $500,000, of which $250,000 may be cash; UK accounts fall under the FSCS limit of £85,000. Neither protects against market losses.',
      },
      {
        question: 'Which order types are supported, and where.',
        answer:
          'Market, limit, stop, stop-limit, trailing stop, bracket, one-cancels-other, iceberg and time-weighted average price, on every venue that accepts them natively. Where a venue does not, Vanta simulates the type server side and says so on the ticket.',
      },
      {
        question: 'How much history can I backtest against.',
        answer:
          'Eight years of consolidated tape at tick resolution on Active and Desk, and daily bars on Core. Backtests must declare a slippage and fee model before they run, so a result cannot be quoted without the assumptions that produced it.',
      },
      {
        question: 'Do you support entity, trust and joint accounts.',
        answer:
          'Yes, including LLC, LP, corporate, trust and joint accounts, with documentation reviewed by onboarding within two business days. Desk plan clients can run up to twelve accounts under one login with per-account permissions.',
      },
      {
        question: 'Can I move an existing portfolio across.',
        answer:
          'In kind, through ACATS in the United States and through the equivalent transfer scheme in the United Kingdom, typically six to ten business days. Vanta pays the outgoing broker’s transfer fee up to $150 per account.',
      },
    ],
  },

  contact: {
    eyebrow: 'Talk to the desk',
    title: 'Ask before you fund, not after',
    subtitle:
      'Routing questions, entity onboarding, API access or a transfer in. Messages reach a licensed member of the desk during market hours and are answered in order of receipt.',
    fields: {
      name: 'Full name',
      email: 'Email address',
      message: 'What do you need, and which instruments',
    },
    submit: 'Send to the desk',
    details: [
      { label: 'Trading desk', value: '+1 (212) 555-0163' },
      { label: 'Email', value: 'desk@vanta.example' },
      { label: 'Desk hours', value: '24 hours, Monday to Friday' },
      { label: 'Registration', value: 'FCA 214877 · SEC 8-69412' },
    ],
  },

  footer: {
    tagline:
      'Multi-asset execution on one stack: aggregated depth, published routing and a fee schedule with nothing behind an asterisk.',
    columns: [
      {
        title: 'Trade',
        links: ['Markets board', 'Order types', 'Margin and leverage', 'Fractional investing'],
      },
      {
        title: 'Platform',
        links: ['Chart surface', 'Strategy sandbox', 'Alerts and webhooks', 'API documentation'],
      },
      {
        title: 'Firm',
        links: ['Fee schedule', 'Execution quality reports', 'Custody and protections', 'Regulatory disclosures'],
      },
    ],
    legal:
      '© 2026 Vanta Securities LLC and Vanta Markets Ltd. Vanta Securities LLC is a registered broker-dealer and member SIPC. Vanta Markets Ltd is authorised and regulated by the Financial Conduct Authority, firm reference 214877.',
  },
};

/** Small legal-adjacent blocks that only the footer renders. */
export const VANTA_FOOTER_EXTRAS = {
  disclaimerLabel: 'Disclaimer',
  riskLabel: 'Risk warning',
} as const;

/** Icons re-exported for the platform stack list, kept next to their usage. */
export const VANTA_STACK_ICONS: readonly LucideIcon[] = [Building2, Layers, ScrollText, BookOpen];

/** The prompt a visitor copies to generate a site in this spirit. */
export const VANTA_PROMPT = `Design a five-page website for a multi-asset trading and investing platform called Vanta.

Pages: home, markets, platform, pricing, contact. A shared header and footer wrap all five, each page opens with its own masthead, and the header nav marks the current page.

Art direction:
- Deep ink #0b0f14 with layered elevation, an electric teal #14e0a0 for gains, a coral #ff5c5c for losses and one violet for the brand mark. Colour is never the only signal: every gain and loss also carries a sign.
- Oversized display type, up to about 120px, at tight -0.04em tracking. A monospaced face carries every number, ticker and label.
- Very large radii on cards, 32 to 48px, deliberately contrasted with 1px hairline rules and thin dividers.
- Every chart is composed in CSS: a scrolling ticker strip, area sparklines drawn with gradients and clip-path, a candlestick block built from divs, an order-book ladder with depth bars, and a portfolio donut made from a conic-gradient. No images, no chart libraries.

Sections: a hero with a badge, a two-line headline, two calls to action, three counters and a large area chart; a venue marquee; an asset-class grid; a candlestick block; a portfolio donut; a "why us" grid; an accordion FAQ. The markets page is a filterable instrument board with last, change, spread, volume and a sparkline per row, plus an order-book ladder. The platform page pairs capability cards carrying one metric each with an operations table. Pricing is a three-plan ladder and a full fee schedule. Contact pairs a form with routed desks and two offices.

Motion: reveal on scroll with a cubic-bezier(0.16, 1, 0.3, 1) ease, counters that count once, an infinite ticker marquee, and everything static under prefers-reduced-motion.

Voice: precise and unexcited. Real instrument names, spreads in basis points, latency in milliseconds, a regulatory line, and a visible disclaimer that the figures are illustrative and nothing on the site is financial advice. No exclamation marks.`;
