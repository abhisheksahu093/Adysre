'use client';

/**
 * Live preview for `pricing-per-seat`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/pricing.ts`. The total lives in an <output> live region
 * so it is announced as the seat count changes; steppers are >=40px tap targets.
 */
import { useState } from 'react';

interface PricingPerSeatProps {
  perSeat?: number;
  minSeats?: number;
  maxSeats?: number;
  initialSeats?: number;
  currency?: string;
  ctaLabel?: string;
  className?: string;
}

export function PricingPerSeat({
  perSeat = 7,
  minSeats = 1,
  maxSeats = 50,
  initialSeats = 3,
  currency = '$',
  ctaLabel = 'Start with this team',
  className = '',
}: PricingPerSeatProps) {
  const [seats, setSeats] = useState(initialSeats);
  const clamp = (n: number) => Math.min(maxSeats, Math.max(minSeats, n));
  const total = perSeat * seats;
  const seatWord = seats === 1 ? 'seat' : 'seats';

  return (
    <section
      className={`mx-auto w-full max-w-md px-4 ${className}`}
      aria-labelledby="per-seat-heading"
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100" id="per-seat-heading">
          Team plan
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {currency}
          {perSeat} per seat, per month.
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <span id="per-seat-label" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Seats
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSeats((s) => clamp(s - 1))}
              disabled={seats <= minSeats}
              aria-label="Remove one seat"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              &minus;
            </button>
            <span
              className="w-10 text-center text-base font-semibold tabular-nums text-gray-900 dark:text-gray-100"
              aria-live="polite"
              aria-labelledby="per-seat-label"
            >
              {seats}
            </span>
            <button
              type="button"
              onClick={() => setSeats((s) => clamp(s + 1))}
              disabled={seats >= maxSeats}
              aria-label="Add one seat"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 text-lg text-gray-700 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              +
            </button>
          </div>
        </div>

        <p className="mt-6 flex flex-wrap items-baseline gap-x-2 border-t border-gray-100 pt-5 dark:border-gray-800">
          <output
            className="text-3xl font-bold tracking-tight tabular-nums text-gray-900 dark:text-gray-100"
            aria-live="polite"
          >
            {currency}
            {total}
          </output>
          <span className="text-sm text-gray-600 dark:text-gray-400">/month</span>
          <span className="basis-full text-xs text-gray-500 dark:text-gray-400">
            {seats} {seatWord} &times; {currency}
            {perSeat}
          </span>
        </p>

        <a
          href="#"
          className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}

export const minHeight = 380;

export default function PricingPerSeatPreview() {
  return <PricingPerSeat />;
}
