'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';

/**
 * Live preview for `navbar-with-search`.
 *
 * Mirrors the `typescript` code variant. The harness echoes the last submitted
 * query so the search form is visibly doing something; the links collapse
 * behind the hamburger at this width. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
const LINKS = [
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Docs' },
] as const;

export function NavbarWithSearch({ onSearch }: { onSearch?: (query: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSearch?.(query);
  }

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4">
        <a href="#" className="shrink-0 font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <form role="search" className="relative min-w-0 flex-1 sm:max-w-xs" onSubmit={onSubmit}>
          <label htmlFor="nav-search" className="sr-only">
            Search
          </label>
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id="nav-search"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="h-9 w-full rounded-lg border border-gray-300 bg-gray-50 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-400"
          />
        </form>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-search-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open ? (
        <nav id="nav-search-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export default function NavbarWithSearchPreview() {
  const [last, setLast] = useState('Nothing yet');

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <NavbarWithSearch onSearch={(q) => setLast(q || '(empty)')} />
      </div>
      <p className="px-1 text-xs text-gray-600 dark:text-gray-400">
        Searched: <span className="font-medium">{last}</span>
      </p>
    </div>
  );
}
