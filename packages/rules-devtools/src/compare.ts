import type { RuleOutcome, TraceEvent, Verdict } from '@adysre/rules-types';

/**
 * What the fast path never looked at.
 *
 * Short-circuiting is right - `all` has no reason to keep going after the first
 * failure - but it means the trace of a real run is a trace of PART of the rule,
 * and the part it skipped is exactly where a bug hides longest. A condition with
 * a typo'd field or an operator nobody registered sits behind a passing sibling
 * and never runs, so nothing ever reports it.
 *
 * So the debugger runs the rule twice: once as it really runs, and once with
 * `shortCircuit: false`, which is what that option exists for. The difference
 * between the two is this.
 *
 * The finding that matters is `hiddenErrors`. A rule that answers `matched`
 * only because the fast path stepped over a broken branch is a rule that will
 * change its answer the day somebody reorders a group, and it is invisible in
 * every report until then.
 */

export interface SkippedNode {
  nodeId: string;
  /** What it turned out to be, once it was made to run. */
  verdict: Verdict;
  /** Present when it errored. */
  error: string | undefined;
}

export interface RunComparison {
  /** Nodes that ran only in the exhaustive pass. */
  skipped: SkippedNode[];
  /** Those of them that could not be evaluated. */
  hiddenErrors: SkippedNode[];
  /**
   * Whether the two runs agreed.
   *
   * They usually do. When they do not it is almost always `hiddenErrors`: an
   * error anywhere makes the whole rule `errored`, so a rule that reports
   * `matched` at speed and `errored` in full is passing by luck.
   */
  agreed: boolean;
  fastVerdict: Verdict;
  fullVerdict: Verdict;
}

export function compareRuns(fast: RuleOutcome, full: RuleOutcome): RunComparison {
  const ran = new Set(fast.trace.map((event) => event.nodeId));

  const skipped = full.trace
    .filter((event) => !ran.has(event.nodeId))
    .map((event: TraceEvent): SkippedNode => ({
      nodeId: event.nodeId,
      verdict: event.verdict,
      error: event.error,
    }));

  return {
    skipped,
    hiddenErrors: skipped.filter((entry) => entry.verdict === 'errored'),
    agreed: fast.verdict === full.verdict,
    fastVerdict: fast.verdict,
    fullVerdict: full.verdict,
  };
}

/** Whether anything here is worth interrupting somebody about. */
export function hasFindings(comparison: RunComparison): boolean {
  return comparison.hiddenErrors.length > 0 || !comparison.agreed;
}
