'use client';

import {
  formatLumiereDuration,
  lumiereHref,
} from '@/data/templates/lumiere-salon-content';
import { LumiereHairline } from './lumiere-hairline';
import { LumiereMasthead } from './lumiere-masthead';
import { useLumiereSettings } from './lumiere-settings';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the priced treatment menu.
 *
 * Four categories, each an arch-topped panel beside a real list of treatments
 * with a duration in minutes and a price. The duration and price sit in a
 * definition list rather than in the paragraph, because they are the two facts
 * someone scans for and they should be reachable without reading the prose.
 *
 * There is no filtering here on purpose: a menu of nineteen treatments across
 * four headings is faster to read whole than to filter, and the categories are
 * anchored so the in-page rail can jump to them.
 */
export function LumiereServicesPage() {
  const { data } = useLumiereSettings();
  const { formatPrice } = useLumiereSettings();
  const { services, common } = data.salon;

  return (
    <>
      <LumiereMasthead copy={services.masthead} />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
        {/* An in-page rail rather than a filter: every category stays rendered,
            so this is navigation and the smooth scroll in lumiere.css carries it. */}
        <Reveal>
          <nav aria-label={services.menuLabel} className="flex flex-wrap justify-center gap-3">
            {data.serviceCategories.map((category) => (
              <a key={category.id} href={`#treatments-${category.id}`} className="lumi-chip">
                {category.name}
              </a>
            ))}
          </nav>
        </Reveal>

        <div className="mt-20 space-y-24">
          {data.serviceCategories.map((category) => (
            <section key={category.id} id={`treatments-${category.id}`} aria-labelledby={`${category.id}-heading`}>
              <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                <Reveal>
                  <div className="lg:sticky lg:top-28">
                    <div
                      aria-hidden
                      className={`lumi-arch lumi-arch--${category.art} h-56 w-full max-w-xs`}
                    />
                    <h2 id={`${category.id}-heading`} className="lumi-title mt-8">
                      {category.name}
                    </h2>
                    <p className="mt-4 max-w-sm text-[16px] leading-[1.8] text-[var(--lumi-ink-soft)]">
                      {category.tagline}
                    </p>
                  </div>
                </Reveal>

                <div className="space-y-5">
                  {category.treatments.map((treatment, index) => (
                    <Reveal key={treatment.id} delay={0.04 * Math.min(index, 4)}>
                      <article className="lumi-panel px-8 py-8 sm:px-10">
                        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                          <h3 className="lumi-subtitle">{treatment.name}</h3>
                          <p className="lumi-num text-[20px] text-[var(--lumi-accent-deep)]">
                            {formatPrice(treatment.price)}
                          </p>
                        </div>

                        <dl className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
                          <div className="flex items-baseline gap-2">
                            <dt className="lumi-label">{common.duration}</dt>
                            <dd className="lumi-num text-[14px]">
                              {formatLumiereDuration(treatment.duration)}
                            </dd>
                          </div>
                          {treatment.note !== undefined && (
                            <div className="flex items-baseline gap-2">
                              <dt className="sr-only">{services.noteLabel}</dt>
                              <dd>
                                <span className="lumi-pill">{treatment.note}</span>
                              </dd>
                            </div>
                          )}
                        </dl>

                        <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-[var(--lumi-ink-soft)]">
                          {treatment.description}
                        </p>

                        <a
                          href={lumiereHref('booking')}
                          className="mt-6 inline-flex text-[13px] tracking-[0.12em] text-[var(--lumi-accent-deep)] uppercase transition-colors hover:text-[var(--lumi-ink)]"
                        >
                          {services.bookTreatment}
                        </a>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <LumiereHairline className="mx-auto mt-24 w-full max-w-md" />

        <Reveal delay={0.08}>
          <div className="lumi-inverse mt-16 overflow-hidden rounded-[44px] px-8 py-16 text-center sm:px-14">
            <h2 className="lumi-title">{services.courseTitle}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-[16px] leading-[1.85] text-[var(--lumi-paper-dim)]">
              {services.courseBody}
            </p>
            <a href={lumiereHref('contact')} className="lumi-btn lumi-btn--solid mt-9">
              {services.courseCta}
            </a>
          </div>
        </Reveal>
      </section>
    </>
  );
}
