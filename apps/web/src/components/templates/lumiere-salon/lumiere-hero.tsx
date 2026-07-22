'use client';

import { lumiereHref } from '@/data/templates/lumiere-salon-content';
import { useLumiereSettings } from './lumiere-settings';
import type { TemplateContent } from '@/data/templates/types';
import { Counter, Reveal } from './lumiere-reveal';
import { LumiereHairline } from './lumiere-hairline';

/**
 * LUMIERE - the home page hero.
 *
 * Centred rather than split, because the wordmark and the display serif are the
 * brand and a two-column hero would halve them. The drifting petal sits behind
 * the type in the background layer; it is decoration, so it is `aria-hidden` and
 * it stops entirely under reduced motion (see lumiere.css).
 *
 * The petal and its arch are positioned with Tailwind utilities on purpose - the
 * stylesheet must not set `position` on anything the markup places, or a scoped
 * selector would outrank `.absolute` and collapse the layer.
 */
export function LumiereHero({ content }: { content: TemplateContent }) {
  const { data } = useLumiereSettings();
  const { hero } = content;

  return (
    <section className="relative overflow-hidden">
      {/* Background layer: one large drifting petal and a static counter-arch. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lumi-drift absolute -top-40 left-1/2 h-[38rem] w-[38rem] -translate-x-1/2 opacity-70 sm:h-[46rem] sm:w-[46rem]" />
        <div className="lumi-arch absolute -bottom-24 right-[-6rem] h-72 w-56 opacity-40 sm:right-4" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 pb-20 pt-16 text-center sm:px-10 sm:pb-28 sm:pt-24">
        <Reveal className="flex flex-col items-center">
          <p className="lumi-pill">{hero.badge}</p>

          <h1 className="lumi-display mt-9 text-balance">
            {hero.title}{' '}
            <span className="lumi-accent-type">{hero.titleAccent}</span>
          </h1>

          <p className="mt-8 max-w-2xl text-pretty text-[18px] leading-[1.8] text-[var(--lumi-ink-soft)]">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <a href={lumiereHref('booking')} className="lumi-btn lumi-btn--solid">
              {hero.ctaPrimary}
            </a>
            <a href={lumiereHref('services')} className="lumi-btn lumi-btn--ghost">
              {hero.ctaSecondary}
            </a>
          </div>
        </Reveal>

        <LumiereHairline className="mx-auto mt-16 w-full max-w-md" />

        <Reveal delay={0.12}>
          <dl className="mt-12 grid gap-10 sm:grid-cols-3">
            {hero.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="lumi-num font-[family-name:var(--lumi-serif)] text-[46px] leading-none text-[var(--lumi-accent-deep)]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <p aria-hidden className="mt-4 max-w-[15rem] text-[14px] leading-[1.7] text-[var(--lumi-ink-soft)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </Reveal>

        <p className="sr-only">{data.salon.common.demoNotice}</p>
      </div>
    </section>
  );
}
