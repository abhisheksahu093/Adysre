import type { PageFacts } from '../types';

/**
 * SEO audit engine: PageFacts (already extracted by the website-intel collector)
 * plus a couple of text stats, turned into a graded checklist. Pure and
 * unit-tested. Each check is pass/warn/fail with a value and a recommendation;
 * the score is a weighted roll-up (pass = full weight, warn = half, fail = 0)
 * and the grade is the familiar A+..F band.
 */

export type CheckStatus = 'pass' | 'warn' | 'fail';
export type SeoCategory = 'meta' | 'content' | 'technical' | 'social' | 'links' | 'security';

export interface SeoCheck {
  id: string;
  label: string;
  category: SeoCategory;
  status: CheckStatus;
  value: string;
  recommendation?: string | undefined;
  weight: number;
}

export interface SeoExtra {
  wordCount: number;
  keywords: Array<{ word: string; count: number; density: number }>;
}

export interface SeoReport {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  score: number;
  grade: string;
  summary: { pass: number; warn: number; fail: number };
  checks: SeoCheck[];
  stats: {
    wordCount: number;
    titleLength: number;
    metaDescriptionLength: number;
    images: number;
    missingAlt: number;
    internalLinks: number;
    externalLinks: number;
    h1Count: number;
    pageSizeKb: number;
    jsonLdBlocks: number;
  };
  keywords: SeoExtra['keywords'];
}

