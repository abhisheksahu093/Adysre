import 'server-only';
import { prisma, notDeleted } from '@adysre/database';
import type { ApiCollection, ApiVariable, AuthConfig, RequestScripts } from '@/modules/api-studio/types';
import { createId } from '@/modules/api-studio/utils/ids';
import { defined, type Patch } from '@/lib/api/patch';
import { toCollection, toJson } from '../mappers';
import { loadVariables, loadVariablesByOwner, replaceVariables } from './variables';

/**
 * Collections: the root every folder and request hangs from, and the place a
 * whole tree's auth, scripts and variables are set in one go.
 *
 * Deleting one soft-deletes its nodes in the same transaction. The database
 * would cascade a hard delete, but a soft delete is an update, and an update
 * does not cascade: leaving the children live would strand them in a tree with
 * no root, visible to any query that forgot to join upwards.
 */

export interface CollectionInput {
  workspaceId: string;
  name: string;
  description: string;
  color: string | null;
  icon: string | null;
  tags: string[];
  favorite: boolean;
  auth: AuthConfig;
  scripts: RequestScripts;
  variables: ApiVariable[];
}

export async function listCollections(
  tenantId: string,
  workspaceId: string,
  reveal = false,
): Promise<ApiCollection[]> {
  const rows = await prisma.apiCollection.findMany({
    where: { tenantId, workspaceId, ...notDeleted },
    orderBy: { name: 'asc' },
  });

  // One query for every collection's variables, not one per collection.
  const variables = await loadVariablesByOwner(
    tenantId,
    workspaceId,
    'collectionId',
    rows.map((row) => row.id),
    reveal,
  );

  return rows.map((row) => toCollection(row, variables.get(row.id) ?? []));
}

export async function getCollection(
  tenantId: string,
  id: string,
  reveal = false,
): Promise<ApiCollection | null> {
  const row = await prisma.apiCollection.findFirst({ where: { id, tenantId, ...notDeleted } });
  if (!row) return null;

  const variables = await loadVariables(
    tenantId,
    { scope: 'collection', workspaceId: row.workspaceId, collectionId: row.id },
    reveal,
  );
  return toCollection(row, variables);
}

export async function createCollection(
  tenantId: string,
  userId: string | null,
  input: CollectionInput,
): Promise<ApiCollection> {
  const id = createId();

  return prisma.$transaction(async (tx) => {
    const row = await tx.apiCollection.create({
      data: {
        id,
        tenantId,
        workspaceId: input.workspaceId,
        name: input.name,
        description: input.description,
        color: input.color,
        icon: input.icon,
        tags: input.tags,
        favorite: input.favorite,
        auth: toJson(input.auth),
        scripts: toJson(input.scripts),
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await replaceVariables(tx, {
      tenantId,
      owner: { scope: 'collection', workspaceId: input.workspaceId, collectionId: id },
      userId,
      variables: input.variables,
    });

    return toCollection(row, input.variables);
  });
}

export async function updateCollection(
  tenantId: string,
  userId: string | null,
  id: string,
  patch: Patch<Omit<CollectionInput, 'workspaceId'>>,
): Promise<ApiCollection | null> {
  const existing = await prisma.apiCollection.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { workspaceId: true },
  });
  if (!existing) return null;

  const { variables, auth, scripts, ...columns } = patch;

  return prisma.$transaction(async (tx) => {
    const row = await tx.apiCollection.update({
      where: { id },
      data: {
        ...defined(columns),
        ...(auth ? { auth: toJson(auth) } : {}),
        ...(scripts ? { scripts: toJson(scripts) } : {}),
        updatedBy: userId,
      },
    });

    if (variables) {
      await replaceVariables(tx, {
        tenantId,
        owner: { scope: 'collection', workspaceId: existing.workspaceId, collectionId: id },
        userId,
        variables,
      });
    }

    const current =
      variables ??
      (await loadVariables(tenantId, {
        scope: 'collection',
        workspaceId: existing.workspaceId,
        collectionId: id,
      }));

    return toCollection(row, current);
  });
}

export async function softDeleteCollection(
  tenantId: string,
  userId: string | null,
  id: string,
): Promise<boolean> {
  const existing = await prisma.apiCollection.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { id: true },
  });
  if (!existing) return false;

  const deletedAt = new Date();
  await prisma.$transaction([
    prisma.apiCollection.update({ where: { id }, data: { deletedAt, updatedBy: userId } }),
    prisma.apiNode.updateMany({
      where: { collectionId: id, tenantId, ...notDeleted },
      data: { deletedAt, updatedBy: userId },
    }),
  ]);
  return true;
}
