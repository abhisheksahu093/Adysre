'use client';

import { ArrowUpRight, Star } from 'lucide-react';
import {
  CADENCE_METRICS,
  CADENCE_UI,
  type CadenceCourse,
} from '@/data/templates/cadence-academy-content';

/**
 * CADENCE - one course.
 *
 * Shared by the home page's featured trio and the catalogue grid, because the
 * two must never drift apart: a card is the template's single unit of course
 * information. The "cover" is a CSS gradient composition chosen by the course's
 * `thumb`, so nine cards look varied without one image byte.
 *
 * The hours / level / rating row is a `<dl>` rather than styled spans - they
 * are labelled values, and a screen reader should hear the label.
 */
export function CadenceCourseCard({ course }: { course: CadenceCourse }) {
  const metrics = [
    { label: CADENCE_METRICS.hours, value: `${course.hours}` },
    { label: CADENCE_METRICS.level, value: course.level },
    { label: CADENCE_METRICS.rating, value: course.rating.toFixed(1) },
  ];

  // A price of nothing is worth saying in words: "$0" reads as a bug, "Free"
  // reads as an offer, and the free foundation course is the top of the funnel.
  const price = course.price === '$0' ? CADENCE_UI.freePrice : course.price;

  return (
    <article className="cad-card group flex h-full flex-col p-4">
      {/* `relative` is a Tailwind utility so the track chip can sit on the art. */}
      <div className="relative">
        <div className={`cad-thumb cad-thumb--${course.thumb} h-44 w-full sm:h-48`} aria-hidden />
        <span className="absolute left-4 top-4 rounded-[var(--cad-radius-pill)] bg-[var(--cad-cream)] px-4 py-1.5 text-xs font-bold text-[var(--cad-ink)]">
          {course.track}
        </span>
        <span className="absolute right-4 top-4 rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)] px-4 py-1.5 text-xs font-bold text-[var(--cad-ink)]">
          {price}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-2 pt-6">
        <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em]">{course.title}</h3>
        <p className="mt-2 text-sm font-semibold text-[var(--cad-lime-ink)]">{course.cohort}</p>

        <p className="mt-4 text-[15px] leading-relaxed text-[var(--cad-ink-soft)]">
          {course.summary}
        </p>

        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-[var(--cad-rule)] pt-5">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--cad-ink-faint)]">
                {metric.label}
              </dt>
              <dd className="cad-figures mt-1 text-lg font-bold">{metric.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 flex items-center gap-2 text-[13px] text-[var(--cad-ink-faint)]">
          <Star className="h-4 w-4 text-[var(--cad-violet)]" aria-hidden />
          {/* The rating is repeated in words so it is not read as "4.8 star". */}
          <span className="cad-figures">
            {course.rating.toFixed(1)} {CADENCE_UI.ratingOf}
          </span>
          <span aria-hidden>·</span>
          <span className="cad-figures">
            {course.graduates.toLocaleString('en-GB')} {CADENCE_METRICS.graduates}
          </span>
        </p>

        <a
          href={CADENCE_UI.courseHref}
          className="mt-6 inline-flex items-center gap-1.5 self-start rounded-[var(--cad-radius-pill)] bg-[var(--cad-cream-warm)] px-6 py-3 text-sm font-semibold text-[var(--cad-ink)] transition-colors hover:bg-[var(--cad-violet)] hover:text-[var(--cad-on-ink)]"
        >
          {CADENCE_UI.viewCourse}
          <ArrowUpRight className="h-4 w-4" aria-hidden />
          {/* The title is repeated for assistive tech, since "Course detail" is
              identical on every card in a nine-card grid. */}
          <span className="sr-only">{`: ${course.title}`}</span>
        </a>
      </div>
    </article>
  );
}
