import assert from 'node:assert/strict';
import { describe, it } from 'vitest';

import {
  action as buildAction,
  builtinFunctions,
  builtinOperators,
  field,
  fn,
  literal,
  rule,
  sequentialIds,
  variable,
} from '@adysre/rules-core';
import type {
  ActionPlugin,
  FieldDescriptor,
  FunctionPlugin,
  OperatorPlugin,
} from '@adysre/rules-types';

// Imported from the modules rather than from the barrel, deliberately: the
// barrel pulls in the components, and a test that has to load React to check
// what an empty box means is a test that has stopped being about the answer.
import { actionsFor, showsTarget, showsValue } from './actions.ts';
import { englishLabels, labelFor, labelsWith } from './labels.ts';
import {
  functionSlots,
  lookupFrom,
  removeFunctionArg,
  resizeFunctionArgs,
  setFunctionArg,
  switchSource,
  typeOfOperand,
} from './operands.ts';
import { argSlots, canAddValue, isVariadic, operatorsFor } from './operators.ts';
import { isDifferentDocument } from './sync.ts';
import {
  emptyValueFor,
  formatLiteral,
  inputKindFor,
  parseList,
  parseLiteral,
  parseScalar,
} from './values.ts';

/**
 * The builder's decisions, tested without a builder.
 *
 * Same discipline as `@adysre/rules-react`: what the components do is draw, and
 * everything that had to be DECIDED - which operators fit a field, how many
 * boxes an operator wants, what an empty box means - lives in a pure module
 * that a test can call directly. A rule builder whose behaviour can only be
 * reached through a renderer is a rule builder that mostly is not tested.
 */

function operator(id: string): OperatorPlugin {
  const found = builtinOperators.find((plugin) => plugin.id === id);
  assert.ok(found, `no built-in operator "${id}"`);
  return found;
}

function fnPlugin(id: string): FunctionPlugin {
  const found = builtinFunctions.find((plugin) => plugin.id === id);
  assert.ok(found, `no built-in function "${id}"`);
  return found;
}

const FIELDS: FieldDescriptor[] = [
  { path: 'order.total', label: 'Order total', type: 'number' },
  { path: 'customer.tier', label: 'Tier', type: 'string' },
];

const lookup = lookupFrom(
  FIELDS,
  [{ name: 'today', label: 'Today', type: 'date' }],
  new Map(builtinFunctions.map((plugin) => [plugin.id, plugin])),
);

describe('labels', () => {
  it('uses the label for a plugin key', () => {
    assert.equal(labelFor(operator('greaterThan'), englishLabels), 'is greater than');
  });

  it('falls back to the id as words, never to nothing', () => {
    const custom: OperatorPlugin = {
      id: 'withinBusinessHours',
      labelKey: 'operators.withinBusinessHours',
      arity: 0,
      evaluate: () => true,
    };

    assert.equal(labelFor(custom, englishLabels), 'within business hours');
    assert.equal(labelFor({ id: 'noKeyAtAll' }, englishLabels), 'no key at all');
  });

  it('merges plugin labels rather than replacing the set', () => {
    const labels = labelsWith({
      save: 'Store',
      plugins: { 'operators.withinBusinessHours': 'is within business hours' },
    });

    assert.equal(labels.save, 'Store');
    assert.equal(labels.plugins['operators.withinBusinessHours'], 'is within business hours');
    // The twenty-seven that shipped are still there.
    assert.equal(labels.plugins['operators.equals'], 'is');
  });

  it('has a word for every combinator, kind, status, source and verdict', () => {
    assert.equal(Object.keys(englishLabels.combinators).length, 3);
    assert.equal(Object.keys(englishLabels.kinds).length, 7);
    assert.equal(Object.keys(englishLabels.statuses).length, 3);
    assert.equal(Object.keys(englishLabels.sources).length, 4);
    assert.equal(Object.keys(englishLabels.verdicts).length, 4);
  });

  it('labels every built-in plugin', () => {
    for (const plugin of [...builtinOperators, ...builtinFunctions]) {
      const key = plugin.labelKey;
      assert.ok(key !== undefined, `${plugin.id} has no labelKey`);
      assert.ok(englishLabels.plugins[key] !== undefined, `${key} has no English label`);
    }
  });
});

