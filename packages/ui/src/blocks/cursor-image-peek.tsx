'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `cursor-image-peek`.
 *
 * Mirrors the `typescript` code variant verbatim. The active item changes only
 * on enter/leave while the peek position is a transform on move. Keep this in
 * step with `src/data/components/cursors.ts`.
 */
interface PeekItem {
  label: string;
  href: string;
  gradient: string;
}

interface CursorImagePeekProps {
  items?: PeekItem[];
  className?: string;
}

const SAMPLE_ITEMS: PeekItem[] = [
  { label: 'Aurora Report 2026', href: '#', gradient: 'linear-gradient(135deg,#6366f1,#ec4899)' },
  { label: 'Field Notes', href: '#', gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { label: 'Case Study: Northwind', href: '#', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { label: 'Changelog', href: '#', gradient: 'linear-gradient(135deg,#10b981,#14b8a6)' },
];

export function CursorImagePeek({ items = SAMPLE_ITEMS, className = '' }: CursorImagePeekProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const peek = peekRef.current;
    if (!stage || !peek) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      peek.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    };
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  const activeItem = active === null ? undefined : items[active];

  return (
    <div
      ref={stageRef}
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((it, i) => (
          <li key={it.label}>
            <a
              href={it.href}
              className="block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div
        ref={peekRef}
        className={`pointer-events-none absolute left-0 top-0 transition-opacity duration-150 ${active === null ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      >
        <div
          className="h-24 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/20 shadow-lg"
          style={activeItem ? { backgroundImage: activeItem.gradient } : undefined}
        />
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function CursorImagePeekPreview() {
  return <CursorImagePeek />;
}
