'use client';

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { animate, createScope, onScroll, stagger, svg, utils } from 'animejs';

/**
 * CIRRUS - the template's motion primitives, built on anime.js v4.
 *
 * The character is PRECISION. Where Solstice is slow and Sculpt has weight,
 * this one is quick and exact: short travel (12px, not 26), short durations
 * (560ms, not 1250), and nothing overshoots. An instrument that bounces is not
 * an instrument.
 *
 * The signature is `ScrollChart`: an SVG line that draws itself in step with
 * the scrollbar rather than on a timer. It is the one place in these four
 * templates where the animation is SCRUBBED (`onScroll({ sync })`) rather than
 * triggered, and that difference is the whole point - the reader controls the
 * reveal, so the chart reads as data being plotted rather than as decoration.
 *
 * The structural decisions match the other templates and are repeated here
 * because a downloaded template stands alone:
 *
 *   1. The SERVER renders everything visible, including a fully drawn chart.
 *      The hidden state is applied client-side in a layout effect, before
 *      paint, so a page whose script fails still shows its content and its data.
 *   2. Everything is created inside `createScope`, so one `revert()` on unmount
 *      cleans up animations and scroll observers together.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** The one easing. Fast out, clean stop, no overshoot. */
export const CIR_EASE = 'out(3)';

const ENTER = 'bottom-=50 top';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}

/** A short, exact rise. */
export function Reveal({ children, delay = 0, y = 12, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.cirReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 560,
        delay: delay * 1000,
        ease: CIR_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.cirReveal;
    };
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children on a tight interval. */
export function RevealGroup({
  children,
  step = 0.045,
  delay = 0,
  y = 12,
  className,
  as: Tag = 'div',
}: RevealProps & { step?: number }) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.cirReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 560,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: CIR_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.cirReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Build an SVG path from a series, in a 100x40 user space.
 *
 * Pure, and exported, so the same geometry can be asserted in a test without a
 * DOM. The viewBox is deliberately small and the stroke is
 * `vector-effect: non-scaling-stroke`, so the chart scales to any container
 * without the line getting fatter.
 */
export function seriesPath(values: readonly number[]): { line: string; area: string } {
  if (values.length < 2) return { line: '', area: '' };

  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const points = values.map((value, i) => {
    const x = (i / (values.length - 1)) * 100;
    // SVG y grows downward, so the tallest value gets the smallest y.
    const y = 40 - ((value - min) / span) * 34 - 3;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  const line = `M${points.join(' L')}`;
  const area = `${line} L100,40 L0,40 Z`;
  return { line, area };
}

/**
 * A line chart that draws itself in step with the scrollbar.
 *
 * `pathLength={1}` on the path normalises its length, so the `draw` values are
 * fractions no matter what data is plotted - which is what lets this component
 * take an arbitrary series without recalculating anything.
 *
 * The server renders the line COMPLETE. Only on mount does the client set it
 * back to zero and hand it to the scroll observer, so the chart is never
 * missing for a reader without JavaScript.
 */
export function ScrollChart({
  values,
  label,
  caption,
  className,
}: {
  values: readonly number[];
  /** Announced to assistive tech, which cannot read a line. */
  label: string;
  caption?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { line, area } = seriesPath(values);
  const gradientId = useId();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: el }).add(() => {
      const drawables = svg.createDrawable('.cir-line');

      // Scrubbed, not triggered: the reader's scroll position IS the playhead,
      // so the line plots as they read down the page and un-plots on the way
      // back up.
      animate(drawables, {
        draw: ['0 0', '0 1'],
        ease: 'linear',
        autoplay: onScroll({
          target: el,
          enter: 'bottom-=40 top',
          leave: 'top+=40 bottom',
          sync: 0.5,
        }),
      });

      // The fill follows the line rather than leading it.
      animate('.cir-area', {
        opacity: [0, 1],
        duration: 700,
        ease: CIR_EASE,
        autoplay: onScroll({ target: el, enter: 'bottom-=60 top', repeat: false }),
      });
    });

    return () => scope.revert();
  }, [line]);

  return (
    <figure ref={ref} className={className}>
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        role="img"
        aria-label={label}
        className="h-full w-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--cir-accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--cir-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path className="cir-area" d={area} fill={`url(#${gradientId})`} />
        <path className="cir-line" d={line} pathLength={1} />
      </svg>
      {caption && (
        <figcaption className="cir-mono mt-3 text-[var(--cir-ink-faint)]">{caption}</figcaption>
      )}
    </figure>
  );
}

/**
 * A bar series that grows as it enters view. Bars are divs rather than SVG,
 * because they need no path and a transform is cheaper than a reflow.
 */
export function ScrollBars({
  values,
  label,
  className,
}: {
  values: readonly number[];
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const max = Math.max(...values, 1);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const bars = Array.from(el.querySelectorAll<HTMLElement>('[data-cir-bar]'));
    if (bars.length === 0) return undefined;

    const scope = createScope({ root: el }).add(() => {
      animate(bars, {
        scaleY: [0, 1],
        duration: 720,
        delay: stagger(45),
        ease: CIR_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={ref} role="img" aria-label={label} className={className}>
      <div className="flex h-full items-end gap-1.5">
        {values.map((value, i) => (
          <span
            key={i}
            data-cir-bar
            style={{ height: `${Math.round((value / max) * 100)}%`, transformOrigin: 'bottom' }}
            className="flex-1 rounded-[3px] bg-[var(--cir-accent)]"
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Counts to `value` the first time it is scrolled to. The server renders the
 * real figure, so it is correct with no JS at all.
 */
export function Counter({
  value,
  suffix = '',
  prefix = '',
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const format = (n: number) =>
    `${prefix}${n.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}${suffix}`;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const state = { n: 0 };
    el.textContent = format(0);

    const scope = createScope({ root: el }).add(() => {
      animate(state, {
        n: value,
        duration: 1200,
        ease: 'out(4)',
        modifier: decimals === 0 ? utils.round(0) : utils.round(decimals),
        onUpdate: () => {
          el.textContent = format(state.n);
        },
        autoplay: onScroll({ enter: 'bottom-=40 top', repeat: false }),
      });
    });

    return () => {
      scope.revert();
      el.textContent = format(value);
    };
    // `format` closes over the three formatting props, which are the deps.
  }, [value, suffix, prefix, decimals]);

  return <span ref={ref}>{format(value)}</span>;
}
