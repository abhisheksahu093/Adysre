import 'server-only';
import { prisma, notDeleted, type Prisma } from '@adysre/database';
import type {
  ApiNode,
  ApiVariable,
  AuthConfig,
  NodeColor,
  RequestDefinition,
  RequestScripts,
} from '@/modules/api-studio/types';
import { MAX_REQUEST_VERSIONS } from '@/modules/api-studio/constants/limits';
import { requestDefinitionSchema } from '@/modules/api-studio/schemas';
import { createId } from '@/modules/api-studio/utils/ids';
import {
  canMove,
  childrenOf,
  descendantIds,
  nextPosition,
  positionBetween,
  renumber,
  type NodeMap,
} from '@/modules/api-studio/utils/tree';
import { defined, type Patch } from '@/lib/api/patch';
import { denormalize, toJson, toNode } from '../mappers';
import { loadVariablesByOwner, replaceVariables } from './variables';

/**
 * The request tree.
 *
 * Structural rules (what may move where, what position a node lands on) come
 * from `modules/api-studio/utils/tree`, the same pure helpers the client store
 * uses. One implementation means the server cannot accept a move the client
 * would have refused, or place a node somewhere the client would order
 * differently: the two agree because they are the same code.
 *
 * Moves, deletes and duplicates all need to see the collection's shape, so they
 * load its nodes once and work in memory rather than issuing a query per level.
 */

export interface NodeInput {
  workspaceId: string;
  collectionId: string;
  parentId: string | null;
  kind: 'folder' | 'request';
  name: string;
  description: string;
  tags: string[];
  color: NodeColor | null;
  icon: string | null;
  favorite: boolean;
  /** Requests only. */
  request?: RequestDefinition;
  /** Folders only. */
  auth?: AuthConfig;
  scripts?: RequestScripts;
  variables?: ApiVariable[];
}

type Client = Prisma.TransactionClient | typeof prisma;

/** Every live node of a collection, as the flat map the tree helpers expect. */
async function loadMap(
  client: Client,
  tenantId: string,
  collectionId: string,
): Promise<{ map: NodeMap; workspaceId: string | null }> {
  const rows = await client.apiNode.findMany({
    where: { tenantId, collectionId, ...notDeleted },
  });
  const map: Record<string, ApiNode> = {};
  for (const row of rows) map[row.id] = toNode(row);
  return { map, workspaceId: rows[0]?.workspaceId ?? null };
}

export async function listNodes(
  tenantId: string,
  collectionId: string,
  reveal = false,
): Promise<ApiNode[]> {
  const rows = await prisma.apiNode.findMany({
    where: { tenantId, collectionId, ...notDeleted },
    orderBy: [{ parentId: 'asc' }, { position: 'asc' }],
  });
  if (rows.length === 0) return [];

  // Folder variables in one query rather than one per folder.
  const folderIds = rows.filter((row) => row.kind === 'folder').map((row) => row.id);
  const variables = await loadVariablesByOwner(
    tenantId,
    rows[0]!.workspaceId,
    'nodeId',
    folderIds,
    reveal,
  );

  return rows.map((row) => toNode(row, variables.get(row.id) ?? []));
}

export async function getNode(tenantId: string, id: string): Promise<ApiNode | null> {
  const row = await prisma.apiNode.findFirst({ where: { id, tenantId, ...notDeleted } });
  return row ? toNode(row) : null;
}

