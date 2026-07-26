import type { ActionNode, RuleDocument, RuleKind, RuleNode } from './ast';
import type { AppliedAction, Diagnostic, EvaluationContext } from './execution';
import type { JsonValue, ValueType } from './json';

/**
 * The plugin contracts.
 *
 * Everything the engine can DO is a plugin: comparing two values, computing
 * one, applying an outcome, offering fields to the builder, storing a rule,
 * rendering it as a sentence. The core knows the AST and the registry, and
 * nothing else.
 *
 * That is what makes this reusable across projects rather than across screens.
 * A team adds `withinBusinessHours` as an operator and `taxFor` as a function
 * without touching the engine, and their rules are still plain JSON that the
 * same builder edits and the same debugger explains.
 *
 * Every plugin carries `id` as its contract with the AST: a stored rule refers
 * to `equals`, and which implementation answers is a registry decision made at
 * runtime. Renaming an id is therefore a breaking change to stored documents,
 * which is why ids are explicit rather than derived from a function name.
 */

/** Common shape: an addressable, describable extension. */
export interface Plugin {
  /** Referenced by the AST. Stable forever, or stored rules break. */
  id: string;
  /**
   * Translation key for a human label. Not the label itself: a plugin that
   * carried English would be a plugin that cannot be localised.
   */
  labelKey?: string;
  /** Semantic version of the plugin's own behaviour, for diagnostics. */
  version?: string;
}

/**
 * An operator: the comparison in a condition.
 *
 * @example
 * const between: OperatorPlugin = {
 *   id: 'between',
 *   arity: 2,
 *   accepts: ['number', 'date'],
 *   evaluate: (left, [low, high]) => left >= low && left <= high,
 * };
 */
export interface OperatorPlugin extends Plugin {
  /**
   * How many operands follow the left-hand side. `null` is variadic (`isOneOf`).
   * The builder uses this to draw the right number of inputs, and the validator
   * to refuse a condition that cannot run.
   */
  arity: number | null;
  /** Left-hand types this applies to. Absent means any. */
  accepts?: readonly ValueType[];
  /**
   * True when the condition holds. Must be PURE: same inputs, same answer, no
   * side effects, nothing read from outside `context`.
   *
   * A boolean leaves nowhere to say "you gave me a string and a number", so an
   * operator that cannot answer throws `RuleError` (from `@adysre/rules-core`)
   * and the executor turns that into an `errored` verdict with a diagnostic.
   * Returning `false` instead would make a broken comparison look like a failed
   * one, which is how a rule silently stops firing and nobody can see why.
   * Anything else thrown is treated as a bug in the plugin.
   */
  evaluate: (left: JsonValue, args: JsonValue[], context: EvaluationContext) => boolean;
  /**
   * The natural-language fragment for this operator, given already-rendered
   * operands. Absent falls back to the label, which is why this is optional
   * rather than a second required implementation of the same idea.
   */
  toText?: (left: string, args: string[]) => string;
}

/** A function operand: computes a value from its arguments. */
export interface FunctionPlugin extends Plugin {
  /** Expected argument count. `null` is variadic. */
  arity: number | null;
  argTypes?: readonly ValueType[];
  returns: ValueType;
  /**
   * Pure. Anything impure - a clock, a database, a translator - belongs in
   * `context`, injected by the host, so a run is reproducible and a rule can be
   * replayed in a debugger. Throws `RuleError` when the arguments make no sense.
   */
  evaluate: (args: JsonValue[], context: EvaluationContext) => JsonValue;
  toText?: (args: string[]) => string;
}

/**
 * An action: what a matching rule does.
 *
 * `apply` is deliberately absent. An action describes an INTENT, and the host
 * decides what to do with it: a validation rule's `reject` becomes a form
 * error in one app and a queue message in another. An engine that performed
 * side effects itself could not be run twice, in a preview, or in a test.
 */
