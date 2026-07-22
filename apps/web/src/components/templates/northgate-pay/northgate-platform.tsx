'use client';

import { ArrowUpRight } from 'lucide-react';
import type { TemplateContent } from '@/data/templates/types';
import { NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the platform grid on the home page.
 *
 * Six large-radius cards on paper, each one a surface of the product. The icon
 * sits in a gradient-hairline square rather than on a coloured chip, so the
 * accent appears once per card and the grid stays quiet at a distance.
 */
export function NorthgatePlatform({ content }: { content: TemplateContent }) {
  const { services } = content;

  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{services.eyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{services.title}</h2>
          <p className="mt-6 max-w-xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {services.subtitle}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={0.05 * (index % 3)}>
                <article className="ngp-card h-full p-8">
                  <span className="grid h-11 w-11 place-items-center rounded-[var(--ngp-radius-xs)] border border-[var(--ngp-accent-line)] bg-[var(--ngp-accent-wash)]">
                    <Icon className="h-5 w-5 text-[var(--ngp-indigo-deep)]" aria-hidden />
                  </span>
                  <h3 className="ngp-display mt-7 text-[21px] leading-tight">{item.title}</h3>
                  <p className="mt-3.5 text-[14px] leading-[1.8] text-[var(--ngp-ink-soft)]">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1} className="mt-12">
          <a
            href={northgateHref('products')}
            className="ngp-mono inline-flex items-center gap-2 text-[13px] tracking-[0.06em] text-[var(--ngp-indigo-deep)] transition-opacity hover:opacity-70"
          >
            {NORTHGATE_LABELS.productsCta}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
