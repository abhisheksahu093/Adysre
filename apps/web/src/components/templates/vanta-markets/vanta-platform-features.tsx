'use client';

import { VANTA_PLATFORM_PAGE, VANTA_STACK_ICONS } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the platform capability grid, the operations table and the coverage
 * list.
 *
 * Every capability card leads with one mono figure, because the argument the
 * platform page has to win is "how fast, how many, how long" and a card without
 * a number is a claim nobody can check.
 */
export function VantaPlatformFeatures() {
  return (
    <>
      <section className="border-b border-[var(--vanta-line)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_PLATFORM_PAGE.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 max-w-4xl text-balance">
              {VANTA_PLATFORM_PAGE.title}
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {VANTA_PLATFORM_PAGE.subtitle}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {VANTA_PLATFORM_PAGE.features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <article className="vanta-card h-full p-7 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <feature.icon className="h-5 w-5 text-[var(--vanta-brand)]" aria-hidden />
                    <div className="text-right">
                      <p className="vanta-mono text-2xl text-[var(--vanta-up)]">{feature.metric}</p>
                      <p className="vanta-label mt-2 block">{feature.metricLabel}</p>
                    </div>
                  </div>
                  <h3 className="mt-8 text-lg font-semibold tracking-[-0.01em]">{feature.title}</h3>
                  <p className="mt-4 text-[15px] leading-[1.8] text-[var(--vanta-muted)]">
                    {feature.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <Reveal>
              <p className="vanta-eyebrow">{VANTA_PLATFORM_PAGE.reliabilityEyebrow}</p>
              <span className="vanta-rule mt-5" aria-hidden />
              <h2 className="vanta-display-sm mt-7 text-balance">
                {VANTA_PLATFORM_PAGE.reliabilityTitle}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="grid gap-px overflow-hidden rounded-[var(--vanta-radius)] border border-[var(--vanta-line)] bg-[var(--vanta-line)] sm:grid-cols-2">
                {VANTA_PLATFORM_PAGE.reliability.map((entry) => (
                  <div key={entry.label} className="bg-[var(--vanta-ink-deep)] p-7">
                    <dt className="vanta-mono text-3xl font-semibold">{entry.metric}</dt>
                    <dd className="mt-3 text-[14px] leading-[1.7] text-[var(--vanta-muted)]">
                      {entry.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--vanta-line)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_PLATFORM_PAGE.stackEyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{VANTA_PLATFORM_PAGE.stackTitle}</h2>
          </Reveal>

          {/*
            * A grid of `Reveal`s rather than a `<ul>`: `Reveal` renders a motion
            * div, and a div between a list and its items is invalid markup.
            */}
          <div className="mt-12 grid gap-px overflow-hidden rounded-[var(--vanta-radius)] border border-[var(--vanta-line)] bg-[var(--vanta-line)] sm:grid-cols-2 lg:grid-cols-4">
            {VANTA_PLATFORM_PAGE.stack.map((entry, index) => {
              // One icon per row, paired by position: the list and the icon set
              // are authored together and always the same length.
              const Icon = VANTA_STACK_ICONS[index % VANTA_STACK_ICONS.length];
              return (
                <Reveal key={entry.name} delay={index * 0.05} className="bg-[var(--vanta-ink)]">
                  <article className="h-full p-7">
                    {Icon ? <Icon className="h-5 w-5 text-[var(--vanta-up)]" aria-hidden /> : null}
                    <h3 className="mt-6 text-base font-semibold">{entry.name}</h3>
                    <p className="mt-3 text-[14px] leading-[1.7] text-[var(--vanta-muted)]">
                      {entry.detail}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
