'use client';

/**
 * Live preview for `card-tilt-3d`. Mirrors the `typescript` code variant.
 * Tilt tracking is scoped to the card, gated on `(pointer: fine)` so touch
 * devices get a static card, and disabled under reduced motion.
 */
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface CardTilt3DProps {
  children: ReactNode;
  maxTiltDeg?: number;
  className?: string;
}

export function CardTilt3D({ children, maxTiltDeg = 12, className = '' }: CardTilt3DProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      node.style.transform = `perspective(800px) rotateY(${px * maxTiltDeg * 2}deg) rotateX(${-py * maxTiltDeg * 2}deg)`;
    };
    const reset = () => {
      node.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
    };
  }, [maxTiltDeg]);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-transform duration-200 ease-out will-change-transform motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {children}
    </div>
  );
}

export default function CardTilt3DPreview() {
  return (
    <div className="w-full max-w-xs px-4">
      <CardTilt3D>
        <div className="mb-4 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600" aria-hidden="true" />
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Tilt me</h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Move your cursor across the card to see it respond in 3D.</p>
      </CardTilt3D>
    </div>
  );
}

export const minHeight = 240;
