'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `newsletter-inline`.
 *
 * Mirrors the `typescript` code variant verbatim. Tab into it: the field is
 * announced as "Email address" despite having no visible label - that is the
 * sr-only label doing its job, and it is the whole point of the entry. The form
 * itself is width-agnostic (`w-full`); the preview supplies the page shell and
 * the narrow measure that centres it.
 * Keep this in step with `src/data/components/marketing.ts`.
 */
interface NewsletterInlineProps {
  ctaLabel?: string;
  label?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

function NewsletterInline({
  ctaLabel = 'Subscribe',
  label = 'Email address',
  loading = false,
  onSubmit,
  className = '',
}: NewsletterInlineProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full flex-col gap-2 sm:flex-row ${className}`}
    >
      <label htmlFor={emailId} className="sr-only">
        {label}
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
        className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />
      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </button>
    </form>
  );
}

export default function NewsletterInlinePreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mx-auto w-full max-w-md">
          <NewsletterInline ctaLabel="Subscribe" label="Email address" />
        </div>
      </div>
    </section>
  );
}
