'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `outline-button`.
 *
 * Mirrors the `typescript` code variant verbatim. Two instances so the disabled
 * treatment is visible next to the resting one - the hover fill is the point of
 * the component and needs a pointer, which no harness can fake.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function OutlineButton({ children, ...props }: OutlineButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}

export default function OutlineButtonPreview() {
  return (
    <div className="flex items-center gap-3">
      <OutlineButton>Learn more</OutlineButton>
      <OutlineButton disabled>Disabled</OutlineButton>
    </div>
  );
}
