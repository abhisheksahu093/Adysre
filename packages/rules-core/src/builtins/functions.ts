import type { FunctionPlugin, JsonValue } from '@adysre/rules-types';
import { RuleError } from '../errors';
import { compareValues, isDateString, toList, toNumber, toText } from './compare';

/**
 * The functions every rule set needs.
 *
 * All pure, and all reading time from `context.now` rather than the clock.
 * That is the difference between a rules engine you can test and one you
 * cannot: `today()` reading `Date.now()` makes every rule that mentions a date
 * unreproducible, so a failing rule can never be replayed and a debugger can
 * never show what it saw.
 */

function requireArgs(id: string, args: JsonValue[], count: number): void {
  if (args.length < count) {
    throw new RuleError('arity_mismatch', `${id} needs ${count} argument(s).`, id);
  }
}

/* ── time ─────────────────────────────────────────────────────────────── */

const now: FunctionPlugin = {
  id: 'now',
  labelKey: 'functions.now',
  arity: 0,
  returns: 'date',
  evaluate: (_args, context) => new Date(context.now).toISOString(),
  toText: () => 'now',
};

const today: FunctionPlugin = {
  id: 'today',
  labelKey: 'functions.today',
  arity: 0,
  returns: 'date',
  // Midnight UTC, so "today" is the same instant for everyone comparing against
  // it. A local-time "today" would make the same rule fire differently in two
  // offices, which is exactly the class of bug a rules engine exists to remove.
  evaluate: (_args, context) => new Date(context.now).toISOString().slice(0, 10),
  toText: () => 'today',
};

const daysAgo: FunctionPlugin = {
  id: 'daysAgo',
  labelKey: 'functions.daysAgo',
  arity: 1,
  argTypes: ['number'],
  returns: 'date',
  evaluate: (args, context) => {
    requireArgs('daysAgo', args, 1);
    const days = toNumber(args[0]!, 'daysAgo');
    return new Date(context.now - days * 86_400_000).toISOString();
  },
  toText: (args) => `${args[0]} days ago`,
};

const daysFromNow: FunctionPlugin = {
  id: 'daysFromNow',
  labelKey: 'functions.daysFromNow',
  arity: 1,
  argTypes: ['number'],
  returns: 'date',
  evaluate: (args, context) => {
    requireArgs('daysFromNow', args, 1);
    return new Date(context.now + toNumber(args[0]!, 'daysFromNow') * 86_400_000).toISOString();
  },
  toText: (args) => `${args[0]} days from now`,
};

const daysBetween: FunctionPlugin = {
  id: 'daysBetween',
  labelKey: 'functions.daysBetween',
  arity: 2,
  argTypes: ['date', 'date'],
  returns: 'number',
  evaluate: (args) => {
    requireArgs('daysBetween', args, 2);
    for (const argument of args.slice(0, 2)) {
      if (!isDateString(argument)) {
        throw new RuleError('type_mismatch', 'daysBetween expects two dates.', 'daysBetween');
      }
    }
    return Math.round(compareValues(args[1]!, args[0]!, 'daysBetween') / 86_400_000);
  },
  toText: (args) => `days between ${args[0]} and ${args[1]}`,
};

const yearsSince: FunctionPlugin = {
  id: 'yearsSince',
  labelKey: 'functions.yearsSince',
  arity: 1,
  argTypes: ['date'],
  returns: 'number',
  evaluate: (args, context) => {
    requireArgs('yearsSince', args, 1);
    if (!isDateString(args[0]!)) {
      throw new RuleError('type_mismatch', 'yearsSince expects a date.', 'yearsSince');
    }
    // Whole years, the way an age is counted: a birthday that has not happened
    // yet this year does not count.
    const from = new Date(Date.parse(args[0] as string));
    const to = new Date(context.now);
    let years = to.getUTCFullYear() - from.getUTCFullYear();
    const monthDelta = to.getUTCMonth() - from.getUTCMonth();
    if (monthDelta < 0 || (monthDelta === 0 && to.getUTCDate() < from.getUTCDate())) years -= 1;
    return years;
  },
  toText: (args) => `years since ${args[0]}`,
};

