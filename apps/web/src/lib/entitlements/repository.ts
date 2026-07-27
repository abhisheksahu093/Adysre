import 'server-only';
import { Prisma, prisma } from '@adysre/database';
import { createId } from '@/modules/api-studio/utils/ids';
import type { MeterKind, SubscriptionTier, UsageWindow } from './types';

/**
 * Every database call the entitlement system makes.
 *
 * The one thing here that is not an ordinary query is `consumeWithLock`, and it
 * is the reason this file exists: counting and inserting must happen inside one
 * transaction holding a lock, or concurrent callers each see the same count and
 * each pass a limit they should have exhausted together.
 */

export interface FeatureRow {
  id: string;
  key: string;
  module: string;
  name: string;
  description: string | null;
  meterKind: MeterKind;
  unit: string;
  sortOrder: number;
}

export interface LimitRow {
  limitValue: number | null;
  windowKind: UsageWindow;
  windowSeconds: number | null;
}

export interface SubscriptionRow {
  tier: SubscriptionTier;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  plan: { key: string; name: string; priceCents: number; currency: string; billingInterval: string | null };
}

/**
 * A Prisma client, or the transaction client when one is open.
 *
 * Every read that can happen INSIDE a caller's transaction takes this. Using
 * the global client there would ask the pool for a SECOND connection while the
 * first is still held by the transaction, which doubles connection demand under
 * load and deadlocks outright at `connection_limit=1` - the documented
 * production setting - because the transaction can never release the connection
 * the query is waiting for.
 */
export type Db = Prisma.TransactionClient | typeof prisma;

/** The workspace's subscription, or null when it has none. */
export async function findSubscription(
  tenantId: string,
  db: Db = prisma,
): Promise<SubscriptionRow | null> {
  return db.subscription.findFirst({
    where: { tenantId, deletedAt: null },
    select: {
      tier: true,
      status: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      plan: {
        select: { key: true, name: true, priceCents: true, currency: true, billingInterval: true },
      },
    },
  });
}

/** Every active feature with the limits that apply to one tier. */
export async function listFeaturesForTier(
  tier: SubscriptionTier,
): Promise<{ feature: FeatureRow; limits: LimitRow[] }[]> {
  const rows = await prisma.feature.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      key: true,
      module: true,
      name: true,
      description: true,
      meterKind: true,
      unit: true,
      sortOrder: true,
      // Only this tier's limits. Loading all three and filtering in JS would
      // triple the rows for no benefit.
      tierLimits: {
        where: { tier },
        select: { limitValue: true, windowKind: true, windowSeconds: true },
      },
    },
  });

  return rows.map(({ tierLimits, ...feature }) => ({ feature, limits: tierLimits }));
}

export async function findFeatureByKey(
  key: string,
  db: Db = prisma,
): Promise<FeatureRow | null> {
  return db.feature.findUnique({
    where: { key },
    select: {
      id: true,
      key: true,
      module: true,
      name: true,
      description: true,
      meterKind: true,
      unit: true,
      sortOrder: true,
    },
  });
}

export async function findLimits(
  featureId: string,
  tier: SubscriptionTier,
  db: Db = prisma,
): Promise<LimitRow[]> {
  return db.tierFeature.findMany({
    where: { featureId, tier },
    select: { limitValue: true, windowKind: true, windowSeconds: true },
  });
}

/** Units consumed since `since` (or ever, when null), and the oldest one counted. */
export async function sumUsage(
  tenantId: string,
  featureId: string,
  since: Date | null,
  db: Db = prisma,
): Promise<{ used: number; oldest: Date | null }> {
  const where = {
    tenantId,
    featureId,
    ...(since ? { occurredAt: { gte: since } } : {}),
  };

  const [aggregate, oldest] = await Promise.all([
    db.featureUsageEvent.aggregate({ where, _sum: { quantity: true } }),
    db.featureUsageEvent.findFirst({
      where,
      orderBy: { occurredAt: 'asc' },
      select: { occurredAt: true },
    }),
  ]);

  return { used: aggregate._sum.quantity ?? 0, oldest: oldest?.occurredAt ?? null };
}

export interface ConsumeAttempt {
  tenantId: string;
  userId: string | null;
  featureId: string;
  featureKey: string;
  quantity: number;
  /** Every limit that must pass, with its window start resolved by the caller. */
  checks: { limit: number; since: Date | null }[];
  metadata?: Record<string, unknown> | undefined;
}

