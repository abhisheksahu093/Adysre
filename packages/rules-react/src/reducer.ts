import {
  action as buildAction,
  addNode,
  condition as buildCondition,
  createNodeId,
  findNode,
  group as buildGroup,
  literal,
  logicHash,
  removeNode,
  replaceNode,
  withNewIds,
  type IdFactory,
  type Registry,
} from '@adysre/rules-core';
import type { ActionNode, GroupNode, Operand, RuleDocument, RuleNode } from '@adysre/rules-types';
import type { BuilderAction, BuilderState, HistoryEntry } from './state';

/**
 * One pure function, and the whole of what a builder can do.
 *
 * It is pure and it is exported, which is the point of the package. A rule
 * builder's behaviour is mostly editing rules, not drawing them, and behaviour
 * scattered across component callbacks is behaviour no test can reach. Every
 * assertion in this package's tests calls this directly: no DOM, no renderer,
 * no act().
 *
 * It also never mutates. Every edit goes through the core's immutable helpers,
 * which return the SAME object for branches that did not change - so a history
 * entry is a new root and a handful of new nodes, not a copy of the tree, and
 * fifty undo steps cost about what one deep clone would.
 */

/** What the reducer needs that is not state: ids, and what the plugins are. */
export interface ReducerDeps {
  ids: IdFactory;
  /** Used to size a condition's arguments to its operator. Optional. */
  registry?: Pick<Registry, 'operator'> | undefined;
  /** How many undo steps to keep. Unbounded history is a memory leak. */
  historyLimit?: number | undefined;
  /** The operator a new condition starts with. */
  defaultOperator?: string | undefined;
}

const DEFAULT_HISTORY_LIMIT = 100;

export function initialState(rule: RuleDocument, selectedId: string | null = null): BuilderState {
  return { rule, selectedId, past: [], future: [], savedHash: logicHash(rule) };
}

/**
 * Record an edit.
 *
 * Consecutive edits with the same merge key replace the previous entry instead
 * of stacking, so typing a value is one undo step rather than one per keystroke.
 * Any edit clears the redo stack: a new branch of history means the old future
 * never happened, and offering it back is how an editor loses somebody's work.
 */
function commit(
  state: BuilderState,
  rule: RuleDocument,
  mergeKey: string | null,
  deps: ReducerDeps,
): BuilderState {
  if (rule === state.rule) return state;

  const limit = deps.historyLimit ?? DEFAULT_HISTORY_LIMIT;
  const previous = state.past[state.past.length - 1];
  const merges = mergeKey !== null && previous !== undefined && previous.mergeKey === mergeKey;

  const entry: HistoryEntry = { rule: state.rule, mergeKey };
  const past = merges ? state.past : [...state.past, entry].slice(-limit);

  return { ...state, rule, past, future: [] };
}

/** Replace the condition tree, keeping the rest of the document as it was. */
function withTree(rule: RuleDocument, when: RuleNode): RuleDocument {
  // `when` is always a group. A helper that produced anything else would be a
  // helper that made every walker in the system handle a second root shape.
  return when.kind === 'group' ? { ...rule, when } : rule;
}

function targetGroup(rule: RuleDocument, parentId: string | undefined): string {
  return parentId ?? rule.when.id;
}

function operandSlot(node: RuleNode, slot: 'left' | number, operand: Operand): RuleNode {
  if (node.kind !== 'condition') return node;
  if (slot === 'left') return { ...node, left: operand };

  const args = [...node.args];
  while (args.length <= slot) args.push(literal(null));
  args[slot] = operand;
  return { ...node, args };
}

/**
 * Resize a condition's arguments to fit its operator.
 *
 * Changing `equals` to `between` leaves a condition needing two values where it
 * had one, and a builder that did not notice would render a row that cannot
 * run. Padding with an empty literal is honest - the author has not chosen the
 * second value yet - and truncating keeps the values they DID choose, in order.
 */
function fitArity(node: RuleNode, operator: string, deps: ReducerDeps): RuleNode {
  if (node.kind !== 'condition') return node;

  const arity = deps.registry?.operator(operator)?.arity;
  if (arity === undefined || arity === null) return { ...node, operator };

  const args = node.args.slice(0, arity);
  while (args.length < arity) args.push(literal(null));

  return { ...node, operator, args };
}

function editNode(
  state: BuilderState,
  id: string,
  edit: (node: RuleNode) => RuleNode,
  mergeKey: string | null,
  deps: ReducerDeps,
): BuilderState {
  const node = findNode(state.rule.when, id);
  if (node === undefined) return state;

  const next = edit(node);
  if (next === node) return state;

  return commit(state, withTree(state.rule, replaceNode(state.rule.when, id, next)), mergeKey, deps);
}

