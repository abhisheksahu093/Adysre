'use client';

/**
 * Live preview for `tag-overflow-counter`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - the +N button
 * reveals the collapsed tags. Keep this in step with
 * `src/data/components/tags.ts`.
 */
import { useState } from 'react';

interface TagOverflowCounterProps {
  tags: string[];
  max?: number;
  className?: string;
}

export function TagOverflowCounter({ tags, max = 3, className = '' }: TagOverflowCounterProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? tags : tags.slice(0, max);
  const hidden = tags.length - visible.length;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {visible.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          {tag}
        </span>
      ))}
      {hidden > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Show ${hidden} more ${hidden === 1 ? 'tag' : 'tags'}`}
          className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          +{hidden}
        </button>
      ) : null}
    </div>
  );
}

export default function TagOverflowCounterPreview() {
  return (
    <TagOverflowCounter
      tags={['Marketing', 'Design', 'Sales', 'Research', 'Support', 'Finance']}
      max={3}
    />
  );
}
