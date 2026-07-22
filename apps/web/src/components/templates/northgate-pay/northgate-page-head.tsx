'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { NorthgatePageHead } from '@/data/templates/northgate-pay-content';
import { NGP_EASE } from './northgate-reveal';

/**
 * NORTHGATE - the masthead each dedicated page opens with.
 *
 * Home has the oversized hero; the other four open on this instead - the same
 * deep band, the same grid, the same three mono figures - so moving between
 * pages feels like moving through one document rather than four sites. Shared
 * rather than repeated, which is also why every page starts at the same height.
 */
export function NorthgatePageHead({ head }: { head: NorthgatePageHead }) {
  const reduce = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0 : 0.8,
      delay: reduce ? 0 : delay,
      ease: NGP_EASE,
    },
  });

  return (
    <section className="ngp-on-deep ngp-wash relative overflow-hidden bg-[var(--ngp-deep)] text-[var(--ngp-on-deep)]">
      <div className="ngp-grid absolute inset-0" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28">
        <motion.p {...rise(0)} className="ngp-eyebrow ngp-eyebrow-invert">
          {head.eyebrow}
        </motion.p>

        <motion.h1 {...rise(0.06)} className="ngp-display ngp-display-lg mt-6 max-w-4xl">
          {head.title} <span className="ngp-grad-text">{head.titleAccent}</span>
        </motion.h1>

        <motion.p
          {...rise(0.14)}
          className="mt-7 max-w-2xl text-pretty text-[15.5px] leading-[1.8] text-[var(--ngp-on-deep-soft)]"
        >
          {head.intro}
        </motion.p>

        <motion.dl
          {...rise(0.22)}
          className="mt-12 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-[var(--ngp-radius-sm)] border border-[var(--ngp-deep-rule)] sm:grid-cols-3"
        >
          {head.figures.map((figure) => (
            <div key={figure.label} className="bg-[var(--ngp-deep-2)] px-6 py-6">
              <dd className="ngp-mono text-2xl tracking-[-0.02em] text-[var(--ngp-cyan-bright)]">
                {figure.value}
              </dd>
              <dt className="mt-2 text-[12px] leading-relaxed text-[var(--ngp-on-deep-faint)]">
                {figure.label}
              </dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
