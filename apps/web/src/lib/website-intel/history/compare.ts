import type { ScanResult } from '../types';
import type { ScanComparison } from './types';

/**
 * Diff two scans of the same site. Pure, so history comparison is testable with
 * no store and no clock: overall and per-category deltas, plus which findings
 * were fixed (`resolved`) and which are new (`introduced`) since last time.
 */
export function compareScans(
  previous: ScanResult,
  current: ScanResult,
  previousId: string,
  previousAt: string,
): ScanComparison {
  const priorScores = new Map(previous.categories.map((c) => [c.category, c.score]));
  const categoryDeltas = current.categories.map((c) => ({
    category: c.category,
    // No prior entry for a category ⇒ no movement to report for it.
    delta: c.score - (priorScores.get(c.category) ?? c.score),
  }));

  const priorFindings = new Set(previous.findings.map((f) => f.ruleId));
  const currentFindings = new Set(current.findings.map((f) => f.ruleId));

  return {
    previousId,
    previousAt,
    overallDelta: current.overallScore - previous.overallScore,
    categoryDeltas,
    resolved: [...priorFindings].filter((id) => !currentFindings.has(id)),
    introduced: [...currentFindings].filter((id) => !priorFindings.has(id)),
  };
}
