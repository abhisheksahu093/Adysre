'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-underline-indicator`.
 *
 * Mirrors the `typescript` code variant. Above md, hover a link to see the
 * underline scale in from the centre; the active link keeps its underline. At
 * this width the strip is a stacked hamburger list. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
interface NavLink {
  href: string;
  label: string;
  current?: boolean;
}

const LINKS: readonly NavLink[] = [
  { href: '#', label: 'Product', current: true },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Docs' },
];

const activeClass =
  'relative py-4 text-sm font-medium text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-100 after:bg-blue-600 dark:text-gray-50 dark:after:bg-blue-400';
const idleClass =
  'relative py-4 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:bg-blue-600 after:transition-transform hover:after:scale-x-100 motion-reduce:after:transition-none dark:text-gray-400 dark:hover:text-gray-50 dark:after:bg-blue-400';

function NavbarUnderlineIndicator() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="#" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} aria-current={link.current ? 'page' : undefined} className={link.current ? activeClass : idleClass}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#" className="ml-2 hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 md:block">
          Get started
        </a>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="nav-underline-menu"
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
        <ul id="nav-underline-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                aria-current={link.current ? 'page' : undefined}
                className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 aria-[current=page]:bg-gray-100 aria-[current=page]:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:aria-[current=page]:bg-gray-800 dark:aria-[current=page]:text-gray-50"
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
  );
}

export default function NavbarUnderlineIndicatorPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <NavbarUnderlineIndicator />
    </div>
  );
}
