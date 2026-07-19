'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `toggle-collapse-disclosure`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleCollapseDisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

function ToggleCollapseDisclosure({
  summary,
  children,
  defaultOpen = false,
  className = '',
}: ToggleCollapseDisclosureProps) {
  return (
    <details open={defaultOpen} className={`group w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-800 ${className}`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-medium text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100 dark:focus-visible:outline-blue-400">
        {summary}
        <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none">
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="border-t border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        {children}
      </div>
    </details>
  );
}

export default function ToggleCollapseDisclosurePreview() {
  return (
    <ToggleCollapseDisclosure summary="Shipping & returns" defaultOpen>
      Free returns within 30 days. Orders ship in 1-2 business days.
    </ToggleCollapseDisclosure>
  );
}