function grade(score: number): string {
  if (score >= 97) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export function auditSeo(facts: PageFacts, extra: SeoExtra): SeoReport {
  const c: SeoCheck[] = [];
  const add = (
    id: string,
    label: string,
    category: SeoCategory,
    status: CheckStatus,
    value: string,
    recommendation: string | undefined,
    weight: number,
  ) => c.push({ id, label, category, status, value, recommendation, weight });

  const og = facts.openGraph;
  const tw = facts.twitter;

  // ── Meta ──────────────────────────────────────────────────────────────────
  add('title', 'Page title', 'meta', facts.title ? 'pass' : 'fail', facts.title ?? 'Missing', facts.title ? undefined : 'Add a unique <title>.', 3);
  add(
    'title-length',
    'Title length',
    'meta',
    !facts.title ? 'fail' : facts.titleLength >= 30 && facts.titleLength <= 60 ? 'pass' : 'warn',
    `${facts.titleLength} chars`,
    facts.titleLength < 30 ? 'Aim for 30–60 characters.' : facts.titleLength > 60 ? 'Trim to under 60 characters.' : undefined,
    1,
  );
  add('meta-description', 'Meta description', 'meta', facts.metaDescription ? 'pass' : 'fail', facts.metaDescription ? 'Present' : 'Missing', facts.metaDescription ? undefined : 'Add a meta description.', 2);
  add(
    'meta-description-length',
    'Description length',
    'meta',
    !facts.metaDescription ? 'fail' : facts.metaDescriptionLength >= 70 && facts.metaDescriptionLength <= 160 ? 'pass' : 'warn',
    `${facts.metaDescriptionLength} chars`,
    facts.metaDescriptionLength && (facts.metaDescriptionLength < 70 || facts.metaDescriptionLength > 160) ? 'Aim for 70–160 characters.' : undefined,
    1,
  );
  add('canonical', 'Canonical URL', 'meta', facts.canonical ? 'pass' : 'warn', facts.canonical ?? 'Missing', facts.canonical ? undefined : 'Add a canonical link to avoid duplicates.', 1);

  // ── Content ───────────────────────────────────────────────────────────────
  add('h1', 'Single H1', 'content', facts.h1Count === 1 ? 'pass' : facts.h1Count === 0 ? 'fail' : 'warn', `${facts.h1Count} found`, facts.h1Count === 0 ? 'Add exactly one H1.' : facts.h1Count > 1 ? 'Use only one H1 per page.' : undefined, 2);
  add('heading-order', 'Heading hierarchy', 'content', facts.headingOrderOk ? 'pass' : 'warn', facts.headingOrderOk ? 'Sequential' : 'Skipped levels', facts.headingOrderOk ? undefined : 'Do not skip heading levels (e.g. H2 → H4).', 1);
  add(
    'image-alt',
    'Image alt text',
    'content',
    facts.images.missingAlt === 0 ? 'pass' : facts.images.missingAlt > facts.images.total / 2 ? 'fail' : 'warn',
    `${facts.images.missingAlt}/${facts.images.total} missing`,
    facts.images.missingAlt > 0 ? 'Add descriptive alt text to every image.' : undefined,
    2,
  );
  add('word-count', 'Content length', 'content', extra.wordCount >= 300 ? 'pass' : extra.wordCount >= 100 ? 'warn' : 'fail', `${extra.wordCount} words`, extra.wordCount < 300 ? 'Thin content; aim for 300+ words.' : undefined, 1);

  // ── Technical ─────────────────────────────────────────────────────────────
  add('https', 'HTTPS', 'technical', facts.security.https ? 'pass' : 'fail', facts.security.https ? 'Secure' : 'Not secure', facts.security.https ? undefined : 'Serve the site over HTTPS.', 3);
  add('status', 'HTTP status', 'technical', facts.status === 200 ? 'pass' : 'fail', String(facts.status), facts.status === 200 ? undefined : 'Return a 200 for the main page.', 2);
  add('viewport', 'Mobile viewport', 'technical', facts.viewport ? 'pass' : 'fail', facts.viewport ? 'Set' : 'Missing', facts.viewport ? undefined : 'Add a responsive viewport meta tag.', 2);
  add('charset', 'Charset', 'technical', facts.charset ? 'pass' : 'warn', facts.charset ?? 'Missing', facts.charset ? undefined : 'Declare a charset (utf-8).', 1);
  add('lang', 'Language', 'technical', facts.lang ? 'pass' : 'warn', facts.lang ?? 'Missing', facts.lang ? undefined : 'Set <html lang>.', 1);
  add('favicon', 'Favicon', 'technical', facts.favicon ? 'pass' : 'warn', facts.favicon ? 'Present' : 'Missing', facts.favicon ? undefined : 'Add a favicon.', 1);
  add('redirects', 'Redirect chain', 'technical', facts.redirects.length === 0 ? 'pass' : facts.redirects.length <= 1 ? 'warn' : 'fail', `${facts.redirects.length} hop(s)`, facts.redirects.length > 0 ? 'Reduce redirect hops.' : undefined, 1);
  add('page-size', 'Page weight', 'technical', facts.htmlBytes <= 100_000 ? 'pass' : facts.htmlBytes <= 500_000 ? 'warn' : 'fail', `${Math.round(facts.htmlBytes / 1024)} KB`, facts.htmlBytes > 100_000 ? 'Large HTML; consider trimming.' : undefined, 1);
  add('structured-data', 'Structured data (JSON-LD)', 'technical', facts.jsonLdBlocks > 0 ? 'pass' : 'warn', `${facts.jsonLdBlocks} block(s)`, facts.jsonLdBlocks === 0 ? 'Add JSON-LD structured data.' : undefined, 1);

  // ── Social ────────────────────────────────────────────────────────────────
  const ogOk = Boolean(og['og:title'] && og['og:description'] && og['og:image']);
  add('open-graph', 'Open Graph', 'social', ogOk ? 'pass' : og['og:title'] ? 'warn' : 'fail', ogOk ? 'Complete' : og['og:title'] ? 'Partial' : 'Missing', ogOk ? undefined : 'Add og:title, og:description and og:image.', 1);
  add('twitter-card', 'Twitter Card', 'social', tw['twitter:card'] ? 'pass' : 'warn', tw['twitter:card'] ?? 'Missing', tw['twitter:card'] ? undefined : 'Add a twitter:card tag.', 1);

  // ── Links ─────────────────────────────────────────────────────────────────
  const internalLinks = facts.links.total - facts.links.external;
  add('internal-links', 'Internal links', 'links', internalLinks > 0 ? 'pass' : 'warn', `${internalLinks}`, internalLinks === 0 ? 'Link to other pages on the site.' : undefined, 1);
  add('external-links', 'External links', 'links', 'pass', `${facts.links.external}`, undefined, 0);

  // ── Security ──────────────────────────────────────────────────────────────
  const secHeaders = [facts.security.hsts, facts.security.csp, facts.security.xContentTypeOptions, facts.security.xFrameOptions].filter(Boolean).length;
  add('security-headers', 'Security headers', 'security', secHeaders >= 3 ? 'pass' : secHeaders >= 1 ? 'warn' : 'fail', `${secHeaders}/4 set`, secHeaders < 3 ? 'Add HSTS, CSP, X-Content-Type-Options, X-Frame-Options.' : undefined, 1);

  // ── Score ─────────────────────────────────────────────────────────────────
  const valueOf = (s: CheckStatus): number => (s === 'pass' ? 1 : s === 'warn' ? 0.5 : 0);
  const totalWeight = c.reduce((sum, ch) => sum + ch.weight, 0);
  const gained = c.reduce((sum, ch) => sum + valueOf(ch.status) * ch.weight, 0);
  const score = totalWeight === 0 ? 0 : Math.round((gained / totalWeight) * 100);

  return {
    url: facts.url,
    finalUrl: facts.finalUrl,
    fetchedAt: '', // stamped by the run layer; keeps this function pure/testable
    score,
    grade: grade(score),
    summary: {
      pass: c.filter((x) => x.status === 'pass').length,
      warn: c.filter((x) => x.status === 'warn').length,
      fail: c.filter((x) => x.status === 'fail').length,
    },
    checks: c,
    stats: {
      wordCount: extra.wordCount,
      titleLength: facts.titleLength,
      metaDescriptionLength: facts.metaDescriptionLength,
      images: facts.images.total,
      missingAlt: facts.images.missingAlt,
      internalLinks: facts.links.total - facts.links.external,
      externalLinks: facts.links.external,
      h1Count: facts.h1Count,
      pageSizeKb: Math.round(facts.htmlBytes / 1024),
      jsonLdBlocks: facts.jsonLdBlocks,
    },
    keywords: extra.keywords,
  };
}
