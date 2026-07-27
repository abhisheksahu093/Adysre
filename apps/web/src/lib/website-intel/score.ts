import type { Category, CategoryScore, Finding, Severity } from './types';
import { RULES } from './rules';

/**
 * Scoring.
 *
 * Each scored category starts at 100 and loses points per finding, weighted by
 * severity. A category floors at 0. A simple, explainable model, which matters
 * more here than a clever one nobody can reason about when a client asks why
 * they got a 72.
 *
 * Only categories that actually have rules are scored, so the browser-phase
 * categories (`performance`) do not show a misleading 100 before their
 * analyzers exist.
 *
 * ─── What the overall score is, and is not ──────────────────────────────────
 * It is the weighted mean of the categories below, and nothing else. It is NOT
 * a performance grade: this scan never runs a browser, so it has no Largest
 * Contentful Paint, no Total Blocking Time and no layout-shift measurement. A
 * Lighthouse-based headline (PageSpeed Insights, GTmetrix) is mostly those
 * three, so the two numbers answer different questions and will not agree -
 * which is why {@link UNMEASURED_CATEGORIES} is published beside the score
 * rather than left for a reader to infer.
 */
const SEVERITY_PENALTY: Record<Severity, number> = {
  critical: 50,
  serious: 25,
  moderate: 12,
  minor: 5,
  info: 1,
};

/**
 * How much each category counts toward the overall, out of 100.
 *
 * FIXED, and deliberately not derived from how many rules a category happens
 * to have. Two reasons:
 *
 * 1. Honesty. An unweighted mean gave `accessibility` - one rule today - the
 *    same say as `security` with seven, so a category that is barely measured
 *    was lifting every site's headline toward 100.
 * 2. Stability. A scan is compared against the previous scan of the same site
 *    (`history/compare`). If weights moved whenever somebody added a rule,
 *    every site's score would drift on deploy and the comparison would report
 *    a change nobody made.
 *
 * `accessibility` is held low on purpose: one alt-text check is not an
 * accessibility audit. It rises when the browser phase brings axe-core, and
 * that will be a deliberate, noted change rather than a side effect.
 */
export const CATEGORY_WEIGHTS: Partial<Record<Category, number>> = {
  /*
   * Declared before it exists, on purpose. Nothing produces a `performance`
   * category until the browser phase, and a weight for an absent category is
   * simply never used - but the day Lighthouse lands, its score has to move the
   * headline instead of being silently ignored for want of a weight.
   */
  performance: 25,
  seo: 25,
  security: 25,
  assets: 20,
  html: 15,
  bestPractices: 10,
  accessibility: 5,
};

/**
 * What this scan does not measure, published so nobody reads the score as if
 * it did. Each id resolves to the same label keys the scored categories use.
 */
export const UNMEASURED_CATEGORIES: Category[] = ['performance'];

/** The categories the current rule set can actually score, in a stable order. */
export const SCORED_CATEGORIES: Category[] = (() => {
  const order: Category[] = ['performance', 'seo', 'accessibility', 'bestPractices', 'security', 'html', 'assets'];
  const present = new Set(RULES.map((r) => r.category));
  return order.filter((c) => present.has(c));
})();

/** How many checks back each category, so a score can be read as "n of m". */
const CHECKS_BY_CATEGORY = new Map<Category, number>(
  SCORED_CATEGORIES.map((category) => [category, RULES.filter((r) => r.category === category).length]),
);

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

/** Score each scored category from the findings that belong to it. */
export function scoreByCategory(findings: Finding[]): CategoryScore[] {
  return SCORED_CATEGORIES.map((category) => {
    const own = findings.filter((f) => f.category === category);
    const penalty = own.reduce((sum, f) => sum + SEVERITY_PENALTY[f.severity], 0);
    const checks = CHECKS_BY_CATEGORY.get(category) ?? 0;

    return {
      category,
      score: clamp(100 - penalty),
      findings: own,
      // Published so a 100 reads as "8 of 8 checks passed" rather than
      // "perfect", and a thin category cannot pass itself off as a full audit.
      checks,
      passed: Math.max(0, checks - own.length),
    };
  });
}

/**
 * The weighted mean of the category scores, rounded.
 *
 * A category with no declared weight is excluded rather than silently counted
 * at zero, so adding a category to the rule set is a two-line change here and
 * never a surprise to everybody's score.
 */
export function overallScore(categories: CategoryScore[]): number {
  let weighted = 0;
  let total = 0;

  for (const category of categories) {
    const weight = CATEGORY_WEIGHTS[category.category];
    if (weight === undefined) continue;
    weighted += category.score * weight;
    total += weight;
  }

  if (total === 0) return 100;
  return Math.round(weighted / total);
}
