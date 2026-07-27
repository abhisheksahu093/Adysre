'use client';

import { useCallback, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  EntitlementError,
  consumeFeature,
  fetchUsage,
  type UsageSnapshot,
} from '@/lib/entitlements/client';
import type { FeatureUsage, QuotaDenial } from '@/lib/entitlements/types';

/**
 * Entitlement state for the whole app.
 *
 * ONE query behind `GET /api/usage`, shared by every badge, gate and counter
 * through the query cache. A hook that fetched per feature would make a page
 * with eight gated controls issue eight requests and pop its badges in one at a
 * time.
 */

export const USAGE_QUERY_KEY = ['entitlements', 'usage'] as const;

export function useUsage() {
  return useQuery<UsageSnapshot>({
    queryKey: USAGE_QUERY_KEY,
    queryFn: fetchUsage,
    // Quotas change when this user acts, and those paths invalidate explicitly.
    // A short stale time keeps a second tab roughly honest without polling.
    staleTime: 30_000,
    // A signed-out visitor gets 401 here, which is an answer rather than a
    // fault; retrying it just delays the render.
    retry: false,
  });
}

export interface Entitlement {
  feature: FeatureUsage | null;
  /** True while the first load is in flight. */
  isLoading: boolean;
  /** May a unit be taken right now? Pessimistic until known. */
  allowed: boolean;
  /** The feature is not on this tier at all, as opposed to spent. */
  locked: boolean;
  /** Null when unlimited or unknown. */
  remaining: number | null;
  limit: number | null;
  unlimited: boolean;
}

/**
 * One feature's state.
 *
 * **Pessimistic while loading and on error.** `allowed` stays false until the
 * server has actually said otherwise, so a slow or failed request never flashes
 * an unlocked control that then rejects the click. Denying briefly is a moment
 * of friction; allowing wrongly is a broken promise.
 */
export function useEntitlement(featureKey: string): Entitlement {
  const { data, isLoading } = useUsage();

  return useMemo(() => {
    const feature = data?.features.find((f) => f.key === featureKey) ?? null;

    if (!feature) {
      return {
        feature: null,
        isLoading,
        allowed: false,
        locked: false,
        remaining: null,
        limit: null,
        unlimited: false,
      };
    }

    return {
      feature,
      isLoading,
      allowed: feature.allowed,
      locked: feature.locked,
      remaining: feature.remaining,
      limit: feature.limit,
      unlimited: feature.limit === null,
    };
  }, [data, featureKey, isLoading]);
}

/** The workspace's tier and plan, from the same cached query. */
export function useSubscription() {
  const { data, isLoading } = useUsage();
  return {
    subscription: data?.subscription ?? null,
    tier: data?.tier ?? null,
    isLoading,
  };
}

/**
 * Take a unit, and surface a denial.
 *
 * Wraps the consume call so every caller gets the same behaviour: the cached
 * usage is refreshed afterwards (whether it succeeded or not, because a denial
 * also means the local numbers are stale), and a quota refusal comes back as a
 * `QuotaDenial` rather than a thrown error the caller has to classify.
 */
export function useConsumeFeature() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (input: {
      featureKey: string;
      quantity?: number;
      metadata?: Record<string, unknown>;
    }) => consumeFeature(input.featureKey, input),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY });
    },
  });

  /**
   * @returns the event id on success, or the denial when refused.
   *
   * Non-quota failures (an outage, a bug) are rethrown: swallowing them here
   * would make an unreachable server look like a spent quota, and the user
   * would be shown an upgrade prompt for our downtime.
   */
  const consume = useCallback(
    async (
      featureKey: string,
      options: { quantity?: number; metadata?: Record<string, unknown> } = {},
    ): Promise<{ ok: true; eventId: string | null } | { ok: false; denial: QuotaDenial }> => {
      try {
        const result = await mutation.mutateAsync({ featureKey, ...options });
        return { ok: true, eventId: result.eventId };
      } catch (error) {
        if (error instanceof EntitlementError && error.denial) {
          return { ok: false, denial: error.denial };
        }
        throw error;
      }
    },
    [mutation],
  );

  return { consume, isPending: mutation.isPending };
}

/** Force a refresh, for a path that changed usage without going through consume. */
export function useRefreshUsage() {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY }),
    [queryClient],
  );
}
