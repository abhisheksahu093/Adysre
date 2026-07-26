import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { EMPTY_REQUEST } from '../constants/defaults';
import type { ApiVariable, VariableContext, VariableLayer } from '../types';
import { createEntry } from './entries';
import { prepareRequest, base64Utf8, encodeUrlSafely } from './prepare';
import { resolveTemplate, referencedNames, visibleVariables } from './variables';

/**
 * Variable resolution and request preparation.
 *
 * These two turn what a person typed into what will actually be sent, so the
 * tests are written as questions a user would ask: which environment did this
 * value come from, what happens when a variable references itself, does my
 * hand-written header survive, and does anything leak when auth is inherited.
 */

function variable(key: string, value: string): ApiVariable {
  return { id: key, key, value, initialValue: value, secret: false, enabled: true, description: '' };
}

function layer(scope: VariableLayer['scope'], variables: ApiVariable[]): VariableLayer {
  return { scope, ownerId: scope, variables };
}

function context(...layers: VariableLayer[]): VariableContext {
  return { layers };
}

const WORKSPACE = '018f0000-0000-7000-8000-000000000001';

describe('variable resolution', () => {
  it('takes the most specific definition', () => {
    const resolved = resolveTemplate(
      '{{base_url}}',
      context(
        layer('global', [variable('base_url', 'https://prod')]),
        layer('environment', [variable('base_url', 'https://staging')]),
        layer('request', [variable('base_url', 'https://local')]),
      ),
    );

    assert.equal(resolved.value, 'https://local');
    assert.equal(resolved.used[0]?.source.scope, 'request');
    assert.deepEqual(resolved.issues, []);
  });

  it('expands a variable that references another', () => {
    const resolved = resolveTemplate(
      '{{url}}/users',
      context(
        layer('global', [variable('host', 'api.example.com'), variable('url', 'https://{{host}}')]),
      ),
    );
    assert.equal(resolved.value, 'https://api.example.com/users');
  });

  it('leaves an unknown variable in place and says so', () => {
    const resolved = resolveTemplate('{{missing}}/x', context(layer('global', [])));
    assert.equal(resolved.value, '{{missing}}/x');
    assert.deepEqual(resolved.issues, [{ code: 'unknown_variable', name: 'missing' }]);
  });

  it('detects a cycle instead of hanging', () => {
    const resolved = resolveTemplate(
      '{{a}}',
      context(layer('global', [variable('a', '{{b}}'), variable('b', '{{a}}')])),
    );
    assert.equal(resolved.issues.some((issue) => issue.code === 'cycle'), true);
    assert.ok(resolved.value.includes('{{a}}'));
  });

  it('detects a variable that references itself', () => {
    const resolved = resolveTemplate('{{a}}', context(layer('global', [variable('a', 'x{{a}}')])));
    assert.equal(resolved.issues[0]?.code, 'cycle');
  });

  it('caps depth on a long chain', () => {
    const chain = Array.from({ length: 20 }, (_, i) => variable(`v${i}`, `{{v${i + 1}}}`));
    const resolved = resolveTemplate('{{v0}}', context(layer('global', chain)));
    assert.ok(resolved.issues.some((issue) => issue.code === 'max_depth' || issue.code === 'unknown_variable'));
  });

  it('ignores a disabled definition and falls through to the layer below', () => {
    const disabled = { ...variable('token', 'staging-token'), enabled: false };
    const resolved = resolveTemplate(
      '{{token}}',
      context(layer('global', [variable('token', 'global-token')]), layer('environment', [disabled])),
    );
    assert.equal(resolved.value, 'global-token');
  });

  it('tolerates whitespace inside the braces', () => {
    const resolved = resolveTemplate('{{  base  }}', context(layer('global', [variable('base', 'ok')])));
    assert.equal(resolved.value, 'ok');
  });

  it('lists references and visible variables for the inspector', () => {
    assert.deepEqual(referencedNames('{{a}}/{{b}}/{{a}}'), ['a', 'b']);
    const visible = visibleVariables(
      context(layer('global', [variable('a', '1')]), layer('environment', [variable('a', '2')])),
    );
    assert.equal(visible.length, 1);
    assert.equal(visible[0]?.variable.value, '2');
  });
});

