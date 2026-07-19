'use client';

import { Fragment, useId, useMemo, useState } from 'react';

/**
 * Live preview for `search-results-highlight`.
 *
 * Mirrors the `typescript` code variant verbatim. Typing filters the list and
 * wraps the matched substring in a semantic <mark>; the count is announced via
 * the aria-live region. Keep this in step with
 * `src/data/components/search-bars.ts`.
 */
interface HighlightItem {
  id: string;
  label: string;
}

interface HighlightPart {
  text: string;
  match: boolean;
}

function highlight(text: string, term: string): HighlightPart[] {
  if (!term) return [{ text, match: false }];
  const parts: HighlightPart[] = [];
  const lower = text.toLowerCase();
  const needle = term.toLowerCase();
  let i = 0;
  while (i < text.length) {
    const found = lower.indexOf(needle, i);
    if (found === -1) { parts.push({ text: text.slice(i), match: false }); break; }
    if (found > i) parts.push({ text: text.slice(i, found), match: false });
    parts.push({ text: text.slice(found, found + needle.length), match: true });
    i = found + needle.length;
  }
  return parts;
}

interface SearchResultsHighlightProps {
  items: HighlightItem[];
  placeholder?: string;
  className?: string;
}

function SearchResultsHighlight({
  items,
  placeholder = 'Search…',
  className = '',
}: SearchResultsHighlightProps) {
  const inputId = useId();
  const [query, setQuery] = useState('');

  const results = useMemo<HighlightItem[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => item.label.toLowerCase().includes(term));
  }, [items, query]);

  const term = query.trim();

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

      <p className="mt-3 text-xs text-gray-600 dark:text-gray-300" role="status" aria-live="polite">
        {results.length} {results.length === 1 ? 'match' : 'matches'}
      </p>

      {results.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-600 dark:text-gray-300">No matches.</p>
      ) : (
        <ul className="mt-1 space-y-1">
          {results.map((item) => (
            <li key={item.id} className="rounded-md px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-800">
              {highlight(item.label, term).map((part, index) =>
                part.match ? (
                  <mark key={index} className="rounded bg-yellow-200 text-gray-900 dark:bg-yellow-500/40 dark:text-yellow-100">{part.text}</mark>
                ) : (
                  <Fragment key={index}>{part.text}</Fragment>
                ),
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const SAMPLE_ITEMS: HighlightItem[] = [
  { id: 'a', label: 'Quarterly report' },
  { id: 'b', label: 'Annual report 2026' },
  { id: 'c', label: 'Design system audit' },
  { id: 'd', label: 'Incident report template' },
  { id: 'e', label: 'Payments integration guide' },
];

export const minHeight = 320;

export default function SearchResultsHighlightPreview() {
  return <SearchResultsHighlight items={SAMPLE_ITEMS} placeholder="Try “report”…" />;
}
