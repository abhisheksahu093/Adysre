'use client';

import { VANTA_MASTHEADS, type VantaPageId } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the opening block for every page except home.
 *
 * One component, four sets of words. It is what stops the inner pages reading
 * as the same page twice: each carries its own eyebrow, its own oversized
 * two-part headline and its own three-figure meta row, and home is excluded at
 * the type level because home opens with the hero instead.
 */
export function VantaMasthead({ page }: { page: Exclude<VantaPageId, 'home'> }) {
  const masthead = VANTA_MASTHEADS[page];

  return (
    // `relative` is Tailwind's, so the `vanta-bloom` pseudo-elements anchor to
    // this section rather than to the page. The CSS never sets position here.
    <section className="vanta-bloom relative overflow-hidden border-b border-[var(--vanta-line)]">
      <div className="vanta-grid absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24">
        <Reveal>
          <p className="vanta-eyebrow">{masthead.eyebrow}</p>
          <span className="vanta-rule mt-5" aria-hidden />
          <h1 className="vanta-display mt-8 max-w-5xl text-balance">
            {masthead.title}
            <br />
            <span className="text-[var(--vanta-muted)]">{masthead.titleAccent}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-pretty text-base leading-[1.8] text-[var(--vanta-muted)] sm:text-lg">
            {masthead.subtitle}
          </p>

          <dl className="mt-12 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-[var(--vanta-radius-sm)] border border-[var(--vanta-line)] bg-[var(--vanta-line)] sm:grid-cols-3">
            {masthead.meta.map((item) => (
              <div key={item.label} className="bg-[var(--vanta-ink)] px-5 py-4">
                <dt className="vanta-label">{item.label}</dt>
                <dd className="vanta-mono mt-2 text-xl text-[var(--vanta-text)]">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
