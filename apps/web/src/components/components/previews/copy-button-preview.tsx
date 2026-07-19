'use client';

import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `copy-button`.
 *
 * Mirrors the `typescript` code variant verbatim. Unlike the loading button,
 * this one is NOT driven on a timer: the whole contract is "a click puts this
 * exact string on your clipboard", and a preview that animated itself would be
 * claiming a copy that never happened. The harness instead shows the payload
 * beside it, so a viewer can paste and check.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  children?: ReactNode;
}

function CopyButton({ text, children = 'Copy', ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'absolute';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied || undefined}
      className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[copied=true]:border-green-700 data-[copied=true]:text-green-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:data-[copied=true]:border-green-400 dark:data-[copied=true]:text-green-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
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
        {copied ? (
          <path d="m20 6-11 11-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? 'Copied' : children}</span>
    </button>
  );
}

const SNIPPET = 'npm install adysre';

export default function CopyButtonPreview() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2 pl-4 dark:border-gray-800 dark:bg-gray-950">
      <code className="text-sm text-gray-700 dark:text-gray-300">{SNIPPET}</code>
      <CopyButton text={SNIPPET} />
    </div>
  );
}
