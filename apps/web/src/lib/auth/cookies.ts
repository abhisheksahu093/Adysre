import 'server-only';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE } from './access-token';
import { accessTtlSeconds, isProduction, refreshTtlSeconds } from './config';

/**
 * The auth cookies, set and cleared in exactly one place.
 *
 * One helper for both cookies so their flags can never drift apart, which is
 * how a refresh token ends up readable by JavaScript while the access token is
 * not (Rule 3, never duplicate).
 *
 * This file is the reason services never touch cookies: it imports
 * `next/headers`, so anything that imports it cannot be unit-tested without a
 * request. Handlers call this; services take and return plain values.
 */

/** Matches the API's `REFRESH_COOKIE`, so both apps name the cookie the same. */
export const REFRESH_COOKIE = 'refresh_token';

function baseOptions() {
  return {
    /**
     * The highest-value flag here. Without it, one XSS anywhere in the app is a
     * full session theft. With it, an XSS can act as the user while the page is
     * open but cannot walk away with the credential.
     */
    httpOnly: true,

    /**
     * Not in development, where localhost is plain http and a secure cookie
     * would simply never be stored, making local sign-in impossible.
     */
    secure: isProduction(),

    /**
     * Lax, not strict. Strict withholds the cookie on every cross-site
     * navigation, including the return leg of an OAuth redirect and any link
     * from an email, so a user who clicks a verification link arrives signed
     * out. Lax still withholds it on cross-site POST, which is the CSRF case
     * that matters.
     */
    sameSite: 'lax' as const,

    /**
     * Root path for both. Narrowing the refresh cookie to /api/auth/refresh is
     * tempting and breaks logout, which must clear it from a different path: a
     * cookie can only be cleared from a path that can see it.
     */
    path: '/',

    /**
     * Deliberately absent, which yields a host-only cookie.
     *
     * `apps/api` reads COOKIE_DOMAIN because it served a different origin and
     * had no choice. Same-origin does not need it, and a cookie scoped to
     * `.adysre.com` would be readable by every subdomain, so one forgotten or
     * compromised subdomain reads production sessions.
     */
    domain: undefined,
  };
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
}

/** Set both cookies on the response. */
export async function setAuthCookies(tokens: IssuedTokens): Promise<void> {
  const store = await cookies();
  const base = baseOptions();

  store.set(ACCESS_COOKIE, tokens.accessToken, { ...base, maxAge: accessTtlSeconds() });
  store.set(REFRESH_COOKIE, tokens.refreshToken, { ...base, maxAge: refreshTtlSeconds() });
}

/**
 * Clear both cookies.
 *
 * Overwrites with an empty value at maxAge 0 rather than calling `delete`,
 * because deletion only matches when every attribute matches, and a mismatch
 * leaves the original cookie in place. A logout that appears to work and leaves
 * a live session behind is the worst possible outcome here.
 */
export async function clearAuthCookies(): Promise<void> {
  const store = await cookies();
  const base = baseOptions();

  store.set(ACCESS_COOKIE, '', { ...base, maxAge: 0 });
  store.set(REFRESH_COOKIE, '', { ...base, maxAge: 0 });
}

/** The raw refresh token from the request, or null. */
export async function readRefreshCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE)?.value ?? null;
}

/** The raw access token from the request, or null. */
export async function readAccessCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value ?? null;
}
