'use client';

/**
 * Live preview for `tag-autocomplete`.
 *
 * Mirrors the `typescript` code variant verbatim. Interactive - focus the field
 * and type to filter the suggestion listbox, then click a match to add it. Keep
 * this in step with `src/data/components/tags.ts`.
 */
import { useId, useMemo, useState } from 'react';

interface TagAutocompleteProps {
  label: string;
  suggestions: string[];
  defaultTags?: string[];
  placeholder?: string;
  onChange?: (tags: string[]) => void;
  className?: string;
}

export function TagAutocomplete({
  label,
  suggestions,
  defaultTags = [],
  placeholder = 'Search tags…',
  onChange,
  className = '',
}: TagAutocompleteProps) {
  const listId = useId();
  const inputId = useId();
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions.filter((s) => !tags.includes(s) && s.toLowerCase().includes(q));
  }, [suggestions, tags, query]);

  function commit(next: string[]): void {
    setTags(next);
    onChange?.(next);
  }

  function add(tag: string): void {
    if (tags.includes(tag)) return;
    commit([...tags, tag]);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={`w-full max-w-sm ${className}`}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      {tags.length > 0 ? (
        <ul className="mb-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li key={tag}>
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                {tag}
                <button
                  type="button"
                  onClick={() => commit(tags.filter((t) => t !== tag))}
                  aria-label={`Remove ${tag}`}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open && matches.length > 0}
          aria-controls={listId}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        {open && matches.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            {matches.map((match) => (
              <li key={match} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => add(match)}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800"
                >
                  {match}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default function TagAutocompletePreview() {
  return (
    <TagAutocomplete
      label="Skills"
      defaultTags={['TypeScript']}
      suggestions={['React', 'Rust', 'Go', 'Python', 'GraphQL', 'PostgreSQL', 'Kubernetes']}
    />
  );
}

export const minHeight = 320;
