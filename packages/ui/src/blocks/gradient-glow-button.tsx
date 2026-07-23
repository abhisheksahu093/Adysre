'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `gradient-glow-button`.
 *
 * Mirrors the `nextjs`/`typescript` code variant verbatim - same markup, same
 * utilities - then renders it with a realistic label. Keep this in step with
 * `src/data/components/buttons.ts` when either side changes.
 */
interface GradientGlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GradientGlowButton({ children, ...props }: GradientGlowButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)] transition hover:-translate-y-px hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}

export default function GradientGlowButtonPreview() {
  return <GradientGlowButton>Get started</GradientGlowButton>;
}
