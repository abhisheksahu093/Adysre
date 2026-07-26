import 'server-only';
import type { Prisma } from '@adysre/database';
import type {
  ApiCollection as CollectionRow,
  ApiEnvironment as EnvironmentRow,
  ApiHistoryEntry as HistoryRow,
  ApiNode as NodeRow,
  ApiVariable as VariableRow,
  ApiWorkspace as WorkspaceRow,
} from '@adysre/database';
import type {
  ApiCollection,
  ApiEnvironment,
  ApiNode,
  ApiVariable,
  ApiWorkspace,
  HistoryEntry,
  HttpMethod,
  NodeColor,
  RequestDefinition,
} from '@/modules/api-studio/types';
import { NODE_COLORS } from '@/modules/api-studio/types';
import {
  authConfigSchema,
  requestDefinitionSchema,
  requestScriptsSchema,
} from '@/modules/api-studio/schemas';
import { decryptSecret } from './crypto';

/**
 * Row to DTO. The one place the database's shape becomes the client's.
 *
 * Nothing outside this file sees a Prisma row (BACKEND_ARCHITECTURE.md: never
 * expose entities, map to DTOs), and nothing outside it decides how a secret is
 * presented. JSONB columns are parsed through the module's own schemas rather
 * than cast: a column is `unknown` until something validates it, and the
 * forgiving schemas fill in fields a row written by an older build lacks.
 */

/** Base entity columns, with dates as ISO strings the way the DTOs declare. */
function audit(row: {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: Date | null;
}) {
  return {
    id: row.id,
    tenantId: row.tenantId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    createdBy: row.createdBy,
    updatedBy: row.updatedBy,
    deletedAt: row.deletedAt ? row.deletedAt.toISOString() : null,
  };
}

function toColor(value: string | null): NodeColor | null {
  return value && (NODE_COLORS as readonly string[]).includes(value)
    ? (value as NodeColor)
    : null;
}

/**
 * A variable, as the caller is allowed to see it.
 *
 * A secret's plaintext is returned ONLY when the caller holds
 * `api-studio:secret:read` and asked for it. Otherwise the value comes back
 * empty with `secret: true`, which is what lets the UI render a masked field
 * without ever having held the credential.
 */
export function toVariable(row: VariableRow, reveal = false): ApiVariable {
  const revealed =
    row.secret && reveal && row.valueCipher ? (decryptSecret(row.valueCipher) ?? '') : '';

  return {
    id: row.id,
    key: row.key,
    value: row.secret ? revealed : (row.value ?? ''),
    initialValue: row.initialValue ?? '',
    secret: row.secret,
    enabled: row.enabled,
    description: row.description,
  };
}

export function toWorkspace(
  row: WorkspaceRow,
  activeEnvironmentId: string | null = null,
): ApiWorkspace {
  return {
    ...audit(row),
    name: row.name,
    slug: row.slug,
    description: row.description,
    activeEnvironmentId,
  };
}

export function toCollection(row: CollectionRow, variables: ApiVariable[] = []): ApiCollection {
  return {
    ...audit(row),
    workspaceId: row.workspaceId,
    name: row.name,
    description: row.description,
    color: toColor(row.color),
    icon: row.icon,
    tags: row.tags,
    favorite: row.favorite,
    auth: authConfigSchema.parse(row.auth),
    variables,
    scripts: requestScriptsSchema.parse(row.scripts),
  };
}

export function toEnvironment(row: EnvironmentRow, variables: ApiVariable[] = []): ApiEnvironment {
  return {
    ...audit(row),
    workspaceId: row.workspaceId,
    name: row.name,
    color: row.color,
    variables,
  };
}

export function toNode(row: NodeRow, variables: ApiVariable[] = []): ApiNode {
  const base = {
    ...audit(row),
    workspaceId: row.workspaceId,
    collectionId: row.collectionId,
    parentId: row.parentId,
    name: row.name,
    position: row.position,
    description: row.description,
    tags: row.tags,
    color: toColor(row.color),
    icon: row.icon,
    favorite: row.favorite,
  };

  if (row.kind === 'request') {
    return {
      ...base,
      kind: 'request',
      request: requestDefinitionSchema.parse(row.request),
      version: row.version,
    };
  }

  return {
    ...base,
    kind: 'folder',
    auth: authConfigSchema.parse(row.auth ?? { type: 'inherit' }),
    variables,
    scripts: requestScriptsSchema.parse(row.scripts ?? {}),
  };
}

export function toHistoryEntry(row: HistoryRow): HistoryEntry {
  return {
    id: row.id,
    workspaceId: row.workspaceId,
    nodeId: row.nodeId,
    method: row.method as HttpMethod,
    url: row.url,
    status: row.status,
    errorCode: row.errorCode,
    durationMs: row.durationMs,
    responseBytes: row.responseBytes,
    executedAt: row.executedAt.getTime(),
    favorite: row.favorite,
    request: requestDefinitionSchema.parse(row.request),
  };
}

/**
 * A domain object on its way into a JSONB column.
 *
 * Prisma's `InputJsonValue` only accepts types with an index signature, which a
 * TypeScript interface never has however JSON-shaped its contents are. The cast
 * is therefore unavoidable, so it happens HERE, once, behind a name that says
 * what it is - rather than as an anonymous `as` at every write site where it
 * would be indistinguishable from someone silencing a real error.
 *
 * Safe because the argument is always a schema-validated domain object, and
 * every one of those is JSON by construction: no dates, no functions, no
 * undefined, no cycles.
 */
export function toJson<T>(value: T): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

/**
 * The columns denormalised from a request definition.
 *
 * The sidebar reads `method` and `url` without touching the JSONB document, so
 * they must never disagree with it. Every write goes through here, which is
 * what makes "never disagree" a property of the code rather than a convention.
 */
export function denormalize(request: RequestDefinition): { method: string; url: string } {
  return { method: request.method, url: request.url };
}
