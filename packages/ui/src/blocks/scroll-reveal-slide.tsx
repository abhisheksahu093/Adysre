'use client';

/**
 * Live preview for `scroll-reveal-slide`. Mirrors the `typescript` code variant.
 * The observer watches only this element; reduced motion / no observer shows it
 * immediately so content is never gated behind the animation.
 */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

type SlideFrom = 'left' | 'right' | 'up' | 'down';

interface ScrollRevealSlideProps {
  children: ReactNode;
  from?: SlideFrom;
  distance?: number;
  once?: boolean;
  className?: string;
}

export function ScrollRevealSlide({ children, from = 'left', distance = 40, once = true, className = '' }: ScrollRevealSlideProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const offsetX = from === 'left' ? -distance : from === 'right' ? distance : 0;
  const offsetY = from === 'up' ? -distance : from === 'down' ? distance : 0;
  const style: CSSProperties = visible
    ? { transform: 'translate(0, 0)', opacity: 1 }
    : { transform: `translate(${offsetX}px, ${offsetY}px)`, opacity: 0 };

  return (
    <div ref={ref} className={`transition-[transform,opacity] duration-700 ease-out motion-reduce:transition-none ${className}`} style={style}>
      {children}
    </div>
  );
}

export default function ScrollRevealSlidePreview() {
  return (
    <div className="w-full max-w-sm px-4">
      <ScrollRevealSlide from="left">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Slides into view</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Reveal panels as they enter the viewport, from any direction.</p>
        </div>
      </ScrollRevealSlide>
    </div>
  );
}
