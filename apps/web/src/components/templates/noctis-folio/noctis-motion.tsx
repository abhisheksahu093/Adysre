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
 * NOCTIS - the template's motion primitives, built on anime.js v4.
 *
 * Tuned to feel like a slow shutter rather than a bounce: long durations, a
 * heavy ease-out, nothing that overshoots. Two structural decisions match the
 * other templates, and are repeated here because a downloaded template stands
 * alone:
 *
 *   1. The SERVER renders everything visible and in its final position. The
 *      staged state is applied client-side in a layout effect, before paint, so
 *      a reader with JavaScript off sees the finished page rather than a blank.
 *   2. Everything is created inside `createScope`, so one `revert()` on unmount
 *      cleans up animations and scroll observers together.
 *
 * ─── The signature: the curtain wipe ──────────────────────────────────────
 * NOCTIS is a photography site, so its motion is about images arriving. Rather
 * than fade a plate in, `CurtainReveal` animates a clip-path inset from one
 * edge, so the picture is drawn open like a darkroom print coming up. The
 * animated property is `clipPath`, which the compositor handles, so it stays
 * smooth on a phone.
 *
 * The rule this template keeps: a clip-path reveal HIDES content until it runs.
 * If the script never runs, or the reader has asked for less motion, the
 * content has to be visible anyway - so the pending clip lives in a `data-`
 * attribute set by JS, never in the SSR markup, and reduced motion clears it.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const NOC_EASE = 'out(3)';
const ENTER = 'bottom-=64 top';

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

    el.dataset.nocReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 900,
        delay: delay * 1000,
        ease: NOC_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.nocReveal;
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
    for (const item of items) item.dataset.nocReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 900,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: NOC_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.nocReveal;
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
 * Each child element is expected to be one line, wrapped by the caller with
 * `<Line>`. That is deliberate: this template's headings are hand-broken for
 * the composition, so an automatic splitter that re-broke them on resize would
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

    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-noc-line]'));
    if (rows.length === 0) return undefined;

    const scope = createScope({ root: el }).add(() => {
      animate(rows, {
        translateY: ['110%', '0%'],
        duration: 1100,
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
    <span className="noc-clip">
      <span data-noc-line className="block">
        {children}
      </span>
    </span>
  );
}

/**
 * A hero headline whose letters cascade up one at a time.
 *
 * Splitting for motion, not for layout: the text is rendered whole on the
 * server (so it is selectable and reads to a crawler), then re-split into spans
 * on mount only when motion is allowed. `aria-label` carries the real string so
 * a screen reader never hears it letter by letter.
 */
export function LetterCascade({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const original = el.textContent ?? text;
    el.textContent = '';
    const spans = Array.from(original).map((char) => {
      const outer = document.createElement('span');
      outer.className = 'noc-clip';
      outer.style.display = 'inline-block';
      const inner = document.createElement('span');
      inner.className = 'block';
      // A space cannot be an inline-block on its own; a non-breaking space holds.
      inner.textContent = char === ' ' ? ' ' : char;
      outer.appendChild(inner);
      el.appendChild(outer);
      return inner;
    });

    const scope = createScope({ root: el }).add(() => {
      animate(spans, {
        translateY: ['115%', '0%'],
        duration: 1000,
        delay: stagger(34, { start: delay * 1000 }),
        ease: 'out(4)',
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      el.textContent = original;
    };
  }, [text, delay]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}

/**
 * The curtain wipe: a plate drawn open with an animated clip-path.
 *
 * The pending clip is applied by JS in the layout effect and cleared on
 * revert, so it is never in the SSR markup - a plate that the script never
 * reaches stays fully visible. Under reduced motion this whole effect is
 * skipped and the plate is shown at once.
 *
 * `from` picks the edge the curtain opens from, which lets a grid alternate
 * direction so the page does not feel mechanical.
 */
export function CurtainReveal({
  children,
  className,
  from = 'bottom',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: 'bottom' | 'left' | 'right';
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const closed =
      from === 'left'
        ? 'inset(0 100% 0 0)'
        : from === 'right'
          ? 'inset(0 0 0 100%)'
          : 'inset(100% 0 0 0)';
    const open = 'inset(0% 0 0 0)';

    el.style.clipPath = closed;

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        clipPath: [closed, open],
        duration: 1200,
        delay: delay * 1000,
        ease: 'inOut(3)',
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      el.style.clipPath = '';
    };
  }, [from, delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * A horizontal film-strip of series, pushed sideways as the page scrolls past.
 *
 * The section is tall; the strip is sticky inside it and translated on the
 * scroll playhead, which turns vertical scrolling into horizontal travel
 * without hijacking the scrollbar - nothing here calls `preventDefault`.
 *
 * Under reduced motion the transform is dropped and the strip becomes an
 * ordinary horizontally scrollable row (see noctis.css), so every frame stays
 * reachable.
 */
export function FilmStrip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const section = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const sectionEl = section.current;
    const stripEl = strip.current;
    if (!sectionEl || !stripEl || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: sectionEl }).add(() => {
      // Travel is whatever the strip overflows its viewport by, measured rather
      // than guessed, so adding a frame changes the distance automatically.
      const travel = Math.max(0, stripEl.scrollWidth - window.innerWidth + 48);
      if (travel === 0) return;

      animate(stripEl, {
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
        <div ref={strip} className="noc-strip flex gap-6 pl-5 sm:pl-8">
          {children}
        </div>
      </div>
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
