import type { ReactNode } from 'react';

/**
 * Live preview for `globe-network-nodes`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GNN_KEYFRAMES = `
  @keyframes gnn-spin { to { transform: rotate(1turn); } }
  @keyframes gnn-pulse { 0%,100% { opacity: 0.35; } 50% { opacity: 1; } }
`;

interface GlobeNetworkNodesProps {
  heading?: ReactNode;
  copy?: string;
  className?: string;
}

export function GlobeNetworkNodes({ heading, copy, className = '' }: GlobeNetworkNodesProps) {
  return (
    <div className={`flex w-full flex-col items-center gap-6 px-4 py-8 text-center ${className}`}>
      <style>{GNN_KEYFRAMES}</style>
      <div className="relative shrink-0" style={{ width: 250, height: 250, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-violet-600/70 dark:text-violet-400/70">
          <defs>
            <clipPath id="gnn-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g className="animate-[gnn-spin_44s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
            <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="92" ry="24" fill="none" stroke="currentColor" strokeOpacity="0.25" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.2" />
            <g clipPath="url(#gnn-clip)" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1">
              <line x1="52" y1="70" x2="120" y2="52" />
              <line x1="120" y1="52" x2="150" y2="112" />
              <line x1="150" y1="112" x2="96" y2="150" />
              <line x1="96" y1="150" x2="52" y2="70" />
              <line x1="120" y1="52" x2="96" y2="150" />
            </g>
            <g fill="currentColor">
              <circle cx="52" cy="70" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out infinite' }} />
              <circle cx="120" cy="52" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 0.5s infinite' }} />
              <circle cx="150" cy="112" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 1s infinite' }} />
              <circle cx="96" cy="150" r="4" style={{ animation: 'gnn-pulse 2.4s ease-in-out 1.5s infinite' }} />
            </g>
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(167,139,250,0.28),transparent_60%)]" />
      </div>

      {heading || copy ? (
        <div className="max-w-md">
          {heading ? <h3 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{heading}</h3> : null}
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        </div>
      ) : null}
    </div>
  );
}

export const minHeight = 370;

export default function GlobeNetworkNodesPreview() {
  return (
    <GlobeNetworkNodes
      heading="One connected mesh"
      copy="Nodes sync peer to peer, so a region can drop without a blip."
    />
  );
}
