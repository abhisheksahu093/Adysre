'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `ghost-button`.
 *
 * Mirrors the `typescript` code variant verbatim. A ghost button shown alone
 * looks like loose text, so the preview places it where it actually belongs -
 * beside the filled button it is the quiet half of.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GhostButton({ children, ...props }: GhostButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg border border-transparent bg-transparent px-3.5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}

export default function GhostButtonPreview() {
  return (
    <div className="flex items-center gap-2">
      <GhostButton>Cancel</GhostButton>
      <button
        type="button"
        className="rounded-lg bg-blue-600 px-3.5 py-2 font-medium text-white"
      >
        Save changes
      </button>
    </div>
  );
}
