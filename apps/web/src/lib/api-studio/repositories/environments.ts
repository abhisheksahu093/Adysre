import 'server-only';
import { prisma, notDeleted } from '@adysre/database';
import type { ApiEnvironment, ApiVariable } from '@/modules/api-studio/types';
import { createId } from '@/modules/api-studio/utils/ids';
import { defined, type Patch } from '@/lib/api/patch';
import { toEnvironment } from '../mappers';
import { loadVariables, loadVariablesByOwner, replaceVariables } from './variables';

/**
 * Environments, and the variables they carry.
 *
 * "Default" is a flag on the environment rather than a pointer on the
 * workspace, so at most one may be set: promoting one demotes the rest in the
 * same transaction. Two defaults would make "which environment does this
 * workspace open with" a question with two answers.
 *
 * Secrets are never revealed by default. `reveal` is only ever true when the
 * caller holds `api-studio:secret:read`, which the route checks; this layer
 * simply does what it is told and defaults to masked.
 */

export interface EnvironmentInput {
  workspaceId: string;
  name: string;
  color: string | null;
  isDefault: boolean;
  variables: ApiVariable[];
}

export async function listEnvironments(
  tenantId: string,
  workspaceId: string,
  reveal = false,
): Promise<ApiEnvironment[]> {
  const rows = await prisma.apiEnvironment.findMany({
    where: { tenantId, workspaceId, ...notDeleted },
    orderBy: { name: 'asc' },
  });

  // One query for every environment's variables, not one per environment.
  const variables = await loadVariablesByOwner(
    tenantId,
    workspaceId,
    'environmentId',
    rows.map((row) => row.id),
    reveal,
  );

  return rows.map((row) => toEnvironment(row, variables.get(row.id) ?? []));
}

export async function getEnvironment(
  tenantId: string,
  id: string,
  reveal = false,
): Promise<ApiEnvironment | null> {
  const row = await prisma.apiEnvironment.findFirst({ where: { id, tenantId, ...notDeleted } });
  if (!row) return null;

  const variables = await loadVariables(
    tenantId,
    { scope: 'environment', workspaceId: row.workspaceId, environmentId: row.id },
    reveal,
  );
  return toEnvironment(row, variables);
}

export async function createEnvironment(
  tenantId: string,
  userId: string | null,
  input: EnvironmentInput,
): Promise<ApiEnvironment> {
  const id = createId();

  return prisma.$transaction(async (tx) => {
    if (input.isDefault) {
      await tx.apiEnvironment.updateMany({
        where: { tenantId, workspaceId: input.workspaceId, isDefault: true },
        data: { isDefault: false, updatedBy: userId },
      });
    }

    const row = await tx.apiEnvironment.create({
      data: {
        id,
        tenantId,
        workspaceId: input.workspaceId,
        name: input.name,
        color: input.color,
        isDefault: input.isDefault,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await replaceVariables(tx, {
      tenantId,
      owner: { scope: 'environment', workspaceId: input.workspaceId, environmentId: id },
      userId,
      variables: input.variables,
    });

    // Echo back masked, never the plaintext that was just submitted.
    return toEnvironment(
      row,
      input.variables.map((variable) =>
        variable.secret ? { ...variable, value: '' } : variable,
      ),
    );
  });
}

export async function updateEnvironment(
  tenantId: string,
  userId: string | null,
  id: string,
  patch: Patch<Omit<EnvironmentInput, 'workspaceId'>>,
): Promise<ApiEnvironment | null> {
  const existing = await prisma.apiEnvironment.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { workspaceId: true },
  });
  if (!existing) return null;

  const { variables, ...columns } = patch;

  return prisma.$transaction(async (tx) => {
    if (columns.isDefault) {
      await tx.apiEnvironment.updateMany({
        where: { tenantId, workspaceId: existing.workspaceId, isDefault: true, NOT: { id } },
        data: { isDefault: false, updatedBy: userId },
      });
    }

    const row = await tx.apiEnvironment.update({
      where: { id },
      data: { ...defined(columns), updatedBy: userId },
    });

    if (variables) {
      await replaceVariables(tx, {
        tenantId,
        owner: { scope: 'environment', workspaceId: existing.workspaceId, environmentId: id },
        userId,
        variables,
      });
    }

    const current =
      variables?.map((variable) => (variable.secret ? { ...variable, value: '' } : variable)) ??
      (await loadVariables(tenantId, {
        scope: 'environment',
        workspaceId: existing.workspaceId,
        environmentId: id,
      }));

    return toEnvironment(row, current);
  });
}

export async function softDeleteEnvironment(
  tenantId: string,
  userId: string | null,
  id: string,
): Promise<boolean> {
  const existing = await prisma.apiEnvironment.findFirst({
    where: { id, tenantId, ...notDeleted },
    select: { id: true },
  });
  if (!existing) return false;

  await prisma.apiEnvironment.update({
    where: { id },
    data: { deletedAt: new Date(), isDefault: false, updatedBy: userId },
  });
  return true;
}
