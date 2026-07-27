import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import { createCollection } from '@/lib/api-studio/repositories/collections';
import { EMPTY_SCRIPTS, INHERITED_AUTH } from '@/modules/api-studio/constants/defaults';
import { createProject } from '@/lib/design-playground/project-repository';
import { QuotaExceededError } from './service';
import { setSubscriptionPlan } from './repository';

/**
 * Stock ceilings, enforced where the rows are actually created.
 *
 * These go through the real repositories rather than the service, because the
 * property under test is that the check runs INSIDE the creating transaction.
 * A test that called `reserveStock` directly would pass even if nobody had
 * wired it into the create path, which is the mistake worth catching.
 */

const PREFIX = 'enfvtest';
let n = 0;
const slug = () => `${PREFIX}-${process.pid}-${(n += 1)}`;

async function cleanup(): Promise<void> {
  const orgs = await prisma.organization.findMany({
    where: { slug: { startsWith: PREFIX } },
    select: { id: true },
  });
  const ids = orgs.map((o) => o.id);
  if (ids.length === 0) return;

  await prisma.apiVariable.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.apiCollection.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.apiWorkspace.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.designProject.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.featureUsageEvent.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.subscription.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.organization.deleteMany({ where: { id: { in: ids } } });
}

async function newWorkspace(): Promise<string> {
  const s = slug();
  const org = await prisma.organization.create({
    data: { name: `Enf ${s}`, slug: s, tenantId: '00000000-0000-0000-0000-000000000000' },
    select: { id: true },
  });
  await prisma.organization.update({ where: { id: org.id }, data: { tenantId: org.id } });

  const free = await prisma.plan.findUniqueOrThrow({ where: { key: 'free' } });
  await prisma.subscription.create({
    data: { tenantId: org.id, planId: free.id, tier: 'free', status: 'active' },
  });
  return org.id;
}

/** API Studio collections hang off a workspace, so one has to exist. */
async function newApiWorkspace(tenantId: string): Promise<string> {
  const row = await prisma.apiWorkspace.create({
    data: { tenantId, name: 'Test', slug: `ws-${(n += 1)}`, description: '' },
    select: { id: true },
  });
  return row.id;
}

const emptyDocument = { schemaVersion: 1, name: 'Test', pages: [], nodes: {} };

