'use client';

import { Fragment } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { NORTHGATE_FLOW, NORTHGATE_LABELS } from '@/data/templates/northgate-pay-content';
import { NGP_EASE, Reveal } from './northgate-reveal';

/**
 * NORTHGATE - the authorisation-path diagram.
 *
 * Boxes and lines, built from divs: no SVG, no image, no charting library. The
 * connectors draw themselves left to right as the section scrolls in, each one
 * starting after the node before it has appeared, so the eye is led along the
 * path in the order the request actually travels.
 *
 * Two connectors are declared per gap - a vertical one for the stacked layout
 * and a horizontal one from `lg` up - because a single element cannot change
 * which axis it scales on across a breakpoint. Only one is ever visible.
 *
 * Note there is no `position` anywhere in the scoped CSS for these elements:
 * layout here is entirely Tailwind's, and a scoped rule setting `position`
 * would outrank `.absolute` and quietly break it.
 */
export function NorthgateFlow() {
  const reduce = useReducedMotion();

  // The draw is sequenced off the node's index so the line always trails the
  // box it leaves. Collapsed to zero under reduced motion rather than removed,
  // so the connectors are still present and still at full scale.
  const draw = (index: number, axis: 'x' | 'y') => ({
    initial: axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
    whileInView: axis === 'x' ? { scaleX: 1 } : { scaleY: 1 },
    viewport: { once: true, margin: '-80px' },
    transition: {
      duration: reduce ? 0 : 0.55,
      delay: reduce ? 0 : 0.25 + index * 0.18,
      ease: NGP_EASE,
    },
  });

  return (
    <section className="ngp-on-deep ngp-wash relative overflow-hidden bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-3xl">
          <p className="ngp-eyebrow ngp-eyebrow-invert">{NORTHGATE_LABELS.flowEyebrow}</p>
          <h2 className="ngp-display ngp-display-lg mt-6">{NORTHGATE_LABELS.flowTitle}</h2>
          <p className="mt-6 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-on-deep-soft)]">
            {NORTHGATE_LABELS.flowSubtitle}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <ol className="mt-16 flex flex-col lg:flex-row lg:items-stretch">
            {NORTHGATE_FLOW.map((step, index) => (
              <Fragment key={step.id}>
                {index > 0 && (
                  <li
                    aria-hidden
                    className="flex shrink-0 items-center justify-center py-3 lg:w-12 lg:py-0"
                  >
                    <motion.span
                      {...draw(index, 'y')}
                      className="ngp-connector-y block h-9 w-px lg:hidden"
                    />
                    <motion.span
                      {...draw(index, 'x')}
                      className="ngp-connector hidden h-px w-full lg:block"
                    />
                  </li>
                )}

                <li className="ngp-node flex-1 p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="ngp-mono text-[11px] tracking-[0.18em] text-[var(--ngp-on-deep-faint)]">
                      {`0${index + 1}`}
                    </span>
                    <span className="ngp-mono text-[12px] text-[var(--ngp-cyan-bright)]">
                      {step.timing}
                    </span>
                  </div>
                  <h3 className="ngp-display mt-5 text-[17px] leading-snug">{step.title}</h3>
                  <p className="mt-2.5 text-[13px] leading-[1.75] text-[var(--ngp-on-deep-soft)]">
                    {step.detail}
                  </p>
                </li>
              </Fragment>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.14}>
          <dl className="mt-10 flex items-baseline gap-4 border-t border-[var(--ngp-deep-rule)] pt-6">
            <dt className="ngp-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ngp-on-deep-faint)]">
              {NORTHGATE_LABELS.flowTotalLabel}
            </dt>
            <dd className="ngp-mono ngp-display-md tracking-[-0.04em] text-[var(--ngp-cyan-bright)]">
              {NORTHGATE_LABELS.flowTotal}
            </dd>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
