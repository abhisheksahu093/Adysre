import { defineRouting } from 'next-intl/routing';

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
});

export type Locale = (typeof routing.locales)[number];

/** Shown in the language switcher - endonyms, as users expect their own name. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ja: '日本語',
  zh: '中文',
  hi: 'हिन्दी',
};
