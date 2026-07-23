import type { ReactNode } from 'react';

/**
 * Live preview for `globe-wireframe-sphere`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GWS_KEYFRAMES = `
  @keyframes gws-spin { to { transform: rotate(1turn); } }
`;

interface GlobeWireframeSphereProps {
  heading?: ReactNode;
  copy?: string;
  size?: number;
  className?: string;
}

export function GlobeWireframeSphere({ heading, copy, size = 240, className = '' }: GlobeWireframeSphereProps) {
  return (
    <div className={`flex w-full flex-col items-center gap-6 px-4 py-8 text-center ${className}`}>
      <style>{GWS_KEYFRAMES}</style>

      <div className="relative shrink-0" style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-indigo-600/70 animate-[gws-spin_40s_linear_infinite] motion-reduce:animate-none dark:text-indigo-400/70">
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.6" />
          <ellipse cx="100" cy="100" rx="92" ry="22" fill="none" stroke="currentColor" strokeOpacity="0.45" />
          <ellipse cx="100" cy="66" rx="66" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="134" rx="66" ry="12" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="42" rx="36" ry="7" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <ellipse cx="100" cy="158" rx="36" ry="7" fill="none" stroke="currentColor" strokeOpacity="0.28" />
          <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.35" />
          <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          <line x1="100" y1="8" x2="100" y2="192" stroke="currentColor" strokeOpacity="0.4" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_30%,rgba(129,140,248,0.28),transparent_60%)]" />
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

export const minHeight = 360;

export default function GlobeWireframeSpherePreview() {
  return (
    <GlobeWireframeSphere
      heading="Mapped end to end"
      copy="A clean latitude and longitude grid, drawn entirely in SVG."
    />
  );
}
