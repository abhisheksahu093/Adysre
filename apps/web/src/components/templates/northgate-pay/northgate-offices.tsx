'use client';

import { NORTHGATE_LABELS, NORTHGATE_OFFICES } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the three offices, on the contact page.
 *
 * Addresses are stored as lines rather than one string, because that is how
 * correspondence is written and how a visitor copies it. The telephone number
 * is a real `tel:` link with the formatting stripped from the href only.
 */
export function NorthgateOffices() {
  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{NORTHGATE_LABELS.officesEyebrow}</p>
          <h2 className="ngp-display ngp-display-md mt-6">{NORTHGATE_LABELS.officesTitle}</h2>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {NORTHGATE_OFFICES.map((office, index) => (
            <Reveal key={office.city} delay={0.05 * index}>
              <address className="ngp-card h-full p-8 not-italic">
                <h3 className="ngp-display text-[20px]">{office.city}</h3>
                <span className="ngp-rule-grad mt-5 w-10" aria-hidden />

                <p className="mt-6 text-[14px] leading-[1.9] text-[var(--ngp-ink-soft)]">
                  {office.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <dl className="mt-7 space-y-4 border-t border-[var(--ngp-rule)] pt-6">
                  <div>
                    <dt className="text-[11.5px] text-[var(--ngp-ink-faint)]">
                      {NORTHGATE_LABELS.telephoneLabel}
                    </dt>
                    <dd className="ngp-mono mt-1.5 text-[14px]">
                      <a
                        href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                        className="transition-colors hover:text-[var(--ngp-indigo-deep)]"
                      >
                        {office.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[11.5px] text-[var(--ngp-ink-faint)]">
                      {NORTHGATE_LABELS.hoursLabel}
                    </dt>
                    <dd className="mt-1.5 text-[13.5px] text-[var(--ngp-ink-soft)]">
                      {office.hours}
                    </dd>
                  </div>
                </dl>
              </address>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
