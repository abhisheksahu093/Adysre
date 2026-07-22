'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * NORTHGATE - the template's motion primitives.
 *
 * One easing across the whole design, `cubic-bezier(0.16, 1, 0.3, 1)`: fast out
 * of the gate and a long settle, which is what makes a technical page feel
 * engineered rather than animated. Every section composes `Reveal` instead of
 * declaring its own variants, so five pages share one entrance.
 */

/** The single easing curve. Declared once so no section can drift from it. */
export const NGP_EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      // `once` matters on a multipage template: switching pages remounts the
      // sections, and a re-triggering reveal would read as a flicker.
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        // Under reduced motion the reveal collapses to effectively instant
        // rather than being removed, so nothing is ever left at opacity 0.
        duration: reduce ? 0 : 0.75,
        delay: reduce ? 0 : delay,
        ease: NGP_EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts up to `value` the first time it scrolls into view. Under reduced
 * motion it renders the final number immediately - a counter that ticks is
 * decoration, and the number is the information.
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

    const duration = 1300;
    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / duration);
      // Ease-out quartic, so the last digits settle rather than snap.
      setShown(Math.round(value * (1 - (1 - progress) ** 4)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {shown}
      {suffix}
    </span>
  );
}
