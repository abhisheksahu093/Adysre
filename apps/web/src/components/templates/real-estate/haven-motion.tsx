'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { animate, createScope, onScroll, stagger, utils } from 'animejs';
import Lenis from 'lenis';

/**
 * HAVEN - motion primitives (Anime.js v4 + Lenis).
 *
 * The two rules that match every template: the SERVER renders everything visible
 * and final, the staged state is applied client-side before paint
 * (`data-hv-reveal`), so no-JS sees a finished page; and everything animated
 * lives in a `createScope` reverted on unmount. The 3D card lift and hover zoom
 * are CSS. All of it stops under reduced motion.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const HV_EASE = 'out(3)';
const ENTER = 'bottom-=60 top';

/** Buttery inertial scrolling. Off under reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);
}

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  id?: string;
}

/** A plain rise. */
export function Reveal({ children, delay = 0, y = 22, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    el.dataset.hvReveal = 'pending';
    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 900,
        delay: delay * 1000,
        ease: HV_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });
    return () => {
      scope.revert();
      delete el.dataset.hvReveal;
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
  step = 0.08,
  delay = 0,
  y = 24,
  className,
  as: Tag = 'div',
}: RevealProps & { step?: number }) {
  const ref = useRef<HTMLElement>(null);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.hvReveal = 'pending';
    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 900,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: HV_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });
    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.hvReveal;
    };
  }, [step, delay, y]);
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Display type that rises out of clipped rows. One `<Line>` per line. */
export function LiftLines({ children, delay = 0, className, id, as: Tag = 'h2' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-hv-line]'));
    if (rows.length === 0) return undefined;
    const scope = createScope({ root: el }).add(() => {
      animate(rows, {
        translateY: ['112%', '0%'],
        duration: 1050,
        delay: stagger(90, { start: delay * 1000 }),
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
    <span className="hv-clip">
      <span data-hv-line className="block">
        {children}
      </span>
    </span>
  );
}

/** A plate unmasks from the bottom via clip-path as it enters. Client-only. */
export function ImageReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    el.style.clipPath = 'inset(100% 0 0 0)';
    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        clipPath: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
        duration: 1200,
        delay: delay * 1000,
        ease: 'out(4)',
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });
    return () => {
      scope.revert();
      el.style.clipPath = '';
    };
  }, [delay]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
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
        duration: 1600,
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
