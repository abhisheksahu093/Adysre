'use client';

import type {
  ApiCollection,
  ApiEnvironment,
  ApiNode,
  ApiRequestNode,
  ApiWorkspace,
  HistoryEntry,
  RequestDefinition,
} from '../types';

/**
 * The client for the module's own API.
 *
 * Every call returns `{ ok, data }` or `{ ok: false, code, message }` rather
 * than throwing, because in this module a failed save is a state the UI has to
 * render (a banner, a retry) and not an exception to escape with. The envelope
 * from `documents/API_STANDARDS.md` is unwrapped exactly once, here, so no
 * component ever reaches into `response.data.data`.
 */

const BASE = '/api/api-studio';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

interface Envelope<T> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
}

async function call<T>(
  path: string,
  init?: RequestInit & { body?: string },
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`${BASE}${path}`, {
      ...init,
      ...(init?.body ? { headers: { 'Content-Type': 'application/json' } } : {}),
    });

    const envelope = (await response.json()) as Envelope<T>;
    if (response.ok && envelope.success && envelope.data !== undefined) {
      return { ok: true, data: envelope.data };
    }
    return {
      ok: false,
      code: envelope.code ?? String(response.status),
      message: envelope.message ?? `Request failed (${response.status}).`,
    };
  } catch {
    // Offline, or the app itself is unreachable. Named so the UI can say
    // "you are offline" rather than "something went wrong".
    return { ok: false, code: 'OFFLINE', message: 'Could not reach the server.' };
  }
}

const json = (body: unknown): { method: string; body: string } => ({
  method: 'POST',
  body: JSON.stringify(body),
});

const patch = (body: unknown): { method: string; body: string } => ({
  method: 'PATCH',
  body: JSON.stringify(body),
});

export const apiStudioClient = {
  listWorkspaces: () => call<ApiWorkspace[]>('/workspaces'),

  createWorkspace: (input: { name: string; description?: string }) =>
    call<ApiWorkspace>('/workspaces', json(input)),

  listCollections: (workspaceId: string) =>
    call<ApiCollection[]>(`/collections?workspaceId=${encodeURIComponent(workspaceId)}`),

  createCollection: (input: { workspaceId: string; name: string }) =>
    call<ApiCollection>('/collections', json(input)),

  deleteCollection: (id: string) => call<{ id: string }>(`/collections/${id}`, { method: 'DELETE' }),

  listNodes: (collectionId: string) =>
    call<ApiNode[]>(`/nodes?collectionId=${encodeURIComponent(collectionId)}`),

  createNode: (
    input:
      | {
          workspaceId: string;
          collectionId: string;
          parentId: string | null;
          kind: 'request';
          name: string;
          request: RequestDefinition;
        }
      | {
          workspaceId: string;
          collectionId: string;
          parentId: string | null;
          kind: 'folder';
          name: string;
        },
  ) => call<ApiNode>('/nodes', json(input)),

  updateNode: (id: string, body: { name?: string; request?: RequestDefinition; favorite?: boolean }) =>
    call<ApiNode>(`/nodes/${id}`, patch(body)),

  deleteNode: (id: string) => call<{ id: string }>(`/nodes/${id}`, { method: 'DELETE' }),

  moveNode: (id: string, body: { parentId: string | null; index: number }) =>
    call<ApiNode>(`/nodes/${id}/move`, json(body)),

  duplicateNode: (id: string, name?: string) =>
    call<ApiRequestNode | ApiNode>(`/nodes/${id}/duplicate`, json(name ? { name } : {})),

  listEnvironments: (workspaceId: string) =>
    call<ApiEnvironment[]>(`/environments?workspaceId=${encodeURIComponent(workspaceId)}`),

  createEnvironment: (input: { workspaceId: string; name: string }) =>
    call<ApiEnvironment>('/environments', json(input)),

  updateEnvironment: (
    id: string,
    body: { name?: string; isDefault?: boolean; variables?: ApiEnvironment['variables'] },
  ) => call<ApiEnvironment>(`/environments/${id}`, patch(body)),

  deleteEnvironment: (id: string) =>
    call<{ id: string }>(`/environments/${id}`, { method: 'DELETE' }),

  listHistory: (workspaceId: string) =>
    call<HistoryEntry[]>(`/history?workspaceId=${encodeURIComponent(workspaceId)}&pageSize=100`),

  recordHistory: (input: {
    workspaceId: string;
    nodeId: string | null;
    method: string;
    url: string;
    status: number | null;
    errorCode: string | null;
    durationMs: number;
    requestBytes: number;
    responseBytes: number;
    request: RequestDefinition;
  }) => call<HistoryEntry>('/history', json(input)),

  clearHistory: (workspaceId: string) =>
    call<{ removed: number }>('/history', {
      method: 'DELETE',
      body: JSON.stringify({ workspaceId, includeFavorites: false }),
    }),
};
