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
 * HALCYON - the template's motion primitives, built on anime.js v4.
 *
 * Every section composes these rather than declaring its own animation, so five
 * pages share one entrance and one easing. The easing is `out(3)` throughout:
 * a fast departure and a long settle, which is what makes a product page feel
 * engineered rather than bouncy.
 *
 * ─── Two decisions worth knowing before you edit ────────────────────────────
 *
 * 1. THE SERVER RENDERS EVERYTHING VISIBLE. The hidden resting state is applied
 *    by `data-hal-reveal="pending"` in a layout effect, i.e. on the client and
 *    before paint. The obvious alternative - `style={{ opacity: 0 }}` in the
 *    markup - ships a page whose content never appears if the script fails to
 *    load, and search engines and Reader modes see an empty document. This way
 *    the no-JS outcome is "no animation", not "no content".
 *
 * 2. EVERYTHING IS CREATED INSIDE A SCOPE. `createScope({ root })` tracks the
 *    animations AND the scroll observers made inside it, so one `revert()` on
 *    unmount removes both and restores the original styles. Reverting the
 *    animation alone would leak the observer, and this template switches pages
 *    by remounting - so a leak compounds on every navigation.
 *
 * Reduced motion is handled by bailing before anything is created, so the
 * markup keeps its natural styles. The stylesheet backs this up with a
 * `!important` reset in case a scope is ever created before the check.
 */

/** `useLayoutEffect` on the client, `useEffect` on the server (which no-ops). */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** Read at call time, not module scope, so a change of setting is picked up. */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** The one easing. Named so no section can drift from it. */
export const HAL_EASE = 'out(3)';

/** Where a reveal fires: 64px before the element's top reaches the fold. */
const ENTER = 'bottom-=64 top';

export interface RevealProps {
  children: ReactNode;
  /** Seconds of head start, for deliberate sequencing within a section. */
  delay?: number;
  /** Travel distance in px. 0 gives a pure fade, for text that must not shift. */
  y?: number;
  /** Focus-pull. Off for large type, where blurring reads as a rendering bug. */
  blur?: boolean;
  className?: string;
  as?: ElementType;
}

/**
 * Fade, rise and focus into view once, the first time it is scrolled to.
 *
 * `repeat: false` matters on a multipage template: switching pages remounts
 * every section, and a re-triggering reveal reads as a flicker.
 */
export function Reveal({
  children,
  delay = 0,
  y = 22,
  blur = true,
  className,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.halReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        ...(blur ? { filter: ['blur(10px)', 'blur(0px)'] } : {}),
        duration: 900,
        delay: delay * 1000,
        ease: HAL_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.halReveal;
    };
  }, [delay, y, blur]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Reveals its direct children one after another from a single scroll observer.
 *
 * A grid of twelve cards with twelve observers is twelve times the work for an
 * effect the eye reads as one gesture. Children are taken from the DOM rather
 * than a selector so a section never has to add a marker class.
 */
export function RevealGroup({
  children,
  step = 0.07,
  delay = 0,
  y = 26,
  className,
  as: Tag = 'div',
}: Omit<RevealProps, 'blur'> & { step?: number }) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;

    for (const item of items) item.dataset.halReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 820,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: HAL_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.halReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Counts to `value` the first time it is scrolled to.
 *
 * anime.js animates a plain object and we write the formatted number out on
 * each update, which keeps the DOM write to one text node. Under reduced motion
 * the final value is rendered immediately - a ticking counter is decoration,
 * the number is the information.
 */
export function Counter({
  value,
  suffix = '',
  prefix = '',
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (prefersReducedMotion()) return undefined;

    const state = { n: 0 };
    el.textContent = `${prefix}0${suffix}`;

    const scope = createScope({ root: el }).add(() => {
      animate(state, {
        n: value,
        duration: 1500,
        ease: 'out(4)',
        modifier: utils.round(0),
        onUpdate: () => {
          el.textContent = `${prefix}${state.n.toLocaleString('en-US')}${suffix}`;
        },
        autoplay: onScroll({ enter: 'bottom-=40 top', repeat: false }),
      });
    });

    return () => {
      scope.revert();
      el.textContent = `${prefix}${value.toLocaleString('en-US')}${suffix}`;
    };
  }, [value, suffix, prefix]);

  // The server renders the real figure, so it is correct with no JS at all.
  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}

/**
 * The animated colour field behind the whole site.
 *
 * Two elements, deliberately: the outer one is scroll-linked (`sync`), the
 * inner one drifts on a long loop. Putting both on one element would mean two
 * animations competing for `transform`, and the last writer would win. Split,
 * each owns its own element and the compositor handles both.
 *
 * Nothing here repaints - the gradient is static and only ever transformed,
 * which is the difference between a backdrop that costs nothing and one that
 * pins a laptop fan.
 */
export function Mesh({ className }: { className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const outerEl = outer.current;
    const innerEl = inner.current;
    if (!outerEl || !innerEl || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: outerEl }).add(() => {
      // Parallax: the field lags the page, so depth reads without a 3D layer.
      animate(outerEl, {
        translateY: ['-6%', '10%'],
        ease: 'linear',
        autoplay: onScroll({ sync: 0.35 }),
      });

      // Drift: slow, never resolving, so it is never "finished" on screen.
      animate(innerEl, {
        scale: [1, 1.22],
        rotate: [0, 9],
        translateX: ['-3%', '3%'],
        duration: 22000,
        ease: 'inOut(2)',
        loop: true,
        alternate: true,
      });
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={outer} aria-hidden className={className}>
      <div ref={inner} className="hal-mesh absolute inset-[-18%]" />
    </div>
  );
}

/**
 * The hero's opening sequence: the only animation on the site that plays on
 * load rather than on scroll, because it is already in view.
 *
 * Children animate in document order. Returns a ref for the container.
 */
export function useHeroIntro<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-hal-intro]'));
    if (items.length === 0) return undefined;

    for (const item of items) item.dataset.halReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [28, 0],
        filter: ['blur(14px)', 'blur(0px)'],
        duration: 1100,
        delay: stagger(110, { start: 120 }),
        ease: HAL_EASE,
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.halReveal;
    };
  }, []);

  return ref;
}
