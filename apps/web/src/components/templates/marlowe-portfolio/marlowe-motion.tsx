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
 * MARLOWE - the template's motion primitives, built on anime.js v4.
 *
 * The two structural decisions match the other templates, and are repeated here
 * because a downloaded template stands alone:
 *
 *   1. The SERVER renders everything visible and in its FINAL state - full-width
 *      skill bars, the real counter figures. The staged/from state is applied
 *      client-side in a layout effect, before paint, so a reader with no
 *      JavaScript sees a finished page rather than empty bars.
 *   2. Everything is created inside `createScope`, so one `revert()` on unmount
 *      cleans up animations and scroll observers together.
 *
 * The signature here is `SkillBar`: a proficiency bar that fills from zero to
 * its value as it scrolls into view. Because the bar HIDES information until it
 * runs (an empty bar reads as "no skill"), the zero state is applied by JS and
 * reduced motion leaves the bar at its real width.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const MLW_EASE = 'out(3)';
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

    el.dataset.mlwReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 860,
        delay: delay * 1000,
        ease: MLW_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.mlwReveal;
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
    for (const item of items) item.dataset.mlwReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 860,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: MLW_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.mlwReveal;
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

    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-mlw-line]'));
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
    <span className="mlw-clip">
      <span data-mlw-line className="block">
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

/**
 * A proficiency bar that fills to `level`% as it scrolls into view.
 *
 * The fill is rendered at its true width on the server, so a no-script reader
 * sees the real figure. On mount (motion allowed) it is set to 0 and animated
 * up, scrubbed a little to the scrollbar so it fills as you arrive. Reduced
 * motion leaves it at its true width.
 */
export function SkillBar({
  name,
  level,
  className,
}: {
  name: string;
  level: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.style.width = '0%';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        width: ['0%', `${level}%`],
        duration: 1200,
        ease: 'out(4)',
        autoplay: onScroll({ enter: 'bottom-=40 top', repeat: false }),
      });
    });

    return () => {
      scope.revert();
      el.style.width = `${level}%`;
    };
  }, [level]);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-medium text-[var(--mlw-ink)]">{name}</span>
        <span className="mlw-mono text-[var(--mlw-ink-faint)]">{level}%</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--mlw-line)]"
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={name}
      >
        <div ref={ref} className="mlw-skill-fill h-full rounded-full" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}
