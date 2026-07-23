'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

/**
 * Live preview for `fab-draggable-visual`.
 *
 * Preview-only changes from the `typescript` code variant: the button is
 * `absolute` inside this bounded card rather than `fixed`, the focus ring offset
 * matches this card (`ring-offset-gray-50`), and the position is CLAMPED to the
 * card so the demo control can never be dragged out of view. The shipped
 * component leaves clamping to the app. Pointer drag and the arrow keys both
 * move it, so the reposition is not mouse-only.
 *
 * Keep this in step with `src/data/components/fab.ts`.
 */
const STEP = 16;
const BUTTON = 56;
const MARGIN = 24;

interface DragState {
  active: boolean;
  sx: number;
  sy: number;
  ox: number;
  oy: number;
}

export const minHeight = 256;

export function FabDraggableVisual() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const drag = useRef<DragState>({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const clamp = (x: number, y: number): { x: number; y: number } => {
    const box = containerRef.current;
    if (!box) return { x, y };
    const minX = -(box.clientWidth - BUTTON - MARGIN * 2);
    const minY = -(box.clientHeight - BUTTON - MARGIN * 2);
    return {
      x: Math.min(0, Math.max(minX, x)),
      y: Math.min(0, Math.max(minY, y)),
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>): void => {
    drag.current = { active: true, sx: event.clientX, sy: event.clientY, ox: pos.x, oy: pos.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>): void => {
    if (!drag.current.active) return;
    setPos(clamp(drag.current.ox + (event.clientX - drag.current.sx), drag.current.oy + (event.clientY - drag.current.sy)));
  };
  const onPointerUp = (): void => {
    drag.current.active = false;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowUp') setPos((p) => clamp(p.x, p.y - STEP));
    else if (event.key === 'ArrowDown') setPos((p) => clamp(p.x, p.y + STEP));
    else if (event.key === 'ArrowLeft') setPos((p) => clamp(p.x - STEP, p.y));
    else if (event.key === 'ArrowRight') setPos((p) => clamp(p.x + STEP, p.y));
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="relative min-h-64 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950"
    >
      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">
        Drag the button, or focus it and use the arrow keys - it stays inside the card.
      </p>

      <button
        type="button"
        aria-label="Quick add, draggable - use arrow keys to move"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onKeyDown={onKeyDown}
        style={{ transform: 'translate(' + pos.x + 'px, ' + pos.y + 'px)' }}
        className="absolute bottom-6 right-6 z-40 inline-flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 active:cursor-grabbing dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <circle cx="9" cy="6" r="1.6" />
          <circle cx="15" cy="6" r="1.6" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <circle cx="9" cy="18" r="1.6" />
          <circle cx="15" cy="18" r="1.6" />
        </svg>
      </button>
    </div>
  );
}


export default FabDraggableVisual;
