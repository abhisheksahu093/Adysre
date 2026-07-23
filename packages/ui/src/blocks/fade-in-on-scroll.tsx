'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Live preview for `fade-in-on-scroll`.
 *
 * Mirrors the `nextjs`/`typescript` code variant verbatim. The stage is a few
 * hundred pixels tall and never scrolls, so the preview remounts the component
 * on a timer - `whileInView` fires on mount for an element already in the
 * viewport, which replays the real reveal rather than faking it with a second
 * animation. Reduced-motion users get the content still and the loop off; a
 * replaying reveal is exactly the motion they asked not to see.
 * Keep this in step with `src/data/components/animation.ts`.
 */
type FadeDirection = 'up' | 'down' | 'none';

interface FadeInOnScrollProps {
  children: ReactNode;
  direction?: FadeDirection;
  distance?: number;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export function FadeInOnScroll({
  children,
  direction = 'up',
  distance = 24,
  delay = 0,
  duration = 0.5,
  once = true,
  className = '',
}: FadeInOnScrollProps) {
  const shouldReduceMotion = useReducedMotion();

  const offset: number = direction === 'none' ? 0 : direction === 'down' ? -distance : distance;

  // Reduced motion keeps the reveal but drops the travel and the fade timing -
  // the content is present either way, never gated behind an animation.
  const hidden = shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: offset };

  return (
    <motion.div
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: '0px 0px -10% 0px' }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function FadeInOnScrollPreview() {
  const shouldReduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const id = window.setInterval(() => {
      setRun((current) => current + 1);
    }, 2500);
    return () => window.clearInterval(id);
  }, [shouldReduceMotion]);

  return (
    <div className="w-full max-w-lg">
      <FadeInOnScroll key={run} direction="up" distance={24} duration={0.5}>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Ship faster</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Everything you need to go from idea to production, in one place.
        </p>
      </FadeInOnScroll>

      <FadeInOnScroll key={`second-${run}`} direction="up" distance={24} delay={0.12} duration={0.5}>
        <h2 className="mt-8 text-2xl font-semibold text-gray-900 dark:text-gray-100">Scale calmly</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          Autoscaling, observability, and rollbacks that take one click.
        </p>
      </FadeInOnScroll>
    </div>
  );
}
