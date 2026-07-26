import { all, any, condition, field, group, literal, none, type BuilderOptions } from '@adysre/rules-core';
import type { JsonValue, RuleNode } from '@adysre/rules-types';
import { builderOptions, finish } from '../finish.ts';
import { isPlainObject, Report, type Importer, type ImportOptions, type ImportResult } from '../types.ts';

/**
 * MongoDB-style query filters.
 *
 * Not because anyone runs a rules engine on Mongo, but because this shape is
 * how predicates are stored all over the place: a saved search, a segment
 * definition, a permission filter, an audience. Importing them is usually how a
 * team's existing "rules" get into a rule builder for the first time.
 *
 * The one real mismatch is that a Mongo filter on an array field matches when
 * ANY element matches, silently. `{ tags: "vip" }` is true when `tags` contains
 * "vip". This engine has `contains` for that and `equals` for equality, and
 * cannot tell from the query which one was meant, so the import warns and keeps
 * `equals` - the reading the query literally says.
 */

const OPERATORS: Readonly<Record<string, string>> = {
  $eq: 'equals',
  $ne: 'notEquals',
  $gt: 'greaterThan',
  $gte: 'greaterThanOrEqual',
  $lt: 'lessThan',
  $lte: 'lessThanOrEqual',
  $in: 'isOneOf',
  $nin: 'isNotOneOf',
  $regex: 'matches',
  $size: 'hasSize',
  $all: 'hasAllOf',
};

const UNSUPPORTED: Readonly<Record<string, string>> = {
  $expr: 'an aggregation expression',
  $where: 'JavaScript evaluated by the database',
  $jsonSchema: 'a schema check',
  $text: 'a full-text search',
  $elemMatch: 'a test applied to each element of a list',
  $mod: 'a remainder test',
  $type: 'a BSON type check',
  $geoWithin: 'a geospatial query',
  $near: 'a geospatial query',
  $bitsAllSet: 'a bitwise test',
};

const COMBINATORS: Readonly<Record<string, 'all' | 'any' | 'none'>> = {
  $and: 'all',
  $or: 'any',
  $nor: 'none',
};

interface Scope {
  report: Report;
  builder: BuilderOptions;
  operators: Readonly<Record<string, string>>;
}

function isOperatorObject(value: unknown): value is Record<string, unknown> {
  // Every key starting with `$` makes it an operator object; a mixed object is
  // a Mongo error rather than something to guess at, and a plain object is an
  // exact document match.
  return isPlainObject(value) && Object.keys(value).length > 0 && Object.keys(value).every((key) => key.startsWith('$'));
}

function build(combinator: 'all' | 'any' | 'none', children: RuleNode[], builder: BuilderOptions): RuleNode {
  if (combinator === 'all') return all(children, builder);
  if (combinator === 'any') return any(children, builder);
  return none(children, builder);
}

function convertFilter(input: unknown, scope: Scope, path: string): RuleNode | null {
  if (!isPlainObject(input)) {
    scope.report.error('filter_invalid', 'A filter has to be an object.', path);
    return null;
  }

  const children: RuleNode[] = [];

  for (const [key, value] of Object.entries(input)) {
    const converted = key.startsWith('$')
      ? convertTopLevel(key, value, scope, `${path}.${key}`)
      : convertFieldFilter(key, value, scope, `${path}.${key}`);

    if (converted === null) return null;
    children.push(...converted);
  }

  if (children.length === 1) return children[0] ?? null;
  return all(children, scope.builder);
}

function convertTopLevel(
  key: string,
  value: unknown,
  scope: Scope,
  path: string,
): RuleNode[] | null {
  const combinator = COMBINATORS[key];
  if (combinator !== undefined) {
    if (!Array.isArray(value)) {
      scope.report.error('combinator_invalid', `\`${key}\` takes a list of filters.`, path);
      return null;
    }
    const children = value.map((child, index) => convertFilter(child, scope, `${path}[${index}]`));
    if (children.some((child) => child === null)) return null;
    return [build(combinator, children as RuleNode[], scope.builder)];
  }

  if (key === '$not') {
    const child = convertFilter(value, scope, path);
    return child === null ? null : [group('all', [child], { ...scope.builder, negate: true })];
  }

  reportUnknown(key, scope, path);
  return null;
}

