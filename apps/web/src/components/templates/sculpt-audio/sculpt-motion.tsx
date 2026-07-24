'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';
import { animate, createDraggable, createScope, createSpring, onScroll, stagger, utils } from 'animejs';

/**
 * SCULPT - the template's motion primitives, built on anime.js v4.
 *
 * Where HALCYON's motion is optical (things fade and come into focus), this
 * template's is PHYSICAL: surfaces are objects, so they settle with weight and
 * push back when touched. Every entrance therefore uses a spring rather than a
 * bezier, and the one control on the site is genuinely draggable.
 *
 * The two structural decisions are the same as HALCYON's, and for the same
 * reasons - they are worth repeating here because a downloaded template stands
 * alone and this file is all its owner will read:
 *
 *   1. The SERVER renders everything visible. The hidden resting state is
 *      applied client-side in a layout effect, before paint, so a page whose
 *      script fails still shows its content.
 *   2. Everything is created inside `createScope`, which tracks animations,
 *      draggables AND scroll observers together, so one `revert()` on unmount
 *      cleans up all three. This template remounts on every page switch, so a
 *      leak would compound.
 */

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * The template's one spring. Slightly underdamped so a panel arrives with a
 * single, small overshoot - enough to read as mass, not enough to bounce.
 */
export const SCU_SPRING = createSpring({ mass: 1, stiffness: 120, damping: 16 });

/** Where a reveal fires: 60px before the element's top reaches the fold. */
const ENTER = 'bottom-=60 top';

export interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: ElementType;
}

/** Rises and settles into place once, the first time it is scrolled to. */
export function Reveal({ children, delay = 0, y = 24, className, as: Tag = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    el.dataset.scuReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(el, {
        opacity: [0, 1],
        translateY: [y, 0],
        delay: delay * 1000,
        ease: SCU_SPRING,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      delete el.dataset.scuReveal;
    };
  }, [delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * Springs its direct children in one after another from a single observer.
 *
 * Children come from the DOM rather than a selector, so a section never has to
 * add a marker class to participate.
 */
export function RevealGroup({
  children,
  step = 0.06,
  delay = 0,
  y = 26,
  className,
  as: Tag = 'div',
}: RevealProps & { step?: number }) {
  const ref = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.children) as HTMLElement[];
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.scuReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [y, 0],
        delay: stagger(step * 1000, { start: delay * 1000 }),
        ease: SCU_SPRING,
        autoplay: onScroll({ enter: ENTER, repeat: false }),
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.scuReveal;
    };
  }, [step, delay, y]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/**
 * A surface that depresses under the pointer and springs back on release.
 *
 * The depression is a class swap (the inset shadow lives in the stylesheet);
 * anime.js only animates the scale, because animating a box-shadow means the
 * browser repaints the blur on every frame and a soft UI is nothing but blur.
 */
export function PressSurface({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [pressed, setPressed] = useState(false);

  const press = (down: boolean) => {
    setPressed(down);
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    // Two calls rather than one with ternaries: going down is a fixed, fast
    // fade so the surface feels immediate under the finger, while coming back
    // up is the spring, so it settles with weight. They share no parameters.
    if (down) animate(el, { scale: 0.985, duration: 120, ease: 'out(3)' });
    else animate(el, { scale: 1, ease: SCU_SPRING });
  };

  return (
    <Tag
      ref={ref}
      className={[className, pressed ? 'scu-pressed' : ''].filter(Boolean).join(' ')}
      onPointerDown={() => press(true)}
      onPointerUp={() => press(false)}
      onPointerLeave={() => press(false)}
      onPointerCancel={() => press(false)}
    >
      {children}
    </Tag>
  );
}

/**
 * The signature control: a physical slider you actually drag.
 *
 * Uses anime.js `createDraggable` for the pointer physics - momentum on
 * release, container clamping, spring settle - and reports its position back as
 * a 0-100 value the section renders.
 *
 * ─── Why it is also a real `<input type="range">` ───────────────────────────
 * A div you can drag is not a control: it cannot be reached by Tab, operated by
 * arrow keys, or announced by a screen reader. So the slider IS a native range
 * input, visually hidden but focusable, and the neumorphic knob mirrors its
 * value. Dragging updates the input; keyboard updates the knob. One value, two
 * ways in, and the accessible one is the real one.
 */
export function DragSlider({
  label,
  value,
  onChange,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return undefined;

    const scope = createScope({ root: track }).add(() => {
      createDraggable(knob, {
        x: { snap: 1 },
        y: false,
        container: track,
        containerPadding: 0,
        releaseStiffness: 140,
        releaseDamping: 20,
        onUpdate: (draggable) => {
          const span = track.offsetWidth - knob.offsetWidth;
          if (span <= 0) return;
          const next = utils.clamp(Math.round((draggable.x / span) * 100), 0, 100);
          onChangeRef.current(next);
        },
      });
    });

    return () => scope.revert();
  }, []);

  // The knob follows `value` whenever it changes from the keyboard rather than
  // from a drag; during a drag anime.js owns the transform and this is a no-op
  // because the value it would write is the one already there.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    const knob = knobRef.current;
    if (!track || !knob) return;
    const span = track.offsetWidth - knob.offsetWidth;
    if (span <= 0) return;
    utils.set(knob, { x: (value / 100) * span });
  }, [value]);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor="scu-slider" className="scu-mono text-[var(--scu-ink-faint)]">
          {label}
        </label>
        <output htmlFor="scu-slider" className="scu-display text-[1.4rem] tabular-nums">
          {value}
          {suffix}
        </output>
      </div>

      <div ref={trackRef} className="scu-sunk relative mt-3 h-14 !rounded-full p-2">
        <div
          ref={knobRef}
          aria-hidden
          className="scu-raised scu-handle absolute left-2 top-2 h-10 w-10 !rounded-full"
        />
        {/* The real control. Visually hidden, fully operable, and the thing a
            screen reader announces. */}
        <input
          id="scu-slider"
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label={label}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>
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

/** The hero's on-load sequence, in document order. */
export function useHeroIntro<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-scu-intro]'));
    if (items.length === 0) return undefined;
    for (const item of items) item.dataset.scuReveal = 'pending';

    const scope = createScope({ root: el }).add(() => {
      animate(items, {
        opacity: [0, 1],
        translateY: [30, 0],
        delay: stagger(100, { start: 100 }),
        ease: SCU_SPRING,
      });
    });

    return () => {
      scope.revert();
      for (const item of items) delete item.dataset.scuReveal;
    };
  }, []);

  return ref;
}
