'use client';

import { useState } from 'react';

/**
 * Live preview for `navbar-ecommerce-icons`.
 *
 * Mirrors the `typescript` code variant with a sample cart count so the badge
 * shows. Account and cart stay on the bar at this width; only the category
 * links collapse behind the hamburger. Keep this in step with
 * `src/data/components/navbar.ts`.
 */
const LINKS = [
  { href: '#', label: 'New' },
  { href: '#', label: 'Women' },
  { href: '#', label: 'Men' },
] as const;

function NavbarEcommerceIcons({ cartCount = 0 }: { cartCount?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <a href="#" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
          Shoply
        </a>

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

        <div className="flex items-center gap-1">
          <a
            href="#"
            aria-label="Account"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
          </a>

          <button
            type="button"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? 'item' : 'items'}`}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 3h2l2.4 12.4a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L22 7H6" />
            </svg>
            {cartCount > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[0.625rem] font-semibold text-white"
              >
                {cartCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="nav-shop-menu"
            aria-label={open ? 'Close main menu' : 'Open main menu'}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 md:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={open ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="nav-shop-menu" className="flex flex-col gap-1 border-t border-gray-200 px-4 pb-4 pt-2 md:hidden dark:border-gray-800" aria-label="Main">
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

export default function NavbarEcommerceIconsPreview() {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
      <NavbarEcommerceIcons cartCount={3} />
    </div>
  );
}
