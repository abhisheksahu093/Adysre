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
 * VESPER - the template's motion primitives.
 *
 * Two motion systems live here and they are deliberately different in kind:
 *
 *   1. SCROLL REVEALS (Reveal, RevealGroup, LiftLines, Counter) are built on
 *      anime.js v4, same contract as the other templates: the SERVER renders
 *      everything in its final state, the staged state is applied client-side
 *      in a layout effect before paint, and everything is created inside
 *      `createScope` so one `revert()` cleans up on unmount.
 *
 *   2. POINTER EFFECTS (Spotlight, TiltCard, MagneticButton, ScrollProgress)
 *      are pure enhancement. They never hide content, so there is nothing to
 *      protect against a missing script - the markup is already complete and
 *      usable, and these just make it respond to the cursor. Their smoothing
 *      comes from a short CSS transition on `transform` (see vesper.css) rather
 *      than a per-frame tween, which keeps them cheap.
 *
 * Every effect here is disabled under `prefers-reduced-motion`, and the
 * pointer ones additionally only engage for a real mouse (`pointerType ===
 * 'mouse'`), so a touch tap is never mistaken for a hover.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export const VES_EASE = 'out(3)';
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

    el.dataset.vesReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 820,
        delay: delay * 1000,
        ease: VES_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.vesReveal;
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
    for (const item of items) item.dataset.vesReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        duration: 820,
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: VES_EASE,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.vesReveal;
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

    const rows = Array.from(el.querySelectorAll<HTMLElement>('[data-ves-line]'));
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
    <span className="ves-clip">
      <span data-ves-line className="block">
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
        duration: 1400,
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

/* ── Pointer effects ──────────────────────────────────────────────────────
 * None of these hide content, so none of them touch the SSR markup. They read
 * the pointer and write a transform or a CSS variable; a browser that never
 * runs them shows a complete, static page. */

/**
 * A soft radial glow that follows the cursor.
 *
 * The glow is a CSS `::before` on the root (see vesper.css) positioned by two
 * custom properties. We only write those properties - never layout - and we do
 * it inside a `requestAnimationFrame` so several `pointermove` events in one
 * frame collapse to a single style write.
 */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    let frame = 0;
    let x = 50;
    let y = 40;

    const write = () => {
      frame = 0;
      el.style.setProperty('--ves-mx', `${x}%`);
      el.style.setProperty('--ves-my', `${y}%`);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      x = ((event.clientX - rect.left) / rect.width) * 100;
      y = ((event.clientY - rect.top) / rect.height) * 100;
      el.dataset.vesLit = 'on';
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onLeave = () => {
      el.dataset.vesLit = 'off';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div ref={ref} data-ves-lit="off" className={className}>
      {children}
    </div>
  );
}

/**
 * A card that tilts toward the pointer in 3D and settles back on leave.
 *
 * The tilt is a `perspective(...) rotateX rotateY` written straight to
 * `transform`; the settle is a short CSS transition on `.ves-tilt` (vesper.css),
 * so there is no per-frame tween to run. `max` caps the rotation so it reads as
 * a nudge, not a somersault.
 */
export function TiltCard({
  children,
  className,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
    };

    const onLeave = () => {
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [max]);

  return (
    <div ref={ref} className={`ves-tilt ${className ?? ''}`}>
      {children}
    </div>
  );
}

/**
 * A control that eases toward the cursor within a small radius.
 *
 * Rendered as whatever tag the caller needs (an anchor by default), so it keeps
 * being a real link: the magnetism is layered on top of a working control, not
 * instead of one. `strength` is how far, in px, it may drift.
 */
export function MagneticButton({
  children,
  className,
  href,
  type,
  onClick,
  strength = 14,
  as: Tag = 'a',
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  strength?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);

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
    <Tag
      ref={ref}
      href={href}
      type={Tag === 'button' ? (type ?? 'button') : undefined}
      onClick={onClick}
      className={`ves-magnetic ${className ?? ''}`}
    >
      {children}
    </Tag>
  );
}

/** A thin progress bar pinned to the top, scaled by how far the page is read. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    const onScrollEvent = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollEvent, { passive: true });
    window.addEventListener('resize', onScrollEvent, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScrollEvent);
      window.removeEventListener('resize', onScrollEvent);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left">
      <div ref={ref} className="h-full origin-left ves-grad-fill" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}
