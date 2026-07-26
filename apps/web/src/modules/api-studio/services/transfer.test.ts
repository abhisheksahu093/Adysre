import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ApiCollection, ApiNode, ExecutionRequest } from '../types';
import { EMPTY_REQUEST } from '../constants/defaults';
import { importCurl, tokenize } from './import/curl';
import { importPostman } from './import/postman';
import { CODE_TARGETS, generateCode } from './export/code-gen';
import { exportPostman } from './export/postman';

/**
 * Import and export tests.
 *
 * Import is where a wrong guess is expensive: a cURL command that imports as
 * the wrong method, or a Postman collection whose OAuth silently becomes "no
 * auth", produces requests that fail for reasons nobody can see. So the cases
 * below are the ones that actually appear in a paste - a browser's copy with
 * `$'...'` headers, a multi-line command, a form body - and every unimportable
 * thing is asserted to produce a WARNING rather than silence.
 */

const AUDIT = {
  tenantId: '018f0000-0000-7000-8000-000000000000',
  createdAt: '2026-07-26T00:00:00.000Z',
  updatedAt: '2026-07-26T00:00:00.000Z',
  createdBy: null,
  updatedBy: null,
  deletedAt: null,
};

describe('curl tokenizer', () => {
  it('groups quotes and honours escapes', () => {
    assert.deepEqual(tokenize(`curl -X POST 'https://a.com/x y'`), [
      'curl',
      '-X',
      'POST',
      'https://a.com/x y',
    ]);
    assert.deepEqual(tokenize(`curl -H "A: b c"`), ['curl', '-H', 'A: b c']);
    // Chrome emits `$'...'` for any non-ASCII header value, and it is ANSI-C
    // quoting: the escape means the character, not its six letters.
    assert.deepEqual(tokenize(`curl $'caf\\u00e9'`), ['curl', 'café']);
    assert.deepEqual(tokenize(`curl $'a\\tb\\n'`), ['curl', 'a\tb\n']);
    assert.deepEqual(tokenize(`curl $'it\\'s'`), ['curl', "it's"]);
  });

  it('joins a multi-line command', () => {
    assert.deepEqual(
      tokenize(`curl 'https://a.com' \\\n  -H 'A: b' \\\n  --data 'x=1'`),
      ['curl', 'https://a.com', '-H', 'A: b', '--data', 'x=1'],
    );
  });

  it('never evaluates anything', () => {
    // A substitution is text. It must not be run, and must not be expanded.
    assert.deepEqual(tokenize(`curl 'https://a.com/$(whoami)'`), [
      'curl',
      'https://a.com/$(whoami)',
    ]);
  });
});

describe('curl import', () => {
  it('reads a browser-style copy', () => {
    const result = importCurl(`
      curl 'https://api.example.com/users?page=2' \\
        -H 'accept: application/json' \\
        -H 'authorization: Bearer t-123' \\
        --data-raw '{"name":"ada"}' \\
        --compressed
    `);

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.request.method, 'POST', 'data without -X means POST');
    assert.equal(result.request.url, 'https://api.example.com/users?page=2');
    assert.deepEqual(
      result.request.params.map((param) => [param.key, param.value]),
      [['page', '2']],
    );
    assert.equal(result.request.headers.length, 2);
    assert.deepEqual(result.request.body, {
      type: 'raw',
      language: 'json',
      content: '{"name":"ada"}',
    });
  });

  it('honours an explicit method, -G, and the flags that change transport', () => {
    const explicit = importCurl(`curl -X DELETE https://a.com/x -k -L -m 5`);
    assert.equal(explicit.ok, true);
    if (!explicit.ok) return;
    assert.equal(explicit.request.method, 'DELETE');
    assert.equal(explicit.request.settings.verifyTls, false);
    assert.equal(explicit.request.settings.followRedirects, true);
    assert.equal(explicit.request.settings.timeoutMs, 5_000);

    const get = importCurl(`curl -G https://a.com/x -d 'q=hello' -d 'page=2'`);
    assert.equal(get.ok && get.request.method, 'GET');
    assert.equal(get.ok && get.request.url, 'https://a.com/x?q=hello&page=2');
    assert.equal(get.ok && get.request.body.type, 'none');
  });

  it('reads basic auth and a urlencoded body', () => {
    const result = importCurl(
      `curl https://a.com -u ada:secret -H 'content-type: application/x-www-form-urlencoded' -d 'a=1&b=two%20words'`,
    );

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.deepEqual(result.request.auth, { type: 'basic', username: 'ada', password: 'secret' });
    assert.equal(result.request.body.type, 'urlencoded');
    assert.deepEqual(
      result.request.body.type === 'urlencoded'
        ? result.request.body.entries.map((entry) => [entry.key, entry.value])
        : [],
      [
        ['a', '1'],
        ['b', 'two words'],
      ],
    );
  });

  it('warns about what it could not bring across', () => {
    const result = importCurl(`curl https://a.com -F 'file=@/tmp/photo.png' -F 'name=ada' --proxy http://p`);
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.ok(result.warnings.some((warning) => warning.includes('/tmp/photo.png')));
    assert.ok(result.warnings.some((warning) => warning.includes('--proxy')));
    assert.equal(result.request.body.type, 'multipart');
  });

  it('refuses what it cannot read', () => {
    assert.equal(importCurl('').ok, false);
    assert.equal(importCurl('wget https://a.com').ok, false);
    assert.equal(importCurl('curl -X POST').ok, false, 'no URL');
  });
});

