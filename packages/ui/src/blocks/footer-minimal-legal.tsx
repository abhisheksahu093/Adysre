'use client';

import { Fragment } from 'react';

/**
 * Live preview for `footer-minimal-legal`.
 *
 * Mirrors the `typescript` code variant. The separators are `aria-hidden` list
 * items, so a screen reader reads "Privacy, Terms, Cookies" rather than
 * "Privacy middle dot Terms middle dot Cookies". Keep this in step with
 * `src/data/components/footer.ts`.
 */
interface LegalLink {
  href: string;
  label: string;
}

const LEGAL: readonly LegalLink[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/cookies', label: 'Cookies' },
];

export function FooterMinimalLegal() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4 sm:justify-between">
        <p className="text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © <time dateTime={String(year)}>{year}</time> Adysre Inc.
        </p>

        <nav aria-label="Legal">
          <ul className="flex items-center gap-2">
            {LEGAL.map((link, index) => (
              <Fragment key={link.href}>
                {index > 0 ? (
                  <li
                    aria-hidden="true"
                    className="select-none text-[0.8125rem] text-gray-300 dark:text-gray-600"
                  >
                    ·
                  </li>
                ) : null}
                <li>
                  <a
                    href="#"
                    className="text-[0.8125rem] text-gray-600 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                  >
                    {link.label}
                  </a>
                </li>
              </Fragment>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default function FooterMinimalLegalPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterMinimalLegal />
    </div>
  );
}
