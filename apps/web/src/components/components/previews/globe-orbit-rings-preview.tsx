import type { ReactNode } from 'react';

/**
 * Live preview for `globe-orbit-rings`.
 *
 * Mirrors the `typescript` code variant verbatim. Each ring tilts on an outer
 * <g> and spins on an inner one. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GOR_KEYFRAMES = `
  @keyframes gor-core { to { transform: rotate(1turn); } }
  @keyframes gor-spin { to { transform: rotate(1turn); } }
`;

interface GlobeOrbitRingsProps {
  heading?: ReactNode;
  copy?: string;
  className?: string;
}

function GlobeOrbitRings({ heading, copy, className = '' }: GlobeOrbitRingsProps) {
  return (
    <div className={`flex w-full flex-col items-center gap-6 px-4 py-8 text-center ${className}`}>
      <style>{GOR_KEYFRAMES}</style>
      <div className="relative shrink-0" style={{ width: 250, height: 250, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <g className="text-amber-600/70 dark:text-amber-400/70">
            <g className="animate-[gor-core_30s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeOpacity="0.5" />
              <ellipse cx="100" cy="100" rx="34" ry="10" fill="none" stroke="currentColor" strokeOpacity="0.35" />
              <ellipse cx="100" cy="100" rx="12" ry="34" fill="none" stroke="currentColor" strokeOpacity="0.35" />
            </g>
          </g>
          <g className="text-sky-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(0deg)' }}>
            <g className="animate-[gor-spin_7s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="80" ry="30" fill="none" stroke="currentColor" strokeOpacity="0.6" />
              <circle cx="180" cy="100" r="4" fill="currentColor" />
            </g>
          </g>
          <g className="text-violet-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(60deg)' }}>
            <g className="animate-[gor-spin_11s_linear_infinite_reverse] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="90" ry="34" fill="none" stroke="currentColor" strokeOpacity="0.55" />
              <circle cx="10" cy="100" r="4" fill="currentColor" />
            </g>
          </g>
          <g className="text-emerald-500/70" style={{ transformOrigin: '100px 100px', transform: 'rotate(120deg)' }}>
            <g className="animate-[gor-spin_15s_linear_infinite] motion-reduce:animate-none" style={{ transformOrigin: '100px 100px' }}>
              <ellipse cx="100" cy="100" rx="72" ry="26" fill="none" stroke="currentColor" strokeOpacity="0.5" />
              <circle cx="172" cy="100" r="3.5" fill="currentColor" />
            </g>
          </g>
        </svg>
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

export default function GlobeOrbitRingsPreview() {
  return (
    <GlobeOrbitRings
      heading="In constant orbit"
      copy="Three rings, three speeds - satellites sweeping a tilted plane."
    />
  );
}
