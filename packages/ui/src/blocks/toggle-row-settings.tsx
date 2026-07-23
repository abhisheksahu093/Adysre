'use client';

import { useId } from 'react';

/**
 * Live preview for `toggle-row-settings`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleRowSettingsProps {
  title: string;
  description?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function ToggleRowSettings({
  title,
  description,
  defaultChecked = false,
  onChange,
  className = '',
}: ToggleRowSettingsProps) {
  const hintId = useId();
  return (
    <label className={`flex w-full max-w-md cursor-pointer items-start justify-between gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-800 ${className}`}>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-gray-900 dark:text-gray-100">{title}</span>
        {description ? (
          <span id={hintId} className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
            {description}
          </span>
        ) : null}
      </span>
      <input
        type="checkbox"
        role="switch"
        aria-describedby={description ? hintId : undefined}
        className="peer sr-only"
        defaultChecked={defaultChecked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-gray-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 motion-reduce:transition-none motion-reduce:after:transition-none dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
      />
    </label>
  );
}

export default function ToggleRowSettingsPreview() {
  return (
    <ToggleRowSettings
      title="Weekly digest"
      description="A Monday summary of everything that changed."
      defaultChecked
    />
  );
}
