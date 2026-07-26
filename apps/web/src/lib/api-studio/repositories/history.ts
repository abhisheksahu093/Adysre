import 'server-only';
import { prisma, type Prisma } from '@adysre/database';
import type { HistoryEntry, HttpMethod, RequestDefinition } from '@/modules/api-studio/types';
import { DEFAULT_HISTORY_LIMIT } from '@/modules/api-studio/constants/limits';
import { createId } from '@/modules/api-studio/utils/ids';
import { redactSecrets } from '@/modules/api-studio/utils/redact';
import { toHistoryEntry, toJson } from '../mappers';

/**
 * Request history.
 *
 * Hard deletes, on purpose: "clear history" has to mean gone. The record that
 * must survive a clear is the audit log, which is a different table with a
 * different lifetime and different permissions.
 *
 * Stored requests are REDACTED before they get here (see `redactSecrets`): a
 * log that replays a request must not become a place credentials accumulate.
 */

export interface HistoryFilter {
  workspaceId: string;
  query?: string | undefined;
  method?: HttpMethod | undefined;
  outcome?: 'success' | 'error' | undefined;
  favoritesOnly?: boolean | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

export interface HistoryInput {
  workspaceId: string;
  nodeId: string | null;
  method: HttpMethod;
  url: string;
  status: number | null;
  errorCode: string | null;
  durationMs: number;
  requestBytes: number;
  responseBytes: number;
  request: RequestDefinition;
}

export async function listHistory(
  tenantId: string,
  filter: HistoryFilter,
): Promise<{ entries: HistoryEntry[]; total: number; page: number; pageSize: number }> {
  const page = Math.max(1, filter.page ?? 1);
  const pageSize = Math.max(1, Math.min(filter.pageSize ?? 50, DEFAULT_HISTORY_LIMIT));

  const where: Prisma.ApiHistoryEntryWhereInput = {
    tenantId,
    workspaceId: filter.workspaceId,
    ...(filter.method ? { method: filter.method } : {}),
    ...(filter.favoritesOnly ? { favorite: true } : {}),
    ...(filter.outcome === 'success' ? { status: { not: null } } : {}),
    ...(filter.outcome === 'error' ? { status: null } : {}),
    ...(filter.query ? { url: { contains: filter.query, mode: 'insensitive' } } : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.apiHistoryEntry.findMany({
      where,
      orderBy: { executedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.apiHistoryEntry.count({ where }),
  ]);

  return { entries: rows.map(toHistoryEntry), total, page, pageSize };
}

export async function recordHistory(
  tenantId: string,
  userId: string | null,
  input: HistoryInput,
): Promise<HistoryEntry> {
  const row = await prisma.apiHistoryEntry.create({
    data: {
      id: createId(),
      tenantId,
      workspaceId: input.workspaceId,
      nodeId: input.nodeId,
      method: input.method,
      url: input.url,
      status: input.status,
      errorCode: input.errorCode,
      durationMs: input.durationMs,
      requestBytes: input.requestBytes,
      responseBytes: input.responseBytes,
      request: toJson(redactSecrets(input.request)),
      createdBy: userId,
    },
  });
  return toHistoryEntry(row);
}

export async function setHistoryFavorite(
  tenantId: string,
  id: string,
  favorite: boolean,
): Promise<HistoryEntry | null> {
  const existing = await prisma.apiHistoryEntry.findFirst({
    where: { id, tenantId },
    select: { id: true },
  });
  if (!existing) return null;

  const row = await prisma.apiHistoryEntry.update({ where: { id }, data: { favorite } });
  return toHistoryEntry(row);
}

/**
 * Clear a workspace's history.
 *
 * Favourites survive unless explicitly included: a starred call is one someone
 * kept on purpose, and "clear" should not be a trap for it.
 *
 * @returns how many rows were removed.
 */
export async function clearHistory(
  tenantId: string,
  workspaceId: string,
  includeFavorites = false,
): Promise<number> {
  const result = await prisma.apiHistoryEntry.deleteMany({
    where: { tenantId, workspaceId, ...(includeFavorites ? {} : { favorite: false }) },
  });
  return result.count;
}
