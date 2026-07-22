'use client';

import type { TemplateContent } from '@/data/templates/types';
import { MaskReveal, Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - selected work.
 *
 * The buildings are drawn, not photographed: each block is a CSS gradient
 * composition (`atelier-plate-*` in atelier.css) abstracting the building it
 * captions, so the template ships with no binary asset and no broken image on a
 * cold download. They are wiped in from the bottom edge, one after another.
 *
 * The second column is pushed down on wide screens - the asymmetry is what
 * stops four rectangles from reading as a product grid.
 */
export function AtelierWhy({ content }: { content: TemplateContent }) {
  const { why } = content;

  return (
    <section id="why" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-28 sm:px-10 sm:py-40">
      <div className="grid gap-10 lg:grid-cols-[1fr_3fr] lg:gap-16">
        <Reveal>
          <p className="atelier-label">{why.eyebrow}</p>
          <span className="atelier-draw mt-6 max-w-24" aria-hidden />
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="atelier-heading text-balance text-3xl sm:text-5xl">{why.title}</h2>
          <p className="mt-8 max-w-xl text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)]">
            {why.subtitle}
          </p>
        </Reveal>
      </div>

      <div className="mt-20 grid gap-16 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-24">
        {why.items.map((item, index) => {
          const Icon = item.icon;
          return (
            <figure key={item.title} className={index % 2 === 1 ? 'sm:mt-24' : ''}>
              <MaskReveal delay={0.05 * index}>
                <div className={`atelier-plate atelier-plate-${index % 4} aspect-[4/3] w-full`} aria-hidden />
              </MaskReveal>

              <Reveal delay={0.1 + 0.05 * index}>
                <figcaption className="mt-6 border-t border-[var(--atelier-rule)] pt-5">
                  <div className="flex items-baseline gap-5">
                    <span className="atelier-label shrink-0">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="atelier-heading text-xl sm:text-2xl">{item.title}</h3>
                    <Icon
                      className="ml-auto h-4 w-4 shrink-0 self-center text-[var(--atelier-ink-faint)]"
                      strokeWidth={1}
                      aria-hidden
                    />
                  </div>
                  <p className="mt-4 max-w-md text-[15px] font-light leading-[1.9] text-[var(--atelier-ink-soft)]">
                    {item.body}
                  </p>
                </figcaption>
              </Reveal>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
