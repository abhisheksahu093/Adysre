'use client';

import type { TemplateContent } from '@/data/templates/types';
import { CADENCE_RINGS } from '@/data/templates/cadence-academy-content';
import { CadenceRing } from './cadence-ring';
import { Reveal } from './cadence-reveal';

/**
 * CADENCE - the one inverted section.
 *
 * Deep aubergine against a cream document, used exactly once so it reads as the
 * page's emphasis rather than a second theme. It carries the three published
 * completion figures as animated rings, then the four "why us" cards.
 *
 * Each ring sits inside its own `Reveal`: the CSS fill hangs off the
 * `cad-revealed` class that `Reveal` adds, so a ring outside one would never
 * draw. Lime finally works as type here, which is why the eyebrow switches.
 */
export function CadenceProof({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section className="px-3 py-6 sm:px-4 sm:py-10">
      <div className="rounded-[var(--cad-radius-xl)] bg-[var(--cad-ink)] text-[var(--cad-on-ink)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-12 sm:py-28">
          <Reveal className="max-w-2xl">
            <p className="cad-eyebrow-inverse">{why.eyebrow}</p>
            <h2 className="cad-display-sm mt-6 text-balance">{why.title}</h2>
            <p className="mt-6 text-[17px] leading-[1.75] text-[var(--cad-on-ink-soft)]">
              {why.subtitle}
            </p>
          </Reveal>

          <ul className="mt-16 grid gap-12 sm:grid-cols-3">
            {CADENCE_RINGS.map((ring, index) => (
              <li key={ring.label}>
                <Reveal delay={0.12 * index} className="flex flex-col items-center text-center">
                  <CadenceRing value={ring.value} tone="inverse" label={ring.label} />
                  <p className="mt-6 text-lg font-bold tracking-[-0.01em]">{ring.label}</p>
                  <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-[var(--cad-on-ink-faint)]">
                    {ring.caption}
                  </p>
                </Reveal>
              </li>
            ))}
          </ul>

          <ul className="mt-20 grid gap-5 sm:grid-cols-2">
            {why.items.map((item, index) => (
              <li key={item.title}>
                <Reveal delay={0.06 * index} className="h-full">
                  <div className="cad-card-inverse flex h-full gap-5 p-8">
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-[var(--cad-radius-pill)] bg-[var(--cad-lime)]"
                      aria-hidden
                    >
                      <item.icon className="h-5 w-5 text-[var(--cad-ink)]" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-[var(--cad-on-ink-soft)]">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
