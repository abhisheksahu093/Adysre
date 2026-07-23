'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Live preview for `fab-scroll-to-top`.
 *
 * Two preview-only changes from the `typescript` code variant:
 *  - the threshold is measured against a scroll container INSIDE this card, not
 *    `window`. The stage renders every preview in an auto-sized iframe, so
 *    there is no window scroll to listen to - the card grows instead. Its own
 *    `overflow-y-auto` region gives the button something real to react to.
 *  - the button is `absolute` to that region rather than `fixed` to the
 *    viewport, so it does not float over the gallery page.
 *
 * The behaviour is otherwise the shipped one: it appears past the threshold,
 * leaves the tab order while hidden (unmounted, not faded - a transparent
 * button still takes Tab), and the scroll respects `prefers-reduced-motion`.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
const THRESHOLD = 160;

export function FabScrollToTop() {
  const [visible, setVisible] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const sync = (): void => setVisible(scroller.scrollTop > THRESHOLD);
    // passive: the handler never preventDefaults, so let the browser scroll
    // without waiting on it.
    scroller.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => scroller.removeEventListener('scroll', sync);
  }, []);

  const toTop = useCallback((): void => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scrollerRef.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, []);

  return (
    <div className="relative min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div ref={scrollerRef} className="h-64 overflow-y-auto">
        <div className="space-y-3 p-4">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
            Scroll this panel past {THRESHOLD}px.
          </p>
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i} className="text-sm text-gray-600 dark:text-gray-400">
              Paragraph {i + 1} - filler so there is something to scroll. The button appears once
              you are far enough down that &ldquo;back to top&rdquo; means something, and unmounts
              again when you are not.
            </p>
          ))}
        </div>
      </div>

      {visible ? (
        <button
          type="button"
          aria-label="Back to top"
          onClick={toTop}
          className="absolute bottom-6 right-6 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_10px_24px_-8px_rgba(15,23,42,0.4)] transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}


export default FabScrollToTop;
