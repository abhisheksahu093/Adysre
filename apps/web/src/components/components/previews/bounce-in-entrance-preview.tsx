/**
 * Live preview for `bounce-in-entrance`. Mirrors the `typescript` code variant.
 */
import type { CSSProperties, ReactNode } from 'react';

interface BounceInEntranceProps {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

function BounceInEntrance({ children, delayMs = 0, className = '' }: BounceInEntranceProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          70% { transform: scale(0.92); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-bounce-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
      <div
        className={`adysre-bounce-in ${className}`}
        style={{ animation: 'adysre-bounce-in 700ms cubic-bezier(0.22, 1, 0.36, 1) both', animationDelay: `${delayMs}ms` } as CSSProperties}
      >
        {children}
      </div>
    </>
  );
}

export default function BounceInEntrancePreview() {
  return (
    <BounceInEntrance>
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 px-8 py-6 text-center text-lg font-bold text-white shadow-lg">
        Welcome aboard
      </div>
    </BounceInEntrance>
  );
}
