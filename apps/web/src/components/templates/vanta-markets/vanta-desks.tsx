'use client';

import { VANTA_CONTACT_PAGE } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the routed desks on the contact page.
 *
 * Four addresses rather than one, because "contact us" on a broker is four
 * different conversations with four different response times, and sending an
 * API question to the trading desk wastes both. Sits above the form so the
 * routing decision comes before the typing.
 */
export function VantaDesks() {
  return (
    <section className="border-b border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <p className="vanta-eyebrow">{VANTA_CONTACT_PAGE.deskEyebrow}</p>
          <span className="vanta-rule mt-5" aria-hidden />
          <h2 className="vanta-display-sm mt-7 max-w-2xl text-balance">
            {VANTA_CONTACT_PAGE.deskTitle}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--vanta-radius)] border border-[var(--vanta-line)] bg-[var(--vanta-line)] sm:grid-cols-2 lg:grid-cols-4">
          {VANTA_CONTACT_PAGE.desks.map((desk, index) => (
            <Reveal key={desk.name} delay={index * 0.05} className="bg-[var(--vanta-ink-deep)]">
              <article className="h-full p-7">
                <h3 className="text-base font-semibold tracking-[-0.01em]">{desk.name}</h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-[var(--vanta-muted)]">
                  {desk.detail}
                </p>
                <p className="vanta-mono mt-6 border-t border-[var(--vanta-line)] pt-4 text-[13px] text-[var(--vanta-up)]">
                  {desk.value}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
