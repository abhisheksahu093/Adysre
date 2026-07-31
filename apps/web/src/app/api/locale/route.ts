import { cookies } from 'next/headers';
import { hasLocale } from 'next-intl';
import { z } from 'zod';
import { ok, BAD_REQUEST } from '@/lib/api/response';
import { readJson, verifyOrigin } from '@/lib/auth/http';
import { routing } from '@/i18n/routing';
import { LOCALE_COOKIE, localeCookieOptions } from '@/i18n/locale-cookie';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/locale
 *
 * Records the visitor's language choice.
 *
 * ─── Why this exists ────────────────────────────────────────────────────────
 * The language switcher used to write `NEXT_LOCALE` with `document.cookie`,
 * which is why the cookie could not be `HttpOnly`. It has to be written
 * somewhere: with `localePrefix: 'as-needed'` the English routes carry no
 * prefix, so switching BACK to English from `/ja/pricing` lands on an unprefixed
 * URL that the proxy would immediately bounce to `/ja` again on the strength of
 * the old cookie. The choice has to be recorded before the navigation, and now
 * the server is what records it.
 *
 * ─── Why it is a POST ───────────────────────────────────────────────────────
 * It changes stored state. A GET that sets a cookie can be triggered by any
 * page that can make this browser fetch a URL, which would let a third-party
 * site quietly change someone's language. `verifyOrigin` plus `SameSite=Lax`
 * closes that; a GET could not use either.
 *
 * No CSRF token and no auth: the worst outcome of a forged call is a visitor
 * seeing the wrong language, which they fix by picking again. Guarding it with
 * the token reserved for password changes would be ceremony, and the token
 * cookie does not exist for a signed-out visitor anyway.
 */

const bodySchema = z.object({
  locale: z.string().refine((value) => hasLocale(routing.locales, value), {
    message: 'Unsupported locale.',
  }),
});

export async function POST(request: Request) {
  const rejected = verifyOrigin(request);
  if (rejected) return rejected;

  const parsed = bodySchema.safeParse(await readJson(request));
  if (!parsed.success) return BAD_REQUEST('A supported locale is required.');

  const store = await cookies();
  store.set(LOCALE_COOKIE, parsed.data.locale, localeCookieOptions());

  return ok({ locale: parsed.data.locale }, 'Locale preference saved.');
}
