import { createApiClient } from '@adysre/sdk';
import { authFetch } from './auth-fetch';

/**
 * Browser-side API clients.
 *
 * ## Why there are two
 *
 * `authApi` is SAME-ORIGIN and talks to the route handlers in this app. That is
 * the whole point of moving authentication into `apps/web`: the browser sends
 * the HTTP-only cookies automatically because the request never leaves the
 * origin, with no cross-site cookie policy to weaken and no CORS to configure.
 *
 * `platformApi` points at the NestJS app for anything that has not moved. It is
 * only usable when `NEXT_PUBLIC_API_URL` names a reachable deployment.
 *
 * ## What changed, and why the 401 happened
 *
 * This file used to export one client pointing at
 * `NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'` with a hardcoded
 * `x-tenant-slug: 'demo'` header. In production nothing was listening on that
 * URL, so sign-in could never complete, no `access_token` cookie was ever set,
 * and every guarded route correctly answered 401 to a request carrying no
 * credential. The hardcoded tenant was the second bug queued up behind the
 * first: it would have signed everyone into the demo workspace. The tenant now
 * comes from the verified session and never from a header a browser can edit.
 */

/**
 * Same-origin: an empty base means paths resolve against the current host.
 *
 * Goes through `authFetch`, so an expired access token is refreshed and the
 * request retried once instead of surfacing as a 401. Without this the refresh
 * machinery was reachable by nothing: access tokens are short-lived by design,
 * so every signed-in user silently became "signed out" to the UI a few minutes
 * after logging in, while their refresh cookie sat there still valid.
 */
export const authApi = createApiClient({ baseUrl: '', fetchImpl: authFetch });

/**
 * The NestJS API, for endpoints this app does not serve.
 *
 * No localhost fallback. A default pointing at the developer's own machine is
 * what turned a missing deployment into a silent production failure; with the
 * variable unset these calls fail immediately and visibly instead.
 */
export const platformApi = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? '',
});

/**
 * @deprecated Prefer `authApi` for this app's endpoints and `platformApi` for
 * NestJS. Kept so existing imports keep working; it is the same-origin client.
 */
export const api = authApi;
