import { action, all, any, condition, field, group, literal, type BuilderOptions } from '@adysre/rules-core';
import type { ActionNode, JsonValue, Operand, RuleNode } from '@adysre/rules-types';
import { builderOptions, finish } from '../finish';
import { isPlainObject, Report, type Importer, type ImportOptions, type ImportResult } from '../types';

/**
 * json-rules-engine.
 *
 * The closest of the three formats to this AST - conditions in `all`/`any`
 * groups, an operator name, a value - so most of the work is naming.
 *
 * Two things do not carry across cleanly. A fact with `params` is a CALL: the
 * engine asks the host to compute the fact with those arguments, which this AST
 * has no way to express and no way to approximate, so it fails. And a fact
 * `path` is JSONPath, of which only the plain `$.a.b` form is a field path;
 * anything with a filter or a wildcard selects a set rather than a value.
 *
 * An `event` becomes an action, which is the one place where the two models
 * agree exactly: both describe what should happen and leave the doing to the
 * host.
 */

const OPERATORS: Readonly<Record<string, string>> = {
  equal: 'equals',
  notEqual: 'notEquals',
  lessThan: 'lessThan',
  lessThanInclusive: 'lessThanOrEqual',
  greaterThan: 'greaterThan',
  greaterThanInclusive: 'greaterThanOrEqual',
  in: 'isOneOf',
  notIn: 'isNotOneOf',
  contains: 'contains',
  doesNotContain: 'notContains',
};

interface Scope {
  report: Report;
  builder: BuilderOptions;
  operators: Readonly<Record<string, string>>;
}

/** `$.total`, `.total` and `total` all mean the same suffix. */
function fieldPathFrom(fact: string, jsonPath: unknown, scope: Scope, path: string): string | null {
  if (jsonPath === undefined || jsonPath === null || jsonPath === '') return fact;

  if (typeof jsonPath !== 'string') {
    scope.report.error('path_invalid', 'A fact path has to be a string.', path);
    return null;
  }

  const suffix = jsonPath.replace(/^\$/, '').replace(/^\./, '');
  if (/[*?@[\]]|\.\./.test(suffix)) {
    // `$.items[*].price` selects many values. A condition compares one.
    scope.report.error(
      'path_unsupported',
      `\`${jsonPath}\` selects more than one value, which a condition cannot compare.`,
      path,
    );
    return null;
  }

  return suffix === '' ? fact : `${fact}.${suffix}`;
}

function convertValue(value: unknown, scope: Scope, path: string): Operand | null {
  // `{ fact: 'other' }` on the right compares two facts.
  if (isPlainObject(value) && typeof value['fact'] === 'string') {
    const resolved = fieldPathFrom(value['fact'], value['path'], scope, `${path}.path`);
    return resolved === null ? null : field(resolved);
  }

  if (isPlainObject(value)) {
    scope.report.error('value_unsupported', 'Only a literal or another fact can be compared to.', path);
    return null;
  }

  return literal(value as JsonValue);
}

function convertCondition(input: unknown, scope: Scope, path: string): RuleNode | null {
  if (!isPlainObject(input)) {
    scope.report.error('condition_invalid', 'A condition has to be an object.', path);
    return null;
  }

  if (Array.isArray(input['all']) || Array.isArray(input['any']) || 'not' in input) {
    return convertGroup(input, scope, path);
  }

  if (typeof input['condition'] === 'string') {
    // A named reference to a condition stored elsewhere in the engine.
    scope.report.error(
      'shared_condition_unsupported',
      `This refers to a shared condition named "${input['condition']}", which is not part of the rule.`,
      path,
    );
    return null;
  }

  const fact = input['fact'];
  if (typeof fact !== 'string' || fact === '') {
    scope.report.error('fact_missing', 'A condition needs a fact.', `${path}.fact`);
    return null;
  }

  if (input['params'] !== undefined) {
    scope.report.error(
      'fact_params_unsupported',
      'This fact is computed with parameters, which this engine has no way to express.',
      `${path}.params`,
    );
    return null;
  }

  const source = input['operator'];
  if (typeof source !== 'string') {
    scope.report.error('operator_missing', 'A condition needs an operator.', `${path}.operator`);
    return null;
  }

  const operator = scope.operators[source] ?? OPERATORS[source];
  if (operator === undefined) {
    scope.report.error(
      'operator_unsupported',
      `\`${source}\` is not an operator this importer knows. Map it with the \`operators\` option.`,
      `${path}.operator`,
    );
    return null;
  }

  const resolved = fieldPathFrom(fact, input['path'], scope, `${path}.path`);
  if (resolved === null) return null;

  const value = convertValue(input['value'], scope, `${path}.value`);
  if (value === null) return null;

  return condition({ left: field(resolved), operator, args: [value] }, scope.builder);
}

