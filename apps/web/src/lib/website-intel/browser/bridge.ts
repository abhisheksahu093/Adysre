import type { Category, Finding, Severity, WebVitals } from '../types';

/**
 * The Lighthouse / axe-core bridge.
 *
 * Pure translation from the two tools' report shapes into this platform's
 * `Finding`, category scores and `WebVitals`. Keeping it a pure function of the
 * report JSON is what lets the browser phase be tested without a browser: feed
 * a captured Lighthouse result or axe result, assert the findings and scores.
 * The Playwright adapter's only job is to produce those reports and hand them
 * here.
 */

/* ── Minimal shapes we read (the real reports carry far more) ──────────────── */

interface LhAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  scoreDisplayMode: string;
  numericValue?: number;
  displayValue?: string;
}

interface LhCategory {
  id: string;
  score: number | null;
  auditRefs: Array<{ id: string }>;
}

export interface LighthouseReport {
  categories: Record<string, LhCategory>;
  audits: Record<string, LhAudit>;
}

export interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  help: string;
  description: string;
  helpUrl?: string;
  nodes: unknown[];
}

export interface AxeReport {
  violations: AxeViolation[];
}

/* ── Category mapping ──────────────────────────────────────────────────────── */

/** Lighthouse category id → this platform's category. Unmapped ones (pwa) drop. */
const LH_CATEGORY: Record<string, Category> = {
  performance: 'performance',
  accessibility: 'accessibility',
  'best-practices': 'bestPractices',
  seo: 'seo',
};

/** Lighthouse audit score (0-1) → severity. Only failing audits become findings. */
function auditSeverity(score: number): Severity {
  if (score < 0.5) return 'serious';
  return 'moderate';
}

/** axe impact → severity, defaulting the null impact to minor. */
function axeSeverity(impact: AxeViolation['impact']): Severity {
  return impact ?? 'minor';
}

/** Trim Lighthouse's markdown link syntax down to plain text for our UI. */
function plain(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').trim();
}

/* ── Public bridge functions ───────────────────────────────────────────────── */

/** Authoritative 0-100 category scores from a Lighthouse report. */
export function lighthouseScores(report: LighthouseReport): Partial<Record<Category, number>> {
  const scores: Partial<Record<Category, number>> = {};
  for (const [lhId, category] of Object.entries(report.categories)) {
    const mapped = LH_CATEGORY[lhId];
    if (mapped && category.score != null) scores[mapped] = Math.round(category.score * 100);
  }
  return scores;
}

/** Findings from every failing, scored Lighthouse audit. */
export function lighthouseFindings(report: LighthouseReport): Finding[] {
  const findings: Finding[] = [];
  const seen = new Set<string>();

  for (const [lhId, category] of Object.entries(report.categories)) {
    const mapped = LH_CATEGORY[lhId];
    if (!mapped) continue;

    for (const ref of category.auditRefs) {
      const audit = report.audits[ref.id];
      if (!audit || seen.has(audit.id)) continue;
      // Only numeric/binary audits carry a pass/fail score; informative,
      // manual and not-applicable audits are guidance, not findings.
      if (audit.score == null) continue;
      if (audit.scoreDisplayMode !== 'numeric' && audit.scoreDisplayMode !== 'binary') continue;
      if (audit.score >= 0.9) continue;

      seen.add(audit.id);
      findings.push({
        ruleId: `lh-${audit.id}`,
        category: mapped,
        severity: auditSeverity(audit.score),
        description: plain(audit.title),
        fix: plain(audit.description) || 'See the Lighthouse audit for details.',
        impact: `Lighthouse ${lhId} audit.`,
        ...(audit.displayValue ? { estimatedSavings: audit.displayValue } : {}),
      });
    }
  }
  return findings;
}

/** Core Web Vitals and lab timings from a Lighthouse report. */
export function webVitalsFrom(report: LighthouseReport): WebVitals {
  const num = (id: string): number | undefined => {
    const value = report.audits[id]?.numericValue;
    return typeof value === 'number' ? value : undefined;
  };
  const round = (n: number | undefined) => (n == null ? undefined : Math.round(n));

  const vitals: WebVitals = {};
  const lcp = round(num('largest-contentful-paint'));
  const fcp = round(num('first-contentful-paint'));
  const tbt = round(num('total-blocking-time'));
  const ttfb = round(num('server-response-time'));
  const inp = round(num('interaction-to-next-paint'));
  const clsRaw = num('cumulative-layout-shift');

  if (lcp != null) vitals.lcp = lcp;
  if (fcp != null) vitals.fcp = fcp;
  if (tbt != null) vitals.tbt = tbt;
  if (ttfb != null) vitals.ttfb = ttfb;
  if (inp != null) vitals.inp = inp;
  if (clsRaw != null) vitals.cls = Math.round(clsRaw * 1000) / 1000;
  return vitals;
}

/** Findings from axe-core violations. */
export function axeFindings(report: AxeReport): Finding[] {
  return report.violations.map((violation) => ({
    ruleId: `axe-${violation.id}`,
    category: 'accessibility' as Category,
    severity: axeSeverity(violation.impact),
    description: violation.help,
    fix: violation.description || violation.help,
    impact: `Affects ${violation.nodes.length} element${violation.nodes.length === 1 ? '' : 's'} on the page.`,
    ...(violation.helpUrl ? { documentation: violation.helpUrl } : {}),
  }));
}
