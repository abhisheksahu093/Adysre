'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Live preview for `pagination-prev-next`.
 *
 * Mirrors the `typescript` code variant over 10 pages, starting at page 3 so
 * both step links are live on first paint; walk to either end to see the
 * disabled state. As with the numbered pager, the hrefs are real but the click
 * is intercepted - a genuine `?page=` navigation would reload the preview
 * iframe.
 *
 * Keep this in step with `src/data/components/pagination.ts`.
 */
const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const REST =
  'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

function Chevron({ direction }: { direction: 'prev' | 'next' }) {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={direction === 'prev' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  );
}

const TOTAL_PAGES = 10;

export default function PaginationPrevNextPreview() {
  const [currentPage, setCurrentPage] = useState<number>(3);

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav aria-label="Pagination" className="flex w-full max-w-md items-center justify-between gap-4">
      {currentPage > 1 ? (
        <a href={`?page=${currentPage - 1}`} rel="prev" onClick={go(currentPage - 1)} className={`${LINK} ${REST}`}>
          <Chevron direction="prev" />
          Previous
        </a>
      ) : (
        <a aria-disabled="true" className={`${LINK} ${OFF}`}>
          <Chevron direction="prev" />
          Previous
        </a>
      )}

      <p className="m-0 text-sm tabular-nums text-gray-500 dark:text-gray-400" aria-live="polite">
        Page {currentPage} of {TOTAL_PAGES}
      </p>

      {currentPage < TOTAL_PAGES ? (
        <a href={`?page=${currentPage + 1}`} rel="next" onClick={go(currentPage + 1)} className={`${LINK} ${REST}`}>
          Next
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" className={`${LINK} ${OFF}`}>
          Next
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}
