import { createNodeId } from '@adysre/rules-core';
import type { Combinator, Operand, RuleDocument } from '@adysre/rules-types';
import { initialState, reduce, type ReducerDeps } from './reducer';
import type { ActionPatch, Branch, BuilderAction, BuilderState, MetaPatch } from './state';

/**
 * The store, with no React in it.
 *
 * This file imports nothing from any framework, and that is deliberate rather
 * than tidy. The hooks in `hooks.ts` are eleven lines of `useSyncExternalStore`
 * around this; everything a rule builder actually DOES lives here, where a test
 * can drive it without a renderer and where a host using something other than
 * React can drive it at all.
 *
 * It is also the smallest possible store: a state, a reducer and a set of
 * listeners. A rule builder has no async, no side effects and no server round
 * trip in its editing loop, so anything larger would be machinery in search of
 * a problem.
 */

export interface RuleStore {
  getState: () => BuilderState;
  dispatch: (action: BuilderAction) => void;
  subscribe: (listener: () => void) => () => void;
  /** Named methods over `dispatch`, which is what a component actually calls. */
  readonly actions: BuilderActions;
}

export interface BuilderActions {
  load: (rule: RuleDocument) => void;
  markSaved: () => void;
  select: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  setMeta: (patch: MetaPatch) => void;
  addCondition: (parentId?: string, operator?: string) => void;
  addGroup: (parentId?: string, combinator?: Combinator) => void;
  remove: (id: string) => void;
  duplicate: (id: string) => void;
  setCombinator: (id: string, combinator: Combinator) => void;
  setNegate: (id: string, negate: boolean) => void;
  setOperator: (id: string, operator: string) => void;
  setOperand: (id: string, slot: 'left' | number, operand: Operand) => void;
  setArgCount: (id: string, count: number) => void;
  setComment: (id: string, comment: string) => void;
  move: (id: string, parentId: string, index: number) => void;
  addAction: (actionType: string, branch?: Branch) => void;
  removeAction: (id: string) => void;
  setAction: (id: string, patch: ActionPatch) => void;
}

export function createActions(dispatch: (action: BuilderAction) => void): BuilderActions {
  return {
    load: (rule) => dispatch({ type: 'load', rule }),
    markSaved: () => dispatch({ type: 'markSaved' }),
    select: (id) => dispatch({ type: 'select', id }),
    undo: () => dispatch({ type: 'undo' }),
    redo: () => dispatch({ type: 'redo' }),
    setMeta: (patch) => dispatch({ type: 'setMeta', patch }),
    addCondition: (parentId, operator) =>
      dispatch({
        type: 'addCondition',
        ...(parentId === undefined ? {} : { parentId }),
        ...(operator === undefined ? {} : { operator }),
      }),
    addGroup: (parentId, combinator) =>
      dispatch({
        type: 'addGroup',
        ...(parentId === undefined ? {} : { parentId }),
        ...(combinator === undefined ? {} : { combinator }),
      }),
    remove: (id) => dispatch({ type: 'remove', id }),
    duplicate: (id) => dispatch({ type: 'duplicate', id }),
    setCombinator: (id, combinator) => dispatch({ type: 'setCombinator', id, combinator }),
    setNegate: (id, negate) => dispatch({ type: 'setNegate', id, negate }),
    setOperator: (id, operator) => dispatch({ type: 'setOperator', id, operator }),
    setOperand: (id, slot, operand) => dispatch({ type: 'setOperand', id, slot, operand }),
    setArgCount: (id, count) => dispatch({ type: 'setArgCount', id, count }),
    setComment: (id, comment) => dispatch({ type: 'setComment', id, comment }),
    move: (id, parentId, index) => dispatch({ type: 'move', id, parentId, index }),
    addAction: (actionType, branch) =>
      dispatch({ type: 'addAction', actionType, ...(branch === undefined ? {} : { branch }) }),
    removeAction: (id) => dispatch({ type: 'removeAction', id }),
    setAction: (id, patch) => dispatch({ type: 'setAction', id, patch }),
  };
}

export function createRuleStore(
  rule: RuleDocument,
  deps: ReducerDeps = { ids: createNodeId },
): RuleStore {
  let state = initialState(rule);
  const listeners = new Set<() => void>();

  const dispatch = (builderAction: BuilderAction): void => {
    const next = reduce(state, builderAction, deps);
    // Identity is the signal. The reducer returns the SAME state for an edit
    // that changed nothing, so a no-op never re-renders anything.
    if (next === state) return;

    state = next;
    for (const listener of [...listeners]) listener();
  };

  return {
    getState: () => state,
    dispatch,
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    actions: createActions(dispatch),
  };
}
