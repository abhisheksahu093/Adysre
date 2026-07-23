/**
 * Live preview for `pulse-attention`. Mirrors the `typescript` code variant.
 */
import type { CSSProperties, ReactNode } from 'react';

interface PulseAttentionProps {
  children: ReactNode;
  className?: string;
}

export function PulseAttention({ children, className = '' }: PulseAttentionProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-pulse-ring {
          0% { transform: scale(0.9); opacity: 0.7; }
          70%, 100% { transform: scale(1.7); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .adysre-pulse-ring { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
      <span className={`relative inline-flex ${className}`}>
        <span
          className="adysre-pulse-ring absolute inset-0 rounded-full bg-blue-500/50"
          style={{ animation: 'adysre-pulse-ring 1.8s cubic-bezier(0, 0, 0.2, 1) infinite' } as CSSProperties}
          aria-hidden="true"
        />
        <span className="relative">{children}</span>
      </span>
    </>
  );
}

export default function PulseAttentionPreview() {
  return (
    <PulseAttention>
      <span className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white">
        New feature
      </span>
    </PulseAttention>
  );
}
