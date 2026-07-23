'use client';

import { useId, useRef, useState } from 'react';

/**
 * Live preview for `search-navbar-expand`.
 *
 * Mirrors the `typescript` code variant verbatim. Click the magnifier to expand
 * the field (width animates, focus moves in); Escape or blurring an empty field
 * collapses it. Keep this in step with `src/data/components/search-bars.ts`.
 */
interface SearchNavbarExpandProps {
  placeholder?: string;
  brand?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export function SearchNavbarExpand({
  placeholder = 'Search…',
  brand = 'Adysre',
  onSearch,
  className = '',
}: SearchNavbarExpandProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  function expand() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className={`flex items-center justify-end gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-950 ${className}`}>
      <span className="mr-auto text-sm font-semibold text-gray-900 dark:text-gray-100">{brand}</span>

      <form role="search" className="flex items-center" onSubmit={(event) => { event.preventDefault(); onSearch?.(query); }}>
        <label className="sr-only" htmlFor={inputId}>Search</label>
        <input
          id={inputId}
          ref={inputRef}
          type="search"
          value={query}
          placeholder={placeholder}
          autoComplete="off"
          aria-hidden={!open}
          tabIndex={open ? 0 : -1}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Escape') setOpen(false); }}
          onBlur={() => { if (!query) setOpen(false); }}
          className={`h-9 rounded-lg bg-gray-50 text-sm text-gray-900 transition-[width,opacity,padding] duration-200 placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400 ${open ? 'w-40 border border-gray-300 px-3 opacity-100 sm:w-56 dark:border-gray-700' : 'w-0 border-0 px-0 opacity-0'}`}
        />
        <button
          type={open ? 'submit' : 'button'}
          onClick={() => { if (!open) expand(); }}
          aria-label={open ? 'Submit search' : 'Open search'}
          aria-expanded={open}
          className="ml-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="9" cy="9" r="6" />
            <path d="m14 14 3 3" strokeLinecap="round" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default function SearchNavbarExpandPreview() {
  return <SearchNavbarExpand brand="Adysre" placeholder="Search…" className="w-full max-w-md" />;
}
