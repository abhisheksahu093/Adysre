'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

/**
 * Live preview for `toggle-button-group-multi`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleButtonOption {
  id: string;
  label: string;
  icon: ReactNode;
}

interface ToggleButtonGroupMultiProps {
  label: string;
  options: ToggleButtonOption[];
  defaultPressed?: string[];
  onChange?: (pressed: string[]) => void;
  className?: string;
}

export function ToggleButtonGroupMulti({
  label,
  options,
  defaultPressed = [],
  onChange,
  className = '',
}: ToggleButtonGroupMultiProps) {
  const [pressed, setPressed] = useState<string[]>(defaultPressed);
  const toggle = (id: string) => {
    const next = pressed.includes(id) ? pressed.filter((x) => x !== id) : [...pressed, id];
    setPressed(next);
    onChange?.(next);
  };
  return (
    <div role="group" aria-label={label} className={`inline-flex overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 ${className}`}>
      {options.map((opt, i) => {
        const on = pressed.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={on}
            aria-label={opt.label}
            onClick={() => toggle(opt.id)}
            className={`inline-flex h-10 w-10 items-center justify-center text-sm font-semibold transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${i > 0 ? 'border-l border-gray-300 dark:border-gray-700' : ''} ${on ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800'}`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}

export default function ToggleButtonGroupMultiPreview() {
  return (
    <ToggleButtonGroupMulti
      label="Text formatting"
      defaultPressed={['bold']}
      options={[
        { id: 'bold', label: 'Bold', icon: <span className="font-bold">B</span> },
        { id: 'italic', label: 'Italic', icon: <span className="italic">I</span> },
        { id: 'underline', label: 'Underline', icon: <span className="underline">U</span> },
      ]}
    />
  );
}
