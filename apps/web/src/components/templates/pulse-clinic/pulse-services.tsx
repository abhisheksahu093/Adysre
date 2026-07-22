'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './pulse-reveal';

/**
 * PULSE - treatments. A three-column card grid on a pale wash. Hover lifts the
 * card by 4px (transform and shadow only, so it stays on the compositor) and
 * the whole effect stands down under reduced motion via pulse.css.
 */
export function PulseServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section id="services" className="pulse-wash scroll-mt-24 border-y border-[var(--pulse-line)]">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="pulse-eyebrow">{services.eyebrow}</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-4xl">
            {services.title}
          </h2>
          <p className="mt-5 text-[16px] leading-[1.8] text-[var(--pulse-ink-soft)]">{services.subtitle}</p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.05 * index}>
                <article className="pulse-card pulse-card-lift h-full p-7 sm:p-8">
                  <span className="pulse-tile grid h-12 w-12 place-items-center">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-lg font-semibold tracking-[-0.01em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-[1.75] text-[var(--pulse-ink-soft)]">{item.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
