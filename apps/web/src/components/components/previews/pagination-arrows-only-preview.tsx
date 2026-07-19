'use client';

import { useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Live preview for `pagination-arrows-only`.
 *
 * Mirrors the `typescript` code variant over 10 pages. Hrefs stay real but
 * navigation is suppressed to keep the preview iframe in place. Keep this in
 * step with `src/data/components/pagination.ts`.
 */
type IconName = 'first' | 'prev' | 'next' | 'last';

const BTN =
  'inline-flex h-10 w-10 items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const ON = 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'text-gray-300 dark:text-gray-700';

const ICONS: Record<IconName, string[]> = {
  first: ['m11 17-5-5 5-5', 'm18 17-5-5 5-5'],
  prev: ['m15 18-6-6 6-6'],
  next: ['m9 18 6-6-6-6'],
  last: ['m13 17 5-5-5-5', 'm6 17 5-5-5-5'],
};

const TOTAL_PAGES = 10;

function Icon({ name }: { name: IconName }) {
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
      {ICONS[name].map((d: string) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export default function PaginationArrowsOnlyPreview() {
  const [currentPage, setCurrentPage] = useState<number>(3);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < TOTAL_PAGES;

  const go = (page: number) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  const arrow = (enabled: boolean, target: number, label: string, name: IconName, rel?: string) =>
    enabled ? (
      <a href={`?page=${target}`} rel={rel} aria-label={label} onClick={go(target)} className={`${BTN} ${ON}`}>
        <Icon name={name} />
      </a>
    ) : (
      <a aria-disabled="true" aria-label={label} className={`${BTN} ${OFF}`}>
        <Icon name={name} />
      </a>
    );

  return (
    <nav aria-label="Pagination" className="inline-flex items-center gap-1">
      {arrow(hasPrev, 1, 'First page', 'first')}
      {arrow(hasPrev, currentPage - 1, 'Previous page', 'prev', 'prev')}
      <span className="sr-only" role="status" aria-live="polite">
        Page {currentPage} of {TOTAL_PAGES}
      </span>
      {arrow(hasNext, currentPage + 1, 'Next page', 'next', 'next')}
      {arrow(hasNext, TOTAL_PAGES, 'Last page', 'last')}
    </nav>
  );
}
