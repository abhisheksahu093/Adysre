/**
 * ADYSRE API Studio - workspaces, collections and the request tree.
 *
 * The tree is stored FLAT: every folder and request is a row carrying
 * `parentId` and `position`, and the hierarchy is derived on render. Nesting is
 * therefore unlimited for free, a drag-and-drop move is a two-field update
 * rather than a rewrite of a nested JSON blob, two people can move different
 * branches without clobbering each other, and a 5,000-request collection can be
 * paged in a branch at a time. The same shape maps one-to-one onto the Phase 2
 * table, so nothing is translated between client and database.
 *
 * `position` is a sparse integer (see `POSITION_STEP`): inserting between two
 * siblings takes the midpoint and touches one row instead of renumbering the
 * whole folder.
 */

import type { BaseEntity } from '@adysre/types';
import type { ApiVariable } from './environment';
import type { AuthConfig, RequestDefinition, RequestScripts } from './http';

/**
 * Colour labels are semantic token ids, never literals: the sidebar maps them
 * to theme tokens so they stay legible in both themes (UI_DESIGN_SYSTEM.md).
 */
export const NODE_COLORS = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
  'accent',
] as const;
export type NodeColor = (typeof NODE_COLORS)[number];

/**
 * A workspace: the unit users switch between and share. Scoped to a tenant by
 * `BaseEntity.tenantId`, so one organization can run many workspaces without
 * any cross-tenant leak (DATABASE_ARCHITECTURE.md).
 */
export interface ApiWorkspace extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  /**
   * The environment the workspace opens with. Derived on read from the
   * environment flagged `is_default`, rather than stored as a pointer on the
   * workspace row: deleting an environment can then never leave a dangling id
   * behind. See documents/API_STUDIO.md.
   */
  activeEnvironmentId: string | null;
}

export interface ApiCollection extends BaseEntity {
  workspaceId: string;
  name: string;
  description: string;
  color: NodeColor | null;
  /** Lucide icon id, resolved through the module's icon map (never a component). */
  icon: string | null;
  tags: string[];
  favorite: boolean;
  /** Inherited by every descendant that sets `auth.type = 'inherit'`. */
  auth: AuthConfig;
  variables: ApiVariable[];
  scripts: RequestScripts;
}

/** Fields every tree node shares, whichever kind it is. */
interface ApiNodeBase extends BaseEntity {
  workspaceId: string;
  collectionId: string;
  /** `null` for a node sitting at the collection root. */
  parentId: string | null;
  name: string;
  /** Sparse ordering key within `parentId`. See `POSITION_STEP`. */
  position: number;
  description: string;
  tags: string[];
  color: NodeColor | null;
  icon: string | null;
  favorite: boolean;
}

export interface ApiFolderNode extends ApiNodeBase {
  kind: 'folder';
  auth: AuthConfig;
  variables: ApiVariable[];
  scripts: RequestScripts;
}

export interface ApiRequestNode extends ApiNodeBase {
  kind: 'request';
  request: RequestDefinition;
  /** Bumped on every save. Drives optimistic concurrency and version history. */
  version: number;
}

export type ApiNode = ApiFolderNode | ApiRequestNode;
export type NodeKind = ApiNode['kind'];

/** A node plus its resolved children, materialised only for rendering. */
export interface ApiTreeNode {
  node: ApiNode;
  depth: number;
  children: ApiTreeNode[];
}

/** A move: the only mutation drag-and-drop performs. */
export interface NodeMove {
  nodeId: string;
  /** New parent, or `null` for the collection root. */
  parentId: string | null;
  position: number;
}

/** Type guard: narrows a node to a request. */
export function isRequestNode(node: ApiNode): node is ApiRequestNode {
  return node.kind === 'request';
}

/** Type guard: narrows a node to a folder. */
export function isFolderNode(node: ApiNode): node is ApiFolderNode {
  return node.kind === 'folder';
}
