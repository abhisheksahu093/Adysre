'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './aurora-reveal';

/**
 * AURORA - the class grid. Crates that scale up and take an acid edge on hover
 * (transform and colour only, so the effect stays on the compositor). The index
 * is decorative and derived from position rather than stored in content.
 */
export function AuroraServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section id="services" className="scroll-mt-24 border-y-2 border-[var(--aurora-line)]">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="aurora-tag text-[10px] text-[var(--aurora-acid)]">{services.eyebrow}</p>
          <h2 className="aurora-display mt-5 text-5xl sm:text-6xl md:text-7xl">{services.title}</h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--aurora-muted)]">
            {services.subtitle}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.05 * index}>
                <article className="aurora-crate aurora-lift group h-full p-6 sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center border-2 border-[var(--aurora-line-strong)] transition-colors group-hover:border-[var(--aurora-acid)] group-hover:bg-[var(--aurora-acid)]">
                      <Icon
                        className="h-5 w-5 text-[var(--aurora-acid)] transition-colors group-hover:text-[var(--aurora-on-acid)]"
                        aria-hidden
                      />
                    </span>
                    <span className="aurora-display text-4xl text-[var(--aurora-line-strong)]" aria-hidden>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="aurora-display mt-7 text-3xl">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--aurora-muted)]">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
