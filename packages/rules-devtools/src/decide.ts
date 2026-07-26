import type { Verdict } from '@adysre/rules-types';
import { NOT_RUN, type TraceNode } from './tree.ts';

/**
 * Which condition decided it.
 *
 * The question a rules engine exists to answer in the moment it matters most:
 * a business user insists the rule is wrong, and somebody has to show the one
 * row that produced the answer. A verdict alone cannot; a twelve-event trace
 * technically can, and nobody will.
 *
 * The honest part is that there is not always ONE. `all` matching means every
 * child matched, and naming the last of them would be a debugger asserting
 * something false about a rule somebody is about to change. So a collective
 * verdict says so, and only a genuine short-circuit names a row.
 */

export type DecisionReason =
  /** A node could not be evaluated, and an error outranks any combinator. */
  | 'errored'
  /** The combinator stopped here: this child alone settled the group. */
  | 'shortCircuit'
  /** The group had one child, so its child is the whole story. */
  | 'sole'
  /** Every child contributed. No single row decided anything. */
  | 'collective'
  /** No conditions at all, which matches. */
  | 'empty'
  /** A condition, which decides itself. */
  | 'condition'
  /** The branch never ran. */
  | 'notRun';

export interface Decision {
  /** Root first, the deciding node last. Always at least the root. */
  path: TraceNode[];
  /** How the LAST node in the path came to decide. */
  reason: DecisionReason;
  /** The deciding node, which is the last of the path. */
  node: TraceNode;
}

/** `matched` and `unmatched` swap; anything else is unaffected by a negate. */
function invert(state: Verdict): Verdict {
  if (state === 'matched') return 'unmatched';
  if (state === 'unmatched') return 'matched';
  return state;
}

/**
 * What the COMBINATOR concluded, before `negate` flipped it.
 *
 * A negated group reports the opposite of what its children produced, so
 * looking for "the child that made this group unmatched" against the reported
 * verdict finds the wrong child - or none - on every negated group in the tree.
 */
function combinatorVerdict(entry: TraceNode): Verdict | typeof NOT_RUN {
  if (entry.state === NOT_RUN) return NOT_RUN;
  return entry.node.negate === true ? invert(entry.state) : entry.state;
}

function step(entry: TraceNode): { child: TraceNode | undefined; reason: DecisionReason } {
  if (entry.state === NOT_RUN) return { child: undefined, reason: 'notRun' };

  if (entry.state === 'errored') {
    // An error wins over a combinator that had already decided, so the errored
    // node is the answer wherever it sits. Its own children may be fine.
    const failed = entry.children.find((child) => child.state === 'errored');
    return { child: failed, reason: 'errored' };
  }

  if (entry.node.kind === 'condition') return { child: undefined, reason: 'condition' };
  if (entry.children.length === 0) return { child: undefined, reason: 'empty' };

  const verdict = combinatorVerdict(entry);

  // The verdict a child must have carried to settle the group on its own. `all`
  // is settled by a failure, `any` by a success, and `none` by a success too -
  // a match is what makes "none of these" false.
  const decisive: Verdict | undefined =
    entry.node.combinator === 'all'
      ? verdict === 'unmatched'
        ? 'unmatched'
        : undefined
      : entry.node.combinator === 'any'
        ? verdict === 'matched'
          ? 'matched'
          : undefined
        : verdict === 'unmatched'
          ? 'matched'
          : undefined;

  if (decisive === undefined) {
    // Nothing short-circuited, so every child had to agree - unless there was
    // only one, in which case it is still the whole story.
    return entry.children.length === 1
      ? { child: entry.children[0], reason: 'sole' }
      : { child: undefined, reason: 'collective' };
  }

  const settled = entry.children.find((child) => child.state === decisive);
  return settled === undefined
    ? { child: undefined, reason: 'collective' }
    : { child: settled, reason: 'shortCircuit' };
}

/**
 * Walk down to the row that decided the verdict.
 *
 * Iterative and bounded by the tree it was given, and it cannot loop: every
 * step descends into a child.
 */
export function decisionFor(tree: TraceNode): Decision {
  const path: TraceNode[] = [tree];
  let current = tree;
  let outcome = step(current);
  /** How the node we are standing on came to be chosen by its parent. */
  let selecting = outcome.reason;

  while (outcome.child !== undefined) {
    selecting = outcome.reason;
    current = outcome.child;
    path.push(current);
    outcome = step(current);
  }

  // Two reasons are in play at the end, and which one is worth reporting
  // depends on WHERE the walk stopped.
  //
  // Stopping at a group means nothing inside it settled anything, and that
  // terminal fact - `collective`, `empty` - is the explanation.
  //
  // Stopping at a condition is different: `condition` says only "this is a
  // leaf", which is true and tells nobody anything. What the reader wants is
  // why the walk came down here at all, which is the step that chose it. Report
  // the terminal reason there and `isSingleCause` would be false for the
  // commonest case there is: a rule settled by one row.
  const reason = outcome.reason === 'condition' && path.length > 1 ? selecting : outcome.reason;

  return { path, reason, node: current };
}

/** Whether the decision names one row, or admits that several share the credit. */
export function isSingleCause(decision: Decision): boolean {
  return decision.reason === 'shortCircuit' || decision.reason === 'errored';
}
