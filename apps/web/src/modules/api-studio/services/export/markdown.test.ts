import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ApiCollection, ApiNode } from '../../types';
import { EMPTY_REQUEST } from '../../constants/defaults';
import { createEntry } from '../../utils/entries';
import { exportMarkdown } from './markdown';

/**
 * Documentation tests.
 *
 * A generated document is committed, pasted into wikis and attached to tickets,
 * so the two things worth pinning are that a secret never reaches it and that
 * content cannot break out of the structure it is written into - a pipe in a
 * header value must not split a table, and backticks in a body must not end the
 * fence early.
 */

const AUDIT = {
  tenantId: '018f0000-0000-7000-8000-000000000000',
  createdAt: '2026-07-26T00:00:00.000Z',
  updatedAt: '2026-07-26T00:00:00.000Z',
  createdBy: null,
  updatedBy: null,
  deletedAt: null,
};

const WORKSPACE = '018f0000-0000-7000-8000-000000000001';
const COLLECTION = '018f0000-0000-7000-8000-000000000010';

function collection(patch: Partial<ApiCollection> = {}): ApiCollection {
  return {
    ...AUDIT,
    id: COLLECTION,
    workspaceId: WORKSPACE,
    name: 'Payments API',
    description: 'Everything about payments.',
    color: null,
    icon: null,
    tags: [],
    favorite: false,
    auth: { type: 'bearer', token: '{{token}}', prefix: 'Bearer' },
    variables: [
      { id: 'v1', key: 'base_url', value: 'https://api.example.com', initialValue: '', secret: false, enabled: true, description: 'The host' },
      { id: 'v2', key: 'api_key', value: 'REAL-SECRET', initialValue: '', secret: true, enabled: true, description: '' },
    ],
    scripts: { preRequest: '', test: '' },
    ...patch,
  };
}

const NODE_BASE = {
  ...AUDIT,
  workspaceId: WORKSPACE,
  collectionId: COLLECTION,
  description: '',
  tags: [] as string[],
  color: null,
  icon: null,
  favorite: false,
};

function nodes(): ApiNode[] {
  return [
    {
      ...NODE_BASE,
      id: 'f1',
      parentId: null,
      kind: 'folder',
      name: 'Charges',
      position: 1_000,
      auth: { type: 'inherit' },
      variables: [],
      scripts: { preRequest: '', test: '' },
    },
    {
      ...NODE_BASE,
      id: 'r1',
      parentId: 'f1',
      kind: 'request',
      name: 'Create a charge',
      position: 1_000,
      version: 1,
      description: 'Takes money.',
      request: {
        ...structuredClone(EMPTY_REQUEST),
        method: 'POST',
        url: '{{base_url}}/charges/:id',
        params: [createEntry({ key: 'expand', value: 'customer', description: 'What to inline' })],
        pathVariables: [createEntry({ key: 'id', value: 'ch_123' })],
        headers: [createEntry({ key: 'X-Note', value: 'a | b' })],
        body: { type: 'raw', language: 'json', content: '{"amount": 100}' },
        auth: { type: 'apiKey', key: 'X-Api-Key', value: '{{api_key}}', addTo: 'header' },
      },
    },
  ];
}

describe('markdown documentation', () => {
  it('documents the collection, its tree and each request', () => {
    const document = exportMarkdown(collection(), nodes());

    assert.ok(document.startsWith('# Payments API\n'));
    assert.ok(document.includes('Everything about payments.'));
    assert.ok(document.includes('### Charges'), 'the folder is a heading');
    assert.ok(document.includes('#### Create a charge'), 'nested one level deeper');
    assert.ok(document.includes('`POST {{base_url}}/charges/:id`'));
    assert.ok(document.includes('Takes money.'));
    assert.ok(document.includes('API key `X-Api-Key` in the header.'));
    assert.ok(document.includes('| `expand` | customer | What to inline |'));
    assert.ok(document.includes('| `id` | ch_123 |'));
    assert.ok(document.includes('{"amount": 100}'));
  });

  it('never writes a secret into a document that will be shared', () => {
    const document = exportMarkdown(collection(), nodes());
    assert.ok(!document.includes('REAL-SECRET'));
    assert.ok(document.includes('| `api_key` | _secret_ |'), 'the variable is still listed');
    assert.ok(document.includes('| `base_url` | https://api.example.com | The host |'));
  });

  it('keeps content inside the structure it is written into', () => {
    const document = exportMarkdown(collection(), nodes());
    // A pipe in a value would otherwise split the row into three cells.
    assert.ok(document.includes('| `X-Note` | a \\| b |'));
  });

  it('uses a fence the body cannot close early', () => {
    const withTicks = nodes();
    const request = withTicks[1];
    if (request?.kind !== 'request') throw new Error('fixture');
    request.request.body = { type: 'raw', language: 'text', content: '```\nnested\n```' };

    const document = exportMarkdown(collection(), withTicks);
    assert.ok(document.includes('````text'), 'the fence grew past the content');
  });

  it('handles a collection with nothing in it', () => {
    const document = exportMarkdown(collection({ variables: [], description: '' }), []);
    assert.equal(document.trim(), '# Payments API');
  });
});
