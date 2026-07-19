'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-basic`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordBasicProps {
  onSubmit?: (values: { currentPassword: string; newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

function ChangePasswordBasic({ onSubmit = () => {}, className = '' }: ChangePasswordBasicProps) {
  const id = useId();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const mismatch = confirm.length > 0 && next !== confirm;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || mismatch) return;
    onSubmit({ currentPassword: current, newPassword: next });
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const type = show ? 'text' : 'password';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>

      <div>
        <label htmlFor={id + '-current'} className={label}>Current password</label>
        <input id={id + '-current'} name="currentPassword" type={type} autoComplete="current-password"
          value={current} onChange={(e) => setCurrent(e.target.value)}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
      </div>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type={type} autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)}
          className={cx(field, 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400')} />
      </div>

      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm new password</label>
        <input id={id + '-confirm'} name="confirmPassword" type={type} autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(
            field,
            mismatch
              ? 'border-red-400 focus-visible:ring-red-500 dark:border-red-500'
              : 'border-gray-300 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:ring-blue-400',
          )} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input id={id + '-show'} type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-600 dark:bg-gray-900" />
        <label htmlFor={id + '-show'} className="text-sm text-gray-600 dark:text-gray-400">Show passwords</label>
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}

export const minHeight = 420;

export default function ChangePasswordBasicPreview() {
  return <ChangePasswordBasic />;
}
