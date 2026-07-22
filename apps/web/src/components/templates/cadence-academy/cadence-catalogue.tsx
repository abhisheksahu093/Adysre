'use client';

import { useMemo, useState } from 'react';
import {
  CADENCE_COURSES,
  CADENCE_COURSES_PAGE,
  CADENCE_FILTERS,
} from '@/data/templates/cadence-academy-content';
import { CadenceCourseCard } from './cadence-course-card';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the catalogue, with track filtering.
 *
 * The chips really filter rather than decorate, because a grid of nine courses
 * is exactly the size where a visitor tries them. They are buttons in a group
 * with `aria-pressed`, not links, since nothing about the page's address
 * changes when one is used.
 *
 * The result count is announced politely: filtering removes cards without
 * moving focus, which a screen-reader user would otherwise not notice.
 */
export function CadenceCatalogue() {
  const [track, setTrack] = useState<string>('all');

  const visible = useMemo(
    () => (track === 'all' ? CADENCE_COURSES : CADENCE_COURSES.filter((c) => c.track === track)),
    [track],
  );

  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-16">
      <Reveal className="max-w-3xl">
        <p className="cad-eyebrow">{CADENCE_COURSES_PAGE.eyebrow}</p>
        <span className="cad-underline mt-4" aria-hidden />
        <h1 className="cad-display mt-7 text-balance">{CADENCE_COURSES_PAGE.title}</h1>
        <p className="mt-7 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
          {CADENCE_COURSES_PAGE.subtitle}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <div
          role="group"
          aria-label={CADENCE_COURSES_PAGE.filterGroup}
          className="mt-12 flex flex-wrap items-center gap-3 rounded-[var(--cad-radius)] bg-[var(--cad-cream-warm)] p-4 sm:p-5"
        >
          <span className="sr-only">{CADENCE_COURSES_PAGE.filterLegend}</span>
          {CADENCE_FILTERS.map((filter) => {
            const active = filter.id === track;
            return (
              <button
                key={filter.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTrack(filter.id)}
                className={`rounded-[var(--cad-radius-pill)] px-6 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[var(--cad-violet)] text-[var(--cad-on-ink)]'
                    : 'bg-[var(--cad-cream)] text-[var(--cad-ink-soft)] hover:text-[var(--cad-ink)]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}

          <p
            aria-live="polite"
            className="cad-figures ml-auto pr-2 text-sm font-semibold text-[var(--cad-ink-faint)]"
          >
            {visible.length} {CADENCE_COURSES_PAGE.resultsSuffix}
          </p>
        </div>
      </Reveal>

      {visible.length === 0 ? (
        <p className="mx-auto mt-20 max-w-md text-center text-[17px] leading-relaxed text-[var(--cad-ink-soft)]">
          {CADENCE_COURSES_PAGE.empty}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course, index) => (
            // Keyed by id so React reuses the card when the filter narrows,
            // rather than re-mounting (and re-animating) every survivor.
            <Reveal key={course.id} delay={0.05 * (index % 3)} className="h-full">
              <CadenceCourseCard course={course} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
