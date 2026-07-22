'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion';

/**
 * SAFFRON - the template's motion primitives.
 *
 * Two ideas, shared by every section: content rises as it enters view (and the
 * saffron rule under the heading draws itself, via the `saf-revealed` class),
 * and the plated compositions drift against the scroll. Both stand down under
 * prefers-reduced-motion.
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
      // The class is what the CSS rule-drawing hangs off, so it has to land at
      // the same moment the content animates rather than on mount.
      className={[className, inView ? 'saf-revealed' : ''].filter(Boolean).join(' ')}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      // Both states are spelled out rather than leaving `animate` undefined:
      // `exactOptionalPropertyTypes` forbids handing an optional prop undefined.
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 20 }}
      transition={{ duration: 0.7, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Drifts its children vertically as the section crosses the viewport. `range`
 * is the total travel in pixels, split either side of centre.
 */
export function Parallax({
  children,
  range = 60,
  className,
}: {
  children: ReactNode;
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range / 2, -range / 2]);

  return (
    <div ref={ref} className={className}>
      <motion.div {...(reduce ? {} : { style: { y } })}>{children}</motion.div>
    </div>
  );
}
