'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Live preview for `pagination-table-footer`.
 *
 * Mirrors the `typescript` code variant against a fixed 240-item total at 10
 * per page. Step links keep real hrefs but suppress navigation. Keep this in
 * step with `src/data/components/pagination.ts`.
 */
const STEP =
  'inline-flex h-10 items-center rounded-md border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

const PAGE_SIZE = 10;
// Annotated `number`, not left to infer the literal 240: the empty-list guard
// below mirrors the snippet, and against a literal type TS reads it as dead.
const TOTAL_ITEMS: number = 240;

export function PaginationTableFooter() {
  const [currentPage, setCurrentPage] = useState<number>(2);

  const totalPages = Math.max(1, Math.ceil(TOTAL_ITEMS / PAGE_SIZE));
  const first = TOTAL_ITEMS === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const last = Math.min(currentPage * PAGE_SIZE, TOTAL_ITEMS);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
    >
      <p className="m-0 text-sm tabular-nums text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
        <span className="font-medium text-gray-900 dark:text-gray-100">{first}&ndash;{last}</span> of{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{TOTAL_ITEMS}</span>
      </p>
      <div className="flex items-center gap-2">
        <span className="mr-1 text-sm tabular-nums text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        {hasPrev ? (
          <a href={`?page=${currentPage - 1}`} rel="prev" onClick={go(currentPage - 1)} className={`${STEP} ${REST}`}>
            Previous
          </a>
        ) : (
          <a aria-disabled="true" className={`${STEP} ${OFF}`}>
            Previous
          </a>
        )}
        {hasNext ? (
          <a href={`?page=${currentPage + 1}`} rel="next" onClick={go(currentPage + 1)} className={`${STEP} ${REST}`}>
            Next
          </a>
        ) : (
          <a aria-disabled="true" className={`${STEP} ${OFF}`}>
            Next
          </a>
        )}
      </div>
    </nav>
  );
}


export default PaginationTableFooter;
