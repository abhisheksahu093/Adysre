'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `marketing-webinar-signup`.
 *
 * Mirrors the `typescript` code variant verbatim. Form is UI-only: submit is
 * prevented and `onSubmit` no-ops here. The date badge and the form stack on
 * mobile. The section itself is width-agnostic (`w-full`); the preview supplies
 * the page shell that centres it. Keep in step with
 * `src/data/components/marketing.ts`.
 */
interface WebinarSignupProps {
  title: string;
  dateLabel: string;
  timeLabel: string;
  presenter?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function WebinarSignup({
  title,
  dateLabel,
  timeLabel,
  presenter,
  ctaLabel = 'Save my seat',
  onSubmit,
  className = '',
}: WebinarSignupProps) {
  const emailId = useId();
  const titleId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      aria-labelledby={titleId}
      className={`w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-7 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            focusable="false"
          >
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <path d="M8 2v4M16 2v4M3 10h18" strokeLinecap="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            Live webinar
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {dateLabel} &middot; {timeLabel}
          </p>
        </div>
      </div>

      <h2 id={titleId} className="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
        {title}
      </h2>
      {presenter ? (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Hosted by {presenter}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={emailId} className="sr-only">
          Work email
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
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <button
          type="submit"
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </button>
      </form>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Can&rsquo;t make it? Register and we&rsquo;ll send the recording.</p>
    </section>
  );
}

export default function MarketingWebinarSignupPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <WebinarSignup
          title="Scaling design systems without slowing product teams"
          dateLabel="Thu, Aug 14"
          timeLabel="11:00 AM ET"
          presenter="Dana Ruiz, Head of Design"
          ctaLabel="Save my seat"
        />
      </div>
    </section>
  );
}

export const minHeight = 340;
