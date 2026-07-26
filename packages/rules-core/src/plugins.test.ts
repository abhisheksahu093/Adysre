import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { EvaluationContext, JsonValue, OperatorPlugin } from '@adysre/rules-types';
import {
  RuleError,
  builtinFunctions,
  builtinOperators,
  builtinPlugins,
  compareValues,
  createRegistry,
  isEmptyValue,
  missingPlugins,
  valuesEqual,
} from './index';

/**
 * Registry and built-in tests.
 *
 * The comparison semantics get the most attention, because they are the part
 * everyone assumes and nobody reads: whether `0` counts as empty, whether
 * `"10" > "9"`, whether a date string sorts as a date. Every one of those is a
 * decision that has to hold identically across twenty-seven operators, and a
 * rules engine whose answer depends on which operator you happened to pick is
 * not one anybody can reason about.
 */

const context: EvaluationContext = {
  data: null,
  variables: {},
  // Fixed: 2023-11-14T22:13:20.000Z. Every date test below reads from this, so
  // none of them can pass today and fail tomorrow.
  now: 1_700_000_000_000,
};

const operator = (id: string): OperatorPlugin => {
  const found = builtinOperators.find((entry) => entry.id === id);
  assert.ok(found, `no operator ${id}`);
  return found;
};

const run = (id: string, left: JsonValue, ...args: JsonValue[]): boolean =>
  operator(id).evaluate(left, args, context);

const call = (id: string, ...args: JsonValue[]): JsonValue => {
  const found = builtinFunctions.find((entry) => entry.id === id);
  assert.ok(found, `no function ${id}`);
  return found.evaluate(args, context);
};

describe('registry', () => {
  it('starts empty, because what rules may do is the host’s choice', () => {
    const empty = createRegistry();
    assert.equal(empty.operator('equals'), undefined);
    assert.deepEqual(empty.describe().operators, []);
  });

  it('holds what it is given, addressed by id', () => {
    const registry = createRegistry(builtinPlugins);
    assert.equal(registry.operator('equals')?.id, 'equals');
    assert.equal(registry.function('today')?.id, 'today');
    assert.equal(registry.operator('nope'), undefined, 'a lookup never throws');
    assert.equal(registry.describe().operators.length, builtinOperators.length);
  });

  it('refuses two plugins claiming one id, at registration', () => {
    const mine: OperatorPlugin = { id: 'equals', arity: 1, evaluate: () => true };
    assert.throws(
      () => createRegistry(builtinPlugins, { operators: [mine] }),
      (error: unknown) => error instanceof RuleError && error.code === 'invalid_argument',
    );
  });

  it('refuses a plugin with no id at all', () => {
    assert.throws(() => createRegistry({ operators: [{ id: '', arity: 0, evaluate: () => true }] }));
  });

  it('extends without touching the registry it came from', () => {
    const base = createRegistry(builtinPlugins);
    const extra: OperatorPlugin = { id: 'isBlue', arity: 0, evaluate: (left) => left === 'blue' };
    const extended = base.extend({ operators: [extra] });

    assert.equal(extended.operator('isBlue')?.id, 'isBlue');
    assert.equal(base.operator('isBlue'), undefined, 'the original is unchanged');
    assert.notEqual(base, extended);
  });

  it('is frozen, so nothing can be added behind extend’s back', () => {
    const registry = createRegistry();
    assert.equal(Object.isFrozen(registry), true);
  });

  it('reports which plugins a rule needs and the registry lacks', () => {
    const registry = createRegistry(builtinPlugins);
    assert.deepEqual(
      missingPlugins(registry, { operators: ['equals', 'withinBusinessHours'], functions: ['today', 'taxFor'] }),
      { operators: ['withinBusinessHours'], functions: ['taxFor'] },
    );
  });

  it('keeps providers as lists, since several may contribute', () => {
    const registry = createRegistry(
      { fields: [{ id: 'a', fields: () => [] }] },
      { fields: [{ id: 'b', fields: () => [] }] },
    );
    assert.equal(registry.fieldProviders.length, 2);
  });
});

