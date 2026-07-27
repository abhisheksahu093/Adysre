/**
 * Seeds a demo tenant with system roles, a baseline permission set, and an
 * Owner user. Idempotent — safe to run repeatedly.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { MODULE_PERMISSIONS } from '@adysre/types';
import { seedEntitlements } from './seed-entitlements.ts';

const prisma = new PrismaClient();

const SYSTEM_ROLES = ['Owner', 'Admin', 'Manager', 'Member'] as const;

// module:resource:action — baseline core permissions. Module permissions come
// from `@adysre/types` so the seed and the modules that check them read one
// list; a copy here would drift the first time a module added a permission,
// and drifted permissions fail silently as denials.
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
    [...CORE_PERMISSIONS, ...MODULE_PERMISSIONS].map((key) =>
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

  // Demo Owner user, password "ChangeMe123!".
  //
  // A real bcrypt hash at the production cost. This used to store a raw
  // unsalted SHA-256, which no verifier accepts, so the demo Owner could never
  // actually sign in: reads worked, sign-in always failed, and the cause looked
  // like a broken login rather than a broken seed.
  //
  // The password is documented and therefore public. Anything reachable from
  // the internet must change it or delete this user (see
  // docs/PRODUCTION_DEPLOYMENT.md).
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  const user = await prisma.user.upsert({
    where: { tenantId_email: { tenantId, email: 'owner@demo.test' } },
    // Repair the hash on re-seed, so a database seeded before this fix gets a
    // usable credential without being reset by hand.
    update: { passwordHash },
    create: { tenantId, email: 'owner@demo.test', name: 'Demo Owner', passwordHash },
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: owner.id } },
    update: {},
    create: { tenantId, userId: user.id, roleId: owner.id },
  });

  console.log(`Seeded tenant ${tenantId} with ${roles.length} roles, ${permissions.length} permissions.`);

  // Plans, features and limits. Runs last, because it subscribes every
  // organization that exists, including the demo tenant created above.
  await seedEntitlements(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
