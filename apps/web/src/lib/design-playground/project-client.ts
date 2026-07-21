/**
 * Design Playground - the browser's view of project storage.
 *
 * One place that knows the wire format, so the store deals in documents and
 * outcomes rather than URLs and envelopes. Every call resolves to a result
 * object instead of throwing: a save failing because the server is down is an
 * expected state the editor must survive, not an exception.
 */

import { parseDocument } from './schema';
import type { Document } from './types';

export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  thumbnail: string | null;
}

/** Why a call did not succeed, in terms the UI can act on. */
export type SyncFailure = 'unavailable' | 'not-found' | 'invalid';

export type SyncResult<T> = { ok: true; value: T } | { ok: false; reason: SyncFailure };

const BASE = '/api/design-playground/projects';

async function request<T>(url: string, init?: RequestInit): Promise<SyncResult<T>> {
  try {
    const response = await fetch(url, {
      ...init,
      // Only set the header when there is a body: an explicit `undefined` is
      // rejected under `exactOptionalPropertyTypes`.
      ...(init?.body ? { headers: { 'content-type': 'application/json' } } : {}),
    });

    if (response.status === 404) return { ok: false, reason: 'not-found' };
    if (!response.ok) {
      // 4xx that is not a 404 means we sent something the server rejected;
      // anything else means storage is unreachable. The editor treats those
      // differently - one is a bug, the other is a network condition.
      return { ok: false, reason: response.status < 500 ? 'invalid' : 'unavailable' };
    }

    const body = (await response.json()) as { data: T };
    return { ok: true, value: body.data };
  } catch {
    return { ok: false, reason: 'unavailable' };
  }
}

export function listProjects(): Promise<SyncResult<ProjectSummary[]>> {
  return request<ProjectSummary[]>(BASE);
}

/** Parse a `{ summary, document }` payload, rejecting a document that is stale. */
function toProject(
  value: { summary: ProjectSummary; document: unknown } | null,
): SyncResult<{ summary: ProjectSummary; document: Document } | null> {
  if (value === null) return { ok: true, value: null };
  const document = parseDocument(value.document);
  // The server validates too; re-validating here means a client that is newer
  // (or older) than the server never renders a document it cannot represent.
  return document ? { ok: true, value: { summary: value.summary, document } } : { ok: false, reason: 'invalid' };
}

export async function loadLatestProject(): Promise<
  SyncResult<{ summary: ProjectSummary; document: Document } | null>
> {
  const result = await request<{ summary: ProjectSummary; document: unknown } | null>(
    `${BASE}?latest=1`,
  );
  return result.ok ? toProject(result.value) : result;
}

export async function loadProject(
  id: string,
): Promise<SyncResult<{ summary: ProjectSummary; document: Document } | null>> {
  const result = await request<{ summary: ProjectSummary; document: unknown }>(`${BASE}/${id}`);
  return result.ok ? toProject(result.value) : result;
}

export function createProject(
  document: Document,
  name?: string,
): Promise<SyncResult<ProjectSummary>> {
  return request<ProjectSummary>(BASE, {
    method: 'POST',
    body: JSON.stringify({ document, name }),
  });
}

export function saveProject(
  id: string,
  document: Document,
  name?: string,
): Promise<SyncResult<{ id: string; savedAt: string }>> {
  return request<{ id: string; savedAt: string }>(`${BASE}/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ document, name }),
  });
}

export function deleteProject(id: string): Promise<SyncResult<{ id: string }>> {
  return request<{ id: string }>(`${BASE}/${id}`, { method: 'DELETE' });
}
