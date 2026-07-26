import type { JsonValue } from '@adysre/rules-types';

/**
 * A value, as a debugger should show it.
 *
 * NOT the natural-language renderer's `formatValue`, and the difference is the
 * point. That one turns `"gold"` into `gold` and `1000` into `1,000` because it
 * is writing a sentence for somebody checking the rule reads correctly. A
 * debugger is answering the opposite question - what did the operator literally
 * receive - and a thousand separator in that answer is a debugger inventing a
 * character that was never in the data.
 *
 * So: JSON, quotes and all, with a length cap. The cap is not cosmetic. A field
 * can hold an array of ten thousand entries, and a row that renders all of them
 * is a debugger that hangs on exactly the rule somebody most needs to inspect.
 */

const MAX_LENGTH = 200;

export function previewValue(value: JsonValue | undefined, max = MAX_LENGTH): string {
  if (value === undefined) return '';

  const text = JSON.stringify(value) ?? 'null';
  // The ellipsis is a character, so the result never exceeds the cap it was
  // given - a truncation that overruns its own limit is not a limit.
  return text.length <= max ? text : `${text.slice(0, Math.max(0, max - 1))}…`;
}

/** `left` and every argument, as one line: what the operator was handed. */
export function previewOperands(
  left: JsonValue | undefined,
  args: readonly JsonValue[] | undefined,
): string {
  const parts = [previewValue(left), ...(args ?? []).map((arg) => previewValue(arg))];
  return parts.filter((part) => part !== '').join(', ');
}

/**
 * A duration, at the resolution a rule actually takes.
 *
 * Most nodes are well under a millisecond, and `0ms` on every row tells a
 * reader nothing about which one was slow. Sub-millisecond timings keep a
 * decimal; anything longer does not, because at that point the fraction is
 * noise and the number is the story.
 */
export function previewDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) return '';
  if (ms < 1) return `${ms.toFixed(2)}ms`;
  return `${Math.round(ms)}ms`;
}
