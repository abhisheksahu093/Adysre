'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { LUMIERE_BUNDLES, type LumiereBundle } from './lumiere-locale-data';

/**
 * LUMIERE - viewing preferences: currency and language.
 *
 * A salon with a Tokyo clientele prices in one currency and quotes in several,
 * so money is stored ONCE in the content module (pounds, as plain numbers) and
 * converted at the edge. Nothing downstream stores a formatted string, which is
 * why switching currency updates every price on the page at once.
 *
 * Rates are fixed and illustrative on purpose: a design template must render
 * the same on the server and the client, and a live FX call would both break
 * hydration and quietly become wrong. A salon replaces `LUMIERE_RATES` with
 * their own figures, or points `format` at their pricing service.
 */

export const LUMIERE_CURRENCIES = [
  { id: 'GBP', symbol: '£', rate: 1, decimals: 2, label: 'GBP' },
  { id: 'USD', symbol: '$', rate: 1.27, decimals: 2, label: 'USD' },
  { id: 'JPY', symbol: '¥', rate: 197, decimals: 0, label: 'JPY' },
  { id: 'HKD', symbol: 'HK$', rate: 9.9, decimals: 2, label: 'HKD' },
] as const satisfies readonly {
  id: string;
  symbol: string;
  rate: number;
  decimals: number;
  label: string;
}[];

export type LumiereCurrencyId = (typeof LUMIERE_CURRENCIES)[number]['id'];

export const LUMIERE_LOCALES = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ja', label: '日本語', short: 'JA' },
] as const;

export type LumiereLocaleId = (typeof LUMIERE_LOCALES)[number]['id'];

interface LumiereSettings {
  currency: LumiereCurrencyId;
  setCurrency: (currency: LumiereCurrencyId) => void;
  locale: LumiereLocaleId;
  setLocale: (locale: LumiereLocaleId) => void;
  /** Converts a base (GBP) amount and formats it in the chosen currency. */
  formatPrice: (amount: number) => string;
  /**
   * Every string and every catalogue entry, in the chosen language. Components
   * read this rather than importing the English module, which is what makes the
   * language picker change the page instead of only the header.
   */
  data: LumiereBundle;
}

const SettingsContext = createContext<LumiereSettings | null>(null);

export function LumiereSettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<LumiereCurrencyId>('GBP');
  const [locale, setLocale] = useState<LumiereLocaleId>('en');

  const value = useMemo<LumiereSettings>(() => {
    const active = LUMIERE_CURRENCIES.find((entry) => entry.id === currency) ?? LUMIERE_CURRENCIES[0];

    return {
      currency,
      setCurrency,
      locale,
      setLocale,
      data: LUMIERE_BUNDLES[locale],
      formatPrice: (amount: number) => {
        const converted = amount * active.rate;
        /*
         * Manual grouping rather than `Intl.NumberFormat`: this template renders
         * on the server and hydrates on the client, and a locale-sensitive
         * formatter is the classic source of a hydration mismatch. Yen needs the
         * separator most (¥18,912), so it is worth the four lines.
         */
        const fixed = converted.toFixed(active.decimals);
        const [whole, fraction] = fixed.split('.');
        const grouped = (whole ?? '0').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${active.symbol}${grouped}${fraction ? `.${fraction}` : ''}`;
      },
    };
  }, [currency, locale]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

/**
 * The template's own settings. Throws rather than falling back, because a price
 * rendered outside the provider would silently show the wrong currency - a
 * missing provider is a bug worth failing loudly on.
 */
export function useLumiereSettings(): LumiereSettings {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error('useLumiereSettings must be used inside LumiereSettingsProvider');
  return settings;
}