export async function createNode(
  tenantId: string,
  userId: string | null,
  input: NodeInput,
): Promise<ApiNode> {
  const id = createId();

  return prisma.$transaction(async (tx) => {
    const { map } = await loadMap(tx, tenantId, input.collectionId);
    const siblings = childrenOf(map, input.collectionId, input.parentId);

    const isRequest = input.kind === 'request';
    const request = isRequest ? requestDefinitionSchema.parse(input.request ?? {}) : null;

    const row = await tx.apiNode.create({
      data: {
        id,
        tenantId,
        workspaceId: input.workspaceId,
        collectionId: input.collectionId,
        parentId: input.parentId,
        kind: input.kind,
        name: input.name,
        position: nextPosition(siblings),
        description: input.description,
        tags: input.tags,
        color: input.color,
        icon: input.icon,
        favorite: input.favorite,
        // The CHECK constraint in the migration enforces this same split; the
        // mapper is what keeps the denormalised columns honest.
        ...(request
          ? { request: toJson(request), ...denormalize(request) }
          : {
              auth: toJson(input.auth ?? { type: 'inherit' }),
              scripts: toJson(input.scripts ?? { preRequest: '', test: '' }),
            }),
        createdBy: userId,
        updatedBy: userId,
      },
    });

    if (!isRequest && input.variables) {
      await replaceVariables(tx, {
        tenantId,
        owner: { scope: 'folder', workspaceId: input.workspaceId, nodeId: id },
        userId,
        variables: input.variables,
      });
    }

    return toNode(row, input.variables ?? []);
  });
}

/**
 * Update a node.
 *
 * Saving a request snapshots the PREVIOUS definition into
 * `api_studio_request_versions` and bumps `version`, so "restore the version
 * before I broke it" is always possible. Snapshots are capped; the oldest go
 * first, because the useful ones are the recent ones.
 */
export async function updateNode(
  tenantId: string,
  userId: string | null,
  id: string,
  patch: Patch<Omit<NodeInput, 'workspaceId' | 'collectionId' | 'kind' | 'parentId'>>,
): Promise<ApiNode | null> {
  const existing = await prisma.apiNode.findFirst({ where: { id, tenantId, ...notDeleted } });
  if (!existing) return null;

  const { request, variables, auth, scripts, ...columns } = patch;

  return prisma.$transaction(async (tx) => {
    if (request && existing.kind === 'request') {
      await tx.apiRequestVersion.create({
        data: {
          id: createId(),
          tenantId,
          nodeId: id,
          version: existing.version,
          request: toJson(existing.request),
          createdBy: userId,
        },
      });

      const stale = await tx.apiRequestVersion.findMany({
        where: { tenantId, nodeId: id },
        orderBy: { version: 'desc' },
        skip: MAX_REQUEST_VERSIONS,
        select: { id: true },
      });
      if (stale.length > 0) {
        await tx.apiRequestVersion.deleteMany({ where: { id: { in: stale.map((r) => r.id) } } });
      }
    }

    const row = await tx.apiNode.update({
      where: { id },
      data: {
        ...defined(columns),
        ...(request && existing.kind === 'request'
          ? { request: toJson(request), ...denormalize(request), version: existing.version + 1 }
          : {}),
        ...(auth ? { auth: toJson(auth) } : {}),
        ...(scripts ? { scripts: toJson(scripts) } : {}),
        updatedBy: userId,
      },
    });

    if (variables && existing.kind === 'folder') {
      await replaceVariables(tx, {
        tenantId,
        owner: { scope: 'folder', workspaceId: existing.workspaceId, nodeId: id },
        userId,
        variables,
      });
    }

    return toNode(row, variables ?? []);
  });
}

/** Soft-delete a node and every node under it, in one statement each. */
export async function softDeleteNode(
  tenantId: string,
  userId: string | null,
  id: string,
): Promise<boolean> {
  const existing = await prisma.apiNode.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { collectionId: true },
  });
  if (!existing) return false;

  const { map } = await loadMap(prisma, tenantId, existing.collectionId);
  const ids = [id, ...descendantIds(map, id)];

  await prisma.apiNode.updateMany({
    where: { id: { in: ids }, tenantId },
    data: { deletedAt: new Date(), updatedBy: userId },
  });
  return true;
}

export type MoveOutcome =
  | { ok: true; node: ApiNode }
  | { ok: false; reason: 'not_found' | 'invalid_parent' };

/**
 * Move a node under `parentId`, landing at `index` among its siblings.
 *
 * Refuses a move into itself, into its own descendant, or into a request, all
 * of which would corrupt the tree. When the gap between two siblings has closed
 * the whole sibling list is renumbered first, in the same transaction.
 */
