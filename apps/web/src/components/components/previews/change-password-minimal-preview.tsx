'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-minimal`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordMinimalProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

function ChangePasswordMinimal({ onSubmit = () => {}, className = '' }: ChangePasswordMinimalProps) {
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
    'mt-1 block w-full border-0 border-b bg-transparent px-0 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-0 dark:text-gray-100';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const ok = 'border-gray-300 focus-visible:border-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-xs space-y-3', className)}>
      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} className={cx(field, ok)} />
      </div>
      <div>
        <label htmlFor={id + '-confirm'} className={label}>Confirm</label>
        <input id={id + '-confirm'} name="confirmPassword" type="password" autoComplete="new-password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)}
          aria-invalid={mismatch} aria-describedby={mismatch ? id + '-confirm-error' : undefined}
          className={cx(field, mismatch ? 'border-red-400 focus-visible:border-red-500 dark:border-red-500' : ok)} />
        {mismatch ? (
          <p id={id + '-confirm-error'} role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            Passwords do not match.
          </p>
        ) : null}
      </div>
      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-950">
        Save
      </button>
    </form>
  );
}

export const minHeight = 280;

export default function ChangePasswordMinimalPreview() {
  return <ChangePasswordMinimal />;
}
