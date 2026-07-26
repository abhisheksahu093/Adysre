'use client';

import { useCallback } from 'react';
import type { ApiTab, VariableLayer } from '../types';
import {
  useCollectionsStore,
  useExecutionStore,
  useHistoryStore,
  useWorkspaceStore,
} from '../stores';
import { prepareRequest } from '../utils/prepare';
import { redactSecrets } from '../utils/redact';
import { createId } from '../utils/ids';
import { pathTo } from '../utils/tree';
import { sendRequest } from '../services/executor';
import { apiStudioClient } from '../services/api-client';

/**
 * Sending a request, end to end.
 *
 * This is the hook the layer rules exist for: it is the only place that reads
 * more than one store, and the only place that turns state into IO. The stores
 * stay ignorant of each other, and `prepareRequest` stays pure.
 *
 * The variable stack is assembled here because only here is it knowable: the
 * outer layers come from the workspace store, the inner ones from the node's
 * ancestors in the tree, and the innermost from the tab's own draft.
 */
export function useSend(): (tab: ApiTab) => Promise<void> {
  return useCallback(async (tab: ApiTab) => {
    const workspaceStore = useWorkspaceStore.getState();
    const collectionsStore = useCollectionsStore.getState();
    const execution = useExecutionStore.getState();

    if (!execution.canSend()) return;

    const workspaceId = workspaceStore.activeWorkspaceId;
    const node = tab.nodeId ? collectionsStore.nodes[tab.nodeId] : undefined;

    // Collection, then every folder on the way down, then the request itself:
    // the inner half of the resolution stack, in specificity order.
    const inner: VariableLayer[] = [];
    let inheritedAuth = undefined;

    if (node) {
      const collection = collectionsStore.collections.find((c) => c.id === node.collectionId);
      if (collection) {
        inner.push({ scope: 'collection', ownerId: collection.id, variables: collection.variables });
        if (collection.auth.type !== 'inherit') inheritedAuth = collection.auth;
      }
      for (const ancestor of pathTo(collectionsStore.nodes, node.id)) {
        if (ancestor.kind !== 'folder' || ancestor.id === node.id) continue;
        inner.push({ scope: 'folder', ownerId: ancestor.id, variables: ancestor.variables });
        if (ancestor.auth.type !== 'inherit') inheritedAuth = ancestor.auth;
      }
    }
    inner.push({ scope: 'request', ownerId: tab.nodeId, variables: tab.draft.variables });

    const prepared = prepareRequest({
      request: tab.draft,
      context: { layers: [...workspaceStore.variableLayers(), ...inner] },
      workspaceId: workspaceId ?? createId(),
      requestNodeId: tab.nodeId,
      ...(inheritedAuth ? { inheritedAuth } : {}),
    });

    if (!prepared.ok) {
      execution.fail(tab.id, {
        code: prepared.code,
        message: prepared.detail,
        cause: null,
      });
      return;
    }

    const controller = new AbortController();
    execution.start(tab.id, controller);

    const started = performance.now();
    const result = await sendRequest(prepared.request, controller.signal);
    const elapsed = Math.round(performance.now() - started);

    // The tab may have been closed mid-flight; recording a response into a tab
    // that is gone would resurrect it in the store.
    useExecutionStore.getState().finish(tab.id, result);

    if (result.ok === false && result.error.code === 'cancelled') return;

    const entry = {
      id: createId(),
      workspaceId: workspaceId ?? '',
      nodeId: tab.nodeId,
      method: tab.draft.method,
      url: prepared.request.url,
      status: result.ok ? result.response.status : null,
      errorCode: result.ok ? null : result.error.code,
      durationMs: result.ok ? Math.round(result.response.timings.total) : elapsed,
      responseBytes: result.ok ? result.response.size.total : 0,
      executedAt: Date.now(),
      favorite: false,
      request: redactSecrets(tab.draft),
    };

    // Local first, so the list updates whether or not the write lands.
    useHistoryStore.getState().add(entry);

    if (workspaceId) {
      void apiStudioClient.recordHistory({
        workspaceId,
        nodeId: tab.nodeId,
        method: entry.method,
        url: entry.url,
        status: entry.status,
        errorCode: entry.errorCode,
        durationMs: entry.durationMs,
        requestBytes: result.ok ? result.response.requestSize.total : 0,
        responseBytes: entry.responseBytes,
        request: entry.request,
      });
    }
  }, []);
}
