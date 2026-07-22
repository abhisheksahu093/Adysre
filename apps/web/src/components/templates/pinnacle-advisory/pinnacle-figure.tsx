'use client';

import { PINNACLE_LABELS, PINNACLE_METRICS } from '@/data/templates/pinnacle-advisory-content';

/**
 * PINNACLE - the editorial figure.
 *
 * This template ships no images, so the thing that would normally be a
 * photograph is built from three layered gradient panels: a dark ruled plate at
 * the back, a brand-blue slab offset behind it, and a pale card in front
 * carrying a miniature of the results dashboard. It is decoration, so the whole
 * block is `aria-hidden` - every figure it shows is stated in words elsewhere.
 *
 * Positioning is entirely Tailwind (`absolute`, `inset-*`); pinnacle.css only
 * supplies fills and radii, because a scoped `position` declaration would
 * outrank Tailwind's own utility.
 */
export function PinnacleFigure() {
  // Three rows is enough to read as a chart at this size; more would turn the
  // ornament into a second dashboard competing with the real one.
  const rows = PINNACLE_METRICS.slice(0, 3);

  return (
    <div aria-hidden className="relative aspect-[4/5] w-full max-w-md sm:aspect-square sm:max-w-none">
      {/* Back plate: ink with a fine drawn rule grid. */}
      <div className="pin-panel-a pin-ruled absolute inset-x-0 top-0 bottom-14" />

      {/* Brand slab, offset so its corner escapes the plate on one side only. */}
      <div className="pin-panel-b absolute top-10 -right-3 h-32 w-32 sm:-right-6 sm:h-40 sm:w-40" />

      {/* Front card: the miniature dashboard. */}
      <div className="pin-panel-c absolute right-6 bottom-0 left-6 p-6 sm:right-10 sm:left-10 sm:p-7">
        <p className="text-[0.6875rem] font-[600] tracking-[0.18em] text-[var(--pin-brand-ink)] uppercase">
          {PINNACLE_LABELS.figureCaption}
        </p>

        <div className="mt-5 space-y-4">
          {rows.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="truncate text-[0.75rem] text-[var(--pin-text-faint)]">
                  {metric.label}
                </span>
                <span className="text-[0.75rem] font-[600] text-[var(--pin-brand-ink)]">
                  {metric.delta}
                </span>
              </div>

              {/*
                ONE track, matching the results band: two stacked tracks read as
                a duplicated progress bar rather than as a comparison. The fill
                is the position at handover; the tick is where the engagement
                started, so the change is the gap between them.
              */}
              <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[var(--pin-sand-3)]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--pin-brand)]"
                  style={{ width: `${metric.after}%` }}
                />
                <span
                  aria-hidden
                  className="absolute inset-y-0 -ml-px w-0.5 rounded-full bg-[var(--pin-text-faint)]"
                  style={{ left: `${metric.before}%` }}
                />
              </div>

              <p className="sr-only">
                {metric.label}: {metric.before}% to {metric.after}%.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
