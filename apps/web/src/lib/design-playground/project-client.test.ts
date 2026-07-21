import assert from 'node:assert/strict';
import { afterEach, describe, it, mock } from 'node:test';

import { createDocument } from './document';
import { serializeDocument } from './schema';
import { createProject, loadLatestProject, loadProject, saveProject } from './project-client';

/**
 * The sync client's job is to turn HTTP outcomes into states the editor can act
 * on: a 503 must read as "offline" (keep working locally), a 404 as "gone"
 * (recreate), and a corrupt document as "invalid" (never render it). Those
 * distinctions are what stop a failed save from looking like a successful one.
 */

/** Stub `fetch` with a canned response. */
function stubFetch(status: number, body: unknown): void {
  globalThis.fetch = mock.fn(
    async () =>
      new Response(body === undefined ? null : JSON.stringify(body), {
        status,
        headers: { 'content-type': 'application/json' },
      }),
  ) as typeof fetch;
}

/** Stub `fetch` as a hard network failure. */
function stubNetworkError(): void {
  globalThis.fetch = mock.fn(async () => {
    throw new TypeError('network down');
  }) as typeof fetch;
}

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

describe('project sync client', () => {
  it('unwraps the API envelope on success', async () => {
    const summary = {
      id: 'p1',
      name: 'Untitled',
      updatedAt: '2026-07-21T00:00:00.000Z',
      thumbnail: null,
    };
    stubFetch(200, { success: true, message: 'OK', data: summary });

    const result = await createProject(createDocument('Untitled', 'Page 1'));
    assert.equal(result.ok, true);
    assert.deepEqual(result.ok && result.value, summary);
  });

  it('reports a server outage as offline, not as an error', async () => {
    stubFetch(503, { success: false, code: 'PERSISTENCE_UNAVAILABLE', message: 'nope' });

    const result = await saveProject('p1', createDocument('Untitled', 'Page 1'));
    assert.equal(result.ok, false);
    // 'unavailable' is what keeps the editor writing to its local buffer rather
    // than surfacing a hard failure.
    assert.equal(!result.ok && result.reason, 'unavailable');
  });

  it('reports a dropped connection as offline', async () => {
    stubNetworkError();

    const result = await saveProject('p1', createDocument('Untitled', 'Page 1'));
    assert.equal(!result.ok && result.reason, 'unavailable');
  });

  it('distinguishes a deleted project from an outage', async () => {
    stubFetch(404, { success: false, code: 'NOT_FOUND', message: 'gone' });

    const result = await saveProject('p1', createDocument('Untitled', 'Page 1'));
    assert.equal(!result.ok && result.reason, 'not-found');
  });

  it('treats a rejected payload as invalid, not as an outage', async () => {
    stubFetch(400, { success: false, code: 'VALIDATION_ERROR', message: 'bad' });

    const result = await saveProject('p1', createDocument('Untitled', 'Page 1'));
    assert.equal(!result.ok && result.reason, 'invalid');
  });

  it('round-trips a document through the load path', async () => {
    const doc = createDocument('My project', 'Page 1');
    stubFetch(200, {
      success: true,
      data: {
        summary: {
          id: 'p1',
          name: 'My project',
          updatedAt: '2026-07-21T00:00:00.000Z',
          thumbnail: null,
        },
        document: JSON.parse(serializeDocument(doc)),
      },
    });

    const result = await loadProject('p1');
    assert.equal(result.ok, true);
    assert.deepEqual(result.ok && result.value?.document, doc);
  });

  it('refuses a stored document that no longer parses', async () => {
    stubFetch(200, {
      success: true,
      data: {
        summary: {
          id: 'p1',
          name: 'Broken',
          updatedAt: '2026-07-21T00:00:00.000Z',
          thumbnail: null,
        },
        // A page whose root node is missing - what an aborted write or a
        // hand-edited row would look like.
        document: {
          schemaVersion: 1,
          id: 'd1',
          name: 'Broken',
          pages: [{ id: 'pg', name: 'P', rootId: 'missing' }],
          nodes: {},
        },
      },
    });

    const result = await loadProject('p1');
    assert.equal(result.ok, false);
    assert.equal(!result.ok && result.reason, 'invalid');
  });

  it('treats "no projects yet" as success with nothing to open', async () => {
    stubFetch(200, { success: true, data: null });

    const result = await loadLatestProject();
    assert.equal(result.ok, true);
    assert.equal(result.ok && result.value, null);
  });
});
