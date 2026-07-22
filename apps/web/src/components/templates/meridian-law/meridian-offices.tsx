'use client';

import { MERIDIAN_LABELS, MERIDIAN_OFFICES } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the three offices, on the contact page.
 *
 * Addresses are set as a block of lines rather than a single string, because
 * that is how correspondence is written and how a visitor copies it. Columns
 * are divided by hairlines, never boxed.
 */
export function MeridianOffices() {
  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory)]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-24">
        <Reveal className="text-center">
          <p className="mer-eyebrow">{MERIDIAN_LABELS.officesEyebrow}</p>
          <h2 className="mer-display mt-5 text-3xl sm:text-4xl">{MERIDIAN_LABELS.officesTitle}</h2>
          <div className="mt-6 flex justify-center">
            <span className="mer-hairline" aria-hidden />
          </div>
        </Reveal>

        <div className="mt-14 grid border-t border-[var(--mer-rule)] md:grid-cols-3">
          {MERIDIAN_OFFICES.map((office, index) => (
            <Reveal key={office.city} delay={0.05 * index}>
              <address className="h-full border-b border-[var(--mer-rule)] px-0 py-9 not-italic md:border-l md:border-[var(--mer-rule)] md:px-8">
                <h3 className="mer-display text-xl">{office.city}</h3>
                <span className="mer-hairline mt-4" aria-hidden />

                <p className="mt-5 text-[14px] leading-[1.9] text-[var(--mer-ink-soft)]">
                  {office.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>

                <dl className="mt-6 space-y-3">
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--mer-ink-faint)]">
                      {MERIDIAN_LABELS.telephoneLabel}
                    </dt>
                    <dd className="mt-1 text-[14px]">
                      <a
                        href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}
                        className="transition-colors hover:text-[var(--mer-gold-ink)]"
                      >
                        {office.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.22em] text-[var(--mer-ink-faint)]">
                      {MERIDIAN_LABELS.hoursLabel}
                    </dt>
                    <dd className="mt-1 text-[14px] text-[var(--mer-ink-soft)]">{office.hours}</dd>
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
