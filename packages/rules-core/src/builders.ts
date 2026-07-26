import {
  AST_SCHEMA_VERSION,
  type ActionNode,
  type Combinator,
  type ConditionNode,
  type GroupNode,
  type JsonValue,
  type Operand,
  type RuleDocument,
  type RuleKind,
  type RuleNode,
  type RuleSet,
  type SetStrategy,
} from '@adysre/rules-types';
import { createNodeId, type IdFactory } from './ids';

/**
 * Building an AST in code.
 *
 * The visual builder is not the only author of rules: tests write them,
 * migrations rewrite them, importers produce them, and a host may express a
 * default policy in TypeScript. All of those need a way to construct the same
 * tree the UI does, and hand-writing node literals means hand-writing ids and
 * remembering which fields are optional.
 *
 * So these are constructors, not a DSL. They return plain AST objects with no
 * hidden state, which keeps the tree serialisable and means anything built here
 * can equally be loaded from JSON.
 */

export interface BuilderOptions {
  /** Injected so a caller can make a document reproducible. See `sequentialIds`. */
  ids?: IdFactory;
  /** Injected for the same reason: a fixed clock produces a stable document. */
  now?: () => number;
}

const defaults: Required<BuilderOptions> = {
  ids: createNodeId,
  now: () => Date.now(),
};

/* ── operands ─────────────────────────────────────────────────────────── */

/** A value written into the rule. */
export const literal = (value: JsonValue): Operand => ({ source: 'literal', value });

/** A value read from the subject, by dotted path. */
export const field = (path: string): Operand => ({ source: 'field', path });

/** A value the host supplies at evaluation time. */
export const variable = (name: string): Operand => ({ source: 'variable', name });

/** A computed value. Arguments are operands, so functions nest. */
export const fn = (name: string, ...args: Operand[]): Operand => ({
  source: 'function',
  name,
  args,
});

/* ── nodes ────────────────────────────────────────────────────────────── */

export interface ConditionInput {
  left: Operand;
  operator: string;
  args?: Operand[];
  negate?: boolean;
  comment?: string;
}

export function condition(input: ConditionInput, options: BuilderOptions = {}): ConditionNode {
  const ids = options.ids ?? defaults.ids;
  return {
    kind: 'condition',
    id: ids('c'),
    left: input.left,
    operator: input.operator,
    args: input.args ?? [],
    ...(input.negate ? { negate: true } : {}),
    ...(input.comment ? { comment: input.comment } : {}),
  };
}

export function group(
  combinator: Combinator,
  children: RuleNode[] = [],
  options: BuilderOptions & { negate?: boolean; comment?: string } = {},
): GroupNode {
  const ids = options.ids ?? defaults.ids;
  return {
    kind: 'group',
    id: ids('g'),
    combinator,
    children,
    ...(options.negate ? { negate: true } : {}),
    ...(options.comment ? { comment: options.comment } : {}),
  };
}

/** `all` and `any` are so common they get their own names. */
export const all = (children: RuleNode[] = [], options: BuilderOptions = {}): GroupNode =>
  group('all', children, options);

export const any = (children: RuleNode[] = [], options: BuilderOptions = {}): GroupNode =>
  group('any', children, options);

export const none = (children: RuleNode[] = [], options: BuilderOptions = {}): GroupNode =>
  group('none', children, options);

export interface ActionInput {
  type: string;
  target?: string;
  value?: Operand;
  params?: Record<string, JsonValue>;
  comment?: string;
}

export function action(input: ActionInput, options: BuilderOptions = {}): ActionNode {
  const ids = options.ids ?? defaults.ids;
  return {
    id: ids('a'),
    type: input.type,
    ...(input.target === undefined ? {} : { target: input.target }),
    ...(input.value === undefined ? {} : { value: input.value }),
    ...(input.params === undefined ? {} : { params: input.params }),
    ...(input.comment === undefined ? {} : { comment: input.comment }),
  };
}

/* ── documents ────────────────────────────────────────────────────────── */

export interface RuleInput {
  name: string;
  kind: RuleKind;
  when?: GroupNode;
  then?: ActionNode[];
  otherwise?: ActionNode[];
  description?: string;
  key?: string;
  priority?: number;
  tags?: string[];
  enabled?: boolean;
  status?: RuleDocument['status'];
  createdBy?: string;
}

/**
 * A complete rule.
 *
 * `when` defaults to an empty `all` group, which is the honest empty state: a
 * rule with no conditions matches everything, and that is what an author sees
 * before they add the first row.
 */
export function rule(input: RuleInput, options: BuilderOptions = {}): RuleDocument {
  const ids = options.ids ?? defaults.ids;
  const now = new Date(options.now?.() ?? defaults.now()).toISOString();

  return {
    schemaVersion: AST_SCHEMA_VERSION,
    id: ids('r'),
    ...(input.key === undefined ? {} : { key: input.key }),
    name: input.name,
    description: input.description ?? '',
    kind: input.kind,
    status: input.status ?? 'draft',
    version: 1,
    priority: input.priority ?? 0,
    enabled: input.enabled ?? true,
    when: input.when ?? all([], options),
    then: input.then ?? [],
    ...(input.otherwise === undefined ? {} : { otherwise: input.otherwise }),
    tags: input.tags ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      ...(input.createdBy === undefined ? {} : { createdBy: input.createdBy }),
    },
  };
}

export interface RuleSetInput {
  name: string;
  rules?: RuleDocument[];
  strategy?: SetStrategy;
  description?: string;
}

export function ruleSet(input: RuleSetInput, options: BuilderOptions = {}): RuleSet {
  const ids = options.ids ?? defaults.ids;
  const now = new Date(options.now?.() ?? defaults.now()).toISOString();

  return {
    schemaVersion: AST_SCHEMA_VERSION,
    id: ids('s'),
    name: input.name,
    description: input.description ?? '',
    strategy: input.strategy ?? 'all-matches',
    rules: input.rules ?? [],
    metadata: { createdAt: now, updatedAt: now },
  };
}
