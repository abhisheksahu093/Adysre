/**
 * `@adysre/rules-core` - the AST, and everything that can be done to it.
 *
 * Building, walking, validating, serialising, and running: the registry, the
 * built-in plugins and the executor live here, because an engine split from the
 * tree it walks is two packages that have to agree on a contract nobody reads.
 * The renderers, the React state and the builder are separate precisely because
 * they are NOT needed to evaluate a rule on a server.
 *
 * ZERO runtime dependencies, deliberately. A rules engine is embedded, and one
 * that drags a dependency tree into every bundle that touches it is one teams
 * work around.
 */

export * from './builders';
export * from './builtins';
export * from './errors';
export * from './execute';
export * from './ids';
export * from './registry';
export * from './resolve';
export * from './serialize';
export * from './validate';
export * from './walk';

// Re-exported so a consumer needs one import for the common case. The types
// package stays the source of truth; this is a convenience, not a copy.
export type {
  ActionNode,
  AppliedAction,
  Combinator,
  ConditionNode,
  Diagnostic,
  EvaluationContext,
  EvaluationOptions,
  GroupNode,
  JsonValue,
  Operand,
  RuleDocument,
  RuleKind,
  RuleNode,
  RuleOutcome,
  RuleSet,
  SetOutcome,
  TraceEvent,
  ValueType,
  Verdict,
} from '@adysre/rules-types';
