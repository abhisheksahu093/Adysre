import type { FeatureUsage, QuotaDenial, SubscriptionSummary } from './types';

/**
 * Browser side of entitlements.
 *
 * Every number here comes from the server. Nothing in this file, or in any
 * component that uses it, knows that Free gets five of anything: a component
 * holding its own copy of a limit will one day disagree with the server, and
 * the user will believe the component.
 */

export interface UsageSnapshot {
  tier: SubscriptionSummary['tier'];
  subscription: SubscriptionSummary;
  features: FeatureUsage[];
}

export interface PlanOption {
  key: string;
  tier: SubscriptionSummary['tier'];
  name: string;
  priceCents: number;
  currency: string;
  billingInterval: string | null;
}

async function unwrap<T>(response: Response): Promise<T> {
  const body = (await response.json()) as
    | { success: true; data: T }
    | { success: false; code: string; message: string; data?: unknown };

  if (!body.success) throw new EntitlementError(body.code, body.message, body.data);
  return body.data;
}

/** A failed entitlement call. Carries the denial payload when there is one. */
export class EntitlementError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = 'EntitlementError';
  }

  /** True when this was a quota refusal rather than an outage or a bug. */
  get isQuota(): boolean {
    return this.code === 'QUOTA_EXCEEDED';
  }

  /** The denial, when the server sent one. */
  get denial(): QuotaDenial | null {
    return this.isQuota ? ((this.data as QuotaDenial) ?? null) : null;
  }
}

export async function fetchUsage(): Promise<UsageSnapshot> {
  return unwrap<UsageSnapshot>(
    await fetch('/api/usage', { credentials: 'same-origin' }),
  );
}

export async function fetchSubscription(): Promise<{
  subscription: SubscriptionSummary;
  plans: PlanOption[];
  /**
   * Whether this caller may change the plan without paying.
   *
   * Decided by the SERVER, never inferred in the browser: a control that
   * renders from a client-side guess and then fails is worse than one that
   * never renders.
   */
  canSwitchPlans: boolean;
}> {
  return unwrap(await fetch('/api/subscription', { credentials: 'same-origin' }));
}

/**
 * Take a unit of a metered feature.
 *
 * Call this BEFORE doing the work, and treat a rejection as a hard stop. It is
 * the only call that actually reserves anything: `/api/usage/check` is advisory
 * and can be stale by the time you act on it.
 *
 * Throws {@link EntitlementError} with `isQuota` true when the quota is spent,
 * which the caller turns into the upgrade modal.
 */
export async function consumeFeature(
  featureKey: string,
  options: { quantity?: number; metadata?: Record<string, unknown> } = {},
): Promise<{ consumed: boolean; eventId: string | null }> {
  return unwrap(
    await fetch('/api/usage/consume', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featureKey, ...options }),
    }),
  );
}

/**
 * Give back a unit consumed for work that then failed.
 *
 * Best effort by contract: the caller has a real error to report, and a failed
 * refund must not replace it with a different one.
 */
export async function releaseFeature(eventId: string): Promise<{ released: boolean }> {
  return unwrap(
    await fetch('/api/usage/release', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventId }),
    }),
  );
}

export async function requestUpgrade(planKey: string): Promise<{
  applied: boolean;
  checkoutUrl: string | null;
  subscription?: SubscriptionSummary;
}> {
  return unwrap(
    await fetch('/api/subscription/upgrade', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey }),
    }),
  );
}

/**
 * How a quota reads to a person.
 *
 * "3 downloads left" and "Resets in 2 hours" are the two things a user wants,
 * and both depend on values only the server has. Pluralisation is naive on
 * purpose: every seeded unit is a regular English noun, and a full
 * pluralisation library for "scan"/"scans" would be a dependency to justify.
 */
export function describeRemaining(feature: FeatureUsage): string {
  if (feature.limit === null) return 'Unlimited';
  if (feature.locked) return 'Not in your plan';
  const remaining = feature.remaining ?? 0;
  return `${remaining} ${feature.unit}${remaining === 1 ? '' : 's'} left`;
}

/** "in 2 hours", or null when nothing ever comes back. */
export function describeReset(feature: FeatureUsage, now: Date = new Date()): string | null {
  if (!feature.resetsAt) return null;

  const ms = new Date(feature.resetsAt).getTime() - now.getTime();
  if (ms <= 0) return 'shortly';

  const minutes = Math.ceil(ms / 60_000);
  if (minutes < 60) return `in ${minutes} minute${minutes === 1 ? '' : 's'}`;

  const hours = Math.ceil(minutes / 60);
  if (hours < 24) return `in ${hours} hour${hours === 1 ? '' : 's'}`;

  const days = Math.ceil(hours / 24);
  return `in ${days} day${days === 1 ? '' : 's'}`;
}
