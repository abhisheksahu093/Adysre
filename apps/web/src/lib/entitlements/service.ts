import 'server-only';
import type { Prisma } from '@adysre/database';
import {
  consumeWithLock,
  countUnderLock,
  findFeatureByKey,
  findLimits,
  findSubscription,
  listFeaturesForTier,
  releaseEvent,
  sumUsage,
  type FeatureRow,
  type LimitRow,
} from './repository';
import { countStock, enforcementFor, hasStockCounter } from './stock';
import { soonestReset, windowResetsAt, windowStart } from './windows';
import type {
  FeatureUsage,
  QuotaDenial,
  SubscriptionSummary,
  SubscriptionTier,
} from './types';

/**
 * Deciding what a workspace may do.
 *
 * Every number here comes from the database. Nothing in this file, and nothing
 * above it, knows that Free gets five of anything.
 */

/**
 * The tier a workspace is on.
 *
 * **Fails closed.** A missing subscription, an unreachable database or a
 * cancelled plan all resolve to `free`. A bug then withholds a paid feature,
 * which someone reports in minutes, rather than giving the product away
 * silently to everyone.
 */
export async function resolveTier(tenantId: string): Promise<SubscriptionTier> {
  try {
    const subscription = await findSubscription(tenantId);
    if (!subscription) return 'free';
    return isEntitling(subscription.status) ? subscription.tier : 'free';
  } catch (error) {
    console.error(
      `[entitlements] could not resolve tier for ${tenantId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return 'free';
  }
}

/**
 * Statuses that still grant access.
 *
 * `past_due` deliberately does: a failed card should not take away a paid
 * customer's data access while the retry sequence runs. Dunning belongs to the
 * payment provider, and cutting someone off on the first failed charge loses
 * far more than the outstanding invoice.
 */
function isEntitling(status: string): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due';
}

export async function getSubscription(tenantId: string): Promise<SubscriptionSummary> {
  const subscription = await findSubscription(tenantId);

  // A workspace with no row is on the free plan; the seed backfills these, but
  // the resolver must not depend on a seed having run.
  if (!subscription) {
    return {
      tier: 'free',
      planKey: 'free',
      planName: 'Free',
      status: 'active',
      priceCents: 0,
      currency: 'USD',
      billingInterval: null,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
      isPaid: false,
    };
  }

  const tier = isEntitling(subscription.status) ? subscription.tier : 'free';

  return {
    tier,
    planKey: subscription.plan.key,
    planName: subscription.plan.name,
    status: subscription.status,
    priceCents: subscription.plan.priceCents,
    currency: subscription.plan.currency,
    billingInterval: subscription.plan.billingInterval,
    currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
    isPaid: tier !== 'free',
  };
}

/**
 * Every feature, its limit and what is left, in one call.
 *
 * One request rather than one per badge: a page showing eight gated controls
 * would otherwise make eight round trips before it could render any of them.
 */
export async function getUsage(tenantId: string, now = new Date()): Promise<FeatureUsage[]> {
  const tier = await resolveTier(tenantId);
  const features = await listFeaturesForTier(tier);

  return Promise.all(
    features.map(({ feature, limits }) => describeUsage(tenantId, feature, limits, now)),
  );
}

/** One feature's state, without consuming anything. */
export async function checkUsage(
  tenantId: string,
  featureKey: string,
  now = new Date(),
): Promise<FeatureUsage | null> {
  const tier = await resolveTier(tenantId);
  const feature = await findFeatureByKey(featureKey);
  if (!feature) return null;

  const limits = await findLimits(feature.id, tier);
  return describeUsage(tenantId, feature, limits, now);
}

/**
 * Build the public view of one feature.
 *
 * When several limits apply, the binding one is whichever leaves least. That is
 * the number a badge must show: reporting the weekly cap while the daily one is
 * spent would tell a user they have four left when they have none.
 */
async function describeUsage(
  tenantId: string,
  feature: FeatureRow,
  limits: LimitRow[],
  now: Date,
): Promise<FeatureUsage> {
  const base = {
    key: feature.key,
    module: feature.module,
    name: feature.name,
    description: feature.description,
    meterKind: feature.meterKind,
    enforcement: enforcementFor(feature.key),
    unit: feature.unit,
  };

  // No row for this tier means no restriction. Paid tiers are seeded with a
  // null limit, but an unseeded feature must not accidentally deny everything.
  const capped = limits.filter((limit) => limit.limitValue !== null);
  if (capped.length === 0) {
    return {
      ...base,
      limit: null,
      used: 0,
      remaining: null,
      windowKind: limits[0]?.windowKind ?? 'none',
      windowSeconds: null,
      resetsAt: null,
      allowed: true,
      locked: false,
    };
  }

  const evaluated = await Promise.all(
    capped.map(async (limit) => {
      const since = windowStart(limit.windowKind, limit.windowSeconds, now);
      const { used, oldest } = await measure(tenantId, feature, since);
      return {
        limit: limit.limitValue!,
        windowKind: limit.windowKind,
        windowSeconds: limit.windowSeconds,
        used,
        remaining: Math.max(0, limit.limitValue! - used),
        resetsAt: windowResetsAt(limit.windowKind, limit.windowSeconds, now, oldest),
      };
    }),
  );

  // The binding limit is the one with least headroom. Ties break toward the
  // soonest reset, so the user is told the shortest wait that is true.
  const least = Math.min(...evaluated.map((e) => e.remaining));
  const binding = soonestReset(evaluated.filter((e) => e.remaining === least)) ?? evaluated[0]!;

  return {
    ...base,
    limit: binding.limit,
    used: binding.used,
    remaining: binding.remaining,
    windowKind: binding.windowKind,
    windowSeconds: binding.windowSeconds,
    resetsAt: binding.resetsAt?.toISOString() ?? null,
    allowed: binding.remaining > 0,
    // Zero is "not on this tier at all", which reads differently from "spent":
    // one is an upgrade prompt, the other may just be a wait.
    locked: binding.limit === 0,
  };
}

/** Stock counts live rows; flow sums the event log. */
async function measure(
  tenantId: string,
  feature: FeatureRow,
  since: Date | null,
): Promise<{ used: number; oldest: Date | null }> {
  if (feature.meterKind === 'stock') {
    const count = await countStock(feature.key, tenantId);

    // No counter means the rows live only in the browser (the page builder
    // keeps its document in localStorage and never posts it). The server
    // therefore reports 0 used and the real LIMIT, and the client compares that
    // limit against its own count.
    //
    // Reporting the limit as fully spent instead would be worse: it would block
    // a feature nobody has used yet. This is the honest half-measure for a
    // feature the server genuinely cannot see, and `enforcement` marks it so no
    // caller mistakes it for a server-side guarantee.
    return { used: count ?? 0, oldest: null };
  }
  return sumUsage(tenantId, feature.id, since);
}

export interface ConsumeResult {
  ok: boolean;
  /** Present on success. Pass to `release` if the work then fails. */
  eventId?: string;
  denial?: QuotaDenial;
}

/**
 * Take one or more units, atomically.
 *
 * The ONLY call that may authorise a metered action. `checkUsage` is advisory:
 * between reading it and acting on it, another request can spend the last unit.
 *
 * Consume BEFORE doing the work, then `release` if the work fails. Consuming
 * afterwards lets a caller take the work and never be counted, which is the
 * same as no limit at all for anyone who closes the tab at the right moment.
 */
export async function consume(input: {
  tenantId: string;
  userId: string | null;
  featureKey: string;
  // `| undefined` is explicit: this workspace runs with
  // `exactOptionalPropertyTypes`, where an absent key and a key set to
  // undefined are different types, and a parsed optional field is the latter.
  quantity?: number | undefined;
  metadata?: Record<string, unknown> | undefined;
  now?: Date | undefined;
}): Promise<ConsumeResult> {
  const now = input.now ?? new Date();
  const quantity = input.quantity ?? 1;

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`quantity must be a positive integer, got ${quantity}`);
  }

  const tier = await resolveTier(input.tenantId);
  const feature = await findFeatureByKey(input.featureKey);
  if (!feature) throw new UnknownFeatureError(input.featureKey);

  const limits = await findLimits(feature.id, tier);
  const capped = limits.filter((limit) => limit.limitValue !== null);

  // Unlimited: nothing to check, and nothing worth recording. Writing an event
  // per action for paid workspaces would grow the table without bound to
  // answer a question nobody asks.
  if (capped.length === 0) return { ok: true };

  // A stock ceiling is not consumed through this path: it is counted from the
  // owning table at creation time, inside the caller's own transaction. Calling
  // consume for one would write a usage event nothing ever reads.
  if (feature.meterKind === 'stock') {
    throw new Error(
      `${feature.key} is a stock feature; enforce it with reserveStock at the point of creation.`,
    );
  }

  const outcome = await consumeWithLock({
    tenantId: input.tenantId,
    userId: input.userId,
    featureId: feature.id,
    featureKey: feature.key,
    quantity,
    checks: capped.map((limit) => ({
      limit: limit.limitValue!,
      since: windowStart(limit.windowKind, limit.windowSeconds, now),
    })),
    metadata: input.metadata,
  });

  if (outcome.ok) return { ok: true, eventId: outcome.eventId };

  // Rebuild the public view so the denial carries exactly what the modal needs
  // and the client never keeps a second copy of the limits.
  const usage = await describeUsage(input.tenantId, feature, limits, now);

  return {
    ok: false,
    denial: {
      featureKey: feature.key,
      featureName: feature.name,
      unit: feature.unit,
      limit: usage.limit ?? outcome.failed.limit,
      used: usage.used,
      remaining: usage.remaining ?? 0,
      windowKind: usage.windowKind,
      resetsAt: usage.resetsAt,
      tier,
      locked: usage.locked,
    },
  };
}

/** Give a consumed unit back, for work that was charged and then failed. */
export async function release(tenantId: string, eventId: string): Promise<boolean> {
  return releaseEvent(tenantId, eventId);
}

/**
 * Check a stock ceiling at the moment of creation.
 *
 * Stock is counted from the owning table, so it cannot be reserved ahead of
 * time the way a flow unit can. The check has to happen inside the same
 * transaction as the INSERT, under the same lock, or two simultaneous creates
 * both count four and both proceed.
 *
 * Usage, from inside a repository that is already writing:
 *
 *   await prisma.$transaction(async (tx) => {
 *     const denial = await reserveStock(tx, { tenantId, featureKey, tier });
 *     if (denial) return { denied: denial };
 *     return { row: await tx.apiCollection.create({ ... }) };
 *   });
 */
export async function reserveStock(
  tx: Prisma.TransactionClient,
  input: { tenantId: string; featureKey: string; now?: Date },
): Promise<QuotaDenial | null> {
  // EVERY read here goes through `tx`. Using the global client while the
  // caller's transaction is open asks the pool for a second connection that
  // cannot be released until the first one finishes, which at the documented
  // production setting of `connection_limit=1` deadlocks every create outright,
  // and under any small pool turns contention into transaction timeouts.
  const subscription = await findSubscription(input.tenantId, tx);
  const tier =
    subscription && isEntitling(subscription.status) ? subscription.tier : 'free';

  const feature = await findFeatureByKey(input.featureKey, tx);
  if (!feature) throw new UnknownFeatureError(input.featureKey);

  const limits = await findLimits(feature.id, tier, tx);
  const capped = limits.filter((limit) => limit.limitValue !== null);
  if (capped.length === 0) return null;

  if (!hasStockCounter(feature.key)) {
    // Nothing server-side to count, so nothing to enforce here. Denying would
    // block a feature the server cannot even see; the client gate is what
    // applies, and `enforcement` says so.
    return null;
  }

  // Taken as late as possible, after every lookup, so the lock is held for one
  // count rather than for four queries. Held for the rest of the caller's
  // transaction, so the count and the INSERT that follows cannot interleave
  // with another create.
  await countUnderLock(tx, input.tenantId, feature.key);

  const used = await countStock(feature.key, input.tenantId, tx);
  const limit = Math.min(...capped.map((row) => row.limitValue!));

  if ((used ?? 0) + 1 <= limit) return null;

  return {
    featureKey: feature.key,
    featureName: feature.name,
    unit: feature.unit,
    limit,
    used: used ?? 0,
    remaining: 0,
    windowKind: 'none',
    resetsAt: null,
    tier,
    locked: limit === 0,
  };
}

/**
 * A quota refusal, as an exception.
 *
 * Repositories already return domain objects, and threading a denial back
 * through every one of them would change signatures all the way up for a case
 * that is not an ordinary result. Throwing lets the check live at the point of
 * creation, inside the transaction where it has to be, while route handlers
 * catch it in one place.
 */
export class QuotaExceededError extends Error {
  constructor(readonly denial: QuotaDenial) {
    super(
      denial.locked
        ? `${denial.featureName} is not included in this plan.`
        : `Limit of ${denial.limit} ${denial.unit}s reached.`,
    );
    this.name = 'QuotaExceededError';
  }
}

/**
 * Reserve a stock slot or refuse, from inside the caller's transaction.
 *
 * Must be called with the SAME `tx` that performs the insert. Called with a
 * different client, or outside a transaction, the lock is released before the
 * row is written and two concurrent creates can both pass.
 */
export async function enforceStock(
  tx: Prisma.TransactionClient,
  input: { tenantId: string; featureKey: string; now?: Date },
): Promise<void> {
  const denial = await reserveStock(tx, input);
  if (denial) throw new QuotaExceededError(denial);
}

export class UnknownFeatureError extends Error {
  constructor(readonly featureKey: string) {
    super(`No feature is registered under the key "${featureKey}".`);
    this.name = 'UnknownFeatureError';
  }
}

export { hasStockCounter };