function convertFieldFilter(
  fieldPath: string,
  value: unknown,
  scope: Scope,
  path: string,
): RuleNode[] | null {
  if (!isOperatorObject(value)) {
    if (Array.isArray(value) || isPlainObject(value)) {
      scope.report.warn(
        'exact_match_on_structure',
        `\`${fieldPath}\` is compared to a whole list or object, which matches only when every part is equal and in the same order.`,
        path,
      );
    }
    return [
      condition(
        { left: field(fieldPath), operator: 'equals', args: [literal(value as JsonValue)] },
        scope.builder,
      ),
    ];
  }

  const conditions: RuleNode[] = [];

  for (const [key, argument] of Object.entries(value)) {
    // Flags belong to the `$regex` beside them, and are handled there.
    if (key === '$options') continue;

    const converted = convertFieldOperator(fieldPath, key, argument, value, scope, `${path}.${key}`);
    if (converted === null) return null;
    conditions.push(converted);
  }

  return conditions;
}

function convertFieldOperator(
  fieldPath: string,
  key: string,
  argument: unknown,
  siblings: Record<string, unknown>,
  scope: Scope,
  path: string,
): RuleNode | null {
  const left = field(fieldPath);

  if (key === '$exists') {
    return condition(
      { left, operator: argument === false ? 'isNull' : 'isNotNull' },
      scope.builder,
    );
  }

  if (key === '$not') {
    const inner = convertFieldFilter(fieldPath, argument, scope, path);
    if (inner === null) return null;
    return group('all', inner, { ...scope.builder, negate: true });
  }

  if (key === '$regex' && typeof siblings['$options'] === 'string' && siblings['$options'] !== '') {
    // `$options: "i"` is case-insensitivity, and this engine's `matches` takes a
    // pattern with no flags. Dropping the flag would change which values match.
    scope.report.error(
      'regex_options_unsupported',
      `Pattern flags (\`${String(siblings['$options'])}\`) cannot be imported, and dropping them would change what the rule matches.`,
      path,
    );
    return null;
  }

  const operator = scope.operators[key] ?? OPERATORS[key];
  if (operator === undefined) {
    reportUnknown(key, scope, path);
    return null;
  }

  if (isPlainObject(argument)) {
    scope.report.error('value_unsupported', 'Only a plain value can be compared to.', path);
    return null;
  }

  return condition({ left, operator, args: [literal(argument as JsonValue)] }, scope.builder);
}

function reportUnknown(key: string, scope: Scope, path: string): void {
  const reason = UNSUPPORTED[key];
  scope.report.error(
    'operator_unsupported',
    reason === undefined
      ? `\`${key}\` is not a query operator this importer knows. Map it with the \`operators\` option.`
      : `\`${key}\` (${reason}) has no equivalent in this engine.`,
    path,
  );
}

export function importMongoFilter(input: unknown, options?: ImportOptions): ImportResult {
  const report = new Report();
  const scope: Scope = {
    report,
    builder: builderOptions(options),
    operators: options?.operators ?? {},
  };

  const when = convertFilter(input, scope, '$');
  return finish({ when, name: options?.name ?? 'Imported from a query filter' }, report, options);
}

export const mongoImporter: Importer = {
  format: 'mongo',
  labelKey: 'importers.mongo',
  detect: (input) => {
    if (!isPlainObject(input)) return false;
    const keys = Object.keys(input);
    if (keys.length === 0) return false;

    return keys.every(
      (key) =>
        Object.hasOwn(COMBINATORS, key) ||
        key === '$not' ||
        Object.hasOwn(UNSUPPORTED, key) ||
        // A field name: anything that is not one of Mongo's own keywords.
        !key.startsWith('$'),
    );
  },
  import: importMongoFilter,
};
