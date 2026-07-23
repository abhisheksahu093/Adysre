'use client';

/**
 * Live preview for `progress-bar`.
 *
 * Mirrors the `typescript` code variant. 'use client' is here for the slider,
 * which is preview scaffolding - the component itself is just markup driven by a
 * number.
 *
 * The slider exists because the whole subject of this entry is invisible
 * otherwise: `aria-valuenow` tracks the real value. Drag it and the announced
 * value moves with the bar. Its indeterminate sibling
 * (`loader-bar-indeterminate`) omits that attribute entirely, and the absence is
 * the semantic - "in progress, amount unknown".
 *
 * Keep this in step with `src/data/components/loaders.ts`.
 */
import { useId, useState } from 'react';

interface ProgressBarProps {
  value: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label = 'Uploading', className = '' }: ProgressBarProps) {
  const labelId: string = useId();
  // Clamp before it reaches ARIA. "143%" announced with confidence is worse
  // than a bar that's merely wrong.
  const pct: number = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className={`grid w-full max-w-xs gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <span id={labelId} className="text-[0.8125rem] font-medium text-gray-900 dark:text-gray-100">
          {label}
        </span>
        {/* gray-600 on white is 7.56:1; gray-400 on gray-900 is 6.99:1. */}
        <span className="text-xs tabular-nums text-gray-600 dark:text-gray-400">{pct}%</span>
      </div>

      {/* No aria-live: role="progressbar" isn't a live region, and making it one
          would turn a 1→100 tick into a hundred announcements. */}
      <div
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
      >
        <div
          className="h-full rounded-full bg-blue-700 transition-[width] duration-300 ease-out motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ProgressBarPreview() {
  const [value, setValue] = useState<number>(43);
  const sliderId = useId();

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <ProgressBar value={value} label="Uploading backup.tar.gz" />

      {/* Scaffolding, not part of the component. */}
      <div className="grid w-full gap-1.5">
        <label htmlFor={sliderId} className="text-xs text-gray-600 dark:text-gray-400">
          Drag to change the value
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(event) => setValue(Number(event.target.value))}
          className="w-full accent-blue-700 dark:accent-blue-400"
        />
      </div>
    </div>
  );
}
