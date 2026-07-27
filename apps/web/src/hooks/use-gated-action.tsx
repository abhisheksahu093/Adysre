'use client';

import { useCallback, useState } from 'react';
import { useConsumeFeature, useRefreshUsage } from '@/hooks/use-entitlement';
import { PremiumModal } from '@/components/entitlements/premium-modal';
import { releaseFeature } from '@/lib/entitlements/client';
import type { QuotaDenial } from '@/lib/entitlements/types';

/**
 * Run an action only if the workspace has quota, and prompt to upgrade if not.
 *
 * The single wiring point for every browser-local tool. Each one would
 * otherwise grow its own copy of "consume, check the answer, open a modal,
 * handle the error", and the tenth copy is where somebody forgets to check.
 *
 *   const { run, modal } = useGatedAction('tools.qr.download');
 *
 *   <Button onClick={() => run(() => downloadPng())}>Download</Button>
 *   {modal}
 *
 * ─── ORDER MATTERS ──────────────────────────────────────────────────────────
 * The unit is consumed BEFORE the action runs, and released if the action
 * throws. Consuming afterwards would let anyone take the work without being
 * counted by closing the tab at the right moment, which is the same as having
 * no limit for anyone who notices.
 *
 * This is metering, not a security boundary: these tools run entirely in the
 * browser, so someone editing the page's JavaScript can skip it. Acceptable
 * because nothing server-side is consumed; see `Enforcement` in
 * lib/entitlements/types.ts.
 */
export function useGatedAction(featureKey: string) {
  const { consume, isPending } = useConsumeFeature();
  const refreshUsage = useRefreshUsage();
  const [denial, setDenial] = useState<QuotaDenial | null>(null);

  /**
   * @returns the action's result, or null when the quota refused it. Callers
   * check for null rather than assuming success, so a refusal cannot be
   * mistaken for a completed action that happened to return nothing.
   */
  const run = useCallback(
    async <T,>(
      action: () => T | Promise<T>,
      /**
       * How many units this action costs. Defaults to one.
       *
       * A batch of twenty images is twenty pieces of work, and charging one for
       * the batch would make the limit meaningless to anyone who queues files
       * before pressing the button. The whole batch is refused when the
       * remaining quota cannot cover it, rather than half-completing.
       */
      options: { quantity?: number; metadata?: Record<string, unknown> } = {},
    ): Promise<T | null> => {
      const result = await consume(featureKey, options);

      if (!result.ok) {
        setDenial(result.denial);
        return null;
      }

      try {
        return await action();
      } catch (error) {
        // Charged for work that did not happen. Best effort: failing to refund
        // must not replace the real error with a different one, so the original
        // is rethrown either way.
        if (result.eventId) {
          await releaseFeature(result.eventId).catch(() => undefined);
          void refreshUsage();
        }
        throw error;
      }
    },
    [consume, featureKey, refreshUsage],
  );

  const modal = (
    <PremiumModal open={denial !== null} onClose={() => setDenial(null)} denial={denial} />
  );

  return { run, modal, isPending, denial };
}
