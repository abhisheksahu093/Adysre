'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `marketing-lead-magnet`.
 *
 * Mirrors the `typescript` code variant verbatim. The form is UI-only: submit
 * is prevented and `onSubmit` is a no-op here. The gradient cover is inline SVG
 * and stacks above the copy on mobile. Keep in step with
 * `src/data/components/marketing.ts`.
 */
interface LeadMagnetProps {
  title: string;
  copy?: string;
  ctaLabel?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}

function LeadMagnet({
  title,
  copy,
  ctaLabel = 'Get the guide',
  onSubmit,
  className = '',
}: LeadMagnetProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section
      className={`grid w-full max-w-3xl items-center gap-6 rounded-2xl border border-gray-200 bg-white p-6 sm:grid-cols-[auto_1fr] sm:p-7 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="relative mx-auto aspect-[3/4] w-28 flex-none overflow-hidden rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 shadow-sm sm:mx-0">
        <svg
          viewBox="0 0 60 80"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          focusable="false"
        >
          <rect x="10" y="20" width="40" height="5" rx="2.5" fill="rgba(255,255,255,0.5)" />
          <rect x="10" y="32" width="30" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
          <rect x="10" y="42" width="34" height="4" rx="2" fill="rgba(255,255,255,0.35)" />
        </svg>
      </div>

      <div className="min-w-0">
        <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
        {copy ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
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
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </form>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Free PDF. No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}

export default function MarketingLeadMagnetPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <LeadMagnet
          title="The 2026 SaaS onboarding playbook"
          copy="28 pages of teardown, checklists and copy you can steal for your own flow."
          ctaLabel="Get the guide"
        />
      </div>
    </section>
  );
}

export const minHeight = 260;
