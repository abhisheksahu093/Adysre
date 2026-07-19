/**
 * Live preview for `alert-banner-top`.
 *
 * Mirrors the `nextjs`/`typescript` code variant - no 'use client', because the
 * banner has nothing to hydrate.
 *
 * The mock header and page block below exist to show the one thing this entry is
 * about: the banner is a real block in the flow, above everything, and the page
 * simply starts lower. That's why the snippet is not `position: fixed` - at 200%
 * zoom a fixed bar eats a third of the viewport and covers the top of the page.
 * It also means the stage can measure it, which a fixed element would defeat.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import type { ReactNode } from 'react';

interface AlertBannerTopProps {
  children: ReactNode;
  ctaLabel?: string;
  href?: string;
  className?: string;
}

function AlertBannerTop({ children, ctaLabel, href, className = '' }: AlertBannerTopProps) {
  return (
    // <section aria-label>, not <header>: a second banner landmark on the page
    // breaks landmark navigation.
    <section
      role="status"
      aria-label="Service status"
      className={`w-full border-b border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200 ${className}`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-2 px-4 py-2">
        {/* amber-800 on amber-50 is 6.84:1; amber-200 on amber-950 is 12.03:1. */}
        <svg className="h-4 w-4 flex-none" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>

        <p className="text-center text-[0.8125rem] font-medium">{children}</p>

        {/* Underlined, not colour-only: a colour shift on a coloured bar is not
            a link affordance. */}
        {ctaLabel !== undefined && href !== undefined ? (
          <a
            href={href}
            className="rounded-sm text-[0.8125rem] font-semibold underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50 dark:focus-visible:ring-amber-200 dark:focus-visible:ring-offset-amber-950"
          >
            {ctaLabel}
          </a>
        ) : null}
      </div>
    </section>
  );
}

export default function AlertBannerTopPreview() {
  return (
    <div className="w-full max-w-lg overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <AlertBannerTop ctaLabel="Status page" href="#status-page-demo">
        Degraded performance in eu-west-1. Writes may be delayed.
      </AlertBannerTop>

      {/* Mock page chrome - context, not part of the component. */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Adysre</span>
        <span className="flex gap-3 text-xs text-gray-600 dark:text-gray-400">
          <span>Docs</span>
          <span>Pricing</span>
        </span>
      </div>

      <div className="px-4 py-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          The page just starts lower. Nothing is covered.
        </p>
      </div>
    </div>
  );
}
