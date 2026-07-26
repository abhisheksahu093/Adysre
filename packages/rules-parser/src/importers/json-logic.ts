import { all, any, condition, field, fn, group, literal, type BuilderOptions } from '@adysre/rules-core';
import type { JsonValue, Operand, RuleNode } from '@adysre/rules-types';
import { builderOptions, finish } from '../finish.ts';
import { isPlainObject, Report, type Importer, type ImportOptions, type ImportResult } from '../types.ts';

/**
 * JsonLogic.
 *
 * A predicate language, so an imported rule has conditions and no actions:
 * jsonLogic has no notion of what should happen when a rule matches. Whoever
 * imports one supplies that afterwards, which is honest, and better than
 * inventing an action nobody asked for.
 *
 * The interesting part is truthiness. `{"!!": x}` is true when `x` is truthy,
 * and JavaScript truthiness says `0`, `""` and `false` are all false. This
 * engine's `isEmpty` deliberately disagrees: `0` and `false` are values somebody
 * chose, and treating them as absent is the classic bug that makes a rule ignore
 * a legitimate zero. So the mapping is close but not exact, and it converts with
 * a warning that names the difference rather than silently changing what the
 * rule means.
 */

const COMPARISONS: Readonly<Record<string, string>> = {
  '===': 'equals',
  '!==': 'notEquals',
  '==': 'equals',
  '!=': 'notEquals',
  '>': 'greaterThan',
  '>=': 'greaterThanOrEqual',
  '<': 'lessThan',
  '<=': 'lessThanOrEqual',
};

/** Value-computing operators with an exact built-in function. */
const FUNCTIONS: Readonly<Record<string, string>> = {
  '+': 'sum',
  min: 'min',
  max: 'max',
  cat: 'concat',
};

/** Everything jsonLogic can express that this AST cannot. */
const UNSUPPORTED: Readonly<Record<string, string>> = {
  '-': 'subtraction',
  '*': 'multiplication',
  '/': 'division',
  '%': 'the remainder operator',
  if: 'conditional values',
  '?:': 'conditional values',
  map: 'mapping over a list',
  filter: 'filtering a list',
  reduce: 'reducing a list',
  some: 'a test applied to each item of a list',
  every: 'a test applied to each item of a list',
  none: 'a test applied to each item of a list',
  merge: 'merging lists',
  missing: 'a test for absent keys',
  missing_some: 'a test for absent keys',
  substr: 'substrings',
  log: 'logging',
  method: 'calling a method',
  var: 'a variable used where a condition was expected',
};

interface Scope {
  report: Report;
  builder: BuilderOptions;
  /** Host mappings, consulted before the defaults, so custom operators fit. */
  operators: Readonly<Record<string, string>>;
}

const OPERAND_SOURCES = new Set(['var', ...Object.keys(FUNCTIONS)]);

/** The single key a jsonLogic node carries, or null if it is not one. */
function operatorOf(input: unknown): string | null {
  if (!isPlainObject(input)) return null;
  const keys = Object.keys(input);
  return keys.length === 1 ? (keys[0] ?? null) : null;
}

function argsOf(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value];
}

function convertOperand(input: unknown, scope: Scope, path: string): Operand | null {
  if (input === null || typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return literal(input);
  }

  if (Array.isArray(input)) {
    // A bare array is a literal list: `{"in": [x, ["a", "b"]]}`.
    if (input.every(isJsonPrimitive)) return literal(input as JsonValue);
    scope.report.error('operand_unsupported', 'A list of computed values cannot be imported.', path);
    return null;
  }

  const operator = operatorOf(input);
  if (operator === null) {
    scope.report.error('operand_unsupported', 'This is not a value jsonLogic can produce.', path);
    return null;
  }

  const value = (input as Record<string, unknown>)[operator];

  if (operator === 'var') return convertVar(value, scope, `${path}.var`);

  const name = FUNCTIONS[operator];
  if (name !== undefined) {
    const args = argsOf(value).map((argument, index) =>
      convertOperand(argument, scope, `${path}.${operator}[${index}]`),
    );
    if (args.some((argument) => argument === null)) return null;

    if (operator === '+') {
      scope.report.warn(
        'plus_is_numeric',
        '`+` became `sum`, which adds numbers. In jsonLogic it also joins text, and text will now raise instead.',
        path,
      );
    }

    return fn(name, ...(args as Operand[]));
  }

  scope.report.error(
    'operand_unsupported',
    `\`${operator}\` produces a value this engine cannot express.`,
    path,
  );
  return null;
}

