'use client';

import { Sparkles } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { useUsage } from '@/hooks/use-entitlement';

/**
 * A nudge shown when a workspace is close to, or at, one of its limits.
 *
 * Deliberately quiet. It appears only when something is nearly spent, not
 * whenever a workspace is on the free plan: a banner that is always there is
 * furniture, and people stop reading furniture. The one that appears the day
 * you run out is the one that gets read.
 */

/** Show from this many remaining units. Below it, the limit is imminent. */
const NEARLY_SPENT = 2;

export function UpgradeBanner({ className }: { className?: string }) {
  const { data, isLoading } = useUsage();

  if (isLoading || !data) return null;
  // Nothing to sell to a workspace that already pays.
  if (data.subscription.isPaid) return null;

  const pressing = data.features.filter(
    (feature) =>
      feature.limit !== null && !feature.locked && (feature.remaining ?? 0) <= NEARLY_SPENT,
  );

  if (pressing.length === 0) return null;

  const spent = pressing.filter((feature) => (feature.remaining ?? 0) === 0);
  // Naming the feature is what makes this useful rather than an advert: "you
  // have used all your QR downloads" is actionable, "upgrade now" is not.
  const headline =
    spent.length > 0
      ? `You have used all your ${spent[0]!.name.toLowerCase()}`
      : `You are nearly out of ${pressing[0]!.name.toLowerCase()}`;

  const others = pressing.length - 1;

  return (
    <div
      className={`flex flex-col gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between ${className ?? ''}`}
    >
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
        <div>
          <p className="text-sm font-medium text-foreground">{headline}</p>
          <p className="text-xs text-muted-foreground">
            {others > 0
              ? `And ${others} other limit${others === 1 ? '' : 's'} on your plan. Upgrade for unlimited use.`
              : 'Upgrade for unlimited use of every tool.'}
          </p>
        </div>
      </div>

      {/* A styled link, not a Button wrapping one: this navigates, so it must
          be an anchor, and nesting a link inside a button is invalid markup
          that breaks keyboard and screen-reader behaviour. */}
      <Link href="/pricing" className={cn(buttonVariants({ size: 'sm' }), 'shrink-0')}>
        See plans
      </Link>
    </div>
  );
}