describe('postman import', () => {
  const collection = JSON.stringify({
    info: { name: 'Payments', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
    auth: { type: 'bearer', bearer: [{ key: 'token', value: '{{token}}' }] },
    variable: [
      { key: 'base_url', value: 'https://api.example.com' },
      { key: 'api_key', value: 'k-1', type: 'secret' },
    ],
    item: [
      {
        name: 'Users',
        item: [
          {
            name: 'List users',
            request: {
              method: 'GET',
              header: [{ key: 'Accept', value: 'application/json' }],
              url: {
                raw: '{{base_url}}/users?page=1',
                host: ['{{base_url}}'],
                path: ['users'],
                query: [{ key: 'page', value: '1' }],
              },
            },
          },
          {
            name: 'Create user',
            event: [{ listen: 'test', script: { exec: ['pm.test("ok", function () {});'] } }],
            request: {
              method: 'POST',
              url: '{{base_url}}/users',
              body: { mode: 'raw', raw: '{"name":"ada"}', options: { raw: { language: 'json' } } },
              auth: { type: 'oauth2', oauth2: [{ key: 'accessToken', value: 'x' }] },
            },
          },
        ],
      },
    ],
  });

  it('reads the tree, the variables and the auth', () => {
    const result = importPostman(collection);

    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.collection.name, 'Payments');
    assert.deepEqual(result.collection.auth, { type: 'bearer', token: '{{token}}', prefix: 'Bearer' });
    assert.equal(result.collection.variables.find((v) => v.key === 'api_key')?.secret, true);

    const folder = result.collection.nodes.find((node) => node.kind === 'folder');
    assert.ok(folder);
    const children = result.collection.nodes.filter((node) => node.parentId === folder.id);
    assert.deepEqual(children.map((child) => child.name), ['List users', 'Create user']);
  });

  it('reads a v2.1 url object and its query', () => {
    const result = importPostman(collection);
    assert.equal(result.ok, true);
    if (!result.ok) return;

    const list = result.collection.nodes.find((node) => node.name === 'List users');
    assert.equal(list?.request?.url, '{{base_url}}/users?page=1');
    assert.deepEqual(
      list?.request?.params.map((param) => [param.key, param.value]),
      [['page', '1']],
    );
  });

  it('names what it could not import instead of dropping it', () => {
    const result = importPostman(collection);
    assert.equal(result.ok, true);
    if (!result.ok) return;

    assert.ok(result.warnings.some((warning) => warning.includes('oauth2')));
    assert.ok(result.warnings.some((warning) => warning.includes('test script')));

    const created = result.collection.nodes.find((node) => node.name === 'Create user');
    assert.deepEqual(created?.request?.auth, { type: 'none' });
  });

  it('refuses a file that is not a collection', () => {
    assert.equal(importPostman('not json').ok, false);
    assert.equal(importPostman('{"hello":"world"}').ok, false);
  });
});

