'use client';

import { VANTA_CANDLES, VANTA_UI } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the candlestick block.
 *
 * Sixteen divs, and that is the whole chart. Each column takes `relative` from
 * Tailwind and draws its wick and body as pseudo-elements, with the geometry
 * declared per `nth-child` in `vanta.css` - deliberately, because a hand-drawn
 * chart is a composition and belongs with the art direction, while the up or
 * down of each session is content and lives in the content module.
 *
 * The whole plot is `role="img"` with one label: sixteen unlabelled bars are
 * noise to a screen reader, and the figures beside it carry the information.
 */
export function VantaCandles() {
  return (
    <section className="border-t border-[var(--vanta-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_CANDLES.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{VANTA_CANDLES.title}</h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {VANTA_CANDLES.body}
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="vanta-card vanta-card-lg p-6 sm:p-8">
              <div className="flex items-baseline justify-between gap-4 border-b border-[var(--vanta-line)] pb-5">
                <p className="vanta-mono text-sm tracking-[0.08em]">{VANTA_CANDLES.symbol}</p>
                <p className="vanta-label">
                  {VANTA_CANDLES.rangeLabel}
                  <span className="vanta-mono ml-3 text-[13px] normal-case tracking-normal text-[var(--vanta-text)]">
                    {VANTA_CANDLES.rangeValue}
                  </span>
                </p>
              </div>

              <div
                className="vanta-candles mt-7 flex h-56 items-stretch gap-2 sm:h-72 sm:gap-3"
                role="img"
                aria-label={VANTA_UI.chartAlt}
              >
                {VANTA_CANDLES.sessions.map((trend, index) => (
                  <div
                    // Sessions are positional, so the index is the identity here.
                    key={`session-${index}`}
                    className={`vanta-candle relative flex-1 ${
                      trend === 'up' ? 'vanta-candle-up' : 'vanta-candle-down'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
