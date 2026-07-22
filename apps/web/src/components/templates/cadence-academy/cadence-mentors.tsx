'use client';

import { ArrowRight } from 'lucide-react';
import {
  CADENCE_MENTORS,
  CADENCE_MENTORS_PAGE,
  type CadenceMentor,
} from '@/data/templates/cadence-academy-content';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the mentor roster, and the mentors page masthead.
 *
 * Portraits would be the obvious move and the template ships no images, so each
 * mentor gets a monogram disc instead - derived from the name rather than
 * authored, since it is a rendering of the name and not a second piece of copy.
 *
 * The disc alternates violet and lime by position so a six-person grid has a
 * rhythm without the data carrying a colour, which it has no business doing.
 */
function monogram(name: string): string {
  return name
    .split(/[\s-]+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('');
}

function MentorCard({ mentor, index }: { mentor: CadenceMentor; index: number }) {
  const lime = index % 2 === 1;

  return (
    <div className="cad-card flex h-full flex-col p-8 sm:p-9">
      <div className="flex items-center gap-5">
        <span
          className={`grid h-16 w-16 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] text-xl font-bold ${
            lime
              ? 'bg-[var(--cad-lime)] text-[var(--cad-ink)]'
              : 'bg-[var(--cad-violet)] text-[var(--cad-on-ink)]'
          }`}
          aria-hidden
        >
          {monogram(mentor.name)}
        </span>
        <div>
          <h3 className="text-xl font-bold tracking-[-0.02em]">{mentor.name}</h3>
          <p className="mt-1 text-sm font-semibold text-[var(--cad-lime-ink)]">{mentor.track}</p>
        </div>
      </div>

      <p className="mt-6 text-[15px] font-semibold text-[var(--cad-ink)]">{mentor.role}</p>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--cad-ink-soft)]">
        {mentor.bio}
      </p>
      <p className="cad-figures mt-6 border-t border-[var(--cad-rule)] pt-4 text-sm text-[var(--cad-ink-faint)]">
        {mentor.years} {CADENCE_MENTORS_PAGE.yearsSuffix}
      </p>
    </div>
  );
}

export function CadenceMentors() {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 sm:pt-16">
      <Reveal className="max-w-3xl">
        <p className="cad-eyebrow">{CADENCE_MENTORS_PAGE.eyebrow}</p>
        <span className="cad-underline mt-4" aria-hidden />
        <h1 className="cad-display mt-7 text-balance">{CADENCE_MENTORS_PAGE.title}</h1>
        <p className="mt-7 text-[17px] leading-[1.75] text-[var(--cad-ink-soft)]">
          {CADENCE_MENTORS_PAGE.subtitle}
        </p>
      </Reveal>

      {/* The row of discs, read as one strip before the cards spell each out. */}
      <Reveal delay={0.08}>
        <ul className="mt-12 flex flex-wrap items-center gap-3" aria-hidden>
          {CADENCE_MENTORS.map((mentor, index) => (
            <li
              key={mentor.name}
              className={`grid h-14 w-14 place-items-center rounded-[var(--cad-radius-pill)] text-base font-bold ${
                index % 2 === 1
                  ? 'bg-[var(--cad-lime)] text-[var(--cad-ink)]'
                  : 'bg-[var(--cad-violet)] text-[var(--cad-on-ink)]'
              }`}
            >
              {monogram(mentor.name)}
            </li>
          ))}
        </ul>
      </Reveal>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CADENCE_MENTORS.map((mentor, index) => (
          <li key={mentor.name}>
            <Reveal delay={0.06 * (index % 3)} className="h-full">
              <MentorCard mentor={mentor} index={index} />
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <a
          href={CADENCE_MENTORS_PAGE.ctaHref}
          className="group mt-14 inline-flex items-center gap-2 rounded-[var(--cad-radius-pill)] bg-[var(--cad-ink)] px-9 py-4 text-base font-semibold text-[var(--cad-on-ink)] transition-colors hover:bg-[var(--cad-violet)]"
        >
          {CADENCE_MENTORS_PAGE.cta}
          <ArrowRight
            className="h-5 w-5 transition-transform group-hover:translate-x-1"
            aria-hidden
          />
        </a>
      </Reveal>
    </section>
  );
}
