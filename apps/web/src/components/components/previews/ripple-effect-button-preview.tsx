'use client';

/**
 * Live preview for `ripple-effect-button`. Mirrors the `typescript` code variant.
 * The ripple spawns at the click point and is scoped to the button itself.
 */
import { useCallback, useState } from 'react';
import type { CSSProperties, MouseEvent, ReactNode } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleEffectButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

function RippleEffectButton({ children, className = '', onClick }: RippleEffectButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const id = Date.now();
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        setRipples((prev) => [...prev, { id, x, y, size }]);
        window.setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
      }
      onClick?.(event);
    },
    [onClick],
  );

  return (
    <>
      <style>{`@keyframes adysre-ripple { to { transform: scale(2.4); opacity: 0; } }`}</style>
      <button
        type="button"
        onClick={handleClick}
        className={`relative overflow-hidden rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden="true"
            className="pointer-events-none absolute rounded-full bg-white/40"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size, animation: 'adysre-ripple 600ms ease-out forwards' } as CSSProperties}
          />
        ))}
        <span className="relative">{children}</span>
      </button>
    </>
  );
}

export default function RippleEffectButtonPreview() {
  return <RippleEffectButton>Click me</RippleEffectButton>;
}
