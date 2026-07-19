'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `pagination-infinite-sentinel`.
 *
 * Mirrors the `typescript` code variant, which is why that variant takes a
 * `root`: the preview scrolls inside its own `overflow-y-auto` panel rather
 * than the page. The stage sizes the iframe from `document.body.scrollHeight`,
 * so a component that relied on the iframe scrolling would simply grow the
 * frame and never trip the sentinel. Passing the panel as the observer root is
 * what makes the demo work - and is exactly what you would do for a feed inside
 * a drawer or a split pane.
 *
 * The data is a fixed local array and the "request" is a timer: no network, and
 * identical markup on server and client.
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
  { id: 'latency', title: 'Latency budget', meta: 'Engineering' },
  { id: 'partner', title: 'Partner agreement', meta: 'Legal' },
  { id: 'churn', title: 'Churn analysis', meta: 'Growth' },
  { id: 'tokens', title: 'Design tokens v2', meta: 'Design' },
  { id: 'runbook', title: 'On-call runbook', meta: 'Engineering' },
  { id: 'expenses', title: 'Expense policy', meta: 'Finance' },
  { id: 'nps', title: 'NPS survey results', meta: 'Success' },
  { id: 'localization', title: 'Localisation plan', meta: 'Product' },
  { id: 'benefits', title: 'Benefits handbook', meta: 'People' },
  { id: 'seo', title: 'Organic growth review', meta: 'Growth' },
  { id: 'dpa', title: 'Data processing addendum', meta: 'Legal' },
  { id: 'motion', title: 'Motion guidelines', meta: 'Design' },
];

const PAGE_SIZE = 8;

export default function PaginationInfiniteSentinelPreview() {
  const [shown, setShown] = useState<number>(PAGE_SIZE);
  const [loading, setLoading] = useState<boolean>(false);
  // Node in state, not a ref: the effect below must re-run once the panel is
  // mounted, and a ref mutation would not trigger it.
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

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

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !scrollRoot || exhausted || loading) return undefined;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      // Measured against the panel, not the viewport. A small margin here
      // because the panel is short; a full-page feed wants ~200px.
      { root: scrollRoot, rootMargin: '40px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, exhausted, loading, scrollRoot]);

  return (
    <div className="w-full max-w-md">
      <div
        ref={setScrollRoot}
        className="h-56 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-800"
      >
        <ul className="m-0 list-none p-0">
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

        {/* h-px, not hidden: an element with no box never intersects. */}
        <div ref={sentinelRef} className="h-px" aria-hidden="true" />
      </div>

      <p
        className="my-3 text-center text-sm tabular-nums text-gray-500 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        Showing {items.length} of {total} results
      </p>

      {/* The accessible escape hatch - scrolling is not the only way in. */}
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
