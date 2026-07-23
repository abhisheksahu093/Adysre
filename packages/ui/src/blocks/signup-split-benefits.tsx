'use client';

/**
 * Live preview for `signup-split-benefits`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import type { FormEvent } from 'react';

const CHECK =
  'M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.3 3.29 6.8-6.8a1 1 0 0 1 1.4 0Z';

interface SignupSplitBenefitsProps {
  title?: string;
  benefitsTitle?: string;
  benefits?: string[];
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

export function SignupSplitBenefits({
  title = 'Create your account',
  benefitsTitle = 'Everything you need to ship',
  benefits = [
    'Unlimited projects and members',
    'SOC 2 Type II and SSO ready',
    'Cancel any time, no lock-in',
  ],
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupSplitBenefitsProps) {
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';

  return (
    <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(event);
        }}
        className="order-1 p-6 sm:p-8"
      >
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Free forever for solo projects.</p>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="ssb-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work email</label>
            <input id="ssb-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className={field} />
          </div>
          <div>
            <label htmlFor="ssb-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input id="ssb-password" name="password" type="password" autoComplete="new-password" required placeholder="At least 8 characters" className={field} />
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {submitLabel}
        </button>
      </form>

      <aside className="order-2 border-t border-gray-200 bg-gray-50 p-6 sm:p-8 md:border-l md:border-t-0 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{benefitsTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex gap-2.5">
              <svg viewBox="0 0 20 20" fill="currentColor" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true">
                <path fillRule="evenodd" d={CHECK} clipRule="evenodd" />
              </svg>
              {benefit}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export const minHeight = 560;

export default function SignupSplitBenefitsPreview() {
  return <SignupSplitBenefits />;
}
