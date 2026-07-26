'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { animate, createScope, onScroll, stagger, utils } from 'animejs';

/**
 * ASTRA - the template's motion primitives, built on anime.js v4.
 *
 * The two structural decisions match the other templates, and are repeated here
 * because a downloaded template stands alone:
 *
 *   1. The SERVER renders everything visible and in its FINAL state; the staged
 *      state is applied client-side in a layout effect, before paint, so a
 *      reader with no JavaScript sees a finished page rather than a blank one.
 *   2. Everything is created inside `createScope`, so one `revert()` on unmount
 *      cleans up animations and scroll observers together.
 *
 * This template's louder motion - the rotating star badge, the star marquee and
 * the bento hover-scale - is all CSS (see astra.css), so this file only carries
 * the scroll reveals and the count-up. Keeping ambient loops in CSS means they
 * cost nothing on the main thread and stop cleanly under reduced motion.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const AST_EASE = 'out(3)';
const ENTER = 'bottom-=60 top';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  id?: string;
}

/** A plain rise. */
export function Reveal({ children, delay = 0, y = 20, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.astReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 860,
        delay: delay * 1000,
        ease: AST_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.astReveal;
    };
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children. */
export function RevealGroup({
  children,
  step = 0.07,
  delay = 0,
  y = 22,
  className,
  as: Tag = 'div',
}: RevealProps & { step?: number }) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.astReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 860,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: AST_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.astReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Display type that rises out of clipped rows. One `<Line>` per line. */
export function LiftLines({
  children,
  delay = 0,
  className,
  id,
  as: Tag = 'h2',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-ast-line]'));
    if (rows.length === 0) return undefined;

    const scope = createScope({ root: el }).add(() => {
      animate(rows, {
        translateY: ['110%', '0%'],
        duration: 1000,
        delay: stagger(85, { start: delay * 1000 }),
        ease: 'out(4)',
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => scope.revert();
  }, [delay]);

  return (
    <Tag ref={ref} id={id} className={className}>
      {children}
    </Tag>
  );
}

/** One row of a lifted heading. The wrapper does the clipping. */
export function Line({ children }: { children: ReactNode }) {
  return (
    <span className="ast-clip">
      <span data-ast-line className="block">
        {children}
      </span>
    </span>
  );
}

/** Counts to `value` on entry. The server renders the real figure. */
export function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const state = { n: 0 };
    el.textContent = `0${suffix}`;

    const scope = createScope({ root: el }).add(() => {
      animate(state, {
        n: value,
        duration: 1500,
        ease: 'out(4)',
        modifier: utils.round(0),
        onUpdate: () => {
          el.textContent = `${state.n.toLocaleString('en-US')}${suffix}`;
        },
        autoplay: onScroll({ enter: 'bottom-=40 top', repeat: false }),
      });
    });

    return () => {
      scope.revert();
      el.textContent = `${value.toLocaleString('en-US')}${suffix}`;
    };
  }, [value, suffix]);

  return (
    <span ref={ref}>
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
