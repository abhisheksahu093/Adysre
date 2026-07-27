import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import { consume, getSubscription, checkUsage, release, resolveTier } from './service';
import { setSubscriptionPlan } from './repository';

/**
 * Entitlements against a real database.
 *
 * The property that cannot be tested any other way is atomicity. A
 * check-then-write quota passes every sequential test and fails under exactly
 * the concurrency an abuser produces, so the parallel cases here are the point
 * of the file.
 */

const PREFIX = 'enttest';
let n = 0;
const slug = () => `${PREFIX}-${process.pid}-${(n += 1)}`;

async function cleanup(): Promise<void> {
  const orgs = await prisma.organization.findMany({
    where: { slug: { startsWith: PREFIX } },
    select: { id: true },
  });
  const ids = orgs.map((o) => o.id);
  if (ids.length === 0) return;

  await prisma.featureUsageEvent.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.subscription.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.auditLog.deleteMany({ where: { tenantId: { in: ids } } });
  await prisma.organization.deleteMany({ where: { id: { in: ids } } });
}

/** A bare workspace. No users needed: quotas are counted per tenant. */
async function newWorkspace(): Promise<string> {
  const s = slug();
  const org = await prisma.organization.create({
    data: { name: `Ent ${s}`, slug: s, tenantId: '00000000-0000-0000-0000-000000000000' },
    select: { id: true },
  });
  // tenantId mirrors id on the tenant root.
  await prisma.organization.update({ where: { id: org.id }, data: { tenantId: org.id } });

  const free = await prisma.plan.findUniqueOrThrow({ where: { key: 'free' } });
  await prisma.subscription.create({
    data: { tenantId: org.id, planId: free.id, tier: 'free', status: 'active' },
  });
  return org.id;
}

before(cleanup);
after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('tier resolution', () => {
  it('reads the workspace subscription', async () => {
    const tenantId = await newWorkspace();
    assert.equal(await resolveTier(tenantId), 'free');
  });

  it('treats a workspace with no subscription as free', async () => {
    // Fails closed. The seed backfills these, but the resolver must not depend
    // on a seed having run.
    const s = slug();
    const org = await prisma.organization.create({
      data: { name: `Ent ${s}`, slug: s, tenantId: '00000000-0000-0000-0000-000000000000' },
      select: { id: true },
    });
    await prisma.organization.update({ where: { id: org.id }, data: { tenantId: org.id } });

    assert.equal(await resolveTier(org.id), 'free');
    assert.equal((await getSubscription(org.id)).planKey, 'free');
  });

  it('keeps entitlement through past_due', async () => {
    // A failed card must not take a paying customer's access away while the
    // provider's retry sequence runs.
    const tenantId = await newWorkspace();
    const annual = await prisma.plan.findUniqueOrThrow({ where: { key: 'annual' } });
    await prisma.subscription.update({
      where: { tenantId },
      data: { planId: annual.id, tier: 'premium', status: 'past_due' },
    });

    assert.equal(await resolveTier(tenantId), 'premium');
  });

  it('drops a cancelled subscription back to free', async () => {
    const tenantId = await newWorkspace();
    const annual = await prisma.plan.findUniqueOrThrow({ where: { key: 'annual' } });
    await prisma.subscription.update({
      where: { tenantId },
      data: { planId: annual.id, tier: 'premium', status: 'canceled' },
    });

    assert.equal(await resolveTier(tenantId), 'free');
  });
});

