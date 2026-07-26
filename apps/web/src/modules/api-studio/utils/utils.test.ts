import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { POSITION_STEP } from '../constants/limits';
import type { ApiNode } from '../types';
import { createEntry, formatBulkEntries, parseBulkEntries, toWireHeaders, withDefaultHeader, activeEntries, findHeader } from './entries';
import { createId, timestampOf } from './ids';
import { buildTree, canMove, descendantIds, nextPosition, pathTo, positionBetween, renumber } from './tree';
import { looksSendable, paramsFromUrl, parseQuery, pathVariableNames, splitUrl, urlWithParams } from './url';

/**
 * Utility tests. These are the pure functions the stores are built out of, so
 * everything the tree, the address bar and the tables promise is asserted here
 * rather than through a store that would only obscure the failure.
 */

const BASE = {
  tenantId: '018f0000-0000-7000-8000-000000000000',
  workspaceId: '018f0000-0000-7000-8000-000000000001',
  collectionId: '018f0000-0000-7000-8000-000000000002',
  createdAt: '2026-07-26T00:00:00.000Z',
  updatedAt: '2026-07-26T00:00:00.000Z',
  createdBy: null,
  updatedBy: null,
  deletedAt: null,
  description: '',
  tags: [] as string[],
  color: null,
  icon: null,
  favorite: false,
};

function folder(id: string, parentId: string | null, position: number): ApiNode {
  return {
    ...BASE,
    id,
    parentId,
    position,
    kind: 'folder',
    name: id,
    auth: { type: 'inherit' },
    variables: [],
    scripts: { preRequest: '', test: '' },
  };
}

function nodeMap(nodes: ApiNode[]): Record<string, ApiNode> {
  return Object.fromEntries(nodes.map((node) => [node.id, node]));
}

