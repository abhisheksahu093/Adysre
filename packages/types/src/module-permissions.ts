/**
 * Permission manifests for the platform's modules.
 *
 * These live in a shared package because two very different consumers need the
 * same list and neither can import the other: the web module checks these
 * strings on every request, and the database seed has to insert them so a role
 * can be granted one. A copy in each place would drift the first time a
 * permission was added, and the failure mode of that drift is silent denial.
 *
 * Format is `module:resource:action` (AUTHENTICATION_RBAC.md). The `satisfies`
 * clauses make a typo a compile error rather than a permission nobody holds.
 */

import type { Permission } from './rbac.ts';

export const API_STUDIO_MODULE = 'api-studio';

/**
 * API Studio (documents/API_STUDIO.md).
 *
 * `request:execute` is deliberately separate from `request:read`: a reviewer may
 * need to read a collection without being allowed to fire its requests at
 * production. `secret:read` is separate from everything, and audited, because it
 * reveals plaintext credentials.
 */
export const API_STUDIO_PERMISSIONS = {
  workspaceRead: `${API_STUDIO_MODULE}:workspace:read`,
  workspaceManage: `${API_STUDIO_MODULE}:workspace:manage`,
  collectionRead: `${API_STUDIO_MODULE}:collection:read`,
  collectionCreate: `${API_STUDIO_MODULE}:collection:create`,
  collectionUpdate: `${API_STUDIO_MODULE}:collection:update`,
  collectionDelete: `${API_STUDIO_MODULE}:collection:delete`,
  requestRead: `${API_STUDIO_MODULE}:request:read`,
  requestCreate: `${API_STUDIO_MODULE}:request:create`,
  requestUpdate: `${API_STUDIO_MODULE}:request:update`,
  requestDelete: `${API_STUDIO_MODULE}:request:delete`,
  requestExecute: `${API_STUDIO_MODULE}:request:execute`,
  environmentRead: `${API_STUDIO_MODULE}:environment:read`,
  environmentManage: `${API_STUDIO_MODULE}:environment:manage`,
  secretRead: `${API_STUDIO_MODULE}:secret:read`,
  secretManage: `${API_STUDIO_MODULE}:secret:manage`,
  historyRead: `${API_STUDIO_MODULE}:history:read`,
  historyDelete: `${API_STUDIO_MODULE}:history:delete`,
  importRun: `${API_STUDIO_MODULE}:import:create`,
  exportRun: `${API_STUDIO_MODULE}:export:read`,
} as const satisfies Record<string, Permission>;

export type ApiStudioPermission =
  (typeof API_STUDIO_PERMISSIONS)[keyof typeof API_STUDIO_PERMISSIONS];

/**
 * Module roles, least to most privileged. Each row is the COMPLETE set for that
 * role rather than a delta, so a check never walks a hierarchy at runtime.
 */
export const API_STUDIO_ROLE_PERMISSIONS = {
  viewer: [
    API_STUDIO_PERMISSIONS.workspaceRead,
    API_STUDIO_PERMISSIONS.collectionRead,
    API_STUDIO_PERMISSIONS.requestRead,
    API_STUDIO_PERMISSIONS.environmentRead,
    API_STUDIO_PERMISSIONS.historyRead,
    API_STUDIO_PERMISSIONS.exportRun,
  ],
  developer: [
    API_STUDIO_PERMISSIONS.workspaceRead,
    API_STUDIO_PERMISSIONS.collectionRead,
    API_STUDIO_PERMISSIONS.collectionCreate,
    API_STUDIO_PERMISSIONS.collectionUpdate,
    API_STUDIO_PERMISSIONS.requestRead,
    API_STUDIO_PERMISSIONS.requestCreate,
    API_STUDIO_PERMISSIONS.requestUpdate,
    API_STUDIO_PERMISSIONS.requestDelete,
    API_STUDIO_PERMISSIONS.requestExecute,
    API_STUDIO_PERMISSIONS.environmentRead,
    API_STUDIO_PERMISSIONS.environmentManage,
    API_STUDIO_PERMISSIONS.secretRead,
    API_STUDIO_PERMISSIONS.historyRead,
    API_STUDIO_PERMISSIONS.historyDelete,
    API_STUDIO_PERMISSIONS.importRun,
    API_STUDIO_PERMISSIONS.exportRun,
  ],
  admin: Object.values(API_STUDIO_PERMISSIONS),
} as const satisfies Record<string, readonly Permission[]>;

export type ApiStudioRole = keyof typeof API_STUDIO_ROLE_PERMISSIONS;

/**
 * Every module permission the platform defines, for the seed. Core permissions
 * (`org:*`) stay in the seed itself: they are the platform, not a module.
 */
export const MODULE_PERMISSIONS: readonly Permission[] = [
  ...Object.values(API_STUDIO_PERMISSIONS),
];
