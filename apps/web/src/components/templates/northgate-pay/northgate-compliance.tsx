'use client';

import { NORTHGATE_COMPLIANCE, NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the compliance strip.
 *
 * Marks are set as mono type inside a hairline square rather than as logo
 * images, which keeps the download asset-free and, more usefully, keeps the
 * page honest: a scheme logo implies an endorsement, a scheme name states a
 * fact. Each mark carries the sentence that qualifies it.
 */
export function NorthgateCompliance() {
  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{NORTHGATE_LABELS.complianceEyebrow}</p>
          <h2 className="ngp-display ngp-display-md mt-6">{NORTHGATE_LABELS.complianceTitle}</h2>
          <p className="mt-5 max-w-2xl text-pretty text-[15px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {NORTHGATE_LABELS.complianceSubtitle}
          </p>
        </Reveal>

        <dl className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {NORTHGATE_COMPLIANCE.map((badge, index) => (
            <Reveal key={badge.code} delay={0.04 * (index % 3)}>
              <div className="ngp-card flex h-full gap-5 p-7">
                <span
                  aria-hidden
                  className="ngp-mono grid h-12 w-12 shrink-0 place-items-center rounded-[var(--ngp-radius-xs)] border border-[var(--ngp-accent-line)] bg-[var(--ngp-accent-wash)] text-[12px] tracking-[0.08em] text-[var(--ngp-indigo-deep)]"
                >
                  {badge.code}
                </span>
                <div>
                  <dt className="text-[15px] leading-snug">{badge.name}</dt>
                  <dd className="mt-2 text-[13.5px] leading-[1.75] text-[var(--ngp-ink-faint)]">
                    {badge.detail}
                  </dd>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
