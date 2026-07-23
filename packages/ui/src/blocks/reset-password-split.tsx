'use client';

/**
 * Live preview for `reset-password-split`.
 *
 * Mirrors the `typescript` code variant. UI-only: onSubmit is a no-op. The
 * gradient panel is hidden below md, so at narrow stage widths only the form
 * column shows. Keep this in step with `src/data/components/reset-password.ts`.
 */
import { useId, useState } from 'react';
import type { FormEvent } from 'react';

interface ResetPasswordSplitProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (data: { password: string }) => void;
  className?: string;
}

export function ResetPasswordSplit({
  title = 'Reset your password',
  submitLabel = 'Update password',
  onSubmit = () => {},
  className = '',
}: ResetPasswordSplitProps) {
  const newId = useId();
  const confirmId = useId();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (confirm !== password) return;
    onSubmit({ password });
  }

  return (
    <div className={`mx-auto grid w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <div className="p-6 sm:p-8">
        <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Pick something you haven't used before.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={newId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
            <input id={newId} name="password" type="password" autoComplete="new-password" required minLength={8} placeholder="At least 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <div>
            <label htmlFor={confirmId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm password</label>
            <input id={confirmId} name="confirm" type="password" autoComplete="new-password" required placeholder="Re-enter your password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="mt-1.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" />
          </div>
          <button type="submit" className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>

      <div className="hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 md:flex md:flex-col md:justify-end" aria-hidden="true">
        <p className="text-lg font-semibold text-white">One strong password, and you're back in.</p>
        <p className="mt-2 text-sm text-blue-100">Your reset link keeps the account safe until you finish.</p>
      </div>
    </div>
  );
}

export const minHeight = 440;

export default function ResetPasswordSplitPreview() {
  return <ResetPasswordSplit />;
}
