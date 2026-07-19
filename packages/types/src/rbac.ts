/** RBAC/ABAC contracts — see documents/AUTHENTICATION_RBAC.md. */

export const SYSTEM_ROLES = ['Owner', 'Admin', 'Manager', 'Member', 'Custom'] as const;
export type SystemRole = (typeof SYSTEM_ROLES)[number];

/** Permission string format: `module:resource:action` (e.g. `crm:lead:read`). */
export type Permission = `${string}:${string}:${string}`;

export const PERMISSION_ACTIONS = [
  'create',
  'read',
  'update',
  'delete',
  'manage',
] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

/** Authenticated principal carried through guards and request context. */
export interface AuthContext {
  userId: string;
  tenantId: string;
  roles: SystemRole[];
  permissions: Permission[];
}

export function parsePermission(p: Permission): {
  module: string;
  resource: string;
  action: string;
} {
  const [module, resource, action] = p.split(':');
  return { module: module ?? '', resource: resource ?? '', action: action ?? '' };
}
