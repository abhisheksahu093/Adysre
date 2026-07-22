'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * VANTA - the template's two motion primitives.
 *
 * Every section composes these rather than repeating variants, so the five
 * pages share one entrance curve and one reduced-motion rule: when the visitor
 * asks for less motion, content appears rather than moves.
 *
 * The curve is the template's signature ease, `cubic-bezier(0.16, 1, 0.3, 1)`,
 * the same one `vanta.css` uses for the rule and the status dot.
 */

/** The one easing this template moves on. Tuple-typed for framer-motion. */
const VANTA_EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-90px' });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      // `vanta-revealed` is what the CSS rule-drawing hangs off, so it has to
      // land at the same moment the content animates rather than on mount.
      className={[className, inView ? 'vanta-revealed' : ''].filter(Boolean).join(' ')}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
      // Both states are spelled out rather than leaving `animate` undefined:
      // `exactOptionalPropertyTypes` forbids handing an optional prop undefined.
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 24 }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay, ease: VANTA_EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts up to `value` the first time it scrolls into view, with a thousands
 * separator because these are trading figures and `9412` is harder to read than
 * `9,412`. Under reduced motion it renders the final number immediately - a
 * counter that ticks is decoration, and the number is the information.
 */
export function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    if (reduce) {
      setShown(value);
      return undefined;
    }

    const duration = 1400;
    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / duration);
      // Ease-out quart: fast first, settling on the exact value. It is the
      // numeric cousin of the CSS easing, so counters and reveals feel related.
      setShown(Math.round(value * (1 - (1 - progress) ** 4)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {shown.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
