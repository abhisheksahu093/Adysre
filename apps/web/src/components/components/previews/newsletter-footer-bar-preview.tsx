'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `newsletter-footer-bar`.
 *
 * Mirrors the `typescript` code variant verbatim. It looks identical in both
 * stage themes, which is correct and not an oversight: the bar paints its own
 * dark band and carries no `dark:` variants at all.
 * Keep this in step with `src/data/components/marketing.ts`.
 */
interface NewsletterFooterBarProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function NewsletterFooterBar({
  title,
  copy,
  ctaLabel = 'Sign up',
  onSubmit,
  className = '',
}: NewsletterFooterBarProps) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <aside aria-labelledby={titleId} className={`w-full bg-gray-900 ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-6 md:py-7">
        <div>
          <h2 id={titleId} className="text-base font-semibold text-white">
            {title}
          </h2>
          {copy ? <p className="mt-1 text-sm text-gray-300">{copy}</p> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:min-w-96"
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-gray-950 px-3 py-2.5 text-sm text-gray-100 placeholder:text-gray-400 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
          >
            {ctaLabel}
          </button>
        </form>
      </div>
    </aside>
  );
}

export default function NewsletterFooterBarPreview() {
  return (
    <NewsletterFooterBar
      title="Get the monthly roundup"
      copy="Product news and field notes. One email a month."
      ctaLabel="Sign up"
    />
  );
}