/* ── text ─────────────────────────────────────────────────────────────── */

const length: FunctionPlugin = {
  id: 'length',
  labelKey: 'functions.length',
  arity: 1,
  returns: 'number',
  evaluate: (args) => {
    requireArgs('length', args, 1);
    const value = args[0]!;
    if (typeof value === 'string') return value.length;
    if (Array.isArray(value)) return value.length;
    if (value !== null && typeof value === 'object') return Object.keys(value).length;
    throw new RuleError('type_mismatch', 'length expects text, a list or an object.', 'length');
  },
  toText: (args) => `the length of ${args[0]}`,
};

const lower: FunctionPlugin = {
  id: 'lower',
  labelKey: 'functions.lower',
  arity: 1,
  argTypes: ['string'],
  returns: 'string',
  evaluate: (args) => {
    requireArgs('lower', args, 1);
    return toText(args[0]!, 'lower').toLowerCase();
  },
  toText: (args) => `${args[0]} in lower case`,
};

const upper: FunctionPlugin = {
  id: 'upper',
  labelKey: 'functions.upper',
  arity: 1,
  argTypes: ['string'],
  returns: 'string',
  evaluate: (args) => {
    requireArgs('upper', args, 1);
    return toText(args[0]!, 'upper').toUpperCase();
  },
  toText: (args) => `${args[0]} in upper case`,
};

const trim: FunctionPlugin = {
  id: 'trim',
  labelKey: 'functions.trim',
  arity: 1,
  argTypes: ['string'],
  returns: 'string',
  evaluate: (args) => {
    requireArgs('trim', args, 1);
    return toText(args[0]!, 'trim').trim();
  },
  toText: (args) => `${args[0]}, trimmed`,
};

const concat: FunctionPlugin = {
  id: 'concat',
  labelKey: 'functions.concat',
  arity: null,
  returns: 'string',
  evaluate: (args) =>
    args
      .map((value) => (value === null ? '' : typeof value === 'string' ? value : JSON.stringify(value)))
      .join(''),
  toText: (args) => args.join(' followed by '),
};

/* ── numbers ──────────────────────────────────────────────────────────── */

const sum: FunctionPlugin = {
  id: 'sum',
  labelKey: 'functions.sum',
  arity: null,
  returns: 'number',
  evaluate: (args) => numbersOf('sum', args).reduce((total, value) => total + value, 0),
  toText: (args) => `the total of ${args.join(', ')}`,
};

const min: FunctionPlugin = {
  id: 'min',
  labelKey: 'functions.min',
  arity: null,
  returns: 'number',
  evaluate: (args) => {
    const numbers = numbersOf('min', args);
    if (numbers.length === 0) throw new RuleError('invalid_argument', 'min needs a value.', 'min');
    return Math.min(...numbers);
  },
  toText: (args) => `the smallest of ${args.join(', ')}`,
};

const max: FunctionPlugin = {
  id: 'max',
  labelKey: 'functions.max',
  arity: null,
  returns: 'number',
  evaluate: (args) => {
    const numbers = numbersOf('max', args);
    if (numbers.length === 0) throw new RuleError('invalid_argument', 'max needs a value.', 'max');
    return Math.max(...numbers);
  },
  toText: (args) => `the largest of ${args.join(', ')}`,
};

const average: FunctionPlugin = {
  id: 'average',
  labelKey: 'functions.average',
  arity: null,
  returns: 'number',
  evaluate: (args) => {
    const numbers = numbersOf('average', args);
    if (numbers.length === 0) {
      // Not zero: an average of nothing is undefined, and answering zero would
      // make an empty basket look like a free one.
      throw new RuleError('invalid_argument', 'average needs at least one value.', 'average');
    }
    return numbers.reduce((total, value) => total + value, 0) / numbers.length;
  },
  toText: (args) => `the average of ${args.join(', ')}`,
};

