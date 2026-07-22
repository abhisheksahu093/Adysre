'use client';

import { PINNACLE_LABELS, PINNACLE_OFFICES } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the three offices.
 *
 * Addresses are set as an `<address>` element rather than a paragraph, which is
 * what it is for and what a screen reader benefits from. The telephone number is
 * a real `tel:` link on every card, because on a phone that is the only thing
 * anyone does with this section.
 */
export function PinnacleOffices() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[80rem]">
        <Reveal>
          <p className="pin-eyebrow">{PINNACLE_LABELS.officesEyebrow}</p>
          <h2 className="pin-h2 mt-6">{PINNACLE_LABELS.officesTitle}</h2>
        </Reveal>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PINNACLE_OFFICES.map((office, index) => (
            <li key={office.city} className="h-full">
              <Reveal delay={index * 0.08} className="h-full">
                {/* The card class sits on this inner div, not on the Reveal:
                    framer writes an inline transform on the element it animates,
                    which would beat the CSS hover lift. */}
                <div className="pin-card h-full p-8 sm:p-9">
                  <h3 className="pin-h3 text-[1.25rem]">{office.city}</h3>

                  <address className="mt-5 text-[0.9375rem] leading-[1.7] text-[var(--pin-text-soft)] not-italic">
                    {office.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>

                  <dl className="mt-7 border-t border-[var(--pin-line)] pt-6">
                    <dt className="pin-eyebrow">{PINNACLE_LABELS.telephoneLabel}</dt>
                    <dd className="mt-2">
                      <a
                        href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                        className="text-[0.9375rem] font-[550] transition-colors duration-300 hover:text-[var(--pin-brand-ink)]"
                      >
                        {office.phone}
                      </a>
                    </dd>

                    <dt className="pin-eyebrow mt-5">{PINNACLE_LABELS.hoursLabel}</dt>
                    <dd className="mt-2 text-[0.9375rem] text-[var(--pin-text-muted)]">
                      {office.hours}
                    </dd>
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
