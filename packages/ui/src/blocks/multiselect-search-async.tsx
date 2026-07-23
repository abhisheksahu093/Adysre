'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Live preview for `multiselect-search-async`.
 *
 * Mirrors the `typescript` code variant. Seeded with a query so the stage shows
 * the interesting part rather than the idle "type to search" - the component
 * fetches on mount, so you land on the spinner and then the results.
 *
 * The fetch is the same local-promise stub as the snippet: NEVER the network.
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface MultiselectSearchAsyncProps {
  label: string;
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultQuery?: string;
}

const DEBOUNCE_MS = 250;

const CATALOGUE: readonly string[] = [
  'api-gateway',
  'billing-service',
  'design-tokens',
  'docs-site',
  'edge-cache',
  'identity-provider',
  'mobile-app',
  'web-dashboard',
];

/** Stub. A local promise + setTimeout - no request ever leaves the page. */
function searchProjects(query: string): Promise<string[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = query.trim().toLowerCase();
      resolve(CATALOGUE.filter((name) => name.includes(q)));
    }, 400);
  });
}

export function MultiselectSearchAsync({
  label,
  value,
  onSelect,
  disabled = false,
  defaultQuery = '',
}: MultiselectSearchAsyncProps) {
  const baseId = useId();
  const [query, setQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(Boolean(defaultQuery));
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef(0);

  const optionId = (index: number): string => `${baseId}-option-${index}`;

  useEffect(() => {
    if (!query.trim()) {
      seqRef.current += 1;
      setResults([]);
      setLoading(false);
      setSearched(false);
      return undefined;
    }

    const mine = ++seqRef.current;
    setLoading(true);
    const timer = setTimeout(() => {
      void searchProjects(query).then((found) => {
        if (mine !== seqRef.current) return;
        setResults(found);
        setActiveIndex(0);
        setLoading(false);
        setSearched(true);
      });
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  function statusText(): string {
    if (!query.trim()) return 'Type to search projects.';
    if (loading) return 'Searching…';
    if (!results.length) return `No projects match “${query}”.`;
    return `${results.length} ${results.length === 1 ? 'project' : 'projects'} found. ${value.length} selected.`;
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (event.key === 'Enter') {
      event.preventDefault();
      const name = results[activeIndex];
      if (name) toggleValue(name);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={`${baseId}-input`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={`${baseId}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${baseId}-listbox`}
          aria-autocomplete="list"
          aria-describedby={`${baseId}-status`}
          autoComplete="off"
          placeholder="Search projects…"
          disabled={disabled}
          value={query}
          {...(open && results.length ? { 'aria-activedescendant': optionId(activeIndex) } : {})}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        {loading ? (
          <span
            className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:[animation-duration:2s] dark:border-gray-700 dark:border-t-blue-400"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <p
        className="mt-1.5 text-xs text-gray-500 dark:text-gray-400"
        id={`${baseId}-status`}
        role="status"
        aria-live="polite"
      >
        {statusText()}
      </p>
      {open && (searched || loading) ? (
        <ul
          id={`${baseId}-listbox`}
          role="listbox"
          aria-multiselectable="true"
          aria-busy={loading}
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg aria-busy:opacity-60 dark:border-gray-700 dark:bg-gray-900"
        >
          {results.length === 0 && !loading ? (
            <li
              role="presentation"
              className="px-2 py-3 text-center text-sm text-gray-500 dark:text-gray-400"
            >
              No projects match “{query}”.
            </li>
          ) : (
            results.map((name, index) => {
              const isActive = index === activeIndex;
              const checked = value.includes(name);
              return (
                <li
                  key={name}
                  id={optionId(index)}
                  role="option"
                  aria-selected={checked}
                  onMouseMove={() => setActiveIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    toggleValue(name);
                  }}
                  className={`flex cursor-pointer items-center gap-2 rounded-md py-2 pl-1 pr-2 font-mono text-sm ${
                    isActive
                      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-4 w-0.5 shrink-0 rounded-full ${
                      isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'
                    }`}
                  />
                  <span className="flex-1">{name}</span>
                  {checked ? (
                    <span className="font-bold text-blue-600 dark:text-blue-400" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}

export default function MultiselectSearchAsyncPreview() {
  const [projects, setProjects] = useState(['api-gateway']);

  return (
    <div className="w-full max-w-sm pb-72">
      {/* Seeded with a query so the stage opens on the spinner, then results -
          the idle state is a blank field and shows nothing. */}
      <MultiselectSearchAsync
        label="Projects"
        value={projects}
        onSelect={setProjects}
        defaultQuery="e"
      />
    </div>
  );
}
