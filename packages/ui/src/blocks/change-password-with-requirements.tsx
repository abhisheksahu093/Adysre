'use client';

import { useId, useState, type FormEvent } from 'react';

/**
 * Live preview for `change-password-with-requirements`.
 * Mirrors the `typescript` code variant verbatim.
 * Keep this in step with `src/data/components/change-password.ts`.
 */
interface ChangePasswordWithRequirementsProps {
  onSubmit?: (values: { newPassword: string }) => void;
  className?: string;
}

interface Rule {
  key: string;
  label: string;
  met: boolean;
}

const cx = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

export function ChangePasswordWithRequirements({ onSubmit = () => {}, className = '' }: ChangePasswordWithRequirementsProps) {
  const id = useId();
  const [next, setNext] = useState('');

  const rules: Rule[] = [
    { key: 'len', label: 'At least 8 characters', met: next.length >= 8 },
    { key: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(next) },
    { key: 'num', label: 'One number', met: /[0-9]/.test(next) },
    { key: 'sym', label: 'One symbol', met: /[^A-Za-z0-9]/.test(next) },
  ];
  const allMet = rules.every((rule) => rule.met);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!allMet) return;
    onSubmit({ newPassword: next });
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cx('w-full max-w-sm space-y-4', className)}>
      <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">Choose a new password</h2>

      <div>
        <label htmlFor={id + '-new'} className="block text-sm font-medium text-gray-700 dark:text-gray-300">New password</label>
        <input id={id + '-new'} name="newPassword" type="password" autoComplete="new-password"
          value={next} onChange={(e) => setNext(e.target.value)} aria-describedby={id + '-rules'}
          className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>

      <ul id={id + '-rules'} aria-live="polite" className="space-y-1.5">
        {rules.map((rule) => (
          <li key={rule.key} className="flex items-center gap-2 text-xs">
            <span aria-hidden="true"
              className={cx('flex h-4 w-4 items-center justify-center rounded-full', rule.met ? 'bg-green-500 text-white' : 'bg-gray-200 text-transparent dark:bg-gray-700')}>
              ✓
            </span>
            <span className={rule.met ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}>{rule.label}</span>
            <span className="sr-only">{rule.met ? 'met' : 'not met'}</span>
          </li>
        ))}
      </ul>

      <button type="submit" disabled={!allMet}
        className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Update password
      </button>
    </form>
  );
}

export const minHeight = 380;

export default function ChangePasswordWithRequirementsPreview() {
  return <ChangePasswordWithRequirements />;
}
