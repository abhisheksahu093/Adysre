/**
 * Number to English words, for the "Amount in Words" line every payslip design
 * shows. Pure and unit-tested. Handles non-negative integers up to the billions;
 * the fractional part is dropped (payslip amounts are whole) and "Only" is
 * appended in `amountInWords`, matching the convention on the references.
 */

const ONES = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen',
];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

function underThousand(n: number): string {
  let out = '';
  if (n >= 100) {
    out += `${ONES[Math.floor(n / 100)]} Hundred`;
    n %= 100;
    if (n) out += ' ';
  }
  if (n >= 20) {
    out += TENS[Math.floor(n / 10)];
    const unit = n % 10;
    if (unit) out += `-${ONES[unit]}`;
  } else if (n > 0) {
    out += ONES[n];
  }
  return out;
}

export function numberToWords(value: number): string {
  let n = Math.floor(Math.abs(value));
  if (n === 0) return 'Zero';

  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }

  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i -= 1) {
    if (groups[i] === 0) continue;
    const scale = SCALES[i];
    parts.push(underThousand(groups[i]!) + (scale ? ` ${scale}` : ''));
  }
  return parts.join(' ');
}

/** e.g. `amountInWords(51100, 'Indian Rupee')` -> "Indian Rupee Fifty-One Thousand One Hundred Only". */
export function amountInWords(value: number, currencyWord?: string): string {
  const words = numberToWords(value);
  return `${currencyWord ? `${currencyWord} ` : ''}${words} Only`;
}

/** Full currency name for the words line, per ISO code. Falls back to the code. */
export const CURRENCY_WORDS: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'Pound Sterling',
  INR: 'Indian Rupee',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  JPY: 'Japanese Yen',
  AED: 'UAE Dirham',
  SGD: 'Singapore Dollar',
};
