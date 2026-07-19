'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `hero-with-form`.
 *
 * Mirrors the `typescript` code variant verbatim. The form is live: type into
 * it, tab through it, and note that the field is properly named even though its
 * label is invisible.
 * Keep this in step with `src/data/components/hero.ts`.
 */
interface HeroWithFormProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  loading?: boolean;
  onSubmit?: (email: string) => void;
  className?: string;
}

function HeroWithForm({
  title,
  kicker,
  copy,
  ctaLabel = 'Get early access',
  loading = false,
  onSubmit,
  className = '',
}: HeroWithFormProps) {
  const emailId = useId();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={`mx-auto w-full max-w-xl px-4 py-12 text-center sm:py-16 ${className}`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
          {kicker}
        </p>
      ) : null}

      <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-100">
        {title}
      </h1>

      {copy ? (
        <p className="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-7">
        <label htmlFor={emailId} className="sr-only">
          Email address
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </form>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        We only email once. Unsubscribe any time.
      </p>
    </section>
  );
}

export default function HeroWithFormPreview() {
  return (
    <HeroWithForm
      title="Get on the list"
      kicker="Launching this autumn"
      copy="One email when we open the doors. No drip campaign, no spam."
      ctaLabel="Get early access"
    />
  );
}