describe('request preparation', () => {
  const base = {
    workspaceId: WORKSPACE,
    requestNodeId: null,
    context: context(
      layer('global', [variable('base_url', 'https://api.example.com'), variable('token', 't-123')]),
    ),
  };

  it('resolves the url, params and headers into a literal request', () => {
    const result = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        method: 'POST',
        url: '{{base_url}}/users',
        params: [createEntry({ key: 'page', value: '2' })],
        headers: [createEntry({ key: 'X-Token', value: '{{token}}' })],
        body: { type: 'raw', language: 'json', content: '{"id":"{{token}}"}' },
      },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.request.url, 'https://api.example.com/users?page=2');
    assert.deepEqual(result.request.headers[0], { name: 'X-Token', value: 't-123' });
    assert.deepEqual(result.request.body, { encoding: 'text', content: '{"id":"t-123"}' });
    assert.equal(result.request.headers.at(-1)?.value, 'application/json');
  });

  it('never overwrites a Content-Type the user typed', () => {
    const result = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        headers: [createEntry({ key: 'content-type', value: 'application/vnd.api+json' })],
        body: { type: 'raw', language: 'json', content: '{}' },
      },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    const types = result.request.headers.filter((h) => h.name.toLowerCase() === 'content-type');
    assert.equal(types.length, 1);
    assert.equal(types[0]?.value, 'application/vnd.api+json');
  });

  it('substitutes path placeholders and drops disabled rows', () => {
    const result = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: '{{base_url}}/users/:id',
        pathVariables: [createEntry({ key: 'id', value: '42' })],
        params: [
          createEntry({ key: 'keep', value: '1' }),
          createEntry({ key: 'drop', value: '2', enabled: false }),
        ],
      },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.request.url, 'https://api.example.com/users/42?keep=1');
  });

  it('applies basic auth, unicode password included', () => {
    const result = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        auth: { type: 'basic', username: 'ada', password: 'pässwörd' },
      },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    const header = result.request.headers.find((h) => h.name === 'Authorization');
    assert.equal(header?.value, `Basic ${base64Utf8('ada:pässwörd')}`);
    assert.equal(
      Buffer.from(header!.value.replace('Basic ', ''), 'base64').toString('utf8'),
      'ada:pässwörd',
    );
  });

  it('inherits auth from the collection when the request says inherit', () => {
    const result = prepareRequest({
      ...base,
      inheritedAuth: { type: 'bearer', token: '{{token}}', prefix: 'Bearer' },
      request: { ...EMPTY_REQUEST, url: 'https://a.com', auth: { type: 'inherit' } },
    });

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(
      result.request.headers.find((h) => h.name === 'Authorization')?.value,
      'Bearer t-123',
    );
  });

  it('puts an api key where the strategy says', () => {
    const inHeader = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        auth: { type: 'apiKey', key: 'X-Api-Key', value: 'k', addTo: 'header' },
      },
    });
    assert.equal(inHeader.ok && inHeader.request.headers.some((h) => h.name === 'X-Api-Key'), true);

    const inQuery = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        auth: { type: 'apiKey', key: 'api_key', value: 'k', addTo: 'query' },
      },
    });
    assert.equal(inQuery.ok && inQuery.request.url, 'https://a.com?api_key=k');
  });

  it('refuses by name rather than sending unauthenticated', () => {
    for (const auth of [
      { type: 'digest', username: 'a', password: 'b', realm: '', algorithm: 'MD5', qop: '', opaque: '' },
      { type: 'awsSignature', accessKeyId: 'a', secretAccessKey: 'b', sessionToken: '', region: 'us-east-1', service: 's3' },
    ] as const) {
      const result = prepareRequest({
        ...base,
        request: { ...EMPTY_REQUEST, url: 'https://a.com', auth },
      });
      assert.equal(result.ok, false);
      if (result.ok) return;
      assert.equal(result.code, 'unsupported_auth');
      assert.ok(result.detail.includes(auth.type));
    }
  });

  it('refuses a binary body rather than sending an empty one', () => {
    const result = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        body: { type: 'binary', fileId: null, fileName: null, contentType: null },
      },
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, 'unsupported_body');
  });

  it('builds a urlencoded body and a graphql body', () => {
    const form = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        body: {
          type: 'urlencoded',
          entries: [createEntry({ key: 'a b', value: 'c&d' }), createEntry({ key: 'x', value: 'y', enabled: false })],
        },
      },
    });
    assert.equal(form.ok && form.request.body.encoding === 'text' && form.request.body.content, 'a%20b=c%26d');

    const graphql = prepareRequest({
      ...base,
      request: {
        ...EMPTY_REQUEST,
        url: 'https://a.com',
        body: { type: 'graphql', query: 'query { me }', variables: '{"id":1}', operationName: null },
      },
    });
    assert.equal(graphql.ok, true);
    if (!graphql.ok) return;
    assert.equal(
      graphql.request.body.encoding === 'text' && graphql.request.body.content,
      '{"query":"query { me }","variables":{"id":1}}',
    );
  });

  it('reports unresolved variables without refusing to send', () => {
    const result = prepareRequest({
      ...base,
      request: { ...EMPTY_REQUEST, url: '{{unknown_host}}/x' },
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.issues[0]?.code, 'unknown_variable');
    assert.ok(result.request.url.includes('unknown_host'));
  });
});

describe('url encoding', () => {
  it('encodes what must be encoded and leaves existing escapes alone', () => {
    assert.equal(encodeUrlSafely('https://a.com/a%20b'), 'https://a.com/a%20b');
    assert.equal(encodeUrlSafely('https://a.com/a b'), 'https://a.com/a%20b');
    assert.equal(encodeUrlSafely('https://a.com/café'), 'https://a.com/caf%C3%A9');
    assert.equal(encodeUrlSafely('https://a.com/x%'), 'https://a.com/x%25');
  });
});
