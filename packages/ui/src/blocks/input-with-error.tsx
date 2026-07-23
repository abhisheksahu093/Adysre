'use client';

import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Live preview for `input-with-error`.
 *
 * Mirrors the `typescript` code variant. Rendered in its error state, because a
 * valid-looking preview of an error component shows nothing the entry is about.
 * Both fields are the same component - the pair makes the point that the red
 * border and the announcement are derived from one value, not set separately.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface InputWithErrorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'aria-invalid'> {
  label: string;
  error?: string;
  helperText?: string;
}

export function InputWithError({ label, error, helperText, ...props }: InputWithErrorProps) {
  const id = useId();
  const msgId = `${id}-msg`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={error ?? helperText ? msgId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus-visible:border-red-600 aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:aria-[invalid=true]:border-red-500"
        {...props}
      />
      {invalid ? (
        <p id={msgId} className="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400">
          <svg
            className="mt-px h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={msgId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default function InputWithErrorPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Invalid: aria-invalid="true", and the message is its description. */}
      <InputWithError
        label="Email address"
        type="email"
        defaultValue="jane@"
        error="Enter a complete email address, like jane@example.com."
      />
      {/* Same component, no error - the helper takes the message's place. */}
      <InputWithError
        label="Company"
        type="text"
        defaultValue="Adysre Inc."
        helperText="Shown on your invoices."
      />
    </div>
  );
}
