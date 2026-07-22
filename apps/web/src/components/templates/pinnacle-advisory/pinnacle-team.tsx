'use client';

import { PINNACLE_LABELS, PINNACLE_PARTNERS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the partners.
 *
 * No photography anywhere in this template, so a portrait is a monogram disc:
 * initials on a radial brand-to-ink gradient. It reads as deliberate rather than
 * as a missing image, and it scales with the card instead of needing an asset
 * per person. The disc grows very slightly when its card lifts, which is the
 * only compound hover in the design.
 *
 * The sector pills matter more than they look: a buyer choosing a consultancy is
 * really choosing a partner who has seen their industry before.
 */
export function PinnacleTeam() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[80rem]">
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PINNACLE_PARTNERS.map((partner, index) => (
            <li key={partner.name} className="h-full">
              <Reveal delay={(index % 3) * 0.07} className="h-full">
                {/* The card class sits on this inner div, not on the Reveal:
                    framer writes an inline transform on the element it animates,
                    which would beat the CSS hover lift and the monogram scale. */}
                <div className="pin-card h-full p-8 sm:p-9">
                  {/* The initials are decorative duplication - the name follows in
                      text - so the disc is hidden from assistive technology. */}
                  <span className="pin-monogram" aria-hidden>
                    {partner.initials}
                  </span>

                  <h2 className="pin-h3 mt-7 text-[1.25rem]">{partner.name}</h2>
                  <p className="mt-2 text-[0.875rem] text-[var(--pin-brand-ink)]">{partner.role}</p>

                  <p className="pin-body mt-5 text-[0.9375rem] text-[var(--pin-text-muted)]">
                    {partner.focus}
                  </p>

                  <p className="pin-eyebrow mt-7">{PINNACLE_LABELS.teamSectors}</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {partner.sectors.map((sector) => (
                      <li key={sector} className="pin-tag">
                        {sector}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
