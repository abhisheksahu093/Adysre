import type { JsonValue, OperatorPlugin } from '@adysre/rules-types';
import { RuleError } from '../errors.ts';
import { compareValues, isEmptyValue, toList, toText, valuesEqual } from './compare.ts';

/**
 * The operators every rule set needs.
 *
 * A starting vocabulary, not a closed one: a host registers its own alongside
 * these, and can leave any of them out. Each carries its arity and the types it
 * accepts, which is what lets the builder offer only the operators that fit the
 * field somebody picked, and the validator refuse a condition that cannot run
 * before it ever reaches the executor.
 *
 * Every `toText` returns a fragment of a sentence rather than a whole one,
 * because the renderer composes them with the operands it has already rendered.
 * Keeping the fragment here is what stops the natural-language output from
 * being a second implementation of the operator set, maintained separately and
 * drifting.
 */

/** The check every operator does first, so none of them repeats it. */
function requireArgs(id: string, args: JsonValue[], count: number): void {
  if (args.length < count) {
    throw new RuleError('arity_mismatch', `${id} needs ${count} value(s) to compare against.`, id);
  }
}

const equals: OperatorPlugin = {
  id: 'equals',
  labelKey: 'operators.equals',
  arity: 1,
  evaluate: (left, args) => {
    requireArgs('equals', args, 1);
    return valuesEqual(left, args[0]!);
  },
  toText: (left, args) => `${left} is ${args[0]}`,
};

const notEquals: OperatorPlugin = {
  id: 'notEquals',
  labelKey: 'operators.notEquals',
  arity: 1,
  evaluate: (left, args) => {
    requireArgs('notEquals', args, 1);
    return !valuesEqual(left, args[0]!);
  },
  toText: (left, args) => `${left} is not ${args[0]}`,
};

const greaterThan: OperatorPlugin = {
  id: 'greaterThan',
  labelKey: 'operators.greaterThan',
  arity: 1,
  accepts: ['number', 'date', 'string'],
  evaluate: (left, args) => {
    requireArgs('greaterThan', args, 1);
    return compareValues(left, args[0]!, 'greaterThan') > 0;
  },
  toText: (left, args) => `${left} is greater than ${args[0]}`,
};

const greaterThanOrEqual: OperatorPlugin = {
  id: 'greaterThanOrEqual',
  labelKey: 'operators.greaterThanOrEqual',
  arity: 1,
  accepts: ['number', 'date', 'string'],
  evaluate: (left, args) => {
    requireArgs('greaterThanOrEqual', args, 1);
    return compareValues(left, args[0]!, 'greaterThanOrEqual') >= 0;
  },
  toText: (left, args) => `${left} is at least ${args[0]}`,
};

const lessThan: OperatorPlugin = {
  id: 'lessThan',
  labelKey: 'operators.lessThan',
  arity: 1,
  accepts: ['number', 'date', 'string'],
  evaluate: (left, args) => {
    requireArgs('lessThan', args, 1);
    return compareValues(left, args[0]!, 'lessThan') < 0;
  },
  toText: (left, args) => `${left} is less than ${args[0]}`,
};

const lessThanOrEqual: OperatorPlugin = {
  id: 'lessThanOrEqual',
  labelKey: 'operators.lessThanOrEqual',
  arity: 1,
  accepts: ['number', 'date', 'string'],
  evaluate: (left, args) => {
    requireArgs('lessThanOrEqual', args, 1);
    return compareValues(left, args[0]!, 'lessThanOrEqual') <= 0;
  },
  toText: (left, args) => `${left} is at most ${args[0]}`,
};

/** Inclusive at both ends, which is what "between" means to everyone but a mathematician. */
const between: OperatorPlugin = {
  id: 'between',
  labelKey: 'operators.between',
  arity: 2,
  accepts: ['number', 'date'],
  evaluate: (left, args) => {
    requireArgs('between', args, 2);
    return (
      compareValues(left, args[0]!, 'between') >= 0 && compareValues(left, args[1]!, 'between') <= 0
    );
  },
  toText: (left, args) => `${left} is between ${args[0]} and ${args[1]}`,
};

const notBetween: OperatorPlugin = {
  id: 'notBetween',
  labelKey: 'operators.notBetween',
  arity: 2,
  accepts: ['number', 'date'],
  evaluate: (left, args, context) => !between.evaluate(left, args, context),
  toText: (left, args) => `${left} is not between ${args[0]} and ${args[1]}`,
};

