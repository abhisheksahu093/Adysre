/**
 * JSON, as the engine understands it.
 *
 * Every value that crosses the engine - a literal in a rule, a field read from
 * the subject, the result of a function - is JSON. That is not a limitation
 * imposed by the file format; it is what makes a rule SERIALISABLE, and a rule
 * that cannot be serialised cannot be stored, versioned, diffed, shipped
 * between services or replayed in a debugger.
 *
 * A `Date` is therefore an ISO string and not a `Date`, and a class instance is
 * whatever it looks like after `JSON.stringify`. Operators that care about
 * dates parse the string; nothing in the AST holds a live object.
 */

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export type JsonObject = { [key: string]: JsonValue };

/**
 * The shapes a field or a function can declare.
 *
 * `date` is a string that parses as a date, and `any` means the engine will not
 * check: both exist so an operator can say what it accepts and a builder can
 * offer only the operators that fit the field the user picked.
 */
export const VALUE_TYPES = [
  'string',
  'number',
  'boolean',
  'date',
  'array',
  'object',
  'null',
  'any',
] as const;

export type ValueType = (typeof VALUE_TYPES)[number];

/** The runtime type of a value, in the engine's vocabulary. */
export function valueTypeOf(value: JsonValue): ValueType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  const type = typeof value;
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  return 'object';
}

/**
 * Whether a value satisfies a declared type.
 *
 * `date` accepts a string that parses, because that is the only honest way to
 * carry a date through JSON, and `any` accepts everything by definition.
 */
export function matchesType(value: JsonValue, expected: ValueType): boolean {
  if (expected === 'any') return true;
  if (expected === 'date') {
    return typeof value === 'string' && !Number.isNaN(Date.parse(value));
  }
  return valueTypeOf(value) === expected;
}