describe('comparison semantics', () => {
  it('treats 0, false and empty string the way people mean', () => {
    // The classic bug: a rule that ignores a legitimate zero.
    assert.equal(isEmptyValue(0), false);
    assert.equal(isEmptyValue(false), false);
    assert.equal(isEmptyValue(''), true);
    assert.equal(isEmptyValue('   '), true);
    assert.equal(isEmptyValue(null), true);
    assert.equal(isEmptyValue([]), true);
    assert.equal(isEmptyValue({}), true);
    assert.equal(isEmptyValue([0]), false);
  });

  it('compares like with like, and refuses the rest', () => {
    assert.ok(compareValues(2, 1, 't') > 0);
    assert.ok(compareValues('a', 'b', 't') < 0);
    assert.equal(compareValues(true, true, 't'), 0);
    assert.ok(compareValues('2026-01-02', '2026-01-01', 't') > 0);

    // A number against a numeric string is a mistake in the rule, not a false.
    assert.throws(() => compareValues(5, '5', 't'), RuleError);
    assert.throws(() => compareValues(5, 'apple', 't'), RuleError);
    assert.throws(() => compareValues(null, 1, 't'), RuleError);
    assert.throws(() => compareValues([1], [1], 't'), RuleError);
  });

  it('sorts date strings as dates, and other strings as text', () => {
    // As text, "2026-01-10" < "2026-01-9". As dates, it is the other way round.
    assert.ok(compareValues('2026-01-10', '2026-01-09', 't') > 0);
    assert.ok(compareValues('10', '9', 't') < 0, 'a bare number-like string is text');
  });

  it('is deep and order-insensitive for equality', () => {
    assert.equal(valuesEqual({ a: 1, b: 2 }, { b: 2, a: 1 }), true);
    assert.equal(valuesEqual([1, [2, { c: 3 }]], [1, [2, { c: 3 }]]), true);
    assert.equal(valuesEqual([1, 2], [2, 1]), false, 'a list has an order');
    assert.equal(valuesEqual(null, undefined as never), false);
  });
});

describe('built-in operators', () => {
  it('cover equality and ordering', () => {
    assert.equal(run('equals', 'a', 'a'), true);
    assert.equal(run('notEquals', 'a', 'b'), true);
    assert.equal(run('greaterThan', 5, 3), true);
    assert.equal(run('greaterThanOrEqual', 5, 5), true);
    assert.equal(run('lessThan', 3, 5), true);
    assert.equal(run('lessThanOrEqual', 5, 5), true);
  });

  it('makes between inclusive at both ends', () => {
    assert.equal(run('between', 5, 1, 10), true);
    assert.equal(run('between', 1, 1, 10), true, 'inclusive lower');
    assert.equal(run('between', 10, 1, 10), true, 'inclusive upper');
    assert.equal(run('between', 11, 1, 10), false);
    assert.equal(run('notBetween', 11, 1, 10), true);
  });

  it('accepts a list or a spread for the membership operators', () => {
    assert.equal(run('isOneOf', 'b', ['a', 'b']), true);
    assert.equal(run('isOneOf', 'b', 'a', 'b'), true);
    assert.equal(run('isNotOneOf', 'c', ['a', 'b']), true);
    assert.equal(run('hasAnyOf', ['a', 'b'], ['b', 'z']), true);
    assert.equal(run('hasAllOf', ['a', 'b'], ['a', 'b']), true);
    assert.equal(run('hasAllOf', ['a'], ['a', 'b']), false);
  });

  it('handles text and lists for contains', () => {
    assert.equal(run('contains', 'hello world', 'world'), true);
    assert.equal(run('contains', ['a', 'b'], 'b'), true);
    assert.equal(run('contains', [{ id: 1 }], { id: 1 }), true, 'deep equality inside a list');
    assert.equal(run('notContains', 'hello', 'z'), true);
    assert.equal(run('startsWith', 'hello', 'he'), true);
    assert.equal(run('endsWith', 'hello', 'lo'), true);
    assert.equal(run('equalsIgnoreCase', 'HeLLo', 'hello'), true);
  });

  it('answers the presence operators without arguments', () => {
    assert.equal(run('isEmpty', ''), true);
    assert.equal(run('isNotEmpty', 'x'), true);
    assert.equal(run('isNull', null), true);
    assert.equal(run('isNotNull', 0), true);
    assert.equal(run('isTrue', true), true);
    assert.equal(run('isFalse', false), true);
    assert.equal(run('isTrue', 'true'), false, 'a string is not a boolean');
  });

  it('compares dates', () => {
    assert.equal(run('before', '2026-01-01', '2026-06-01'), true);
    assert.equal(run('after', '2026-06-01', '2026-01-01'), true);
  });

  it('bounds the regex operator, because the pattern is untrusted', () => {
    assert.equal(run('matches', 'abc123', '^[a-z]+\\d+$'), true);

    assert.throws(
      () => run('matches', 'x', 'a'.repeat(300)),
      (error: unknown) => error instanceof RuleError && error.code === 'limit_exceeded',
    );
    assert.throws(
      () => run('matches', 'x'.repeat(20_000), 'x'),
      (error: unknown) => error instanceof RuleError && error.code === 'limit_exceeded',
    );
    assert.throws(
      () => run('matches', 'x', '([unclosed'),
      (error: unknown) => error instanceof RuleError && error.code === 'invalid_argument',
    );
  });

  it('raises rather than answering false when it cannot compare', () => {
    // The distinction the whole error type exists for: "this did not match" and
    // "this could not be evaluated" are different answers.
    assert.throws(() => run('greaterThan', 'apple', 5), RuleError);
    assert.throws(() => run('startsWith', 5, 'a'), RuleError);
    assert.throws(() => run('equals', 'a'), RuleError, 'a missing argument is an arity error');
  });

  it('declares arity and accepted types, so a builder can offer the right ones', () => {
    assert.equal(operator('isEmpty').arity, 0);
    assert.equal(operator('equals').arity, 1);
    assert.equal(operator('between').arity, 2);
    assert.equal(operator('isOneOf').arity, null);
    assert.deepEqual(operator('before').accepts, ['date']);
  });

  it('carries a sentence fragment for every operator', () => {
    for (const entry of builtinOperators) {
      assert.equal(typeof entry.toText, 'function', entry.id);
      const text = entry.toText!('the total', ['100', '200']);
      assert.ok(text.includes('the total'), entry.id);
    }
  });

  it('gives every operator a unique id and a label key', () => {
    const ids = builtinOperators.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const entry of builtinOperators) assert.ok(entry.labelKey, entry.id);
  });
});

