'use client';

import { useMemo, useState } from 'react';
import { NORTHGATE_LABELS, NORTHGATE_TIERS } from '@/data/templates/northgate-pay-content';
import { Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the pricing calculator.
 *
 * Real arithmetic, done in the browser, on two numbers the visitor supplies:
 * monthly card volume and average transaction value. Everything else is derived
 * from the published tier rates, which is why those are stored as numbers in
 * the content module rather than as pre-formatted strings.
 *
 * SAFETY: the only inputs on this page are a volume slider, a volume number
 * field and an average-value field. No card number, no bank detail, no
 * `autocomplete` of any kind. It estimates a price; it never takes a payment.
 */

/** Slider bounds. Ten thousand to twenty million a month covers all three tiers. */
const VOLUME_MIN = 10_000;
const VOLUME_MAX = 20_000_000;
const VOLUME_STEP = 10_000;
const AVERAGE_MIN = 1;
const AVERAGE_MAX = 5_000;

export function NorthgateCalculator() {
  const [volume, setVolume] = useState(750_000);
  const [average, setAverage] = useState(42);

  const money = useMemo(
    () =>
      new Intl.NumberFormat(NORTHGATE_LABELS.calcLocale, {
        style: 'currency',
        currency: NORTHGATE_LABELS.calcCurrency,
        maximumFractionDigits: 0,
      }),
    [],
  );

  const rows = useMemo(() => {
    // Guard the divisor rather than the input: a visitor clearing the field
    // should see the previous transaction count, not a division by zero.
    const safeAverage = average > 0 ? average : 1;
    const transactions = Math.max(1, Math.round(volume / safeAverage));

    return NORTHGATE_TIERS.map((tier) => {
      // Percentage on volume, plus the fixed fee in pence on every
      // transaction, plus the flat platform fee. The same three lines that
      // appear on a real statement.
      const percentage = (volume * tier.rate) / 100;
      const perTransaction = (transactions * tier.fixed) / 100;
      const total = percentage + perTransaction + tier.monthly;

      return {
        tier,
        transactions,
        total,
        // Effective rate is what a finance lead actually compares between
        // acquirers, and it is never the headline percentage.
        effective: volume > 0 ? (total / volume) * 100 : 0,
      };
    });
  }, [average, volume]);

  const transactions = rows[0]?.transactions ?? 0;

  return (
    <section className="border-b border-[var(--ngp-rule)] bg-[var(--ngp-bg-2)]">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow">{NORTHGATE_LABELS.calcEyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{NORTHGATE_LABELS.calcTitle}</h2>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-ink-soft)]">
            {NORTHGATE_LABELS.calcSubtitle}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <div className="ngp-card ngp-card-lg p-8 sm:p-10">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
              <div>
                <label htmlFor="northgate-volume" className="block text-[13px] text-[var(--ngp-ink-faint)]">
                  {NORTHGATE_LABELS.calcVolumeLabel}
                </label>
                <input
                  id="northgate-volume"
                  type="number"
                  inputMode="numeric"
                  min={VOLUME_MIN}
                  max={VOLUME_MAX}
                  step={VOLUME_STEP}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="ngp-field ngp-mono mt-3 w-full px-5 py-3.5 text-[20px] outline-none"
                />
                {/* The slider is a second control on the same value, labelled
                    separately so it is never announced as an unnamed range. */}
                <input
                  id="northgate-volume-slider"
                  aria-label={NORTHGATE_LABELS.calcVolumeLabel}
                  type="range"
                  min={VOLUME_MIN}
                  max={VOLUME_MAX}
                  step={VOLUME_STEP}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value))}
                  className="ngp-slider mt-6"
                />

                <label
                  htmlFor="northgate-average"
                  className="mt-10 block text-[13px] text-[var(--ngp-ink-faint)]"
                >
                  {NORTHGATE_LABELS.calcAverageLabel}
                </label>
                <input
                  id="northgate-average"
                  type="number"
                  inputMode="numeric"
                  min={AVERAGE_MIN}
                  max={AVERAGE_MAX}
                  value={average}
                  onChange={(event) => setAverage(Number(event.target.value))}
                  className="ngp-field ngp-mono mt-3 w-full px-5 py-3.5 text-[20px] outline-none"
                />

                <dl className="mt-10 border-t border-[var(--ngp-rule)] pt-6">
                  <dt className="text-[13px] text-[var(--ngp-ink-faint)]">
                    {NORTHGATE_LABELS.calcTransactionsLabel}
                  </dt>
                  <dd className="ngp-mono mt-2 text-[22px] tracking-[-0.02em]">
                    {transactions.toLocaleString(NORTHGATE_LABELS.calcLocale)}
                  </dd>
                </dl>
              </div>

              {/* The results are a live region: the figures change as the
                  slider moves, and that change is the whole answer. */}
              <div aria-live="polite" className="grid gap-4">
                {rows.map((row) => (
                  <div
                    key={row.tier.id}
                    className={`rounded-[var(--ngp-radius-sm)] border p-6 ${
                      row.tier.featured
                        ? 'border-[var(--ngp-accent-line)] bg-[var(--ngp-accent-wash)]'
                        : 'border-[var(--ngp-rule)] bg-[var(--ngp-bg)]'
                    }`}
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="ngp-display text-[18px]">{row.tier.name}</h3>
                      <p className="ngp-mono text-[12px] text-[var(--ngp-ink-faint)]">
                        {`${NORTHGATE_LABELS.calcRateLabel} ${row.tier.rate}${NORTHGATE_LABELS.pricingRateUnit} + ${row.tier.fixed}${NORTHGATE_LABELS.pricingFixedUnit}`}
                      </p>
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
                      <div>
                        <dt className="text-[11.5px] text-[var(--ngp-ink-faint)]">
                          {NORTHGATE_LABELS.calcFeeLabel}
                        </dt>
                        <dd className="ngp-mono mt-1.5 text-[19px] tracking-[-0.02em] text-[var(--ngp-indigo-deep)]">
                          {money.format(row.total)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11.5px] text-[var(--ngp-ink-faint)]">
                          {NORTHGATE_LABELS.calcEffectiveLabel}
                        </dt>
                        <dd className="ngp-mono mt-1.5 text-[19px] tracking-[-0.02em]">
                          {`${row.effective.toFixed(2)}${NORTHGATE_LABELS.pricingRateUnit}`}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[11.5px] text-[var(--ngp-ink-faint)]">
                          {NORTHGATE_LABELS.calcMonthlyLabel}
                        </dt>
                        <dd className="ngp-mono mt-1.5 text-[19px] tracking-[-0.02em]">
                          {money.format(row.tier.monthly)}
                        </dd>
                      </div>
                    </dl>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-10 border-t border-[var(--ngp-rule)] pt-6 text-[12.5px] leading-[1.8] text-[var(--ngp-ink-faint)]">
              {NORTHGATE_LABELS.calcNote}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
