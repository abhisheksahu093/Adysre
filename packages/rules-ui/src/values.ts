import type { JsonValue, ValueType } from '@adysre/rules-types';

/**
 * Text in a box, to a value in the AST, and back.
 *
 * A form holds strings and the AST holds JSON, so something has to translate,
 * and that something is here rather than in a component: it is the part with
 * edge cases (what an empty box means, what a list is, what an unparseable
 * number is), and edge cases that live in a component are edge cases nobody
 * tests.
 */

/** Which control draws a value of this type. */
export type InputKind = 'text' | 'number' | 'checkbox' | 'date' | 'list' | 'json';

export function inputKindFor(type: ValueType): InputKind {
  switch (type) {
    case 'number':
      return 'number';
    case 'boolean':
      return 'checkbox';
    case 'date':
      return 'date';
    case 'array':
      return 'list';
    case 'object':
      return 'json';
    default:
      return 'text';
  }
}

/**
 * The value in a box.
 *
 * Lists are comma separated rather than JSON, because `isOneOf` is the operator
 * people reach for most and typing `["gold","silver"]` to say "gold or silver"
 * is a tax on the common case. Objects stay JSON: there is no shorter honest
 * form, and they are rare enough that admitting it is better than inventing a
 * syntax.
 */
export function formatLiteral(value: JsonValue): string {
  if (value === null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map((entry) => formatLiteral(entry)).join(', ');
  return JSON.stringify(value);
}

/**
 * What the author typed, as a value.
 *
 * An EMPTY box is `null` for every type, not `""` and not `0`. A box nobody has
 * filled in is a value nobody has chosen, and `null` is what the rest of the
 * engine already means by that: `validateRule` can see the condition is
 * incomplete, and the preview says so. Storing `""` instead would make an
 * untouched row look like a deliberate comparison against the empty string,
 * which is a rule that runs and quietly does the wrong thing.
 *
 * Someone who genuinely means "has no value" has `isEmpty` for it, which is
 * clearer in the sentence than an empty box ever is.
 */
export function parseLiteral(text: string, type: ValueType): JsonValue {
  const trimmed = text.trim();
  if (trimmed === '') return null;

  switch (type) {
    case 'number': {
      const parsed = Number(trimmed);
      // Not a number is `null` rather than `NaN`: NaN is not JSON, so it could
      // not be stored, and half-typed input ("1.", "-") passes through here on
      // its way to something valid.
      return Number.isFinite(parsed) ? parsed : null;
    }
    case 'boolean':
      return trimmed === 'true';
    case 'array':
      return parseList(text);
    case 'object':
      return parseJson(trimmed);
    // `date` stays the string the date input produced, which is already the
    // ISO-8601 form the engine's comparison recognises as a date.
    default:
      return text;
  }
}

/** `gold, silver, 3` becomes `["gold", "silver", 3]`. */
export function parseList(text: string): JsonValue[] {
  return text
    .split(',')
    .map((entry) => entry.trim())
    .filter((entry) => entry !== '')
    .map(parseScalar);
}

/**
 * A list entry, typed by what it looks like.
 *
 * Guessed here and nowhere else, deliberately. A list has no declared element
 * type to consult, so `3` in a list of numbers has to become a number or
 * `isOneOf` would never match; a typed box, by contrast, already knows what it
 * holds and never has to guess.
 */
export function parseScalar(text: string): JsonValue {
  if (text === 'true') return true;
  if (text === 'false') return false;
  if (text === 'null') return null;
  if (text !== '' && Number.isFinite(Number(text))) return Number(text);
  return text;
}

/** Invalid JSON is kept as the text somebody typed, never thrown away. */
export function parseJson(text: string): JsonValue {
  try {
    return JSON.parse(text) as JsonValue;
  } catch {
    return text;
  }
}

/** What a value of this type starts as, when a slot appears with nothing in it. */
export function emptyValueFor(type: ValueType): JsonValue {
  return type === 'boolean' ? false : type === 'array' ? [] : null;
}
