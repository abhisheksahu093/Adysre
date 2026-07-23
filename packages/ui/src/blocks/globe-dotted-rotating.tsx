import type { ReactNode } from 'react';

/**
 * Live preview for `globe-dotted-rotating`.
 *
 * Mirrors the `typescript` code variant verbatim. The SVG spins under a fixed
 * highlight div; reduced motion freezes it. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GDR_KEYFRAMES = `
  @keyframes gdr-spin { to { transform: rotate(1turn); } }
`;

interface GlobeDottedRotatingProps {
  heading?: ReactNode;
  copy?: string;
  size?: number;
  className?: string;
}

export function GlobeDottedRotating({ heading, copy, size = 240, className = '' }: GlobeDottedRotatingProps) {
  return (
    <div className={`flex w-full flex-col items-center gap-6 px-4 py-8 text-center ${className}`}>
      <style>{GDR_KEYFRAMES}</style>

      <div className="relative shrink-0" style={{ width: size, height: size, maxWidth: '100%' }} aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-blue-600/60 animate-[gdr-spin_32s_linear_infinite] motion-reduce:animate-none dark:text-blue-400/60">
          <defs>
            <pattern id="gdr-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gdr-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gdr-clip)">
            <rect width="200" height="200" fill="url(#gdr-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="76" rx="74" ry="13" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="124" rx="74" ry="13" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.55),transparent_55%)]" />
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

export default function GlobeDottedRotatingPreview() {
  return (
    <GlobeDottedRotating
      heading="Global by default"
      copy="Edge nodes in 34 regions keep every request close to home."
    />
  );
}
