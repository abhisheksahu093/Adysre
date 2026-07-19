import { Inject, Injectable } from '@nestjs/common';
import type { PrismaClient } from '@adysre/database';
import { PRISMA } from '../../common/prisma/prisma.module.js';

/** Owns all Prisma access for the auth module (repository layer). */
@Injectable()
export class AuthRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  /** Resolve a tenant id from its organization slug (login without a cookie). */
  async findTenantIdBySlug(slug: string): Promise<string | null> {
    const org = await this.prisma.organization.findFirst({
      where: { slug, deletedAt: null },
      select: { id: true },
    });
    return org?.id ?? null;
  }

  findUserByEmail(tenantId: string, email: string) {
    return this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
      include: {
        userRoles: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        },
      },
    });
  }

  /**
   * Find an active account by email across every tenant. OAuth has no tenant
   * context to key on - the provider only hands us an email - so the lookup is
   * global, then narrowed to active, non-deleted users.
   */
  findActiveUserByEmailGlobal(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isActive: true, deletedAt: null },
      include: {
        userRoles: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        },
      },
    });
  }

  findUserById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      include: {
        userRoles: {
          include: { role: { include: { rolePermissions: { include: { permission: true } } } } },
        },
      },
    });
  }

  createSession(input: {
    tenantId: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ip?: string;
  }) {
    return this.prisma.session.create({ data: input });
  }

  findValidSession(tenantId: string, refreshTokenHash: string) {
    return this.prisma.session.findFirst({
      where: { tenantId, refreshTokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  rotateSession(sessionId: string, newHash: string, expiresAt: Date) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { refreshTokenHash: newHash, expiresAt },
    });
  }

  revokeSession(sessionId: string) {
    return this.prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Registration: create org (tenant root), Owner role, and owner user in one tx.
   * `passwordHash` is null for OAuth signups, where the provider is the only
   * credential (the User model allows a null hash).
   */
  registerTenant(input: {
    organizationName: string;
    organizationSlug: string;
    email: string;
    name: string;
    passwordHash: string | null;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: { tenantId: '00000000-0000-0000-0000-000000000000', name: input.organizationName, slug: input.organizationSlug },
      });
      const withTenant = await tx.organization.update({
        where: { id: org.id },
        data: { tenantId: org.id },
      });
      const ownerRole = await tx.role.create({
        data: { tenantId: withTenant.id, name: 'Owner', isSystem: true },
      });
      const user = await tx.user.create({
        data: {
          tenantId: withTenant.id,
          email: input.email,
          name: input.name,
          passwordHash: input.passwordHash,
        },
      });
      await tx.userRole.create({
        data: { tenantId: withTenant.id, userId: user.id, roleId: ownerRole.id },
      });
      return { organization: withTenant, user };
    });
  }
}
