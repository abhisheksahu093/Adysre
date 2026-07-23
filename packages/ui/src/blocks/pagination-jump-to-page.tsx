'use client';

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

/**
 * Live preview for `pagination-jump-to-page`.
 *
 * Mirrors the `typescript` code variant against a fixed 24-page total, wiring
 * `onPageChange` to local state so the field and the arrows all drive the same
 * value. Keep this in step with `src/data/components/pagination.ts`.
 */
const STEP =
  'inline-flex h-10 items-center rounded-lg border px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950';
const REST = 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100';
const OFF = 'border-gray-200 text-gray-400 dark:border-gray-800 dark:text-gray-500';

const TOTAL_PAGES = 24;

export function PaginationJumpToPage() {
  const [currentPage, setCurrentPage] = useState<number>(3);
  const [value, setValue] = useState<string>('3');

  const onPageChange = (page: number) => {
    const next = Math.min(Math.max(1, page), TOTAL_PAGES);
    setCurrentPage(next);
    setValue(String(next));
  };

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const next = Math.min(Math.max(1, Math.trunc(Number(value) || currentPage)), TOTAL_PAGES);
    setValue(String(next));
    setCurrentPage(next);
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < TOTAL_PAGES;

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button type="button" disabled={!hasPrev} onClick={() => onPageChange(currentPage - 1)} className={`${STEP} ${hasPrev ? REST : OFF} disabled:cursor-default`}>
        Previous
      </button>

      <form className="flex items-center gap-2" onSubmit={submit}>
        <label htmlFor="jump-page" className="text-sm text-gray-600 dark:text-gray-400">
          Page
        </label>
        <input
          id="jump-page"
          name="page"
          type="number"
          inputMode="numeric"
          min={1}
          max={TOTAL_PAGES}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setValue(event.target.value)}
          className="h-10 w-16 rounded-lg border border-gray-300 bg-transparent px-2 text-center text-sm tabular-nums text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        />
        <span className="text-sm tabular-nums text-gray-600 dark:text-gray-400">of {TOTAL_PAGES}</span>
        <button
          type="submit"
          className="inline-flex h-10 items-center rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          Go
        </button>
      </form>

      <button type="button" disabled={!hasNext} onClick={() => onPageChange(currentPage + 1)} className={`${STEP} ${hasNext ? REST : OFF} disabled:cursor-default`}>
        Next
      </button>
    </nav>
  );
}


export default PaginationJumpToPage;
