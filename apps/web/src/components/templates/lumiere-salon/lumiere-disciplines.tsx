'use client';

import type { TemplateContent } from '@/data/templates/types';
import { LumiereSectionHeading } from './lumiere-section-heading';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the four disciplines.
 *
 * The shared `services` block from `TemplateContent`, rendered as four soft
 * panels with the Lucide icon sitting in a champagne disc. It is a summary: the
 * priced treatment menu is its own page, and this section links there through the
 * page around it rather than repeating the prices.
 */
export function LumiereDisciplines({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section id="services" className="lumi-band py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <LumiereSectionHeading
          eyebrow={services.eyebrow}
          title={services.title}
          subtitle={services.subtitle}
          align="center"
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.items.map((item, index) => (
            <Reveal key={item.title} delay={0.06 * (index % 2)}>
              <article className="lumi-panel h-full px-9 py-10">
                <span
                  aria-hidden
                  className="grid h-14 w-14 place-items-center rounded-full bg-[var(--lumi-accent-soft)]"
                >
                  <item.icon className="h-6 w-6 text-[var(--lumi-accent-deep)]" />
                </span>
                <h3 className="lumi-subtitle mt-7">{item.title}</h3>
                <p className="mt-4 text-[15px] leading-[1.85] text-[var(--lumi-ink-soft)]">
                  {item.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
