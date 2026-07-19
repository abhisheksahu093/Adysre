/**
 * Prisma client singleton for ADYSRE. Backend rule: only repositories import
 * this — never touch Prisma from controllers/services directly.
 *
 * NOTE on IDs: the spec calls for UUIDv7. Postgres `gen_random_uuid()` emits v4.
 * To get true v7, install the `pg_uuidv7` extension and swap the default to
 * `uuid_generate_v7()`, or generate IDs in the repository layer. Kept as v4
 * here so the scaffold migrates without an extension.
 */
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export * from '@prisma/client';

/** Excludes soft-deleted rows. Spread into any `where` clause. */
export const notDeleted = { deletedAt: null } as const;

/** Scope a query to a tenant and exclude soft-deleted rows. */
export function tenantScope(tenantId: string) {
  return { tenantId, deletedAt: null } as const;
}