describe('postman export', () => {
  const collection: ApiCollection = {
    ...AUDIT,
    id: '018f0000-0000-7000-8000-000000000010',
    workspaceId: '018f0000-0000-7000-8000-000000000001',
    name: 'Payments',
    description: '',
    color: null,
    icon: null,
    tags: [],
    favorite: false,
    auth: { type: 'bearer', token: '{{token}}', prefix: 'Bearer' },
    variables: [
      { id: 'v1', key: 'base_url', value: 'https://api.example.com', initialValue: '', secret: false, enabled: true, description: '' },
      { id: 'v2', key: 'api_key', value: 'REAL-SECRET', initialValue: '', secret: true, enabled: true, description: '' },
    ],
    scripts: { preRequest: '', test: '' },
  };

  const nodes: ApiNode[] = [
    {
      ...AUDIT,
      id: '018f0000-0000-7000-8000-000000000020',
      workspaceId: collection.workspaceId,
      collectionId: collection.id,
      parentId: null,
      kind: 'folder',
      name: 'Users',
      position: 1_000,
      description: '',
      tags: [],
      color: null,
      icon: null,
      favorite: false,
      auth: { type: 'inherit' },
      variables: [],
      scripts: { preRequest: '', test: '' },
    },
    {
      ...AUDIT,
      id: '018f0000-0000-7000-8000-000000000021',
      workspaceId: collection.workspaceId,
      collectionId: collection.id,
      parentId: '018f0000-0000-7000-8000-000000000020',
      kind: 'request',
      name: 'List users',
      position: 1_000,
      description: '',
      tags: [],
      color: null,
      icon: null,
      favorite: false,
      version: 1,
      request: { ...structuredClone(EMPTY_REQUEST), url: '{{base_url}}/users', method: 'GET' },
    },
  ];

  it('produces a v2.1 document with the tree intact', () => {
    const exported = JSON.parse(exportPostman(collection, nodes)) as {
      info: { name: string; schema: string };
      item: { name: string; item?: { name: string }[] }[];
    };

    assert.equal(exported.info.name, 'Payments');
    assert.ok(exported.info.schema.includes('v2.1.0'));
    assert.equal(exported.item[0]?.name, 'Users');
    assert.equal(exported.item[0]?.item?.[0]?.name, 'List users');
  });

  it('never writes a secret into the file', () => {
    const text = exportPostman(collection, nodes);
    assert.ok(!text.includes('REAL-SECRET'), 'a shared export must not carry keys');
    assert.ok(text.includes('api_key'), 'the variable itself is still exported');
  });

  it('round-trips through the importer', () => {
    const result = importPostman(exportPostman(collection, nodes));
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.collection.name, 'Payments');
    assert.equal(result.collection.nodes.filter((node) => node.kind === 'request').length, 1);
    assert.equal(
      result.collection.nodes.find((node) => node.kind === 'request')?.request?.url,
      '{{base_url}}/users',
    );
  });
});

describe('code generation', () => {
  const request: ExecutionRequest = {
    id: '018f0000-0000-7000-8000-000000000030',
    workspaceId: '018f0000-0000-7000-8000-000000000001',
    requestNodeId: null,
    agent: 'server',
    method: 'POST',
    url: 'https://api.example.com/users?page=2',
    headers: [
      { name: 'Content-Type', value: 'application/json' },
      { name: 'Authorization', value: 'Bearer t-123' },
    ],
    body: { encoding: 'text', content: '{"name":"ada"}' },
    settings: {
      timeoutMs: 30_000,
      followRedirects: true,
      maxRedirects: 10,
      verifyTls: true,
      decompress: true,
      sendCookies: true,
      storeCookies: true,
      maxResponseBytes: 1_000_000,
    },
  };

  it('offers every target the spec asks for', () => {
    const ids = CODE_TARGETS.map((target) => target.id);
    for (const expected of [
      'curl', 'js-fetch', 'js-axios', 'node', 'python', 'go', 'java', 'php', 'csharp', 'swift', 'kotlin', 'dart', 'ruby',
    ]) {
      assert.ok(ids.includes(expected), expected);
    }
  });

  it('puts the method, url, headers and body into every target', () => {
    for (const target of CODE_TARGETS) {
      const code = target.generate(request);
      assert.ok(code.includes('api.example.com/users'), `${target.id}: url`);
      assert.ok(/POST/i.test(code), `${target.id}: method`);
      assert.ok(code.includes('Authorization') || code.includes('authorization'), `${target.id}: header`);
      assert.ok(code.includes('ada'), `${target.id}: body`);
    }
  });

  it('is deterministic', () => {
    for (const target of CODE_TARGETS) {
      assert.equal(target.generate(request), target.generate(request), target.id);
    }
  });

  it('escapes per language rather than once for all of them', () => {
    const awkward: ExecutionRequest = {
      ...request,
      url: "https://a.com/it's",
      headers: [{ name: 'X-Quote', value: 'a"b' }],
      body: { encoding: 'text', content: `{"q":"it's \\"quoted\\""}` },
    };

    // The shell form must not end its quoted string early.
    const curl = generateCode('curl', awkward) ?? '';
    assert.ok(curl.includes(`'\\''`), 'a single quote is closed, escaped and reopened');

    // The double-quoted languages must escape the quote inside the header.
    const swift = generateCode('swift', awkward) ?? '';
    assert.ok(swift.includes('a\\"b'));

    const ruby = generateCode('ruby', awkward) ?? '';
    assert.ok(ruby.includes("it\\'s"));
  });

  it('says when a file upload could not be included', () => {
    const upload: ExecutionRequest = {
      ...request,
      body: { encoding: 'multipart', parts: [] },
    };
    for (const target of [generateCode('curl', upload), generateCode('python', upload), generateCode('js-fetch', upload)]) {
      assert.ok(target?.includes('not included'), target ?? '');
    }
  });

  it('returns null for a target that does not exist', () => {
    assert.equal(generateCode('cobol', request), null);
  });
});
