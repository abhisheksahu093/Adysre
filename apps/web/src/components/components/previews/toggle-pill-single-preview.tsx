'use client';

import { useState } from 'react';

/**
 * Live preview for `toggle-pill-single`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface TogglePillSingleProps {
  label: string;
  pressedLabel: string;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  className?: string;
}

function TogglePillSingle({
  label,
  pressedLabel,
  defaultPressed = false,
  onChange,
  className = '',
}: TogglePillSingleProps) {
  const [on, setOn] = useState<boolean>(defaultPressed);
  const flip = () => {
    setOn(!on);
    onChange?.(!on);
  };
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={flip}
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${on ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'} ${className}`}
    >
      {on ? (
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3.5 w-3.5">
          <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
      {on ? pressedLabel : label}
    </button>
  );
}

export default function TogglePillSinglePreview() {
  return <TogglePillSingle label="Follow" pressedLabel="Following" defaultPressed />;
}
