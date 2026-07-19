/**
 * Live preview for `alert-callout`.
 *
 * Mirrors the `nextjs`/`typescript` code variant. The only preview in this set
 * with no 'use client' - the component has nothing to hydrate, which is the
 * whole character of a callout: it is markup around prose.
 *
 * The surrounding paragraph is context, not part of the component. A callout
 * shown alone loses the thing that defines it, which is that it interrupts a
 * page of text without interrupting the reader.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
import type { ReactNode } from 'react';

interface AlertCalloutProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

function AlertCallout({ label = 'Note', children, className = '' }: AlertCalloutProps) {
  // No role, no aria-live, deliberately: this is body copy that was on the page
  // before the reader arrived. There is no event to announce. <aside> exposes it
  // as a complementary landmark so it can be skipped or jumped to.
  return (
    <aside
      className={`rounded-r-lg border-l-[3px] border-blue-700 bg-gray-50 px-4 py-3.5 dark:border-blue-400 dark:bg-gray-900 ${className}`}
    >
      {/* Real text, not a ::before - it's read first and it's what makes the
          block make sense out of context. blue-800 on gray-50 is 7.7:1. */}
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
        <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-2 3a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z" />
        </svg>
        {label}
      </p>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>
    </aside>
  );
}

export default function AlertCalloutPreview() {
  return (
    <div className="grid w-full max-w-md gap-3">
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        Signing keys are rotated from the dashboard or the CLI. Both create the new key first and
        leave the old one active until you revoke it.
      </p>

      <AlertCallout>
        Rotating a key invalidates every token signed with it. Deploy the new key to all consumers
        before you revoke the old one.
      </AlertCallout>

      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
        Revocation takes effect within 60 seconds across all regions.
      </p>
    </div>
  );
}
