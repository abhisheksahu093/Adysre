/**
 * Live preview for `blob-morph`. Mirrors the `typescript` code variant.
 * Morphs an organic gradient blob; the rotate stays GPU-cheap and reduced
 * motion freezes the shape.
 */
import type { CSSProperties } from 'react';

interface BlobMorphProps {
  size?: number;
  className?: string;
}

export function BlobMorph({ size = 160, className = '' }: BlobMorphProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-blob {
          0%, 100% { border-radius: 42% 58% 63% 37% / 42% 45% 55% 58%; transform: rotate(0deg); }
          33% { border-radius: 62% 38% 41% 59% / 63% 55% 45% 37%; transform: rotate(120deg); }
          66% { border-radius: 38% 62% 58% 42% / 45% 63% 37% 55%; transform: rotate(240deg); }
        }
        @media (prefers-reduced-motion: reduce) { .adysre-blob { animation: none !important; } }
      `}</style>
      <div
        className={`adysre-blob bg-gradient-to-br from-fuchsia-500 via-purple-500 to-indigo-500 ${className}`}
        style={{ width: size, height: size, animation: 'adysre-blob 8s ease-in-out infinite' } as CSSProperties}
        aria-hidden="true"
      />
    </>
  );
}

export default function BlobMorphPreview() {
  return <BlobMorph />;
}

export const minHeight = 220;
