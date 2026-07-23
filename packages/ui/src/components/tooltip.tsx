'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../lib/cn';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TooltipProps {
  /** The text to show. Purely visual - see the accessibility note below. */
  label: string;
  /** Which side of the trigger the bubble sits on. */
  side?: TooltipSide;
  children: React.ReactNode;
  /** Classes for the wrapper that hosts the trigger. */
  className?: string;
  /** Skip the tooltip entirely (an expanded sidebar already shows its labels). */
  disabled?: boolean;
}

/**
 * Hover/focus label for a control that shows no text of its own.
 *
 * Portalled to `<body>` and positioned from the trigger's rect, because the
 * places that need it most are scroll containers: a collapsed icon rail sets
 * `overflow-y: auto`, which computes `overflow-x` to `auto` as well, and an
 * absolutely-positioned bubble inside would be clipped at the rail's edge or
 * add a horizontal scrollbar.
 *
 * ACCESSIBILITY: the bubble is `aria-hidden`. It is meant for icon-only controls
 * that already carry their own accessible name (`aria-label`, or visually hidden
 * text), so exposing it too would make a screen reader say the label twice. It
 * reinforces the name for sighted users; it never supplies it. A control with no
 * accessible name of its own must not rely on this.
 *
 * Native `title` would need no code at all, but it waits about a second, cannot
 * be styled to match the app, and never appears for keyboard focus.
 */
export function Tooltip({
  label,
  side = 'right',
  children,
  className,
  disabled = false,
}: TooltipProps) {
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = React.useCallback((): void => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setRect(null);
  }, []);

  const show = React.useCallback(
    (immediate: boolean): void => {
      if (disabled) return;
      const measure = (): void => {
        const wrapper = triggerRef.current;
        if (!wrapper) return;
        // The wrapper is `display: contents` by default so it adds no box to the
        // caller's layout - which also means it HAS no box to measure. The real
        // trigger is the child, so position against that.
        const target = wrapper.firstElementChild ?? wrapper;
        setRect(target.getBoundingClientRect());
      };
      if (immediate) {
        measure();
        return;
      }
      // A short delay so sweeping the cursor down a rail does not strobe a
      // bubble at every icon on the way past.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(measure, OPEN_DELAY_MS);
    },
    [disabled],
  );

  React.useEffect(() => hide, [hide]);

  // While it is open the bubble is pinned to coordinates that anything can
  // invalidate, so any scroll or resize dismisses it rather than leaving it
  // floating beside nothing.
  React.useEffect(() => {
    if (!rect) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') hide();
    };
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [rect, hide]);

  return (
    <>
      <span
        ref={triggerRef}
        className={cn('contents', className)}
        // A touch "hover" is just the start of a tap; showing a bubble there
        // puts a label under the finger that is already leaving.
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') show(false);
        }}
        onPointerLeave={hide}
        onPointerDown={hide}
        // Focus is immediate: a keyboard user has already committed to the
        // control, so there is nothing to debounce.
        onFocusCapture={() => show(true)}
        onBlurCapture={hide}
      >
        {children}
      </span>

      {rect !== null && typeof document !== 'undefined'
        ? createPortal(<Bubble label={label} side={side} rect={rect} />, document.body)
        : null}
    </>
  );
}

/** Delay before a pointer-triggered tooltip appears. */
const OPEN_DELAY_MS = 120;
/** Gap between the trigger and the bubble. */
const OFFSET = 8;

function Bubble({ label, side, rect }: { label: string; side: TooltipSide; rect: DOMRect }) {
  // Continuous values from a measurement, so they cannot be classes.
  const position: React.CSSProperties =
    side === 'right'
      ? { left: rect.right + OFFSET, top: rect.top + rect.height / 2, transform: 'translateY(-50%)' }
      : side === 'left'
        ? {
            left: rect.left - OFFSET,
            top: rect.top + rect.height / 2,
            transform: 'translate(-100%, -50%)',
          }
        : side === 'top'
          ? {
              left: rect.left + rect.width / 2,
              top: rect.top - OFFSET,
              transform: 'translate(-50%, -100%)',
            }
          : {
              left: rect.left + rect.width / 2,
              top: rect.bottom + OFFSET,
              transform: 'translateX(-50%)',
            };

  return (
    <span
      role="tooltip"
      aria-hidden
      style={position}
      // `card` rather than a dedicated popover token: this theme has no popover
      // scale, and every other floating surface here (menus, dialogs) is built
      // on card + border, so a new one-off token would only drift from them.
      className={cn(
        'pointer-events-none fixed z-[100] max-w-56 truncate rounded-md border border-border',
        'bg-card px-2 py-1 text-xs font-medium text-foreground shadow-lg',
      )}
    >
      {label}
    </span>
  );
}
