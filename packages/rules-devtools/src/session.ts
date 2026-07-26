import { evaluateRule, type Registry } from '@adysre/rules-core';
import type {
  EvaluationContext,
  EvaluationOptions,
  RuleDocument,
  RuleOutcome,
} from '@adysre/rules-types';
import { compareRuns, type RunComparison } from './compare.ts';
import { decisionFor, type Decision } from './decide.ts';
import { traceTree, type TraceNode } from './tree.ts';

/**
 * One debugging run, which is really two.
 *
 * The first is the rule EXACTLY as it runs in production: short-circuiting on,
 * because a debugger that only ever showed the exhaustive pass would be
 * explaining a different execution from the one somebody is asking about.
 *
 * The second turns short-circuiting off and exists to answer the question the
 * first cannot: what is in the branches it skipped. Both are cheap - evaluation
 * is synchronous and pure - so there is no reason to make anyone choose.
 *
 * Nothing here is stateful and nothing is async, which is what lets a host call
 * it during render and re-run it on every keystroke.
 */

export interface DebugSession {
  /** The real run: short-circuiting on, which is how the rule behaves. */
  outcome: RuleOutcome;
  /** The exhaustive run, for what the fast path never reached. */
  full: RuleOutcome;
  /** The real run's trace, back in the shape of the rule. */
  tree: TraceNode;
  /** The exhaustive run's tree, where nothing is missing. */
  fullTree: TraceNode;
  /** Which row decided the verdict, or an admission that several did. */
  decision: Decision;
  comparison: RunComparison;
}

export function debugRule(
  registry: Registry,
  rule: RuleDocument,
  context: EvaluationContext,
  options: EvaluationOptions = {},
): DebugSession {
  // `trace: true` regardless of what a caller asked, because a session without
  // one is a session with nothing to show. Everything else - the timeout, the
  // depth ceiling, the clock - is theirs to set, so the debugged run is bounded
  // the same way the real one is.
  const fast = evaluateRule(registry, rule, context, {
    ...options,
    trace: true,
    shortCircuit: true,
  });

  const full = evaluateRule(registry, rule, context, {
    ...options,
    trace: true,
    shortCircuit: false,
  });

  const tree = traceTree(rule, fast.trace);

  return {
    outcome: fast,
    full,
    tree,
    fullTree: traceTree(rule, full.trace),
    decision: decisionFor(tree),
    comparison: compareRuns(fast, full),
  };
}
