'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-modal`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordModalProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  onClose?: () => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

function ChangePasswordModal({ onSubmit = () => {}, onClose = () => {}, className = '' }: ChangePasswordModalProps) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <div className={cx('relative w-full max-w-md', className)}>
      <div className="absolute inset-0 rounded-2xl bg-black/40" aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby={id + '-title'}
        className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-950">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={id + '-title'} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Enter your current password to confirm.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="-m-1 rounded-lg p-1 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor={id + '-current'} className={label}>Current password</label>
            <input id={id + '-current'} name="currentPassword" type="password" autoComplete="current-password"
              value={current} onChange={(e) => setCurrent(e.target.value)} className={field} />
          </div>
          <div>
            <label htmlFor={id + '-new'} className={label}>New password</label>
            <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
              value={next} onChange={(e) => setNext(e.target.value)} className={field} />
          </div>
          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800">
              Cancel
            </button>
            <button type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
              Update password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const minHeight = 440;

export default function ChangePasswordModalPreview() {
  return <ChangePasswordModal />;
}