function editActions(
  state: BuilderState,
  edit: (actions: ActionNode[]) => ActionNode[],
  branch: 'then' | 'otherwise',
  mergeKey: string | null,
  deps: ReducerDeps,
): BuilderState {
  const current = (branch === 'then' ? state.rule.then : state.rule.otherwise) ?? [];
  const next = edit([...current]);
  return commit(state, { ...state.rule, [branch]: next }, mergeKey, deps);
}

/** Which branch holds this action, so a caller does not have to say. */
function branchOf(rule: RuleDocument, id: string): 'then' | 'otherwise' | null {
  if (rule.then.some((entry) => entry.id === id)) return 'then';
  if ((rule.otherwise ?? []).some((entry) => entry.id === id)) return 'otherwise';
  return null;
}

export function reduce(
  state: BuilderState,
  builderAction: BuilderAction,
  deps: ReducerDeps = { ids: createNodeId },
): BuilderState {
  switch (builderAction.type) {
    case 'load':
      // History is cleared: undo across two different rules is not an edit
      // anybody made, and offering it would restore a document the author never
      // saw in this session.
      return initialState(builderAction.rule, null);

    case 'markSaved':
      return { ...state, savedHash: logicHash(state.rule) };

    case 'select':
      // Not undoable. Undo is for changes to the rule, and a user pressing it
      // wants their last edit back, not their last click.
      return state.selectedId === builderAction.id
        ? state
        : { ...state, selectedId: builderAction.id };

    case 'undo': {
      const previous = state.past[state.past.length - 1];
      if (previous === undefined) return state;
      return {
        ...state,
        rule: previous.rule,
        past: state.past.slice(0, -1),
        future: [{ rule: state.rule, mergeKey: previous.mergeKey }, ...state.future],
      };
    }

    case 'redo': {
      const next = state.future[0];
      if (next === undefined) return state;
      return {
        ...state,
        rule: next.rule,
        past: [...state.past, { rule: state.rule, mergeKey: next.mergeKey }],
        future: state.future.slice(1),
      };
    }

    case 'setMeta': {
      const patch = builderAction.patch;
      const keys = Object.keys(patch);
      if (keys.length === 0) return state;
      // Merged per field, so typing a name is one undo step and changing the
      // kind afterwards is another.
      return commit(state, { ...state.rule, ...patch }, `meta:${keys.join(',')}`, deps);
    }

    case 'addCondition': {
      const node = buildCondition(
        {
          left: literal(null),
          operator: builderAction.operator ?? deps.defaultOperator ?? 'equals',
        },
        { ids: deps.ids },
      );
      const parentId = targetGroup(state.rule, builderAction.parentId);
      const when = addNode(state.rule.when, parentId, fitArity(node, node.operator, deps));
      if (when === state.rule.when) return state;

      return {
        ...commit(state, withTree(state.rule, when), null, deps),
        selectedId: node.id,
      };
    }

    case 'addGroup': {
      const node = buildGroup(builderAction.combinator ?? 'all', [], { ids: deps.ids });
      const parentId = targetGroup(state.rule, builderAction.parentId);
      const when = addNode(state.rule.when, parentId, node);
      if (when === state.rule.when) return state;

      return { ...commit(state, withTree(state.rule, when), null, deps), selectedId: node.id };
    }

    case 'remove': {
      // The root is the rule's conditions, not a row: removing it would leave a
      // document with no `when` at all.
      if (builderAction.id === state.rule.when.id) return state;

      const when = removeNode(state.rule.when, builderAction.id);
      if (when === state.rule.when) return state;

      const next = commit(state, withTree(state.rule, when), null, deps);
      return state.selectedId === builderAction.id ? { ...next, selectedId: null } : next;
    }

    case 'duplicate': {
      const node = findNode(state.rule.when, builderAction.id);
      if (node === undefined || node.id === state.rule.when.id) return state;

      const parent = parentOf(state.rule.when, builderAction.id);
      if (parent === null) return state;

      // Fresh ids throughout: two nodes sharing one would make a trace
      // ambiguous, and `validateRule` refuses the document outright.
      const copy = withNewIds(node, deps.ids);
      const index = parent.children.findIndex((child) => child.id === builderAction.id) + 1;
      const when = addNode(state.rule.when, parent.id, copy, index);

      return { ...commit(state, withTree(state.rule, when), null, deps), selectedId: copy.id };
    }

    case 'setCombinator':
      return editNode(
        state,
        builderAction.id,
        (node) =>
          node.kind === 'group' && node.combinator !== builderAction.combinator
            ? { ...node, combinator: builderAction.combinator }
            : node,
        null,
        deps,
      );

    case 'setNegate':
      return editNode(
        state,
        builderAction.id,
        (node) => {
          if ((node.negate === true) === builderAction.negate) return node;
          // Absent rather than `false`: the AST carries what is true of a rule,
          // and `negate: false` is noise in every diff and every export.
          const { negate: _dropped, ...rest } = node;
          return (builderAction.negate ? { ...node, negate: true } : (rest as RuleNode));
        },
        null,
        deps,
      );

    case 'setOperator':
      return editNode(
        state,
        builderAction.id,
        (node) =>
          node.kind === 'condition' && node.operator !== builderAction.operator
            ? fitArity(node, builderAction.operator, deps)
            : node,
        null,
        deps,
      );

    case 'setOperand':
      return editNode(
        state,
        builderAction.id,
        (node) => operandSlot(node, builderAction.slot, builderAction.operand),
        // Merged per slot: typing into one value is one undo step, and moving to
        // the next value starts another.
        `operand:${builderAction.id}:${String(builderAction.slot)}`,
        deps,
      );

    case 'setArgCount':
      return editNode(
        state,
        builderAction.id,
        (node) => {
          if (node.kind !== 'condition') return node;
          const count = Math.max(0, builderAction.count);
          if (node.args.length === count) return node;
          const args = node.args.slice(0, count);
          while (args.length < count) args.push(literal(null));
          return { ...node, args };
        },
        null,
        deps,
      );

    case 'setComment':
      return editNode(
        state,
        builderAction.id,
        (node) => {
          const comment = builderAction.comment;
          if ((node.comment ?? '') === comment) return node;
          if (comment === '') {
            const { comment: _dropped, ...rest } = node;
            return rest as RuleNode;
          }
          return { ...node, comment };
        },
        `comment:${builderAction.id}`,
        deps,
      );

    case 'move': {
      const node = findNode(state.rule.when, builderAction.id);
      if (node === undefined || node.id === state.rule.when.id) return state;

      const parent = findNode(state.rule.when, builderAction.parentId);
      if (parent === undefined || parent.kind !== 'group') return state;

      // A group cannot be dropped inside itself: the result is a tree that is
      // no longer a tree, and every walker in the system would hang on it.
      if (findNode(node, builderAction.parentId) !== undefined) return state;

      // `index` is the position in the RESULTING list, which is the only
      // reading that means one thing: "where should this end up" needs no
      // adjustment for the gap the move itself leaves behind, and a drop target
      // computed from what the user can see is already in those terms.
      const pruned = removeNode(state.rule.when, builderAction.id);
      const when = addNode(pruned, builderAction.parentId, node, builderAction.index);
      if (when === state.rule.when) return state;

      return commit(state, withTree(state.rule, when), null, deps);
    }

    case 'addAction': {
      const branch = builderAction.branch ?? 'then';
      const node = buildAction({ type: builderAction.actionType }, { ids: deps.ids });
      return editActions(state, (actions) => [...actions, node], branch, null, deps);
    }

    case 'removeAction': {
      const branch = branchOf(state.rule, builderAction.id);
      if (branch === null) return state;
      return editActions(
        state,
        (actions) => actions.filter((entry) => entry.id !== builderAction.id),
        branch,
        null,
        deps,
      );
    }

    case 'setAction': {
      const branch = branchOf(state.rule, builderAction.id);
      if (branch === null) return state;

      return editActions(
        state,
        (actions) =>
          actions.map((entry) =>
            entry.id === builderAction.id ? patchAction(entry, builderAction.patch) : entry,
          ),
        branch,
        `action:${builderAction.id}`,
        deps,
      );
    }

    default:
      return state;
  }
}

/** Undefined in a patch CLEARS the field, rather than leaving it as it was. */
function patchAction(node: ActionNode, patch: import('./state').ActionPatch): ActionNode {
  const next: ActionNode = { id: node.id, type: patch.type ?? node.type };

  const target = 'target' in patch ? patch.target : node.target;
  const value = 'value' in patch ? patch.value : node.value;
  const params = 'params' in patch ? patch.params : node.params;
  const comment = 'comment' in patch ? patch.comment : node.comment;

  return {
    ...next,
    ...(target === undefined ? {} : { target }),
    ...(value === undefined ? {} : { value }),
    ...(params === undefined ? {} : { params }),
    ...(comment === undefined ? {} : { comment }),
  };
}

/** The group holding this node, or null for the root and for anything absent. */
export function parentOf(root: RuleNode, id: string): GroupNode | null {
  if (root.kind !== 'group') return null;

  const stack: GroupNode[] = [root];
  while (stack.length > 0) {
    const group = stack.pop();
    if (group === undefined) break;

    for (const child of group.children) {
      if (child.id === id) return group;
      if (child.kind === 'group') stack.push(child);
    }
  }

  return null;
}
