/**
 * Live preview for `flip-card-3d`. Mirrors the `typescript` code variant.
 * Flips on hover and on keyboard focus (focus-within on the tabbable front).
 */
import type { ReactNode } from 'react';

interface FlipCard3DProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard3D({ front, back, className = '' }: FlipCard3DProps) {
  return (
    <>
      <style>{`
        .adysre-flip { perspective: 1000px; }
        .adysre-flip-inner {
          transform-style: preserve-3d;
          transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .adysre-flip:hover .adysre-flip-inner,
        .adysre-flip:focus-within .adysre-flip-inner { transform: rotateY(180deg); }
        .adysre-flip-face { backface-visibility: hidden; }
        .adysre-flip-back { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .adysre-flip-inner { transition: none; }
        }
      `}</style>
      <div className={`adysre-flip h-full w-full ${className}`}>
        <div className="adysre-flip-inner relative h-full w-full">
          <div
            className="adysre-flip-face absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-800 dark:bg-gray-900"
            tabIndex={0}
          >
            {front}
          </div>
          <div className="adysre-flip-face adysre-flip-back absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl border border-blue-500 bg-blue-600 p-6 text-center text-white">
            {back}
          </div>
        </div>
      </div>
    </>
  );
}

export default function FlipCard3DPreview() {
  return (
    <div className="h-48 w-full max-w-xs px-4">
      <FlipCard3D
        front={
          <>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Pro plan</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Hover to reveal</span>
          </>
        }
        back={
          <>
            <span className="text-3xl font-bold">$29/mo</span>
            <span className="text-sm text-blue-100">Everything you need to scale</span>
          </>
        }
      />
    </div>
  );
}

export const minHeight = 260;
