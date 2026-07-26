import { createNodeId, evaluateRule, type Registry } from '@adysre/rules-core';
import type {
  EvaluationContext,
  EvaluationOptions,
  RuleDocument,
  RuleOutcome,
} from '@adysre/rules-types';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ReducerDeps } from './reducer';
import {
  resolveFields,
  resolveVariables,
  type ResolvedFields,
  type ResolvedVariables,
} from './providers';
import { canRedo, canUndo, isDirty, selectedNode, validation, type Validation } from './selectors';
import { createRuleStore, type BuilderActions, type RuleStore } from './store';
import type { BuilderState } from './state';

/**
 * The React bindings.
 *
 * Thin on purpose. Everything a rule builder does lives in the store and the
 * selectors, which have no framework in them, and this file is the adapter that
 * lets a component see it. If a hook here grows logic of its own, the logic is
 * in the wrong file: it would be logic no test can reach without a renderer.
 */

export interface UseRuleBuilder {
  state: BuilderState;
  rule: RuleDocument;
  actions: BuilderActions;
  store: RuleStore;
  validation: Validation;
  selected: ReturnType<typeof selectedNode>;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
}

export interface UseRuleBuilderOptions extends Partial<ReducerDeps> {
  /** Told about every change, for autosave or a draft in local storage. */
  onChange?: (state: BuilderState) => void;
}

export function useRuleBuilder(
  initial: RuleDocument,
  options: UseRuleBuilderOptions = {},
): UseRuleBuilder {
  const deps: ReducerDeps = {
    ids: options.ids ?? createNodeId,
    registry: options.registry,
    historyLimit: options.historyLimit,
    defaultOperator: options.defaultOperator,
  };

  // Created once. A store rebuilt on re-render would drop the history with it,
  // and undo that forgets whenever a parent re-renders is worse than no undo.
  //
  // Which is why the deps are getters over a ref rather than the object itself:
  // the store outlives every render, so anything captured by value at creation
  // would be frozen at whatever the first render happened to pass - including a
  // registry that had not finished loading yet.
  const depsRef = useRef(deps);
  depsRef.current = deps;
  const storeRef = useRef<RuleStore | null>(null);
  storeRef.current ??= createRuleStore(initial, {
    get ids() {
      return depsRef.current.ids;
    },
    get registry() {
      return depsRef.current.registry;
    },
    get historyLimit() {
      return depsRef.current.historyLimit;
    },
    get defaultOperator() {
      return depsRef.current.defaultOperator;
    },
  });

  const store = storeRef.current;
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState);

  const onChange = options.onChange;
  const previous = useRef(state);
  useEffect(() => {
    if (previous.current === state) return;
    previous.current = state;
    onChange?.(state);
  }, [state, onChange]);

  const derived = useMemo(() => validation(state.rule), [state.rule]);
  const selected = useMemo(() => selectedNode(state), [state]);

  return {
    state,
    rule: state.rule,
    actions: store.actions,
    store,
    validation: derived,
    selected,
    canUndo: canUndo(state),
    canRedo: canRedo(state),
    isDirty: isDirty(state),
  };
}

export interface UseProviders<T> {
  data: T;
  loading: boolean;
}

/** The builder's field list, resolved from every provider the registry holds. */
export function useFields(
  registry: Pick<Registry, 'fieldProviders'> | undefined,
  context?: unknown,
): UseProviders<ResolvedFields> {
  const [data, setData] = useState<ResolvedFields>({ fields: [], diagnostics: [] });
  const [loading, setLoading] = useState(false);
  const providers = registry?.fieldProviders;

  useEffect(() => {
    if (providers === undefined || providers.length === 0) {
      setData({ fields: [], diagnostics: [] });
      return;
    }

    // A provider that resolves after the picker moved on must not overwrite
    // what replaced it.
    let live = true;
    setLoading(true);

    void resolveFields(providers, context).then((resolved) => {
      if (!live) return;
      setData(resolved);
      setLoading(false);
    });

    return () => {
      live = false;
    };
  }, [providers, context]);

  return { data, loading };
}

export function useVariables(
  registry: Pick<Registry, 'variableProviders'> | undefined,
  context?: unknown,
): UseProviders<ResolvedVariables> {
  const [data, setData] = useState<ResolvedVariables>({ variables: [], diagnostics: [] });
  const [loading, setLoading] = useState(false);
  const providers = registry?.variableProviders;

  useEffect(() => {
    if (providers === undefined || providers.length === 0) {
      setData({ variables: [], diagnostics: [] });
      return;
    }

    let live = true;
    setLoading(true);

    void resolveVariables(providers, context).then((resolved) => {
      if (!live) return;
      setData(resolved);
      setLoading(false);
    });

    return () => {
      live = false;
    };
  }, [providers, context]);

  return { data, loading };
}

/**
 * Run the rule being edited against sample data.
 *
 * The single most useful thing a rule builder can show, and it costs nothing to
 * offer: evaluation is synchronous and pure, so the preview is a `useMemo` and
 * not a request. An author sees the verdict and the trace change as they type,
 * which is the difference between building a rule and guessing at one.
 */
export function useRulePreview(
  registry: Registry,
  rule: RuleDocument,
  context: EvaluationContext,
  options?: EvaluationOptions,
): RuleOutcome {
  return useMemo(
    () => evaluateRule(registry, rule, context, options),
    [registry, rule, context, options],
  );
}
