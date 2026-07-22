'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './kite-reveal';

/**
 * KITE - the six disciplines.
 *
 * A plain grid, deliberately: the page has already spent its drama on the hero
 * and the work cards, and six panels competing with those would flatten the
 * whole thing. The only ornament is a gradient rule that the card grows on
 * hover, so the section still belongs to the template.
 */
export function KiteServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section
      id="services"
      className="scroll-mt-24 border-y border-[var(--kite-line)] bg-[var(--kite-void-deep)]"
    >
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="kite-eyebrow">{services.eyebrow}</p>
          <h2 className="kite-display-sm mt-6 max-w-3xl">{services.title}</h2>
          <p className="mt-7 max-w-2xl text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
            {services.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={(index % 3) * 0.08}>
                <div className="kite-panel group h-full px-8 py-9">
                  <span className="kite-pill-hot grid h-12 w-12 place-items-center rounded-2xl">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-7 text-xl font-bold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-[1.75] text-[var(--kite-paper-soft)]">
                    {item.body}
                  </p>
                  {/*
                   * Decorative rule that draws out on hover. Width is animated
                   * with a utility rather than scoped CSS so nothing here can
                   * collide with a positioning class.
                   */}
                  <span
                    className="mt-8 block h-0.5 w-8 bg-[var(--kite-acid)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20"
                    aria-hidden
                  />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
