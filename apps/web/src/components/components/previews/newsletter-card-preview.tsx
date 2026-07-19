'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `newsletter-card`.
 *
 * Mirrors the `typescript` code variant verbatim. Worth flipping the stage to
 * dark: the input drops to gray-950 while the card stays gray-900, which is
 * what keeps the field from dissolving into its own container.
 * Keep this in step with `src/data/components/marketing.ts`.
 */
interface NewsletterCardProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

function NewsletterCard({
  title,
  copy,
  ctaLabel = 'Subscribe',
  loading = false,
  onSubmit,
  className = '',
}: NewsletterCardProps) {
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
      className={`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:shadow-none ${className}`}
    >
      <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {copy ? (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-2">
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
          disabled={loading}
          aria-busy={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        No spam. Unsubscribe in one click.
      </p>
    </section>
  );
}

export default function NewsletterCardPreview() {
  return (
    <NewsletterCard
      title="Subscribe to the changelog"
      copy="Every shipped feature, once a fortnight. Written by the people who built it."
      ctaLabel="Subscribe"
    />
  );
}
