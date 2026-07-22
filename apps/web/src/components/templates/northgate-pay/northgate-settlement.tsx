'use client';

import { NORTHGATE_LABELS, NORTHGATE_SETTLEMENT } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the settlement timeline.
 *
 * A single gradient rail with four stops hanging off it. The rail is a real
 * grid column rather than an absolutely positioned line, so it stretches with
 * whatever the stop says and never has to be measured. The time is set in mono
 * at display size, because in payments the timestamp is the product.
 *
 * The list is revealed as one unit rather than per stop: a `<li>` has to be a
 * direct child of the `<ol>`, and `Reveal` renders a `<div>`.
 */
export function NorthgateSettlement() {
  return (
    <section className="ngp-on-deep ngp-wash relative overflow-hidden bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow ngp-eyebrow-invert">{NORTHGATE_LABELS.settlementEyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{NORTHGATE_LABELS.settlementTitle}</h2>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
            {NORTHGATE_LABELS.settlementSubtitle}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <ol className="mt-16">
            {NORTHGATE_SETTLEMENT.map((stop, index) => (
              <li key={stop.time} className="grid grid-cols-[auto_1fr] gap-x-6 sm:gap-x-10">
                <div className="flex flex-col items-center">
                  <span className="ngp-rail-dot mt-2 h-3.5 w-3.5 shrink-0" aria-hidden />
                  {/* The rail runs between stops, so the last one closes it. */}
                  {index < NORTHGATE_SETTLEMENT.length - 1 && (
                    <span className="ngp-rail mt-2 w-px flex-1" aria-hidden />
                  )}
                </div>

                <div className="pb-14 last:pb-0">
                  <p className="ngp-mono text-[22px] tracking-[-0.03em] text-[var(--ngp-cyan-bright)]">
                    {stop.time}
                  </p>
                  <h3 className="ngp-display mt-4 text-[19px] leading-snug">{stop.title}</h3>
                  <p className="mt-3 max-w-xl text-[14px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
                    {stop.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
