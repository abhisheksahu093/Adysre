'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { TAVOLA_BUNDLES, type TavolaBundle } from './tavola-locale-data';

/**
 * TAVOLA - viewing preferences: currency and language.
 *
 * A restaurant that delivers locally but is quoted internationally prices in
 * ONE currency and displays in several, so money is stored once in the content
 * module (USD, as plain numbers) and converted at the edge. Nothing downstream
 * holds a formatted string, which is why switching currency updates the menu,
 * the basket and the hero at the same instant.
 *
 * Rates are fixed and illustrative on purpose: a template must render the same
 * on the server and on the client, and a live FX call would both break
 * hydration and quietly go stale. A restaurant swaps in their own figures.
 */

export const TAVOLA_CURRENCIES = [
  { id: 'USD', symbol: '$', rate: 1, decimals: 2, label: 'USD' },
  { id: 'EUR', symbol: '€', rate: 0.92, decimals: 2, label: 'EUR' },
  { id: 'GBP', symbol: '£', rate: 0.79, decimals: 2, label: 'GBP' },
  { id: 'JPY', symbol: '¥', rate: 156, decimals: 0, label: 'JPY' },
] as const satisfies readonly {
  id: string;
  symbol: string;
  rate: number;
  decimals: number;
  label: string;
}[];

export type TavolaCurrencyId = (typeof TAVOLA_CURRENCIES)[number]['id'];

export const TAVOLA_LOCALES = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'ja', label: '日本語', short: 'JA' },
] as const;

export type TavolaLocaleId = (typeof TAVOLA_LOCALES)[number]['id'];

interface TavolaSettings {
  currency: TavolaCurrencyId;
  setCurrency: (currency: TavolaCurrencyId) => void;
  locale: TavolaLocaleId;
  setLocale: (locale: TavolaLocaleId) => void;
  /** Converts a base (USD) amount and formats it in the chosen currency. */
  formatPrice: (amount: number) => string;
  /**
   * Every string and every catalogue entry, in the chosen language. Components
   * read this rather than importing the English module, which is what makes the
   * language picker change the page instead of only the header.
   */
  data: TavolaBundle;
}

const SettingsContext = createContext<TavolaSettings | null>(null);

export function TavolaSettingsProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<TavolaCurrencyId>('USD');
  const [locale, setLocale] = useState<TavolaLocaleId>('en');

  const value = useMemo<TavolaSettings>(() => {
    const active = TAVOLA_CURRENCIES.find((entry) => entry.id === currency) ?? TAVOLA_CURRENCIES[0];

    return {
      currency,
      setCurrency,
      locale,
      setLocale,
      data: TAVOLA_BUNDLES[locale],
      formatPrice: (amount: number) => {
        const converted = amount * active.rate;
        /*
         * Manual grouping rather than `Intl.NumberFormat`: this template renders
         * on the server and hydrates on the client, and a locale-sensitive
         * formatter is the classic source of a hydration mismatch. Yen needs the
         * separator most (¥4,193), so it is worth the four lines.
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
export function useTavolaSettings(): TavolaSettings {
  const settings = useContext(SettingsContext);
  if (!settings) throw new Error('useTavolaSettings must be used inside TavolaSettingsProvider');
  return settings;
}
