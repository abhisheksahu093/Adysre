'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * VERDANT - the template's two motion primitives.
 *
 * Every section composes these rather than repeating variants, so the four
 * pages share one entrance curve and one reduced-motion rule: when the visitor
 * asks for less motion, content appears rather than moves.
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-90px' });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      // `verdant-revealed` is what the CSS rule-drawing hangs off, so it has to
      // land at the same moment the content animates rather than on mount.
      className={[className, inView ? 'verdant-revealed' : ''].filter(Boolean).join(' ')}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      // Both states are spelled out rather than leaving `animate` undefined:
      // `exactOptionalPropertyTypes` forbids handing an optional prop undefined.
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 18 }}
      transition={{ duration: 0.65, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
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
      // Ease-out cubic: fast first, settling on the exact value.
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
