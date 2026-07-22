'use client';

import { Check } from 'lucide-react';
import { NORTHGATE_LABELS, NORTHGATE_TIERS } from '@/data/templates/northgate-pay-content';
import { northgateHref } from './northgate-links';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the three published rates.
 *
 * The rate is the headline, set at display size in mono, because a merchant
 * comparing acquirers is comparing exactly two numbers and everything else on
 * the card is context. The middle tier is marked rather than enlarged: growing
 * one card breaks the grid, and a hairline in the accent says the same thing.
 */
export function NorthgatePricing() {
  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          {NORTHGATE_TIERS.map((tier, index) => (
            <Reveal key={tier.id} delay={0.06 * index}>
              <article
                className={`flex h-full flex-col p-8 sm:p-10 ${
                  tier.featured ? 'ngp-card ngp-card-lg ngp-card-accent' : 'ngp-card ngp-card-lg'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="ngp-display text-[22px]">{tier.name}</h2>
                  {tier.featured && (
                    <span className="ngp-mono rounded-full border border-[var(--ngp-accent-line)] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--ngp-indigo-deep)]">
                      {NORTHGATE_LABELS.pricingFeatured}
                    </span>
                  )}
                </div>

                <p className="ngp-mono mt-2 text-[12px] tracking-[0.06em] text-[var(--ngp-ink-faint)]">
                  {tier.volumeNote}
                </p>

                {/* Assembled from the tier's numbers and the unit labels, never
                    from a pre-formatted string - the calculator below has to
                    multiply the same values, so they stay numeric in content. */}
                <p className="ngp-mono ngp-display-md mt-8 tracking-[-0.04em] text-[var(--ngp-ink)]">
                  {`${tier.rate}${NORTHGATE_LABELS.pricingRateUnit} + ${tier.fixed}${NORTHGATE_LABELS.pricingFixedUnit}`}
                </p>
                <p className="mt-2 text-[12.5px] text-[var(--ngp-ink-faint)]">
                  {NORTHGATE_LABELS.pricingPerTransaction}
                </p>

                <p className="ngp-mono mt-5 border-t border-[var(--ngp-rule)] pt-5 text-[13px] text-[var(--ngp-ink-soft)]">
                  {tier.monthly === 0
                    ? NORTHGATE_LABELS.pricingNoMonthly
                    : `${NORTHGATE_LABELS.pricingCurrencySymbol}${tier.monthly} ${NORTHGATE_LABELS.pricingPerMonth}`}
                </p>

                <p className="mt-6 text-[14px] leading-[1.8] text-[var(--ngp-ink-soft)]">
                  {tier.blurb}
                </p>

                <ul className="mt-8 space-y-3.5">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ngp-indigo-deep)]"
                        aria-hidden
                      />
                      <span className="text-[13.5px] leading-[1.7] text-[var(--ngp-ink-soft)]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={northgateHref('contact')}
                  className={`mt-10 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-[14px] transition-opacity hover:opacity-85 ${
                    tier.featured
                      ? 'bg-[var(--ngp-ink)] text-[var(--ngp-bg)]'
                      : 'border border-[var(--ngp-rule-strong)] text-[var(--ngp-ink)]'
                  }`}
                >
                  {tier.cta}
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12} className="mt-16">
          <div className="ngp-card ngp-card-lg p-8 sm:p-10">
            <p className="ngp-eyebrow">{NORTHGATE_LABELS.pricingCompareEyebrow}</p>
            <h2 className="ngp-display ngp-display-md mt-5">
              {NORTHGATE_LABELS.pricingCompareTitle}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {NORTHGATE_LABELS.pricingIncluded.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ngp-indigo-deep)]"
                    aria-hidden
                  />
                  <span className="text-[14px] leading-[1.7] text-[var(--ngp-ink-soft)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
