import 'server-only';

import { Prisma, prisma, tenantScope } from '@adysre/database';
import { parseDocument } from './schema';
import type { Document } from './types';

/**
 * Design Playground - project persistence.
 *
 * The only place Prisma is touched for design projects
 * (`documents/BACKEND_ARCHITECTURE.md`: controller → service → repository →
 * database). Route handlers call these functions; nothing else imports Prisma.
 *
 * Every query is tenant-scoped through `tenantScope`, which also excludes
 * soft-deleted rows - a query without it would be a cross-tenant leak, so there
 * is deliberately no unscoped read here to reach for.
 */

/**
 * A `Document` is a plain JSON-safe object, but Prisma's `InputJsonValue` wants
 * an index signature that a precise interface does not carry. Serialising
 * through the same path the client uses keeps the stored blob byte-identical to
 * what `parseDocument` will read back.
 */
function toJson(document: Document): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(document)) as Prisma.InputJsonValue;
}

/** A row as the list view needs it - without the document blob. */
export interface ProjectSummary {
  id: string;
  name: string;
  updatedAt: string;
  thumbnail: string | null;
}

const SUMMARY_SELECT = {
  id: true,
  name: true,
  updatedAt: true,
  thumbnail: true,
} as const;

function toSummary(row: {
  id: string;
  name: string;
  updatedAt: Date;
  thumbnail: string | null;
}): ProjectSummary {
  return {
    id: row.id,
    name: row.name,
    updatedAt: row.updatedAt.toISOString(),
    thumbnail: row.thumbnail,
  };
}

/** Live projects for a tenant, newest first. */
export async function listProjects(tenantId: string, limit = 50): Promise<ProjectSummary[]> {
  const rows = await prisma.designProject.findMany({
    where: tenantScope(tenantId),
    orderBy: { updatedAt: 'desc' },
    take: limit,
    select: SUMMARY_SELECT,
  });
  return rows.map(toSummary);
}

/**
 * One project, document included.
 *
 * The stored JSON is re-validated on the way out: a row written by an older
 * build (or edited by hand) must not reach the canvas unchecked, and a document
 * that no longer parses is reported as missing rather than half-rendered.
 */
export async function getProject(
  tenantId: string,
  id: string,
): Promise<{ summary: ProjectSummary; document: Document } | null> {
  const row = await prisma.designProject.findFirst({
    where: { ...tenantScope(tenantId), id },
    select: { ...SUMMARY_SELECT, document: true },
  });
  if (!row) return null;

  const document = parseDocument(row.document);
  if (!document) return null;

  return { summary: toSummary(row), document };
}

/** The project a returning user should land on. */
export async function latestProject(
  tenantId: string,
): Promise<{ summary: ProjectSummary; document: Document } | null> {
  const row = await prisma.designProject.findFirst({
    where: tenantScope(tenantId),
    orderBy: { updatedAt: 'desc' },
    select: { id: true },
  });
  return row ? getProject(tenantId, row.id) : null;
}

export async function createProject(
  tenantId: string,
  userId: string | null,
  name: string,
  document: Document,
): Promise<ProjectSummary> {
  const row = await prisma.designProject.create({
    data: {
      tenantId,
      name,
      document: toJson(document),
      schemaVersion: document.schemaVersion,
      createdBy: userId,
      updatedBy: userId,
    },
    select: SUMMARY_SELECT,
  });
  return toSummary(row);
}

/**
 * Overwrite a project's document.
 *
 * `updateMany` with the tenant in the filter rather than `update` by id: an
 * id-only update would happily write across tenants if an id ever leaked. A
 * count of zero means "not yours, or gone", which the route turns into a 404.
 */
export async function saveProject(
  tenantId: string,
  userId: string | null,
  id: string,
  document: Document,
  name?: string,
): Promise<boolean> {
  const result = await prisma.designProject.updateMany({
    where: { ...tenantScope(tenantId), id },
    data: {
      document: toJson(document),
      schemaVersion: document.schemaVersion,
      updatedBy: userId,
      ...(name !== undefined ? { name } : {}),
    },
  });
  return result.count > 0;
}

/** Soft delete - the row stays for audit, per the database rules. */
export async function deleteProject(
  tenantId: string,
  userId: string | null,
  id: string,
): Promise<boolean> {
  const result = await prisma.designProject.updateMany({
    where: { ...tenantScope(tenantId), id },
    data: { deletedAt: new Date(), updatedBy: userId },
  });
  return result.count > 0;
}