describe('consuming a quota', () => {
  it('allows up to the limit and refuses beyond it', async () => {
    const tenantId = await newWorkspace();

    // Seeded at 5 for the free tier.
    for (let i = 0; i < 5; i += 1) {
      const result = await consume({ tenantId, userId: null, featureKey: 'tools.qr.download' });
      assert.equal(result.ok, true, `download ${i + 1} should be allowed`);
    }

    const denied = await consume({ tenantId, userId: null, featureKey: 'tools.qr.download' });
    assert.equal(denied.ok, false);
    assert.equal(denied.denial?.limit, 5);
    assert.equal(denied.denial?.remaining, 0);
    assert.equal(denied.denial?.tier, 'free');
  });

  it('NEVER exceeds the limit under concurrency', async () => {
    // The reason the whole thing runs under an advisory lock. Twenty callers
    // arrive together; a check-then-write implementation lets most of them
    // through because they all read the same count.
    const tenantId = await newWorkspace();

    const outcomes = await Promise.all(
      Array.from({ length: 20 }, () =>
        consume({ tenantId, userId: null, featureKey: 'tools.qr.download' }),
      ),
    );

    const allowed = outcomes.filter((o) => o.ok).length;
    assert.equal(allowed, 5, `${allowed} of 20 concurrent calls were allowed; the limit is 5`);

    // And the ledger agrees with the answers given.
    const feature = await prisma.feature.findUniqueOrThrow({
      where: { key: 'tools.qr.download' },
    });
    const total = await prisma.featureUsageEvent.aggregate({
      where: { tenantId, featureId: feature.id },
      _sum: { quantity: true },
    });
    assert.equal(total._sum.quantity, 5);
  });

  it('counts a multi-unit consume as its whole quantity', async () => {
    const tenantId = await newWorkspace();

    assert.equal(
      (await consume({ tenantId, userId: null, featureKey: 'tools.qr.download', quantity: 4 })).ok,
      true,
    );
    // One left, so a request for two must fail rather than partially succeed.
    const denied = await consume({
      tenantId,
      userId: null,
      featureKey: 'tools.qr.download',
      quantity: 2,
    });
    assert.equal(denied.ok, false, 'a request larger than the remainder must be refused whole');

    assert.equal(
      (await consume({ tenantId, userId: null, featureKey: 'tools.qr.download' })).ok,
      true,
    );
  });

  it('refuses a feature that is not on the tier at all', async () => {
    // limit 0, which reads differently from "spent" in the UI.
    const tenantId = await newWorkspace();
    const result = await consume({ tenantId, userId: null, featureKey: 'builder.generate-code' });

    assert.equal(result.ok, false);
    assert.equal(result.denial?.locked, true);
    assert.equal(result.denial?.limit, 0);
  });

  it('never denies an unlimited tier, and writes no events for it', async () => {
    const tenantId = await newWorkspace();
    const annual = await prisma.plan.findUniqueOrThrow({ where: { key: 'annual' } });
    await setSubscriptionPlan({
      tenantId,
      planId: annual.id,
      tier: 'premium',
      actorId: null,
      currentPeriodEnd: null,
    });

    for (let i = 0; i < 12; i += 1) {
      assert.equal(
        (await consume({ tenantId, userId: null, featureKey: 'tools.qr.download' })).ok,
        true,
      );
    }

    // Recording every action for a workspace with no limit would grow the
    // table without bound to answer a question nobody asks.
    const feature = await prisma.feature.findUniqueOrThrow({
      where: { key: 'tools.qr.download' },
    });
    assert.equal(
      await prisma.featureUsageEvent.count({ where: { tenantId, featureId: feature.id } }),
      0,
    );
  });

  it('refuses to consume a stock feature', async () => {
    // Its ceiling is counted from the owning table at creation; a usage event
    // here would be written and never read.
    const tenantId = await newWorkspace();
    await assert.rejects(
      consume({ tenantId, userId: null, featureKey: 'api-studio.collections' }),
      /stock feature/,
    );
  });

  it('rejects an unknown feature rather than allowing it', async () => {
    // Allowing would silently disable a gate the moment somebody mistyped a key.
    const tenantId = await newWorkspace();
    await assert.rejects(
      consume({ tenantId, userId: null, featureKey: 'nope.does.not-exist' }),
      /No feature is registered/,
    );
  });

  it('rejects a non-positive quantity', async () => {
    const tenantId = await newWorkspace();
    await assert.rejects(
      consume({ tenantId, userId: null, featureKey: 'tools.qr.download', quantity: 0 }),
      /positive integer/,
    );
  });
});

