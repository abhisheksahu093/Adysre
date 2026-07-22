'use client';

import { ArrowRight } from 'lucide-react';
import { CADENCE_COURSES, CADENCE_FEATURED } from '@/data/templates/cadence-academy-content';
import { CadenceCourseCard } from './cadence-course-card';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the featured trio on the home page.
 *
 * The opening three of the catalogue, drawn with the same card the catalogue
 * uses so the home page can never show a course differently from the page that
 * lists it. Three is the count the copy promises, so it is read from the copy
 * being displayed rather than repeated as a magic number.
 */
const FEATURED_COUNT = 3;

export function CadenceFeatured() {
  const courses = CADENCE_COURSES.slice(0, FEATURED_COUNT);

  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-2xl">
          <p className="cad-eyebrow">{CADENCE_FEATURED.eyebrow}</p>
          <span className="cad-underline mt-4" aria-hidden />
          <h2 className="cad-display-sm mt-7 text-balance">{CADENCE_FEATURED.title}</h2>
          <p className="mt-6 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
            {CADENCE_FEATURED.subtitle}
          </p>
        </div>

        <a
          href={CADENCE_FEATURED.ctaHref}
          className="group inline-flex items-center gap-2 rounded-[var(--cad-radius-pill)] bg-[var(--cad-ink)] px-7 py-3.5 text-sm font-semibold text-[var(--cad-on-ink)] transition-colors hover:bg-[var(--cad-violet)]"
        >
          {CADENCE_FEATURED.cta}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </a>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <Reveal key={course.id} delay={0.08 * index} className="h-full">
            <CadenceCourseCard course={course} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
