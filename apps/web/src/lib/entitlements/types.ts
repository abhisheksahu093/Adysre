/**
 * Entitlement contracts, shared by the server and the browser.
 *
 * Pure types and constants: no imports, no `server-only`, so a client component
 * can render a usage badge from the same shapes the service produces.
 */

export const SUBSCRIPTION_TIERS = ['free', 'premium', 'enterprise'] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIERS)[number];

export type MeterKind = 'stock' | 'flow';
export type UsageWindow = 'none' | 'day' | 'week' | 'month' | 'rolling' | 'lifetime';

/**
 * Where a limit can actually be enforced.
 *
 * This is a property of the FEATURE, not a policy choice, and pretending
 * otherwise would be the most misleading thing in this system.
 *
 * `server` - the action already requires a request, so the quota is checked on
 * the path that does the work. A client cannot skip it.
 *
 * `client-reported` - the action happens entirely in the browser (the Tool
 * Suite is local-only by design, and the AI tools process images on-device).
 * The client asks to consume, the server records and refuses when the quota is
 * spent, and the client honours that. Someone editing the page's JavaScript can
 * bypass it.
 *
 * That is an acceptable trade only because nothing server-side is consumed by
 * these features: the cost of a bypass is a free user generating a document on
 * their own machine, not our compute. Making them genuinely enforceable would
 * mean moving the work to the server, which is a product decision, not a
 * security patch.
 */
export type Enforcement = 'server' | 'client-reported';

/** One limit on one feature, as it applies to the current workspace. */
export interface FeatureLimit {
  limit: number | null;
  windowKind: UsageWindow;
  windowSeconds: number | null;
}

/** A feature, its limit for this workspace, and how much is left. */
export interface FeatureUsage {
  key: string;
  module: string;
  name: string;
  description: string | null;
  meterKind: MeterKind;
  enforcement: Enforcement;
  /** Singular noun: "download", "scan". The UI pluralises. */
  unit: string;

  /** Null means unlimited. */
  limit: number | null;
  used: number;
  /** Null when unlimited. Never negative. */
  remaining: number | null;

  windowKind: UsageWindow;
  windowSeconds: number | null;
  /** When the window rolls over. Null for stock, lifetime and unlimited. */
  resetsAt: string | null;

  /** True when a further unit may be taken right now. */
  allowed: boolean;
  /**
   * True when the feature is not on this tier at all (`limit === 0`), as
   * opposed to being temporarily spent. The upgrade prompt reads differently.
   */
  locked: boolean;
}

export interface SubscriptionSummary {
  tier: SubscriptionTier;
  planKey: string;
  planName: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'expired';
  priceCents: number;
  currency: string;
  billingInterval: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  /** Convenience for the UI. Never used to decide a limit. */
  isPaid: boolean;
}

/** What a denial carries, so the modal needs no second copy of the limits. */
export interface QuotaDenial {
  featureKey: string;
  featureName: string;
  unit: string;
  limit: number;
  used: number;
  remaining: number;
  windowKind: UsageWindow;
  resetsAt: string | null;
  tier: SubscriptionTier;
  locked: boolean;
}

/** Machine-readable reason a consume was refused. */
export const QUOTA_EXCEEDED = 'QUOTA_EXCEEDED';
