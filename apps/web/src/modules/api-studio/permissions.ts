/**
 * ADYSRE API Studio - the module's RBAC vocabulary.
 *
 * Permissions are `module:resource:action` strings (AUTHENTICATION_RBAC.md) and
 * they are declared once, here, so no route handler or component ever types one
 * as a literal. The `satisfies` clause makes a typo a compile error rather than
 * a silently-denied check, and the module segment is fixed by
 * {@link API_STUDIO_MODULE} so the whole set can never half-rename.
 *
 * Deny by default: a caller holding none of these can read nothing.
 * `execute` is separate from `request:read` on purpose - a reviewer may need to
 * read a collection without being allowed to fire its requests at production.
 */

import type { Permission } from '@adysre/types';

export const API_STUDIO_MODULE = 'api-studio';

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
  /** Actually sending a request through the runner. */
  requestExecute: `${API_STUDIO_MODULE}:request:execute`,
  environmentRead: `${API_STUDIO_MODULE}:environment:read`,
  environmentManage: `${API_STUDIO_MODULE}:environment:manage`,
  /** Revealing a secret variable's plaintext. Audited on every use. */
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
 * Module roles, mapped onto the platform's system roles at assignment time.
 * Listed least to most privileged; each row is the complete set for that role,
 * not a delta, so a check never has to walk a hierarchy at runtime.
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
 * True when `granted` covers `required`.
 *
 * A `module:resource:manage` grant implies every action on that resource, which
 * is the only implication the model has: there is no wildcard, and no role
 * inherits another's set implicitly.
 *
 * @param granted - permissions held by the caller.
 * @param required - the permission being checked.
 */
export function hasPermission(
  granted: readonly Permission[],
  required: ApiStudioPermission,
): boolean {
  if (granted.includes(required)) return true;
  const [module, resource] = required.split(':');
  return granted.includes(`${module}:${resource}:manage` as Permission);
}
