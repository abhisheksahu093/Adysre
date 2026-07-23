'use client';

import { useEffect, useState } from 'react';

/**
 * Live preview for `navbar-sticky-blur`.
 *
 * Mirrors the `typescript` code variant verbatim: the scroll position is read
 * from `window`, so the `data-scrolled` hairline appears once the page moves -
 * on an assembled playground page and in a downloaded project alike. The bar
 * row is `min-h-14` + `flex-wrap` so at 320px the links wrap instead of
 * overflowing.
 *
 * Keep this in step with `src/data/components/navbar.ts`.
 */
const SCROLL_THRESHOLD = 8;

export function NavbarStickyBlur() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll(): void {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-30 w-full border-b border-transparent bg-white/75 backdrop-blur-md transition-colors data-[scrolled=true]:border-gray-200 data-[scrolled=true]:bg-white/85 motion-reduce:transition-none dark:bg-gray-900/75 dark:data-[scrolled=true]:border-gray-800 dark:data-[scrolled=true]:bg-gray-900/85"
    >
      <nav
        className="mx-auto flex min-h-14 w-full max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 sm:px-6 lg:px-8"
        aria-label="Main"
      >
        <a
          href="#"
          className="mr-auto font-bold text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-50 dark:focus-visible:ring-blue-400"
        >
          Adysre
        </a>

        <ul className="flex flex-wrap items-center gap-1">
          {['Features', 'Pricing'].map((label) => (
            <li key={label}>
              <a
                href="#"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-900/5 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-50/10 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#"
          className="rounded-lg bg-gray-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Get started
        </a>
      </nav>
    </header>
  );
}


export default NavbarStickyBlur;
