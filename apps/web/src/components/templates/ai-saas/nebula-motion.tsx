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
 * NEBULA - motion primitives, built on Anime.js v4 with Lenis for smooth scroll.
 *
 * Two rules match the other templates and are repeated here because a downloaded
 * template stands alone: (1) the SERVER renders everything visible and final,
 * the staged state is applied client-side before paint (`data-neb-reveal`), so a
 * reader with no JS sees a finished page; (2) everything animated lives inside a
 * `createScope`, so one `revert()` on unmount cleans animations and observers
 * together. The ambient gradient mesh and floating glass are CSS (nebula.css),
 * so they cost nothing on the main thread and stop under reduced motion.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const NEB_EASE = 'out(3)';
const ENTER = 'bottom-=60 top';

/** Buttery inertial scrolling for the whole document. Off under reduced motion. */
export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.5 });
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

/** Pulls an element gently toward the cursor. The signature magnetic button. */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength * 1.2}px)`;
    };
    const reset = () => {
      el.style.transform = '';
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', reset);
    };
  }, [strength]);
  return ref;
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
    el.dataset.nebReveal = 'pending';
    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 900,
        delay: delay * 1000,
        ease: NEB_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });
    return () => {
      scope.revert();
      delete el.dataset.nebReveal;
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
    for (const item of items) item.dataset.nebReveal = 'pending';
    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 900,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: NEB_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });
    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.nebReveal;
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
    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-neb-line]'));
    if (rows.length === 0) return undefined;
    const scope = createScope({ root: el }).add(() => {
      animate(rows, {
        translateY: ['115%', '0%'],
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
    <span className="neb-clip">
      <span data-neb-line className="block">
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
