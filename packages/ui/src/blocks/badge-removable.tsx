'use client';

import { useState } from 'react';

/**
 * Live preview for `badge-removable`.
 *
 * Mirrors the `typescript` code variant verbatim. The preview owns the list
 * state the component deliberately does not: chips disappear when dismissed,
 * and a reset link appears once the row is empty so the demo stays usable.
 * Keep this in step with `src/data/components/badges.ts`.
 */
interface RemovableBadgeProps {
  label: string;
  onRemove?: () => void;
  className?: string;
}

export function RemovableBadge({ label, onRemove, className = '' }: RemovableBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full bg-blue-100 py-1 pl-2.5 pr-1 text-xs font-medium text-blue-800 dark:bg-blue-500/15 dark:text-blue-300 ${className}`}
    >
      {label}
      <button
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
        className="-my-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-blue-700 hover:bg-blue-600/20 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-blue-400/20 dark:hover:text-blue-100 dark:focus-visible:ring-blue-400"
      >
        <svg
          viewBox="0 0 8 8"
          className="h-2 w-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M1 1l6 6M7 1L1 7" />
        </svg>
      </button>
    </span>
  );
}

const INITIAL_TAGS = ['React', 'TypeScript', 'Tailwind', 'Accessibility'];

export default function BadgeRemovablePreview() {
  const [tags, setTags] = useState<string[]>(INITIAL_TAGS);

  return (
    <div className="flex min-h-24 flex-wrap items-center justify-center gap-2 p-6">
      {tags.map((tag) => (
        <RemovableBadge
          key={tag}
          label={tag}
          onRemove={() => setTags((current) => current.filter((t) => t !== tag))}
        />
      ))}
      {tags.length === 0 ? (
        <button
          type="button"
          onClick={() => setTags(INITIAL_TAGS)}
          className="text-xs font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400"
        >
          Restore tags
        </button>
      ) : null}
    </div>
  );
}