const isOneOf: OperatorPlugin = {
  id: 'isOneOf',
  labelKey: 'operators.isOneOf',
  arity: null,
  evaluate: (left, args) => {
    // One list argument and a spread list mean the same thing, because the
    // builder produces the first and hand-written rules tend to produce the
    // second, and refusing either would be a distinction without a reason.
    const candidates = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    return candidates.some((candidate) => valuesEqual(left, candidate));
  },
  toText: (left, args) => `${left} is one of ${args.join(', ')}`,
};

const isNotOneOf: OperatorPlugin = {
  id: 'isNotOneOf',
  labelKey: 'operators.isNotOneOf',
  arity: null,
  evaluate: (left, args, context) => !isOneOf.evaluate(left, args, context),
  toText: (left, args) => `${left} is not one of ${args.join(', ')}`,
};

const contains: OperatorPlugin = {
  id: 'contains',
  labelKey: 'operators.contains',
  arity: 1,
  accepts: ['string', 'array'],
  evaluate: (left, args) => {
    requireArgs('contains', args, 1);
    if (typeof left === 'string') return left.includes(toText(args[0]!, 'contains'));
    return toList(left, 'contains').some((entry) => valuesEqual(entry, args[0]!));
  },
  toText: (left, args) => `${left} contains ${args[0]}`,
};

const notContains: OperatorPlugin = {
  id: 'notContains',
  labelKey: 'operators.notContains',
  arity: 1,
  accepts: ['string', 'array'],
  evaluate: (left, args, context) => !contains.evaluate(left, args, context),
  toText: (left, args) => `${left} does not contain ${args[0]}`,
};

const startsWith: OperatorPlugin = {
  id: 'startsWith',
  labelKey: 'operators.startsWith',
  arity: 1,
  accepts: ['string'],
  evaluate: (left, args) => {
    requireArgs('startsWith', args, 1);
    return toText(left, 'startsWith').startsWith(toText(args[0]!, 'startsWith'));
  },
  toText: (left, args) => `${left} starts with ${args[0]}`,
};

const endsWith: OperatorPlugin = {
  id: 'endsWith',
  labelKey: 'operators.endsWith',
  arity: 1,
  accepts: ['string'],
  evaluate: (left, args) => {
    requireArgs('endsWith', args, 1);
    return toText(left, 'endsWith').endsWith(toText(args[0]!, 'endsWith'));
  },
  toText: (left, args) => `${left} ends with ${args[0]}`,
};

const equalsIgnoreCase: OperatorPlugin = {
  id: 'equalsIgnoreCase',
  labelKey: 'operators.equalsIgnoreCase',
  arity: 1,
  accepts: ['string'],
  evaluate: (left, args) => {
    requireArgs('equalsIgnoreCase', args, 1);
    return (
      toText(left, 'equalsIgnoreCase').toLowerCase() ===
      toText(args[0]!, 'equalsIgnoreCase').toLowerCase()
    );
  },
  toText: (left, args) => `${left} is ${args[0]}, ignoring case`,
};

/**
 * Regular expression matching.
 *
 * The pattern comes from a rule author, so it is untrusted input that runs in
 * the engine's own process. JavaScript cannot interrupt a regular expression
 * mid-execution, which makes a catastrophically backtracking pattern a denial
 * of service that no timeout above can rescue.
 *
 * So both the pattern and the subject are bounded, which turns the worst case
 * from unbounded into merely slow. A deployment that lets untrusted third
 * parties author rules should leave this operator unregistered; that choice
 * exists precisely because operators are plugins.
 */
const MAX_PATTERN_LENGTH = 200;
const MAX_SUBJECT_LENGTH = 10_000;

const matches: OperatorPlugin = {
  id: 'matches',
  labelKey: 'operators.matches',
  arity: 1,
  accepts: ['string'],
  evaluate: (left, args) => {
    requireArgs('matches', args, 1);
    const subject = toText(left, 'matches');
    const pattern = toText(args[0]!, 'matches');

    if (pattern.length > MAX_PATTERN_LENGTH) {
      throw new RuleError('limit_exceeded', 'That pattern is too long to run safely.', 'matches');
    }
    if (subject.length > MAX_SUBJECT_LENGTH) {
      throw new RuleError('limit_exceeded', 'That value is too long to match against.', 'matches');
    }

    try {
      return new RegExp(pattern).test(subject);
    } catch {
      throw new RuleError('invalid_argument', 'That is not a valid pattern.', 'matches');
    }
  },
  toText: (left, args) => `${left} matches ${args[0]}`,
};

