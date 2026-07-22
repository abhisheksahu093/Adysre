'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/**
 * ATELIER NORD - the template's motion primitives.
 *
 * Three ideas, shared by every section, so the page has one entrance curve
 * rather than nine: content fades slowly upward, the hairline under a heading
 * draws itself (via the `atelier-revealed` class this sets), and project blocks
 * are wiped in from their bottom edge like a print being pulled.
 *
 * All three stand down under `prefers-reduced-motion`: content appears instead
 * of moving, because the movement was never the information.
 */

/** Slow, small entrance. 12px of travel over 900ms - the restraint is the point. */
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
      // The drawn hairline is CSS, so it needs a class landing at the same
      // moment the content animates rather than on mount.
      className={[className, inView ? 'atelier-revealed' : ''].filter(Boolean).join(' ')}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
      // Both states are spelled out rather than leaving `animate` undefined:
      // `exactOptionalPropertyTypes` forbids handing an optional prop undefined.
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 12 }}
      transition={{ duration: 0.9, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wipes its children in from the bottom edge using `clip-path`, which stays on
 * the compositor and never reflows the caption sitting beneath it.
 */
export function MaskReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-70px' });
  const reduce = useReducedMotion();

  const hidden = reduce ? { opacity: 0 } : { clipPath: 'inset(100% 0 0 0)' };
  const shown = reduce ? { opacity: 1 } : { clipPath: 'inset(0% 0 0 0)' };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration: 1.1, delay: reduce ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts up to `value` the first time it scrolls into view. Under reduced
 * motion it renders the final number immediately - the ticking is decoration,
 * the number is the information.
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
