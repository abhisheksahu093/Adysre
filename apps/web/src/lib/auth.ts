import type {
  LoginInput,
  RegisterInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  OAuthProvider,
} from '@adysre/validators';
import { api } from './api-client';

/**
 * Auth actions - the single place the web app talks to the API auth module.
 * Tokens are set by the API as HTTP-only cookies (AUTHENTICATION_RBAC.md); the
 * client never handles them directly.
 */

export function login(input: LoginInput) {
  return api.post('/auth/login', input);
}

export function register(input: RegisterInput) {
  return api.post('/auth/register', input);
}

export function requestPasswordReset(input: ForgotPasswordInput) {
  return api.post('/auth/forgot-password', input);
}

export function resetPassword(input: ResetPasswordInput) {
  return api.post('/auth/reset-password', {
    token: input.token,
    password: input.password,
  });
}

/** Best-effort logout: revoke the session server-side, then redirect client-side. */
export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch {
    // Ignore - we still send the user back to /login.
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

/** OAuth redirect entrypoint (Google / Microsoft / GitHub). */
export function oauthUrl(provider: OAuthProvider): string {
  return `${API_BASE}/auth/oauth/${provider}`;
}
