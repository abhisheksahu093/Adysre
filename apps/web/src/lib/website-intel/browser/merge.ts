import type { Category, CategoryScore, ScanResult } from '../types';
import type { BrowserAnalysis } from './types';
import { overallScore } from '../score';

/**
 * Fold a browser analysis into a browserless scan result. Pure.
 *
 * The browser scores are authoritative for the categories they cover (Lighthouse
 * measures performance and accessibility far more deeply than a markup pass can),
 * so they replace the browserless category score and add `performance`, which the
 * browserless engine has no way to produce. Every finding is merged and re-sorted
 * worst-first, and the overall score is recomputed over the combined categories.
 */

const SEVERITY_ORDER = { critical: 0, serious: 1, moderate: 2, minor: 3, info: 4 } as const;

export function applyBrowserAnalysis(result: ScanResult, analysis: BrowserAnalysis): ScanResult {
  const findings = [...result.findings, ...analysis.findings].sort(
    (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity],
  );

  const findingsFor = (category: Category) => findings.filter((f) => f.category === category);

  // Start from the browserless categories, keyed for upsert.
  const byCategory = new Map<Category, CategoryScore>(
    result.categories.map((c) => [c.category, { ...c }]),
  );

  // Apply the authoritative browser scores (adds performance, overrides others).
  for (const [category, score] of Object.entries(analysis.scores) as Array<[Category, number]>) {
    byCategory.set(category, { category, score, findings: [] });
  }

  // Refresh every category's finding list from the merged, sorted set.
  for (const entry of byCategory.values()) entry.findings = findingsFor(entry.category);

  const categories = [...byCategory.values()];

  return {
    ...result,
    findings,
    categories,
    overallScore: overallScore(categories),
    metrics: { ...result.metrics, webVitals: analysis.webVitals },
  };
}
