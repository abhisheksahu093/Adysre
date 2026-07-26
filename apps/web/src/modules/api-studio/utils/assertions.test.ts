import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { Assertion, ExecutionResponse } from '../types';
import { evaluateAssertion, runAssertions } from './assertions';
import { lookupPath, parsePath } from './json-path';
import { validateSchema } from './json-schema';

/**
 * Assertion tests.
 *
 * The distinction these exist to protect is `failed` versus `errored`: a failed
 * assertion says the response is wrong, an errored one says the check could not
 * be made. Collapsing the two would let a typo'd path or an unsupported schema
 * keyword read as a green test, which is the worst possible outcome for a
 * testing feature.
 */

function response(patch: Partial<ExecutionResponse> = {}): ExecutionResponse {
  return {
    status: 200,
    statusText: 'OK',
    httpVersion: 'HTTP/1.1',
    headers: [
      { name: 'Content-Type', value: 'application/json; charset=utf-8' },
      { name: 'X-Rate-Limit', value: '99' },
    ],
    cookies: [],
    bodyEncoding: 'utf8',
    body: JSON.stringify({ users: [{ name: 'ada', age: 36 }], ok: true, missing: null }),
    truncated: false,
    size: { headers: 0, body: 0, total: 0 },
    requestSize: { headers: 0, body: 0, total: 0 },
    timings: { dns: null, tcp: null, tls: null, firstByte: null, download: null, total: 120 },
    redirects: [],
    insecure: false,
    ...patch,
  };
}

function assertion(patch: Partial<Assertion> = {}): Assertion {
  return {
    id: 'a1',
    enabled: true,
    target: 'status',
    path: '',
    operator: 'equals',
    expected: '200',
    label: '',
    ...patch,
  };
}

describe('json path', () => {
  it('reads dot, bracket and quoted segments', () => {
    const document = { users: [{ 'full name': 'ada' }] };
    assert.deepEqual(lookupPath(document, '$.users[0]["full name"]'), { found: true, value: 'ada' });
    // `users.0` is an index outside brackets, and an unquoted key may contain
    // a space: both are how people actually write a path.
    assert.deepEqual(lookupPath(document, 'users.0.full name'), { found: true, value: 'ada' });
    assert.deepEqual(lookupPath({ a: { b: 1 } }, 'a.b'), { found: true, value: 1 });
    assert.equal(lookupPath(document, 'users.5.name').found, false);
    assert.equal(lookupPath(document, 'users.0.nope').found, false);
  });

  it('separates a missing path from a null value', () => {
    assert.deepEqual(lookupPath({ a: null }, 'a'), { found: true, value: null });
    assert.equal(lookupPath({ a: null }, 'b').found, false);
  });

  it('names the syntax it cannot do instead of guessing', () => {
    const parsed = parsePath('$..name');
    assert.equal(parsed.ok, false);
    assert.ok(parsed.ok === false && parsed.reason.includes('recursive descent'));
    assert.equal(parsePath('$.users[*]').ok, false);
  });
});

describe('json schema', () => {
  it('validates the keywords it supports', () => {
    const schema = {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string', minLength: 2 },
        age: { type: 'integer', minimum: 0 },
      },
      additionalProperties: false,
    };

    assert.deepEqual(validateSchema({ name: 'ada', age: 36 }, schema), { ok: true });

    const missing = validateSchema({ age: 36 }, schema);
    assert.equal(missing.ok, false);
    assert.ok(missing.ok === false && 'violations' in missing && missing.violations[0]?.message === 'is required');

    const extra = validateSchema({ name: 'ada', nope: 1 }, schema);
    assert.ok(extra.ok === false && 'violations' in extra && extra.violations[0]?.message === 'is not allowed');
  });

  it('refuses to judge a schema using keywords it does not implement', () => {
    const verdict = validateSchema({ a: 1 }, { oneOf: [{ type: 'object' }] });
    assert.equal(verdict.ok, false);
    assert.ok(verdict.ok === false && 'unsupported' in verdict && verdict.unsupported.includes('oneOf'));
  });
});

