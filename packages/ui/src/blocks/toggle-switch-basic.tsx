'use client';

import { useId } from 'react';

/**
 * Live preview for `toggle-switch-basic`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleSwitchBasicProps {
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function ToggleSwitchBasic({
  label,
  defaultChecked = false,
  disabled = false,
  onChange,
  className = '',
}: ToggleSwitchBasicProps) {
  const id = useId();
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        role="switch"
        className="peer sr-only"
        defaultChecked={defaultChecked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
      />
      <span className="text-sm font-medium text-gray-900 peer-disabled:opacity-50 dark:text-gray-100">
        {label}
      </span>
    </label>
  );
}

export default function ToggleSwitchBasicPreview() {
  return <ToggleSwitchBasic label="Email notifications" defaultChecked />;
}
