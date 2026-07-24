/**
 * Website Intelligence - the scanning engine's domain types.
 *
 * This is the first, browserless slice of the platform described in
 * `data/website-intelligence.ts`: it fetches a page's HTML and headers and
 * analyses SEO, security, HTML structure, assets and the technology in use.
 * The browser-driven analyses (Lighthouse performance, axe-core accessibility,
 * Core Web Vitals) need a headless Chromium and are a later phase; the types
 * here already carry their categories so adding them changes no shape.
 */

/** Finding severity, ordered most to least serious. Drives scoring weight. */
export const SEVERITIES = ['critical', 'serious', 'moderate', 'minor', 'info'] as const;
export type Severity = (typeof SEVERITIES)[number];

/**
 * A finding's category. A superset of the browserless analyzers, so the
 * browser phase (`performance`, `accessibility`) slots in without a migration.
 */
export const CATEGORIES = [
  'seo',
  'security',
  'html',
  'assets',
  'bestPractices',
  'performance',
  'accessibility',
] as const;
export type Category = (typeof CATEGORIES)[number];

/**
 * A rule, exactly as the spec documents it. `test` returns true when the rule
 * is VIOLATED - i.e. when the page earns the finding.
 */
export interface Rule {
  /** Stable, kebab-case identifier, unique across the whole set. */
  id: string;
  category: Category;
  severity: Severity;
  /** What is wrong, in one sentence. */
  description: string;
  /** How to fix it. */
  fix: string;
  /** Why it matters. */
  impact: string;
  /** Optional human estimate of the win, e.g. "~120 KB", "faster LCP". */
  estimatedSavings?: string;
  /** Optional link to deeper documentation. */
  documentation?: string;
  /** Predicate over the page facts. `true` ⇒ the page violates the rule. */
  test: (facts: PageFacts) => boolean;
}

/** A rule that fired, flattened for transport (no function). */
export interface Finding {
  ruleId: string;
  category: Category;
  severity: Severity;
  description: string;
  fix: string;
  impact: string;
  estimatedSavings?: string;
  documentation?: string;
}

/** A parsed cookie from a `set-cookie` header. */
export interface CookieFacts {
  name: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string | null;
}

/** The security-relevant response headers, normalised. */
export interface SecurityFacts {
  https: boolean;
  hsts: boolean;
  csp: boolean;
  xFrameOptions: boolean;
  xContentTypeOptions: boolean;
  referrerPolicy: boolean;
  permissionsPolicy: boolean;
  cookies: CookieFacts[];
  insecureCookies: number;
}

/** One heading, in document order. */
export interface HeadingFacts {
  level: number;
  text: string;
}

/**
 * Everything the analyzers and rules read, extracted from one fetched page.
 * Pure data: built once by `extractFacts`, then every rule is a function of it,
 * which is what lets the whole engine be tested with no network.
 */
export interface PageFacts {
  url: string;
  finalUrl: string;
  status: number;
  redirects: string[];
  timingMs: number;
  htmlBytes: number;

  lang: string | null;
  charset: string | null;
  viewport: string | null;
  title: string | null;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  canonical: string | null;
  favicon: boolean;

  h1Count: number;
  headings: HeadingFacts[];
  /** True when heading levels never jump by more than one going down. */
  headingOrderOk: boolean;

  images: {
    total: number;
    missingAlt: number;
    lazy: number;
    withDimensions: number;
  };
  links: {
    total: number;
    external: number;
  };
  scripts: {
    total: number;
    blocking: number;
    async: number;
    defer: number;
  };
  stylesheets: {
    total: number;
    blocking: number;
  };

  openGraph: Record<string, string>;
  twitter: Record<string, string>;
  jsonLdBlocks: number;

  security: SecurityFacts;
  technologies: string[];
}

/** A category's score plus the findings that dragged it down. */
export interface CategoryScore {
  category: Category;
  /** 0-100, where 100 is clean. */
  score: number;
  findings: Finding[];
}

/** The whole scan, as returned by the API. */
export interface ScanResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  status: number;
  timingMs: number;
  redirects: string[];
  /** 0-100 overall, the mean of the scored categories. */
  overallScore: number;
  categories: CategoryScore[];
  findings: Finding[];
  technologies: string[];
  metrics: ScanMetrics;
}

/**
 * Core Web Vitals and related lab timings, in the browser phase's units:
 * durations in milliseconds, CLS unitless. Every field is optional because the
 * browserless scan cannot measure any of them - they are only present once the
 * browser analyzer has run.
 */
export interface WebVitals {
  /** Largest Contentful Paint, ms. */
  lcp?: number;
  /** Cumulative Layout Shift, unitless. */
  cls?: number;
  /** Interaction to Next Paint, ms. */
  inp?: number;
  /** First Contentful Paint, ms. */
  fcp?: number;
  /** Total Blocking Time, ms. */
  tbt?: number;
  /** Time to First Byte (server response), ms. */
  ttfb?: number;
}

/** Flat, chart-ready numbers pulled out of the facts for the dashboard. */
export interface ScanMetrics {
  htmlBytes: number;
  images: number;
  scripts: number;
  stylesheets: number;
  requestsBlockingRender: number;
  headings: number;
  links: number;
  externalLinks: number;
  jsonLdBlocks: number;
  /** Present only after the browser analyzer has run. */
  webVitals?: WebVitals;
}

/** Validated input to a scan. */
export interface ScanInput {
  url: string;
}

/** A page fetched and ready to analyse. Kept separate so tests skip the network. */
export interface PageSnapshot {
  requestedUrl: string;
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  /** Every `set-cookie` value, unfolded (fetch joins them with `, `). */
  setCookies: string[];
  html: string;
  htmlBytes: number;
  timingMs: number;
  redirects: string[];
}
