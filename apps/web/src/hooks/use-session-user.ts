'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { hasSessionHint } from '@/lib/auth/session-hint';
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
  /**
   * Whether to ask the server at all.
   *
   * Read after mount rather than during render, because the hint lives in
   * `document.cookie`, which the server render cannot see: deciding on it while
   * rendering would make the server and the client produce different markup and
   * fail hydration. `checked` is what separates "no session" from "have not
   * looked yet" - without it the first frame reports a confident "signed out",
   * and a signed-in visitor watches the header flash `Sign in` at them.
   */
  const [hint, setHint] = useState<{ checked: boolean; present: boolean }>({
    checked: false,
    present: false,
  });

  useEffect(() => {
    setHint({ checked: true, present: hasSessionHint() });
  }, []);

  const { data = ANONYMOUS_USER, isPending } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
    staleTime: 60_000,
    enabled: hint.present,
  });

  // A disabled query stays `pending` forever, so it cannot be the whole answer:
  // once we have looked and found no hint, the answer is known and final.
  const isLoading = !hint.checked || (hint.present && isPending);

  return { user: data, signedIn: isSignedIn(data), isLoading };
}
