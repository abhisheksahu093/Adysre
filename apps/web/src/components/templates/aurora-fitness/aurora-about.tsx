'use client';

import type { TemplateContent } from '@/data/templates/types';
import { Counter, Reveal } from './aurora-reveal';

/**
 * AURORA - the floor. Story on the left, and on the right a stack of hatched
 * crates standing in for the room: bars drawn as divs, a rack silhouette built
 * from borders. Nothing here is an image, so the download stays asset-free.
 *
 * The panel echoes the hero's first statistic rather than inventing a number -
 * content owns every figure the page shows.
 */
export function AuroraAbout({ content }: { content: TemplateContent }) {
  const { about } = content;
  const headline = content.hero.stats[0];

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
      <div className="grid items-start gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="aurora-tag text-[10px] text-[var(--aurora-acid)]">{about.eyebrow}</p>
            <h2 className="aurora-display mt-5 max-w-2xl text-5xl sm:text-6xl md:text-7xl">{about.title}</h2>
          </Reveal>

          {about.body.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.06 * (index + 1)}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[var(--aurora-muted)]">
                {paragraph}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.22}>
            <ul className="mt-10 border-t-2 border-[var(--aurora-line)]">
              {about.points.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-4 border-b-2 border-[var(--aurora-line)] py-4"
                >
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rotate-45 bg-[var(--aurora-acid)]" aria-hidden />
                  <span className="text-[15px] leading-relaxed text-[var(--aurora-muted)]">{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div className="aurora-crate relative p-6 sm:p-8" aria-hidden>
            <div className="aurora-hatch-acid absolute inset-0" />

            <div className="relative">
              {headline ? (
                <>
                  <p className="aurora-display text-[7rem] leading-[0.8] text-[var(--aurora-acid)] sm:text-[9rem]">
                    <Counter value={headline.value} suffix={headline.suffix} />
                  </p>
                  <p className="aurora-tag mt-4 text-[11px] text-[var(--aurora-faint)]">{headline.label}</p>
                </>
              ) : null}

              {/*
               * A loaded bar: two collars, four plates, drawn with borders. It
               * reads as equipment at a glance and costs nothing to ship.
               */}
              <div className="mt-10 flex items-center justify-center gap-1">
                <span className="h-14 w-3 bg-[var(--aurora-line-strong)]" />
                <span className="h-20 w-4 bg-[var(--aurora-text)]" />
                <span className="h-24 w-5 bg-[var(--aurora-acid)]" />
                <span className="h-1.5 w-16 bg-[var(--aurora-line-strong)] sm:w-24" />
                <span className="h-24 w-5 bg-[var(--aurora-acid)]" />
                <span className="h-20 w-4 bg-[var(--aurora-text)]" />
                <span className="h-14 w-3 bg-[var(--aurora-line-strong)]" />
              </div>

              <div className="mt-10 grid grid-cols-6 gap-1.5">
                {/* Six platforms in plan view; the third is the one in use. */}
                {[0, 1, 2, 3, 4, 5].map((slot) => (
                  <span
                    key={slot}
                    className={`h-10 border-2 ${
                      slot === 2
                        ? 'border-[var(--aurora-acid)] bg-[var(--aurora-acid)]/20'
                        : 'border-[var(--aurora-line-strong)]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
