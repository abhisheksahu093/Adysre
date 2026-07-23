'use client';

import { useState } from 'react';

/**
 * Live preview for `fab-morphing`.
 *
 * Mirrors the `typescript` code variant with two preview-only changes: the
 * button is `absolute` inside this bounded card rather than `fixed`, and the
 * focus ring offset matches this card (`ring-offset-gray-50`). The morph - shape,
 * colour and icon - is driven off `aria-pressed`, and the transition is dropped
 * for reduced-motion users.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
export function FabMorphing() {
  const [active, setActive] = useState(false);

  return (
    <div className="relative min-h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Toggle it - the circle morphs into a rounded square as the state flips.
      </p>

      <button
        type="button"
        aria-pressed={active}
        aria-label={active ? 'Stop recording' : 'Start recording'}
        onClick={() => setActive((value) => !value)}
        className={
          'absolute bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950 ' +
          (active
            ? 'rounded-2xl bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600 dark:bg-rose-500 dark:focus-visible:ring-rose-400'
            : 'rounded-full bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600 dark:bg-blue-500 dark:focus-visible:ring-blue-400')
        }
      >
        {active ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="6" />
          </svg>
        )}
      </button>
    </div>
  );
}


export default FabMorphing;
