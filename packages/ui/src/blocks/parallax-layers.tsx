'use client';

/**
 * Live preview for `parallax-layers`. Mirrors the `typescript` code variant.
 * Pointer tracking is scoped to this container only, gated on a fine pointer,
 * and disabled under reduced motion - it never listens on the document.
 */
import { useEffect, useRef } from 'react';

interface ParallaxLayersProps {
  className?: string;
  strength?: number;
}

export function ParallaxLayers({ className = '', strength = 40 }: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const layers = Array.from(node.querySelectorAll<HTMLElement>('[data-depth]'));
    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? '0');
        layer.style.transform = `translate3d(${px * depth * strength}px, ${py * depth * strength}px, 0)`;
      }
    };
    const reset = () => {
      for (const layer of layers) layer.style.transform = 'translate3d(0, 0, 0)';
    };

    node.addEventListener('pointermove', onMove);
    node.addEventListener('pointerleave', reset);
    return () => {
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', reset);
    };
  }, [strength]);

  return (
    <div
      ref={ref}
      className={`relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 ${className}`}
    >
      <span data-depth="1" className="absolute left-8 top-8 h-16 w-16 rounded-full bg-white/20 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <span data-depth="2" className="absolute right-10 top-12 h-10 w-10 rounded-lg bg-white/30 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <span data-depth="3" className="absolute bottom-10 left-1/3 h-20 w-20 rounded-full bg-amber-300/40 transition-transform duration-200 ease-out will-change-transform" aria-hidden="true" />
      <div data-depth="1.5" className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out will-change-transform">
        <p className="text-lg font-bold text-white drop-shadow">Move your cursor</p>
      </div>
    </div>
  );
}

export default function ParallaxLayersPreview() {
  return (
    <div className="h-56 w-full max-w-sm px-4">
      <ParallaxLayers />
    </div>
  );
}

export const minHeight = 280;
