'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `newsletter-split`.
 *
 * Mirrors the `typescript` code variant verbatim. The section is width-agnostic
 * (`w-full`); the preview supplies the page shell that centres it. Below the `md`
 * breakpoint it collapses to the stacked layout - copy above form, in source
 * order - which is the half of the design most worth checking.
 * Keep this in step with `src/data/components/marketing.ts`.
 */
interface NewsletterSplitProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

export function NewsletterSplit({
  title,
  kicker,
  copy,
  ctaLabel = 'Subscribe',
  onSubmit,
  className = '',
}: NewsletterSplitProps) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={`grid w-full items-center gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}
        <h2
          id={titleId}
          className="mt-2 text-[1.375rem] font-bold leading-snug tracking-tight text-gray-900 dark:text-gray-100"
        >
          {title}
        </h2>
        {copy ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2">
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
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
        <p className="text-xs text-gray-500 dark:text-gray-400">14,000 engineers already read it.</p>
      </form>
    </section>
  );
}

export default function NewsletterSplitPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <NewsletterSplit
          title="The five-minute engineering digest"
          kicker="Weekly"
          copy="What broke, what shipped, and what we learned - from teams running the same stack as you."
          ctaLabel="Subscribe"
        />
      </div>
    </section>
  );
}
