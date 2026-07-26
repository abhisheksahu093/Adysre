import 'server-only';
import { prisma, notDeleted } from '@adysre/database';
import type { ApiWorkspace } from '@/modules/api-studio/types';
import { createId } from '@/modules/api-studio/utils/ids';
import { defined, type Patch } from '@/lib/api/patch';
import { toWorkspace } from '../mappers';

/**
 * Workspaces. Every query is scoped by `tenantId`, which comes from the
 * verified session and never from the request body, so there is no code path
 * that can be pointed at another tenant's rows.
 *
 * The workspace's active environment is not a column: it is derived from the
 * environment flagged `isDefault`, so deleting an environment cannot leave a
 * dangling pointer behind (documents/API_STUDIO.md).
 */

export interface WorkspaceInput {
  name: string;
  slug: string;
  description: string;
}

/** The default environment's id for each workspace, in one query. */
async function defaultEnvironments(
  tenantId: string,
  workspaceIds: readonly string[],
): Promise<Map<string, string>> {
  if (workspaceIds.length === 0) return new Map();
  const rows = await prisma.apiEnvironment.findMany({
    where: { tenantId, workspaceId: { in: [...workspaceIds] }, isDefault: true, ...notDeleted },
    select: { id: true, workspaceId: true },
  });
  return new Map(rows.map((row) => [row.workspaceId, row.id]));
}

export async function listWorkspaces(tenantId: string): Promise<ApiWorkspace[]> {
  const rows = await prisma.apiWorkspace.findMany({
    where: { tenantId, ...notDeleted },
    orderBy: { updatedAt: 'desc' },
  });
  const defaults = await defaultEnvironments(tenantId, rows.map((row) => row.id));
  return rows.map((row) => toWorkspace(row, defaults.get(row.id) ?? null));
}

export async function getWorkspace(tenantId: string, id: string): Promise<ApiWorkspace | null> {
  const row = await prisma.apiWorkspace.findFirst({ where: { id, tenantId, ...notDeleted } });
  if (!row) return null;
  const defaults = await defaultEnvironments(tenantId, [row.id]);
  return toWorkspace(row, defaults.get(row.id) ?? null);
}

export async function createWorkspace(
  tenantId: string,
  userId: string | null,
  input: WorkspaceInput,
): Promise<ApiWorkspace> {
  const row = await prisma.apiWorkspace.create({
    data: {
      // Ids are generated here, not by the database: they are UUIDv7, so they
      // sort by creation time and index without fragmenting.
      id: createId(),
      tenantId,
      name: input.name,
      slug: input.slug,
      description: input.description,
      createdBy: userId,
      updatedBy: userId,
    },
  });
  return toWorkspace(row);
}

export async function updateWorkspace(
  tenantId: string,
  userId: string | null,
  id: string,
  patch: Patch<WorkspaceInput>,
): Promise<ApiWorkspace | null> {
  const existing = await prisma.apiWorkspace.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { id: true },
  });
  if (!existing) return null;

  const row = await prisma.apiWorkspace.update({
    where: { id },
    data: { ...defined(patch), updatedBy: userId },
  });
  const defaults = await defaultEnvironments(tenantId, [row.id]);
  return toWorkspace(row, defaults.get(row.id) ?? null);
}

/**
 * Soft-delete a workspace.
 *
 * The slug is suffixed on the way out so the name is immediately reusable: a
 * deleted workspace holding "staging" hostage until someone purges the row is
 * the kind of thing that makes people name things "staging2".
 */
export async function softDeleteWorkspace(
  tenantId: string,
  userId: string | null,
  id: string,
): Promise<boolean> {
  const existing = await prisma.apiWorkspace.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { slug: true },
  });
  if (!existing) return false;

  await prisma.apiWorkspace.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      updatedBy: userId,
      slug: `${existing.slug}-deleted-${id.slice(0, 8)}`.slice(0, 63),
    },
  });
  return true;
}
