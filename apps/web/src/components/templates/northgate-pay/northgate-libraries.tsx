'use client';

import { NORTHGATE_LABELS, NORTHGATE_LIBRARIES } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - client libraries and webhook events.
 *
 * Two related blocks kept in one section because they answer the same question:
 * what you install, and what arrives afterwards. Install commands are set in a
 * mono line with a gradient hairline above, which is the closest this design
 * comes to a terminal without pretending to be one.
 */
export function NorthgateLibraries() {
  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{NORTHGATE_LABELS.librariesEyebrow}</p>
          <h2 className="ngp-display ngp-display-md mt-6">{NORTHGATE_LABELS.librariesTitle}</h2>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {NORTHGATE_LABELS.librariesSubtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {NORTHGATE_LIBRARIES.map((library, index) => (
            <Reveal key={library.language} delay={0.04 * (index % 3)}>
              <article className="ngp-card h-full p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-[15px]">{library.language}</h3>
                  <p className="ngp-mono text-[11.5px] text-[var(--ngp-ink-faint)]">
                    <span className="sr-only">{`${NORTHGATE_LABELS.librariesVersion} `}</span>
                    {library.version}
                  </p>
                </div>
                <span className="ngp-rule-grad mt-5 w-10" aria-hidden />
                {/* The command scrolls inside the card rather than wrapping:
                    a broken install line is worse than a scrollable one. */}
                <div className="mt-5 overflow-x-auto">
                  <code className="ngp-mono whitespace-pre text-[12.5px] text-[var(--ngp-indigo-deep)]">
                    {library.install}
                  </code>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <div>
              <p className="ngp-eyebrow">{NORTHGATE_LABELS.webhooksEyebrow}</p>
              <h2 className="ngp-display ngp-display-md mt-6">{NORTHGATE_LABELS.webhooksTitle}</h2>
              <p className="mt-5 max-w-lg text-pretty text-[15px] leading-[1.8] text-[var(--ngp-ink-soft)]">
                {NORTHGATE_LABELS.webhooksSubtitle}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {NORTHGATE_LABELS.webhookEvents.map((event) => (
                <li
                  key={event}
                  className="ngp-mono rounded-[var(--ngp-radius-xs)] border border-[var(--ngp-rule)] bg-[var(--ngp-bg)] px-4 py-3 text-[12.5px] text-[var(--ngp-ink-soft)]"
                >
                  {event}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
