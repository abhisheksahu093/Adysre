'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `navbar-sticky-blur`.
 *
 * Mirrors the `typescript` code variant, with one preview-only change: the
 * scroll position is read from a scrollable stage instead of `window`, because
 * the preview card is what scrolls here, not the page. The shipped component
 * listens on `window` - everything else, including the `data-scrolled` border,
 * is identical. Scroll the panel to watch the hairline appear. The bar row is
 * `min-h-14` + `flex-wrap` so at 320px the links wrap instead of overflowing.
 *
 * Keep this in step with `src/data/components/navbar.ts`.
 */
const SCROLL_THRESHOLD = 8;

export default function NavbarStickyBlurPreview() {
  const [scrolled, setScrolled] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    function onScroll(): void {
      setScrolled((stage?.scrollTop ?? 0) > SCROLL_THRESHOLD);
    }
    onScroll();
    stage.addEventListener('scroll', onScroll, { passive: true });
    return () => stage.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={stageRef}
      className="h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-gradient-to-b from-blue-100 to-white dark:border-gray-800 dark:from-blue-950 dark:to-gray-950"
    >
      <header
        data-scrolled={scrolled}
        className="sticky top-0 z-30 border-b border-transparent bg-white/75 backdrop-blur-md transition-colors data-[scrolled=true]:border-gray-200 data-[scrolled=true]:bg-white/85 motion-reduce:transition-none dark:bg-gray-900/75 dark:data-[scrolled=true]:border-gray-800 dark:data-[scrolled=true]:bg-gray-900/85"
      >
        <nav
          className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2"
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

      {/* Filler so there is something to scroll under the bar. */}
      <div className="space-y-3 p-4">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Scroll this panel - the bar keeps its blur and gains a border once the content moves.
        </p>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-8 rounded-md bg-gray-900/5 dark:bg-gray-50/5"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  );
}