const isEmpty: OperatorPlugin = {
  id: 'isEmpty',
  labelKey: 'operators.isEmpty',
  arity: 0,
  evaluate: (left) => isEmptyValue(left),
  toText: (left) => `${left} is empty`,
};

const isNotEmpty: OperatorPlugin = {
  id: 'isNotEmpty',
  labelKey: 'operators.isNotEmpty',
  arity: 0,
  evaluate: (left) => !isEmptyValue(left),
  toText: (left) => `${left} is not empty`,
};

const isNull: OperatorPlugin = {
  id: 'isNull',
  labelKey: 'operators.isNull',
  arity: 0,
  evaluate: (left) => left === null,
  toText: (left) => `${left} is not set`,
};

const isNotNull: OperatorPlugin = {
  id: 'isNotNull',
  labelKey: 'operators.isNotNull',
  arity: 0,
  evaluate: (left) => left !== null,
  toText: (left) => `${left} is set`,
};

const isTrue: OperatorPlugin = {
  id: 'isTrue',
  labelKey: 'operators.isTrue',
  arity: 0,
  accepts: ['boolean'],
  evaluate: (left) => left === true,
  toText: (left) => `${left} is true`,
};

const isFalse: OperatorPlugin = {
  id: 'isFalse',
  labelKey: 'operators.isFalse',
  arity: 0,
  accepts: ['boolean'],
  evaluate: (left) => left === false,
  toText: (left) => `${left} is false`,
};

const before: OperatorPlugin = {
  id: 'before',
  labelKey: 'operators.before',
  arity: 1,
  accepts: ['date'],
  evaluate: (left, args) => {
    requireArgs('before', args, 1);
    return compareValues(left, args[0]!, 'before') < 0;
  },
  toText: (left, args) => `${left} is before ${args[0]}`,
};

const after: OperatorPlugin = {
  id: 'after',
  labelKey: 'operators.after',
  arity: 1,
  accepts: ['date'],
  evaluate: (left, args) => {
    requireArgs('after', args, 1);
    return compareValues(left, args[0]!, 'after') > 0;
  },
  toText: (left, args) => `${left} is after ${args[0]}`,
};

const hasSize: OperatorPlugin = {
  id: 'hasSize',
  labelKey: 'operators.hasSize',
  arity: 1,
  accepts: ['array', 'string'],
  evaluate: (left, args) => {
    requireArgs('hasSize', args, 1);
    const size = typeof left === 'string' ? left.length : toList(left, 'hasSize').length;
    return size === args[0];
  },
  toText: (left, args) => `${left} has exactly ${args[0]} item(s)`,
};

const hasAnyOf: OperatorPlugin = {
  id: 'hasAnyOf',
  labelKey: 'operators.hasAnyOf',
  arity: null,
  accepts: ['array'],
  evaluate: (left, args) => {
    const list = toList(left, 'hasAnyOf');
    const wanted = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    return wanted.some((candidate) => list.some((entry) => valuesEqual(entry, candidate)));
  },
  toText: (left, args) => `${left} includes any of ${args.join(', ')}`,
};

const hasAllOf: OperatorPlugin = {
  id: 'hasAllOf',
  labelKey: 'operators.hasAllOf',
  arity: null,
  accepts: ['array'],
  evaluate: (left, args) => {
    const list = toList(left, 'hasAllOf');
    const wanted = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
    return wanted.every((candidate) => list.some((entry) => valuesEqual(entry, candidate)));
  },
  toText: (left, args) => `${left} includes all of ${args.join(', ')}`,
};

/** Every built-in operator, in the order a picker should show them. */
export const builtinOperators: readonly OperatorPlugin[] = [
  equals,
  notEquals,
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  between,
  notBetween,
  isOneOf,
  isNotOneOf,
  contains,
  notContains,
  startsWith,
  endsWith,
  equalsIgnoreCase,
  matches,
  before,
  after,
  isEmpty,
  isNotEmpty,
  isNull,
  isNotNull,
  isTrue,
  isFalse,
  hasSize,
  hasAnyOf,
  hasAllOf,
];
