import { Inject, Injectable } from '@nestjs/common';
import { type PrismaClient, tenantScope } from '@adysre/database';
import { PRISMA } from '../../common/prisma/prisma.module.js';

/** Owns Prisma access for the users module. Every query is tenant-scoped. */
@Injectable()
export class UsersRepository {
  constructor(@Inject(PRISMA) private readonly prisma: PrismaClient) {}

  async list(tenantId: string, page: number, pageSize: number) {
    const where = tenantScope(tenantId);
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  findById(tenantId: string, id: string) {
    return this.prisma.user.findFirst({ where: { id, ...tenantScope(tenantId) } });
  }

  /** Soft delete — never hard-delete (DATABASE_ARCHITECTURE.md). */
  softDelete(tenantId: string, id: string, actorId: string) {
    return this.prisma.user.updateMany({
      where: { id, ...tenantScope(tenantId) },
      data: { deletedAt: new Date(), updatedBy: actorId },
    });
  }
}
