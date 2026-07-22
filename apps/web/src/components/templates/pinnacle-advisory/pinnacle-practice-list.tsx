'use client';

import { ArrowUpRight } from 'lucide-react';
import { PINNACLE_LABELS, PINNACLE_PRACTICES } from '@/data/templates/pinnacle-advisory-content';
import { Reveal } from './pinnacle-reveal';

/**
 * PINNACLE - the expertise page, at depth.
 *
 * The home page shows six short cards; this shows the same six practices as
 * full entries, because the visitor who reached this page is choosing a firm
 * rather than browsing. Each entry answers the three questions a buyer actually
 * asks: what do I get, how long does it take, and who is responsible.
 *
 * The oversized index in the left column is the only ornament, and it is set in
 * the same figure treatment as the counters so the pages share one voice.
 */
export function PinnaclePracticeList() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[80rem]">
        <ol className="border-t border-[var(--pin-line)]">
          {PINNACLE_PRACTICES.map((practice, index) => (
            <li key={practice.index} className="border-b border-[var(--pin-line)]">
              <Reveal
                delay={(index % 2) * 0.07}
                className="grid gap-8 py-12 lg:grid-cols-[auto_1fr_1fr] lg:gap-14 lg:py-16"
              >
                <span
                  aria-hidden
                  className="pin-figure-num text-[3rem] text-[var(--pin-line-strong)] lg:text-[4rem]"
                >
                  {practice.index}
                </span>

                <div>
                  <h2 className="pin-h3 text-[1.375rem] sm:text-[1.625rem]">{practice.name}</h2>
                  <p className="pin-body mt-5 text-[0.9375rem] text-[var(--pin-text-muted)]">
                    {practice.summary}
                  </p>

                  <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-5">
                    <div>
                      <dt className="pin-eyebrow">{PINNACLE_LABELS.practiceDuration}</dt>
                      <dd className="mt-2 text-[0.9375rem] font-[550]">{practice.duration}</dd>
                    </div>
                    <div>
                      <dt className="pin-eyebrow">{PINNACLE_LABELS.practiceLead}</dt>
                      <dd className="mt-2 text-[0.9375rem] font-[550]">{practice.lead}</dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-[var(--pin-r-md)] border border-[var(--pin-line)] bg-[var(--pin-sand-2)] p-7 sm:p-8">
                  <p className="pin-eyebrow">{PINNACLE_LABELS.practiceDeliverables}</p>
                  <ul className="mt-5 space-y-4">
                    {practice.deliverables.map((deliverable) => (
                      <li key={deliverable} className="flex items-start gap-3">
                        <ArrowUpRight
                          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--pin-brand-ink)]"
                          aria-hidden
                        />
                        <span className="text-[0.9375rem] leading-[1.55] text-[var(--pin-text-soft)]">
                          {deliverable}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