export interface ActionPlugin extends Plugin {
  /** Rule kinds this action makes sense for. Absent means all of them. */
  kinds?: readonly RuleKind[];
  /** Whether the action needs a `target` field path. */
  requiresTarget?: boolean;
  /** Whether the action needs a `value`. */
  requiresValue?: boolean;
  /** Reject an action the builder should not have produced. */
  validate?: (action: ActionNode) => Diagnostic[];
  toText?: (action: AppliedAction) => string;
}

/** A field the builder can offer, and a rule can read. */
export interface FieldDescriptor {
  /** Dotted path into the subject, e.g. `customer.address.country`. */
  path: string;
  label: string;
  type: ValueType;
  /** Closed set of values, when there is one. Drives a select in the builder. */
  options?: readonly { value: JsonValue; label: string }[];
  /** Group heading in the field picker. */
  group?: string;
  description?: string;
}

/**
 * Where the builder's field list comes from.
 *
 * A provider rather than a static list because the fields depend on the host:
 * a form's schema, a database table, a JSON Schema, a TypeScript type. All of
 * them can produce descriptors; none of them belong in the engine.
 */
export interface FieldProviderPlugin extends Plugin {
  fields: (context?: unknown) => FieldDescriptor[] | Promise<FieldDescriptor[]>;
}

/** A named value the host supplies at evaluation time. */
export interface VariableDescriptor {
  name: string;
  label: string;
  type: ValueType;
  description?: string;
}

export interface VariableProviderPlugin extends Plugin {
  variables: (context?: unknown) => VariableDescriptor[] | Promise<VariableDescriptor[]>;
}

/** Turns an AST into something else: a sentence, SQL, a predicate. */
export interface RendererPlugin<TOutput = string> extends Plugin {
  /** e.g. `nrl`, `sql`, `mongo`. */
  format: string;
  renderRule: (rule: RuleDocument) => TOutput;
  renderNode?: (node: RuleNode) => TOutput;
}

/** A check beyond structure: the host's own rules about rules. */
export interface ValidatorPlugin extends Plugin {
  validate: (rule: RuleDocument) => Diagnostic[];
}

/** Where rules live. Async because most stores are. */
export interface StoragePlugin extends Plugin {
  list: (query?: RuleQuery) => Promise<RuleSummary[]>;
  get: (id: string) => Promise<RuleDocument | null>;
  save: (rule: RuleDocument) => Promise<RuleDocument>;
  remove: (id: string) => Promise<void>;
  /** Version history, when the store keeps it. */
  versions?: (id: string) => Promise<RuleSummary[]>;
  restore?: (id: string, version: number) => Promise<RuleDocument>;
}

export interface RuleQuery {
  kind?: RuleKind;
  tags?: readonly string[];
  status?: RuleDocument['status'];
  search?: string;
  limit?: number;
  offset?: number;
}

/** Enough of a rule to list it without loading its tree. */
export interface RuleSummary {
  id: string;
  key?: string;
  name: string;
  kind: RuleKind;
  status: RuleDocument['status'];
  version: number;
  updatedAt: string;
  tags: readonly string[];
}

/**
 * Design tokens for the builder.
 *
 * Token NAMES, never colour literals: a host that already has a design system
 * points these at its own variables, and the builder inherits it rather than
 * imposing a second palette on the page.
 */
export interface ThemePlugin extends Plugin {
  tokens: Readonly<Record<string, string>>;
  /** CSS class applied to the builder's root, when the host uses one. */
  className?: string;
}

/** Everything a registry can hold, by kind. */
export interface PluginSet {
  operators?: readonly OperatorPlugin[];
  functions?: readonly FunctionPlugin[];
  actions?: readonly ActionPlugin[];
  fields?: readonly FieldProviderPlugin[];
  variables?: readonly VariableProviderPlugin[];
  renderers?: readonly RendererPlugin<unknown>[];
  validators?: readonly ValidatorPlugin[];
  storage?: readonly StoragePlugin[];
  themes?: readonly ThemePlugin[];
}
