import type { Operand, OperatorPlugin, ValueType } from '@adysre/rules-types';

/**
 * Which operators fit, and how many values they want.
 *
 * Both answers come from the plugin - `accepts` and `arity` - which is why the
 * builder does not hold a table of what `between` needs. A host that registers
 * `withinBusinessHours` gets it in the right pickers with the right number of
 * boxes, without this package hearing about it.
 */

/**
 * The operators worth offering for a left-hand side of this type.
 *
 * An operator with no `accepts` applies to anything, and a left-hand side of
 * type `any` accepts anything. Both fall open rather than closed: the cost of
 * offering an operator that turns out not to fit is a diagnostic on one row,
 * and the cost of hiding the one somebody needed is a builder that cannot
 * express their rule at all.
 */
export function operatorsFor(
  operators: Iterable<OperatorPlugin>,
  type: ValueType | undefined,
): OperatorPlugin[] {
  const all = [...operators];
  if (type === undefined || type === 'any') return all;

  return all.filter((operator) => {
    const accepts = operator.accepts;
    return accepts === undefined || accepts.includes(type) || accepts.includes('any');
  });
}

export function isVariadic(operator: OperatorPlugin | undefined): boolean {
  return operator?.arity === null;
}

/**
 * How many value boxes a condition draws.
 *
 * An UNKNOWN operator draws what the condition stored, rather than nothing. The
 * row is already reporting that this deployment has no such operator; throwing
 * away the values on top of that would turn a rule that can be fixed by
 * registering a plugin into one that has to be rewritten.
 */
export function argSlots(operator: OperatorPlugin | undefined, args: readonly Operand[]): number {
  if (operator === undefined) return args.length;
  if (operator.arity === null) return Math.max(args.length, 1);
  return operator.arity;
}

/**
 * Whether a condition can take another value.
 *
 * Only variadic operators can: `between` takes two and an "add value" button
 * beside it would offer an edit the reducer is right to refuse.
 */
export function canAddValue(operator: OperatorPlugin | undefined): boolean {
  return isVariadic(operator);
}
