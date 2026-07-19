'use client';

/**
 * Live preview for `signup-password-strength`.
 *
 * Mirrors the `typescript` code variant. The meter is genuinely live here and
 * the status is announced via aria-live. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/sign-up.ts`.
 */
import { useState } from 'react';
import type { FormEvent } from 'react';

const LABELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'] as const;
const BARS = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-lime-500', 'bg-green-500'] as const;

function scorePassword(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

interface SignupPasswordStrengthProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

function SignupPasswordStrength({
  title = 'Create your account',
  submitLabel = 'Create account',
  onSubmit = () => {},
}: SignupPasswordStrengthProps) {
  const [password, setPassword] = useState('');
  const score = scorePassword(password);
  const label = LABELS[score] ?? 'Too weak';
  const activeBar = BARS[score] ?? 'bg-red-500';

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950"
    >
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6 space-y-4">
        <div>
          <label htmlFor="sps-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
          <input
            id="sps-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
        </div>
        <div>
          <label htmlFor="sps-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            id="sps-password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-describedby="sps-strength"
            placeholder="At least 8 characters"
            className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          />
          <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 rounded-full ${i < score ? activeBar : 'bg-gray-200 dark:bg-gray-800'}`} />
            ))}
          </div>
          <p id="sps-strength" className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
            Password strength: {password ? label : 'Enter a password'}
          </p>
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export const minHeight = 480;

export default function SignupPasswordStrengthPreview() {
  return <SignupPasswordStrength />;
}
