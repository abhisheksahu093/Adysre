/**
 * Live preview for `gradient-text-animated`. Mirrors the `typescript` code variant.
 */
import type { CSSProperties } from 'react';

interface GradientTextAnimatedProps {
  text: string;
  durationMs?: number;
  className?: string;
}

function GradientTextAnimated({ text, durationMs = 6000, className = '' }: GradientTextAnimatedProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-gradient-pan { to { background-position: 200% center; } }
        @media (prefers-reduced-motion: reduce) {
          .adysre-gradient-text { animation: none !important; background-position: 0 center !important; }
        }
      `}</style>
      <span
        className={`adysre-gradient-text inline-block bg-clip-text text-transparent ${className}`}
        style={{
          backgroundImage: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #6366f1)',
          backgroundSize: '200% auto',
          animation: `adysre-gradient-pan ${durationMs}ms linear infinite`,
        } as CSSProperties}
      >
        {text}
      </span>
    </>
  );
}

export default function GradientTextAnimatedPreview() {
  return (
    <div className="px-4 text-center">
      <GradientTextAnimated text="Ship something beautiful" className="text-3xl font-bold sm:text-4xl" />
    </div>
  );
}
