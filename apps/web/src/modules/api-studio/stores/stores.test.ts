import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';

import { EMPTY_REQUEST } from '../constants/defaults';
import { MAX_CONCURRENT_REQUESTS, POSITION_STEP } from '../constants/limits';
import type {
  ApiEnvironment,
  ApiNode,
  ApiRequestNode,
  ApiVariable,
  ExecutionResponse,
  HistoryEntry,
} from '../types';
import { createEntry } from '../utils/entries';
import { useCollectionsStore } from './use-collections-store';
import { useExecutionStore } from './use-execution-store';
import { useHistoryStore } from './use-history-store';
import { useTabsStore } from './use-tabs-store';
import { useWorkspaceStore } from './use-workspace-store';

/**
 * Store tests.
 *
 * Reducers are exercised directly through `getState()`: they are synchronous
 * and pure by design, so no React and no renderer is involved. What is asserted
 * here is the behaviour the UI will rely on and cannot easily see for itself -
 * that a move cannot create a cycle, that a duplicate is a copy and not an
 * alias, that eviction never eats a starred row, that cancelling actually
 * aborts.
 */

const TENANT = '018f0000-0000-7000-8000-000000000000';
const WORKSPACE = '018f0000-0000-7000-8000-000000000001';
const COLLECTION = '018f0000-0000-7000-8000-000000000002';

const AUDIT = {
  tenantId: TENANT,
  createdAt: '2026-07-26T00:00:00.000Z',
  updatedAt: '2026-07-26T00:00:00.000Z',
  createdBy: null,
  updatedBy: null,
  deletedAt: null,
};

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

