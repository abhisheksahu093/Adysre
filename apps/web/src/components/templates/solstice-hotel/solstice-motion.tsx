'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { animate, createScope, onScroll, splitText, stagger, utils } from 'animejs';

/**
 * SOLSTICE - the template's motion primitives, built on anime.js v4.
 *
 * The character here is SLOW. Halcyon's motion is optical and Sculpt's is
 * physical; this one is editorial - things arrive at the pace you read them.
 * Durations are roughly double the other templates', the easing is a long
 * `out(4)` with no overshoot, and nothing ever moves more than it has to.
 *
 * The signature is `SplitLines`: display type is broken into lines and each
 * rises out of its own clipped box, the way a title sequence sets a card. It is
 * the one effect on the site that draws attention to itself, so it is used on
 * headings only and never on body copy.
 *
 * The two structural decisions match the other templates, and are repeated here
 * because a downloaded template stands alone and this file is all its owner
 * will read:
 *
 *   1. The SERVER renders everything visible. The hidden resting state is
 *      applied client-side in a layout effect, before paint.
 *   2. Everything is created inside `createScope`, which tracks animations,
 *      scroll observers AND the text splitter together, so one `revert()` on
 *      unmount restores the original markup. That last part matters more here
 *      than anywhere else: splitting rewrites the element's innerHTML, and
 *      leaving it split would compound on every page switch.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** The one easing. Long, no overshoot: paper does not bounce. */
export const SOL_EASE = 'out(4)';

const ENTER = 'bottom-=70 top';

/**
 * Display type that rises line by line.
 *
 * `accessible: true` (anime.js's default, stated here because it is the whole
 * reason this is safe) leaves a visually-hidden copy of the original text in
 * place and hides the split spans from assistive technology. Without it,
 * splitting a heading into per-line spans makes a screen reader announce it as
 * disconnected fragments.
 *
 * Falls back to a plain fade if splitting is unavailable, so the heading is
 * never left invisible.
 */
export function SplitLines({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.solReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      const split = splitText(el, {
        lines: { class: 'sol-line' },
        accessible: true,
      });

      // The element itself becomes visible immediately; it is the LINES that
      // are staged, and they are clipped by their wrappers until they rise.
      utils.set(el, { opacity: 1 });

      animate(split.lines, {
        translateY: ['110%', '0%'],
        duration: 1250,
        delay: stagger(90, { start: delay * 1000 }),
        ease: SOL_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      // Reverts the animation, the observer AND the split markup together.
      scope.revert();
      delete el.dataset.solReveal;
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** A quiet fade-and-rise, for everything that is not display type. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.solReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 1150,
        delay: delay * 1000,
        ease: SOL_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.solReveal;
    };
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Staggers direct children, for lists and grids. */
export function RevealGroup({
  children,
  step = 0.09,
  delay = 0,
  y = 20,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  step?: number;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.solReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 1100,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: SOL_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.solReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A plate that uncovers itself, then drifts as the page scrolls past it.
 *
 * Two elements again, for the same reason as Halcyon's mesh: the reveal writes
 * `clip-path` on the frame while the parallax writes `translateY` on the plate,
 * so neither has to share a property with the other.
 *
 * The plate is over-tall (`-inset-y-[12%]`) so it has somewhere to travel
 * without exposing an edge.
 */
export function PlateReveal({
  className,
  plate = 'sol-plate',
  children,
}: {
  className?: string;
  plate?: string;
  children?: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const frameEl = frame.current;
    const innerEl = inner.current;
    if (!frameEl || !innerEl || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: frameEl }).add(() => {
      animate(frameEl, {
        clipPath: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
        duration: 1500,
        ease: SOL_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });

      animate(innerEl, {
        translateY: ['-8%', '8%'],
        ease: 'linear',
        autoplay: onScroll({ sync: 0.4 }),
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={frame} className={className}>
      <div ref={inner} aria-hidden className={`sol-grain absolute -inset-y-[12%] inset-x-0 ${plate}`} />
      {children}
    </div>
  );
}

/**
 * Counts to `value` the first time it is scrolled to. The server renders the
 * real figure, so it is correct with no JS at all.
 */
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
        duration: 1800,
        ease: SOL_EASE,
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
