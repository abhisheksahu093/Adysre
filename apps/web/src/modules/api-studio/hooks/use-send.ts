'use client';

import { useCallback } from 'react';
import type { ApiTab, ScriptContext, ScriptOutcome, TestRunResult, VariableLayer } from '../types';
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
import { runScriptSandboxed } from '../services/script-sandbox';
import { runAssertions } from '../utils/assertions';

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
export interface SendOutput {
  /** Structured assertions, evaluated against the response. */
  tests: TestRunResult | null;
  /** What the pre-request and test scripts produced, in that order. */
  scripts: { phase: 'preRequest' | 'test'; outcome: ScriptOutcome }[];
}

export function useSend(): (tab: ApiTab) => Promise<SendOutput> {
  return useCallback(async (tab: ApiTab): Promise<SendOutput> => {
    const workspaceStore = useWorkspaceStore.getState();
    const collectionsStore = useCollectionsStore.getState();
    const execution = useExecutionStore.getState();
    const output: SendOutput = { tests: null, scripts: [] };

    if (!execution.canSend()) return output;

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

    let layers = [...workspaceStore.variableLayers(), ...inner];

    // The pre-request script runs BEFORE resolution, because setting a variable
    // is the main thing it exists to do and a value set after resolution would
    // not reach the request it was set for.
    if (tab.draft.scripts.preRequest.trim() !== '') {
      const outcome = await runScriptSandboxed(
        tab.draft.scripts.preRequest,
        scriptContext(tab, layers),
      );
      output.scripts.push({ phase: 'preRequest', outcome });
      layers = applyScriptVariables(layers, outcome);
    }

    const prepared = prepareRequest({
      request: tab.draft,
      context: { layers },
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
      return output;
    }

    const controller = new AbortController();
    execution.start(tab.id, controller);

    const started = performance.now();
    const result = await sendRequest(prepared.request, controller.signal);
    const elapsed = Math.round(performance.now() - started);

    // The tab may have been closed mid-flight; recording a response into a tab
    // that is gone would resurrect it in the store.
    useExecutionStore.getState().finish(tab.id, result);

    if (result.ok === false && result.error.code === 'cancelled') return output;

    // Assertions and the test script both look at the response, so they run
    // after it arrives and before history is recorded.
    if (result.ok) {
      if (tab.assertions.length > 0) {
        output.tests = runAssertions(tab.assertions, result.response, prepared.request.id);
      }

      if (tab.draft.scripts.test.trim() !== '') {
        output.scripts.push({
          phase: 'test',
          outcome: await runScriptSandboxed(
            tab.draft.scripts.test,
            scriptContext(tab, layers, {
              status: result.response.status,
              statusText: result.response.statusText,
              responseTime: Math.round(result.response.timings.total),
              headers: result.response.headers,
              body: result.response.body,
            }),
          ),
        });
      }

      // A script that set a variable meant it to stick: write it into the
      // active environment so the next request sees it.
      for (const entry of output.scripts) {
        persistScriptVariables(entry.outcome);
      }
    }

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

    return output;
  }, []);
}

/** Flatten the layer stack into the plain map a script sees. */
function scriptContext(
  tab: ApiTab,
  layers: readonly VariableLayer[],
  response?: ScriptContext['response'],
): ScriptContext {
  const variables: Record<string, string> = {};
  for (const layer of layers) {
    for (const variable of layer.variables) {
      if (variable.enabled) variables[variable.key] = variable.value;
    }
  }

  return {
    request: {
      method: tab.draft.method,
      url: tab.draft.url,
      headers: tab.draft.headers
        .filter((header) => header.enabled)
        .map((header) => ({ name: header.key, value: header.value })),
      body: tab.draft.body.type === 'raw' ? tab.draft.body.content : '',
    },
    ...(response ? { response } : {}),
    variables,
  };
}

/** Fold a script's variable changes into the stack, as the most specific layer. */
function applyScriptVariables(
  layers: readonly VariableLayer[],
  outcome: ScriptOutcome,
): VariableLayer[] {
  const entries = Object.entries(outcome.setVariables);
  if (entries.length === 0 && outcome.unsetVariables.length === 0) return [...layers];

  const removed = new Set(outcome.unsetVariables);
  const pruned = layers.map((layer) => ({
    ...layer,
    variables: layer.variables.filter((variable) => !removed.has(variable.key)),
  }));

  return [
    ...pruned,
    {
      scope: 'request',
      ownerId: null,
      variables: entries.map(([key, value]) => ({
        id: createId(),
        key,
        value,
        initialValue: '',
        secret: false,
        enabled: true,
        description: '',
      })),
    },
  ];
}

/** Write a script's variable changes into the active environment. */
function persistScriptVariables(outcome: ScriptOutcome): void {
  const store = useWorkspaceStore.getState();
  const environment = store.activeEnvironment();
  if (!environment) return;

  for (const [key, value] of Object.entries(outcome.setVariables)) {
    const existing = environment.variables.find((variable) => variable.key === key);
    store.upsertVariable(environment.id, {
      id: existing?.id ?? createId(),
      key,
      value,
      initialValue: existing?.initialValue ?? '',
      secret: existing?.secret ?? false,
      enabled: true,
      description: existing?.description ?? '',
    });
  }

  for (const key of outcome.unsetVariables) {
    const existing = environment.variables.find((variable) => variable.key === key);
    if (existing) store.removeVariable(environment.id, existing.id);
  }
}
