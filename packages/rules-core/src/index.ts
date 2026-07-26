/**
 * `@adysre/rules-core` - the AST, and everything that can be done to it without
 * running it.
 *
 * Building, walking, validating and serialising a rule. The executor, the
 * plugin registry and the renderers are separate packages precisely because
 * this one has to be safe to import anywhere: a form that only needs to READ a
 * rule, a migration that rewrites one, a build step that lints them.
 *
 * ZERO runtime dependencies, deliberately. A rules engine is embedded, and one
 * that drags a dependency tree into every bundle that touches it is one teams
 * work around.
 */

export * from './builders';
export * from './ids';
export * from './serialize';
export * from './validate';
export * from './walk';

// Re-exported so a consumer needs one import for the common case. The types
// package stays the source of truth; this is a convenience, not a copy.
export type {
  ActionNode,
  Combinator,
  ConditionNode,
  Diagnostic,
  GroupNode,
  JsonValue,
  Operand,
  RuleDocument,
  RuleKind,
  RuleNode,
  RuleSet,
  ValueType,
} from '@adysre/rules-types';