const round: FunctionPlugin = {
  id: 'round',
  labelKey: 'functions.round',
  arity: null,
  returns: 'number',
  evaluate: (args) => {
    requireArgs('round', args, 1);
    const value = toNumber(args[0]!, 'round');
    const places = args.length > 1 ? toNumber(args[1]!, 'round') : 0;
    const factor = 10 ** Math.max(0, Math.min(10, Math.trunc(places)));
    return Math.round(value * factor) / factor;
  },
  toText: (args) => `${args[0]}, rounded`,
};

const absolute: FunctionPlugin = {
  id: 'absolute',
  labelKey: 'functions.absolute',
  arity: 1,
  argTypes: ['number'],
  returns: 'number',
  evaluate: (args) => {
    requireArgs('absolute', args, 1);
    return Math.abs(toNumber(args[0]!, 'absolute'));
  },
  toText: (args) => `the size of ${args[0]}`,
};

/* ── lists and values ─────────────────────────────────────────────────── */

const count: FunctionPlugin = {
  id: 'count',
  labelKey: 'functions.count',
  arity: 1,
  argTypes: ['array'],
  returns: 'number',
  evaluate: (args) => {
    requireArgs('count', args, 1);
    return toList(args[0]!, 'count').length;
  },
  toText: (args) => `how many ${args[0]}`,
};

const first: FunctionPlugin = {
  id: 'first',
  labelKey: 'functions.first',
  arity: 1,
  argTypes: ['array'],
  returns: 'any',
  evaluate: (args) => {
    requireArgs('first', args, 1);
    return toList(args[0]!, 'first')[0] ?? null;
  },
  toText: (args) => `the first of ${args[0]}`,
};

const last: FunctionPlugin = {
  id: 'last',
  labelKey: 'functions.last',
  arity: 1,
  argTypes: ['array'],
  returns: 'any',
  evaluate: (args) => {
    requireArgs('last', args, 1);
    const list = toList(args[0]!, 'last');
    return list[list.length - 1] ?? null;
  },
  toText: (args) => `the last of ${args[0]}`,
};

const coalesce: FunctionPlugin = {
  id: 'coalesce',
  labelKey: 'functions.coalesce',
  arity: null,
  returns: 'any',
  // The first value that is actually there. `0` and `false` ARE there, which is
  // the whole reason this exists rather than `||`.
  evaluate: (args) => args.find((value) => value !== null) ?? null,
  toText: (args) => `the first of ${args.join(', ')} that is set`,
};

const toNumberFn: FunctionPlugin = {
  id: 'toNumber',
  labelKey: 'functions.toNumber',
  arity: 1,
  returns: 'number',
  evaluate: (args) => {
    requireArgs('toNumber', args, 1);
    return toNumber(args[0]!, 'toNumber');
  },
  toText: (args) => `${args[0]} as a number`,
};

const toTextFn: FunctionPlugin = {
  id: 'toText',
  labelKey: 'functions.toText',
  arity: 1,
  returns: 'string',
  evaluate: (args) => {
    const value = args[0] ?? null;
    if (typeof value === 'string') return value;
    if (value === null) return '';
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  },
  toText: (args) => `${args[0]} as text`,
};

function numbersOf(id: string, args: JsonValue[]): number[] {
  // One list argument and a spread of numbers mean the same thing: a field
  // holding a list is the common case, and typing them out is the other.
  const values = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
  return values.map((value) => toNumber(value, id));
}

/** Every built-in function. */
export const builtinFunctions: readonly FunctionPlugin[] = [
  now,
  today,
  daysAgo,
  daysFromNow,
  daysBetween,
  yearsSince,
  length,
  lower,
  upper,
  trim,
  concat,
  sum,
  min,
  max,
  average,
  round,
  absolute,
  count,
  first,
  last,
  coalesce,
  toNumberFn,
  toTextFn,
];
