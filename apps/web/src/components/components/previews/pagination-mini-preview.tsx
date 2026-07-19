'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Live preview for `pagination-mini`.
 *
 * Mirrors the `typescript` code variant over 12 pages. Hrefs stay real but
 * navigation is suppressed. Keep this in step with
 * `src/data/components/pagination.ts`.
 */
const BTN =
  'inline-flex h-10 w-10 items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none';
const ON = 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

const TOTAL_PAGES = 12;

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

export default function PaginationMiniPreview() {
  const [currentPage, setCurrentPage] = useState<number>(3);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < TOTAL_PAGES;

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav aria-label="Pagination" className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-700">
      {hasPrev ? (
        <a href={`?page=${currentPage - 1}`} rel="prev" aria-label="Previous page" onClick={go(currentPage - 1)} className={`${BTN} ${ON} rounded-l-full`}>
          <Chevron direction="prev" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={`${BTN} ${OFF} rounded-l-full`}>
          <Chevron direction="prev" />
        </a>
      )}
      <span className="min-w-14 px-1 text-center text-xs font-medium tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        {currentPage} / {TOTAL_PAGES}
      </span>
      {hasNext ? (
        <a href={`?page=${currentPage + 1}`} rel="next" aria-label="Next page" onClick={go(currentPage + 1)} className={`${BTN} ${ON} rounded-r-full`}>
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={`${BTN} ${OFF} rounded-r-full`}>
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}
