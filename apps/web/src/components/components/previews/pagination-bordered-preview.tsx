'use client';

import { useState } from 'react';
import type { MouseEvent, ReactElement } from 'react';

/**
 * Live preview for `pagination-bordered`.
 *
 * Mirrors the `typescript` code variant over 10 pages. Hrefs stay real but
 * navigation is suppressed. Keep this in step with
 * `src/data/components/pagination.ts`.
 */
type PageItem = number | 'gap-start' | 'gap-end';

const CELL =
  'inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none';
const REST = 'font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const CURRENT = 'bg-blue-600 font-semibold text-white focus-visible:ring-blue-400';

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

export default function PaginationBorderedPreview() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const range = pageRange(currentPage, TOTAL_PAGES);

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav aria-label="Pagination" className="max-w-full overflow-x-auto">
      <ul className="inline-flex list-none divide-x divide-gray-300 overflow-hidden rounded-lg border border-gray-300 p-0 dark:divide-gray-700 dark:border-gray-700">
        {range.map(
          (item: PageItem): ReactElement =>
            typeof item === 'number' ? (
              <li key={item}>
                <a
                  href={`?page=${item}`}
                  onClick={go(item)}
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={`${CELL} ${item === currentPage ? CURRENT : REST}`}
                >
                  {item}
                </a>
              </li>
            ) : (
              <li key={item}>
                <span className="inline-flex h-10 min-w-10 items-center justify-center px-3 text-sm text-gray-500 dark:text-gray-400" aria-hidden="true">
                  &hellip;
                </span>
              </li>
            ),
        )}
      </ul>
    </nav>
  );
}
