import type { JsonValue } from '@adysre/rules-types';
import { RuleError } from '../errors';

/**
 * Comparison semantics, defined once.
 *
 * Every operator that orders or equates values comes through here, because the
 * alternative is fourteen operators each making their own small decision about
 * what `"10" > "9"` means, and a rules engine whose answers depend on which
 * operator you happened to pick is not one anybody can reason about.
 *
 * The rules, stated so a user could be shown them:
 *
 * - Numbers compare numerically, strings lexicographically, booleans as
 *   `false < true`.
 * - An ISO-8601 date string compares as a DATE, not as text, but only when it
 *   looks like one. `"10"` is text; `"2026-07-26"` is a date. Guessing more
 *   eagerly than that is how `"12"` sorts before `"9"` in one place and after
 *   it in another.
 * - Values of different kinds are NOT comparable. `5 > "apple"` is a mistake in
 *   the rule, not a `false`, so it raises rather than answering.
 * - Equality is deep and JSON-shaped: two arrays are equal when their contents
 *   are, and key order in an object never matters.
 */

/** Looks like a date rather than merely parsing as one. */
const ISO_DATE = /^\d{4}-\d{2}-\d{2}([T\s]\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;

export function isDateString(value: JsonValue): value is string {
  return typeof value === 'string' && ISO_DATE.test(value) && !Number.isNaN(Date.parse(value));
}

/** The kind a value compares AS, which is not always its JSON type. */
type Comparable = 'number' | 'string' | 'boolean' | 'date';

function comparableKind(value: JsonValue): Comparable | null {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  if (isDateString(value)) return 'date';
  if (typeof value === 'string') return 'string';
  return null;
}

/**
 * Order two values.
 *
 * @returns negative, zero or positive, as a comparator does.
 * @throws {RuleError} when the two are not comparable, which is a fact about
 * the rule rather than about the data.
 */
export function compareValues(left: JsonValue, right: JsonValue, pluginId: string): number {
  const leftKind = comparableKind(left);
  const rightKind = comparableKind(right);

  if (leftKind === null || rightKind === null) {
    throw new RuleError(
      'not_comparable',
      `${pluginId} cannot order ${describeKind(left)} against ${describeKind(right)}.`,
      pluginId,
    );
  }

  // A date and a plain string are not the same kind of thing, and neither is a
  // number and a numeric string: comparing them would mean inventing a coercion
  // the author never asked for.
  if (leftKind !== rightKind) {
    throw new RuleError(
      'not_comparable',
      `${pluginId} cannot order ${leftKind} against ${rightKind}.`,
      pluginId,
    );
  }

  switch (leftKind) {
    case 'number':
      return (left as number) - (right as number);
    case 'boolean':
      return Number(left as boolean) - Number(right as boolean);
    case 'date':
      return Date.parse(left as string) - Date.parse(right as string);
    default: {
      const a = left as string;
      const b = right as string;
      return a < b ? -1 : a > b ? 1 : 0;
    }
  }
}

function describeKind(value: JsonValue): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'a list';
  if (typeof value === 'object') return 'an object';
  return comparableKind(value) ?? typeof value;
}

/**
 * Deep JSON equality.
 *
 * Key order never matters, because JSON has no order and two rules that differ
 * only by the order someone typed an object's keys must not disagree.
 */
export function valuesEqual(left: JsonValue, right: JsonValue): boolean {
  if (left === right) return true;
  if (left === null || right === null) return false;

  if (Array.isArray(left) || Array.isArray(right)) {
    if (!Array.isArray(left) || !Array.isArray(right)) return false;
    if (left.length !== right.length) return false;
    return left.every((entry, index) => valuesEqual(entry, right[index]!));
  }

  if (typeof left === 'object' && typeof right === 'object') {
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;
    return leftKeys.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(right, key) &&
        valuesEqual(left[key]!, (right as Record<string, JsonValue>)[key]!),
    );
  }

  return false;
}

/**
 * Emptiness, for the one operator everybody reaches for first.
 *
 * `null`, `""`, `[]` and `{}` are empty. `0` and `false` are NOT: they are
 * values someone chose, and treating them as absent is the classic bug that
 * makes a rule ignore a legitimate zero.
 */
export function isEmptyValue(value: JsonValue): boolean {
  if (value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/** Coerce to a number, or raise. Used by the arithmetic functions. */
export function toNumber(value: JsonValue, pluginId: string): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  throw new RuleError('type_mismatch', `${pluginId} expects a number.`, pluginId);
}

/** Require a string, or raise. */
export function toText(value: JsonValue, pluginId: string): string {
  if (typeof value === 'string') return value;
  throw new RuleError('type_mismatch', `${pluginId} expects text.`, pluginId);
}

/** Require a list, or raise. */
export function toList(value: JsonValue, pluginId: string): JsonValue[] {
  if (Array.isArray(value)) return value;
  throw new RuleError('type_mismatch', `${pluginId} expects a list.`, pluginId);
}
