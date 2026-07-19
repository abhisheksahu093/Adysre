'use client';

/**
 * Live preview for `tag-filter-toggle`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - toggle chips on
 * and off; a clear-all appears once any are active. Keep this in step with
 * `src/data/components/tags.ts`.
 */
import { useState } from 'react';

interface TagFilterToggleProps {
  options: string[];
  defaultActive?: string[];
  onChange?: (active: string[]) => void;
  className?: string;
}

function TagFilterToggle({
  options,
  defaultActive = [],
  onChange,
  className = '',
}: TagFilterToggleProps) {
  const [active, setActive] = useState<string[]>(defaultActive);

  function toggle(option: string): void {
    const next = active.includes(option)
      ? active.filter((o) => o !== option)
      : [...active, option];
    setActive(next);
    onChange?.(next);
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const on = active.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(option)}
              className={`rounded-full border px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900 ${
                on
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {active.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setActive([]);
            onChange?.([]);
          }}
          className="mt-3 text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
        >
          Clear {active.length} selected
        </button>
      ) : null}
    </div>
  );
}

export default function TagFilterTogglePreview() {
  return (
    <TagFilterToggle
      options={['Remote', 'Full-time', 'Contract', 'Senior', 'Design', 'Engineering']}
      defaultActive={['Remote', 'Senior']}
    />
  );
}
