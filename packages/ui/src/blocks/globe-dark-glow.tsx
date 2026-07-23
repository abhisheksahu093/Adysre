import type { ReactNode } from 'react';

/**
 * Live preview for `globe-dark-glow`.
 *
 * Mirrors the `typescript` code variant verbatim. The section paints its own
 * dark surface and glow - no dark: variants. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GDG_KEYFRAMES = `
  @keyframes gdg-spin { to { transform: rotate(1turn); } }
  @keyframes gdg-glow { 0%,100% { opacity: 0.55; } 50% { opacity: 0.9; } }
`;

interface GlobeDarkGlowProps {
  heading?: ReactNode;
  copy?: string;
  className?: string;
}

export function GlobeDarkGlow({ heading, copy, className = '' }: GlobeDarkGlowProps) {
  return (
    <section className={`relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-14 text-center sm:py-16 ${className}`}>
      <style>{GDG_KEYFRAMES}</style>
      <div className="absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-500/40 blur-3xl animate-[gdg-glow_6s_ease-in-out_infinite] motion-reduce:animate-none" aria-hidden="true" />

      <div className="relative mx-auto aspect-square w-full max-w-[220px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-400/70 animate-[gdg-spin_38s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <pattern id="gdg-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gdg-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gdg-clip)">
            <rect width="200" height="200" fill="url(#gdg-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.35),transparent_55%)]" />
      </div>

      {heading ? <h3 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">{heading}</h3> : null}
      {copy ? <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-300">{copy}</p> : null}
    </section>
  );
}

export const minHeight = 400;

export default function GlobeDarkGlowPreview() {
  return (
    <GlobeDarkGlow
      heading="Always on, everywhere"
      copy="A quiet planet in the dark - the glow does the talking."
    />
  );
}
