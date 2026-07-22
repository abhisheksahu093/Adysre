'use client';

import { Check } from 'lucide-react';
import { VANTA_PRICING_PAGE, VANTA_UI } from '@/data/templates/vanta-markets-content';
import { Reveal } from './vanta-reveal';

/**
 * VANTA - the plan ladder and the fee schedule.
 *
 * The two halves are deliberately different objects: a ladder sells, a schedule
 * discloses. Putting the full per-charge table on the same page as the plans is
 * the whole argument of this page, so it is not a link to a PDF.
 */
export function VantaPricing() {
  const feeCell = 'vanta-mono whitespace-nowrap px-4 py-4 text-right text-[15px]';

  return (
    <>
      <section className="border-b border-[var(--vanta-line)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_PRICING_PAGE.eyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 max-w-4xl text-balance">
              {VANTA_PRICING_PAGE.title}
            </h2>
            <p className="mt-6 max-w-2xl text-[15px] leading-[1.9] text-[var(--vanta-muted)]">
              {VANTA_PRICING_PAGE.subtitle}
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {VANTA_PRICING_PAGE.plans.map((plan, index) => (
              <Reveal key={plan.id} delay={index * 0.06}>
                <article
                  className={`vanta-card vanta-card-lg flex h-full flex-col p-8 sm:p-10 ${
                    plan.featured ? 'vanta-card-featured' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-[-0.01em]">{plan.name}</h3>
                    {plan.featured && (
                      <span className="vanta-chip vanta-chip-active px-3 py-1.5">
                        {VANTA_PRICING_PAGE.featuredLabel}
                      </span>
                    )}
                  </div>

                  <p className="mt-6 flex items-baseline gap-2">
                    <span className="vanta-mono text-5xl font-semibold tracking-[-0.03em]">
                      {plan.price}
                    </span>
                    <span className="vanta-label">{plan.cadence}</span>
                  </p>

                  <p className="mt-5 text-[15px] leading-[1.8] text-[var(--vanta-muted)]">
                    {plan.tagline}
                  </p>

                  <p className="vanta-mono mt-6 border-y border-[var(--vanta-line)] py-4 text-[13px] text-[var(--vanta-up)]">
                    {plan.commission}
                  </p>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-[14px] leading-[1.7] text-[var(--vanta-muted)]"
                      >
                        <Check
                          className="mt-1 h-3.5 w-3.5 shrink-0 text-[var(--vanta-up)]"
                          aria-hidden
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={VANTA_UI.headerCtaHref}
                    className={`mt-9 inline-flex items-center justify-center rounded-full px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                      plan.featured
                        ? 'bg-[var(--vanta-brand)] text-[var(--vanta-ink)]'
                        : 'border border-[var(--vanta-line-strong)] text-[var(--vanta-text)]'
                    }`}
                  >
                    {plan.cta}
                  </a>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-[13px] text-[var(--vanta-faint)]">
            {VANTA_PRICING_PAGE.cadenceNote}
          </p>
        </div>
      </section>

      <section className="border-b border-[var(--vanta-line)] bg-[var(--vanta-ink-deep)]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <Reveal>
            <p className="vanta-eyebrow">{VANTA_PRICING_PAGE.feeEyebrow}</p>
            <span className="vanta-rule mt-5" aria-hidden />
            <h2 className="vanta-display-sm mt-7 text-balance">{VANTA_PRICING_PAGE.feeTitle}</h2>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-12 overflow-x-auto rounded-[var(--vanta-radius)] border border-[var(--vanta-line)]">
              <table className="w-full min-w-[40rem] border-collapse">
                <caption className="sr-only">{VANTA_PRICING_PAGE.feeNote}</caption>
                <thead className="bg-[var(--vanta-ink)]">
                  <tr className="border-b border-[var(--vanta-line)]">
                    <th scope="col" className="vanta-label px-4 py-4 text-left font-normal">
                      {VANTA_PRICING_PAGE.feeColumns.item}
                    </th>
                    <th scope="col" className="vanta-label px-4 py-4 text-right font-normal">
                      {VANTA_PRICING_PAGE.feeColumns.core}
                    </th>
                    <th scope="col" className="vanta-label px-4 py-4 text-right font-normal">
                      {VANTA_PRICING_PAGE.feeColumns.active}
                    </th>
                    <th scope="col" className="vanta-label px-4 py-4 text-right font-normal">
                      {VANTA_PRICING_PAGE.feeColumns.desk}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VANTA_PRICING_PAGE.fees.map((fee) => (
                    <tr
                      key={fee.item}
                      className="border-b border-[var(--vanta-line)] last:border-b-0"
                    >
                      <th
                        scope="row"
                        className="px-4 py-4 text-left text-[15px] font-normal text-[var(--vanta-text)]"
                      >
                        {fee.item}
                      </th>
                      <td className={`${feeCell} text-[var(--vanta-muted)]`}>{fee.core}</td>
                      <td className={feeCell}>{fee.active}</td>
                      <td className={`${feeCell} text-[var(--vanta-muted)]`}>{fee.desk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-5 max-w-3xl text-[13px] leading-relaxed text-[var(--vanta-faint)]">
              {VANTA_PRICING_PAGE.feeNote}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
