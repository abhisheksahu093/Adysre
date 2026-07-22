'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * LUMIERE - the template's motion primitives.
 *
 * Two of them, shared by every section and every page, so the whole salon moves
 * on one curve and honours one reduced-motion rule: when the visitor asks for
 * less motion, content appears rather than travels, and numbers arrive already
 * counted.
 *
 * The curve is the template's own `cubic-bezier(0.16, 1, 0.3, 1)` - the same
 * value `--lumi-ease` carries in lumiere.css. It is repeated here rather than
 * read from CSS because framer-motion needs the control points as numbers, and a
 * runtime `getComputedStyle` round trip to avoid one duplicated array would be a
 * worse trade than the duplication.
 */

const LUMI_EASE = [0.16, 1, 0.3, 1] as const;

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
      /*
       * `lumi-revealed` is what the self-drawing champagne rule in lumiere.css
       * hangs off, so it has to land at the moment the content animates rather
       * than on mount.
       */
      className={[className, inView ? 'lumi-revealed' : ''].filter(Boolean).join(' ')}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
      /*
       * Both states are spelled out rather than leaving `animate` undefined:
       * `exactOptionalPropertyTypes` forbids handing an optional prop undefined.
       */
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 22 }}
      transition={{ duration: 0.8, delay: reduce ? 0 : delay, ease: [...LUMI_EASE] }}
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
