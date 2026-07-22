'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Counter, Reveal } from './atelier-reveal';

/**
 * ATELIER NORD - hero.
 *
 * The template's thesis in one screen: a tiny tracked label alone in a narrow
 * left column, a very large thin headline in a wide right one, and a hairline
 * that draws itself across the full measure once the page settles. The vertical
 * grid behind it is CSS (atelier.css), so the section carries no image weight.
 */
export function AtelierHero({ content }: { content: TemplateContent }) {
  const { hero } = content;

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="atelier-grid absolute inset-0 -z-10" aria-hidden />

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:px-10 sm:pb-36 sm:pt-32">
        <div className="grid gap-8 lg:grid-cols-[1fr_3fr] lg:gap-16">
          <Reveal>
            <p className="atelier-label">{hero.badge}</p>
          </Reveal>

          <div>
            <Reveal delay={0.1}>
              <h1 className="atelier-display text-balance text-[2.75rem] sm:text-6xl lg:text-[5.25rem]">
                {hero.title}
                <br />
                <span className="text-[var(--atelier-ink-faint)]">{hero.titleAccent}</span>
              </h1>
            </Reveal>

            <Reveal delay={0.24} className="mt-12 sm:mt-16">
              <span className="atelier-draw" aria-hidden />
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-10 max-w-2xl text-pretty text-[17px] font-light leading-[1.85] text-[var(--atelier-ink-soft)]">
                {hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.38}>
              <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
                <a
                  href="#why"
                  className="atelier-label w-fit border-b border-[var(--atelier-ink)] pb-2 text-[var(--atelier-ink)] transition-opacity duration-300 hover:opacity-55"
                >
                  {hero.ctaPrimary}
                </a>
                <a
                  href="#contact"
                  className="atelier-label w-fit border-b border-[var(--atelier-rule)] pb-2 transition-colors duration-300 hover:border-[var(--atelier-ink)] hover:text-[var(--atelier-ink)]"
                >
                  {hero.ctaSecondary}
                </a>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.46}>
          <dl className="mt-24 grid grid-cols-1 gap-10 border-t border-[var(--atelier-rule)] pt-10 sm:mt-32 sm:grid-cols-3">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="atelier-display text-5xl sm:text-6xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="atelier-label mt-4">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
