import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

import { prisma } from '@adysre/database';
import { rateLimit } from './rate-limit';
import { clearKey, countRequest, sweepExpired } from './repository/rate-limit.repository';
import { sweepExpiredRecords } from './retention';

/**
 * Rate limiting and retention, against a real database.
 *
 * The interesting property here is atomicity, and it cannot be tested without
 * genuine concurrency against genuine Postgres: a read-then-write limiter looks
 * correct in every sequential test and fails exactly under the parallel load an
 * attacker produces.
 */

const PREFIX = 'dbtest-limit';
let n = 0;
const key = () => `${PREFIX}:${process.pid}:${(n += 1)}`;

async function cleanup(): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key: { startsWith: PREFIX } } });
}

before(cleanup);
after(async () => {
  await cleanup();
  await prisma.$disconnect();
});

describe('rate limiting', () => {
  it('allows up to the limit and refuses beyond it', async () => {
    const k = key();
    for (let i = 0; i < 3; i += 1) {
      const result = await rateLimit(k, { max: 3, windowSec: 60 });
      assert.equal(result.ok, true, `request ${i + 1} should be allowed`);
    }

    const blocked = await rateLimit(k, { max: 3, windowSec: 60 });
    assert.equal(blocked.ok, false);
    assert.ok(blocked.retryAfter > 0, 'a refusal must say when to retry');
    assert.ok(blocked.retryAfter <= 60);
  });

  it('reports how many requests remain', async () => {
    const k = key();
    assert.equal((await rateLimit(k, { max: 5, windowSec: 60 })).remaining, 4);
    assert.equal((await rateLimit(k, { max: 5, windowSec: 60 })).remaining, 3);
  });

  it('counts atomically under concurrency', async () => {
    // The whole reason the counter is one INSERT ... ON CONFLICT statement. A
    // read followed by a write lets twenty parallel callers all observe the
    // same count and all pass a limit they should have exhausted, which is
    // precisely the shape of traffic an attacker generates.
    const k = key();
    const results = await Promise.all(
      Array.from({ length: 20 }, () => countRequest(k, 60)),
    );

    const counts = results.map((r) => r.count).sort((a, b) => a - b);
    assert.deepEqual(
      counts,
      Array.from({ length: 20 }, (_, i) => i + 1),
      'every concurrent request must observe a distinct, consecutive count',
    );
  });

  it('never lets more than `max` through, even in parallel', async () => {
    const k = key();
    const outcomes = await Promise.all(
      Array.from({ length: 15 }, () => rateLimit(k, { max: 5, windowSec: 60 })),
    );
    assert.equal(outcomes.filter((o) => o.ok).length, 5);
  });

  it('starts a fresh window once the old one expires', async () => {
    const k = key();
    await countRequest(k, 60);
    await countRequest(k, 60);

    // Expire it by hand rather than waiting: the rollover is what is under
    // test, not the clock.
    await prisma.rateLimit.update({
      where: { key: k },
      data: { resetAt: new Date(Date.now() - 1000) },
    });

    const rolled = await countRequest(k, 60);
    assert.equal(rolled.count, 1, 'an expired window must reset to 1, not increment');
    assert.ok(rolled.resetAt.getTime() > Date.now(), 'the new window must be in the future');
  });

  it('keeps separate keys separate', async () => {
    const a = key();
    const b = key();
    await countRequest(a, 60);
    await countRequest(a, 60);
    const other = await countRequest(b, 60);
    assert.equal(other.count, 1, 'one key exhausting its window must not affect another');
  });

  it('can be cleared by key', async () => {
    const k = key();
    await countRequest(k, 60);
    await clearKey(k);
    assert.equal((await countRequest(k, 60)).count, 1);
  });
});

describe('retention', () => {
  it('removes expired rate limit windows and keeps live ones', async () => {
    const expired = key();
    const live = key();

    await prisma.rateLimit.create({
      data: { key: expired, count: 5, resetAt: new Date(Date.now() - 60_000) },
    });
    await prisma.rateLimit.create({
      data: { key: live, count: 1, resetAt: new Date(Date.now() + 600_000) },
    });

    await sweepExpired();

    assert.equal(await prisma.rateLimit.count({ where: { key: expired } }), 0);
    assert.equal(
      await prisma.rateLimit.count({ where: { key: live } }),
      1,
      'a window that has not expired must survive the sweep',
    );
  });

  it('reports what it removed', async () => {
    const k = key();
    await prisma.rateLimit.create({
      data: { key: k, count: 1, resetAt: new Date(Date.now() - 1000) },
    });

    const result = await sweepExpiredRecords();
    assert.ok(result.rateLimits >= 1);
    // Every bucket must be present, so a caller can log the whole picture
    // rather than discovering a missing key at 3am.
    assert.ok(typeof result.sessions === 'number');
    assert.ok(typeof result.passwordResets === 'number');
    assert.ok(typeof result.emailVerifications === 'number');
  });

  it('keeps sessions inside the grace period', async () => {
    // Thirty days PAST expiry, not at expiry: an incident investigation starts
    // weeks later and needs to see which sessions existed.
    const org = await prisma.organization.findFirst({ select: { id: true } });
    const user = org
      ? await prisma.user.findFirst({ where: { tenantId: org.id }, select: { id: true } })
      : null;
    if (!org || !user) return; // Unseeded database; nothing meaningful to assert.

    const recentlyExpired = await prisma.session.create({
      data: {
        tenantId: org.id,
        userId: user.id,
        refreshTokenHash: `dbtest-grace-${process.pid}`,
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // expired yesterday
      },
      select: { id: true },
    });

    await sweepExpiredRecords();

    const survived = await prisma.session.count({ where: { id: recentlyExpired.id } });
    assert.equal(survived, 1, 'a session expired yesterday is still evidence');

    await prisma.session.delete({ where: { id: recentlyExpired.id } });
  });
});
