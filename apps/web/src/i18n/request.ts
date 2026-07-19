import { hasLocale } from 'next-intl';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/** Loads the message catalogue for the active request's locale. */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  // An unknown /xx/ prefix must not crash the render - fall back to English.
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
