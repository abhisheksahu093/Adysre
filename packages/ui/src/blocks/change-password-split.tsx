'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-split`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordSplitProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordSplit({ onSubmit = () => {}, className = '' }: ChangePasswordSplitProps) {
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
    <div className={cx('grid w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:grid-cols-2 dark:border-gray-800 dark:bg-gray-950', className)}>
      <div className="border-b border-gray-200 bg-gray-50 p-6 md:border-b-0 md:border-r dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Pick something long and unique. A passphrase of a few unrelated words beats a short jumble.</p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-2"><span aria-hidden="true" className="text-green-500">✓</span> Never reused elsewhere</li>
          <li className="flex gap-2"><span aria-hidden="true" className="text-green-500">✓</span> Stored in your manager</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 p-6">
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
        <button type="submit"
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
          Update password
        </button>
      </form>
    </div>
  );
}

export const minHeight = 560;

export default function ChangePasswordSplitPreview() {
  return <ChangePasswordSplit />;
}
