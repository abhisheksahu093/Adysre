/**
 * Silent token refresh for the browser.
 *
 * The client never inspects a token, because it cannot: both cookies are
 * HTTP-only, which is exactly what stops an XSS payload from stealing a
 * session. So it reacts to a 401 rather than to an expiry it can read.
 *
 *   request → 401 → POST /api/auth/refresh → retry once → give up, sign out
 *
 * ## The single in-flight promise is required for correctness
 *
 * Refresh tokens rotate, and replaying a rotated token is treated as theft and
 * revokes every session the user has. A dashboard that fires ten requests on
 * mount would, without coordination, see ten 401s and start ten refreshes: the
 * first rotates the token and the other nine present the one it just retired.
 * The user is then signed out of every device for doing nothing wrong.
 *
 * Sharing one promise makes the nine wait for the first and reuse its result.
 * This is not an optimisation, it is what keeps rotation and reuse detection
 * from fighting each other.
 */

/** The refresh currently in flight, if any. */
let inFlight: Promise<boolean> | null = null;

/** Called when refresh fails and the user must sign in again. */
type SignOutHandler = () => void;

let onSignOut: SignOutHandler | null = null;

/**
 * Register what to do when a session cannot be recovered.
 *
 * Injected rather than imported so this module stays free of routing and can be
 * unit-tested. The app sets it once, at the root.
 */
export function setSignOutHandler(handler: SignOutHandler | null): void {
  onSignOut = handler;
}

/**
 * Refresh the session, coalescing concurrent callers onto one request.
 *
 * @returns whether the session is usable afterwards
 */
export function refreshSession(): Promise<boolean> {
  // A caller arriving while a refresh is running joins it instead of starting
  // a second one.
  if (inFlight) return inFlight;

  inFlight = (async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.ok;
    } catch {
      // Offline, or the request was aborted. Not a credential problem, so the
      // caller should not be signed out over it.
      return false;
    } finally {
      // Cleared in `finally` so a rejected refresh cannot wedge every future
      // one on a permanently pending promise.
      inFlight = null;
    }
  })();

  return inFlight;
}

/**
 * `fetch` that recovers from an expired access token.
 *
 * Same-origin only. Sending credentials to another origin is a different
 * decision that should be made deliberately, not inherited from a helper.
 */
export async function authFetch(input: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, { ...init, credentials: 'same-origin' });

  if (response.status !== 401) return response;

  // Never try to refresh the refresh endpoint itself: a 401 from it means the
  // refresh token is gone, and retrying would loop.
  if (input.startsWith('/api/auth/refresh')) {
    onSignOut?.();
    return response;
  }

  const recovered = await refreshSession();
  if (!recovered) {
    onSignOut?.();
    return response;
  }

  // Exactly one retry. A second 401 after a successful refresh is not an expiry
  // problem, it is a permission problem, and retrying further would hammer the
  // endpoint for no reason.
  return fetch(input, { ...init, credentials: 'same-origin' });
}

/** Reset module state. Tests only. */
export function resetAuthFetch(): void {
  inFlight = null;
  onSignOut = null;
}
