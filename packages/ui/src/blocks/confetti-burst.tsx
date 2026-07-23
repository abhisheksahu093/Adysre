'use client';

/**
 * Live preview for `confetti-burst`. Mirrors the `typescript` code variant.
 * Particles are absolutely positioned inside this component's own wrapper -
 * nothing touches the document - and a reduced-motion click is a no-op.
 */
import { useCallback, useState } from 'react';
import type { CSSProperties } from 'react';

interface Particle {
  id: number;
  dx: number;
  dy: number;
  color: string;
  rotate: number;
}

const CONFETTI_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

interface ConfettiBurstProps {
  label?: string;
  particleCount?: number;
  className?: string;
}

export function ConfettiBurst({ label = 'Celebrate', particleCount = 24, className = '' }: ConfettiBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const fire = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const batch: Particle[] = Array.from({ length: particleCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 80;
      return {
        id: Date.now() + i,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 30,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length] ?? '#6366f1',
        rotate: Math.random() * 720 - 360,
      };
    });
    setParticles(batch);
    window.setTimeout(() => setParticles([]), 1000);
  }, [particleCount]);

  return (
    <>
      <style>{`
        @keyframes adysre-confetti {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)); opacity: 0; }
        }
      `}</style>
      <div className={`relative inline-flex ${className}`}>
        <div className="pointer-events-none absolute left-1/2 top-0 h-0 w-0" aria-hidden="true">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute h-2 w-2 rounded-sm"
              style={{
                backgroundColor: p.color,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
                '--rot': `${p.rotate}deg`,
                animation: 'adysre-confetti 900ms ease-out forwards',
              } as CSSProperties}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={fire}
          className="relative rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900"
        >
          {label}
        </button>
      </div>
    </>
  );
}

export default function ConfettiBurstPreview() {
  return (
    <div className="flex items-center justify-center pt-16">
      <ConfettiBurst label="Tap to celebrate" />
    </div>
  );
}

export const minHeight = 240;
