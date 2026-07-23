/**
 * Live preview for `hover-lift-card`. Mirrors the `typescript` code variant.
 * Keep in step with src/data/components/animation.ts.
 */
import type { CSSProperties } from 'react';

interface HoverLiftCardProps {
  title: string;
  description?: string;
  liftPx?: number;
  className?: string;
}

export function HoverLiftCard({ title, description, liftPx = 8, className = '' }: HoverLiftCardProps) {
  return (
    <>
      {/* Keyframes/rules travel in a scoped style tag - Tailwind can't declare them. */}
      <style>{`
        .adysre-hover-lift {
          transform: translateY(0);
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease;
        }
        .adysre-hover-lift:hover,
        .adysre-hover-lift:focus-within {
          transform: translateY(var(--lift, -8px));
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-hover-lift { transition: none; }
          .adysre-hover-lift:hover,
          .adysre-hover-lift:focus-within { transform: none; }
        }
      `}</style>
      <div
        className={`adysre-hover-lift rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-xl focus-within:shadow-xl dark:border-gray-800 dark:bg-gray-900 ${className}`}
        style={{ '--lift': `-${liftPx}px` } as CSSProperties}
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
    </>
  );
}

export default function HoverLiftCardPreview() {
  return (
    <div className="w-full max-w-xs px-4">
      <HoverLiftCard
        title="Realtime collaboration"
        description="Edit together with live cursors, comments and instant sync across every device."
      />
    </div>
  );
}