export type ConsumeOutcome =
  | { ok: true; eventId: string }
  | { ok: false; failed: { limit: number; used: number; since: Date | null } };

/**
 * Count and insert inside one transaction, holding a lock.
 *
 * The lock is the whole point. Without it two concurrent callers both read
 * "4 of 5", both pass, and the workspace ends with 6 - the same
 * time-of-check-to-time-of-use race the rate limiter had before its counter
 * became a single statement.
 *
 * `pg_advisory_xact_lock` is used rather than a row lock because there is no
 * row to lock: the count is an aggregate over events that do not exist yet. It
 * is keyed on (tenant, feature), so two different features never wait on each
 * other, and it releases automatically when the transaction ends, including on
 * error. A lock that had to be released by hand would eventually be leaked by
 * an exception on a path nobody tested.
 */
export async function consumeWithLock(attempt: ConsumeAttempt): Promise<ConsumeOutcome> {
  return prisma.$transaction(async (tx) => {
    // hashtext gives two int4s, which is what the two-argument form takes.
    // Keying on both halves makes a collision between different features
    // vanishingly unlikely, and a collision would only cost a little
    // contention, never correctness.
    await tx.$executeRaw`
      SELECT pg_advisory_xact_lock(hashtext(${attempt.tenantId}), hashtext(${attempt.featureKey}))
    `;

    for (const check of attempt.checks) {
      const aggregate = await tx.featureUsageEvent.aggregate({
        where: {
          tenantId: attempt.tenantId,
          featureId: attempt.featureId,
          ...(check.since ? { occurredAt: { gte: check.since } } : {}),
        },
        _sum: { quantity: true },
      });
      const used = aggregate._sum.quantity ?? 0;

      if (used + attempt.quantity > check.limit) {
        // Returning rather than throwing: the transaction commits having
        // written nothing, which is the correct outcome and avoids dressing an
        // ordinary denial up as an error.
        return { ok: false as const, failed: { limit: check.limit, used, since: check.since } };
      }
    }

    const event = await tx.featureUsageEvent.create({
      data: {
        id: createId(),
        tenantId: attempt.tenantId,
        userId: attempt.userId,
        featureId: attempt.featureId,
        quantity: attempt.quantity,
        // Spread rather than assigned: under `exactOptionalPropertyTypes`,
        // Prisma's Json input refuses an explicit `undefined`, so the key has to
        // be absent rather than present and empty.
        ...(attempt.metadata ? { metadata: attempt.metadata as Prisma.InputJsonValue } : {}),
      },
      select: { id: true },
    });

    return { ok: true as const, eventId: event.id };
  });
}

/**
 * Give back a consumed unit.
 *
 * For work that was charged and then failed. Scoped by tenant so one workspace
 * cannot release another's event by guessing an id.
 */
export async function releaseEvent(tenantId: string, eventId: string): Promise<boolean> {
  const { count } = await prisma.featureUsageEvent.deleteMany({ where: { id: eventId, tenantId } });
  return count > 0;
}

/** Reserve a stock slot: count live rows under the same lock the create runs in. */
export async function countUnderLock(
  tx: Prisma.TransactionClient,
  tenantId: string,
  featureKey: string,
): Promise<void> {
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(hashtext(${tenantId}), hashtext(${featureKey}))
  `;
}

export async function findPlanByKey(key: string) {
  return prisma.plan.findFirst({
    where: { key, isActive: true },
    select: { id: true, key: true, tier: true, name: true, priceCents: true, currency: true, billingInterval: true },
  });
}

export async function listActivePlans() {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { key: true, tier: true, name: true, priceCents: true, currency: true, billingInterval: true },
  });
}

/** Move a workspace onto a plan. Used by the upgrade flow and by webhooks. */
export async function setSubscriptionPlan(input: {
  tenantId: string;
  planId: string;
  tier: SubscriptionTier;
  actorId: string | null;
  currentPeriodEnd: Date | null;
}): Promise<void> {
  await prisma.subscription.upsert({
    where: { tenantId: input.tenantId },
    update: {
      planId: input.planId,
      tier: input.tier,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: input.currentPeriodEnd,
      cancelAtPeriodEnd: false,
      updatedBy: input.actorId,
    },
    create: {
      id: createId(),
      tenantId: input.tenantId,
      planId: input.planId,
      tier: input.tier,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: input.currentPeriodEnd,
      createdBy: input.actorId,
      updatedBy: input.actorId,
    },
  });
}
