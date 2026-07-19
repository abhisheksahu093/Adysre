'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-tabs-subnav`.
 *
 * Mirrors the `typescript` code variant. Click a tab to move the indicator; the
 * subnav scrolls sideways at this width rather than wrapping. The product bar's
 * links collapse behind the hamburger. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
const TABS = ['Overview', 'Activity', 'Settings', 'Billing', 'Members'];
const MAIN_LINKS = [
  { href: '#', label: 'Support' },
  { href: '#', label: 'Docs' },
] as const;

function NavbarTabsSubnav() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(TABS[0]);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="#" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
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
          New project
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-tabs-menu"
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
        <nav id="nav-tabs-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
          {MAIN_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {link.label}
            </a>
          ))}
          <a href="#" className="rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
            New project
          </a>
        </nav>
      ) : null}

      <div className="mx-auto max-w-6xl px-4">
        <div className="-mb-px flex gap-1 overflow-x-auto" role="tablist" aria-label="Sections">
          {TABS.map((tab) => {
            const selected = tab === current;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setCurrent(tab)}
                className={
                  selected
                    ? 'shrink-0 whitespace-nowrap border-b-2 border-blue-600 px-3 py-2.5 text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-blue-400 dark:text-gray-50'
                    : 'shrink-0 whitespace-nowrap border-b-2 border-transparent px-3 py-2.5 text-sm font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-50'
                }
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default function NavbarTabsSubnavPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <NavbarTabsSubnav />
    </div>
  );
}
