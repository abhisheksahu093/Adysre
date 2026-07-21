'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-transparent-overlay`.
 *
 * Mirrors the `typescript` code variant. The gradient wrapper stands in for a
 * hero so the white labels have a dark surface to read against; open the
 * hamburger to see the solid, legible mobile panel. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
export const minHeight = 288;

interface NavLink {
  href: string;
  label: string;
}

const LINKS: readonly NavLink[] = [
  { href: '#', label: 'Product' },
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Docs' },
];

function NavbarTransparentOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative isolate min-h-64 w-full overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <a href="#" className="mr-auto font-bold text-white">
            Adysre
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a href="#" className="hidden rounded-lg border border-white/30 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 md:block">
            Get started
          </a>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-overlay-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {open ? (
          <nav
            id="nav-overlay-menu"
            className="mx-3 mt-1 flex flex-col gap-1 rounded-xl border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur md:hidden dark:border-gray-800 dark:bg-gray-900/95"
            aria-label="Main"
          >
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {link.label}
              </a>
            ))}
            <a href="#" className="mt-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700">
              Get started
            </a>
          </nav>
        ) : null}
      </header>
    </div>
  );
}

export default function NavbarTransparentOverlayPreview() {
  return (
    <div className="w-full">
      <NavbarTransparentOverlay />
    </div>
  );
}