function convertVar(value: unknown, scope: Scope, path: string): Operand | null {
  if (typeof value === 'string' && value !== '') return field(value);

  if (Array.isArray(value)) {
    if (value.length > 1) {
      // `{"var": ["a", 0]}` falls back to 0 when `a` is absent. This engine
      // reads an absent field as null and lets the operator decide, so the
      // default would silently disappear.
      scope.report.error(
        'var_default_unsupported',
        'A variable with a fallback value cannot be imported: this engine reads a missing field as empty instead.',
        path,
      );
      return null;
    }
    const only = value[0];
    if (typeof only === 'string' && only !== '') return field(only);
  }

  scope.report.error('var_invalid', 'A variable needs a field path.', path);
  return null;
}

function isJsonPrimitive(value: unknown): boolean {
  return (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

/** Whether this input is a condition rather than a value. */
function isLogicNode(input: unknown): boolean {
  const operator = operatorOf(input);
  if (operator === null) return false;
  if (OPERAND_SOURCES.has(operator)) return false;
  return true;
}

function convertNode(input: unknown, scope: Scope, path: string): RuleNode | null {
  const operator = operatorOf(input);
  if (operator === null) {
    scope.report.error(
      'node_unsupported',
      'A condition has to be an object with exactly one operator.',
      path,
    );
    return null;
  }

  const value = (input as Record<string, unknown>)[operator];
  const args = argsOf(value);

  if (operator === 'and' || operator === 'or') {
    const children = args.map((child, index) => convertNode(child, scope, `${path}.${operator}[${index}]`));
    if (children.some((child) => child === null)) return null;
    const build = operator === 'and' ? all : any;
    return build(children as RuleNode[], scope.builder);
  }

  if (operator === '!' || operator === '!!') {
    return convertTruthiness(args[0], operator === '!', scope, `${path}.${operator}`);
  }

  if (operator === 'in') return convertIn(args, scope, `${path}.in`);

  const mapped = scope.operators[operator] ?? COMPARISONS[operator];
  if (mapped !== undefined) return convertComparison(operator, mapped, args, scope, `${path}.${operator}`);

  const reason = UNSUPPORTED[operator];
  scope.report.error(
    'operator_unsupported',
    reason === undefined
      ? `\`${operator}\` is not a jsonLogic operator this importer knows.`
      : `\`${operator}\` (${reason}) has no equivalent in this engine.`,
    path,
  );
  return null;
}

function convertTruthiness(
  input: unknown,
  negate: boolean,
  scope: Scope,
  path: string,
): RuleNode | null {
  // `{"!": <condition>}` is a negation; `{"!": {"var": "a"}}` is a test on a
  // value. Which one it is depends on what is inside, not on the operator.
  if (isLogicNode(input)) {
    const child = convertNode(input, scope, path);
    if (child === null) return null;
    if (!negate) return child;

    return child.kind === 'group'
      ? group(child.combinator, child.children, { ...scope.builder, negate: true })
      : condition(
          { left: child.left, operator: child.operator, args: child.args, negate: child.negate !== true },
          scope.builder,
        );
  }

  const operand = convertOperand(input, scope, path);
  if (operand === null) return null;

  scope.report.warn(
    'truthiness_is_not_emptiness',
    'A truthiness test became an emptiness test. In jsonLogic `0` and `false` count as false; here they are values, and only null, empty text and empty lists are empty.',
    path,
  );

  return condition({ left: operand, operator: negate ? 'isEmpty' : 'isNotEmpty' }, scope.builder);
}

/** `{"in": [needle, haystack]}` is a list test or a substring test. */
function convertIn(args: readonly unknown[], scope: Scope, path: string): RuleNode | null {
  if (args.length !== 2) {
    scope.report.error('arity_unsupported', '`in` takes a value and something to look in.', path);
    return null;
  }

  const needle = convertOperand(args[0], scope, `${path}[0]`);
  const haystack = convertOperand(args[1], scope, `${path}[1]`);
  if (needle === null || haystack === null) return null;

  if (haystack.source === 'literal' && typeof haystack.value === 'string') {
    // Substring: the sides swap, because `contains` reads the other way round.
    return condition({ left: haystack, operator: 'contains', args: [needle] }, scope.builder);
  }

  if (haystack.source !== 'literal' || !Array.isArray(haystack.value)) {
    scope.report.warn(
      'in_assumed_list',
      '`in` was imported as a list test. In jsonLogic it also tests substrings, which cannot be told apart until the rule runs.',
      path,
    );
  }

  return condition({ left: needle, operator: 'isOneOf', args: [haystack] }, scope.builder);
}

function convertComparison(
  source: string,
  operator: string,
  args: readonly unknown[],
  scope: Scope,
  path: string,
): RuleNode | null {
  if (args.length === 3 && (source === '<' || source === '<=')) return convertRange(source, args, scope, path);

  if (args.length !== 2) {
    scope.report.error('arity_unsupported', `\`${source}\` needs two values here.`, path);
    return null;
  }

  const left = convertOperand(args[0], scope, `${path}[0]`);
  const right = convertOperand(args[1], scope, `${path}[1]`);
  if (left === null || right === null) return null;

  if (source === '==' || source === '!=') {
    scope.report.warn(
      'loose_equality',
      `\`${source}\` compares loosely in jsonLogic, so \`"1"\` equals \`1\`. Here the kinds have to match.`,
      path,
    );
  }

  return condition({ left, operator, args: [right] }, scope.builder);
}

/** `{"<": [1, x, 10]}` says x is between 1 and 10. */
function convertRange(
  source: string,
  args: readonly unknown[],
  scope: Scope,
  path: string,
): RuleNode | null {
  const low = convertOperand(args[0], scope, `${path}[0]`);
  const middle = convertOperand(args[1], scope, `${path}[1]`);
  const high = convertOperand(args[2], scope, `${path}[2]`);
  if (low === null || middle === null || high === null) return null;

  // `between` is inclusive, so only `<=` maps to it. The exclusive form becomes
  // two conditions, which is exact rather than nearly right.
  if (source === '<=') {
    return condition({ left: middle, operator: 'between', args: [low, high] }, scope.builder);
  }

  return all(
    [
      condition({ left: middle, operator: 'greaterThan', args: [low] }, scope.builder),
      condition({ left: middle, operator: 'lessThan', args: [high] }, scope.builder),
    ],
    scope.builder,
  );
}

export function importJsonLogic(input: unknown, options?: ImportOptions): ImportResult {
  const report = new Report();
  const scope: Scope = {
    report,
    builder: builderOptions(options),
    operators: options?.operators ?? {},
  };
  const when = convertNode(input, scope, '$');

  return finish({ when, name: options?.name ?? 'Imported from jsonLogic' }, report, options);
}

export const jsonLogicImporter: Importer = {
  format: 'json-logic',
  labelKey: 'importers.jsonLogic',
  detect: (input) => {
    const operator = operatorOf(input);
    if (operator === null) return false;
    return (
      operator === 'and' ||
      operator === 'or' ||
      operator === '!' ||
      operator === '!!' ||
      operator === 'in' ||
      Object.hasOwn(COMPARISONS, operator) ||
      Object.hasOwn(UNSUPPORTED, operator)
    );
  },
  import: importJsonLogic,
};
