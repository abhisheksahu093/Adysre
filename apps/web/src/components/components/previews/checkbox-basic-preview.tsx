'use client';

import type { InputHTMLAttributes } from 'react';

/**
 * Live preview for `checkbox-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Two fields so both states are
 * visible at once - one checked, one not - plus a disabled row, because the
 * dimmed state is the one people forget to check for contrast. Keep this in step
 * with `src/data/components/forms-choice.ts`.
 */
interface CheckboxFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id'> {
  id: string;
  label: string;
  hint?: string;
}

function CheckboxField({ id, label, hint, ...props }: CheckboxFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        aria-describedby={hintId}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        {...props}
      />
      <div>
        <label
          htmlFor={id}
          className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
        >
          {label}
        </label>
        {hint ? (
          <p id={hintId} className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default function CheckboxBasicPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <CheckboxField
        id="preview-newsletter"
        label="Email me product updates"
        hint="About one email a month. Unsubscribe at any time."
        defaultChecked
      />
      <CheckboxField
        id="preview-digest"
        label="Weekly activity digest"
        hint="A summary of everything that changed in your workspace."
      />
      <CheckboxField
        id="preview-beta"
        label="Join the beta programme"
        hint="Not available on your current plan."
        disabled
      />
    </div>
  );
}
