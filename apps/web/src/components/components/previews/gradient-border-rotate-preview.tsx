/**
 * Live preview for `gradient-border-rotate`. Mirrors the `typescript` code variant.
 * A conic gradient spins behind an opaque inner panel, leaving a lit border.
 */
import type { CSSProperties, ReactNode } from 'react';

interface GradientBorderRotateProps {
  children: ReactNode;
  borderWidth?: number;
  className?: string;
}

function GradientBorderRotate({ children, borderWidth = 2, className = '' }: GradientBorderRotateProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-border-spin { to { transform: translate(-50%, -50%) rotate(1turn); } }
        @media (prefers-reduced-motion: reduce) { .adysre-border-spin { animation: none !important; } }
      `}</style>
      <div
        className={`relative overflow-hidden rounded-2xl ${className}`}
        style={{ padding: borderWidth } as CSSProperties}
      >
        <span
          className="adysre-border-spin absolute left-1/2 top-1/2 z-0 aspect-square w-[220%]"
          aria-hidden="true"
          style={{
            background: 'conic-gradient(from 0deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
            animation: 'adysre-border-spin 4s linear infinite',
            transform: 'translate(-50%, -50%)',
          } as CSSProperties}
        />
        <div className="relative z-10 rounded-[14px] bg-white px-5 py-4 dark:bg-gray-900">{children}</div>
      </div>
    </>
  );
}

export default function GradientBorderRotatePreview() {
  return (
    <div className="w-full max-w-xs px-4">
      <GradientBorderRotate>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Premium tier</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Unlock every module and priority support.</p>
      </GradientBorderRotate>
    </div>
  );
}
