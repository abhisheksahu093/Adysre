'use client';

/**
 * Live preview for `stagger-reveal-grid`.
 *
 * Mirrors the `typescript` code variant (minus the JSX.Element annotation, per
 * the preview convention). Keep in step with `src/data/components/animation.ts`.
 */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

interface StaggerRevealGridProps {
  items: ReactNode[];
  minItemWidth?: number;
  staggerMs?: number;
  distance?: number;
  once?: boolean;
  className?: string;
}

export function StaggerRevealGrid({
  items,
  minItemWidth = 180,
  staggerMs = 90,
  distance = 16,
  once = true,
  className = '',
}: StaggerRevealGridProps) {
  const ref = useRef<HTMLUListElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
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
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const gridStyle: CSSProperties = {
    gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${minItemWidth}px), 1fr))`,
  };

  return (
    <ul ref={ref} className={`grid gap-3 ${className}`} style={gridStyle}>
      {items.map((item, index) => (
        <li
          key={index}
          className={`rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700 shadow-sm transition duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transform: visible ? 'translateY(0)' : `translateY(${distance}px)`,
            transitionDelay: visible ? `${index * staggerMs}ms` : '0ms',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export const minHeight = 260;

export default function StaggerRevealGridPreview() {
  return (
    <div className="w-full max-w-xl px-4">
      <StaggerRevealGrid
        items={[
          'Realtime sync',
          'Edge caching',
          'Audit logs',
          'SSO & SCIM',
          'Usage analytics',
          'Role-based access',
        ]}
        minItemWidth={150}
      />
    </div>
  );
}
