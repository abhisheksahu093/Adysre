import type { Category, CategoryScore, Finding, Severity } from './types';
import { RULES } from './rules';

/**
 * Scoring.
 *
 * Each scored category starts at 100 and loses points per finding, weighted by
 * severity. A category floors at 0. The overall score is the mean of the scored
 * categories - a simple, explainable model, which matters more here than a
 * clever one nobody can reason about when a client asks why they got a 72.
 *
 * Only categories that actually have rules are scored, so the browser-phase
 * categories (`performance`) do not show a misleading 100 before their
 * analyzers exist.
 */
const SEVERITY_PENALTY: Record<Severity, number> = {
  critical: 50,
  serious: 25,
  moderate: 12,
  minor: 5,
  info: 1,
};

/** The categories the current rule set can actually score, in a stable order. */
export const SCORED_CATEGORIES: Category[] = (() => {
  const order: Category[] = ['performance', 'seo', 'accessibility', 'bestPractices', 'security', 'html', 'assets'];
  const present = new Set(RULES.map((r) => r.category));
  return order.filter((c) => present.has(c));
})();

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Score each scored category from the findings that belong to it. */
export function scoreByCategory(findings: Finding[]): CategoryScore[] {
  return SCORED_CATEGORIES.map((category) => {
    const own = findings.filter((f) => f.category === category);
    const penalty = own.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0);
    return { category, score: clamp(100 - penalty), findings: own };
  });
}

/** The mean of the category scores, rounded. 100 when there is nothing scored. */
export function overallScore(categories: CategoryScore[]): number {
  if (categories.length === 0) return 100;
  const total = categories.reduce((sum, c) => sum + c.score, 0);
  return Math.round(total / categories.length);
}
