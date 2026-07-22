'use client';

import { VANTA_TICKERS, VANTA_UI } from '@/data/templates/vanta-markets-content';

/**
 * VANTA - the quote strip that sits under the header on every page.
 *
 * The signature visual of the template, and the one most likely to mislead, so
 * it is labelled: a status dot plus the word "Snapshot", and a visually hidden
 * caption saying the figures are illustrative. Colour is never the only signal
 * either - each change already carries its own `+` or `-`.
 *
 * The list is rendered twice so the CSS animation can translate exactly -50%
 * and land on the seam; the duplicate is `aria-hidden` so a screen reader hears
 * each quote once.
 */
export function VantaTicker() {
  return (
    <section
      aria-label={VANTA_UI.tickerLabel}
      className="overflow-hidden border-y border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]"
    >
      <div className="flex items-center">
        {/* The label pins to the left edge and the quotes scroll past it. */}
        <div className="z-10 flex shrink-0 items-center gap-2 border-r border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)] py-3 pl-5 pr-4 sm:pl-8">
          <span className="vanta-pulse h-1.5 w-1.5 rounded-full bg-[var(--vanta-up)]" aria-hidden />
          <span className="vanta-label">{VANTA_UI.liveLabel}</span>
        </div>

        <div className="overflow-hidden py-3">
          <div className="vanta-ticker flex w-max items-center">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                className="flex items-center"
                {...(copy === 1 ? { 'aria-hidden': true } : {})}
              >
                {VANTA_TICKERS.map((quote) => (
                  <li
                    key={quote.symbol}
                    className="flex items-baseline gap-2.5 border-r border-[var(--vanta-line)] px-6 whitespace-nowrap"
                  >
                    <span className="vanta-mono text-[13px] tracking-[0.08em] text-[var(--vanta-text)]">
                      {quote.symbol}
                    </span>
                    <span className="vanta-mono text-[13px] text-[var(--vanta-muted)]">
                      {quote.last}
                    </span>
                    <span
                      className={`vanta-mono text-[13px] ${
                        quote.trend === 'up' ? 'vanta-up' : 'vanta-down'
                      }`}
                    >
                      {quote.change}
                    </span>
                    {/* Redundant text label: colour alone must not carry meaning. */}
                    <span className="sr-only">
                      {quote.trend === 'up' ? VANTA_UI.gainLabel : VANTA_UI.lossLabel}
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
