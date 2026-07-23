'use client';

/**
 * Live preview for `signup-boxed-logo`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

interface SignupBoxedLogoProps {
  brand?: string;
  title?: string;
  submitLabel?: string;
  signInHref?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupBoxedLogo({
  brand = 'Acme',
  title = 'Create your account',
  submitLabel = 'Create account',
  signInHref = '#',
  onSubmit = () => {},
}: SignupBoxedLogoProps) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 flex flex-col items-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-sm" aria-hidden="true">
          {brand.charAt(0)}
        </span>
        <span className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">{brand}</span>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
      >
        <h1 className="text-center text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="sbl-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
            <input id="sbl-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="sbl-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="sbl-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href={signInHref} className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">Sign in</a>
        </p>
      </form>
    </div>
  );
}

export const minHeight = 470;

export default function SignupBoxedLogoPreview() {
  return <SignupBoxedLogo />;
}
