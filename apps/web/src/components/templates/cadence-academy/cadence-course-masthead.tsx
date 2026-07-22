'use client';

import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import {
  CADENCE_COURSE_PAGE,
  CADENCE_METRICS,
  CADENCE_UI,
  type CadenceCourse,
} from '@/data/templates/cadence-academy-content';
import { CadenceRing } from './cadence-ring';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the single course masthead.
 *
 * The detail page's own opening, distinct from the home hero: a back link, the
 * course title at display scale, the four figures a visitor decides on, and the
 * completion ring for this specific course rather than the academy average.
 *
 * The ring lives inside the same `Reveal` as everything else here, because the
 * CSS that fills it keys off the `cad-revealed` class `Reveal` adds.
 */
export function CadenceCourseMasthead({ course }: { course: CadenceCourse }) {
  const price = course.price === '$0' ? CADENCE_UI.freePrice : course.price;

  const facts = [
    { label: CADENCE_METRICS.hours, value: `${course.hours}` },
    { label: CADENCE_METRICS.level, value: course.level },
    { label: CADENCE_METRICS.price, value: price },
    { label: CADENCE_METRICS.rating, value: course.rating.toFixed(1) },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 pb-14 pt-8 sm:px-8 sm:pb-20 sm:pt-12">
      <Reveal>
        <a
          href={CADENCE_COURSE_PAGE.backHref}
          className="inline-flex items-center gap-2 rounded-[var(--cad-radius-pill)] bg-[var(--cad-cream-warm)] px-5 py-2.5 text-sm font-semibold text-[var(--cad-ink-soft)] transition-colors hover:text-[var(--cad-ink)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {CADENCE_COURSE_PAGE.back}
        </a>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-16">
          <div>
            <p className="cad-eyebrow">{CADENCE_COURSE_PAGE.eyebrow}</p>
            <h1 className="cad-display mt-5 text-balance">{course.title}</h1>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="rounded-[var(--cad-radius-pill)] bg-[var(--cad-violet)] px-5 py-2 text-sm font-bold text-[var(--cad-on-ink)]">
                {course.track}
              </span>
              <span className="rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)] px-5 py-2 text-sm font-bold text-[var(--cad-ink)]">
                {course.cohort}
              </span>
            </div>

            <p className="mt-7 max-w-xl text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
              {course.summary}
            </p>

            {/*
              Flex-wrap, not a fixed 4-column grid: these values are
              content-sized and unpredictable ("24" beside "Intermediate"), so
              equal columns guarantee the widest one overlaps its neighbour at
              some viewport. Wrapping lets each fact keep its own width and drop
              to the next line instead of colliding.
            */}
            <dl className="mt-10 flex max-w-xl flex-wrap gap-x-10 gap-y-6 border-t border-[var(--cad-rule)] pt-8">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-[5rem]">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cad-ink-faint)]">
                    {fact.label}
                  </dt>
                  <dd className="cad-figures mt-1.5 text-xl font-bold sm:text-2xl">{fact.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={CADENCE_COURSE_PAGE.enrolHref}
                className="group inline-flex items-center justify-center gap-2 rounded-[var(--cad-radius-pill)] bg-[var(--cad-violet)] px-9 py-4 text-base font-semibold text-[var(--cad-on-ink)] transition-transform duration-300 hover:-translate-y-1"
              >
                {CADENCE_COURSE_PAGE.enrol}
                <ArrowRight
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  aria-hidden
                />
              </a>
              <p className="flex items-center gap-2 text-sm text-[var(--cad-ink-faint)]">
                <Star className="h-4 w-4 text-[var(--cad-violet)]" aria-hidden />
                <span className="cad-figures">
                  {course.rating.toFixed(1)} {CADENCE_UI.ratingOf} ·{' '}
                  {course.graduates.toLocaleString('en-GB')} {CADENCE_METRICS.graduates}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8">
            {/* The course's cover art, at the size it deserves on its own page. */}
            <div className={`cad-thumb cad-thumb--${course.thumb} h-56 w-full`} aria-hidden />

            <div className="flex items-center gap-6">
              <CadenceRing value={course.completion} label={CADENCE_COURSE_PAGE.ringLabel} />
              <div className="max-w-[12rem]">
                <p className="cad-eyebrow">{CADENCE_COURSE_PAGE.ringEyebrow}</p>
                <p className="mt-2 text-[15px] font-semibold leading-snug">
                  {CADENCE_COURSE_PAGE.ringLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
