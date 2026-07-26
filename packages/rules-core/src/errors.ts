/**
 * How a plugin says "I cannot answer that".
 *
 * An operator returns a boolean, which leaves nowhere to put "you gave me a
 * string and a number". The two obvious answers are both wrong: returning
 * `false` makes a broken comparison look like a failed one, so a rule silently
 * does not fire and nobody can see why; and throwing a plain `Error` makes a
 * type mismatch in one condition indistinguishable from a genuine bug in the
 * plugin.
 *
 * So a plugin throws one of these, and the executor turns it into an `errored`
 * verdict with a diagnostic pointing at the node. The rule stops, the reason is
 * recorded, and the trace shows exactly which condition could not be evaluated.
 *
 * Anything else a plugin throws is a bug in the plugin, and the executor
 * reports it as such rather than pretending it was a rule problem.
 */

export type RuleErrorCode =
  | 'type_mismatch'
  | 'arity_mismatch'
  | 'not_comparable'
  | 'invalid_argument'
  | 'unknown_plugin'
  | 'limit_exceeded';

export class RuleError extends Error {
  readonly code: RuleErrorCode;
  /** The plugin that could not answer, for the diagnostic. */
  readonly pluginId: string | undefined;

  constructor(code: RuleErrorCode, message: string, pluginId?: string) {
    super(message);
    this.name = 'RuleError';
    this.code = code;
    this.pluginId = pluginId;
  }
}

/** Describe a value in a message without dumping the whole object into it. */
export function describeValue(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `an array of ${value.length}`;
  const type = typeof value;
  if (type === 'string') {
    const text = value as string;
    return text.length > 20 ? `the text "${text.slice(0, 20)}…"` : `the text "${text}"`;
  }
  if (type === 'number' || type === 'boolean') return String(value);
  return 'an object';
}

export function typeMismatch(pluginId: string, expected: string, got: unknown): RuleError {
  return new RuleError(
    'type_mismatch',
    `${pluginId} expects ${expected}, and got ${describeValue(got)}.`,
    pluginId,
  );
}

export function arityMismatch(pluginId: string, expected: number | null, got: number): RuleError {
  const wanted = expected === null ? 'at least one argument' : `${expected} argument(s)`;
  return new RuleError('arity_mismatch', `${pluginId} expects ${wanted}, and got ${got}.`, pluginId);
}
