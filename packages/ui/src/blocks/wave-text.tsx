/**
 * Live preview for `wave-text`. Mirrors the `typescript` code variant.
 * Each letter bobs on a staggered delay; reduced motion holds them still.
 */
import type { CSSProperties } from 'react';

interface WaveTextProps {
  text: string;
  className?: string;
}

export function WaveText({ text, className = '' }: WaveTextProps) {
  const letters = text.split('');
  return (
    <>
      <style>{`
        @keyframes adysre-wave { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-0.35em); } }
        @media (prefers-reduced-motion: reduce) { .adysre-wave-letter { animation: none !important; } }
      `}</style>
      <span className={`inline-flex ${className}`} aria-label={text}>
        {letters.map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="adysre-wave-letter inline-block whitespace-pre"
            style={{ animation: 'adysre-wave 1.6s ease-in-out infinite', animationDelay: `${i * 80}ms` } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>
    </>
  );
}

export default function WaveTextPreview() {
  return (
    <WaveText text="Hello, world" className="text-3xl font-bold text-blue-600 sm:text-4xl dark:text-blue-400" />
  );
}