describe('values', () => {
  it('reads an empty box as null, whatever the type', () => {
    assert.equal(parseLiteral('', 'string'), null);
    assert.equal(parseLiteral('   ', 'number'), null);
    assert.equal(parseLiteral('', 'date'), null);
    assert.equal(parseLiteral('', 'array'), null);
  });

  it('reads a number, and refuses to invent one', () => {
    assert.equal(parseLiteral('1000', 'number'), 1000);
    assert.equal(parseLiteral('-2.5', 'number'), -2.5);
    // Half-typed and unparseable both come back as "nothing chosen" rather than
    // as NaN, which is not JSON and could not be stored.
    assert.equal(parseLiteral('1.', 'number'), 1);
    assert.equal(parseLiteral('abc', 'number'), null);
  });

  it('keeps a date as the ISO string the input produced', () => {
    assert.equal(parseLiteral('2026-07-26', 'date'), '2026-07-26');
  });

  it('reads a list as comma separated, typed by what each entry looks like', () => {
    assert.deepEqual(parseLiteral('gold, silver', 'array'), ['gold', 'silver']);
    assert.deepEqual(parseList('1, 2, three, true'), [1, 2, 'three', true]);
    assert.deepEqual(parseList(' , ,'), []);
  });

  it('keeps invalid JSON as text instead of throwing it away', () => {
    assert.deepEqual(parseLiteral('{"a":1}', 'object'), { a: 1 });
    assert.equal(parseLiteral('{not json', 'object'), '{not json');
  });

  it('round trips through the box', () => {
    assert.equal(formatLiteral(1000), '1000');
    assert.equal(formatLiteral(null), '');
    assert.equal(formatLiteral(true), 'true');
    assert.equal(formatLiteral(['gold', 'silver']), 'gold, silver');
    assert.deepEqual(parseLiteral(formatLiteral(['gold', 'silver']), 'array'), ['gold', 'silver']);
    assert.equal(parseLiteral(formatLiteral(1000), 'number'), 1000);
  });

  it('does not treat 0 or false as an empty box', () => {
    assert.equal(formatLiteral(0), '0');
    assert.equal(parseLiteral('0', 'number'), 0);
    assert.equal(formatLiteral(false), 'false');
    assert.equal(parseLiteral('false', 'boolean'), false);
  });

  it('guesses a scalar only inside a list', () => {
    assert.equal(parseScalar('3'), 3);
    assert.equal(parseScalar('true'), true);
    assert.equal(parseScalar('null'), null);
    assert.equal(parseScalar('gold'), 'gold');
    // A typed box never guesses: a string field holding "3" stays text.
    assert.equal(parseLiteral('3', 'string'), '3');
  });

  it('picks a control per type', () => {
    assert.equal(inputKindFor('number'), 'number');
    assert.equal(inputKindFor('boolean'), 'checkbox');
    assert.equal(inputKindFor('date'), 'date');
    assert.equal(inputKindFor('array'), 'list');
    assert.equal(inputKindFor('object'), 'json');
    assert.equal(inputKindFor('any'), 'text');
    assert.equal(emptyValueFor('boolean'), false);
    assert.deepEqual(emptyValueFor('array'), []);
    assert.equal(emptyValueFor('string'), null);
  });
});

describe('operators offered', () => {
  it('narrows to the operators that accept the type', () => {
    const ids = operatorsFor(builtinOperators, 'string').map((plugin) => plugin.id);

    assert.ok(ids.includes('contains'));
    assert.ok(ids.includes('equals'), 'an operator with no `accepts` fits anything');
    assert.ok(!ids.includes('between'), 'between takes numbers and dates');
    assert.ok(!ids.includes('hasAllOf'), 'that one is for lists');
  });

  it('offers everything when nobody has said what the type is', () => {
    assert.equal(operatorsFor(builtinOperators, 'any').length, builtinOperators.length);
    assert.equal(operatorsFor(builtinOperators, undefined).length, builtinOperators.length);
  });

  it('draws one box per argument the operator wants', () => {
    assert.equal(argSlots(operator('isEmpty'), []), 0);
    assert.equal(argSlots(operator('equals'), [literal(1)]), 1);
    assert.equal(argSlots(operator('between'), [literal(1)]), 2);
  });

  it('gives a variadic operator a box to start with, and room to grow', () => {
    assert.ok(isVariadic(operator('isOneOf')));
    assert.ok(canAddValue(operator('isOneOf')));
    assert.ok(!canAddValue(operator('between')));
    assert.equal(argSlots(operator('isOneOf'), []), 1);
    assert.equal(argSlots(operator('isOneOf'), [literal('a'), literal('b')]), 2);
  });

  it('shows what an unknown operator stored rather than dropping it', () => {
    assert.equal(argSlots(undefined, [literal('a'), literal('b')]), 2);
  });
});