describe('createId', () => {
  it('produces a well-formed UUIDv7', () => {
    const id = createId();
    assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  });

  it('sorts lexicographically in generation order, which is why it is v7', () => {
    const ids = Array.from({ length: 2_000 }, () => createId());
    assert.deepEqual([...ids].sort(), ids);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('round-trips its timestamp', () => {
    const before = Date.now();
    const stamp = timestampOf(createId());
    assert.ok(stamp !== null);
    assert.ok(Math.abs(stamp - before) < 2_000);
    assert.equal(timestampOf('not-a-uuid'), null);
  });
});

describe('tree', () => {
  const nodes = nodeMap([
    folder('a', null, 2_000),
    folder('b', null, 1_000),
    folder('a1', 'a', 1_000),
    folder('a1x', 'a1', 1_000),
    { ...folder('gone', null, 3_000), deletedAt: '2026-07-26T00:00:00.000Z' },
  ]);

  it('nests and orders by position, and hides soft-deleted nodes', () => {
    const tree = buildTree(nodes, BASE.collectionId);
    assert.deepEqual(tree.map((entry) => entry.node.id), ['b', 'a']);
    assert.equal(tree[1]?.children[0]?.node.id, 'a1');
    assert.equal(tree[1]?.children[0]?.children[0]?.node.id, 'a1x');
    assert.equal(tree[1]?.children[0]?.depth, 1);
  });

  it('survives a cycle instead of recursing forever', () => {
    const cyclic = nodeMap([
      { ...folder('x', 'y', 1_000) },
      { ...folder('y', 'x', 1_000) },
      folder('root', null, 1_000),
    ]);
    const tree = buildTree(cyclic, BASE.collectionId);
    assert.deepEqual(tree.map((entry) => entry.node.id), ['root']);
  });

  it('lists descendants and the path back up', () => {
    assert.deepEqual(descendantIds(nodes, 'a').sort(), ['a1', 'a1x']);
    assert.deepEqual(pathTo(nodes, 'a1x').map((node) => node.id), ['a', 'a1', 'a1x']);
  });

  it('refuses the moves that would corrupt the tree', () => {
    assert.equal(canMove(nodes, 'a', 'a'), false, 'into itself');
    assert.equal(canMove(nodes, 'a', 'a1x'), false, 'into its own descendant');
    assert.equal(canMove(nodes, 'a1', null), true, 'to the root');
    assert.equal(canMove(nodes, 'a1', 'b'), true, 'into another folder');
  });

  it('refuses a request as a parent, since only folders hold children', () => {
    const withRequest = nodeMap([
      folder('f', null, 1_000),
      {
        ...BASE,
        id: 'r',
        parentId: null,
        position: 2_000,
        kind: 'request',
        name: 'r',
        version: 1,
        request: {
          protocol: 'http',
          method: 'GET',
          url: '',
          params: [],
          pathVariables: [],
          headers: [],
          body: { type: 'none' },
          auth: { type: 'inherit' },
          scripts: { preRequest: '', test: '' },
          settings: {
            timeoutMs: 30_000,
            followRedirects: true,
            maxRedirects: 10,
            verifyTls: true,
            encodeUrl: true,
            sendCookies: true,
            storeCookies: true,
            decompress: true,
            retry: { attempts: 0, backoffMs: 500, retryOnStatus: [], retryOnNetworkError: false },
          },
          variables: [],
          description: '',
          tags: [],
        },
      },
    ]);
    assert.equal(canMove(withRequest, 'f', 'r'), false);
  });
});

describe('positions', () => {
  it('appends a step past the last sibling', () => {
    assert.equal(nextPosition([folder('a', null, 3_000)]), 3_000 + POSITION_STEP);
    assert.equal(nextPosition([]), POSITION_STEP);
  });

  it('takes the midpoint between two siblings', () => {
    assert.equal(positionBetween(folder('a', null, 1_000), folder('b', null, 2_000)), 1_500);
  });

  it('reports a closed gap instead of colliding', () => {
    assert.equal(positionBetween(folder('a', null, 1_000), folder('b', null, 1_001)), null);
    assert.equal(positionBetween(null, folder('b', null, 1)), null);
  });

  it('handles the ends of the list', () => {
    assert.equal(positionBetween(null, folder('b', null, 1_000)), 500);
    assert.equal(positionBetween(folder('a', null, 1_000), null), 1_000 + POSITION_STEP);
    assert.equal(positionBetween(null, null), POSITION_STEP);
  });

  it('spreads a sibling list back out, keeping its order', () => {
    const spread = renumber([
      folder('b', null, 1_001),
      folder('a', null, 1_000),
      folder('c', null, 1_002),
    ]);
    assert.deepEqual(spread, [
      { id: 'a', position: 1_000 },
      { id: 'b', position: 2_000 },
      { id: 'c', position: 3_000 },
    ]);
  });
});

describe('url', () => {
  it('splits without parsing, so templates survive', () => {
    assert.deepEqual(splitUrl('{{base}}/users/:id?page=1#frag'), {
      base: '{{base}}/users/:id',
      query: 'page=1',
      hash: 'frag',
    });
  });

  it('keeps repeated and valueless query keys', () => {
    assert.deepEqual(parseQuery('tag=a&tag=b&flag'), [
      { key: 'tag', value: 'a' },
      { key: 'tag', value: 'b' },
      { key: 'flag', value: '' },
    ]);
  });

  it('rebuilds the table from the url without destroying disabled rows', () => {
    const previous = [
      createEntry({ key: 'page', value: '1' }),
      createEntry({ key: 'debug', value: 'true', enabled: false }),
    ];
    const params = paramsFromUrl('https://a.com?page=2', previous);
    assert.deepEqual(
      params.map((entry) => [entry.key, entry.value, entry.enabled]),
      [
        ['page', '2', true],
        ['debug', 'true', false],
      ],
    );
    // The row the user may be editing keeps its identity.
    assert.equal(params[0]?.id, previous[0]?.id);
  });

  it('writes the table back, omitting disabled rows and keeping the hash', () => {
    const entries = [
      createEntry({ key: 'a', value: '1' }),
      createEntry({ key: 'b', value: '2', enabled: false }),
      createEntry({ key: 'flag', value: '' }),
    ];
    assert.equal(urlWithParams('https://a.com/x#top', entries), 'https://a.com/x?a=1&flag#top');
    assert.equal(urlWithParams('https://a.com/x?old=1', []), 'https://a.com/x');
  });

  it('never percent-encodes, because variables resolve after this', () => {
    const entries = [createEntry({ key: 'token', value: '{{access_token}}' })];
    assert.equal(
      urlWithParams('{{base_url}}/me', entries),
      '{{base_url}}/me?token={{access_token}}',
    );
  });

  it('finds path placeholders and ignores the scheme colon', () => {
    assert.deepEqual(pathVariableNames('https://a.com/users/:id/posts/:postId'), ['id', 'postId']);
    assert.deepEqual(pathVariableNames('https://a.com/users'), []);
  });

  it('knows when a url is complete enough to send', () => {
    assert.equal(looksSendable('https://a.com'), true);
    assert.equal(looksSendable('{{base_url}}/users'), true);
    assert.equal(looksSendable('a.com'), false);
    assert.equal(looksSendable('   '), false);
  });
});

describe('entries', () => {
  it('sends only enabled, named rows, duplicates and order intact', () => {
    const entries = [
      createEntry({ key: 'X-Tag', value: 'a' }),
      createEntry({ key: 'X-Tag', value: 'b' }),
      createEntry({ key: 'X-Off', value: 'c', enabled: false }),
      createEntry({ key: '   ', value: 'd' }),
    ];
    assert.deepEqual(toWireHeaders(entries), [
      { name: 'X-Tag', value: 'a' },
      { name: 'X-Tag', value: 'b' },
    ]);
    assert.equal(activeEntries(entries).length, 2);
  });

  it('looks headers up case-insensitively and never tramples a typed one', () => {
    const entries = [createEntry({ key: 'content-type', value: 'text/plain' })];
    assert.ok(findHeader(entries, 'Content-Type'));
    const next = withDefaultHeader(entries, 'Content-Type', 'application/json');
    assert.equal(next.length, 1);
    assert.equal(next[0]?.value, 'text/plain');
  });

  it('round-trips bulk edit, disabled rows included', () => {
    const text = 'Accept: application/json\n//X-Debug: 1\nX-Empty';
    const parsed = parseBulkEntries(text);
    assert.deepEqual(
      parsed.map((entry) => [entry.key, entry.value, entry.enabled]),
      [
        ['Accept', 'application/json', true],
        ['X-Debug', '1', false],
        ['X-Empty', '', true],
      ],
    );
    assert.deepEqual(parseBulkEntries(formatBulkEntries(parsed)).map((e) => [e.key, e.value, e.enabled]),
      parsed.map((e) => [e.key, e.value, e.enabled]));
  });
});
