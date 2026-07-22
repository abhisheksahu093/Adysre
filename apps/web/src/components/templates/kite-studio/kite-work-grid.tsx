'use client';

import { useMemo, useState } from 'react';
import {
  KITE_CASE_STUDIES,
  KITE_FILTERS,
  KITE_UI,
  KITE_WORK_PAGE,
} from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';
import { KiteWorkCard } from './kite-work-card';

/**
 * KITE - the filterable book on the work page.
 *
 * Filtering is client state over an authored list, because a template has no
 * backend and a chip that reloads the page would be worse than no chip. The live
 * count is announced through `aria-live`, since pressing a chip changes what is
 * on screen without moving focus.
 */
export function KiteWorkGrid() {
  const [active, setActive] = useState('all');

  const shown = useMemo(
    () =>
      active === 'all'
        ? KITE_CASE_STUDIES
        : KITE_CASE_STUDIES.filter((study) => study.discipline === active),
    [active],
  );

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
      <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label={KITE_UI.workNav}>
            <p className="sr-only">{KITE_WORK_PAGE.filterLegend}</p>
            <ul className="flex flex-wrap gap-2.5">
              {KITE_FILTERS.map((filter) => {
                const current = filter.id === active;
                return (
                  <li key={filter.id}>
                    <button
                      type="button"
                      aria-pressed={current}
                      onClick={() => setActive(filter.id)}
                      className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${
                        current
                          ? 'kite-pill-hot'
                          : 'border border-[var(--kite-line-strong)] text-[var(--kite-paper-soft)] hover:border-[var(--kite-acid)] hover:text-[var(--kite-acid)]'
                      }`}
                    >
                      {filter.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <p
            aria-live="polite"
            className="kite-figures text-[11px] uppercase tracking-[0.2em] text-[var(--kite-paper-faint)]"
          >
            {shown.length} {KITE_WORK_PAGE.resultsSuffix}
          </p>
        </div>
      </Reveal>

      {shown.length === 0 ? (
        <p className="kite-panel mt-12 px-8 py-16 text-center text-[15px] text-[var(--kite-paper-soft)]">
          {KITE_WORK_PAGE.empty}
        </p>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {shown.map((study, index) => (
            // Keyed by id, so switching filters remounts the cards and the
            // entrance replays for the new set rather than snapping in.
            <Reveal key={study.id} delay={(index % 2) * 0.08}>
              <KiteWorkCard study={study} tilt={index % 2 === 0 ? 'l' : 'r'} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
