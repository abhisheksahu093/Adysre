'use client';

import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `input-with-addon`.
 *
 * Mirrors the `typescript` code variant. Focus the field to see the ring wrap
 * the whole group rather than the input alone - that focus-within behaviour is
 * the reason the wrapper owns the border, and it is invisible at rest.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface InputWithAddonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'prefix'> {
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  helperText?: string;
}

const ADDON =
  'inline-flex select-none items-center bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400';

function InputWithAddon({ label, prefix, suffix, helperText, ...props }: InputWithAddonProps) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        {prefix ? (
          // aria-hidden: scaffolding, not part of the field's accessible name.
          <span aria-hidden="true" className={`${ADDON} border-r border-gray-300 dark:border-gray-700`}>
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          aria-describedby={helperText ? helpId : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
        {suffix ? (
          <span aria-hidden="true" className={`${ADDON} border-l border-gray-300 dark:border-gray-700`}>
            {suffix}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export default function InputWithAddonPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/* Both addons. */}
      <InputWithAddon
        label="Site domain"
        prefix="https://"
        suffix=".com"
        type="text"
        defaultValue="adysre"
        helperText="Lowercase letters and hyphens only."
      />
      {/* Prefix only - the group collapses to one side. */}
      <InputWithAddon label="Monthly budget" prefix="$" type="text" defaultValue="2,400" />
    </div>
  );
}
