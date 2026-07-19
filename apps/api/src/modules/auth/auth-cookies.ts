import type { Response } from 'express';
import type { AuthResult } from './auth.service.js';

/**
 * Cookie helpers shared by the password and OAuth controllers, so the two can
 * never set the auth cookies with different flags (Rule 3 - never duplicate).
 *
 * Tokens live in HTTP-only cookies (AUTHENTICATION_RBAC.md): the browser sends
 * them automatically and JavaScript can never read them, which is what keeps a
 * stolen XSS payload from walking off with a session.
 */

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

function baseCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    domain: process.env.COOKIE_DOMAIN,
    path: '/',
  };
}

export function setAuthCookies(res: Response, result: AuthResult): void {
  const base = baseCookieOptions();
  res.cookie(ACCESS_COOKIE, result.accessToken, {
    ...base,
    maxAge: Number(process.env.JWT_ACCESS_TTL ?? 900) * 1000,
  });
  res.cookie(REFRESH_COOKIE, result.refreshToken, {
    ...base,
    maxAge: Number(process.env.JWT_REFRESH_TTL ?? 1_209_600) * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  const { httpOnly, secure, sameSite, domain, path } = baseCookieOptions();
  res.clearCookie(ACCESS_COOKIE, { httpOnly, secure, sameSite, domain, path });
  res.clearCookie(REFRESH_COOKIE, { httpOnly, secure, sameSite, domain, path });
}
