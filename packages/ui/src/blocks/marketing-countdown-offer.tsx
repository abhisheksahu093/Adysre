'use client';

import { useEffect, useState } from 'react';

/**
 * Live preview for `marketing-countdown-offer`.
 *
 * Mirrors the `typescript` code variant verbatim. The separators carry a pulse
 * that is gated behind `motion-reduce:animate-none`, so a reduced-motion user
 * gets the numbers with no throb. The clock still counts either way. The four
 * units wrap and never overflow at 320px. The section itself is width-agnostic
 * (`w-full`); the preview supplies the page shell that centres it. Keep in step
 * with `src/data/components/marketing.ts`.
 */
interface CountdownOfferProps {
  title: string;
  copy?: string;
  deadline: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function remainingParts(deadline: string): TimeParts {
  const ms = Math.max(0, new Date(deadline).getTime() - Date.now());
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function CountdownOffer({
  title,
  copy,
  deadline,
  ctaLabel = 'Shop the sale',
  ctaHref = '#',
  className = '',
}: CountdownOfferProps) {
  const [parts, setParts] = useState<TimeParts>(() => remainingParts(deadline));

  useEffect(() => {
    setParts(remainingParts(deadline));
    const id = setInterval(() => setParts(remainingParts(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const units: { label: string; value: number }[] = [
    { label: 'Days', value: parts.days },
    { label: 'Hours', value: parts.hours },
    { label: 'Minutes', value: parts.minutes },
    { label: 'Seconds', value: parts.seconds },
  ];

  return (
    <section
      className={`w-full rounded-2xl border border-gray-200 bg-white p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">
        {title}
      </h2>
      {copy ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{copy}</p> : null}

      <ul className="mt-6 flex flex-wrap items-stretch justify-center gap-2 sm:gap-3" aria-hidden="true">
        {units.map((unit) => (
          <li
            key={unit.label}
            className="flex min-w-16 flex-1 flex-col items-center rounded-xl bg-gray-100 px-2 py-3 dark:bg-gray-800"
          >
            <span className="text-2xl font-bold tabular-nums text-gray-900 motion-safe:animate-pulse motion-reduce:animate-none sm:text-3xl dark:text-gray-100">
              {String(unit.value).padStart(2, '0')}
            </span>
            <span className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              {unit.label}
            </span>
          </li>
        ))}
      </ul>

      <p className="sr-only" aria-live="polite">
        {parts.days} days, {parts.hours} hours, {parts.minutes} minutes and {parts.seconds} seconds
        remaining.
      </p>

      <a
        href={ctaHref}
        className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {ctaLabel}
      </a>
    </section>
  );
}

export default function MarketingCountdownOfferPreview() {
  const deadline = new Date(Date.now() + (2 * 86400 + 5 * 3600 + 37 * 60 + 12) * 1000).toISOString();
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <CountdownOffer
          title="Spring sale ends soon"
          copy="Every annual plan is 30% off until the timer runs out."
          deadline={deadline}
          ctaLabel="Shop the sale"
          ctaHref="#"
        />
      </div>
    </section>
  );
}

export const minHeight = 300;
