'use client';

import type { Registry } from '@adysre/rules-core';
import type { BuilderActions, Validation } from '@adysre/rules-react';
import type {
  Diagnostic,
  FieldDescriptor,
  RuleDocument,
  VariableDescriptor,
} from '@adysre/rules-types';
import { createContext, useContext } from 'react';
import type { BuilderLabels } from './labels.ts';
import type { OperandLookup } from './operands.ts';

/**
 * What every row needs, without every row being handed it.
 *
 * A condition sits four components below the builder and needs the registry,
 * the labels, the field list and the dispatcher; threading those through each
 * intermediate as props would be a dozen lines of noise per component and a
 * refactor every time a row needs one more thing.
 *
 * It holds no state. Everything here is derived from the store on each render,
 * so context cannot become a second, staler copy of the rule.
 */
export interface BuilderContextValue {
  rule: RuleDocument;
  registry: Registry;
  labels: BuilderLabels;
  actions: BuilderActions;
  selectedId: string | null;
  validation: Validation;
  fields: readonly FieldDescriptor[];
  variables: readonly VariableDescriptor[];
  /** Providers are async, so the pickers can be asked before they can answer. */
  loading: boolean;
  /** Field and variable providers that failed, which is not an empty list. */
  providerDiagnostics: readonly Diagnostic[];
  lookup: OperandLookup;
  /** Whether the builder refuses edits. */
  readOnly: boolean;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export const BuilderProvider = BuilderContext.Provider;

/**
 * The builder's context, or an exception.
 *
 * The one place in this ecosystem that throws, and for the same reason the
 * registry throws on a duplicate id: a row rendered outside `RuleBuilder` is a
 * programming error, not a fact about somebody's data, and the moment to find
 * it is the first render rather than a blank panel nobody can explain.
 */
export function useBuilder(): BuilderContextValue {
  const value = useContext(BuilderContext);
  if (value === null) {
    throw new Error('A rule builder component was rendered outside <RuleBuilder>.');
  }
  return value;
}

/** The diagnostics belonging to one node, which is what a row shows. */
export function useNodeDiagnostics(nodeId: string): readonly Diagnostic[] {
  const { validation } = useBuilder();
  return validation.byNode.get(nodeId) ?? [];
}
