'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-announcement-bar`.
 *
 * Mirrors the `typescript` code variant. The promo strip is dismissible -
 * closing it removes the row entirely; the nav below collapses to a hamburger
 * at this width. Keep this in step with `src/data/components/navbar.ts`.
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

function NavbarAnnouncementBar() {
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  return (
    <div>
      {!dismissed ? (
        <div className="bg-blue-600 text-white">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
            <p className="min-w-0 flex-1 text-center text-sm">
              New: v2 is live.{' '}
              <a href="#" className="font-semibold underline underline-offset-2 hover:text-blue-100">
                Read the changelog
              </a>
            </p>
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={() => setDismissed(true)}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/90 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
          <a href="#" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
            Adysre
          </a>

          <ul className="hidden items-center gap-1 md:flex">
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

          <a href="#" className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">
            Get started
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-announce-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </nav>

        {open ? (
          <ul id="nav-announce-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
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
            <li>
              <a href="#" className="block rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
                Get started
              </a>
            </li>
          </ul>
        ) : null}
      </header>
    </div>
  );
}

export default function NavbarAnnouncementBarPreview() {
  return (
    <div className="w-full overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <NavbarAnnouncementBar />
    </div>
  );
}
