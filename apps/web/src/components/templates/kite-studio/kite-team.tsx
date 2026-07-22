'use client';

import { KITE_STUDIO_PAGE, KITE_TEAM } from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';

/**
 * KITE - the roster and the timeline.
 *
 * Portraits are initials on a gradient disc rather than photography: the
 * template ships no image assets, and a studio page full of empty avatar boxes
 * would be worse than a set of marks that were designed.
 */
export function KiteTeam() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="kite-eyebrow">{KITE_STUDIO_PAGE.teamEyebrow}</p>
          <h2 className="kite-display-sm mt-6 max-w-2xl">{KITE_STUDIO_PAGE.teamTitle}</h2>
        </Reveal>

        <ul className="mt-14 divide-y divide-[var(--kite-line)] border-y border-[var(--kite-line)]">
          {KITE_TEAM.map((person, index) => (
            <li key={person.name}>
              <Reveal delay={index * 0.06}>
                <div className="grid gap-6 py-9 sm:grid-cols-[auto_1fr] sm:gap-10">
                  <span
                    className="kite-avatar grid h-16 w-16 place-items-center text-lg"
                    aria-hidden
                  >
                    {person.initials}
                  </span>
                  <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.03em]">{person.name}</h3>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--kite-acid)]">
                        {person.role}
                      </p>
                    </div>
                    <p className="max-w-xl text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
                      {person.bio}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-[var(--kite-line)] bg-[var(--kite-void-deep)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="kite-eyebrow">{KITE_STUDIO_PAGE.milestonesEyebrow}</p>
          </Reveal>

          {/*
           * The timeline reuses the process rail's thread, drawn horizontally on
           * wide viewports and vertically when the entries stack.
           */}
          <Reveal delay={0.08}>
            <div className="relative mt-12">
              <span
                className="kite-rail absolute inset-x-0 top-[7px] hidden h-0.5 lg:block"
                aria-hidden
              />
              <span
                className="kite-rail-v absolute bottom-0 left-[7px] top-0 w-0.5 lg:hidden"
                aria-hidden
              />

              <ol className="grid gap-10 lg:grid-cols-5 lg:gap-6">
                {KITE_STUDIO_PAGE.milestones.map((milestone) => (
                  <li key={milestone.year} className="relative pl-12 lg:pl-0">
                    <span
                      className="absolute left-0 top-0 h-4 w-4 rounded-full border-2 border-[var(--kite-void-deep)] bg-[var(--kite-acid)] lg:hidden"
                      aria-hidden
                    />
                    <span
                      className="hidden h-4 w-4 rounded-full border-2 border-[var(--kite-void-deep)] bg-[var(--kite-acid)] lg:block"
                      aria-hidden
                    />
                    <p className="kite-figures kite-gradient-text mt-5 text-3xl font-bold tracking-[-0.04em] lg:mt-7">
                      {milestone.year}
                    </p>
                    <p className="mt-3 text-[15px] leading-[1.7] text-[var(--kite-paper-soft)]">
                      {milestone.label}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
