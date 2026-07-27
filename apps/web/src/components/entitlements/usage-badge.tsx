'use client';

import { Badge, type BadgeProps } from 'adysre';
import { useEntitlement } from '@/hooks/use-entitlement';
import { describeRemaining } from '@/lib/entitlements/client';

/**
 * "3 downloads left", beside the control it applies to.
 *
 * Renders nothing at all when the limit is unlimited or unknown. A badge saying
 * "Unlimited" on every control for a paying customer is noise that makes the
 * interface look metered when it is not.
 */
export function UsageBadge({ feature: featureKey, className }: { feature: string; className?: string }) {
  const { feature, isLoading, unlimited, remaining, locked } = useEntitlement(featureKey);

  // Nothing useful to say yet. Rendering a placeholder here would shift the
  // layout twice: once for the skeleton, once for the real value.
  if (isLoading || !feature || unlimited) return null;

  // Three states, three weights. Typed against the real variant union rather
  // than cast, so a variant that does not exist is a compile error instead of a
  // badge that silently renders in the default style.
  const variant: NonNullable<BadgeProps['variant']> =
    locked || remaining === 0
      ? 'warning'
      : remaining !== null && remaining <= 2
        ? 'accent'
        : 'outline';

  return (
    <Badge variant={variant} className={className}>
      {describeRemaining(feature)}
    </Badge>
  );
}
