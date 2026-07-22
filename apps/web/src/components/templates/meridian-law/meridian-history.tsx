'use client';

import { MERIDIAN_LABELS, MERIDIAN_MILESTONES } from '@/data/templates/meridian-law-content';
import { Reveal } from './meridian-reveal';

/**
 * MERIDIAN - the dated history rail on the firm page.
 *
 * A ruled list rather than a timeline graphic: the year sits in the left
 * column in serif and the rule between entries carries the eye, which is how a
 * printed firm history would set it. Entries come from the content module, so
 * a downloaded copy is rewritten in one file.
 */
export function MeridianHistory() {
  return (
    <section className="border-b border-[var(--mer-rule)] bg-[var(--mer-ivory-2)]">
      <div className="mx-auto max-w-4xl px-6 py-24 sm:px-10 sm:py-28">
        <Reveal className="text-center">
          <p className="mer-eyebrow">{MERIDIAN_LABELS.historyEyebrow}</p>
          <h2 className="mer-display mt-5 text-balance text-3xl sm:text-4xl">
            {MERIDIAN_LABELS.historyTitle}
          </h2>
          <div className="mt-6 flex justify-center">
            <span className="mer-hairline" aria-hidden />
          </div>
        </Reveal>

        <ol className="mt-14 border-t border-[var(--mer-rule)]">
          {MERIDIAN_MILESTONES.map((milestone, index) => (
            // The Reveal sits inside the <li>, never around it: an <ol> may only
            // contain list items, and a wrapper div would break that.
            <li key={milestone.year} className="border-b border-[var(--mer-rule)]">
              <Reveal
                delay={0.05 * index}
                className="grid gap-3 py-8 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <p className="mer-year text-3xl leading-none text-[var(--mer-gold-ink)]">{milestone.year}</p>
                <div>
                  <h3 className="mer-display text-xl">{milestone.title}</h3>
                  <p className="mt-2.5 text-[14px] leading-[1.85] text-[var(--mer-ink-soft)]">
                    {milestone.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