describe('built-in functions', () => {
  it('read time from the context, never from the clock', () => {
    assert.equal(call('now'), '2023-11-14T22:13:20.000Z');
    assert.equal(call('today'), '2023-11-14');
    assert.equal(call('daysAgo', 1), '2023-11-13T22:13:20.000Z');
    assert.equal(call('daysFromNow', 1), '2023-11-15T22:13:20.000Z');
    assert.equal(call('daysBetween', '2026-01-01', '2026-01-11'), 10);
  });

  it('counts whole years, the way an age is counted', () => {
    assert.equal(call('yearsSince', '1990-11-14'), 33);
    assert.equal(call('yearsSince', '1990-11-15'), 32, 'the birthday has not happened yet');
  });

  it('handles text', () => {
    assert.equal(call('length', 'hello'), 5);
    assert.equal(call('length', [1, 2, 3]), 3);
    assert.equal(call('lower', 'ABC'), 'abc');
    assert.equal(call('upper', 'abc'), 'ABC');
    assert.equal(call('trim', '  x  '), 'x');
    assert.equal(call('concat', 'a', 'b', 1), 'ab1');
  });

  it('handles numbers, over a list or a spread', () => {
    assert.equal(call('sum', [1, 2, 3]), 6);
    assert.equal(call('sum', 1, 2, 3), 6);
    assert.equal(call('min', [3, 1, 2]), 1);
    assert.equal(call('max', [3, 1, 2]), 3);
    assert.equal(call('average', [2, 4]), 3);
    assert.equal(call('round', 1.2345, 2), 1.23);
    assert.equal(call('absolute', -5), 5);
  });

  it('refuses an average of nothing rather than answering zero', () => {
    // Zero would make an empty basket look like a free one.
    assert.throws(() => call('average', []), RuleError);
    assert.throws(() => call('min', []), RuleError);
    assert.equal(call('sum', []), 0, 'but a total of nothing really is zero');
  });

  it('treats 0 and false as present in coalesce', () => {
    assert.equal(call('coalesce', null, 0, 5), 0);
    assert.equal(call('coalesce', null, null), null);
    assert.equal(call('coalesce', null, false), false);
  });

  it('handles lists', () => {
    assert.equal(call('count', [1, 2]), 2);
    assert.equal(call('first', [1, 2]), 1);
    assert.equal(call('last', [1, 2]), 2);
    assert.equal(call('first', []), null, 'an empty list has no first item');
  });

  it('converts explicitly, and refuses what cannot convert', () => {
    assert.equal(call('toNumber', '42'), 42);
    assert.equal(call('toText', 42), '42');
    assert.equal(call('toText', null), '');
    assert.throws(() => call('toNumber', 'apple'), RuleError);
  });

  it('gives every function a unique id, a return type and a label key', () => {
    const ids = builtinFunctions.map((entry) => entry.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const entry of builtinFunctions) {
      assert.ok(entry.labelKey, entry.id);
      assert.ok(entry.returns, entry.id);
    }
  });
});
