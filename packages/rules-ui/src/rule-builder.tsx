'use client';

import {
  createContext as createEvaluationContext,
  evaluateRule,
  type Registry,
} from '@adysre/rules-core';
import { useFields, useRuleBuilder, useVariables } from '@adysre/rules-react';
import type { JsonValue, RuleDocument } from '@adysre/rules-types';
import { cn } from 'adysre';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActionList } from './action-editor.tsx';
import { BuilderProvider, type BuilderContextValue } from './context.tsx';
import { GroupRow } from './group-row.tsx';
import { labelsWith, type BuilderLabels } from './labels.ts';
import { MetaEditor } from './meta-editor.tsx';
import { lookupFrom } from './operands.ts';
import { RulePreview } from './preview.tsx';
import { isDifferentDocument } from './sync.ts';
import { RuleToolbar } from './toolbar.tsx';

export interface RuleBuilderProps {
  /**
   * The rule to edit. Changing it to a different document LOADS that document,
   * which clears the history: undo across two rules would restore something the
   * author never saw in this session.
   */
  rule: RuleDocument;
  /** What rules may do here. `createRegistry(builtinPlugins)` for the usual set. */
  registry: Registry;
  /** Replace any of the builder's words. This is how a locale is added. */
  labels?: Partial<BuilderLabels> | undefined;
  onChange?: ((rule: RuleDocument) => void) | undefined;
  onSave?: ((rule: RuleDocument) => void) | undefined;
  /** Handed to every field and variable provider. */
  providerContext?: unknown;
  /** Sample subject to run the rule against while it is edited. */
  sample?: JsonValue | undefined;
  /** Values the sample run supplies by name. */
  variables?: Readonly<Record<string, JsonValue>> | undefined;
  /** Epoch milliseconds for the sample run. Fixed per mount when absent. */
  now?: number | undefined;
  readOnly?: boolean;
  showMeta?: boolean;
  showActions?: boolean;
  showPreview?: boolean;
  className?: string;
}

/**
 * The visual builder.
 *
 * A projection of the AST, like everything else in this engine: it edits the
 * tree and nothing else, holds no rule of its own, and hands `state.rule`
 * straight to the renderer and the executor. What it draws is entirely a
 * function of the document and the registry, which is why a host that
 * registers one operator gets a builder that can author it.
 */
export function RuleBuilder({
  rule,
  registry,
  labels,
  onChange,
  onSave,
  providerContext,
  sample,
  variables,
  now,
  readOnly = false,
  showMeta = true,
  showActions = true,
  showPreview = true,
  className,
}: RuleBuilderProps): React.JSX.Element {
  const resolvedLabels = useMemo(() => labelsWith(labels), [labels]);

  // Held in a ref so the store's change subscription does not have to be torn
  // down and rebuilt whenever a parent re-renders with a new closure.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const handleChange = useCallback(
    (state: { rule: RuleDocument }) => onChangeRef.current?.(state.rule),
    [],
  );

  const builder = useRuleBuilder(rule, { registry, onChange: handleChange });

  // The store is created once, so a host swapping the document has to be
  // noticed - but a host that echoes `onChange` straight back into `rule` is
  // not swapping anything, and reloading there would clear the history on every
  // keystroke. `isDifferentDocument` is where that distinction is decided.
  const loaded = useRef(rule);
  useEffect(() => {
    if (!isDifferentDocument(rule, loaded.current, builder.rule)) {
      loaded.current = rule;
      return;
    }
    loaded.current = rule;
    builder.actions.load(rule);
  }, [rule, builder.rule, builder.actions]);

  const fields = useFields(registry, providerContext);
  const variableList = useVariables(registry, providerContext);

  const lookup = useMemo(
    () => lookupFrom(fields.data.fields, variableList.data.variables, registry.functions),
    [fields.data.fields, variableList.data.variables, registry.functions],
  );

  // Fixed at mount unless the host supplies one. A preview whose clock advanced
  // on every keystroke would make `today` mean something different halfway
  // through writing a condition about it.
  const clock = useMemo(() => now ?? Date.now(), [now]);
  const evaluationContext = useMemo(
    () =>
      createEvaluationContext(sample ?? null, {
        now: clock,
        ...(variables === undefined ? {} : { variables }),
      }),
    [sample, clock, variables],
  );

  const outcome = useMemo(
    () =>
      sample === undefined
        ? undefined
        : // Synchronous and pure, so the preview is a memo and not a request.
          evaluateRule(registry, builder.rule, evaluationContext),
    [sample, registry, builder.rule, evaluationContext],
  );

  const context: BuilderContextValue = useMemo(
    () => ({
      rule: builder.rule,
      registry,
      labels: resolvedLabels,
      actions: builder.actions,
      selectedId: builder.state.selectedId,
      validation: builder.validation,
      fields: fields.data.fields,
      variables: variableList.data.variables,
      loading: fields.loading || variableList.loading,
      providerDiagnostics: [...fields.data.diagnostics, ...variableList.data.diagnostics],
      lookup,
      readOnly,
    }),
    [
      builder.rule,
      builder.actions,
      builder.state.selectedId,
      builder.validation,
      registry,
      resolvedLabels,
      fields.data.fields,
      fields.data.diagnostics,
      fields.loading,
      variableList.data.variables,
      variableList.data.diagnostics,
      variableList.loading,
      lookup,
      readOnly,
    ],
  );

  return (
    <BuilderProvider value={context}>
      <div className={cn('flex flex-col gap-6 text-foreground', className)}>
        <RuleToolbar
          canRedo={builder.canRedo}
          canUndo={builder.canUndo}
          isDirty={builder.isDirty}
          onSave={onSave === undefined ? undefined : () => onSave(builder.rule)}
        />

        {showMeta && <MetaEditor />}

        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">{resolvedLabels.conditions}</h3>
          <GroupRow isRoot node={builder.rule.when} />
        </section>

        {showActions && (
          <>
            <ActionList branch="then" />
            <ActionList branch="otherwise" />
          </>
        )}

        {showPreview && <RulePreview outcome={outcome} />}
      </div>
    </BuilderProvider>
  );
}
