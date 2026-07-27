import 'server-only';
import { getLocale } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getAuthSession } from './guard';
import type { PlatformSession } from './access-token';

/**
 * Page-level route protection for Server Components.
 *
 * ## Why this and not middleware
 *
 * Middleware is the usual place for this, and here it is the wrong one. Two
 * reasons.
 *
 * `middleware.ts` is the file next-intl uses for locale negotiation, and this
 * app deliberately has none: `localePrefix: 'as-needed'` resolves locales from
 * the `[locale]` segment instead. Adding one to guard routes would put auth in
 * the file that owns routing, where a mistake breaks every URL rather than one
 * page.
 *
 * More importantly, middleware must never be the security boundary. It runs on
 * the Edge runtime, so it cannot reach Prisma, and a request that dodges it,
 * through a rewrite, a matcher gap, or a direct call to a route handler, would
 * dodge the check. Treating middleware as the boundary is a well-known Next.js
 * vulnerability class. Every API route here authenticates independently, and
 * this function exists only so a signed-out visitor gets a redirect instead of
 * a page full of empty state.
 *
 * `redirect` comes from `@/i18n/navigation`, so a Japanese user lands on
 * `/ja/login` rather than being dropped back onto the English route.
 */
export async function requirePageSession(next?: string): Promise<PlatformSession> {
  const session = await getAuthSession();
  // Returned rather than awaited: awaiting a `Promise<never>` does not tell the
  // compiler that control flow stops, but returning it does.
  if (!session) return redirectToLogin(next);
  return session;
}

/**
 * Send an unauthenticated visitor to sign in, in their own locale.
 *
 * The locale is read from the request rather than assumed: hardcoding `en`
 * would drop a Japanese user onto the English login page, which is the exact
 * failure `@/i18n/navigation` exists to prevent.
 *
 * Declared as returning `never` because `redirect` throws a `NEXT_REDIRECT`
 * control-flow signal that Next catches upstream. Without the annotation,
 * callers cannot see that execution stops here.
 */
async function redirectToLogin(next?: string): Promise<never> {
  const locale = await getLocale();

  // `next` is echoed back after sign-in and is validated at the point of USE
  // (see `safeNext` in lib/auth/http.ts), because a path that looks relative
  // here can still be protocol-relative and escape the origin.
  redirect({
    href: next ? `/login?next=${encodeURIComponent(next)}` : '/login',
    locale,
  });

  // Unreachable: `redirect` always throws. Present so the compiler agrees.
  throw new Error('redirect did not interrupt execution');
}

/**
 * The session if there is one, without redirecting.
 *
 * For pages that render for both signed-in and anonymous visitors and merely
 * show different things.
 */
export async function optionalPageSession(): Promise<PlatformSession | null> {
  return getAuthSession();
}
