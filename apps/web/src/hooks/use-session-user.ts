'use client';

import { useQuery } from '@tanstack/react-query';
import { ANONYMOUS_USER, fetchProfile, isSignedIn, type SessionUser } from '@/lib/session';

/**
 * The signed-in user, for any client component that renders account chrome.
 *
 * ONE query behind `GET /api/auth/me`, shared through the cache by the profile
 * menu, the marketing header and the profile page. The query options live here
 * rather than at each call site because they have to match: two components
 * asking for the same key with different `staleTime` refetch each other's data
 * and the avatar and the header disagree for a moment about who is signed in.
 *
 * `fetchProfile` treats a 401 as an answer rather than an error, so this never
 * lands in an error state on a public page.
 */

export const PROFILE_QUERY_KEY = ['profile'] as const;

export interface SessionState {
  user: SessionUser;
  /** A real account, as opposed to the anonymous placeholder. */
  signedIn: boolean;
  /**
   * True until the first answer arrives.
   *
   * Callers that switch between a signed-out and a signed-in control must
   * render NEITHER while this is true. Guessing shows every visitor the wrong
   * one for a beat, and "Sign in" flashing at someone who is already signed in
   * reads as having been logged out.
   */
  isLoading: boolean;
}

export function useSessionUser(): SessionState {
  const { data = ANONYMOUS_USER, isPending } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    staleTime: 60_000,
  });

  return { user: data, signedIn: isSignedIn(data), isLoading: isPending };
}
