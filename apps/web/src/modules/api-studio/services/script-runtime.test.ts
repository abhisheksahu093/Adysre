import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ScriptContext, ScriptOutcome } from '../types';
import { SCRIPT_RUNTIME_SOURCE, SCRIPT_WORKER_SOURCE } from './script-runtime-source';

/**
 * Script runtime tests.
 *
 * The runtime is a source STRING so it can run inside a Blob worker, and these
 * tests evaluate that exact string. What is verified is therefore the code that
 * really runs in the browser, not a parallel implementation that could drift
 * from it - which is the whole reason it is kept as source.
 */

type RunScript = (source: string, context: ScriptContext) => ScriptOutcome;

const runScript = new Function(`${SCRIPT_RUNTIME_SOURCE}; return runScript;`)() as RunScript;

function context(patch: Partial<ScriptContext> = {}): ScriptContext {
  return {
    request: { method: 'GET', url: 'https://api.example.com/users', headers: [], body: '' },
    response: {
      status: 200,
      statusText: 'OK',
      responseTime: 120,
      headers: [{ name: 'Content-Type', value: 'application/json' }],
      body: JSON.stringify({ id: 7, name: 'ada', tags: ['a', 'b'] }),
    },
    variables: { base_url: 'https://api.example.com' },
    ...patch,
  };
}

describe('script runtime', () => {
  it('records a passing and a failing test without stopping', () => {
    const outcome = runScript(
      `
      pm.test('status is 200', function () { pm.expect(pm.response.code).to.equal(200); });
      pm.test('is a teapot', function () { pm.expect(pm.response.code).to.equal(418); });
      pm.test('still runs', function () { pm.expect(true).to.be.true; });
      `,
      context(),
    );

    assert.equal(outcome.error, null);
    assert.deepEqual(
      outcome.tests.map((test) => [test.name, test.passed]),
      [
        ['status is 200', true],
        ['is a teapot', false],
        ['still runs', true],
      ],
    );
    assert.ok(outcome.tests[1]?.error?.includes('to equal'));
  });

  it('parses the response and reads headers case-insensitively', () => {
    const outcome = runScript(
      `
      var body = pm.response.json();
      pm.test('name', function () { pm.expect(body.name).to.equal('ada'); });
      pm.test('tags', function () { pm.expect(body.tags).to.include('b'); });
      pm.test('header', function () {
        pm.expect(pm.response.headers.get('content-type')).to.equal('application/json');
      });
      pm.test('time', function () { pm.expect(pm.response.responseTime).to.be.below(1000); });
      `,
      context(),
    );

    assert.deepEqual(outcome.tests.filter((test) => !test.passed), []);
  });

  it('supports negation and deep equality', () => {
    const outcome = runScript(
      `
      pm.test('not equal', function () { pm.expect(1).to.not.equal(2); });
      pm.test('deep equal', function () { pm.expect({ a: 1 }).to.eql({ a: 1 }); });
      pm.test('property', function () { pm.expect(pm.response.json()).to.have.property('id'); });
      pm.test('one of', function () { pm.expect(pm.response.code).to.be.oneOf([200, 201]); });
      `,
      context(),
    );
    assert.deepEqual(outcome.tests.filter((test) => !test.passed), []);
  });

  it('collects variable changes rather than mutating anything', () => {
    const outcome = runScript(
      `
      pm.environment.set('token', pm.response.json().id);
      pm.environment.unset('stale');
      pm.test('reads back what it set', function () {
        pm.expect(pm.variables.get('token')).to.equal('7');
      });
      `,
      context(),
    );

    assert.deepEqual(outcome.setVariables, { token: '7' });
    assert.deepEqual(outcome.unsetVariables, ['stale']);
    assert.deepEqual(outcome.tests.filter((test) => !test.passed), []);
  });

  it('captures console output and bounds it', () => {
    const outcome = runScript(
      `
      console.log('hello', { a: 1 });
      console.warn('careful');
      console.error('broken');
      for (var i = 0; i < 500; i += 1) console.log('spam');
      `,
      context(),
    );

    assert.equal(outcome.logs[0]?.message, 'hello {"a":1}');
    assert.equal(outcome.logs[1]?.level, 'warn');
    assert.equal(outcome.logs[2]?.level, 'error');
    assert.equal(outcome.logs.length, 200, 'logs are capped');
  });

  it('reports a script that throws instead of losing it', () => {
    const outcome = runScript('throw new Error("boom");', context());
    assert.equal(outcome.error, 'boom');
    assert.deepEqual(outcome.tests, []);

    const syntax = runScript('this is not javascript', context());
    assert.ok(syntax.error);
  });

  it('says so when the body is not JSON', () => {
    const outcome = runScript(
      `pm.test('parses', function () { pm.response.json(); });`,
      context({
        response: {
          status: 200,
          statusText: 'OK',
          responseTime: 1,
          headers: [],
          body: 'not json',
        },
      }),
    );
    assert.equal(outcome.tests[0]?.passed, false);
    assert.ok(outcome.tests[0]?.error?.includes('not JSON'));
  });

  it('runs a pre-request script with no response present', () => {
    const outcome = runScript(
      `
      pm.environment.set('stamp', 'fixed');
      pm.test('has a request', function () { pm.expect(pm.request.method).to.equal('GET'); });
      `,
      { request: context().request, variables: {} },
    );

    assert.equal(outcome.error, null);
    assert.deepEqual(outcome.setVariables, { stamp: 'fixed' });
  });
});

describe('worker program', () => {
  it('removes the globals a script has no business reaching', () => {
    for (const api of [
      'fetch',
      'XMLHttpRequest',
      'WebSocket',
      'EventSource',
      'importScripts',
      'indexedDB',
      'caches',
      'Worker',
    ]) {
      assert.ok(
        SCRIPT_WORKER_SOURCE.includes(`self.${api} = undefined;`),
        `${api} must be stripped in the worker`,
      );
    }
  });

  it('carries the runtime it is meant to run', () => {
    assert.ok(SCRIPT_WORKER_SOURCE.includes('function runScript('));
    assert.ok(SCRIPT_WORKER_SOURCE.includes('self.onmessage'));
  });
});
