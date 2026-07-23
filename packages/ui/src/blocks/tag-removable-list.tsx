'use client';

/**
 * Live preview for `tag-removable-list`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - each chip's
 * remove button drops it from the list. Keep this in step with
 * `src/data/components/tags.ts`.
 */
import { useState } from 'react';

interface TagRemovableListProps {
  label?: string;
  defaultTags?: string[];
  onRemove?: (tag: string, tags: string[]) => void;
  className?: string;
}

export function TagRemovableList({
  label = 'Applied filters',
  defaultTags = [],
  onRemove,
  className = '',
}: TagRemovableListProps) {
  const [tags, setTags] = useState<string[]>(defaultTags);

  function remove(tag: string): void {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onRemove?.(tag, next);
  }

  return (
    <div className={`w-full ${className}`}>
      {label ? (
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
      ) : null}
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No tags applied.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {tag}
                <button
                  type="button"
                  onClick={() => remove(tag)}
                  aria-label={`Remove ${tag}`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TagRemovableListPreview() {
  return (
    <TagRemovableList
      label="Applied filters"
      defaultTags={['In stock', 'Under $50', 'Free shipping', '4 stars & up']}
    />
  );
}
