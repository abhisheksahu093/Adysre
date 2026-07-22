'use client';

import { Check } from 'lucide-react';
import {
  KITE_PACKAGES,
  KITE_SERVICES_PAGE,
  KITE_UI,
} from '@/data/templates/kite-studio-content';
import { Reveal } from './kite-reveal';

/**
 * KITE - the four priced engagements.
 *
 * Publishing the number is a positioning decision, not a layout one, so the
 * price is set larger than the package name. The featured card is marked in the
 * data rather than by index, so re-ordering the list never silently moves the
 * emphasis.
 */
export function KitePackages() {
  return (
    <section id="pricing" className="scroll-mt-24 border-t border-[var(--kite-line)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <Reveal>
          <p className="kite-eyebrow">{KITE_SERVICES_PAGE.packagesEyebrow}</p>
          <h2 className="kite-display-sm mt-6 max-w-2xl">{KITE_SERVICES_PAGE.packagesTitle}</h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {KITE_PACKAGES.map((pack, index) => (
            <Reveal key={pack.id} delay={(index % 2) * 0.08}>
              <div
                className={`${
                  pack.featured ? 'kite-panel-hot' : 'kite-panel'
                } flex h-full flex-col px-8 py-10 sm:px-10 sm:py-12`}
              >
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold tracking-[-0.03em]">{pack.name}</h3>
                    <p className="kite-figures mt-2 text-[11px] uppercase tracking-[0.2em] text-[var(--kite-paper-faint)]">
                      {pack.duration}
                    </p>
                  </div>
                  {pack.featured && (
                    <span className="kite-pill-hot shrink-0 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em]">
                      {KITE_SERVICES_PAGE.featuredLabel}
                    </span>
                  )}
                </div>

                <p className="kite-gradient-text kite-figures mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                  {pack.price}
                </p>

                <p className="mt-6 text-[15px] leading-[1.8] text-[var(--kite-paper-soft)]">
                  {pack.summary}
                </p>

                <p className="kite-eyebrow mt-9">{KITE_SERVICES_PAGE.includesLabel}</p>
                <ul className="mt-5 space-y-3.5">
                  {pack.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-[15px] leading-relaxed">
                      <Check
                        className="mt-1 h-4 w-4 shrink-0 text-[var(--kite-acid)]"
                        aria-hidden
                      />
                      <span className="text-[var(--kite-paper-soft)]">{item}</span>
                    </li>
                  ))}
                </ul>

                {/*
                 * `mt-auto` on a flex column pins the four calls to action to
                 * one baseline however uneven the `includes` lists are.
                 */}
                <div className="mt-auto pt-10">
                  <a
                    href={KITE_UI.headerCtaHref}
                    className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold ${
                      pack.featured
                        ? 'kite-pill-hot'
                        : 'border border-[var(--kite-line-strong)] text-[var(--kite-paper)] transition-colors hover:border-[var(--kite-acid)] hover:text-[var(--kite-acid)]'
                    }`}
                  >
                    {KITE_SERVICES_PAGE.packageCta}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
