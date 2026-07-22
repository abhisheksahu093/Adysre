'use client';

import {
  CADENCE_COURSE_PAGE,
  CADENCE_MENTORS,
  CADENCE_MENTORS_PAGE,
  type CadenceCourse,
} from '@/data/templates/cadence-academy-content';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - who teaches this course.
 *
 * The roster is filtered by the course's own track rather than listed by name
 * against the course, so a course cannot end up pointing at a mentor who has
 * left the track. Monogram discs again, for the same reason as the mentors
 * page: no image assets anywhere in the template.
 */
function monogram(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('');
}

export function CadenceCourseMentor({ course }: { course: CadenceCourse }) {
  const mentors = CADENCE_MENTORS.filter((mentor) => mentor.track === course.track);

  return (
    <section className="mx-auto max-w-5xl px-5 pt-20 sm:px-8 sm:pt-24">
      <Reveal>
        <p className="cad-eyebrow">{CADENCE_COURSE_PAGE.mentorEyebrow}</p>
        <span className="cad-underline mt-4" aria-hidden />
      </Reveal>

      <ul className="mt-8 grid gap-5 sm:grid-cols-2">
        {mentors.map((mentor, index) => (
          <li key={mentor.name}>
            <Reveal delay={0.07 * index} className="h-full">
              <div className="cad-card flex h-full items-start gap-5 p-7">
                <span
                  className={`grid h-14 w-14 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] text-lg font-bold ${
                    index % 2 === 1
                      ? 'bg-[var(--cad-lime)] text-[var(--cad-ink)]'
                      : 'bg-[var(--cad-violet)] text-[var(--cad-on-ink)]'
                  }`}
                  aria-hidden
                >
                  {monogram(mentor.name)}
                </span>
                <div>
                  <h3 className="text-lg font-bold tracking-[-0.02em]">{mentor.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-[var(--cad-lime-ink)]">
                    {mentor.role}
                  </p>
                  <p className="cad-figures mt-3 text-sm text-[var(--cad-ink-faint)]">
                    {mentor.years} {CADENCE_MENTORS_PAGE.yearsSuffix}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
