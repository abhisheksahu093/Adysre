'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-inline`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordInlineProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordInline({ onSubmit = () => {}, className = '' }: ChangePasswordInlineProps) {
  const id = useId();
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <div className={cx('flex w-full max-w-2xl flex-col gap-4 border-b border-gray-200 py-5 sm:flex-row sm:items-start sm:justify-between dark:border-gray-800', className)}>
      <div className="sm:max-w-xs">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Password</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Set a new password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="w-full space-y-3 sm:max-w-xs">
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm password</label>
          <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
            value={confirm} onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
            className={cx(field, mismatch ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500' : ok)} />
          {mismatch ? (
            <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
              Passwords do not match.
            </p>
          ) : null}
        </div>
        <button type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 sm:w-auto">
          Save
        </button>
      </form>
    </div>
  );
}

export const minHeight = 340;

export default function ChangePasswordInlinePreview() {
  return <ChangePasswordInline />;
}
