'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';

/**
 * Live preview for `footer-newsletter`.
 *
 * Mirrors the `typescript` code variant. The form is live: submit an empty or
 * malformed address and the error lands in the `aria-live` region rather than
 * a browser bubble; submit a valid one and the confirmation replaces it. Keep
 * this in step with `src/data/components/footer.ts`.
 */
type StatusState = 'idle' | 'error' | 'ok';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  heading: string;
  links: readonly FooterLink[];
}

const COLUMNS: readonly FooterColumn[] = [
  {
    heading: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/blog', label: 'Blog' },
    ],
  },
];

const COPY = 'Product news and engineering notes. One email a week, no filler.';

function FooterNewsletter() {
  const [state, setState] = useState<StatusState>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const input = inputRef.current;
    if (!input) return;

    if (!input.checkValidity()) {
      setState('error');
      setMessage('Enter a valid email address.');
      input.focus();
      return;
    }

    setState('ok');
    setMessage('Thanks - check your inbox to confirm.');
    input.value = '';
  }

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-6 pt-8 md:grid-cols-[3fr_2fr]">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">Ship better, weekly</h2>
          <p className="mb-4 mt-1.5 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {COPY}
          </p>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="footnews-email-preview" className="sr-only">
              Email address
            </label>
            <div className="flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                ref={inputRef}
                id="footnews-email-preview"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                required
                aria-invalid={state === 'error'}
                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
              >
                Subscribe
              </button>
            </div>
            <p
              role="status"
              aria-live="polite"
              className={`mt-2 min-h-5 text-[0.8125rem] ${
                state === 'error'
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-green-700 dark:text-green-400'
              }`}
            >
              {message}
            </p>
          </form>
        </div>

        <nav aria-label="Footer">
          <div className="grid grid-cols-2 gap-6">
            {COLUMNS.map((column) => (
              <div key={column.heading}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.06em] text-gray-500 dark:text-gray-400">
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href="#"
                        className="text-sm text-gray-700 hover:text-gray-900 hover:underline hover:underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-800">
        <p className="mx-auto max-w-6xl p-4 text-[0.8125rem] text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Adysre Inc.
        </p>
      </div>
    </footer>
  );
}

export default function FooterNewsletterPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <FooterNewsletter />
    </div>
  );
}
