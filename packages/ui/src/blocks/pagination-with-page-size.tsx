'use client';

import { useState } from 'react';
import type { ChangeEvent, MouseEvent } from 'react';

/**
 * Live preview for `pagination-with-page-size`.
 *
 * Mirrors the `typescript` code variant against a fixed 48-item total. Changing
 * the size recomputes the page count and resets to page 1 - the same decision
 * the snippet makes, and the reason `totalPages` is derived rather than stored.
 * The step links keep real hrefs but suppress navigation, since a genuine
 * `?page=` load would reload the preview iframe.
 *
 * Keep this in step with `src/data/components/pagination.ts`.
 */
const STEP =
  'inline-flex h-10 items-center rounded-md border px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const REST =
  'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

const PAGE_SIZES: readonly number[] = [10, 25, 50, 100];
// Annotated `number`, not left to infer the literal 48: the empty-list guard
// below mirrors the snippet, and against a literal type TS reads it as dead.
const TOTAL_ITEMS: number = 48;

export function PaginationWithPageSize() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const totalPages = Math.max(1, Math.ceil(TOTAL_ITEMS / pageSize));
  const first = TOTAL_ITEMS === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const last = Math.min(currentPage * pageSize, TOTAL_ITEMS);

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  const changeSize = (event: ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    // Page 5 of a 10-per-page list is nowhere in particular at 50 per page.
    setCurrentPage(1);
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex w-full max-w-lg flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-gray-200 px-4 py-3 dark:border-gray-800 dark:[color-scheme:dark]"
    >
      <p className="m-0 text-sm tabular-nums text-gray-700 dark:text-gray-300" role="status" aria-live="polite">
        Showing {first}&ndash;{last} of {TOTAL_ITEMS}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="whitespace-nowrap text-sm text-gray-500 dark:text-gray-400" htmlFor="preview-page-size">
          Rows per page
        </label>
        <select
          id="preview-page-size"
          value={pageSize}
          onChange={changeSize}
          className="h-10 rounded-md border border-gray-300 bg-transparent px-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {PAGE_SIZES.map((size: number) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {currentPage > 1 ? (
          <a
            href={`?page=${currentPage - 1}&pageSize=${pageSize}`}
            rel="prev"
            onClick={go(currentPage - 1)}
            className={`${STEP} ${REST}`}
          >
            Previous
          </a>
        ) : (
          <a aria-disabled="true" className={`${STEP} ${OFF}`}>
            Previous
          </a>
        )}

        {currentPage < totalPages ? (
          <a
            href={`?page=${currentPage + 1}&pageSize=${pageSize}`}
            rel="next"
            onClick={go(currentPage + 1)}
            className={`${STEP} ${REST}`}
          >
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


export default PaginationWithPageSize;
