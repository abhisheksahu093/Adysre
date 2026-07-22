'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * PINNACLE - the template's motion primitives.
 *
 * Two of them, and every section composes these rather than declaring its own
 * variants, which is what keeps one entrance curve across five pages. The curve
 * is `cubic-bezier(0.16, 1, 0.3, 1)`: it arrives fast and settles slowly, which
 * is the whole reason the page reads as expensive rather than as animated.
 */

/** The one easing the template uses, stated once as a tuple framer accepts. */
const EASE = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  /** Travel distance in px. Set to 0 where a lift would fight a sticky layout. */
  y = 20,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      // Under reduced motion the element starts at its final state, so it never
      // renders invisible if the transition is stripped by the media query.
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      // `once` matters on a multipage template: switching pages remounts the
      // sections, and a re-triggering reveal would read as a flicker.
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: reduce ? 0 : 0.7,
        delay: reduce ? 0 : delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts up to `value` the first time it scrolls into view. Under reduced motion
 * it renders the final number immediately - a counter that ticks is decoration,
 * and the number is the information.
 */
export function Counter({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
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
      // Ease-out quart, the numeric twin of the CSS curve above: quick first,
      // then settling precisely onto the real figure.
      setShown(Math.round(value * (1 - (1 - progress) ** 4)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce, value]);

  return (
    <span ref={ref}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
