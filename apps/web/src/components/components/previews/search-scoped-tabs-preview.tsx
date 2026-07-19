'use client';

import { useId, useMemo, useState } from 'react';

/**
 * Live preview for `search-scoped-tabs`.
 *
 * Mirrors the `typescript` code variant verbatim. Scope buttons and the query
 * compose with AND; the count is announced via the aria-live region. Keep this
 * in step with `src/data/components/search-bars.ts`.
 */
interface Scope {
  id: string;
  label: string;
}

interface ScopedItem {
  id: string;
  title: string;
  scope: string;
}

interface SearchScopedTabsProps {
  items: ScopedItem[];
  scopes: Scope[];
  placeholder?: string;
  className?: string;
}

function SearchScopedTabs({
  items,
  scopes,
  placeholder = 'Search…',
  className = '',
}: SearchScopedTabsProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState('all');

  const results = useMemo<ScopedItem[]>(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => {
      const inScope = scope === 'all' || item.scope === scope;
      const inQuery = !term || item.title.toLowerCase().includes(term);
      return inScope && inQuery;
    });
  }, [items, query, scope]);

  const tabs: Scope[] = [{ id: 'all', label: 'All' }, ...scopes];

  return (
    <div className={`mx-auto w-full max-w-md ${className}`}>
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

      <div className="mt-3 inline-flex max-w-full flex-wrap rounded-lg border border-gray-200 p-0.5 dark:border-gray-800" role="group" aria-label="Search scope">
        {tabs.map((s) => {
          const on = s.id === scope;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setScope(s.id)}
              className={`rounded-md px-3 py-1 text-xs font-medium ${on ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">Nothing in this scope.</p>
      ) : (
        <ul className="mt-1 divide-y divide-gray-200 dark:divide-gray-800">
          {results.map((item) => (
            <li key={item.id} className="py-2.5 text-sm text-gray-900 dark:text-gray-100">{item.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SAMPLE_ITEMS: ScopedItem[] = [
  { id: 'a', title: 'Getting started', scope: 'docs' },
  { id: 'b', title: 'API reference', scope: 'docs' },
  { id: 'c', title: 'Amara Okafor', scope: 'people' },
  { id: 'd', title: 'Jonas Weber', scope: 'people' },
  { id: 'e', title: 'roadmap.pdf', scope: 'files' },
];

const SAMPLE_SCOPES: Scope[] = [
  { id: 'docs', label: 'Docs' },
  { id: 'people', label: 'People' },
  { id: 'files', label: 'Files' },
];

export const minHeight = 340;

export default function SearchScopedTabsPreview() {
  return <SearchScopedTabs items={SAMPLE_ITEMS} scopes={SAMPLE_SCOPES} placeholder="Search docs, people, files…" />;
}
