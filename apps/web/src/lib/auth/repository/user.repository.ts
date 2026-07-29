import 'server-only';
import { prisma, notDeleted } from '@adysre/database';
import type { AuthContext, Permission, SystemRole } from '@adysre/types';
import { createId } from '@/modules/api-studio/utils/ids';
import { defined } from '@/lib/api/patch';
import { isSystemRole } from '../access-token';

/**
 * Users, tenants and the RBAC lookup. The only place that touches Prisma for
 * any of them (BACKEND_ARCHITECTURE.md: only repositories touch the database).
 *
 * Almost every function here takes a `tenantId` and filters on it. The two that
 * do not are `findCandidatesByEmail` and `isSlugTaken`, and both say why: they
 * run before a tenant is known, which is the only legitimate reason to query
 * across tenants in this codebase.
 */

/** Lockout policy. Five strikes, fifteen minutes, and the lock expires itself. */
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_MS = 15 * 60 * 1000;

/** A sign-in candidate: enough to verify a password and decide what to do next. */
export interface LoginCandidate {
  id: string;
  tenantId: string;
  email: string;
  name: string;
  passwordHash: string | null;
  isActive: boolean;
  lockedUntil: Date | null;
  failedLoginAttempts: number;
  emailVerifiedAt: Date | null;
  organization: { slug: string; name: string };
}

/**
 * Every account with this address, across all tenants.
 *
 * **This is the one deliberately cross-tenant query in the application.** It
 * has to be: `users` is unique on `(tenant_id, email)`, so at sign-in, before
 * any tenant is established, the address is all we have. Nothing derived from
 * it is returned to the caller until a password has verified, so it cannot be
 * used to discover where an address exists.
 *
 * Soft-deleted users and soft-deleted organizations are both excluded, or a
 * removed account could still sign in.
 */
export async function findCandidatesByEmail(email: string): Promise<LoginCandidate[]> {
  const rows = await prisma.user.findMany({
    where: {
      email: email.toLowerCase(),
      ...notDeleted,
      organization: { ...notDeleted },
    },
    select: {
      id: true,
      tenantId: true,
      email: true,
      name: true,
      passwordHash: true,
      isActive: true,
      lockedUntil: true,
      failedLoginAttempts: true,
      emailVerifiedAt: true,
      organization: { select: { slug: true, name: true } },
    },
  });
  return rows;
}

/** Whether an organization slug is already claimed. Global, because slugs are. */
export async function isSlugTaken(slug: string): Promise<boolean> {
  const existing = await prisma.organization.findUnique({
    where: { slug: slug.toLowerCase() },
    select: { id: true },
  });
  return existing !== null;
}

export interface RegisterData {
  email: string;
  name: string;
  /**
   * Null for an account created through OAuth, which has no password to hash.
   * The column has always allowed it; only this type did not. Such a user signs
   * in through their provider, or through a password reset once they set one.
   */
  passwordHash: string | null;
  organizationName: string;
  organizationSlug: string;
  /**
   * When the provider has already vouched for the address, so the user is not
   * asked to verify an email they just proved they control.
   */
  emailVerifiedAt?: Date | null;
}

export interface RegisterResult {
  userId: string;
  tenantId: string;
}

/**
 * Create a tenant and its first Owner, in one transaction.
 *
 * The transaction is the point. A half-registered tenant, an Organization with
 * no Owner or an Owner with no role, cannot be repaired through the UI and has
 * to be fixed by hand in the database. Either all of it lands or none does.
 *
 * The Owner role is created per tenant rather than shared, because roles are
 * tenant-owned rows so a tenant can define its own without a migration.
 */
