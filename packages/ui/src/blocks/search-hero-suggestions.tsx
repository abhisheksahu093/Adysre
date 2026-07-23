'use client';

import { useId, useMemo, useState, type KeyboardEvent } from 'react';

/**
 * Live preview for `search-hero-suggestions`.
 *
 * Mirrors the `typescript` code variant verbatim. Fully interactive: focus the
 * field to open the listbox, then type or arrow through the suggestions - the
 * input keeps focus and drives aria-activedescendant. The absolutely positioned
 * listbox contributes nothing to layout, hence the extra `minHeight`. Keep this
 * in step with `src/data/components/search-bars.ts`.
 */
interface SearchHeroSuggestionsProps {
  suggestions: string[];
  heading?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  className?: string;
}

export function SearchHeroSuggestions({
  suggestions,
  heading = 'Find anything',
  placeholder = 'Search…',
  onSelect,
  className = '',
}: SearchHeroSuggestionsProps) {
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const results = useMemo<string[]>(() => {
    const term = query.trim().toLowerCase();
    const pool = term ? suggestions.filter((s) => s.toLowerCase().includes(term)) : suggestions;
    return pool.slice(0, 6);
  }, [suggestions, query]);

  const listId = `${baseId}-list`;
  const showList = open && results.length > 0;
  const activeId = showList && active >= 0 ? `${baseId}-opt-${active}` : undefined;

  function commit(value: string) {
    setQuery(value);
    setOpen(false);
    setActive(-1);
    onSelect?.(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!showList) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (event.key === 'Enter') {
      const choice = active >= 0 ? results[active] : undefined;
      if (choice) {
        event.preventDefault();
        commit(choice);
      }
    } else if (event.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <section className={`mx-auto w-full max-w-xl px-4 py-8 text-center ${className}`}>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{heading}</h1>

      <div className="relative mt-5 text-left">
        <label className="sr-only" htmlFor={`${baseId}-input`}>{heading}</label>
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="9" cy="9" r="6" />
          <path d="m14 14 3 3" strokeLinecap="round" />
        </svg>
        <input
          id={`${baseId}-input`}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={(event) => { setQuery(event.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />

        {showList ? (
          <ul id={listId} role="listbox" className="absolute z-10 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-gray-200 bg-white py-1 text-left shadow-lg dark:border-gray-800 dark:bg-gray-900">
            {results.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item}
                  id={`${baseId}-opt-${index}`}
                  role="option"
                  aria-selected={isActive}
                  onMouseDown={(event) => { event.preventDefault(); commit(item); }}
                  onMouseEnter={() => setActive(index)}
                  className={`cursor-pointer px-4 py-2 text-sm ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-200'}`}
                >
                  {item}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

const SAMPLE_SUGGESTIONS = [
  'Dashboard',
  'Billing settings',
  'API keys',
  'Team members',
  'Notifications',
  'Security log',
  'Integrations',
];

export const minHeight = 340;

export default function SearchHeroSuggestionsPreview() {
  return <SearchHeroSuggestions suggestions={SAMPLE_SUGGESTIONS} heading="Find anything" placeholder="Search settings, people, docs…" />;
}
