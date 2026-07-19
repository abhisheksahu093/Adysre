'use client';

/**
 * Live preview for `footer-language-currency`.
 *
 * Mirrors the `typescript` code variant. Keep this in step with
 * `src/data/components/footer.ts`.
 */
interface FooterLink {
  href: string;
  label: string;
}

interface Option {
  value: string;
  label: string;
}

const LINKS: readonly FooterLink[] = [
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/privacy', label: 'Privacy' },
];

const LANGUAGES: readonly Option[] = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'fr-FR', label: 'Français' },
  { value: 'de-DE', label: 'Deutsch' },
  { value: 'ja-JP', label: '日本語' },
];

const CURRENCIES: readonly Option[] = [
  { value: 'USD', label: 'USD $' },
  { value: 'EUR', label: 'EUR €' },
  { value: 'GBP', label: 'GBP £' },
  { value: 'JPY', label: 'JPY ¥' },
];

function FooterLanguageCurrency({ locale = 'en-US', currency = 'USD' }: { locale?: string; currency?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <a
            href="#"
            className="font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Adysre
          </a>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
            <svg className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z" />
            </svg>
            <label htmlFor="footer-lang" className="sr-only">
              Language
            </label>
            <select
              id="footer-lang"
              defaultValue={locale}
              className="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            >
              {LANGUAGES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex min-h-10 items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:focus-within:ring-blue-400">
            <label htmlFor="footer-cur" className="sr-only">
              Currency
            </label>
            <select
              id="footer-cur"
              defaultValue={currency}
              className="min-w-0 bg-transparent text-sm text-gray-700 focus:outline-none dark:text-gray-300"
            >
              {CURRENCIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>
      </div>
    </footer>
  );
}

export const minHeight = 240;

export default function FooterLanguageCurrencyPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterLanguageCurrency />
    </div>
  );
}
