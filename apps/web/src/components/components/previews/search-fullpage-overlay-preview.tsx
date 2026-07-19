'use client';

import { useId, useMemo, useState } from 'react';

/**
 * Live preview for `search-fullpage-overlay`.
 *
 * Mirrors the `typescript` code variant verbatim. Starts closed - the trigger
 * is the preview; clicking it opens a fixed full-viewport search sheet that
 * closes on Escape or the close button. Keep this in step with
 * `src/data/components/search-bars.ts`.
 */
interface OverlayItem {
  id: string;
  title: string;
}

interface SearchFullpageOverlayProps {
  items: OverlayItem[];
  buttonLabel?: string;
  className?: string;
}

function SearchFullpageOverlay({
  items,
  buttonLabel = 'Search',
  className = '',
}: SearchFullpageOverlayProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo<OverlayItem[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items.slice(0, 8);
    return items.filter((item) => item.title.toLowerCase().includes(term)).slice(0, 8);
  }, [items, query]);

  function close() { setOpen(false); setQuery(''); }

  return (
    <div className={className}>
      <button
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:border-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
        {buttonLabel}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 bg-white/95 p-4 backdrop-blur dark:bg-gray-950/95"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          onKeyDown={(event) => { if (event.key === 'Escape') close(); }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3 pt-4">
            <svg className="h-6 w-6 flex-none text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="9" cy="9" r="6" /><path d="m14 14 3 3" strokeLinecap="round" /></svg>
            <label className="sr-only" htmlFor={inputId}>Search</label>
            <input
              id={inputId}
              autoFocus
              type="text"
              value={query}
              placeholder="Type to search…"
              autoComplete="off"
              onChange={(event) => setQuery(event.target.value)}
              className="w-full border-0 bg-transparent py-2 text-lg text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100"
            />
            <button type="button" aria-label="Close search" onClick={close} className="rounded-md p-2 text-gray-500 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" /></svg>
            </button>
          </div>

          <p className="sr-only" role="status" aria-live="polite">{results.length} results</p>

          {results.length === 0 ? (
            <p className="mx-auto mt-6 max-w-2xl px-3 text-sm text-gray-600 dark:text-gray-300">No results.</p>
          ) : (
            <ul className="mx-auto mt-6 max-w-2xl space-y-1">
              {results.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={close} className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{item.title}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

const SAMPLE_ITEMS: OverlayItem[] = [
  { id: 'a', title: 'Getting started guide' },
  { id: 'b', title: 'Weekly metrics review' },
  { id: 'c', title: 'Design system audit' },
  { id: 'd', title: 'Payments integration' },
  { id: 'e', title: 'Release checklist' },
  { id: 'f', title: 'Hiring pipeline' },
];

export default function SearchFullpageOverlayPreview() {
  return <SearchFullpageOverlay items={SAMPLE_ITEMS} buttonLabel="Search everything" />;
}
