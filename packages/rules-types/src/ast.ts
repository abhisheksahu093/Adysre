import type { JsonValue } from './json';

/**
 * The rule AST: the single source of truth.
 *
 * Everything else in the engine is a projection of this tree. The visual
 * builder edits it, the executor walks it, the natural-language renderer reads
 * it, storage persists it, and the debugger annotates it. Nothing is ever
 * derived in one direction and edited in another, which is the failure that
 * turns a rule builder into two disagreeing systems: text that no longer
 * matches the tree, or a tree that cannot express what someone typed.
 *
 * Three shape decisions carry the rest:
 *
 * 1. A condition's right-hand side is an ARRAY of operands, not a single value.
 *    Operators have different arity - `isEmpty` takes none, `equals` takes one,
 *    `between` takes two, `isOneOf` takes many - and one shape covers all of
 *    them. The alternative is a `right` plus a `right2` plus a `values`, and a
 *    reader that has to know which operator uses which.
 * 2. An operand is a discriminated union of SOURCES (literal, field, variable,
 *    function), so "compare the field to another field" and "compare the field
 *    to today's date" are the same construct rather than special cases.
 * 3. Operators and functions are referenced BY ID, never by implementation.
 *    That is what makes them plugins: the AST names `equals`, and which code
 *    runs is a registry decision the document knows nothing about.
 */

/** How a group combines its children. */
export const COMBINATORS = ['all', 'any', 'none'] as const;
export type Combinator = (typeof COMBINATORS)[number];

/**
 * Where a value comes from.
 *
 * `field` reads the subject being evaluated, `variable` reads the context
 * supplied by the host, `function` computes, `literal` is written into the
 * rule. A function's arguments are operands too, so they nest without limit.
 */
export type Operand =
  | { source: 'literal'; value: JsonValue }
  | { source: 'field'; path: string }
  | { source: 'variable'; name: string }
  | { source: 'function'; name: string; args: Operand[] };

/** One comparison. The leaf of the condition tree. */
export interface ConditionNode {
  kind: 'condition';
  id: string;
  /** What is being tested. */
  left: Operand;
  /** Operator plugin id, e.g. `equals`, `contains`, `between`. */
  operator: string;
  /** Everything to the right. Arity belongs to the operator, not the shape. */
  args: Operand[];
  /** Inverts this condition's verdict. */
  negate?: boolean;
  /** Author's note. Carried into generated documentation, never evaluated. */
  comment?: string;
}

/** A branch: children combined by `all`, `any` or `none`. */
export interface GroupNode {
  kind: 'group';
  id: string;
  combinator: Combinator;
  children: RuleNode[];
  /** Inverts the group's verdict, after the combinator has been applied. */
  negate?: boolean;
  comment?: string;
}

export type RuleNode = GroupNode | ConditionNode;

/**
 * Something the rule does when it matches.
 *
 * Deliberately generic: what `type` means is an action plugin's business, and
 * what a rule is FOR (validating, transforming, deciding a permission) is the
 * document's `kind`. Hard-coding one action shape per rule kind would make
 * every new kind a change to the AST rather than a plugin.
 */
export interface ActionNode {
  id: string;
  /** Action plugin id, e.g. `reject`, `setField`, `allow`, `show`. */
  type: string;
  /** Field path the action applies to, when it applies to one. */
  target?: string;
  /** The value it applies, resolved like any other operand. */
  value?: Operand;
  /** Anything else the action's plugin declares. */
  params?: Record<string, JsonValue>;
  comment?: string;
}

/** What a rule exists to decide. */
export const RULE_KINDS = [
  'validation',
  'filter',
  'transformation',
  'workflow',
  'calculation',
  'permission',
  'visibility',
] as const;
export type RuleKind = (typeof RULE_KINDS)[number];

export const RULE_STATUSES = ['draft', 'active', 'archived'] as const;
export type RuleStatus = (typeof RULE_STATUSES)[number];

export interface RuleMetadata {
  /** ISO timestamps: a rule document has to survive JSON. */
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  /** Free-form, for the host's own bookkeeping. */
  annotations?: Record<string, JsonValue>;
}

/**
 * A rule.
 *
 * `when` is always a group, even for a single condition: a tree with one shape
 * at the root is one less case for every walker, renderer and editor in the
 * system to handle.
 */
export interface RuleDocument {
  /** Bumped when the AST shape changes, so a stored rule can be migrated. */
  schemaVersion: number;
  id: string;
  /** Stable business key, when the host has one. Survives a re-import. */
  key?: string;
  name: string;
  description: string;
  kind: RuleKind;
  status: RuleStatus;
  /** Incremented on each saved change. */
  version: number;
  /** Order within a set. Lower runs first. */
  priority: number;
  enabled: boolean;
  when: GroupNode;
  then: ActionNode[];
  /** Actions for the non-matching branch. Absent means "do nothing". */
  otherwise?: ActionNode[];
  tags: string[];
  metadata: RuleMetadata;
}

/** How a set decides which of its rules run. */
export const SET_STRATEGIES = ['first-match', 'all-matches'] as const;
export type SetStrategy = (typeof SET_STRATEGIES)[number];

/** An ordered collection of rules, evaluated together. */
export interface RuleSet {
  schemaVersion: number;
  id: string;
  name: string;
  description: string;
  strategy: SetStrategy;
  rules: RuleDocument[];
  metadata: RuleMetadata;
}

/** The AST shape this build writes. Stored documents may be older. */
export const AST_SCHEMA_VERSION = 1;

export function isGroup(node: RuleNode): node is GroupNode {
  return node.kind === 'group';
}

export function isCondition(node: RuleNode): node is ConditionNode {
  return node.kind === 'condition';
}

export function isFieldOperand(operand: Operand): operand is Extract<Operand, { source: 'field' }> {
  return operand.source === 'field';
}

export function isFunctionOperand(
  operand: Operand,
): operand is Extract<Operand, { source: 'function' }> {
  return operand.source === 'function';
}
