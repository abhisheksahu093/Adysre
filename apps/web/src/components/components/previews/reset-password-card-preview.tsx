'use client';

/**
 * Live preview for `reset-password-card`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. Keep this
 * in step with `src/data/components/reset-password.ts`.
 */
import { useId, useState } from 'react';
import type { FormEvent } from 'react';

interface ResetPasswordCardProps {
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

function ResetPasswordCard({
  title = 'Reset password',
  subtitle = 'Choose a new password for your account.',
  submitLabel = 'Reset password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordCardProps) {
  const pwId = useId();
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({ password });
  }

  return (
    <div className={`mx-auto w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
      </span>
      <h1 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
        <div>
          <label htmlFor={pwId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
          <input
            id={pwId}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            placeholder="At least 8 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
          />
        </div>

        <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

export const minHeight = 400;

export default function ResetPasswordCardPreview() {
  return <ResetPasswordCard />;
}
