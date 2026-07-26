import {
  isCondition,
  isGroup,
  type ConditionNode,
  type GroupNode,
  type Operand,
  type RuleDocument,
  type RuleNode,
} from '@adysre/rules-types';

/**
 * Walking the tree.
 *
 * Every other package needs to traverse an AST - the executor to evaluate it,
 * the renderer to describe it, the validator to check it, the builder to find
 * the node someone clicked, an analyser to list which fields a rule reads.
 * Written once here, they cannot disagree about what "the children of a node"
 * means, and none of them has to re-derive the recursion.
 *
 * All of it is iterative rather than recursive. A rule tree is authored by
 * hand and is rarely deep, but an IMPORTED one is not authored by anyone, and a
 * stack overflow inside a rules engine is a crash with no useful message.
 */

/** Every node in the tree, parents before children. */
export function* walk(root: RuleNode): Generator<RuleNode> {
  const stack: RuleNode[] = [root];

  while (stack.length > 0) {
    const node = stack.pop()!;
    yield node;
    if (isGroup(node)) {
      // Reversed, so children are yielded left to right despite the stack.
      for (let index = node.children.length - 1; index >= 0; index -= 1) {
        stack.push(node.children[index]!);
      }
    }
  }
}

/** Every node, with the path of ancestors that led to it. */
export function* walkWithPath(root: RuleNode): Generator<{ node: RuleNode; path: RuleNode[] }> {
  const stack: { node: RuleNode; path: RuleNode[] }[] = [{ node: root, path: [] }];

  while (stack.length > 0) {
    const entry = stack.pop()!;
    yield entry;
    if (isGroup(entry.node)) {
      const path = [...entry.path, entry.node];
      for (let index = entry.node.children.length - 1; index >= 0; index -= 1) {
        stack.push({ node: entry.node.children[index]!, path });
      }
    }
  }
}

/** The node with this id, or `undefined`. */
export function findNode(root: RuleNode, id: string): RuleNode | undefined {
  for (const node of walk(root)) {
    if (node.id === id) return node;
  }
  return undefined;
}

/** The ancestors of a node, outermost first. Empty for the root. */
export function pathTo(root: RuleNode, id: string): RuleNode[] {
  for (const { node, path } of walkWithPath(root)) {
    if (node.id === id) return path;
  }
  return [];
}

export function conditions(root: RuleNode): ConditionNode[] {
  return [...walk(root)].filter(isCondition);
}

export function groups(root: RuleNode): GroupNode[] {
  return [...walk(root)].filter(isGroup);
}

/** How many nodes the tree holds. Drives "this rule is getting large" hints. */
export function countNodes(root: RuleNode): number {
  let total = 0;
  for (const _node of walk(root)) total += 1;
  return total;
}

/** Nesting depth. A single condition at the root is depth 1. */
export function depth(root: RuleNode): number {
  let deepest = 0;
  for (const { path } of walkWithPath(root)) {
    deepest = Math.max(deepest, path.length + 1);
  }
  return deepest;
}

/** Every operand in an operand tree, including a function's arguments. */
export function* walkOperands(operand: Operand): Generator<Operand> {
  const stack: Operand[] = [operand];

  while (stack.length > 0) {
    const current = stack.pop()!;
    yield current;
    if (current.source === 'function') {
      for (let index = current.args.length - 1; index >= 0; index -= 1) {
        stack.push(current.args[index]!);
      }
    }
  }
}

/** Every operand a condition uses: its left-hand side and its arguments. */
export function* conditionOperands(node: ConditionNode): Generator<Operand> {
  yield* walkOperands(node.left);
  for (const argument of node.args) yield* walkOperands(argument);
}

/**
 * Which fields a rule reads.
 *
 * Sorted and de-duplicated, because the answer is used for things that must be
 * stable: showing an author what a rule depends on, working out which rules to
 * re-run when a field changes, and checking a rule against a schema.
 */
export function collectFields(rule: RuleDocument): string[] {
  const paths = new Set<string>();

  for (const node of walk(rule.when)) {
    if (!isCondition(node)) continue;
    for (const operand of conditionOperands(node)) {
      if (operand.source === 'field') paths.add(operand.path);
    }
  }

  for (const action of [...rule.then, ...(rule.otherwise ?? [])]) {
    if (action.target) paths.add(action.target);
    if (action.value) {
      for (const operand of walkOperands(action.value)) {
        if (operand.source === 'field') paths.add(operand.path);
      }
    }
  }

  return [...paths].sort();
}

/** Which variables a rule needs the host to supply. */
export function collectVariables(rule: RuleDocument): string[] {
  const names = new Set<string>();

  for (const node of walk(rule.when)) {
    if (!isCondition(node)) continue;
    for (const operand of conditionOperands(node)) {
      if (operand.source === 'variable') names.add(operand.name);
    }
  }

  for (const action of [...rule.then, ...(rule.otherwise ?? [])]) {
    if (!action.value) continue;
    for (const operand of walkOperands(action.value)) {
      if (operand.source === 'variable') names.add(operand.name);
    }
  }

  return [...names].sort();
}

/** Which operator and function plugins a rule needs registered to run. */
export function collectPluginIds(rule: RuleDocument): { operators: string[]; functions: string[] } {
  const operators = new Set<string>();
  const functions = new Set<string>();

  for (const node of walk(rule.when)) {
    if (!isCondition(node)) continue;
    operators.add(node.operator);
    for (const operand of conditionOperands(node)) {
      if (operand.source === 'function') functions.add(operand.name);
    }
  }

  for (const action of [...rule.then, ...(rule.otherwise ?? [])]) {
    if (!action.value) continue;
    for (const operand of walkOperands(action.value)) {
      if (operand.source === 'function') functions.add(operand.name);
    }
  }

  return { operators: [...operators].sort(), functions: [...functions].sort() };
}

/**
 * Replace one node, returning a new tree.
 *
 * Immutable, because the builder's undo stack and React's rendering both depend
 * on a changed tree being a different object. Untouched branches keep their
 * identity, so a re-render can skip them.
 *
 * @returns the new tree, or the original when the id was not found.
 */
export function replaceNode(root: RuleNode, id: string, next: RuleNode): RuleNode {
  if (root.id === id) return next;
  if (!isGroup(root)) return root;

  let changed = false;
  const children = root.children.map((child) => {
    const replaced = replaceNode(child, id, next);
    if (replaced !== child) changed = true;
    return replaced;
  });

  return changed ? { ...root, children } : root;
}

/** Remove a node. The root cannot be removed; the tree comes back unchanged. */
export function removeNode(root: RuleNode, id: string): RuleNode {
  if (!isGroup(root)) return root;

  let changed = false;
  const children: RuleNode[] = [];

  for (const child of root.children) {
    if (child.id === id) {
      changed = true;
      continue;
    }
    const pruned = removeNode(child, id);
    if (pruned !== child) changed = true;
    children.push(pruned);
  }

  return changed ? { ...root, children } : root;
}

/** Append a node to a group. */
export function addNode(root: RuleNode, parentId: string, node: RuleNode): RuleNode {
  const parent = findNode(root, parentId);
  if (!parent || !isGroup(parent)) return root;
  return replaceNode(root, parentId, { ...parent, children: [...parent.children, node] });
}
