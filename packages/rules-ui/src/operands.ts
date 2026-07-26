import { literal } from '@adysre/rules-core';
import {
  valueTypeOf,
  type FieldDescriptor,
  type FunctionPlugin,
  type Operand,
  type ValueType,
  type VariableDescriptor,
} from '@adysre/rules-types';

/**
 * What the editor needs to know about an operand that the operand does not say.
 *
 * Chiefly its TYPE, which is the answer that decides which operators the picker
 * offers and which control draws the value. An operand knows where it comes
 * from and not what shape arrives, so the answer is a lookup against the field
 * list and the registry.
 */

export type OperandSource = Operand['source'];

export const OPERAND_SOURCES: readonly OperandSource[] = [
  'literal',
  'field',
  'variable',
  'function',
];

/** Everything the type of an operand can depend on. */
export interface OperandLookup {
  field: (path: string) => FieldDescriptor | undefined;
  variable: (name: string) => VariableDescriptor | undefined;
  function: (id: string) => FunctionPlugin | undefined;
}

export function lookupFrom(
  fields: readonly FieldDescriptor[],
  variables: readonly VariableDescriptor[],
  functions: ReadonlyMap<string, FunctionPlugin>,
): OperandLookup {
  const byPath = new Map(fields.map((descriptor) => [descriptor.path, descriptor]));
  const byName = new Map(variables.map((descriptor) => [descriptor.name, descriptor]));

  return {
    field: (path) => byPath.get(path),
    variable: (name) => byName.get(name),
    function: (id) => functions.get(id),
  };
}

/**
 * The type an operand produces.
 *
 * `any` whenever nobody has said - an unknown field, an unregistered function,
 * a literal nobody has filled in yet. That is the honest answer AND the useful
 * one: the picker's job is to narrow the operator list when it knows something,
 * and a builder that offered nothing because it had not been told the schema
 * would be a builder that cannot start a rule.
 *
 * A `null` literal is `any` for the same reason. Every new condition starts with
 * one, and reading it as the `null` TYPE would leave a fresh row offering only
 * the handful of operators that declare no accepted types.
 */
export function typeOfOperand(operand: Operand, lookup: OperandLookup): ValueType {
  switch (operand.source) {
    case 'literal':
      return operand.value === null ? 'any' : valueTypeOf(operand.value);
    case 'field':
      return lookup.field(operand.path)?.type ?? 'any';
    case 'variable':
      return lookup.variable(operand.name)?.type ?? 'any';
    case 'function':
      return lookup.function(operand.name)?.returns ?? 'any';
  }
}

/**
 * The same operand, read from somewhere else.
 *
 * Nothing carries across, and that is the point. A path is not a variable name
 * and a variable name is not a value, so "keeping what was there" would mean
 * putting `order.total` into a box that means something else entirely. Starting
 * empty is a slot the author obviously has to fill; a plausible wrong value is
 * one they might not notice.
 *
 * Switching to the source it already has returns the SAME operand, so a select
 * that fires on every render cannot enter a change into the undo history.
 */
export function switchSource(operand: Operand, source: OperandSource): Operand {
  if (operand.source === source) return operand;

  switch (source) {
    case 'literal':
      return literal(null);
    case 'field':
      return { source: 'field', path: '' };
    case 'variable':
      return { source: 'variable', name: '' };
    case 'function':
      return { source: 'function', name: '', args: [] };
  }
}

/** How many argument slots a function operand draws. */
export function functionSlots(
  plugin: FunctionPlugin | undefined,
  args: readonly Operand[],
): number {
  // An unregistered function shows exactly what it stored: the row is broken,
  // and hiding the arguments would lose them the moment anything else is edited.
  if (plugin === undefined) return args.length;
  // Variadic keeps at least one slot, so there is something to type into before
  // the "add value" button has been pressed for the first time.
  if (plugin.arity === null) return Math.max(args.length, 1);
  return plugin.arity;
}

/** Replace one argument of a function operand. Anything else is returned as it was. */
export function setFunctionArg(operand: Operand, index: number, arg: Operand): Operand {
  if (operand.source !== 'function' || index < 0) return operand;

  const args = [...operand.args];
  while (args.length <= index) args.push(literal(null));
  args[index] = arg;

  return { ...operand, args };
}

export function resizeFunctionArgs(operand: Operand, count: number): Operand {
  if (operand.source !== 'function') return operand;

  const wanted = Math.max(0, count);
  if (operand.args.length === wanted) return operand;

  const args = operand.args.slice(0, wanted);
  while (args.length < wanted) args.push(literal(null));

  return { ...operand, args };
}

export function removeFunctionArg(operand: Operand, index: number): Operand {
  if (operand.source !== 'function') return operand;
  if (index < 0 || index >= operand.args.length) return operand;

  return { ...operand, args: operand.args.filter((_, position) => position !== index) };
}
