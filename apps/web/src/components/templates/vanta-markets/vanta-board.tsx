'use client';

import { useMemo, useState } from 'react';
import {
  VANTA_INSTRUMENTS,
  VANTA_MARKET_FILTERS,
  VANTA_MARKETS_PAGE,
  VANTA_UI,
} from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the instrument board.
 *
 * A real `<table>`, because this is tabular data and a grid of divs would strip
 * the row and column relationships a screen reader needs. The sparkline in the
 * last cell is decorative and marked so; the numbers beside it are the content.
 *
 * Filtering is client state over the authored list rather than a query
 * parameter, so the board keeps its position when a chip is pressed and the
 * `?page=` navigation stays the only thing the URL carries.
 */
export function VantaBoard() {
  const [filter, setFilter] = useState('all');

  const rows = useMemo(
    () =>
      filter === 'all'
        ? VANTA_INSTRUMENTS
        : VANTA_INSTRUMENTS.filter((instrument) => instrument.assetClass === filter),
    [filter],
  );

  const headCell = 'vanta-label whitespace-nowrap px-4 py-4 text-left font-normal';
  const cell = 'vanta-mono whitespace-nowrap px-4 py-5 text-right text-[15px]';

  return (
    <section className="border-b border-[var(--vanta-line)]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="vanta-label" id="vanta-filter-legend">
                {VANTA_MARKETS_PAGE.filterLegend}
              </p>
              <div
                className="mt-4 flex flex-wrap gap-2"
                role="group"
                aria-labelledby="vanta-filter-legend"
              >
                {VANTA_MARKET_FILTERS.map((chip) => {
                  const active = chip.id === filter;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(chip.id)}
                      className={`vanta-chip px-4 py-2 transition-colors ${
                        active ? 'vanta-chip-active' : 'hover:text-[var(--vanta-text)]'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Announced politely: the count changes without the focus moving. */}
            <p className="vanta-mono text-[13px] text-[var(--vanta-faint)]" aria-live="polite">
              {`${rows.length} ${VANTA_MARKETS_PAGE.resultsSuffix}`}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 overflow-x-auto rounded-[var(--vanta-radius)] border border-[var(--vanta-line)]">
            <table className="w-full min-w-[52rem] border-collapse">
              <caption className="sr-only">{VANTA_MARKETS_PAGE.snapshotNote}</caption>
              <thead className="bg-[var(--vanta-ink-deep)]">
                <tr className="border-b border-[var(--vanta-line)]">
                  <th scope="col" className={headCell}>
                    {VANTA_MARKETS_PAGE.columns.instrument}
                  </th>
                  <th scope="col" className={`${headCell} text-right`}>
                    {VANTA_MARKETS_PAGE.columns.last}
                  </th>
                  <th scope="col" className={`${headCell} text-right`}>
                    {VANTA_MARKETS_PAGE.columns.change}
                  </th>
                  <th scope="col" className={`${headCell} text-right`}>
                    {VANTA_MARKETS_PAGE.columns.spread}
                  </th>
                  <th scope="col" className={`${headCell} text-right`}>
                    {VANTA_MARKETS_PAGE.columns.volume}
                  </th>
                  <th scope="col" className={`${headCell} text-right`}>
                    {VANTA_MARKETS_PAGE.columns.trend}
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((instrument) => (
                  <tr
                    key={instrument.symbol}
                    className="border-b border-[var(--vanta-line)] transition-colors last:border-b-0 hover:bg-[var(--vanta-surface)]"
                  >
                    <th scope="row" className="px-4 py-5 text-left font-normal">
                      <span className="vanta-mono block text-[15px] tracking-[0.06em] text-[var(--vanta-text)]">
                        {instrument.symbol}
                      </span>
                      <span className="mt-1 block text-[13px] text-[var(--vanta-faint)]">
                        {instrument.name}
                      </span>
                    </th>
                    <td className={cell}>{instrument.last}</td>
                    <td
                      className={`${cell} ${instrument.trend === 'up' ? 'vanta-up' : 'vanta-down'}`}
                    >
                      {instrument.change}
                      <span className="ml-3 opacity-80">{instrument.changePct}</span>
                      {/* Colour is reinforced by the sign above and this label. */}
                      <span className="sr-only">
                        {instrument.trend === 'up' ? VANTA_UI.gainLabel : VANTA_UI.lossLabel}
                      </span>
                    </td>
                    <td className={`${cell} text-[var(--vanta-muted)]`}>{instrument.spread}</td>
                    <td className={`${cell} text-[var(--vanta-muted)]`}>{instrument.volume}</td>
                    <td className="px-4 py-5">
                      <div className="ml-auto h-9 w-28 overflow-hidden" aria-hidden>
                        <div
                          className={`h-full w-full vanta-spark-${instrument.spark} ${
                            instrument.trend === 'up' ? 'vanta-spark' : 'vanta-spark-down'
                          }`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rows.length === 0 && (
              <p className="px-6 py-10 text-center text-[15px] text-[var(--vanta-faint)]">
                {VANTA_MARKETS_PAGE.empty}
              </p>
            )}
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-[var(--vanta-faint)]">
            {VANTA_MARKETS_PAGE.snapshotNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
