'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Throw away every cached answer that belonged to the previous identity.
 *
 * The query cache outlives a sign-in: signing in and out are client-side
 * navigations, so the `QueryClient` created in `providers.tsx` survives them
 * with all of its entries. Anything read while signed out - the profile (the
 * anonymous placeholder), entitlements (a 401), a project list - stays cached
 * and, while still fresh, is handed to the components that mount after the
 * session changes. That is a profile page with blank fields and a user menu
 * with no name, which a reload appears to "fix" because it builds a new cache.
 *
 * Call this whenever the identity changes - after signing in, registering, or
 * signing out - and BEFORE navigating, so the components on the next page
 * mount against an empty cache and fetch as themselves.
 *
 * Clearing everything, rather than the two or three keys that hold identity, is
 * deliberate: almost every query in this app is scoped to a tenant, and the
 * list of which ones would be wrong the first time someone adds a new one.
 */
export function useResetSessionCache(): () => void {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.clear(), [queryClient]);
}
