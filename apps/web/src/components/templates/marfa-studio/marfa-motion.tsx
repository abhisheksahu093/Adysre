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
 * MARFA - the template's motion primitives, built on anime.js v4.
 *
 * The brief is the opposite of a loud portfolio: motion here serves reading,
 * never spectacle. Long durations, gentle eases, nothing that overshoots. The
 * two structural decisions match the other templates, and are repeated here
 * because a downloaded template stands alone:
 *
 *   1. The SERVER renders everything visible and in its final position. The
 *      staged state is applied client-side in a layout effect, before paint.
 *   2. Everything is created inside `createScope`, so one `revert()` on unmount
 *      cleans up animations and scroll observers together.
 *
 * ─── The two signatures ────────────────────────────────────────────────────
 * `Parallax` drifts a plate slower than the page inside a clipped frame - a
 * scroll-linked transform, so under reduced motion it drops to no movement.
 * `WordMask` lifts a headline word by word out of clipped rows, which HIDES the
 * words until it runs - so the pending state is applied by JS, never in the
 * SSR markup, and reduced motion resolves every word to visible.
 *
 * `MagneticThumb` is pure enhancement (it never hides anything) and only
 * engages for a real mouse.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const MAR_EASE = 'out(3)';
const ENTER = 'bottom-=56 top';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
  id?: string;
}

/** A plain rise. */
export function Reveal({ children, delay = 0, y = 18, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.marReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 950,
        delay: delay * 1000,
        ease: MAR_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.marReveal;
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
  y = 20,
  className,
  as: Tag = 'div',
}: RevealProps & { step?: number }) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.marReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 950,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: MAR_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.marReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A display headline that lifts word by word out of clipped rows.
 *
 * Split for motion, not layout: the text renders whole on the server (so it is
 * selectable and legible to a crawler), then is re-split into word spans on
 * mount only when motion is allowed. `aria-label` carries the real string, and
 * the wrapper keeps normal wrapping so a long headline still breaks to fit.
 */
export function WordMask({
  text,
  className,
  delay = 0,
  id,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  delay?: number;
  id?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const original = el.textContent ?? text;
    el.textContent = '';
    const inners = original.split(' ').map((word, i, arr) => {
      const clip = document.createElement('span');
      clip.className = 'mar-clip';
      clip.style.display = 'inline-block';
      clip.style.verticalAlign = 'top';
      const inner = document.createElement('span');
      inner.className = 'block';
      inner.textContent = word;
      clip.appendChild(inner);
      el.appendChild(clip);
      // A real space between words, so they wrap and read normally.
      if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      return inner;
    });

    const scope = createScope({ root: el }).add(() => {
      animate(inners, {
        translateY: ['110%', '0%'],
        duration: 1050,
        delay: stagger(70, { start: delay * 1000 }),
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
    <Tag ref={ref} id={id} className={className} aria-label={text}>
      {text}
    </Tag>
  );
}

/**
 * A plate that drifts slower than the page, inside a clipped frame.
 *
 * The inner is rendered taller than its frame (see marfa.css `.mar-parallax`)
 * so the drift never exposes an edge. The transform is scrubbed to the
 * scrollbar via `onScroll({ sync })`, and it is decorative - under reduced
 * motion the transform is simply never applied and the plate sits still.
 */
export function Parallax({
  className,
  plate,
  distance = 14,
  children,
}: {
  className?: string;
  plate?: string;
  distance?: number;
  children?: ReactNode;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const frameEl = frame.current;
    const innerEl = inner.current;
    if (!frameEl || !innerEl || prefersReducedMotion()) return undefined;

    const scope = createScope({ root: frameEl }).add(() => {
      animate(innerEl, {
        translateY: [`${distance}%`, `${-distance}%`],
        ease: 'linear',
        autoplay: onScroll({ target: frameEl, enter: 'top bottom', leave: 'bottom top', sync: 0.8 }),
      });
    });

    return () => scope.revert();
  }, [distance]);

  return (
    <div ref={frame} className={`mar-parallax relative overflow-hidden ${className ?? ''}`}>
      <div ref={inner} className={`mar-parallax-inner ${plate ?? ''}`}>
        {children}
      </div>
    </div>
  );
}

/**
 * A thumbnail that drifts gently toward the cursor.
 *
 * Pure enhancement: it wraps a real link, only engages for a mouse, and settles
 * with a short CSS transition (see marfa.css) rather than a per-frame tween.
 */
export function MagneticThumb({
  children,
  className,
  href,
  strength = 10,
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `translate(${(px * strength).toFixed(1)}px, ${(py * strength).toFixed(1)}px)`;
    };

    const onLeave = () => {
      el.style.transform = 'translate(0px, 0px)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <a ref={ref} href={href} className={`mar-magnetic ${className ?? ''}`}>
      {children}
    </a>
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
