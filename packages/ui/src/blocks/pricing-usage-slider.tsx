'use client';

import { useState, type ChangeEvent } from 'react';

/**
 * Live preview for `pricing-usage-slider`.
 *
 * Mirrors the `typescript` code variant. Dragging the range recomputes the total
 * live, which is the whole component - a static screenshot of it would be
 * meaningless.
 * Keep this in step with `src/data/components/pricing.ts`.
 */
interface PricingUsageSliderProps {
  name?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

const PER_SEAT = 12;
const MIN_SEATS = 1;
const MAX_SEATS = 50;

export function PricingUsageSlider({
  name = 'Team',
  ctaLabel = 'Start free trial',
  ctaHref = '#',
  className = '',
}: PricingUsageSliderProps) {
  const [seats, setSeats] = useState<number>(5);
  const unit: string = seats === 1 ? 'seat' : 'seats';

  return (
    <form
      aria-labelledby="usage-heading"
      className={`mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-7 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100" id="usage-heading">
        {name}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Pay for the seats you use. Every feature is included at every size.
      </p>

      <div className="mt-7">
        <label
          className="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
          htmlFor="usage-seats"
        >
          Team members
        </label>
        <input
          id="usage-seats"
          type="range"
          min={MIN_SEATS}
          max={MAX_SEATS}
          step={1}
          value={seats}
          aria-valuetext={`${seats} ${unit}`}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setSeats(Number(event.target.value))}
          className="block w-full cursor-pointer accent-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 focus-visible:ring-offset-white dark:accent-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        />
        <div
          className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400"
          aria-hidden="true"
        >
          <span>{MIN_SEATS}</span>
          <span>{MAX_SEATS}</span>
        </div>
      </div>

      <p className="mt-6 flex rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
        <output className="flex flex-wrap items-baseline gap-1" htmlFor="usage-seats" aria-live="polite">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-gray-900 dark:text-gray-100">
            ${seats * PER_SEAT}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">
            {seats} {unit} × ${PER_SEAT}
          </span>
        </output>
      </p>

      <a
        href={ctaHref}
        className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </form>
  );
}

export default function PricingUsageSliderPreview() {
  return <PricingUsageSlider className="w-full" />;
}
