'use client';

import { MERIDIAN_LABELS, MERIDIAN_TEAM } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the partners, on the firm page.
 *
 * No photography: each partner is represented by serif initials inside a ruled
 * square (`.mer-monogram`), which reads as formal rather than as a missing
 * image and keeps the download free of binary assets. Bar admissions are listed
 * because that is the credential this audience checks first.
 */
export function MeridianTeam() {
  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory)]">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mer-eyebrow">{MERIDIAN_LABELS.teamEyebrow}</p>
          <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">
            {MERIDIAN_LABELS.teamTitle}
          </h2>
          <div className="mt-6 flex justify-center">
            <span className="mer-hairline" aria-hidden />
          </div>
          <p className="mt-6 text-[15px] leading-[1.85] text-[var(--mer-ink-soft)]">
            {MERIDIAN_LABELS.teamSubtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid border-t border-[var(--mer-rule)] sm:grid-cols-2">
          {MERIDIAN_TEAM.map((person, index) => (
            <Reveal key={person.name} delay={0.05 * index}>
              <article className="h-full border-b border-[var(--mer-rule)] py-10 sm:px-8">
                <div className="flex items-start gap-6">
                  <span
                    className="mer-monogram grid h-16 w-16 shrink-0 place-items-center text-xl"
                    aria-hidden
                  >
                    {person.initials}
                  </span>
                  <div>
                    <h3 className="mer-display text-xl">{person.name}</h3>
                    <p className="mt-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--mer-ink-faint)]">
                      {person.role}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-[14px] leading-[1.85] text-[var(--mer-ink-soft)]">
                  {person.focus}
                </p>

                <p className="mer-eyebrow mt-7">{MERIDIAN_LABELS.admissionsLabel}</p>
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-2">
                  {person.admissions.map((admission) => (
                    <li
                      key={admission}
                      className="border border-[var(--mer-rule)] px-3 py-1.5 text-[11px] tracking-[0.08em] text-[var(--mer-ink-soft)]"
                    >
                      {admission}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
