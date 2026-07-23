'use client';

import { useId, useMemo, useState } from 'react';

/**
 * Live preview for `search-with-filters`.
 *
 * Mirrors the `typescript` code variant verbatim. Typing and the toggle chips
 * compose with AND; the count in the aria-live region announces each reflow.
 * Keep this in step with `src/data/components/search-bars.ts`.
 */
interface SearchItem {
  id: string;
  title: string;
  category: string;
}

interface SearchWithFiltersProps {
  items: SearchItem[];
  categories: string[];
  placeholder?: string;
  className?: string;
}

export function SearchWithFilters({
  items,
  categories,
  placeholder = 'Search…',
  className = '',
}: SearchWithFiltersProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const options: string[] = ['All', ...categories];

  const results = useMemo<SearchItem[]>(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inCategory = category === 'All' || item.category === category;
      const inQuery = !term || item.title.toLowerCase().includes(term);
      return inCategory && inQuery;
    });
  }, [items, query, category]);

  return (
    <div className={`mx-auto w-full max-w-lg ${className}`}>
      <label className="sr-only" htmlFor={inputId}>Search</label>
      <input
        id={inputId}
        type="search"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => setQuery(event.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
      />

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {options.map((option) => {
          const on = option === category;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={on}
              onClick={() => setCategory(option)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${on ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:text-gray-200'}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No results match your filters.</p>
      ) : (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.title}</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[0.6875rem] text-gray-600 dark:bg-gray-800 dark:text-gray-300">{item.category}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SAMPLE_ITEMS: SearchItem[] = [
  { id: 'a', title: 'Design tokens guide', category: 'Design' },
  { id: 'b', title: 'API rate limits', category: 'Engineering' },
  { id: 'c', title: 'Brand color system', category: 'Design' },
  { id: 'd', title: 'Deploy pipeline', category: 'Engineering' },
  { id: 'e', title: 'Q3 roadmap', category: 'Product' },
];

export const minHeight = 340;

export default function SearchWithFiltersPreview() {
  return <SearchWithFilters items={SAMPLE_ITEMS} categories={['Design', 'Engineering', 'Product']} placeholder="Search articles…" />;
}
