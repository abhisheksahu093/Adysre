'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-2fa`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePassword2faProps {
  onSubmit?: (values: { newPassword: string; code: string }) => void;
  className?: string;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePassword2fa({ onSubmit = () => {}, className = '' }: ChangePassword2faProps) {
  const id = useId();
  const [next, setNext] = useState('');
  const [code, setCode] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!next || code.length !== 6) return;
    onSubmit({ newPassword: next, code });
  }

  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Change password</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">Confirm with the 6-digit code from your authenticator app.</p>

      <div>
        <label htmlFor={id + '-new'} className={label}>New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <div>
        <label htmlFor={id + '-code'} className={label}>Verification code</label>
        <input id={id + '-code'} name="code" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456"
          value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-center text-lg tracking-[0.4em] text-gray-900 shadow-sm placeholder:tracking-normal placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <button type="submit"
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Confirm and update
      </button>
    </form>
  );
}

export const minHeight = 380;

export default function ChangePassword2faPreview() {
  return <ChangePassword2fa />;
}
