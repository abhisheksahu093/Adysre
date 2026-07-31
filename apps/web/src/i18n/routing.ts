import { defineRouting } from 'next-intl/routing';
import { LOCALE_COOKIE_ROUTING_OPTIONS } from './locale-cookie';

/**
 * Locale routing - the single source of truth for which languages exist.
 *
 * Adding a language is two steps:
 *   1. Add its code to `locales` below and a label to LOCALE_LABELS.
 *   2. Create `messages/<code>.json` (copy en.json and translate).
 *
 * `localePrefix: 'as-needed'` keeps English on clean URLs (/dashboard) and
 * prefixes the rest (/ja/dashboard), so existing links and bookmarks survive.
 */
export const routing = defineRouting({
  locales: ['en', 'ja', 'zh', 'hi'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Flags for the `NEXT_LOCALE` cookie the proxy sets. `httpOnly` is not in
  // this option's type and is applied in `proxy.ts`; see `locale-cookie.ts`.
  localeCookie: LOCALE_COOKIE_ROUTING_OPTIONS,
});

export type Locale = (typeof routing.locales)[number];

/** Shown in the language switcher - endonyms, as users expect their own name. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  hi: 'हिन्दी',
};