function folder(id: string, parentId: string | null, position: number): ApiNode {
  return {
    ...NODE_BASE,
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

function request(id: string, parentId: string | null, position: number, url = ''): ApiRequestNode {
  return {
    ...NODE_BASE,
    id,
    parentId,
    position,
    kind: 'request',
    name: id,
    version: 1,
    request: { ...structuredClone(EMPTY_REQUEST), url },
  };
}

function variable(id: string, key: string, value: string): ApiVariable {
  return { id, key, value, initialValue: value, secret: false, enabled: true, description: '' };
}

function environment(id: string, variables: ApiVariable[]): ApiEnvironment {
  return { ...AUDIT, id, workspaceId: WORKSPACE, name: id, color: null, variables };
}

function historyEntry(id: string, patch: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id,
    workspaceId: WORKSPACE,
    nodeId: null,
    method: 'GET',
    url: `https://api.example.com/${id}`,
    status: 200,
    errorCode: null,
    durationMs: 12,
    responseBytes: 100,
    executedAt: Number(id),
    favorite: false,
    request: structuredClone(EMPTY_REQUEST),
    ...patch,
  };
}

function resetStores(): void {
  useCollectionsStore.setState({
    status: 'idle',
    error: null,
    collections: [],
    nodes: {},
    expanded: {},
    selectedNodeId: null,
    query: '',
  });
  useTabsStore.setState({ tabs: [], activeTabId: null, closed: [] });
  useExecutionStore.setState({ byTab: {} });
  useHistoryStore.setState({ entries: [], limit: 500 });
  useHistoryStore.getState().resetFilters();
  useWorkspaceStore.setState({
    status: 'idle',
    error: null,
    workspaces: [],
    activeWorkspaceId: null,
    environments: [],
    activeEnvironmentId: null,
    globals: [],
  });
}

beforeEach(resetStores);

describe('collections store', () => {
  it('refuses a move that would create a cycle or nest inside a request', () => {
    const store = useCollectionsStore.getState();
    store.load({
      collections: [],
      nodes: [folder('a', null, 1_000), folder('a1', 'a', 1_000), request('r', null, 2_000)],
    });

    assert.equal(useCollectionsStore.getState().moveNode('a', 'a1', 0), false);
    assert.equal(useCollectionsStore.getState().moveNode('a', 'a', 0), false);
    assert.equal(useCollectionsStore.getState().moveNode('a', 'r', 0), false);
    // The tree is untouched by a refused move.
    assert.equal(useCollectionsStore.getState().nodes['a']?.parentId, null);
  });

  it('lands a move at the requested index', () => {
    useCollectionsStore.getState().load({
      collections: [],
      nodes: [
        folder('a', null, 1_000),
        folder('b', null, 2_000),
        folder('c', null, 3_000),
        folder('target', null, 9_000),
      ],
    });

    assert.equal(useCollectionsStore.getState().moveNode('target', null, 1), true);
    const order = useCollectionsStore
      .getState()
      .tree(COLLECTION)
      .map((entry) => entry.node.id);
    assert.deepEqual(order, ['a', 'target', 'b', 'c']);
  });

  it('renumbers when the gap between two siblings has closed', () => {
    useCollectionsStore.getState().load({
      collections: [],
      nodes: [folder('a', null, 1_000), folder('b', null, 1_001), folder('moving', null, 5_000)],
    });

    assert.equal(useCollectionsStore.getState().moveNode('moving', null, 1), true);
    const nodes = useCollectionsStore.getState().nodes;
    assert.equal(nodes['a']?.position, POSITION_STEP);
    assert.equal(nodes['b']?.position, POSITION_STEP * 2);
    assert.ok((nodes['moving']?.position ?? 0) > POSITION_STEP);
    assert.ok((nodes['moving']?.position ?? 0) < POSITION_STEP * 2);
    assert.deepEqual(
      useCollectionsStore.getState().tree(COLLECTION).map((entry) => entry.node.id),
      ['a', 'moving', 'b'],
    );
  });

  it('soft-deletes a folder together with everything under it', () => {
    useCollectionsStore.getState().load({
      collections: [],
      nodes: [folder('a', null, 1_000), folder('a1', 'a', 1_000), request('r', 'a1', 1_000)],
    });

    useCollectionsStore.getState().removeNode('a');
    const nodes = useCollectionsStore.getState().nodes;
    for (const id of ['a', 'a1', 'r']) assert.ok(nodes[id]?.deletedAt, id);
    assert.equal(useCollectionsStore.getState().tree(COLLECTION).length, 0);
  });

  it('duplicates a subtree as a copy, not an alias', () => {
    useCollectionsStore.getState().load({
      collections: [],
      nodes: [folder('a', null, 1_000), request('r', 'a', 1_000, 'https://a.com')],
    });

    const copyId = useCollectionsStore.getState().duplicateNode('a', (name) => `${name} 2`);
    assert.ok(copyId);
    const nodes = useCollectionsStore.getState().nodes;
    assert.equal(nodes[copyId]?.name, 'a 2');
    assert.notEqual(copyId, 'a');

    const copiedChildren = Object.values(nodes).filter((node) => node.parentId === copyId);
    assert.equal(copiedChildren.length, 1);
    assert.notEqual(copiedChildren[0]?.id, 'r');

    // Editing the copy must not touch the original.
    useCollectionsStore.getState().updateNode(copyId, { name: 'renamed' });
    assert.equal(useCollectionsStore.getState().nodes['a']?.name, 'a');
  });

  it('memoises the tree on the identity of the node map', () => {
    useCollectionsStore.getState().load({ collections: [], nodes: [folder('a', null, 1_000)] });
    const first = useCollectionsStore.getState().tree(COLLECTION);
    assert.equal(useCollectionsStore.getState().tree(COLLECTION), first);

    useCollectionsStore.getState().toggleFavorite('a');
    assert.notEqual(useCollectionsStore.getState().tree(COLLECTION), first);
  });

  it('searches name, tags and url', () => {
    useCollectionsStore.getState().load({
      collections: [],
      nodes: [
        { ...folder('a', null, 1_000), tags: ['billing'] },
        request('r', null, 2_000, 'https://api.example.com/invoices'),
      ],
    });

    const store = useCollectionsStore.getState();
    store.setQuery('billing');
    assert.deepEqual(useCollectionsStore.getState().matches().map((n) => n.id), ['a']);
    useCollectionsStore.getState().setQuery('invoices');
    assert.deepEqual(useCollectionsStore.getState().matches().map((n) => n.id), ['r']);
  });
});

describe('tabs store', () => {
  it('focuses the tab already editing a request instead of opening a second', () => {
    const node = request('r', null, 1_000, 'https://a.com');
    const first = useTabsStore.getState().openRequest(node);
    const again = useTabsStore.getState().openRequest(node);
    assert.equal(first, again);
    assert.equal(useTabsStore.getState().tabs.length, 1);
  });

  it('edits a draft without touching the saved request', () => {
    const node = request('r', null, 1_000, 'https://a.com');
    const id = useTabsStore.getState().openRequest(node)!;
    useTabsStore.getState().updateDraft(id, { method: 'POST' });

    assert.equal(useTabsStore.getState().tab(id)?.draft.method, 'POST');
    assert.equal(node.request.method, 'GET');
    assert.equal(useTabsStore.getState().hasUnsavedChanges(), true);

    useTabsStore.getState().markSaved(id, 'r');
    assert.equal(useTabsStore.getState().hasUnsavedChanges(), false);
  });

  it('keeps the url and the params table in step, whichever side is edited', () => {
    const id = useTabsStore.getState().openScratch('scratch')!;

    useTabsStore.getState().updateDraft(id, { url: 'https://a.com/x?page=2&tag=a' });
    const afterUrl = useTabsStore.getState().tab(id)!.draft;
    assert.deepEqual(afterUrl.params.map((p) => [p.key, p.value]), [['page', '2'], ['tag', 'a']]);

    useTabsStore.getState().updateDraft(id, {
      params: [createEntry({ key: 'page', value: '3' })],
    });
    assert.equal(useTabsStore.getState().tab(id)?.draft.url, 'https://a.com/x?page=3');
  });

  it('picks up path placeholders from the url', () => {
    const id = useTabsStore.getState().openScratch('scratch')!;
    useTabsStore.getState().updateDraft(id, { url: '{{base}}/users/:id' });
    assert.deepEqual(
      useTabsStore.getState().tab(id)?.draft.pathVariables.map((v) => v.key),
      ['id'],
    );
  });

  it('moves focus to the neighbour when the active tab closes', () => {
    const a = useTabsStore.getState().openScratch('a')!;
    const b = useTabsStore.getState().openScratch('b')!;
    const c = useTabsStore.getState().openScratch('c')!;

    useTabsStore.getState().setActive(b);
    useTabsStore.getState().closeTab(b);
    assert.equal(useTabsStore.getState().activeTabId, c);

    useTabsStore.getState().closeTab(c);
    assert.equal(useTabsStore.getState().activeTabId, a);
  });

  it('reopens the last closed tab', () => {
    const id = useTabsStore.getState().openScratch('a')!;
    useTabsStore.getState().closeTab(id);
    assert.equal(useTabsStore.getState().tabs.length, 0);

    const reopened = useTabsStore.getState().reopenClosed();
    assert.equal(reopened, id);
    assert.equal(useTabsStore.getState().tabs.length, 1);
    assert.equal(useTabsStore.getState().reopenClosed(), null);
  });

  it('duplicates a tab as an unsaved copy, so saving cannot overwrite the original', () => {
    const node = request('r', null, 1_000, 'https://a.com');
    const id = useTabsStore.getState().openRequest(node)!;
    const copy = useTabsStore.getState().duplicateTab(id)!;

    assert.equal(useTabsStore.getState().tab(copy)?.nodeId, null);
    assert.equal(useTabsStore.getState().tab(copy)?.dirty, true);
    assert.notEqual(useTabsStore.getState().tab(copy)?.draft, useTabsStore.getState().tab(id)?.draft);
  });

  it('keeps pinned tabs to the left and closes the rest around them', () => {
    const a = useTabsStore.getState().openScratch('a')!;
    const b = useTabsStore.getState().openScratch('b')!;
    const c = useTabsStore.getState().openScratch('c')!;

    useTabsStore.getState().setPinned(c, true);
    assert.equal(useTabsStore.getState().tabs[0]?.id, c);

    useTabsStore.getState().closeOthers(a);
    const remaining = useTabsStore.getState().tabs.map((tab) => tab.id);
    assert.deepEqual(remaining.sort(), [a, c].sort());
    assert.ok(!remaining.includes(b));
  });

  it('cycles through tabs, wrapping at both ends', () => {
    const a = useTabsStore.getState().openScratch('a')!;
    useTabsStore.getState().openScratch('b');
    const c = useTabsStore.getState().openScratch('c')!;

    useTabsStore.getState().setActive(c);
    useTabsStore.getState().nextTab();
    assert.equal(useTabsStore.getState().activeTabId, a);
    useTabsStore.getState().previousTab();
    assert.equal(useTabsStore.getState().activeTabId, c);
  });
});

describe('execution store', () => {
  const response: ExecutionResponse = {
    status: 200,
    statusText: 'OK',
    httpVersion: 'HTTP/1.1',
    headers: [],
    cookies: [],
    bodyEncoding: 'utf8',
    body: '{}',
    truncated: false,
    size: { headers: 0, body: 2, total: 2 },
    requestSize: { headers: 0, body: 0, total: 0 },
    timings: { dns: null, tcp: null, tls: null, firstByte: null, download: null, total: 12 },
    redirects: [],
    insecure: false,
  };

  it('tracks a send through to a result, per tab', () => {
    const controller = new AbortController();
    useExecutionStore.getState().start('tab-1', controller);
    assert.equal(useExecutionStore.getState().isSending('tab-1'), true);
    assert.equal(useExecutionStore.getState().isSending('tab-2'), false);

    useExecutionStore.getState().finish('tab-1', { id: 'x', ok: true, response });
    const entry = useExecutionStore.getState().entry('tab-1');
    assert.equal(entry.status, 'success');
    assert.equal(entry.response?.status, 200);
    assert.equal(entry.controller, null);
  });

  it('treats a failed exchange as an error, not as a response', () => {
    useExecutionStore.getState().start('tab-1', new AbortController());
    useExecutionStore.getState().finish('tab-1', {
      id: 'x',
      ok: false,
      error: { code: 'connection_refused', message: 'refused', cause: 'ECONNREFUSED' },
    });

    const entry = useExecutionStore.getState().entry('tab-1');
    assert.equal(entry.status, 'error');
    assert.equal(entry.response, null);
    assert.equal(entry.error?.code, 'connection_refused');
  });

  it('actually aborts on cancel', () => {
    const controller = new AbortController();
    useExecutionStore.getState().start('tab-1', controller);
    useExecutionStore.getState().cancel('tab-1');

    assert.equal(controller.signal.aborted, true);
    assert.equal(useExecutionStore.getState().entry('tab-1').status, 'cancelled');
    // Cancelling again is harmless.
    useExecutionStore.getState().cancel('tab-1');
  });

  it('caps concurrent sends', () => {
    for (let i = 0; i < MAX_CONCURRENT_REQUESTS; i += 1) {
      useExecutionStore.getState().start(`tab-${i}`, new AbortController());
    }
    assert.equal(useExecutionStore.getState().inFlightCount(), MAX_CONCURRENT_REQUESTS);
    assert.equal(useExecutionStore.getState().canSend(), false);

    useExecutionStore.getState().cancel('tab-0');
    assert.equal(useExecutionStore.getState().canSend(), true);
  });
});

describe('history store', () => {
  it('keeps newest first and never evicts a favourite', () => {
    useHistoryStore.getState().setLimit(2);
    useHistoryStore.getState().add(historyEntry('1'));
    useHistoryStore.getState().add(historyEntry('2', { favorite: true }));
    useHistoryStore.getState().add(historyEntry('3'));
    useHistoryStore.getState().add(historyEntry('4'));

    const ids = useHistoryStore.getState().entries.map((entry) => entry.id);
    assert.deepEqual(ids, ['4', '3', '2']);
  });

  it('clears everything except favourites, unless told otherwise', () => {
    useHistoryStore.getState().add(historyEntry('1'));
    useHistoryStore.getState().add(historyEntry('2', { favorite: true }));

    useHistoryStore.getState().clear();
    assert.deepEqual(useHistoryStore.getState().entries.map((e) => e.id), ['2']);

    useHistoryStore.getState().clear(true);
    assert.equal(useHistoryStore.getState().entries.length, 0);
  });

  it('filters by text, method, outcome and favourites', () => {
    useHistoryStore.getState().load([
      historyEntry('1', { url: 'https://api.example.com/users', method: 'GET' }),
      historyEntry('2', { url: 'https://api.example.com/orders', method: 'POST' }),
      historyEntry('3', { status: null, errorCode: 'timeout', favorite: true }),
    ]);

    useHistoryStore.getState().setFilter('query', 'orders');
    assert.deepEqual(useHistoryStore.getState().filtered().map((e) => e.id), ['2']);

    useHistoryStore.getState().resetFilters();
    useHistoryStore.getState().setFilter('outcome', 'error');
    assert.deepEqual(useHistoryStore.getState().filtered().map((e) => e.id), ['3']);

    useHistoryStore.getState().resetFilters();
    useHistoryStore.getState().setFilter('method', 'POST');
    assert.deepEqual(useHistoryStore.getState().filtered().map((e) => e.id), ['2']);
  });
});

describe('workspace store', () => {
  it('stacks globals under the active environment', () => {
    const env = environment('env-1', [variable('v2', 'base_url', 'https://staging')]);
    useWorkspaceStore.getState().load({
      workspaces: [],
      environments: [env],
      globals: [variable('v1', 'base_url', 'https://prod')],
      activeWorkspaceId: WORKSPACE,
    });
    useWorkspaceStore.getState().setActiveEnvironment('env-1');

    const layers = useWorkspaceStore.getState().variableLayers();
    assert.deepEqual(layers.map((layer) => layer.scope), ['global', 'environment']);
    // Least specific first: the resolver takes the last match, so the
    // environment wins over the global.
    assert.equal(layers[1]?.variables[0]?.value, 'https://staging');
  });

  it('drops the active environment when it belongs to another workspace', () => {
    useWorkspaceStore.getState().load({
      workspaces: [],
      environments: [environment('env-1', [])],
      globals: [],
      activeWorkspaceId: WORKSPACE,
    });
    useWorkspaceStore.getState().setActiveEnvironment('env-1');
    useWorkspaceStore.getState().setActiveWorkspace('other-workspace');

    assert.equal(useWorkspaceStore.getState().activeEnvironmentId, null);
    assert.deepEqual(
      useWorkspaceStore.getState().variableLayers().map((layer) => layer.scope),
      ['global'],
    );
  });

  it('removes an environment together with the selection pointing at it', () => {
    useWorkspaceStore.getState().load({
      workspaces: [],
      environments: [environment('env-1', [])],
      globals: [],
    });
    useWorkspaceStore.getState().setActiveEnvironment('env-1');
    useWorkspaceStore.getState().removeEnvironment('env-1');

    assert.equal(useWorkspaceStore.getState().activeEnvironmentId, null);
    assert.equal(useWorkspaceStore.getState().environments.length, 0);
  });
});
