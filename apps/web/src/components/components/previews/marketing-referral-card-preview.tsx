'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `marketing-referral-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The code field and the copy
 * button stack on mobile so nothing overflows at 320px. Copy state is local;
 * the clipboard write is guarded because it is unavailable in some contexts.
 * Keep in step with `src/data/components/marketing.ts`.
 */
interface ReferralCardProps {
  code: string;
  title?: string;
  copy?: string;
  className?: string;
}

function ReferralCard({
  code,
  title = 'Give $20, get $20',
  copy,
  className = '',
}: ReferralCardProps) {
  const fieldId = useId();
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    void navigator.clipboard?.writeText(code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section
      className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8M2 7h20v5H2zM12 21V7M12 7H8.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7M12 7h3.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="mt-4 text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">
        {copy ?? 'Share your code. When a friend subscribes, you both get account credit.'}
      </p>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <label htmlFor={fieldId} className="sr-only">
          Your referral code
        </label>
        <input
          id={fieldId}
          type="text"
          readOnly
          value={code}
          className="min-w-0 flex-1 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-3 py-2.5 text-center font-mono text-sm tracking-widest text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
        />
        <button
          type="button"
          onClick={handleCopy}
          className="whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {copied ? 'Copied!' : 'Copy code'}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        {copied ? 'Code copied to clipboard.' : ' '}
      </p>
    </section>
  );
}

export default function MarketingReferralCardPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ReferralCard code="FRIEND-4KQ9" title="Give $20, get $20" />
      </div>
    </section>
  );
}

export const minHeight = 300;
