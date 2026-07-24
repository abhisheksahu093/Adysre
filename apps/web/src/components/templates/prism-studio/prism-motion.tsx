'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from 'react';
import {
  animate,
  createScope,
  createTimeline,
  onScroll,
  stagger,
  svg,
  utils,
} from 'animejs';

/**
 * PRISM - the template's motion primitives, built on anime.js v4.
 *
 * This is the loudest of the four motion systems, and the only one built around
 * a scroll-linked TIMELINE rather than independent animations. Where Cirrus
 * scrubs a single chart, this scrubs a sequence: several elements share one
 * playhead, so their order is fixed relative to each other no matter how fast
 * the reader scrolls.
 *
 * The two structural decisions match the other templates, and are repeated here
 * because a downloaded template stands alone:
 *
 *   1. The SERVER renders everything visible and in its final position. The
 *      staged state is applied client-side in a layout effect, before paint.
 *   2. Everything is created inside `createScope`, so one `revert()` on unmount
 *      cleans up animations, timelines and scroll observers together.
 *
 * ─── The rule this template has to keep and the others do not ──────────────
 * Scroll-LINKED motion is not decoration: if it moves content, then with motion
 * disabled that content has to remain reachable some other way. The horizontal
 * gallery below is the case in point - under `prefers-reduced-motion` it stops
 * being a scrubbed rail and becomes an ordinary scrollable row, because
 * otherwise three quarters of the work would be unreachable.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const PRI_EASE = 'out(3)';
const ENTER = 'bottom-=60 top';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  /** Forwarded, so a section can be `aria-labelledby` its own heading. */
  id?: string;
}

/** A plain rise. */
export function Reveal({ children, delay = 0, y = 20, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.priReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 780,
        delay: delay * 1000,
        ease: PRI_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.priReveal;
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
  step = 0.06,
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
    for (const item of items) item.dataset.priReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 780,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: PRI_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.priReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Display type that rises out of clipped rows.
 *
 * Each child element is expected to be one line, wrapped by the caller. That is
 * deliberate rather than automatic: this template's headings are hand-broken
 * for the poster composition, so a splitter that re-broke them on resize would
 * fight the layout.
 */
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

    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-pri-line]'));
    if (rows.length === 0) return undefined;

    const scope = createScope({ root: el }).add(() => {
      animate(rows, {
        translateY: ['105%', '0%'],
        duration: 1000,
        delay: stagger(80, { start: delay * 1000 }),
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
    <span className="pri-clip">
      <span data-pri-line className="block">
        {children}
      </span>
    </span>
  );
}

/**
 * A horizontal rail of work, pushed sideways as the page scrolls past it.
 *
 * The section is tall; the rail is sticky inside it and translates on the
 * scroll playhead, which turns vertical scrolling into horizontal travel
 * without hijacking the scrollbar. Nothing here calls `preventDefault` - the
 * page scrolls normally throughout, which is the difference between this and
 * the scroll-jacking version of the same effect.
 *
 * Under reduced motion the transform is dropped and the rail becomes an
 * ordinary horizontally scrollable row (see prism.css), so every item stays
 * reachable.
 */
export function ScrollRail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const section = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const sectionEl = section.current;
    const railEl = rail.current;
    if (!sectionEl || !railEl || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: sectionEl }).add(() => {
      // Travel is whatever the rail overflows its viewport by, measured rather
      // than guessed, so adding a card changes the distance automatically.
      const travel = Math.max(0, railEl.scrollWidth - window.innerWidth + 48);
      if (travel === 0) return;

      animate(railEl, {
        translateX: [0, -travel],
        ease: 'linear',
        autoplay: onScroll({
          target: sectionEl,
          enter: 'top top',
          leave: 'bottom bottom',
          sync: 0.6,
        }),
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={section} className={className}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div ref={rail} className="pri-rail flex gap-6 pl-5 sm:pl-8">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * The process section: a marker that travels a curved path as you scroll, with
 * the path lighting up behind it.
 *
 * `createMotionPath` returns translateX/translateY/rotate as function values,
 * spread straight into the animation, so the marker follows the real geometry
 * of the `<path>` rather than an approximation of it. Both the marker and the
 * lit stroke share ONE timeline, so they can never drift apart no matter how
 * the reader scrolls.
 */
export function MotionPathTrack({
  steps,
  className,
}: {
  steps: readonly { title: string; body: string }[];
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: el }).add(() => {
      const path = createMotionPathSafely('.pri-path-guide');
      if (!path) return;

      const timeline = createTimeline({
        defaults: { ease: 'linear' },
        autoplay: onScroll({ target: el, enter: 'bottom-=80 top', leave: 'top+=80 bottom', sync: 0.55 }),
      });

      // The lit stroke and the marker are on one playhead, at position 0, so
      // the dot is always exactly where the line stops.
      timeline
        .add(svg.createDrawable('.pri-path-lit'), { draw: ['0 0', '0 1'], duration: 100 }, 0)
        .add(
          '.pri-marker',
          {
            translateX: path.translateX,
            translateY: path.translateY,
            rotate: path.rotate,
            duration: 100,
          },
          0,
        );
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      <svg viewBox="0 0 100 26" preserveAspectRatio="none" aria-hidden className="h-24 w-full sm:h-32">
        {/* The guide is the geometry; it is never painted. */}
        <path
          className="pri-path-guide"
          fill="none"
          stroke="none"
          d="M2,20 C22,20 22,6 42,6 C62,6 62,20 82,20 C90,20 94,14 98,10"
        />
        <path
          className="pri-path"
          d="M2,20 C22,20 22,6 42,6 C62,6 62,20 82,20 C90,20 94,14 98,10"
        />
        <path
          className="pri-path pri-path-lit"
          pathLength={1}
          d="M2,20 C22,20 22,6 42,6 C62,6 62,20 82,20 C90,20 94,14 98,10"
        />
        <circle className="pri-marker" r="2.4" fill="var(--pri-acid)" cx="0" cy="0" />
      </svg>

      <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="border-t border-[var(--pri-rule)] pt-5">
            <p className="pri-mono text-[var(--pri-acid)]">{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-3 text-[16px] font-medium tracking-tight">{step.title}</h3>
            <p className="mt-2 text-[14px] leading-[1.7] text-[var(--pri-ink-faint)]">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * `createMotionPath` throws if the selector matches nothing, which can happen
 * during a hot reload or if the SVG is still being laid out. A studio site
 * losing its marker is a cosmetic problem; it throwing is a blank page.
 */
function createMotionPathSafely(selector: string) {
  try {
    return svg.createMotionPath(selector);
  } catch {
    return null;
  }
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
        duration: 1300,
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
