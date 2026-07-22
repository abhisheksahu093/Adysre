'use client';

import { KITE_PROCESS, KITE_SERVICES_PAGE } from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';

/**
 * KITE - the five-step process rail.
 *
 * The signature of the services page: a thread that draws itself through the
 * steps as the section enters. The line is a pseudo-element on `.kite-rail`
 * (horizontal) and `.kite-rail-v` (stacked), grown from zero by the
 * `kite-revealed` class that `Reveal` adds at the moment it animates - so the
 * drawing is tied to the scroll position rather than to mount.
 *
 * Both rails are placed with Tailwind's `absolute`; kite.css sets `position`
 * only on the pseudo-elements, never on the classes themselves, because a scoped
 * class selector would outrank the utility and break the placement.
 */
export function KiteProcess() {
  return (
    <section id="process" className="scroll-mt-24 border-t border-[var(--kite-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="kite-eyebrow">{KITE_SERVICES_PAGE.processEyebrow}</p>
          <h2 className="kite-display-sm mt-6 max-w-2xl">{KITE_SERVICES_PAGE.processTitle}</h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="relative mt-16">
            {/* Horizontal thread, desktop. */}
            <span
              className="kite-rail absolute inset-x-0 top-[7px] hidden h-0.5 lg:block"
              aria-hidden
            />
            {/* Vertical thread, stacked layout. */}
            <span
              className="kite-rail-v absolute bottom-0 left-[7px] top-0 w-0.5 lg:hidden"
              aria-hidden
            />

            <ol className="grid gap-12 lg:grid-cols-5 lg:gap-8">
              {KITE_PROCESS.map((step) => (
                <li key={step.number} className="relative pl-12 lg:pl-0">
                  <span
                    className="absolute left-0 top-0 h-4 w-4 rounded-full border-2 border-[var(--kite-void)] bg-[var(--kite-acid)] lg:hidden"
                    aria-hidden
                  />
                  <span
                    className="hidden h-4 w-4 rounded-full border-2 border-[var(--kite-void)] bg-[var(--kite-acid)] lg:block"
                    aria-hidden
                  />

                  <p className="kite-numeral mt-6 lg:mt-8" aria-hidden>
                    {step.number}
                  </p>
                  <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">{step.title}</h3>
                  <p className="kite-figures mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--kite-paper-faint)]">
                    {step.duration}
                  </p>
                  <p className="mt-5 text-[15px] leading-[1.75] text-[var(--kite-paper-soft)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
