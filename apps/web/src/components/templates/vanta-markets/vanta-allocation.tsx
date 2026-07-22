'use client';

import { VANTA_ALLOCATION, VANTA_UI } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the portfolio donut.
 *
 * A single element: one conic-gradient for the wedges and a radial mask for the
 * hole, so there is no overlay disc to keep in sync with the card background.
 * The gradient stops and this legend are the same five numbers, which is why
 * both read from tokens declared once in `vanta.css`.
 */
export function VantaAllocation() {
  return (
    <section className="border-t border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_ALLOCATION.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{VANTA_ALLOCATION.title}</h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {VANTA_ALLOCATION.body}
            </p>

            <dl className="mt-10 grid max-w-md grid-cols-2 gap-px overflow-hidden rounded-[var(--vanta-radius-sm)] border border-[var(--vanta-line)] bg-[var(--vanta-line)]">
              <div className="bg-[var(--vanta-ink-deep)] px-5 py-4">
                <dt className="vanta-label">{VANTA_ALLOCATION.totalLabel}</dt>
                <dd className="vanta-mono mt-2 text-xl">{VANTA_ALLOCATION.totalValue}</dd>
              </div>
              <div className="bg-[var(--vanta-ink-deep)] px-5 py-4">
                <dt className="vanta-label">{VANTA_ALLOCATION.driftLabel}</dt>
                <dd className="vanta-mono vanta-up mt-2 text-xl">{VANTA_ALLOCATION.driftValue}</dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="vanta-card vanta-card-lg flex flex-col items-center gap-10 p-8 sm:flex-row sm:p-10">
              <div
                className="vanta-donut h-44 w-44 shrink-0 sm:h-52 sm:w-52"
                role="img"
                aria-label={VANTA_UI.chartAlt}
              />

              <ul className="w-full space-y-4">
                {VANTA_ALLOCATION.legend.map((entry, index) => (
                  <li
                    key={entry.label}
                    className="flex items-center justify-between gap-4 border-b border-[var(--vanta-line)] pb-4 last:border-b-0 last:pb-0"
                  >
                    <span className="flex items-center gap-3 text-[15px] text-[var(--vanta-muted)]">
                      <span
                        className={`h-2.5 w-2.5 rounded-full vanta-swatch-${index + 1}`}
                        aria-hidden
                      />
                      {entry.label}
                    </span>
                    <span className="vanta-mono text-[15px] text-[var(--vanta-text)]">
                      {entry.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
