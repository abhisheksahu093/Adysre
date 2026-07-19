'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-card`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordCardProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  onCancel?: () => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

function ChangePasswordCard({ onSubmit = () => {}, onCancel = () => {}, className = '' }: ChangePasswordCardProps) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate
      className={cx('w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950', className)}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Use at least 8 characters with a mix of types.</p>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor={id + '-current'} className={label}>Current password</label>
          <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
            value={current} onChange={(e) => setCurrent(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-new'} className={label}>New password</label>
          <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
            value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
        </div>
        <div>
          <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
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
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
          Cancel
        </button>
        <button type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </div>
    </form>
  );
}

export const minHeight = 460;

export default function ChangePasswordCardPreview() {
  return <ChangePasswordCard />;
}
