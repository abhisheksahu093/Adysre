'use client';

import type { PinnaclePageHead } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the masthead each dedicated page opens with.
 *
 * Home has the display hero; the other four open on this instead. Shared rather
 * than repeated so all four start at exactly the same height and rhythm, which
 * is what makes moving between pages feel like one document rather than four.
 *
 * The two figures beside the intro are the reason this is not just a title: a
 * masthead that states something is worth the vertical space it takes.
 */
export function PinnaclePageHead({ head }: { head: PinnaclePageHead }) {
  return (
    <section className="px-4 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-14">
      <div className="mx-auto max-w-[80rem]">
        <Reveal>
          <p className="pin-eyebrow">{head.eyebrow}</p>
          <h1 className="pin-h1 mt-7">{head.title}</h1>
        </Reveal>

        <div className="mt-10 grid gap-10 border-t border-[var(--pin-line)] pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <Reveal delay={0.08}>
            <p className="pin-lead text-[var(--pin-text-soft)]">{head.intro}</p>
          </Reveal>

          <Reveal delay={0.16}>
            <dl className="flex gap-12 lg:justify-end">
              {head.facts.map((fact) => (
                <div key={fact.label}>
                  <dd className="pin-figure-num text-[2.25rem] text-[var(--pin-brand)]">
                    {fact.value}
                  </dd>
                  <dt className="mt-3 text-[0.8125rem] text-[var(--pin-text-faint)]">
                    {fact.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
