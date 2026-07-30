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

/** Holds the in-flight OAuth nonce between the redirect out and the callback. */
export const OAUTH_STATE_COOKIE = 'oauth_state';

/**
 * How long a user has to finish at the provider.
 *
 * Ten minutes is long enough to type a password and clear an MFA prompt, and
 * short enough that an abandoned attempt does not leave a usable nonce sitting
 * in the browser for the rest of the day.
 */
const OAUTH_STATE_TTL_SECONDS = 600;

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

/** What the OAuth start leg remembers for the callback leg to check. */
export interface OAuthStatePayload {
  /** The nonce echoed through the provider as `state`. */
  state: string;
  /** Where to send the user afterwards. Already validated by `safeNext`. */
  next?: string;
}

/**
 * Remember the OAuth nonce for the return leg.
 *
 * The nonce is what makes the callback trustworthy: an attacker who can make a
 * victim's browser hit our callback with their own `code` gets the victim
 * signed into the attacker's account, unless the request also carries a nonce
 * that only our own start leg could have set. The cookie is HTTP-only, so a
 * script cannot read it back out and forge a matching pair.
 *
 * `next` rides in the cookie rather than in the `state` parameter, so the
 * return path never crosses the provider and cannot be swapped in transit.
 */
export async function setOAuthState(payload: OAuthStatePayload): Promise<void> {
  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, JSON.stringify(payload), {
    ...baseOptions(),
    maxAge: OAUTH_STATE_TTL_SECONDS,
  });
}

/** The in-flight OAuth state, or null when absent or unreadable. */
export async function readOAuthState(): Promise<OAuthStatePayload | null> {
  const store = await cookies();
  const raw = store.get(OAUTH_STATE_COOKIE)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return null;
    const { state, next } = parsed as Record<string, unknown>;
    if (typeof state !== 'string' || state === '') return null;
    return { state, ...(typeof next === 'string' ? { next } : {}) };
  } catch {
    // A malformed cookie is treated as no cookie. Someone hand-editing it gets
    // a failed sign-in, not a parse error surfaced as a 500.
    return null;
  }
}

/**
 * Clear the OAuth nonce.
 *
 * Called on every callback before anything else is decided, success or failure,
 * so a nonce is single-use. Leaving it in place would let a captured callback
 * URL be replayed for as long as the cookie lived.
 */
export async function clearOAuthState(): Promise<void> {
  const store = await cookies();
  store.set(OAUTH_STATE_COOKIE, '', { ...baseOptions(), maxAge: 0 });
}
