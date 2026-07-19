'use client';

import type { MouseEvent } from 'react';

/**
 * Live preview for `pagination-cursor-based`.
 *
 * Mirrors the `typescript` code variant with a sample middle-of-feed state:
 * both cursors present, so both links are live. Hrefs are real; the preview is
 * static because cursor state lives on the server. Keep this in step with
 * `src/data/components/pagination.ts`.
 */
const LINK =
  'inline-flex h-10 items-center gap-1.5 rounded-lg border px-3.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';

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

const PREV_CURSOR = 'eyJpZCI6MTB9';
const NEXT_CURSOR = 'eyJpZCI6MjB9';

export default function PaginationCursorBasedPreview() {
  const go = (event: MouseEvent<HTMLAnchorElement>) => event.preventDefault();

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      <a href={`?before=${PREV_CURSOR}`} rel="prev" onClick={go} className={`${LINK} ${REST}`}>
        <Chevron direction="prev" />
        Newer
      </a>
      <a href={`?after=${NEXT_CURSOR}`} rel="next" onClick={go} className={`${LINK} ${REST}`}>
        Older
        <Chevron direction="next" />
      </a>
    </nav>
  );
}
