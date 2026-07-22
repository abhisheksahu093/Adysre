'use client';

import { VERDANT_ABOUT_PAGE } from '@/data/templates/verdant-realty-content';
import { Reveal } from './verdant-reveal';

/**
 * VERDANT - the brokers and the timeline, closing the about page.
 *
 * Portraits would be the obvious move and the template has no images, so each
 * broker gets a monogram disc instead - derived from the name rather than
 * authored, since it is a rendering of the name and not a second piece of copy.
 */
function monogram(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('');
}

export function VerdantTeam() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
      <Reveal className="max-w-2xl">
        <p className="verdant-eyebrow">{VERDANT_ABOUT_PAGE.teamEyebrow}</p>
        <span className="verdant-rule mt-4" aria-hidden />
        <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
          {VERDANT_ABOUT_PAGE.teamTitle}
        </h2>
      </Reveal>

      <ul className="mt-12 grid gap-7 sm:grid-cols-2">
        {VERDANT_ABOUT_PAGE.team.map((person, index) => (
          <li key={person.name}>
            <Reveal delay={0.06 * index} className="h-full">
              <div className="verdant-card flex h-full gap-5 p-7">
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[var(--verdant-forest)] text-sm font-semibold uppercase tracking-[0.1em] text-[var(--verdant-brass)]"
                  aria-hidden
                >
                  {monogram(person.name)}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-[-0.01em]">{person.name}</h3>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[var(--verdant-brass)]">
                    {person.role}
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
                    {person.bio}
                  </p>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal delay={0.1}>
        <p className="verdant-eyebrow mt-20">{VERDANT_ABOUT_PAGE.milestonesEyebrow}</p>
      </Reveal>

      {/* A dated list is a description list: the year is the term, the event the
          description. That is also what a screen reader should hear. */}
      <dl className="mt-8 divide-y divide-[var(--verdant-rule)] border-y border-[var(--verdant-rule)]">
        {VERDANT_ABOUT_PAGE.milestones.map((milestone, index) => (
          <Reveal key={milestone.year} delay={0.05 * index}>
            <div className="grid gap-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
              <dt className="verdant-figures text-lg font-semibold text-[var(--verdant-brass)]">
                {milestone.year}
              </dt>
              <dd className="text-[15px] leading-relaxed text-[var(--verdant-ink-soft)]">
                {milestone.label}
              </dd>
            </div>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
