import type { JsonValue } from '@adysre/rules-types';
import { isDateString } from '@adysre/rules-core';
import type { Phrases } from './phrases.ts';

/**
 * Values, as a person would write them.
 *
 * `isDateString` comes from the core rather than from a second regular
 * expression here, and that is not laziness. The executor decides that
 * `"2026-07-26"` compares as a date; if the renderer disagreed, a rule would
 * SAY it compares text and DO something else, which is the exact failure the
 * "generate language from the AST, never parse it back" rule exists to prevent.
 * Shared semantics need a shared implementation.
 */

export interface FormatOptions {
  locale: string | undefined;
  phrases: Phrases;
}

/** A date-only ISO string: no time part, so it is rendered without one. */
const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function formatValue(value: JsonValue, options: FormatOptions): string {
  const { locale, phrases } = options;

  if (value === null) return phrases.nothing;
  if (typeof value === 'boolean') return value ? phrases.yes : phrases.no;
  if (typeof value === 'number') return formatNumber(value, locale);

  if (typeof value === 'string') {
    return isDateString(value) ? formatDate(value, locale) : `"${value}"`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return phrases.emptyList;
    return joinList(
      value.map((entry) => formatValue(entry, options)),
      phrases,
    );
  }

  // An object has no sentence form worth inventing. JSON is at least exact.
  return JSON.stringify(value);
}

function formatNumber(value: number, locale: string | undefined): string {
  if (!Number.isFinite(value)) return String(value);
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    // An unusable locale tag is the host's problem to fix, not a reason to
    // refuse to describe the rule.
    return String(value);
  }
}

function formatDate(value: string, locale: string | undefined): string {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return `"${value}"`;

  const dateOnly = DATE_ONLY.test(value);
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      ...(dateOnly ? {} : { timeStyle: 'short' }),
      // Always UTC. `"2026-07-26"` parses as midnight UTC, and formatting it in
      // the reader's zone shows the 25th to half the world - a rule that reads
      // differently depending on who opened it.
      timeZone: 'UTC',
    }).format(new Date(parsed));
  } catch {
    return value;
  }
}

/** `a, b or c`. The separator and the final conjunction are both phrases. */
export function joinList(parts: readonly string[], phrases: Phrases): string {
  if (parts.length === 0) return phrases.emptyList;
  if (parts.length === 1) return parts[0] ?? '';
  return parts.slice(0, -1).join(phrases.listSeparator) + phrases.listLast + parts[parts.length - 1];
}

/**
 * A field path, as words.
 *
 * The WHOLE path, not the last segment: `order.total` and `refund.total` are
 * different fields, and a renderer that called them both "total" would produce
 * a sentence that is wrong rather than merely long. A host with real labels
 * passes them in `fields`, which is what `FieldDescriptor.label` is for.
 */
export function humanisePath(path: string): string {
  return path
    .split('.')
    .flatMap((segment) => {
      const index = /^(.*?)\[(\d+)\]$/.exec(segment);
      // Indexes are shown counting from one, because the reader does.
      if (index !== null) return [humaniseWord(index[1] ?? ''), `#${Number(index[2]) + 1}`];
      return [humaniseWord(segment)];
    })
    .filter((word) => word !== '')
    .join(' ');
}

/** `placedAt` to `placed at`, `total_amount` to `total amount`. */
export function humaniseWord(word: string): string {
  return word
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .toLowerCase();
}

/** An action type or a plugin id, as words. `setField` to `set field`. */
export function humaniseId(id: string): string {
  return humaniseWord(id);
}
