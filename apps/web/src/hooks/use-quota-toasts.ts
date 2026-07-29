'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useUsage } from './use-entitlement';
import { describeRemaining, describeReset } from '@/lib/entitlements/client';
import type { FeatureUsage } from '@/lib/entitlements/types';
import { toast } from '@/lib/toast';

/**
 * Tells the user when a quota is running out.
 *
 * Watches the ONE shared usage query rather than hooking each consume call, so
 * it also catches usage the browser did not initiate: a limit spent in another
 * tab, or by a server-enforced feature that never goes through `useGatedAction`.
 * The cost is that mounting this makes `/api/usage` load with the app shell
 * instead of only on pages with a gated control, which is one cached request
 * (30s stale, no refetch on focus) for a warning that has to be reliable.
 *
 * ## Only on the way down, and never on arrival
 *
 * It fires on a CROSSING into a worse state, not on the state itself. Announcing
 * the current level on every page load would nag someone who is out of
 * downloads on every single navigation, and the message would carry no news.
 * The first snapshot therefore only records a baseline. A quota that refills
 * (`spent` back to `low`) is silent too: nobody needs a toast to tell them
 * something got better.
 */

/** Warn from here down. Same threshold as `UpgradeBanner`'s NEARLY_SPENT. */
const NEARLY_SPENT = 2;

type Level = 'ok' | 'low' | 'spent';

/** Severity, so a crossing can be compared rather than pattern-matched. */
const RANK: Record<Level, number> = { ok: 0, low: 1, spent: 2 };

function levelOf(feature: FeatureUsage): Level {
  // Unlimited has nothing to run out of, and `locked` is not "running low" but
  // "not on this plan" - the paywall says that far better than a toast could.
  if (feature.limit === null || feature.locked) return 'ok';
  const remaining = feature.remaining ?? 0;
  if (remaining <= 0) return 'spent';
  if (remaining <= NEARLY_SPENT) return 'low';
  return 'ok';
}

export function useQuotaToasts(): void {
  const { data } = useUsage();
  const t = useTranslations('toast.quota');
  const seen = useRef<Map<string, Level>>(new Map());

  useEffect(() => {
    if (!data) return;

    for (const feature of data.features) {
      const level = levelOf(feature);
      const previous = seen.current.get(feature.key);
      seen.current.set(feature.key, level);

      // No baseline yet: this is the first time we have seen this feature, so
      // there is no crossing to report.
      if (previous === undefined) continue;
      if (RANK[level] <= RANK[previous]) continue;

      const resets = describeReset(feature);
      toast.warning(t(level === 'spent' ? 'spent' : 'low', { feature: feature.name }), {
        description:
          level === 'spent'
            ? resets
              ? t('resets', { when: resets })
              : t('upgrade')
            : describeRemaining(feature),
        // One live warning per feature: a quota spent over several clicks
        // should refresh the same toast, not stack a new one each time.
        dedupeKey: `quota:${feature.key}`,
      });
    }
  }, [data, t]);
}
