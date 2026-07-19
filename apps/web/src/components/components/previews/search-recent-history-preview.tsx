'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `search-recent-history`.
 *
 * Mirrors the `typescript` code variant verbatim. Focus the empty field to see
 * recent searches; submit to prepend a new one, or remove any row individually.
 * The dropdown is absolutely positioned, hence the extra `minHeight`. Keep this
 * in step with `src/data/components/search-bars.ts`.
 */
interface SearchRecentHistoryProps {
  initialRecent?: string[];
  placeholder?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

function SearchRecentHistory({
  initialRecent = [],
  placeholder = 'Search…',
  onSearch,
  className = '',
}: SearchRecentHistoryProps) {
  const inputId = useId();
  const [recent, setRecent] = useState<string[]>(initialRecent);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const showHistory = open && query.trim() === '' && recent.length > 0;

  function submit(value: string) {
    const term = value.trim();
    if (!term) return;
    setRecent((prev) => [term, ...prev.filter((r) => r !== term)].slice(0, 5));
    setQuery(term);
    setOpen(false);
    onSearch?.(term);
  }

  function remove(value: string) {
    setRecent((prev) => prev.filter((r) => r !== value));
  }

  return (
    <div className={`relative mx-auto w-full max-w-md ${className}`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        aria-expanded={showHistory}
        aria-controls={`${inputId}-list`}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={(event) => { if (event.key === 'Enter') submit(query); }}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      {showHistory ? (
        <div id={`${inputId}-list`} className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <p className="px-3 pt-2 text-[0.6875rem] font-semibold uppercase tracking-wide text-gray-400">Recent</p>
          <ul className="py-1">
            {recent.map((term) => (
              <li key={term} className="flex items-center">
                <button
                  type="button"
                  onMouseDown={(event) => { event.preventDefault(); submit(term); }}
                  className="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <svg className="h-3.5 w-3.5 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="10" cy="10" r="7" /><path d="M10 6v4l3 2" strokeLinecap="round" /></svg>
                  <span className="truncate">{term}</span>
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${term}`}
                  onMouseDown={(event) => { event.preventDefault(); remove(term); }}
                  className="px-3 py-2 text-gray-400 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

const SAMPLE_RECENT = ['annual report', 'invoice template', 'brand guidelines', 'onboarding checklist'];

export const minHeight = 300;

export default function SearchRecentHistoryPreview() {
  return <SearchRecentHistory initialRecent={SAMPLE_RECENT} placeholder="Search…" />;
}
