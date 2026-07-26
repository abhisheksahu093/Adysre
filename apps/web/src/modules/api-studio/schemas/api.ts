/**
 * ADYSRE API Studio - request bodies for `/api/api-studio/*`.
 *
 * These are the contracts the route handlers parse before anything reaches a
 * repository. They are separate from the entity schemas because what a client
 * SENDS is not what the database STORES: a create body carries no id, no audit
 * columns and no tenant (the tenant comes from the session, never from a body
 * field, which is what stops a caller from writing into another tenant).
 *
 * Forgiving where a field has a sensible default, strict where a wrong value
 * would be silently accepted: ids must be ids, and a `kind` decides which of
 * two shapes the rest of the body must have.
 */

import { z } from 'zod';
import { HTTP_METHODS, NODE_COLORS } from '../types';
import { authConfigSchema, requestDefinitionSchema, requestScriptsSchema } from './request';
import { descriptionSchema, idSchema, nameSchema, tagsSchema, variableSchema } from './common';

const colorInput = z.enum(NODE_COLORS).nullable().default(null);
const iconInput = z.string().max(64).nullable().default(null);

/** A slug is generated from the name when the client does not supply one. */
export function slugify(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63);
  // A name of only punctuation would slugify to nothing, which is not a slug.
  return slug === '' ? 'workspace' : slug;
}

export const workspaceCreateSchema = z.object({
  name: nameSchema,
  slug: z
    .string()
    .trim()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only')
    .optional(),
  description: descriptionSchema,
});

export const workspaceUpdateSchema = workspaceCreateSchema.partial();

export const collectionCreateSchema = z.object({
  workspaceId: idSchema,
  name: nameSchema,
  description: descriptionSchema,
  color: colorInput,
  icon: iconInput,
  tags: tagsSchema,
  favorite: z.boolean().default(false),
  auth: authConfigSchema.default({ type: 'none' }),
  scripts: requestScriptsSchema.default({ preRequest: '', test: '' }),
  variables: z.array(variableSchema).max(1_000).default([]),
});

export const collectionUpdateSchema = collectionCreateSchema.omit({ workspaceId: true }).partial();

const nodeCommon = {
  workspaceId: idSchema,
  collectionId: idSchema,
  parentId: idSchema.nullable().default(null),
  name: nameSchema,
  description: descriptionSchema,
  tags: tagsSchema,
  color: colorInput,
  icon: iconInput,
  favorite: z.boolean().default(false),
};

/**
 * Creating a node. The `kind` decides the rest of the body: a request carries a
 * definition, a folder carries the auth, scripts and variables its descendants
 * inherit. The database enforces the same split with a CHECK constraint.
 */
export const nodeCreateSchema = z.discriminatedUnion('kind', [
  z.object({
    ...nodeCommon,
    kind: z.literal('request'),
    request: requestDefinitionSchema,
  }),
  z.object({
    ...nodeCommon,
    kind: z.literal('folder'),
    auth: authConfigSchema.default({ type: 'inherit' }),
    scripts: requestScriptsSchema.default({ preRequest: '', test: '' }),
    variables: z.array(variableSchema).max(1_000).default([]),
  }),
]);

export const nodeUpdateSchema = z.object({
  name: nameSchema.optional(),
  description: descriptionSchema.optional(),
  tags: tagsSchema.optional(),
  color: z.enum(NODE_COLORS).nullable().optional(),
  icon: z.string().max(64).nullable().optional(),
  favorite: z.boolean().optional(),
  request: requestDefinitionSchema.optional(),
  auth: authConfigSchema.optional(),
  scripts: requestScriptsSchema.optional(),
  variables: z.array(variableSchema).max(1_000).optional(),
});

export const nodeMoveSchema = z.object({
  /** `null` moves the node to the collection root. */
  parentId: idSchema.nullable(),
  index: z.number().int().min(0).max(100_000),
});

export const nodeDuplicateSchema = z.object({
  /** Name for the copy. Supplied by the client so the label stays translated. */
  name: nameSchema.optional(),
});

export const environmentCreateSchema = z.object({
  workspaceId: idSchema,
  name: nameSchema,
  color: z.string().max(32).nullable().default(null),
  isDefault: z.boolean().default(false),
  variables: z.array(variableSchema).max(1_000).default([]),
});

export const environmentUpdateSchema = environmentCreateSchema
  .omit({ workspaceId: true })
  .partial();

export const historyCreateSchema = z.object({
  workspaceId: idSchema,
  nodeId: idSchema.nullable().default(null),
  method: z.enum(HTTP_METHODS),
  url: z.string().max(2_048),
  status: z.number().int().min(100).max(599).nullable().default(null),
  errorCode: z.string().max(64).nullable().default(null),
  durationMs: z.number().int().min(0).max(3_600_000).default(0),
  requestBytes: z.number().int().min(0).default(0),
  responseBytes: z.number().int().min(0).default(0),
  request: requestDefinitionSchema,
});

export const historyUpdateSchema = z.object({ favorite: z.boolean() });

export const historyClearSchema = z.object({
  workspaceId: idSchema,
  includeFavorites: z.boolean().default(false),
});

/**
 * Clearing cookies. Naming one deletes it; omitting the name empties the jar,
 * which are different enough operations that the body has to say which.
 */
export const cookieClearSchema = z.object({
  workspaceId: idSchema,
  cookie: z
    .object({
      domain: z.string().min(1).max(255),
      path: z.string().min(1).max(255),
      name: z.string().min(1).max(255),
    })
    .nullable()
    .default(null),
});

export type WorkspaceCreateInput = z.infer<typeof workspaceCreateSchema>;
export type CollectionCreateInput = z.infer<typeof collectionCreateSchema>;
export type NodeCreateInput = z.infer<typeof nodeCreateSchema>;
export type EnvironmentCreateInput = z.infer<typeof environmentCreateSchema>;
export type HistoryCreateInput = z.infer<typeof historyCreateSchema>;
