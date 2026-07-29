import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  OAuthProvider,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '@adysre/validators';
import { ApiClientError } from '@adysre/sdk';
import { authApi } from './api-client';
import { csrfHeaders } from './csrf-client';
import type { AccessLevel } from './access';

/**
 * Auth actions: the single place the web app talks to its own auth endpoints.
 *
 * Every call is same-origin, so the browser attaches the HTTP-only cookies by
 * itself and the client never sees a token. That is what makes an XSS payload
 * unable to steal a session.
 *
 * These used to target `/auth/*` on the NestJS app through `NEXT_PUBLIC_API_URL`,
 * which in production pointed at nothing. They now target this app's own
 * `/api/auth/*` handlers.
 */

export interface AuthIdentity {
  userId: string;
  tenantId: string;
}

export interface LoginResult extends AuthIdentity {
  requiresEmailVerification: boolean;
}

export function login(input: LoginInput) {
  return authApi.post<LoginResult>('/api/auth/login', input);
}

export function register(input: RegisterInput) {
  return authApi.post<AuthIdentity>('/api/auth/register', input);
}

export function requestPasswordReset(input: ForgotPasswordInput) {
  return authApi.post<{ requested: boolean }>('/api/auth/forgot-password', input);
}

export function resetPassword(input: ResetPasswordInput) {
  // Sent whole, confirmPassword included: the schema cross-checks the two on
  // the server, and stripping one here would move that check to the client,
  // where it can simply be skipped.
  return authApi.post<{ reset: boolean }>('/api/auth/reset-password', input);
}

/**
 * Change a password.
 *
 * Sent with a raw `fetch` rather than through the SDK client, because this is
 * the one endpoint that requires the CSRF header and the shared client has no
 * way to attach per-request headers. Adding one to the SDK for a single caller
 * would put a CSRF concept into a package that knows nothing about this app's
 * cookies.
 */
export async function changePassword(
  input: ChangePasswordInput,
): Promise<{ changed: boolean; sessionsRevoked: number }> {
  const response = await fetch('/api/auth/change-password', {
    method: 'PATCH',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', ...(await csrfHeaders()) },
    body: JSON.stringify(input),
  });

  const body = (await response.json()) as
    | { success: true; data: { changed: boolean; sessionsRevoked: number } }
    | { success: false; code: string; message: string };

  if (!body.success) throw new ApiClientError(body.code, body.message, response.status);
  return body.data;
}

export function updateProfile(input: UpdateProfileInput) {
  return authApi.patch<ProfileResponse>('/api/auth/profile', input);
}

/** What `GET /api/auth/me` and `PATCH /api/auth/profile` return. */
export interface ProfileResponse {
  user: {
    id: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    // Dates cross the wire as ISO strings, not Date objects.
    emailVerifiedAt: string | null;
    lastLoginAt: string | null;
  };
  organization: { id: string; name: string; slug: string };
  /** The WORKSPACE's entitlement, resolved server-side. Never role-derived. */
  accessLevel: AccessLevel;
  roles?: string[];
  permissions?: string[];
}

export function fetchMe() {
  return authApi.get<ProfileResponse>('/api/auth/me');
}

/**
 * Sign out.
 *
 * Best effort: the endpoint always answers 200 and clears the cookies before
 * anything that could fail, so the only way this throws is a network error. The
 * caller redirects regardless, because leaving someone on a dashboard after
 * they clicked "sign out" is worse than a missed audit row.
 */
export async function logout(): Promise<void> {
  try {
    await authApi.post('/api/auth/logout');
  } catch {
    // Ignored on purpose. See above.
  }
}

/**
 * OAuth entry point, which still lives in the NestJS app.
 *
 * Returns null when `NEXT_PUBLIC_API_URL` is unset, because there is then no
 * deployment to redirect to. Callers disable the buttons rather than send
 * someone to a URL that cannot answer, which is what the old
 * `?? 'http://localhost:4000'` default did in production.
 */
export function oauthUrl(provider: OAuthProvider): string | null {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) return null;
  return `${base}/auth/oauth/${provider}`;
}
