'use client';

import { PINNACLE_LABELS, PINNACLE_PROCESS } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the engagement model, on a numbered rail.
 *
 * The rail is a single pseudo-element on the list (`.pin-rail::before`), running
 * vertically beside the phases on small screens and horizontally through the
 * nodes from `lg`. One line rather than three-per-item, because a connector
 * drawn between siblings breaks the moment a phase wraps to two lines.
 *
 * Each node carries a ring in the page's own background colour, so the rail
 * appears to pass behind it without either element needing a z-index.
 */
export function PinnacleProcess() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[80rem]">
        <Reveal>
          <p className="pin-eyebrow">{PINNACLE_LABELS.processEyebrow}</p>
          <h2 className="pin-h2 mt-6">{PINNACLE_LABELS.processTitle}</h2>
          <p className="pin-body mt-6 text-[var(--pin-text-muted)]">{PINNACLE_LABELS.processSubtitle}</p>
        </Reveal>

        <ol className="pin-rail relative mt-16 grid gap-12 lg:grid-cols-4 lg:gap-8">
          {PINNACLE_PROCESS.map((phase, index) => (
            <li key={phase.step} className="relative pl-14 lg:pt-16 lg:pl-0">
              {/* Outside the Reveal on purpose: framer sets a transform on that
                  wrapper, and a transformed ancestor would become this node's
                  containing block and pull it off the rail. */}
              <span aria-hidden className="pin-node absolute top-0 left-0">
                {phase.step}
              </span>

              <Reveal delay={index * 0.09}>
                <div>
                  <span className="pin-tag">{phase.duration}</span>
                  <h3 className="pin-h3 mt-5">{phase.title}</h3>
                  <p className="pin-body mt-4 text-[0.9375rem] text-[var(--pin-text-muted)]">{phase.body}</p>

                  <div className="mt-6 rounded-[var(--pin-r-sm)] border border-[var(--pin-line)] bg-[var(--pin-brand-wash)] p-5">
                    <p className="pin-eyebrow">{PINNACLE_LABELS.processDeliverable}</p>
                    <p className="mt-2.5 text-[0.9375rem] leading-[1.5] font-[550] text-[var(--pin-text)]">
                      {phase.deliverable}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
