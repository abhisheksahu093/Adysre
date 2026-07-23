'use client';

/**
 * Live preview for `signup-minimal-email-only`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupMinimalEmailOnlyProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupMinimalEmailOnly({
  title = 'Get started free',
  subtitle = "Enter your email - we'll send a magic link.",
  submitLabel = 'Sign up',
  onSubmit = () => {},
}: SignupMinimalEmailOnlyProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm text-center"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <label htmlFor="sme-email" className="sr-only">Email address</label>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <input
          id="sme-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">No password required. Unsubscribe any time.</p>
    </form>
  );
}

export const minHeight = 260;

export default function SignupMinimalEmailOnlyPreview() {
  return <SignupMinimalEmailOnly />;
}
