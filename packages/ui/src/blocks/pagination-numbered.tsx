'use client';

import { useState } from 'react';
import type { MouseEvent, ReactElement } from 'react';

/**
 * Live preview for `pagination-numbered`.
 *
 * Mirrors the `typescript` code variant over 10 pages. One deliberate
 * deviation: the snippet renders plain server-driven links, whereas the preview
 * intercepts the click and moves a local `page` state instead - a real `?page=`
 * navigation would reload the preview iframe out from under the stage. The
 * hrefs are still real, so middle-click and "copy link" behave exactly as they
 * do in the snippet; only the default navigation is suppressed.
 *
 * Keep this in step with `src/data/components/pagination.ts`.
 */
type PageItem = number | 'gap-start' | 'gap-end';

const LINK =
  'inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-2.5 text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const REST =
  'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white hover:bg-blue-700';
const OFF = 'text-gray-400 dark:text-gray-500';

function pageRange(currentPage: number, totalPages: number, siblingCount = 1): PageItem[] {
  const start = Math.max(2, currentPage - siblingCount);
  const end = Math.min(totalPages - 1, currentPage + siblingCount);
  const range: PageItem[] = [1];
  if (start > 2) range.push('gap-start');
  for (let page = start; page <= end; page += 1) range.push(page);
  if (end < totalPages - 1) range.push('gap-end');
  if (totalPages > 1) range.push(totalPages);
  return range;
}

const TOTAL_PAGES = 10;

export function PaginationNumbered() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const range = pageRange(currentPage, TOTAL_PAGES);

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav aria-label="Pagination">
      <ul className="flex list-none flex-wrap items-center justify-center gap-1 p-0">
        <li>
          {currentPage > 1 ? (
            <a href={`?page=${currentPage - 1}`} onClick={go(currentPage - 1)} className={`${LINK} ${REST}`}>
              Previous
            </a>
          ) : (
            // No href - unfocusable, no link role, nothing to activate.
            <a aria-disabled="true" className={`${LINK} ${OFF}`}>
              Previous
            </a>
          )}
        </li>

        {range.map(
          (item: PageItem): ReactElement =>
            typeof item === 'number' ? (
              <li key={item}>
                <a
                  href={`?page=${item}`}
                  onClick={go(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={`${LINK} ${item === currentPage ? CURRENT : REST}`}
                >
                  {item}
                </a>
              </li>
            ) : (
              <li key={item}>
                <span
                  className="inline-flex h-10 min-w-10 items-center justify-center text-sm text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              </li>
            ),
        )}

        <li>
          {currentPage < TOTAL_PAGES ? (
            <a href={`?page=${currentPage + 1}`} onClick={go(currentPage + 1)} className={`${LINK} ${REST}`}>
              Next
            </a>
          ) : (
            <a aria-disabled="true" className={`${LINK} ${OFF}`}>
              Next
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
}


export default PaginationNumbered;
