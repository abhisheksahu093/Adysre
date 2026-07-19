/**
 * Seeds a demo tenant with system roles, a baseline permission set, and an
 * Owner user. Idempotent — safe to run repeatedly.
 */
import { PrismaClient } from '@prisma/client';
import { createHash } from 'node:crypto';

const prisma = new PrismaClient();

const SYSTEM_ROLES = ['Owner', 'Admin', 'Manager', 'Member'] as const;

// module:resource:action — baseline core permissions.
const CORE_PERMISSIONS = [
  'org:organization:manage',
  'org:user:create',
  'org:user:read',
  'org:user:update',
  'org:user:delete',
  'org:role:manage',
  'org:setting:manage',
  'org:audit:read',
  'org:notification:read',
  'org:file:manage',
];

async function main() {
  const org = await prisma.organization.upsert({
    where: { slug: 'demo' },
    update: {},
    create: { id: crypto.randomUUID(), tenantId: crypto.randomUUID(), name: 'Demo Org', slug: 'demo' },
  });
  // Ensure tenantId mirrors id for the tenant root.
  await prisma.organization.update({ where: { id: org.id }, data: { tenantId: org.id } });
  const tenantId = org.id;

  const permissions = await Promise.all(
    CORE_PERMISSIONS.map((key) =>
      prisma.permission.upsert({
        where: { tenantId_key: { tenantId, key } },
        update: {},
        create: { tenantId, key },
      }),
    ),
  );

  const roles = await Promise.all(
    SYSTEM_ROLES.map((name) =>
      prisma.role.upsert({
        where: { tenantId_name: { tenantId, name } },
        update: {},
        create: { tenantId, name, isSystem: true },
      }),
    ),
  );

  const owner = roles.find((r) => r.name === 'Owner')!;
  // Owner gets every permission.
  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: owner.id, permissionId: permission.id } },
      update: {},
      create: { tenantId, roleId: owner.id, permissionId: permission.id },
    });
  }

  // Demo Owner user — password "ChangeMe123!" (sha256 placeholder; real hashing
  // happens in the api auth module with argon2/bcrypt).
  const passwordHash = createHash('sha256').update('ChangeMe123!').digest('hex');
  const user = await prisma.user.upsert({
    where: { tenantId_email: { tenantId, email: 'owner@demo.test' } },
    update: {},
    create: { tenantId, email: 'owner@demo.test', name: 'Demo Owner', passwordHash },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: owner.id } },
    update: {},
    create: { tenantId, userId: user.id, roleId: owner.id },
  });

  console.log(`Seeded tenant ${tenantId} with ${roles.length} roles, ${permissions.length} permissions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
