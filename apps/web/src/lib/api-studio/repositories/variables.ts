import 'server-only';
import { prisma, notDeleted, type Prisma } from '@adysre/database';
import type { ApiVariable, VariableScope } from '@/modules/api-studio/types';
import { toVariable } from '../mappers';
import { encryptSecret, isSecretStorageConfigured, SecretStorageError } from '../crypto';

/**
 * Variables, at every layer of the resolution stack.
 *
 * One table holds all five scopes, so a resolver loads the whole stack in a
 * single indexed query instead of five. That is also why this is a repository
 * of its own rather than a corner of each owner's: environments, collections
 * and nodes all own variables and would otherwise each grow a copy of the
 * secret-handling rules, which is exactly the code that must exist once.
 */

export type VariableOwner =
  | { scope: 'global'; workspaceId: string }
  | { scope: 'environment'; workspaceId: string; environmentId: string }
  | { scope: 'collection'; workspaceId: string; collectionId: string }
  | { scope: 'folder' | 'request'; workspaceId: string; nodeId: string };

type Client = Prisma.TransactionClient | typeof prisma;

/** The owner columns for a scope. Mirrors the CHECK constraint in the migration. */
function ownerColumns(owner: VariableOwner): {
  scope: VariableScope;
  environmentId: string | null;
  collectionId: string | null;
  nodeId: string | null;
} {
  switch (owner.scope) {
    case 'environment':
      return { scope: 'environment', environmentId: owner.environmentId, collectionId: null, nodeId: null };
    case 'collection':
      return { scope: 'collection', environmentId: null, collectionId: owner.collectionId, nodeId: null };
    case 'folder':
    case 'request':
      return { scope: owner.scope, environmentId: null, collectionId: null, nodeId: owner.nodeId };
    default:
      return { scope: 'global', environmentId: null, collectionId: null, nodeId: null };
  }
}

/** Read one owner's variables, ordered as the user arranged them. */
export async function loadVariables(
  tenantId: string,
  owner: VariableOwner,
  reveal = false,
): Promise<ApiVariable[]> {
  const columns = ownerColumns(owner);
  const rows = await prisma.apiVariable.findMany({
    where: {
      tenantId,
      workspaceId: owner.workspaceId,
      scope: columns.scope,
      environmentId: columns.environmentId,
      collectionId: columns.collectionId,
      nodeId: columns.nodeId,
      ...notDeleted,
    },
    orderBy: { position: 'asc' },
  });
  return rows.map((row) => toVariable(row, reveal));
}

/**
 * Read variables for many owners at once, grouped by owner id.
 *
 * The list endpoints use this instead of a query per row: a collection with
 * 5,000 nodes would otherwise issue 5,000 queries to render a sidebar.
 */
export async function loadVariablesByOwner(
  tenantId: string,
  workspaceId: string,
  field: 'nodeId' | 'collectionId' | 'environmentId',
  ownerIds: readonly string[],
  reveal = false,
): Promise<Map<string, ApiVariable[]>> {
  const grouped = new Map<string, ApiVariable[]>();
  if (ownerIds.length === 0) return grouped;

  const rows = await prisma.apiVariable.findMany({
    where: { tenantId, workspaceId, [field]: { in: [...ownerIds] }, ...notDeleted },
    orderBy: { position: 'asc' },
  });

  for (const row of rows) {
    const key = row[field];
    if (!key) continue;
    const bucket = grouped.get(key);
    if (bucket) bucket.push(toVariable(row, reveal));
    else grouped.set(key, [toVariable(row, reveal)]);
  }

  return grouped;
}

/**
 * Replace an owner's variables with the submitted set.
 *
 * Replace rather than patch, because the client edits the whole table: rows the
 * client did not send are rows the user deleted. Ids are preserved when they
 * come back, so a variable keeps its identity across an edit.
 *
 * Secrets are encrypted here and their plaintext columns forced to null, which
 * the database also enforces. A secret submitted with no value keeps whatever
 * ciphertext it had: that is how the UI can save an environment it only ever
 * showed a masked field for, without wiping the credential.
 *
 * @throws {SecretStorageError} when a secret is submitted and no key is set.
 */
export async function replaceVariables(
  tx: Client,
  params: {
    tenantId: string;
    owner: VariableOwner;
    userId: string | null;
    variables: readonly ApiVariable[];
  },
): Promise<void> {
  const { tenantId, owner, userId, variables } = params;
  const columns = ownerColumns(owner);

  if (variables.some((variable) => variable.secret) && !isSecretStorageConfigured()) {
    throw new SecretStorageError('Secret storage is not configured; refusing to store a secret.');
  }

  const existing = await tx.apiVariable.findMany({
    where: {
      tenantId,
      workspaceId: owner.workspaceId,
      scope: columns.scope,
      environmentId: columns.environmentId,
      collectionId: columns.collectionId,
      nodeId: columns.nodeId,
    },
    select: { id: true, valueCipher: true },
  });
  const previous = new Map(existing.map((row) => [row.id, row.valueCipher]));
  const submitted = new Set(variables.map((variable) => variable.id));

  const removed = existing.filter((row) => !submitted.has(row.id)).map((row) => row.id);
  if (removed.length > 0) {
    await tx.apiVariable.deleteMany({ where: { id: { in: removed }, tenantId } });
  }

  for (const [index, variable] of variables.entries()) {
    // An unchanged secret arrives masked (empty value); keep its ciphertext
    // rather than encrypting the empty string over a live credential.
    const cipher = variable.secret
      ? variable.value === ''
        ? (previous.get(variable.id) ?? encryptSecret(''))
        : encryptSecret(variable.value)
      : null;

    const data = {
      tenantId,
      workspaceId: owner.workspaceId,
      ...columns,
      key: variable.key,
      value: variable.secret ? null : variable.value,
      valueCipher: cipher,
      initialValue: variable.secret ? null : variable.initialValue,
      secret: variable.secret,
      enabled: variable.enabled,
      description: variable.description,
      position: index,
      updatedBy: userId,
    };

    await tx.apiVariable.upsert({
      where: { id: variable.id },
      create: { id: variable.id, createdBy: userId, ...data },
      update: data,
    });
  }
}
