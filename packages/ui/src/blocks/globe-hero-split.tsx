import type { ReactNode } from 'react';

/**
 * Live preview for `globe-hero-split`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GHS_KEYFRAMES = `
  @keyframes ghs-spin { to { transform: rotate(1turn); } }
`;

interface GlobeHeroSplitProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function GlobeHeroSplit({ title, copy, ctaLabel = 'Start shipping', ctaHref = '#' }: GlobeHeroSplitProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <style>{GHS_KEYFRAMES}</style>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400">Global infrastructure</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-5xl dark:text-gray-100">{title}</h1>
        {copy ? <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p> : null}
        <a href={ctaHref} className="mt-6 inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-gray-900">{ctaLabel}</a>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[320px]" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-600/60 animate-[ghs-spin_36s_linear_infinite] motion-reduce:animate-none dark:text-sky-400/60">
          <defs>
            <pattern id="ghs-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="ghs-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#ghs-clip)">
            <rect width="200" height="200" fill="url(#ghs-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="30" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
            <ellipse cx="100" cy="100" rx="62" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.55" />
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_30%,rgba(255,255,255,0.5),transparent_55%)]" />
      </div>
    </section>
  );
}

export const minHeight = 420;

export default function GlobeHeroSplitPreview() {
  return (
    <GlobeHeroSplit
      title="Ship to every region at once"
      copy="One deploy, replicated to the edge worldwide. No regions to wire up, no latency to babysit."
      ctaLabel="Start shipping"
      ctaHref="#"
    />
  );
}
