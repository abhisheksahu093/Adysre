'use client';

/**
 * Live preview for `reset-password-with-strength`.
 *
 * Mirrors the `typescript` code variant. The meter is genuinely live here and
 * the strength is announced via aria-live. UI-only: onSubmit is a no-op. Keep
 * this in step with `src/data/components/reset-password.ts`.
 */
import { useId, useState } from 'react';
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

interface ResetPasswordWithStrengthProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

function ResetPasswordWithStrength({
  title = 'Choose a new password',
  submitLabel = 'Save password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordWithStrengthProps) {
  const pwId = useId();
  const [password, setPassword] = useState('');
  const score = scorePassword(password);
  const label = LABELS[score] ?? 'Too weak';
  const activeBar = BARS[score] ?? 'bg-red-500';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ password });
  }

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="mt-6">
        <label htmlFor={pwId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input
          id={pwId}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={`${pwId}-label`}
          placeholder="At least 8 characters"
          className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 rounded-full ${i < score ? activeBar : 'bg-gray-200 dark:bg-gray-800'}`} />
          ))}
        </div>
        <p id={`${pwId}-label`} className="mt-1.5 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
          Password strength: {password ? label : 'Enter a password'}
        </p>
      </div>

      <button type="submit" className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        {submitLabel}
      </button>
    </form>
  );
}

export const minHeight = 420;

export default function ResetPasswordWithStrengthPreview() {
  return <ResetPasswordWithStrength />;
}
