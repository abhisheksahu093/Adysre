import type { ActionNode, RuleDocument } from './ast';
import type { JsonObject, JsonValue } from './json';

/**
 * Executing a rule: what goes in, what comes out, and what was observed.
 *
 * The trace is not a debugging afterthought bolted on later - it is part of the
 * result. A rules engine whose answer is a bare `true` is unusable in the one
 * moment it matters most: when a business user insists the rule is wrong and
 * somebody has to show which condition decided it. Every node that ran leaves a
 * record of what it saw and what it concluded.
 */

/** What the engine evaluates against. */
export interface EvaluationContext {
  /** The subject: the object whose fields the rule reads. */
  data: JsonValue;
  /** Values the host supplies by name, reachable as `variable` operands. */
  variables: Readonly<Record<string, JsonValue>>;
  /** Epoch milliseconds. Injected rather than read, so a run is reproducible. */
  now: number;
  locale?: string;
  /**
   * Anything a host wants function plugins to reach that is not JSON - a
   * database handle, a translator. Never serialised, never part of a trace.
   */
  extras?: Readonly<Record<string, unknown>>;
}

export const VERDICTS = ['matched', 'unmatched', 'skipped', 'errored'] as const;
export type Verdict = (typeof VERDICTS)[number];

export const SEVERITIES = ['error', 'warning', 'info'] as const;
export type Severity = (typeof SEVERITIES)[number];

/**
 * Something the engine has to say about a run that is not a verdict.
 *
 * An unknown operator, a field that does not exist, a function that threw. Each
 * carries the node it came from, so the builder can put the message on the row
 * that caused it rather than at the top of the screen.
 */
export interface Diagnostic {
  severity: Severity;
  /** Stable, machine-readable. The UI maps it to translated copy. */
  code: string;
  message: string;
  /** The AST node responsible, when one is. */
  nodeId?: string;
  /** The field path involved, when one is. */
  path?: string;
}

/** One node's contribution to the answer. */
export interface TraceEvent {
  nodeId: string;
  kind: 'group' | 'condition';
  verdict: Verdict;
  /** Operator id, for a condition. */
  operator?: string;
  /** The resolved operands, exactly as the operator saw them. */
  left?: JsonValue;
  args?: JsonValue[];
  /** Milliseconds spent in this node, including its children. */
  ms: number;
  /** Set when `verdict` is `errored`. */
  error?: string;
  /** Ids of the children that ran. A short-circuited sibling is absent. */
  children?: string[];
}

/** An action the engine decided to apply, with its operands resolved. */
export interface AppliedAction {
  /** The node it came from, so a trace can point at the rule that did it. */
  actionId: string;
  type: string;
  target?: string;
  value?: JsonValue;
  params?: JsonObject;
}

/** The result of evaluating one rule. */
export interface RuleOutcome {
  ruleId: string;
  ruleKey?: string;
  verdict: Verdict;
  /** From `then` when matched, from `otherwise` when not. */
  actions: AppliedAction[];
  diagnostics: Diagnostic[];
  trace: TraceEvent[];
  ms: number;
}

/** The result of evaluating a set. */
export interface SetOutcome {
  setId: string;
  outcomes: RuleOutcome[];
  /** Every action from every rule that contributed, in order. */
  actions: AppliedAction[];
  diagnostics: Diagnostic[];
  ms: number;
}

/** Knobs a caller can turn per run. */
export interface EvaluationOptions {
  /**
   * Collect a trace. On by default: the cost is a few objects per node, and a
   * result nobody can explain is worth less than the time it saves.
   */
  trace?: boolean;
  /**
   * Stop a group as soon as its verdict is known. On by default; turning it
   * off makes every branch report, which is what a debugger wants.
   */
  shortCircuit?: boolean;
  /** Ceiling on nested function operands, so a malformed AST cannot recurse. */
  maxDepth?: number;
  /** How long one rule may take before it is abandoned. */
  timeoutMs?: number;
}

/** The engine's contract, so a host can swap the implementation. */
export interface RuleEvaluator {
  evaluate(
    rule: RuleDocument,
    context: EvaluationContext,
    options?: EvaluationOptions,
  ): RuleOutcome;
}

/** Actions still in AST form, before their operands are resolved. */
export type PendingActions = readonly ActionNode[];
