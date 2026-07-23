'use client';

/**
 * Live preview for `tag-selectable-grid`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - multi-select
 * chips with a check cue on the active ones. Keep this in step with
 * `src/data/components/tags.ts`.
 */
import { useState } from 'react';

interface TagSelectableGridProps {
  options: string[];
  defaultSelected?: string[];
  onChange?: (selected: string[]) => void;
  className?: string;
}

export function TagSelectableGrid({
  options,
  defaultSelected = [],
  onChange,
  className = '',
}: TagSelectableGridProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggle(option: string): void {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option];
    setSelected(next);
    onChange?.(next);
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => {
        const on = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={on}
            onClick={() => toggle(option)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900 ${
              on
                ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800'
            }`}
          >
            {on ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function TagSelectableGridPreview() {
  return (
    <TagSelectableGrid
      options={['Photography', 'Travel', 'Cooking', 'Music', 'Fitness', 'Reading', 'Gaming']}
      defaultSelected={['Photography', 'Music']}
    />
  );
}