before(cleanup);
after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('API Studio collection ceiling', () => {
  it('allows five and refuses the sixth', async () => {
    const tenantId = await newWorkspace();
    const workspaceId = await newApiWorkspace(tenantId);

    for (let i = 0; i < 5; i += 1) {
      await createCollection(tenantId, null, {
        workspaceId,
        name: `Collection ${i}`,
        description: '',
        color: null,
        icon: null,
        tags: [],
        favorite: false,
        auth: INHERITED_AUTH,
        scripts: EMPTY_SCRIPTS,
        variables: [],
      });
    }

    await assert.rejects(
      createCollection(tenantId, null, {
        workspaceId,
        name: 'Sixth',
        description: '',
        color: null,
        icon: null,
        tags: [],
        favorite: false,
        auth: INHERITED_AUTH,
        scripts: EMPTY_SCRIPTS,
        variables: [],
      }),
      (error: unknown) => {
        assert.ok(error instanceof QuotaExceededError);
        assert.equal(error.denial.featureKey, 'api-studio.collections');
        assert.equal(error.denial.limit, 5);
        return true;
      },
    );

    // And the sixth really was not written. A check that throws after the
    // insert would leave the row behind and the ceiling would drift upward.
    assert.equal(await prisma.apiCollection.count({ where: { tenantId } }), 5);
  });

  it('frees a slot when one is deleted', async () => {
    // The whole reason stock is counted from the owning table rather than from
    // the usage log: a ceiling is not consumption.
    const tenantId = await newWorkspace();
    const workspaceId = await newApiWorkspace(tenantId);

    const created: string[] = [];
    for (let i = 0; i < 5; i += 1) {
      const row = await createCollection(tenantId, null, {
        workspaceId,
        name: `Collection ${i}`,
        description: '',
        color: null,
        icon: null,
        tags: [],
        favorite: false,
        auth: INHERITED_AUTH,
        scripts: EMPTY_SCRIPTS,
        variables: [],
      });
      created.push(row.id);
    }

    // Soft delete, which is what the product does.
    await prisma.apiCollection.update({
      where: { id: created[0]! },
      data: { deletedAt: new Date() },
    });

    const replacement = await createCollection(tenantId, null, {
      workspaceId,
      name: 'Replacement',
      description: '',
      color: null,
      icon: null,
      tags: [],
      favorite: false,
      auth: INHERITED_AUTH,
      scripts: EMPTY_SCRIPTS,
      variables: [],
    });

    assert.ok(replacement.id, 'deleting a collection must free its slot');
  });

  it('lets a premium workspace past the ceiling', async () => {
    const tenantId = await newWorkspace();
    const workspaceId = await newApiWorkspace(tenantId);
    const annual = await prisma.plan.findUniqueOrThrow({ where: { key: 'annual' } });
    await setSubscriptionPlan({
      tenantId,
      planId: annual.id,
      tier: 'premium',
      actorId: null,
      currentPeriodEnd: null,
    });

    for (let i = 0; i < 7; i += 1) {
      await createCollection(tenantId, null, {
        workspaceId,
        name: `Collection ${i}`,
        description: '',
        color: null,
        icon: null,
        tags: [],
        favorite: false,
        auth: INHERITED_AUTH,
        scripts: EMPTY_SCRIPTS,
        variables: [],
      });
    }

    assert.equal(await prisma.apiCollection.count({ where: { tenantId } }), 7);
  });

  it('never exceeds the ceiling under concurrency', async () => {
    // Two simultaneous creates must not both see four. This is why the check
    // lives inside the transaction that inserts, under the same lock.
    const tenantId = await newWorkspace();
    const workspaceId = await newApiWorkspace(tenantId);

    const attempts = await Promise.allSettled(
      Array.from({ length: 12 }, (_, i) =>
        createCollection(tenantId, null, {
          workspaceId,
          name: `Race ${i}`,
          description: '',
          color: null,
          icon: null,
          tags: [],
          favorite: false,
          auth: INHERITED_AUTH,
          scripts: EMPTY_SCRIPTS,
          variables: [],
        }),
      ),
    );

    const created = attempts.filter((a) => a.status === 'fulfilled').length;
    const stored = await prisma.apiCollection.count({ where: { tenantId, deletedAt: null } });

    // The property under test is that the ceiling is never EXCEEDED. How many
    // of the twelve get through is throughput, not correctness: they queue on
    // one advisory lock, and with a small connection pool most time out waiting
    // rather than being refused. Asserting exactly five conflated the two and
    // failed for a reason that had nothing to do with the limit.
    assert.ok(stored <= 5, `${stored} collections stored; the ceiling is 5`);
    assert.ok(stored >= 1, 'no create succeeded at all, so this proves nothing');
    assert.equal(created, stored, `${created} calls reported success but ${stored} rows exist`);

    // That exactly five are allowed when they are not fighting for a connection
    // is covered by the sequential test above.
  });
});

describe('Design Playground project ceiling', () => {
  it('allows five and refuses the sixth', async () => {
    const tenantId = await newWorkspace();

    for (let i = 0; i < 5; i += 1) {
      await createProject(tenantId, null, `Project ${i}`, emptyDocument as never);
    }

    await assert.rejects(
      createProject(tenantId, null, 'Sixth', emptyDocument as never),
      (error: unknown) => {
        assert.ok(error instanceof QuotaExceededError);
        assert.equal(error.denial.featureKey, 'design-playground.projects');
        return true;
      },
    );

    assert.equal(await prisma.designProject.count({ where: { tenantId } }), 5);
  });

  it('counts each workspace separately', async () => {
    const a = await newWorkspace();
    const b = await newWorkspace();

    for (let i = 0; i < 5; i += 1) {
      await createProject(a, null, `Project ${i}`, emptyDocument as never);
    }

    await assert.rejects(createProject(a, null, 'Sixth', emptyDocument as never), QuotaExceededError);
    // One workspace exhausting its ceiling must not affect another.
    assert.ok(await createProject(b, null, 'First', emptyDocument as never));
  });
});
