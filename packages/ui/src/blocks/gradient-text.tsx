'use client';

import type { ReactNode } from 'react';

/**
 * Live preview for `gradient-text`.
 *
 * Mirrors the `typescript` code variant verbatim. bg-clip-text keeps the
 * headline real, selectable text; the pb-1 is descender room, not rhythm. Keep
 * this in step with `src/data/components/gradients.ts`.
 */
interface GradientTextProps {
  title: ReactNode;
  kicker?: string;
  copy?: string;
  className?: string;
}

export function GradientText({ title, kicker, copy, className = '' }: GradientTextProps) {
  return (
    <div className={`mx-auto w-full max-w-2xl px-4 py-10 text-center sm:py-14 ${className}`}>
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {kicker}
        </p>
      ) : null}

      {/* bg-clip-text keeps the text real - selectable, findable, announced.
          pb-1 is descender room, not rhythm: the gradient clips at the content
          box and a tight line-height slices the tails off g, y and j. The
          dark: stops are each a shade lighter - contrast is judged per stop,
          never on the average. */}
      <h2 className="mt-3 bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-clip-text pb-1 text-3xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl dark:from-blue-400 dark:via-violet-400 dark:to-fuchsia-400">
        {title}
      </h2>

      {copy ? (
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {copy}
        </p>
      ) : null}
    </div>
  );
}

export const minHeight = 240;

export default function GradientTextPreview() {
  return (
    <GradientText
      title="Design is how it works"
      kicker="The 2026 report"
      copy="One gradient across the headline, solid ink everywhere else - the copy has to carry the reading, so it stays flat."
    />
  );
}
