'use client';

import { useEffect, useId, useState } from 'react';

/**
 * Live preview for `search-debounced-async`.
 *
 * Mirrors the `typescript` code variant verbatim. Typing debounces, shows an
 * in-field spinner, then reveals results - a timer stands in for latency, no
 * request leaves the page. Keep this in step with
 * `src/data/components/search-bars.ts`.
 */
interface AsyncItem {
  id: string;
  title: string;
}

interface SearchDebouncedAsyncProps {
  items: AsyncItem[];
  delay?: number;
  placeholder?: string;
  className?: string;
}

function SearchDebouncedAsync({
  items,
  delay = 350,
  placeholder = 'Search…',
  className = '',
}: SearchDebouncedAsyncProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AsyncItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = query.trim().toLowerCase();
    if (!term) { setResults([]); setLoading(false); return; }
    setLoading(true);
    const id = window.setTimeout(() => {
      setResults(items.filter((item) => item.title.toLowerCase().includes(term)));
      setLoading(false);
    }, delay);
    return () => window.clearTimeout(id);
  }, [items, query, delay]);

  const term = query.trim();

  return (
    <div className={`mx-auto w-full max-w-md ${className}`}>
      <div className="relative">
        <label className="sr-only" htmlFor={inputId}>Search</label>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          aria-busy={loading}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
        {loading ? (
          <svg className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-600 motion-reduce:animate-none dark:text-blue-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M17 10a7 7 0 0 0-7-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
        ) : null}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {loading ? 'Searching…' : term ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ''}
      </p>

      {!loading && term && results.length > 0 ? (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="py-2.5 text-sm text-gray-900 dark:text-gray-100">{item.title}</li>
          ))}
        </ul>
      ) : null}

      {!loading && term && results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No results for “{term}”.</p>
      ) : null}
    </div>
  );
}

const SAMPLE_ITEMS: AsyncItem[] = [
  { id: 'a', title: 'Annual security review' },
  { id: 'b', title: 'Customer health dashboard' },
  { id: 'c', title: 'Feature flag cleanup' },
  { id: 'd', title: 'Incident postmortem template' },
  { id: 'e', title: 'On-call rotation schedule' },
  { id: 'f', title: 'Latency SLO tracking' },
];

export const minHeight = 320;

export default function SearchDebouncedAsyncPreview() {
  return <SearchDebouncedAsync items={SAMPLE_ITEMS} placeholder="Search projects…" />;
}
