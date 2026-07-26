import type { Verdict } from '@adysre/rules-types';
import type { DecisionReason } from './decide.ts';
import type { NodeState } from './tree.ts';

/**
 * Every word the debugger says.
 *
 * Same record, same reason, as the builder's `BuilderLabels` and the renderer's
 * `Phrases`: plugins carry `labelKey` and never a label, so the English has to
 * live somewhere replaceable. The ecosystem ships English only - this is a seam
 * a host can use, not an i18n dependency the package carries.
 */
export interface DebuggerLabels {
  title: string;
  verdict: string;
  duration: string;
  decidedBy: string;
  received: string;
  diagnostics: string;
  showSkipped: string;
  hideSkipped: string;

  /** Findings from the second, exhaustive run. */
  hiddenErrorsTitle: string;
  hiddenErrorsBody: string;
  disagreedTitle: string;
  disagreedBody: string;
  skippedCount: string;
  nothingHidden: string;

  states: Readonly<Record<NodeState, string>>;
  verdicts: Readonly<Record<Verdict, string>>;
  reasons: Readonly<Record<DecisionReason, string>>;
  combinators: Readonly<Record<'all' | 'any' | 'none', string>>;
  negated: string;
  unknownOperator: string;
}

export const englishDebuggerLabels: DebuggerLabels = {
  title: 'Why this answer',
  verdict: 'Verdict',
  duration: 'Took',
  decidedBy: 'Decided by',
  received: 'The operator received',
  diagnostics: 'Notes',
  showSkipped: 'Show what was skipped',
  hideSkipped: 'Hide what was skipped',

  hiddenErrorsTitle: 'Short-circuiting hid an error',
  hiddenErrorsBody:
    'A branch the fast path stepped over cannot be evaluated. This rule answers as it does by luck, and will change the day the group is reordered.',
  disagreedTitle: 'The two runs disagree',
  disagreedBody:
    'Running every branch produced a different verdict from running the rule as it really runs.',
  skippedCount: 'branches never ran',
  nothingHidden: 'Every branch ran. Nothing was skipped.',

  states: {
    matched: 'Matched',
    unmatched: 'Did not match',
    skipped: 'Skipped',
    errored: 'Could not be evaluated',
    notRun: 'Never ran',
  },
  verdicts: {
    matched: 'Matched',
    unmatched: 'Did not match',
    skipped: 'Skipped',
    errored: 'Could not be evaluated',
  },
  reasons: {
    errored: 'this could not be evaluated, and an error outranks any combinator',
    shortCircuit: 'this settled the group on its own, so nothing after it ran',
    sole: 'it is the only condition here',
    collective: 'every condition contributed, so no single one decided',
    empty: 'there are no conditions, and an empty group matches',
    condition: 'it is the only thing being tested',
    notRun: 'this branch never ran',
  },
  combinators: {
    all: 'all of these are true',
    any: 'any of these are true',
    none: 'none of these are true',
  },
  negated: 'inverted',
  unknownOperator: 'no operator by that name is registered',
};

export function debuggerLabelsWith(overrides: Partial<DebuggerLabels> | undefined): DebuggerLabels {
  if (overrides === undefined) return englishDebuggerLabels;
  return {
    ...englishDebuggerLabels,
    ...overrides,
    states: { ...englishDebuggerLabels.states, ...overrides.states },
    verdicts: { ...englishDebuggerLabels.verdicts, ...overrides.verdicts },
    reasons: { ...englishDebuggerLabels.reasons, ...overrides.reasons },
    combinators: { ...englishDebuggerLabels.combinators, ...overrides.combinators },
  };
}
