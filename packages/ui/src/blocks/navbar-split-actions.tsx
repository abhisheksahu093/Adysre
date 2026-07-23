'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-split-actions`.
 *
 * Mirrors the `typescript` code variant. Above md the right side is a ghost
 * sign-in link, a divider and a filled sign-up button; at this width both fold
 * into the hamburger panel in the same order. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '#', label: 'Product' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Docs' },
];

export function NavbarSplitActions() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="#" className="font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="mr-auto hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50">
            Sign in
          </a>
          <span className="h-5 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
          <a href="#" className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700">
            Sign up
          </a>
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-split-menu"
          aria-label={open ? 'Close main menu' : 'Open main menu'}
          onClick={() => setOpen((value) => !value)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {open ? (
        <div id="nav-split-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex flex-col gap-2 border-t border-gray-200 pt-3 dark:border-gray-800">
            <a href="#" className="rounded-lg border border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800">
              Sign in
            </a>
            <a href="#" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              Sign up
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default function NavbarSplitActionsPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <NavbarSplitActions />
    </div>
  );
}
