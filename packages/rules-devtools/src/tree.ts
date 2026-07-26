import type { RuleDocument, RuleNode, TraceEvent, Verdict } from '@adysre/rules-types';

/**
 * The trace, back in the shape of the rule.
 *
 * A `RuleOutcome` carries a FLAT list of events, which is the right shape to
 * produce (one push per node, no tree to maintain mid-evaluation) and the wrong
 * shape to read: nobody debugging a rule wants a list of twelve events in
 * completion order. This puts each event back on the node it came from.
 *
 * Built from the AST rather than from the trace, because the AST is the only
 * one of the two that is COMPLETE. A short-circuited branch leaves no event at
 * all, and a tree assembled from events alone would silently omit exactly the
 * nodes a debugger exists to ask about. Walking the rule and attaching what ran
 * makes "did not run" a visible state instead of an absence.
 */

/** A node that did not run leaves no event, and that is worth naming. */
export const NOT_RUN = 'notRun';

export type NodeState = Verdict | typeof NOT_RUN;

export interface TraceNode {
  /** The AST node. Its id, operator and comment all come from here. */
  node: RuleNode;
  /** What the executor recorded, when this node ran. */
  event: TraceEvent | undefined;
  state: NodeState;
  children: TraceNode[];
  depth: number;
}

export function traceTree(rule: RuleDocument, trace: readonly TraceEvent[]): TraceNode {
  const events = new Map(trace.map((event) => [event.nodeId, event]));
  return attach(rule.when, events, 0);
}

function attach(node: RuleNode, events: ReadonlyMap<string, TraceEvent>, depth: number): TraceNode {
  const event = events.get(node.id);

  return {
    node,
    event,
    state: event?.verdict ?? NOT_RUN,
    children:
      node.kind === 'group' ? node.children.map((child) => attach(child, events, depth + 1)) : [],
    depth,
  };
}

/** Every node in the tree, parents before children. */
export function flatten(tree: TraceNode): TraceNode[] {
  const out: TraceNode[] = [];
  const stack: TraceNode[] = [tree];

  // Iterative, for the same reason the executor is: an imported rule was not
  // authored by anyone you know, and a stack overflow inside a debugger has no
  // useful message.
  while (stack.length > 0) {
    const current = stack.pop();
    if (current === undefined) break;
    out.push(current);
    for (let index = current.children.length - 1; index >= 0; index -= 1) {
      const child = current.children[index];
      if (child !== undefined) stack.push(child);
    }
  }

  return out;
}

export function findTraceNode(tree: TraceNode, nodeId: string): TraceNode | undefined {
  return flatten(tree).find((entry) => entry.node.id === nodeId);
}

/**
 * The same tree, from a trace with no rule to hand.
 *
 * Possible only because the executor pushes CHILDREN BEFORE PARENTS and records
 * `children` on every group event, which is what lets a reader rebuild the
 * structure from the list alone. That property is the reason this function can
 * exist, so here is the one thing that depends on it.
 *
 * Lossier than `traceTree` and deliberately so: a node that never ran was never
 * recorded, so it cannot appear. Use it for a stored outcome whose rule is gone,
 * and `traceTree` whenever the rule is available.
 */
export function treeFromTrace(trace: readonly TraceEvent[]): TraceNode | undefined {
  const built = new Map<string, TraceNode>();

  for (const event of trace) {
    const children = (event.children ?? [])
      .map((id) => built.get(id))
      .filter((child): child is TraceNode => child !== undefined);

    built.set(event.nodeId, {
      // Enough of a node to render: the trace does not carry operands, and
      // inventing them would be a debugger that shows a rule nobody wrote.
      node:
        event.kind === 'group'
          ? { kind: 'group', id: event.nodeId, combinator: 'all', children: [] }
          : {
              kind: 'condition',
              id: event.nodeId,
              left: { source: 'literal', value: null },
              operator: event.operator ?? '',
              args: [],
            },
      event,
      state: event.verdict,
      children,
      depth: 0,
    });
  }

  // The last event is the root: parents are recorded after their children.
  const last = trace[trace.length - 1];
  const root = last === undefined ? undefined : built.get(last.nodeId);
  if (root !== undefined) redepth(root, 0);
  return root;
}

function redepth(node: TraceNode, depth: number): void {
  node.depth = depth;
  for (const child of node.children) redepth(child, depth + 1);
}
