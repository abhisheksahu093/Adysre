'use client';

import { MERIDIAN_LABELS, MERIDIAN_PRACTICES } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the practices page, at depth.
 *
 * Each group gets a full ruled band: a serif numeral and name on the left, the
 * summary, its representative matters and the partner who answers for it on the
 * right. This is the page a general counsel reads before calling, so it favours
 * detail over ornament - matters are listed with figures, not adjectives.
 */
export function MeridianPracticeList() {
  return (
    <section className="bg-[var(--mer-ivory)]">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-10 sm:py-24">
        <ol className="border-t border-[var(--mer-rule)]">
          {MERIDIAN_PRACTICES.map((practice, index) => (
            // The Reveal sits inside the <li>: an <ol> may only contain items.
            <li key={practice.name} className="border-b border-[var(--mer-rule)]">
              <Reveal delay={0.04 * index} className="grid gap-8 py-12 md:grid-cols-[14rem_1fr]">
                <div>
                  <p className="mer-year text-3xl leading-none text-[var(--mer-gold-ink)]" aria-hidden>
                    {String(index + 1).padStart(2, '0')}
                  </p>
                  <h2 className="mer-display mt-4 text-2xl leading-snug">{practice.name}</h2>
                  <span className="mer-hairline mt-5" aria-hidden />
                </div>

                <div>
                  <p className="text-[15px] leading-[1.9] text-[var(--mer-ink-soft)]">
                    {practice.summary}
                  </p>

                  <p className="mer-eyebrow mt-8">{MERIDIAN_LABELS.practicesEyebrow}</p>
                  <ul className="mt-4 border-t border-[var(--mer-rule)]">
                    {practice.matters.map((matter) => (
                      <li
                        key={matter}
                        className="border-b border-[var(--mer-rule)] py-3.5 text-[14px] leading-[1.8] text-[var(--mer-ink-soft)]"
                      >
                        {matter}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-6 flex flex-wrap items-baseline gap-x-3">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-[var(--mer-ink-faint)]">
                      {MERIDIAN_LABELS.practicesLead}
                    </dt>
                    <dd className="mer-display text-[15px]">{practice.lead}</dd>
                  </dl>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
