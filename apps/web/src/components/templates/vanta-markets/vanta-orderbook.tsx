'use client';

import { VANTA_ORDER_BOOK } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the depth-of-book ladder.
 *
 * Two five-level columns with a depth bar behind each row. The bar is placed by
 * Tailwind (`absolute inset-y-0 right-0`) and only its width and fill come from
 * `vanta.css`, which is the rule this template's scoped CSS follows everywhere:
 * scoped selectors outrank single-class utilities, so they never set `position`.
 *
 * Bars are `aria-hidden`; the size beside each price is the same information in
 * a form a screen reader can read.
 */
export function VantaOrderBook() {
  const columns = [
    { key: 'asks', label: VANTA_ORDER_BOOK.asksLabel, rows: VANTA_ORDER_BOOK.asks },
    { key: 'bids', label: VANTA_ORDER_BOOK.bidsLabel, rows: VANTA_ORDER_BOOK.bids },
  ] as const;

  return (
    <section className="border-b border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_ORDER_BOOK.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{VANTA_ORDER_BOOK.title}</h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {VANTA_ORDER_BOOK.body}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="vanta-card vanta-card-lg p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 border-b border-[var(--vanta-line)] pb-5">
                <p className="vanta-mono text-sm tracking-[0.08em]">{VANTA_ORDER_BOOK.symbol}</p>
                <p className="vanta-label">
                  {VANTA_ORDER_BOOK.spreadLabel}
                  <span className="vanta-mono ml-3 text-[13px] normal-case tracking-normal text-[var(--vanta-text)]">
                    {VANTA_ORDER_BOOK.spreadValue}
                  </span>
                </p>
              </div>

              <div className="mt-7 grid gap-8 sm:grid-cols-2 sm:gap-6">
                {columns.map((column) => (
                  <div key={column.key}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className={`vanta-label ${
                          column.key === 'asks' ? 'vanta-down' : 'vanta-up'
                        }`}
                      >
                        {column.label}
                      </span>
                      <span className="vanta-label">{VANTA_ORDER_BOOK.sizeLabel}</span>
                    </div>

                    <ul className={`mt-3 space-y-1 vanta-ladder-${column.key}`}>
                      {column.rows.map((level) => (
                        // `relative` is Tailwind's so the depth bar anchors here.
                        <li
                          key={level.price}
                          className="relative flex items-center justify-between gap-4 overflow-hidden rounded-[var(--vanta-radius-xs)] px-3 py-2"
                        >
                          <span className="vanta-depth absolute inset-y-0 right-0" aria-hidden />
                          <span
                            className={`vanta-mono relative text-[13px] ${
                              column.key === 'asks' ? 'vanta-down' : 'vanta-up'
                            }`}
                          >
                            {level.price}
                          </span>
                          <span className="vanta-mono relative text-[13px] text-[var(--vanta-muted)]">
                            {level.size}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
