'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * MERIDIAN - the template's two motion primitives.
 *
 * The art direction is restraint: a law firm's page should not slide, drift or
 * bounce. So `Reveal` fades and nothing else - no vertical travel, no scale -
 * and every section composes it rather than declaring its own variants, which
 * keeps one entrance curve across four pages.
 */

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
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      // `once` matters on a multipage template: switching pages remounts the
      // sections, and a re-triggering fade would read as a flicker.
      viewport={{ once: true, margin: '-72px' }}
      transition={{
        // Under reduced motion the fade collapses to effectively instant rather
        // than being removed, so the element never renders at opacity 0.
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
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

    const duration = 1200;
    let frame = 0;
    let start: number | null = null;

    const step = (now: number) => {
      start ??= now;
      const progress = Math.min(1, (now - start) / duration);
      // Ease-out cubic: quick first, settling on the exact value.
      setShown(Math.round(value * (1 - (1 - progress) ** 3)));
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