export async function moveNode(
  tenantId: string,
  userId: string | null,
  id: string,
  parentId: string | null,
  index: number,
): Promise<MoveOutcome> {
  const existing = await prisma.apiNode.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { collectionId: true },
  });
  if (!existing) return { ok: false, reason: 'not_found' };

  return prisma.$transaction(async (tx) => {
    const { map } = await loadMap(tx, tenantId, existing.collectionId);
    if (!map[id]) return { ok: false, reason: 'not_found' as const };
    if (!canMove(map, id, parentId)) return { ok: false, reason: 'invalid_parent' as const };

    let siblings = childrenOf(map, existing.collectionId, parentId).filter((n) => n.id !== id);
    const clamped = Math.max(0, Math.min(index, siblings.length));
    let position = positionBetween(
      clamped === 0 ? null : (siblings[clamped - 1] ?? null),
      siblings[clamped] ?? null,
    );

    if (position === null) {
      const spread = renumber(siblings);
      for (const entry of spread) {
        await tx.apiNode.update({
          where: { id: entry.id },
          data: { position: entry.position },
        });
        const node = map[entry.id];
        if (node) node.position = entry.position;
      }
      siblings = childrenOf(map, existing.collectionId, parentId).filter((n) => n.id !== id);
      position = positionBetween(
        clamped === 0 ? null : (siblings[clamped - 1] ?? null),
        siblings[clamped] ?? null,
      );
    }

    const row = await tx.apiNode.update({
      where: { id },
      data: { parentId, position: position ?? nextPosition(siblings), updatedBy: userId },
    });
    return { ok: true as const, node: toNode(row) };
  });
}

/**
 * Copy a node and its subtree.
 *
 * New ids throughout, and parent links rewritten to point at the copies, so the
 * duplicate is a peer of the original rather than an alias sharing its
 * children. Variables are copied too, since a folder's variables are part of
 * what it is.
 *
 * @param rename - names the copy. The server never invents display text either;
 * the caller supplies a translated label.
 */
export async function duplicateNode(
  tenantId: string,
  userId: string | null,
  id: string,
  rename?: (name: string) => string,
): Promise<ApiNode | null> {
  const existing = await prisma.apiNode.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { collectionId: true, workspaceId: true },
  });
  if (!existing) return null;

  return prisma.$transaction(async (tx) => {
    const { map } = await loadMap(tx, tenantId, existing.collectionId);
    const source = map[id];
    if (!source) return null;

    const idMap = new Map<string, string>([[id, createId()]]);
    for (const descendant of descendantIds(map, id)) idMap.set(descendant, createId());

    const siblings = childrenOf(map, existing.collectionId, source.parentId);

    for (const [oldId, newId] of idMap) {
      const original = map[oldId];
      if (!original) continue;
      const isRoot = oldId === id;

      await tx.apiNode.create({
        data: {
          id: newId,
          tenantId,
          workspaceId: existing.workspaceId,
          collectionId: existing.collectionId,
          parentId: isRoot
            ? original.parentId
            : (idMap.get(original.parentId ?? '') ?? original.parentId),
          kind: original.kind,
          name: isRoot && rename ? rename(original.name) : original.name,
          position: isRoot ? nextPosition(siblings) : original.position,
          description: original.description,
          tags: original.tags,
          color: original.color,
          icon: original.icon,
          favorite: original.favorite,
          ...(original.kind === 'request'
            ? { request: toJson(original.request), ...denormalize(original.request), version: 1 }
            : { auth: toJson(original.auth), scripts: toJson(original.scripts) }),
          createdBy: userId,
          updatedBy: userId,
        },
      });

      if (original.kind === 'folder' && original.variables.length > 0) {
        await replaceVariables(tx, {
          tenantId,
          owner: { scope: 'folder', workspaceId: existing.workspaceId, nodeId: newId },
          userId,
          // New ids: a copied variable is a new row, not a second owner of one.
          variables: original.variables.map((variable) => ({ ...variable, id: createId() })),
        });
      }
    }

    const created = await tx.apiNode.findFirst({ where: { id: idMap.get(id)!, tenantId } });
    return created ? toNode(created) : null;
  });
}
