'use client';

import { useEntitlement } from '@/hooks/use-entitlement';
import { describeReset } from '@/lib/entitlements/client';

/**
 * The fuller form of a usage badge: a bar, the numbers, and when it resets.
 *
 * For a panel or a settings page, where there is room to explain. Use
 * `UsageBadge` inline beside a control.
 */
export function UsageCounter({ feature: featureKey }: { feature: string }) {
  const { feature, isLoading, unlimited } = useEntitlement(featureKey);

  if (isLoading || !feature) return null;

  // Nothing to count. A full bar labelled "unlimited" invites the reader to
  // look for the number that fills it.
  if (unlimited) {
    return (
      <div className="flex items-baseline justify-between gap-3 py-1.5">
        <span className="text-sm text-foreground">{feature.name}</span>
        <span className="text-xs font-medium text-success">Unlimited</span>
      </div>
    );
  }

  const limit = feature.limit ?? 0;
  // Guard the divide: a zero limit is a real state (not on this tier), and
  // 0/0 would render NaN% into the style attribute.
  const percent = limit > 0 ? Math.min(100, Math.round((feature.used / limit) * 100)) : 100;
  const resets = describeReset(feature);
  const exhausted = (feature.remaining ?? 0) === 0;

  return (
    <div className="space-y-1.5 py-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-foreground">{feature.name}</span>
        <span className={`text-xs font-medium ${exhausted ? 'text-warning' : 'text-muted-foreground'}`}>
          {feature.used} / {limit}
        </span>
      </div>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={feature.used}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-label={feature.name}
      >
        <div
          className={`h-full rounded-full transition-all ${exhausted ? 'bg-warning' : 'bg-primary'}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {resets && <p className="text-xs text-muted-foreground">Resets {resets}</p>}
    </div>
  );
}
