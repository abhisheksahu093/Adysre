'use client';

import { useLumiereSettings } from './lumiere-settings';
import { LumiereSectionHeading } from './lumiere-section-heading';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the people on the floor.
 *
 * Portraits are the therapist's initials inside an arch rather than photographs,
 * so the template ships no binary assets and the layout does not shift when a
 * salon drops real images in.
 *
 * The last entry in `data.stylists` is the "first available" option the
 * booking form needs, which is not a person - it is filtered out here by its
 * `years`, so the data stays one list and this section never shows a therapist
 * with no experience.
 */
export function LumiereTeam() {
  const { data } = useLumiereSettings();
  const { team } = data.salon;
  const people = data.stylists.filter((stylist) => stylist.years > 0);

  return (
    <section id="team" className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
      <LumiereSectionHeading
        eyebrow={team.eyebrow}
        title={team.title}
        subtitle={team.subtitle}
        align="center"
      />

      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {people.map((stylist, index) => (
          <Reveal key={stylist.id} delay={0.05 * (index % 4)}>
            <article className="text-center">
              <p aria-hidden className="lumi-portrait aspect-[3/4] w-full">
                {stylist.initials}
              </p>
              <h3 className="lumi-subtitle mt-6">{stylist.name}</h3>
              <p className="lumi-label mt-2">{stylist.role}</p>
              <p className="mt-4 text-[14px] leading-[1.75] text-[var(--lumi-ink-soft)]">
                {stylist.specialism}
              </p>
              <p className="lumi-num mt-4 text-[13px] text-[var(--lumi-accent-deep)]">
                {stylist.years} {team.yearsLabel}
              </p>
              <p className="mt-1 text-[13px] text-[var(--lumi-ink-faint)]">
                {team.daysLabel}: {stylist.days}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
