/**
 * Locale-aware money and date formatting via the built-in `Intl` - no library,
 * no config. `formatMoney` falls back gracefully if a currency code is unknown
 * so a half-typed document never throws in the live preview.
 */

export function formatMoney(amount: number, currency: string, locale = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatDate(iso: string, locale = 'en-US'): string {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'JPY', 'AED', 'SGD'] as const;