function convertGroup(input: Record<string, unknown>, scope: Scope, path: string): RuleNode | null {
  if ('not' in input) {
    const child = convertCondition(input['not'], scope, `${path}.not`);
    if (child === null) return null;
    // `not` wraps one condition; a negated group of one says the same thing and
    // keeps every node in the tree the same two shapes.
    return group('all', [child], { ...scope.builder, negate: true });
  }

  const combinator = Array.isArray(input['all']) ? 'all' : 'any';
  const children = (input[combinator] as unknown[]).map((child, index) =>
    convertCondition(child, scope, `${path}.${combinator}[${index}]`),
  );
  if (children.some((child) => child === null)) return null;

  const build = combinator === 'all' ? all : any;
  return build(children as RuleNode[], scope.builder);
}

function convertEvent(event: unknown, scope: Scope, path: string): ActionNode[] {
  if (event === undefined || event === null) return [];

  if (!isPlainObject(event) || typeof event['type'] !== 'string') {
    scope.report.error('event_invalid', 'An event needs a type.', path);
    return [];
  }

  const params = event['params'];
  return [
    action(
      {
        type: event['type'],
        ...(isPlainObject(params) ? { params: params as Record<string, JsonValue> } : {}),
      },
      scope.builder,
    ),
  ];
}

export function importJsonRulesEngine(input: unknown, options?: ImportOptions): ImportResult {
  const report = new Report();
  const scope: Scope = {
    report,
    builder: builderOptions(options),
    operators: options?.operators ?? {},
  };

  if (!isPlainObject(input)) {
    report.error('not_a_rule', 'A rule has to be an object.', '$');
    return finish({ when: null }, report, options);
  }

  const when = convertCondition(input['conditions'], scope, '$.conditions');
  const then = convertEvent(input['event'], scope, '$.event');
  const name = typeof input['name'] === 'string' ? input['name'] : undefined;
  // The two engines order rules in opposite directions: json-rules-engine runs
  // the HIGHEST priority first, this one runs the lowest. Keeping the number
  // would reverse the order the author chose, so the number changes and the
  // order does not.
  const source = typeof input['priority'] === 'number' ? input['priority'] : undefined;
  if (source !== undefined && source !== 0) {
    report.warn(
      'priority_inverted',
      `Priority ${source} became ${-source}: this engine runs the lowest priority first, and the source ran the highest first.`,
      '$.priority',
    );
  }
  const priority = source === undefined ? undefined : -source;

  return finish(
    {
      when,
      then,
      ...(name === undefined ? {} : { name }),
      ...(priority === undefined ? {} : { priority }),
    },
    report,
    options,
  );
}

export const jsonRulesEngineImporter: Importer = {
  format: 'json-rules-engine',
  labelKey: 'importers.jsonRulesEngine',
  detect: (input) => {
    if (!isPlainObject(input)) return false;
    const conditions = input['conditions'];
    if (!isPlainObject(conditions)) return false;
    return Array.isArray(conditions['all']) || Array.isArray(conditions['any']) || 'not' in conditions;
  },
  import: importJsonRulesEngine,
};
