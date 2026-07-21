'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `navbar-mega-menu`.
 *
 * Mirrors the `typescript` code variant. The stage is narrow, so the bar sits
 * in its mobile layout and the hamburger reveals the flat headed list - the
 * desktop mega panel is `lg:block hidden` and stays out of a phone-width stage.
 * Keep this in step with `src/data/components/navbar.ts`.
 */
interface MegaItem {
  href: string;
  title: string;
  description: string;
}

const MEGA_ITEMS: readonly MegaItem[] = [
  { href: '#', title: 'Analytics', description: 'Traffic, funnels and retention in one view.' },
  { href: '#', title: 'Automation', description: 'Trigger workflows from any event.' },
  { href: '#', title: 'Payments', description: 'Checkout, invoicing and billing APIs.' },
  { href: '#', title: 'Security', description: 'SSO, audit logs and scoped access.' },
];

const LINKS = [
  { href: '#', label: 'Pricing' },
  { href: '#', label: 'Docs' },
] as const;

function NavbarMegaMenu() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!megaOpen) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMegaOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [megaOpen]);

  return (
    <header
      ref={headerRef}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && megaOpen) {
          setMegaOpen(false);
          triggerRef.current?.focus();
        }
      }}
      className="relative border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4" aria-label="Main">
        <a href="#" className="mr-auto font-bold text-gray-900 dark:text-gray-50">
          Adysre
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="true"
            aria-expanded={megaOpen}
            aria-controls="mega-panel"
            onClick={() => setMegaOpen((value) => !value)}
            className="group inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
          >
            Products
            <svg
              className="h-3.5 w-3.5 transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a href="#" className="hidden rounded-lg bg-blue-600 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 lg:block">
          Get started
        </a>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mega-mobile-menu"
          aria-label={mobileOpen ? 'Close main menu' : 'Open main menu'}
          onClick={() => setMobileOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
            <path d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </nav>

      {mobileOpen ? (
        <div id="mega-mobile-menu" className="border-t border-gray-200 px-4 pb-4 pt-2 lg:hidden dark:border-gray-800">
          <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Products
          </p>
          <ul className="flex flex-col gap-1">
            {MEGA_ITEMS.map((item) => (
              <li key={item.title}>
                <a href={item.href} className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex flex-col gap-1 border-t border-gray-200 pt-2 dark:border-gray-800">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="block rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#" className="block rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700">
                Get started
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}

export default function NavbarMegaMenuPreview() {
  return (
    <div className="w-full overflow-hidden border-b border-gray-200 dark:border-gray-800">
      <NavbarMegaMenu />
    </div>
  );
}
