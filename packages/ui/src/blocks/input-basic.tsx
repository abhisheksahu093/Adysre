'use client';

import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Live preview for `input-basic`.
 *
 * Mirrors the `typescript` code variant verbatim, down to the `useId` wiring -
 * the whole claim of this entry is that the label and the input cannot end up
 * on different ids, so the preview has to be the real thing rather than markup
 * that merely looks like it.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface InputBasicProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  helperText?: string;
}

export function InputBasic({ label, helperText, className = '', ...props }: InputBasicProps) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default function InputBasicPreview() {
  return (
    <div className="w-full max-w-sm">
      <InputBasic
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        helperText="We only use this to send receipts."
      />
    </div>
  );
}
