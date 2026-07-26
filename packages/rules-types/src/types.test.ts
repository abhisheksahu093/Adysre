import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  AST_SCHEMA_VERSION,
  COMBINATORS,
  RULE_KINDS,
  VALUE_TYPES,
  VERDICTS,
  isCondition,
  isFieldOperand,
  isFunctionOperand,
  isGroup,
  matchesType,
  valueTypeOf,
  type ConditionNode,
  type GroupNode,
} from './index';

/**
 * Type-package tests.
 *
 * Most of this package is types, which the compiler checks. What it also ships
 * is the handful of runtime pieces those types are derived from - the const
 * arrays and the guards - and those are ordinary code that can be ordinarily
 * wrong. A guard that narrowed the wrong way would be a bug every consumer
 * inherits.
 */

const group: GroupNode = { kind: 'group', id: 'g_1', combinator: 'all', children: [] };
const condition: ConditionNode = {
  kind: 'condition',
  id: 'c_1',
  left: { source: 'field', path: 'a' },
  operator: 'equals',
  args: [],
};

describe('node guards', () => {
  it('narrow in the direction they claim', () => {
    assert.equal(isGroup(group), true);
    assert.equal(isGroup(condition), false);
    assert.equal(isCondition(condition), true);
    assert.equal(isCondition(group), false);
  });

  it('narrow operands by source', () => {
    assert.equal(isFieldOperand({ source: 'field', path: 'a' }), true);
    assert.equal(isFieldOperand({ source: 'literal', value: 1 }), false);
    assert.equal(isFunctionOperand({ source: 'function', name: 'today', args: [] }), true);
    assert.equal(isFunctionOperand({ source: 'variable', name: 'x' }), false);
  });
});

describe('value types', () => {
  it('report what a value is', () => {
    assert.equal(valueTypeOf(null), 'null');
    assert.equal(valueTypeOf('a'), 'string');
    assert.equal(valueTypeOf(1), 'number');
    assert.equal(valueTypeOf(true), 'boolean');
    assert.equal(valueTypeOf([]), 'array');
    assert.equal(valueTypeOf({}), 'object');
    // An array is not an object here, which is the distinction operators need.
    assert.notEqual(valueTypeOf([]), valueTypeOf({}));
  });

  it('accept a date as the string JSON can actually carry', () => {
    assert.equal(matchesType('2026-07-26T00:00:00.000Z', 'date'), true);
    assert.equal(matchesType('2026-07-26', 'date'), true);
    assert.equal(matchesType('not a date', 'date'), false);
    assert.equal(matchesType(1_700_000_000_000, 'date'), false, 'a timestamp is a number, not a date');
  });

  it('let `any` accept everything, including null', () => {
    for (const value of [null, 0, '', false, [], {}]) {
      assert.equal(matchesType(value, 'any'), true);
    }
  });

  it('do not let a number pass for a string', () => {
    assert.equal(matchesType(1, 'string'), false);
    assert.equal(matchesType('1', 'number'), false);
  });
});

describe('the const arrays types derive from', () => {
  it('hold what the engine documents', () => {
    assert.deepEqual([...COMBINATORS], ['all', 'any', 'none']);
    assert.deepEqual([...VERDICTS], ['matched', 'unmatched', 'skipped', 'errored']);
    assert.equal(RULE_KINDS.length, 7);
    for (const kind of ['validation', 'filter', 'transformation', 'workflow', 'calculation', 'permission', 'visibility']) {
      assert.ok((RULE_KINDS as readonly string[]).includes(kind), kind);
    }
    assert.ok((VALUE_TYPES as readonly string[]).includes('any'));
  });

  it('start the AST at version 1', () => {
    // A stored document's `schemaVersion` is compared against this, so it must
    // only ever move forward.
    assert.equal(AST_SCHEMA_VERSION, 1);
  });
});
