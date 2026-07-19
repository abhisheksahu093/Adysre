'use client';

import { useId, useRef, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `input-with-icon`.
 *
 * Mirrors the `typescript` code variant. Seeded with a value on purpose: the
 * clear button only renders once there is something to clear, so an empty
 * preview would show half the component and hide the half that is interesting.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface InputWithIconProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value'> {
  label: string;
  icon?: ReactNode;
  value: string;
  onClear?: () => void;
}

function InputWithIcon({ label, icon, value, onChange, onClear, ...props }: InputWithIconProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder-gray-500 [&::-webkit-search-cancel-button]:hidden focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
          {...props}
        />
        {value.length > 0 ? (
          <button
            type="button"
            aria-label={`Clear ${label.toLowerCase()}`}
            onClick={() => {
              onClear?.();
              inputRef.current?.focus();
            }}
            className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}

const SEARCH_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export default function InputWithIconPreview() {
  const [value, setValue] = useState('gradient');

  return (
    <div className="w-full max-w-sm">
      <InputWithIcon
        label="Search components"
        icon={SEARCH_ICON}
        value={value}
        placeholder="Search components"
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue('')}
      />
    </div>
  );
}