describe('operands', () => {
  it('types an operand by what it reads', () => {
    assert.equal(typeOfOperand(field('order.total'), lookup), 'number');
    assert.equal(typeOfOperand(field('customer.tier'), lookup), 'string');
    assert.equal(typeOfOperand(variable('today'), lookup), 'date');
    assert.equal(typeOfOperand(fn('length', field('customer.tier')), lookup), 'number');
    assert.equal(typeOfOperand(literal(1000), lookup), 'number');
    assert.equal(typeOfOperand(literal('gold'), lookup), 'string');
  });

  it('says `any` rather than guessing', () => {
    // A fresh condition starts here, and reading it as the `null` type would
    // leave the picker offering almost nothing.
    assert.equal(typeOfOperand(literal(null), lookup), 'any');
    assert.equal(typeOfOperand(field('nothing.known'), lookup), 'any');
    assert.equal(typeOfOperand(variable('unheard'), lookup), 'any');
    assert.equal(typeOfOperand(fn('unregistered'), lookup), 'any');
  });

  it('starts empty when the source changes, and does nothing when it does not', () => {
    const path = field('order.total');

    assert.equal(switchSource(path, 'field'), path, 'same source returns the same operand');
    assert.deepEqual(switchSource(path, 'literal'), literal(null));
    assert.deepEqual(switchSource(path, 'variable'), { source: 'variable', name: '' });
    assert.deepEqual(switchSource(path, 'function'), { source: 'function', name: '', args: [] });
  });

  it('draws a function its declared number of arguments', () => {
    assert.equal(functionSlots(fnPlugin('lower'), []), 1);
    assert.equal(functionSlots(fnPlugin('daysBetween'), []), 2);
    // Variadic, so at least one and as many as were stored.
    assert.equal(functionSlots(fnPlugin('concat'), []), 1);
    assert.equal(functionSlots(fnPlugin('concat'), [literal('a'), literal('b')]), 2);
    assert.equal(functionSlots(undefined, [literal('a')]), 1);
  });

  it('edits a function argument without touching anything else', () => {
    const operand = fn('concat', literal('a'), literal('b'));

    assert.deepEqual(
      setFunctionArg(operand, 1, literal('z')),
      fn('concat', literal('a'), literal('z')),
    );
    // Past the end pads rather than dropping the edit.
    assert.deepEqual(
      setFunctionArg(fn('concat'), 1, literal('z')),
      fn('concat', literal(null), literal('z')),
    );
    assert.deepEqual(removeFunctionArg(operand, 0), fn('concat', literal('b')));
    assert.deepEqual(resizeFunctionArgs(operand, 1), fn('concat', literal('a')));
    assert.deepEqual(
      resizeFunctionArgs(operand, 3),
      fn('concat', literal('a'), literal('b'), literal(null)),
    );
    assert.equal(resizeFunctionArgs(operand, 2), operand, 'no change returns the same operand');
  });

  it('leaves an operand that is not a function alone', () => {
    const notAFunction = literal(1);

    assert.equal(setFunctionArg(notAFunction, 0, literal(2)), notAFunction);
    assert.equal(resizeFunctionArgs(notAFunction, 3), notAFunction);
    assert.equal(removeFunctionArg(notAFunction, 0), notAFunction);
  });
});

describe('actions offered', () => {
  const reject: ActionPlugin = { id: 'reject', kinds: ['validation'], requiresTarget: true };
  const setField: ActionPlugin = { id: 'setField', requiresTarget: true, requiresValue: true };
  const ids = sequentialIds();

  it('offers the actions that suit the rule kind, and the ones that suit any', () => {
    assert.deepEqual(
      actionsFor([reject, setField], 'validation').map((plugin) => plugin.id),
      ['reject', 'setField'],
    );
    // `reject` declared itself for validation only; `setField` declared nothing
    // and therefore fits everything.
    assert.deepEqual(
      actionsFor([reject, setField], 'workflow').map((plugin) => plugin.id),
      ['setField'],
    );
    assert.equal(actionsFor([reject, setField], undefined).length, 2);
  });

  it('draws the boxes the plugin declares', () => {
    const node = buildAction({ type: 'reject' }, { ids });

    assert.equal(showsTarget(reject, node), true);
    assert.equal(showsValue(reject, node), false);
    assert.equal(showsValue(setField, node), true);
  });

  it('keeps a box for a value an imported action already carries', () => {
    const node = buildAction({ type: 'reject', value: literal('too large') }, { ids });

    // The plugin does not ask for a value, but this action HAS one, and hiding
    // it is how an import quietly loses half of what it converted.
    assert.equal(showsValue(reject, node), true);
  });

  it('offers both boxes for an action no plugin describes', () => {
    const node = buildAction({ type: 'somethingCustom' }, { ids });

    assert.equal(showsTarget(undefined, node), true);
    assert.equal(showsValue(undefined, node), true);
  });
});

describe('loading a different document', () => {
  const first = rule({ name: 'First', kind: 'validation' }, { ids: sequentialIds() });
  const second = rule({ name: 'Second', kind: 'validation' }, { ids: sequentialIds() });
  const edited = { ...first, name: 'First, renamed' };

  it('does nothing when the prop has not changed', () => {
    assert.equal(isDifferentDocument(first, first, first), false);
  });

  it('does nothing when the host echoes back what the store just emitted', () => {
    // The commonest wiring there is: `rule={rule} onChange={setRule}`. Every
    // keystroke produces a new document, so identity alone would say "load
    // this" - and `load` clears the history, so undo would silently die.
    assert.equal(isDifferentDocument(edited, first, edited), false);
  });

  it('loads a document the author has not seen in this session', () => {
    assert.equal(isDifferentDocument(second, first, first), true);
  });
});
