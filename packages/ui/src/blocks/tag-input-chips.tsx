'use client';

/**
 * Live preview for `tag-input-chips`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - type and press
 * Enter to add, Backspace on an empty field to remove the last chip. Keep this
 * in step with `src/data/components/tags.ts`.
 */
import { useId, useRef, useState, type KeyboardEvent } from 'react';

interface TagInputChipsProps {
  label: string;
  defaultTags?: string[];
  placeholder?: string;
  max?: number;
  onChange?: (tags: string[]) => void;
  className?: string;
}

export function TagInputChips({
  label,
  defaultTags = [],
  placeholder = 'Add a tag…',
  max,
  onChange,
  className = '',
}: TagInputChipsProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [draft, setDraft] = useState('');

  const atLimit = max !== undefined && tags.length >= max;

  function commit(next: string[]): void {
    setTags(next);
    onChange?.(next);
  }

  function addTag(raw: string): void {
    const value = raw.trim();
    if (!value || atLimit) return;
    if (tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setDraft('');
      return;
    }
    commit([...tags, value]);
    setDraft('');
  }

  function removeAt(index: number): void {
    commit(tags.filter((_, i) => i !== index));
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      commit(tags.slice(0, -1));
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex cursor-text flex-wrap items-center gap-2 rounded-lg border border-gray-300 bg-white p-2 focus-within:border-transparent focus-within:ring-2 focus-within:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400"
      >
        {tags.map((tag, index) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-2.5 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeAt(index)}
              aria-label={`Remove ${tag}`}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </span>
        ))}
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          value={draft}
          disabled={atLimit}
          placeholder={atLimit ? 'Limit reached' : placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-[8rem] flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 outline-none placeholder:text-gray-500 disabled:cursor-not-allowed dark:text-gray-100 dark:placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

export default function TagInputChipsPreview() {
  return <TagInputChips label="Tags" defaultTags={['Design', 'Frontend', 'Accessibility']} />;
}
