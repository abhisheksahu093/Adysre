'use client';

import { PINNACLE_CASES, PINNACLE_LABELS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - selected engagements.
 *
 * The outcome figures are set larger than the client description, because the
 * number is the claim and the story is the evidence for it. Clients are
 * described rather than named - which is both true of this kind of work and a
 * better read than a wall of anonymised logos.
 */
export function PinnacleCases() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <Reveal>
          <p className="pin-eyebrow">{PINNACLE_LABELS.casesEyebrow}</p>
          <h2 className="pin-h2 mt-6">{PINNACLE_LABELS.casesTitle}</h2>
          <p className="pin-body mt-6 text-[var(--pin-text-muted)]">
            {PINNACLE_LABELS.casesSubtitle}
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 lg:grid-cols-2">
          {PINNACLE_CASES.map((item, index) => (
            <li key={item.client} className="h-full">
              <Reveal delay={(index % 2) * 0.08} className="h-full">
                {/* The card class sits on this inner div, not on the Reveal:
                    framer writes an inline transform on the element it animates,
                    which would beat the CSS hover lift. */}
                <div className="pin-card flex h-full flex-col p-8 sm:p-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="pin-tag pin-tag-accent">{item.sector}</span>
                    <span className="pin-tag">{item.duration}</span>
                  </div>

                  <h3 className="pin-h3 mt-7">{item.client}</h3>

                  <p className="pin-eyebrow mt-7">{PINNACLE_LABELS.casesChallenge}</p>
                  <p className="pin-body mt-3 text-[0.9375rem] text-[var(--pin-text-muted)]">
                    {item.challenge}
                  </p>

                  {/* `mt-auto` pins the outcomes to the foot of the card, so two
                      cards of unequal prose still line their figures up. */}
                  <dl className="mt-auto grid gap-6 border-t border-[var(--pin-line)] pt-8 sm:grid-cols-2">
                    {item.outcome.map((figure) => (
                      <div key={figure.label}>
                        <dd className="pin-figure-num text-[2rem] text-[var(--pin-brand)]">
                          {figure.value}
                        </dd>
                        <dt className="mt-3 text-[0.8125rem] leading-[1.45] text-[var(--pin-text-faint)]">
                          {figure.label}
                        </dt>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
