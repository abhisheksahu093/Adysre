'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-double-decker`.
 *
 * Mirrors the `typescript` code variant. At this width the desktop utility
 * strip is hidden and its links reappear at the foot of the hamburger panel -
 * open the menu to see them. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
interface NavLink {
  href: string;
  label: string;
}

const MAIN_LINKS: readonly NavLink[] = [
  { href: '#', label: 'Product' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Docs' },
];

const UTILITY_LINKS: readonly NavLink[] = [
  { href: '#', label: 'Support' },
  { href: '#', label: 'Contact' },
  { href: '#', label: 'Sign in' },
];

export function NavbarDoubleDecker() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="hidden border-b border-gray-200 bg-gray-50 md:block dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-end gap-4 px-4">
          {UTILITY_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="#" className="mr-auto text-base font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a href="#" className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">
          Get started
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-dd-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>

      {open ? (
        <div id="nav-dd-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          <nav className="flex flex-col gap-1" aria-label="Main">
            {MAIN_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
            {UTILITY_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
            <a href="#" className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              Get started
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default function NavbarDoubleDeckerPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <NavbarDoubleDecker />
    </div>
  );
}