export async function createTenantWithOwner(data: RegisterData): Promise<RegisterResult> {
  const tenantId = createId();
  const userId = createId();
  const roleId = createId();

  await prisma.$transaction(async (tx) => {
    await tx.organization.create({
      data: {
        id: tenantId,
        // The tenant root: tenantId mirrors id so every table carries the same
        // base columns.
        tenantId,
        name: data.organizationName,
        slug: data.organizationSlug.toLowerCase(),
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await tx.user.create({
      data: {
        id: userId,
        tenantId,
        email: data.email.toLowerCase(),
        name: data.name,
        passwordHash: data.passwordHash,
        emailVerifiedAt: data.emailVerifiedAt ?? null,
        createdBy: userId,
        updatedBy: userId,
      },
    });

    await tx.role.create({
      data: { id: roleId, tenantId, name: 'Owner', isSystem: true, createdBy: userId },
    });

    await tx.userRole.create({
      data: { id: createId(), tenantId, userId, roleId, createdBy: userId },
    });
  });

  return { userId, tenantId };
}

/**
 * The roles and permissions a token should carry.
 *
 * Read fresh from the database on every sign-in and every refresh, never copied
 * from a previous token. That is what makes a revoked role take effect within
 * the access token's 15 minute window instead of surviving for the refresh
 * token's fourteen days.
 */
export async function loadAuthContext(tenantId: string, userId: string): Promise<AuthContext> {
  const assignments = await prisma.userRole.findMany({
    where: { tenantId, userId },
    select: {
      role: {
        select: {
          name: true,
          deletedAt: true,
          rolePermissions: { select: { permission: { select: { key: true } } } },
        },
      },
    },
  });

  const roles: SystemRole[] = [];
  const permissions = new Set<Permission>();

  for (const { role } of assignments) {
    // A soft-deleted role grants nothing. Filtered here rather than in the
    // `where` clause because Prisma cannot express it on a nested relation
    // without dropping the parent row entirely.
    if (!role || role.deletedAt) continue;
    if (isSystemRole(role.name)) roles.push(role.name);
    for (const { permission } of role.rolePermissions) {
      // Anything not shaped `module:resource:action` is not a permission this
      // platform understands, and must not reach the policy layer.
      if (permission.key.split(':').length === 3) permissions.add(permission.key as Permission);
    }
  }

  return { userId, tenantId, roles, permissions: [...permissions] };
}

/** The profile shown by `GET /api/auth/me`. */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  organization: { id: string; name: string; slug: string };
}

export async function findProfile(tenantId: string, userId: string): Promise<UserProfile | null> {
  return prisma.user.findFirst({
    where: { id: userId, tenantId, ...notDeleted },
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      emailVerifiedAt: true,
      lastLoginAt: true,
      organization: { select: { id: true, name: true, slug: true } },
    },
  });
}

/**
 * Record a failed sign-in, and lock the account on the fifth.
 *
 * Returns the lock expiry when this attempt triggered one, so the caller can
 * audit it. `increment` rather than a read-then-write, so two simultaneous
 * attempts cannot both read 4 and both write 5.
 */
export async function recordFailedLogin(userId: string): Promise<Date | null> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: { increment: 1 } },
    select: { failedLoginAttempts: true },
  });

  if (user.failedLoginAttempts < MAX_FAILED_ATTEMPTS) return null;

  const lockedUntil = new Date(Date.now() + LOCKOUT_MS);
  await prisma.user.update({ where: { id: userId }, data: { lockedUntil } });
  return lockedUntil;
}

/** Clear the failure counter and stamp the sign-in. */
export async function recordSuccessfulLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { failedLoginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() },
  });
}

/**
 * Replace a password hash.
 *
 * Also clears the lockout: someone who has just proved control of their account
 * should not still be locked out by the attempts that led them here.
 */
export async function updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null, updatedBy: userId },
  });
}

export interface ProfilePatch {
  // `| undefined` is explicit because this workspace runs with
  // `exactOptionalPropertyTypes`, where an optional key and a key set to
  // undefined are different types.
  name?: string | undefined;
  avatarUrl?: string | null | undefined;
}

/**
 * Update a profile.
 *
 * `updateMany` with the tenant in the `where`, not a fetch-then-check followed
 * by an update on the id alone. The latter is both a race and, more
 * importantly, an unscoped write: the database is what should enforce that this
 * row belongs to this tenant.
 *
 * Returns false when nothing matched, which the handler turns into a 404.
 */
export async function updateProfile(
  tenantId: string,
  userId: string,
  patch: ProfilePatch,
): Promise<boolean> {
  const { count } = await prisma.user.updateMany({
    where: { id: userId, tenantId, ...notDeleted },
    // `defined` drops keys holding undefined. Prisma refuses those outright,
    // and rightly: `{ name: undefined }` in an update is an instruction that
    // means nothing. What remains is exactly the columns the caller asked to
    // change, so an absent field is left alone rather than nulled.
    data: { ...defined(patch), updatedBy: userId },
  });
  return count > 0;
}

/** The stored hash, for verifying a current password. */
export async function findPasswordHash(
  tenantId: string,
  userId: string,
): Promise<string | null> {
  const user = await prisma.user.findFirst({
    where: { id: userId, tenantId, ...notDeleted },
    select: { passwordHash: true },
  });
  return user?.passwordHash ?? null;
}
