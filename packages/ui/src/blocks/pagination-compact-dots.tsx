'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Live preview for `pagination-compact-dots`.
 *
 * Mirrors the `typescript` code variant across 6 pages. The dot links keep real
 * hrefs but suppress navigation, since a genuine `?page=` load would reload the
 * preview iframe. Keep this in step with `src/data/components/pagination.ts`.
 */
const ARROW =
  'inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const ARROW_ON =
  'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const ARROW_OFF = 'text-gray-300 dark:text-gray-700';
const DOT =
  'h-2.5 rounded-full transition-all group-focus-visible:ring-2 group-focus-visible:ring-blue-600 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-white motion-reduce:transition-none dark:group-focus-visible:ring-blue-400 dark:group-focus-visible:ring-offset-gray-950';

const TOTAL_PAGES = 6;

export function Chevron({ direction }: { direction: 'prev' | 'next' }) {
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

export default function PaginationCompactDotsPreview() {
  const [currentPage, setCurrentPage] = useState<number>(2);
  const pages: number[] = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {currentPage > 1 ? (
        <a href={`?page=${currentPage - 1}`} rel="prev" aria-label="Previous page" onClick={go(currentPage - 1)} className={`${ARROW} ${ARROW_ON}`}>
          <Chevron direction="prev" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Previous page" className={`${ARROW} ${ARROW_OFF}`}>
          <Chevron direction="prev" />
        </a>
      )}

      <span className="flex flex-wrap items-center justify-center">
        {pages.map((page: number) => {
          const current = page === currentPage;
          return (
            <a
              key={page}
              href={`?page=${page}`}
              onClick={go(page)}
              aria-current={current ? 'page' : undefined}
              aria-label={current ? `Go to page ${page}, current page` : `Go to page ${page}`}
              className="group inline-flex h-10 w-10 items-center justify-center focus-visible:outline-none"
            >
              <span
                className={`${DOT} ${
                  current
                    ? 'w-5 bg-blue-600 dark:bg-blue-500'
                    : 'w-2.5 bg-gray-300 group-hover:bg-gray-400 dark:bg-gray-600 dark:group-hover:bg-gray-500'
                }`}
              />
            </a>
          );
        })}
      </span>

      {currentPage < TOTAL_PAGES ? (
        <a href={`?page=${currentPage + 1}`} rel="next" aria-label="Next page" onClick={go(currentPage + 1)} className={`${ARROW} ${ARROW_ON}`}>
          <Chevron direction="next" />
        </a>
      ) : (
        <a aria-disabled="true" aria-label="Next page" className={`${ARROW} ${ARROW_OFF}`}>
          <Chevron direction="next" />
        </a>
      )}
    </nav>
  );
}
