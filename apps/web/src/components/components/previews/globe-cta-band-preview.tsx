import type { ReactNode } from 'react';

/**
 * Live preview for `globe-cta-band`.
 *
 * Mirrors the `typescript` code variant verbatim. The globe is an aria-hidden
 * backdrop clipped by the band. Keep in step with
 * `src/data/components/globes.ts`.
 */
const GCB_KEYFRAMES = `
  @keyframes gcb-spin { to { transform: rotate(1turn); } }
`;

interface GlobeCtaBandProps {
  title: ReactNode;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function GlobeCtaBand({ title, copy, ctaLabel = 'Get started', ctaHref = '#' }: GlobeCtaBandProps) {
  return (
    <section className="relative isolate w-full overflow-hidden rounded-2xl bg-gray-950 px-6 py-12 sm:px-10">
      <style>{GCB_KEYFRAMES}</style>
      <div className="absolute -right-16 top-1/2 -z-10 h-72 w-72 -translate-y-1/2 opacity-70 sm:-right-8" aria-hidden="true">
        <svg viewBox="0 0 200 200" className="h-full w-full text-sky-400/60 animate-[gcb-spin_40s_linear_infinite] motion-reduce:animate-none">
          <defs>
            <pattern id="gcb-dots" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="1.6" cy="1.6" r="1.3" fill="currentColor" />
            </pattern>
            <clipPath id="gcb-clip"><circle cx="100" cy="100" r="92" /></clipPath>
          </defs>
          <g clipPath="url(#gcb-clip)">
            <rect width="200" height="200" fill="url(#gcb-dots)" />
            <ellipse cx="100" cy="100" rx="92" ry="20" fill="none" stroke="currentColor" strokeOpacity="0.4" />
            <ellipse cx="100" cy="100" rx="46" ry="92" fill="none" stroke="currentColor" strokeOpacity="0.3" />
          </g>
          <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeOpacity="0.5" />
        </svg>
      </div>

      <div className="flex max-w-xl flex-col items-start gap-5 text-left">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          {copy ? <p className="mt-2 text-sm leading-relaxed text-gray-300 sm:text-base">{copy}</p> : null}
        </div>
        <a href={ctaHref} className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 motion-reduce:transition-none">{ctaLabel}</a>
      </div>
    </section>
  );
}

export const minHeight = 260;

export default function GlobeCtaBandPreview() {
  return (
    <GlobeCtaBand
      title="Deploy where your users are"
      copy="Spin up in 34 regions in a single command. No infra tickets, no waiting."
      ctaLabel="Get started"
      ctaHref="#"
    />
  );
}
