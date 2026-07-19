/** Shared entity shapes exposed to the client (DTOs — never raw Prisma rows). */

/** Base audit fields present on every persisted entity. */
export interface BaseEntity {
  id: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
}

export interface OrganizationDto extends BaseEntity {
  name: string;
  slug: string;
}

export interface UserDto extends BaseEntity {
  email: string;
  name: string;
  avatarUrl: string | null;
  isActive: boolean;
}

export interface RoleDto extends BaseEntity {
  name: string;
  isSystem: boolean;
}

export interface NotificationDto extends BaseEntity {
  userId: string;
  type: string;
  title: string;
  body: string;
  readAt: string | null;
}
