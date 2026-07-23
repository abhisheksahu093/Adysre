'use client';

/**
 * Live preview for `tag-editable`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - click a chip's
 * label to rename it inline (Enter commits, Escape cancels). Keep this in step
 * with `src/data/components/tags.ts`.
 */
import { useEffect, useRef, useState } from 'react';

interface TagEditableProps {
  defaultTags?: string[];
  onChange?: (tags: string[]) => void;
  className?: string;
}

export function TagEditable({ defaultTags = [], onChange, className = '' }: TagEditableProps) {
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing !== null) inputRef.current?.select();
  }, [editing]);

  function commit(next: string[]): void {
    setTags(next);
    onChange?.(next);
  }

  function startEdit(index: number): void {
    setEditing(index);
    setDraft(tags[index] ?? '');
  }

  function saveEdit(): void {
    if (editing === null) return;
    const value = draft.trim();
    const next = value
      ? tags.map((t, i) => (i === editing ? value : t))
      : tags.filter((_, i) => i !== editing);
    commit(next);
    setEditing(null);
  }

  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) =>
        editing === index ? (
          <li key={`edit-${index}`}>
            <input
              ref={inputRef}
              value={draft}
              aria-label={`Rename ${tag}`}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={saveEdit}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  saveEdit();
                } else if (event.key === 'Escape') {
                  setEditing(null);
                }
              }}
              className="w-28 rounded-full border border-blue-500 bg-white px-3 py-1 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"
            />
          </li>
        ) : (
          <li key={tag}>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-1 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
              <button
                type="button"
                onClick={() => startEdit(index)}
                aria-label={`Edit ${tag}`}
                className="rounded-full px-2 py-0.5 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:focus-visible:ring-blue-400"
              >
                {tag}
              </button>
              <button
                type="button"
                onClick={() => commit(tags.filter((_, i) => i !== index))}
                aria-label={`Remove ${tag}`}
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </span>
          </li>
        ),
      )}
    </ul>
  );
}

export default function TagEditablePreview() {
  return <TagEditable defaultTags={['frontend', 'backend', 'design', 'devops']} />;
}
