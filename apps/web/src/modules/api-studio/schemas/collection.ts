/**
 * ADYSRE API Studio - workspace, collection, node and environment schemas.
 *
 * These parse persisted entities: what comes back from the module's own API,
 * and what comes out of an import or a local cache. Because the tree is stored
 * flat, a node is validated on its own - there is no recursive schema, so a
 * 5,000-node collection parses in one linear pass and a cycle in `parentId`
 * cannot blow the stack. Structural integrity of the tree (no orphans, no
 * cycles) is a separate check that runs once on load, where it can report the
 * offending ids instead of throwing.
 */

import { z } from 'zod';
import type { BaseEntity } from '@adysre/types';
import type {
  ApiCollection,
  ApiEnvironment,
  ApiFolderNode,
  ApiNode,
  ApiRequestNode,
  ApiWorkspace,
} from '../types';
import {
  colorSchema,
  descriptionSchema,
  idSchema,
  nameSchema,
  tagsSchema,
  variableSchema,
  type Parser,
} from './common';
import { authConfigSchema, requestDefinitionSchema, requestScriptsSchema } from './request';

/** Audit columns every persisted entity carries (DATABASE_ARCHITECTURE.md). */
const baseEntityShape = {
  id: idSchema,
  tenantId: idSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: idSchema.nullable(),
  updatedBy: idSchema.nullable(),
  deletedAt: z.string().datetime().nullable(),
};

export const baseEntitySchema: Parser<BaseEntity> = z.object(baseEntityShape);

export const workspaceSchema: Parser<ApiWorkspace> = z.object({
  ...baseEntityShape,
  name: nameSchema,
  slug: z
    .string()
    .trim()
    .min(1)
    .max(63)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  description: descriptionSchema,
  activeEnvironmentId: idSchema.nullable().default(null),
});

export const collectionSchema: Parser<ApiCollection> = z.object({
  ...baseEntityShape,
  workspaceId: idSchema,
  name: nameSchema,
  description: descriptionSchema,
  color: colorSchema,
  icon: z.string().max(64).nullable().default(null),
  tags: tagsSchema,
  favorite: z.boolean().default(false),
  auth: authConfigSchema.default({ type: 'none' }),
  variables: z.array(variableSchema).max(1_000).default([]),
  scripts: requestScriptsSchema.default({ preRequest: '', test: '' }),
});

const nodeShape = {
  ...baseEntityShape,
  workspaceId: idSchema,
  collectionId: idSchema,
  parentId: idSchema.nullable(),
  name: nameSchema,
  position: z.number().int().min(0),
  description: descriptionSchema,
  tags: tagsSchema,
  color: colorSchema,
  icon: z.string().max(64).nullable().default(null),
  favorite: z.boolean().default(false),
};

export const folderNodeSchema: Parser<ApiFolderNode> = z.object({
  ...nodeShape,
  kind: z.literal('folder'),
  auth: authConfigSchema.default({ type: 'inherit' }),
  variables: z.array(variableSchema).max(1_000).default([]),
  scripts: requestScriptsSchema.default({ preRequest: '', test: '' }),
});

export const requestNodeSchema: Parser<ApiRequestNode> = z.object({
  ...nodeShape,
  kind: z.literal('request'),
  request: requestDefinitionSchema,
  version: z.number().int().min(1).default(1),
});

export const apiNodeSchema: Parser<ApiNode> = z.discriminatedUnion('kind', [
  z.object({ ...nodeShape, kind: z.literal('folder'), auth: authConfigSchema, variables: z.array(variableSchema), scripts: requestScriptsSchema }),
  z.object({ ...nodeShape, kind: z.literal('request'), request: requestDefinitionSchema, version: z.number().int().min(1) }),
]);

export const environmentSchema: Parser<ApiEnvironment> = z.object({
  ...baseEntityShape,
  workspaceId: idSchema,
  name: nameSchema,
  color: z.string().max(32).nullable().default(null),
  variables: z.array(variableSchema).max(1_000).default([]),
});