describe('two limits on one feature', () => {
  it('enforces the daily cap before the weekly one', async () => {
    // Website Intelligence: 3 per rolling 24h AND 5 per rolling week.
    const tenantId = await newWorkspace();

    for (let i = 0; i < 3; i += 1) {
      assert.equal(
        (await consume({ tenantId, userId: null, featureKey: 'website-intel.scan' })).ok,
        true,
      );
    }

    const denied = await consume({ tenantId, userId: null, featureKey: 'website-intel.scan' });
    assert.equal(denied.ok, false);
    // The reported limit is the binding one, the daily 3, not the weekly 5.
    // Saying "5" here would tell a user they have two left when they have none.
    assert.equal(denied.denial?.limit, 3);
    assert.equal(denied.denial?.windowKind, 'rolling');
    assert.ok(denied.denial?.resetsAt, 'a rolling denial must say when a slot frees');
  });

  it('applies the weekly cap once the daily one has rolled over', async () => {
    const tenantId = await newWorkspace();
    const feature = await prisma.feature.findUniqueOrThrow({
      where: { key: 'website-intel.scan' },
    });

    // Three scans two days ago: outside the 24h window, inside the week.
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 3600 * 1000);
    await prisma.featureUsageEvent.createMany({
      data: Array.from({ length: 3 }, () => ({
        tenantId,
        featureId: feature.id,
        quantity: 1,
        occurredAt: twoDaysAgo,
      })),
    });

    // Two more are allowed: the day is clear, and the week has 2 of 5 left.
    assert.equal((await consume({ tenantId, userId: null, featureKey: 'website-intel.scan' })).ok, true);
    assert.equal((await consume({ tenantId, userId: null, featureKey: 'website-intel.scan' })).ok, true);

    const denied = await consume({ tenantId, userId: null, featureKey: 'website-intel.scan' });
    assert.equal(denied.ok, false, 'the weekly cap should bind once the day is clear');
    assert.equal(denied.denial?.limit, 5);
  });
});

describe('checking without consuming', () => {
  it('reports remaining and does not spend it', async () => {
    const tenantId = await newWorkspace();
    await consume({ tenantId, userId: null, featureKey: 'tools.ats.scan' });

    const first = await checkUsage(tenantId, 'tools.ats.scan');
    assert.equal(first?.used, 1);
    assert.equal(first?.remaining, 4);
    assert.equal(first?.allowed, true);

    // Checking twice must not change the answer.
    const second = await checkUsage(tenantId, 'tools.ats.scan');
    assert.equal(second?.used, 1);
  });

  it('marks a zero-limit feature as locked rather than merely spent', async () => {
    const tenantId = await newWorkspace();
    const usage = await checkUsage(tenantId, 'builder.generate-code');
    assert.equal(usage?.locked, true);
    assert.equal(usage?.allowed, false);
  });

  it('reports unlimited as a null limit, not a big number', async () => {
    const tenantId = await newWorkspace();
    const annual = await prisma.plan.findUniqueOrThrow({ where: { key: 'annual' } });
    await setSubscriptionPlan({
      tenantId,
      planId: annual.id,
      tier: 'premium',
      actorId: null,
      currentPeriodEnd: null,
    });

    const usage = await checkUsage(tenantId, 'tools.qr.download');
    assert.equal(usage?.limit, null);
    assert.equal(usage?.remaining, null);
    assert.equal(usage?.allowed, true);
  });

  it('says which features the server cannot actually enforce', async () => {
    // The Tool Suite runs in the browser, so its limits are client-reported.
    // Labelling them stops a caller mistaking one for a guarantee.
    const tenantId = await newWorkspace();
    assert.equal((await checkUsage(tenantId, 'website-intel.scan'))?.enforcement, 'server');
    assert.equal((await checkUsage(tenantId, 'tools.resume.generate'))?.enforcement, 'client-reported');
  });

  it('returns null for an unknown key', async () => {
    const tenantId = await newWorkspace();
    assert.equal(await checkUsage(tenantId, 'nope.not.real'), null);
  });
});

describe('releasing a consumed unit', () => {
  it('gives the unit back', async () => {
    // For work that was charged and then failed.
    const tenantId = await newWorkspace();
    const consumed = await consume({ tenantId, userId: null, featureKey: 'tools.qr.download' });
    assert.ok(consumed.eventId);

    assert.equal(await release(tenantId, consumed.eventId), true);
    assert.equal((await checkUsage(tenantId, 'tools.qr.download'))?.used, 0);
  });

  it('will not release another workspace’s event', async () => {
    const a = await newWorkspace();
    const b = await newWorkspace();
    const consumed = await consume({ tenantId: a, userId: null, featureKey: 'tools.qr.download' });

    assert.equal(await release(b, consumed.eventId!), false);
    assert.equal((await checkUsage(a, 'tools.qr.download'))?.used, 1);
  });
});

describe('tenant isolation', () => {
  it('counts each workspace separately', async () => {
    const a = await newWorkspace();
    const b = await newWorkspace();

    for (let i = 0; i < 5; i += 1) {
      await consume({ tenantId: a, userId: null, featureKey: 'tools.qr.download' });
    }

    assert.equal((await consume({ tenantId: a, userId: null, featureKey: 'tools.qr.download' })).ok, false);
    assert.equal(
      (await consume({ tenantId: b, userId: null, featureKey: 'tools.qr.download' })).ok,
      true,
      'one workspace exhausting its quota must not affect another',
    );
  });
});
