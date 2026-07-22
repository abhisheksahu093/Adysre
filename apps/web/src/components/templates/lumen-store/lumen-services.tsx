'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Reveal } from './lumen-reveal';
import { LumenSectionHeading } from './lumen-section-heading';

/**
 * LUMEN - what is included with an order.
 *
 * A four-column strip of hairline-topped columns rather than boxed cards: on a
 * page whose products are already framed rectangles, a second set of borders
 * would compete with them. The icon carries the only accent colour.
 */
export function LumenServices({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section id="services" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:px-10 sm:py-28">
      <LumenSectionHeading
        eyebrow={services.eyebrow}
        title={services.title}
        subtitle={services.subtitle}
      />

      <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {services.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal key={item.title} delay={0.06 * index}>
              <div className="border-t border-[var(--lum-rule)] pt-6">
                <Icon className="h-5 w-5 text-[var(--lum-accent-deep)]" aria-hidden />
                <h3 className="mt-5 text-[18px] font-medium tracking-[-0.01em]">{item.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[var(--lum-ink-soft)]">
                  {item.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
