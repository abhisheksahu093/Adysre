'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `pagination-load-more`.
 *
 * Mirrors the `typescript` code variant. The results are a hard-coded local
 * array and the "request" is a timer, so the preview never touches the network;
 * the fixed list also keeps the markup identical between server and client
 * render, which a random sample would not.
 *
 * Keep this in step with `src/data/components/pagination.ts`.
 */
interface Result {
  id: string;
  title: string;
  meta: string;
}

const ALL_RESULTS: Result[] = [
  { id: 'revenue', title: 'Quarterly revenue report', meta: 'Finance' },
  { id: 'onboarding', title: 'Onboarding checklist', meta: 'People' },
  { id: 'postmortem', title: 'Incident post-mortem', meta: 'Engineering' },
  { id: 'brand', title: 'Brand guidelines', meta: 'Design' },
  { id: 'security', title: 'Security review', meta: 'Engineering' },
  { id: 'pricing', title: 'Pricing experiment', meta: 'Growth' },
  { id: 'support', title: 'Support playbook', meta: 'Success' },
  { id: 'hiring', title: 'Hiring plan', meta: 'People' },
  { id: 'roadmap', title: 'Roadmap Q3', meta: 'Product' },
  { id: 'vendor', title: 'Vendor audit', meta: 'Finance' },
  { id: 'a11y', title: 'Accessibility audit', meta: 'Design' },
  { id: 'retention', title: 'Data retention policy', meta: 'Legal' },
];

const PAGE_SIZE = 4;

export default function PaginationLoadMorePreview() {
  const [shown, setShown] = useState<number>(PAGE_SIZE);
  const [loading, setLoading] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // The timer stands in for a fetch. Clearing it on unmount keeps the preview
  // from setting state after the stage has swapped components.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const items = ALL_RESULTS.slice(0, shown);
  const total = ALL_RESULTS.length;
  const exhausted = items.length >= total;

  const loadMore = () => {
    setLoading(true);
    timerRef.current = window.setTimeout(() => {
      setShown((n: number) => Math.min(n + PAGE_SIZE, total));
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full max-w-md">
      <ul className="m-0 list-none overflow-hidden rounded-xl border border-gray-200 p-0 dark:border-gray-800">
        {items.map((item: Result) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-t border-gray-200 px-4 py-3 first:border-t-0 dark:border-gray-800"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.title}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.meta}</span>
          </li>
        ))}
      </ul>

      {/* Present from first paint - a live region mounted alongside its own
          text change is usually not announced. */}
      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      <nav aria-label="Pagination">
        <button
          type="button"
          onClick={loadMore}
          disabled={loading || exhausted}
          aria-busy={loading}
          className="block h-10 w-full rounded-lg border border-gray-300 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          {loading ? 'Loading…' : exhausted ? 'All results loaded' : 'Load more'}
        </button>
      </nav>
    </div>
  );
}
