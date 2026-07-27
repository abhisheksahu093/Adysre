'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Button, cn } from 'adysre';
import { fetchSubscription, requestUpgrade, type PlanOption } from '@/lib/entitlements/client';
import { USAGE_QUERY_KEY } from '@/hooks/use-entitlement';

/**
 * Switch the workspace between plans, without paying, to exercise the gating.
 *
 * ─── HOW THIS DIFFERS FROM THE COOKIE IT REPLACES ───────────────────────────
 * The old `AccessSwitcher` wrote `adysre_access` in the browser, and the server
 * believed it. Anyone could type one line into devtools and hold premium.
 *
 * This one only ASKS. `POST /api/subscription/upgrade` decides, and it refuses
 * unless all of these hold: not production, `BILLING_ALLOW_DIRECT_GRANT=true`,
 * the caller is an Owner or Admin, and their email is on `BILLING_TEST_ACCOUNTS`
 * when that is configured. Every switch is written to the audit log.
 *
 * The component renders only when the SERVER says switching is available
 * (`canSwitchPlans`), rather than checking NODE_ENV in the browser: a control
 * that appears and then fails is worse than one that never appears.
 */
export function PlanSwitcher() {
  const t = useTranslations('pages.profile');
  const queryClient = useQueryClient();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['subscription', 'plans'],
    queryFn: fetchSubscription,
    staleTime: 60_000,
    retry: false,
  });

  // Absent, still loading, or not permitted: render nothing at all.
  if (!data?.canSwitchPlans) return null;

  const current = data.subscription.planKey;

  async function switchTo(plan: PlanOption) {
    setPending(plan.key);
    setError(null);
    try {
      await requestUpgrade(plan.key);
      // Both caches: the plan itself, and every badge and gate that reads usage.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['subscription', 'plans'] }),
        queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY }),
      ]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('switchFailed'));
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="rounded-md border border-dashed border-warning/40 bg-warning/5 p-3">
      <p className="text-xs font-medium text-warning">{t('devOnly')}</p>
      <p className="mt-1 text-xs text-muted-foreground">{t('devOnlyHint')}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {data.plans.map((plan) => (
          <Button
            key={plan.key}
            type="button"
            size="sm"
            variant={plan.key === current ? 'primary' : 'outline'}
            disabled={pending !== null}
            onClick={() => void switchTo(plan)}
            className={cn(plan.key === current && 'pointer-events-none')}
          >
            {pending === plan.key ? '…' : plan.name}
            {/* The TIER, not the plan name: `annual` and `lifetime` are both
                premium, and seeing that is the whole point of testing. */}
            <span className="ml-1.5 text-[10px] uppercase opacity-60">{plan.tier}</span>
          </Button>
        ))}
      </div>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
    </div>
  );
}