describe('assertions', () => {
  it('checks status, timing and content type', () => {
    assert.equal(evaluateAssertion(assertion(), response()).outcome, 'passed');
    assert.equal(
      evaluateAssertion(assertion({ expected: '201' }), response()).outcome,
      'failed',
    );
    assert.equal(
      evaluateAssertion(
        assertion({ target: 'responseTime', operator: 'lessThan', expected: '500' }),
        response(),
      ).outcome,
      'passed',
    );
    assert.equal(
      evaluateAssertion(
        assertion({ target: 'contentType', operator: 'equals', expected: 'application/json' }),
        response(),
      ).outcome,
      'passed',
    );
  });

  it('reads a header case-insensitively and joins repeats', () => {
    const result = evaluateAssertion(
      assertion({ target: 'header', path: 'x-rate-limit', operator: 'equals', expected: '99' }),
      response(),
    );
    assert.equal(result.outcome, 'passed');

    const repeated = evaluateAssertion(
      assertion({ target: 'header', path: 'set-cookie', operator: 'contains', expected: 'b=2' }),
      response({
        headers: [
          { name: 'Set-Cookie', value: 'a=1' },
          { name: 'Set-Cookie', value: 'b=2' },
        ],
      }),
    );
    assert.equal(repeated.outcome, 'passed');
  });

  it('answers exists and notExists before anything can error', () => {
    assert.equal(
      evaluateAssertion(
        assertion({ target: 'jsonPath', path: '$.users[0].name', operator: 'exists', expected: '' }),
        response(),
      ).outcome,
      'passed',
    );
    assert.equal(
      evaluateAssertion(
        assertion({ target: 'jsonPath', path: '$.nope', operator: 'notExists', expected: '' }),
        response(),
      ).outcome,
      'passed',
    );
  });

  it('errors rather than fails when the check cannot be made', () => {
    const badPath = evaluateAssertion(
      assertion({ target: 'jsonPath', path: '$..name', operator: 'equals', expected: 'ada' }),
      response(),
    );
    assert.equal(badPath.outcome, 'errored');
    assert.ok(badPath.error?.includes('recursive descent'));

    const notJson = evaluateAssertion(
      assertion({ target: 'jsonPath', path: 'a', operator: 'equals', expected: 'b' }),
      response({ body: 'plain text' }),
    );
    assert.equal(notJson.outcome, 'errored');

    const badRegex = evaluateAssertion(
      assertion({ target: 'body', operator: 'matches', expected: '([' }),
      response(),
    );
    assert.equal(badRegex.outcome, 'errored');
  });

  it('compares numbers from a json path numerically', () => {
    assert.equal(
      evaluateAssertion(
        assertion({ target: 'jsonPath', path: 'users[0].age', operator: 'greaterThan', expected: '18' }),
        response(),
      ).outcome,
      'passed',
    );
  });

  it('accepts a list for isOneOf', () => {
    assert.equal(
      evaluateAssertion(assertion({ operator: 'isOneOf', expected: '200, 201, 204' }), response()).outcome,
      'passed',
    );
    assert.equal(
      evaluateAssertion(assertion({ operator: 'isOneOf', expected: '201, 204' }), response()).outcome,
      'failed',
    );
  });

  it('skips a disabled assertion without judging it', () => {
    const result = evaluateAssertion(assertion({ enabled: false, expected: '999' }), response());
    assert.equal(result.outcome, 'skipped');
  });

  it('validates a schema and reports the first violation', () => {
    const schema = JSON.stringify({ type: 'object', required: ['ok'], properties: { ok: { type: 'boolean' } } });
    assert.equal(
      evaluateAssertion(
        assertion({ target: 'jsonSchema', operator: 'isValid', expected: schema }),
        response(),
      ).outcome,
      'passed',
    );

    const strict = JSON.stringify({ type: 'object', required: ['nope'] });
    const failed = evaluateAssertion(
      assertion({ target: 'jsonSchema', operator: 'isValid', expected: strict }),
      response(),
    );
    assert.equal(failed.outcome, 'failed');
    assert.ok(failed.actual?.includes('is required'));
  });

  it('totals a run by outcome', () => {
    const run = runAssertions(
      [
        assertion({ id: 'a' }),
        assertion({ id: 'b', expected: '500' }),
        assertion({ id: 'c', enabled: false }),
        assertion({ id: 'd', target: 'jsonPath', path: '$..x', operator: 'equals', expected: '1' }),
      ],
      response(),
      'req-1',
    );

    assert.equal(run.passed, 1);
    assert.equal(run.failed, 1);
    assert.equal(run.skipped, 1);
    assert.equal(run.errored, 1);
    assert.equal(run.results.length, 4);
  });

  it('describes what it checked, using the label when there is one', () => {
    assert.equal(
      evaluateAssertion(assertion({ label: 'is a good response' }), response()).description,
      'is a good response',
    );
    assert.equal(
      evaluateAssertion(assertion(), response()).description,
      'status equals 200',
    );
  });
});
