'use client';

import type { InputHTMLAttributes } from 'react';

/**
 * Live preview for `checkbox-switch`.
 *
 * Mirrors the `typescript` code variant verbatim. Three switches, deliberately
 * one in each position - on, off, and a disabled one - because the thumb travel
 * is the state and a single switch shows only half of it. Keep this in step with
 * `src/data/components/forms-choice.ts`.
 */
interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'role'> {
  id: string;
  label: string;
  hint?: string;
}

export function Switch({ id, label, hint, ...props }: SwitchProps) {
  const hintId = hint ? `${id}-hint` : undefined;

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          role="switch"
          aria-describedby={hintId}
          className="peer sr-only"
          {...props}
        />
        <span
          aria-hidden="true"
          className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-400 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span className="min-h-6 text-sm font-medium leading-6 text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
          {label}
        </span>
      </label>
      {hint ? (
        <p id={hintId} className="mt-1 pl-14 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function CheckboxSwitchPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Switch
        id="preview-two-factor"
        label="Two-factor authentication"
        hint="Ask for a code from your authenticator app at every sign-in."
        defaultChecked
      />
      <Switch
        id="preview-digest-switch"
        label="Weekly digest email"
        hint="Sent every Monday at 09:00 in your local time."
      />
      <Switch
        id="preview-sso-switch"
        label="Require SSO for all members"
        hint="Available on the Scale plan."
        disabled
      />
    </div>
  );
}
