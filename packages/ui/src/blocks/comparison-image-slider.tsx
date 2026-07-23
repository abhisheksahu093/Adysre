'use client';

import { useCallback, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

/**
 * Live preview for `comparison-image-slider`.
 *
 * Mirrors the `typescript` code variant. The two photographs are inline SVG data
 * URIs so the preview never touches the network, and they are drawn to differ
 * across the whole frame - a wipe you cannot see is a wipe you cannot review.
 * Drag the handle, or focus it and use the arrow keys. Keep this in step with
 * `src/data/components/comparisons.ts`.
 *
 * The default export adds a page-section shell - padding plus a centred
 * max-width - which is preview-only; the component itself is width-agnostic
 * and takes its width from the caller.
 */
interface WipeImage {
  src: string;
  alt: string;
}

interface ComparisonImageSliderProps {
  before: WipeImage;
  after: WipeImage;
  defaultValue?: number;
  ariaLabel?: string;
  className?: string;
}

export function ComparisonImageSlider({
  before,
  after,
  defaultValue = 50,
  ariaLabel = 'Reveal the before image',
  className = '',
}: ComparisonImageSliderProps) {
  const [pos, setPos] = useState<number>(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);

  const clamp = (n: number): number => Math.min(100, Math.max(0, n));

  const fromPointer = useCallback((event: PointerEvent<HTMLDivElement>): void => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(clamp(((event.clientX - rect.left) / rect.width) * 100));
  }, []);

  /**
   * The keyboard contract for role="slider": arrows step, Shift steps by ten,
   * Home/End saturate. preventDefault stops ArrowUp/Down scrolling the page out
   * from under the control being operated.
   */
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const step = event.shiftKey ? 10 : 1;
    let next: number | null = null;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = pos - step;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = pos + step;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;

    if (next === null) return;
    event.preventDefault();
    setPos(clamp(next));
  }

  const rounded = Math.round(pos);

  return (
    <div
      ref={rootRef}
      className={`relative w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 ${className}`}
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        fromPointer(event);
      }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
      }}
    >
      { }
      <img className="block h-72 w-full object-cover" src={after.src} alt={after.alt} />

      {/* Both layers stay full size; clip-path hides the overflow, so the two
          pictures never slide against each other as the edge moves. */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        { }
        <img className="block h-72 w-full object-cover" src={before.src} alt={before.alt} />
      </div>

      <span
        className="pointer-events-none absolute left-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white"
        aria-hidden="true"
      >
        Before
      </span>
      <span
        className="pointer-events-none absolute right-3 top-3 rounded-full bg-gray-950/75 px-2 py-0.5 text-xs font-semibold text-white"
        aria-hidden="true"
      >
        After
      </span>

      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
        aria-valuetext={`${rounded}% before`}
        onKeyDown={onKeyDown}
        style={{ left: `${pos}%` }}
        className="absolute bottom-0 top-0 -ml-5 flex w-10 cursor-ew-resize items-center justify-center before:absolute before:bottom-0 before:left-1/2 before:top-0 before:-ml-px before:w-0.5 before:bg-white before:content-[''] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <span className="relative h-8 w-8 rounded-full border-2 border-white bg-gray-950/60" aria-hidden="true" />
      </div>
    </div>
  );
}

/**
 * A self-contained SVG "photograph" as a data URI - no network request, no
 * asset. `dim` mimics the un-renovated room so the two halves differ across the
 * whole frame rather than only where a caption sits.
 */
function room(sky: string, wall: string, floor: string, dim: boolean): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
    <rect width="320" height="180" fill="${wall}"/>
    <rect x="196" y="28" width="96" height="72" rx="4" fill="${sky}"/>
    <rect x="240" y="28" width="4" height="72" fill="${wall}"/>
    <rect x="196" y="60" width="96" height="4" fill="${wall}"/>
    <rect y="126" width="320" height="54" fill="${floor}"/>
    <rect x="28" y="72" width="132" height="54" rx="6" fill="${dim ? '#6b7280' : '#e5e7eb'}"/>
    <rect x="40" y="84" width="48" height="8" rx="4" fill="${dim ? '#9ca3af' : '#94a3b8'}"/>
    <circle cx="132" cy="99" r="9" fill="${dim ? '#9ca3af' : '#f59e0b'}"/>
    ${dim ? '' : '<rect x="44" y="136" width="232" height="30" rx="8" fill="#c7d2fe"/>'}
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const BEFORE: WipeImage = {
  src: room('#94a3b8', '#78716c', '#57534e', true),
  alt: 'The kitchen before: grey walls, a bare floor and a dated counter',
};

const AFTER: WipeImage = {
  src: room('#7dd3fc', '#f5f5f4', '#a8a29e', false),
  alt: 'The kitchen after: pale walls, a rug and a new counter under a bright window',
};

export default function ComparisonImageSliderPreview() {
  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <ComparisonImageSlider
          before={BEFORE}
          after={AFTER}
          ariaLabel="Reveal the kitchen before the renovation"
        />
      </div>
    </section>
  );
}
