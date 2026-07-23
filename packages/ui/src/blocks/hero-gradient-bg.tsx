'use client';

/**
 * Live preview for `hero-gradient-bg`.
 *
 * Mirrors the `typescript` code variant verbatim, including the <style> tag -
 * the keyframes have to travel with the component, and that is the point worth
 * showing. Flip the stage between themes and nothing changes: the hero paints
 * its own dark surface and its own scrim.
 * Keep this in step with `src/data/components/hero.ts`.
 */
const PAN_KEYFRAMES = `
  @keyframes hero-gradient-pan {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

interface HeroGradientBgProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroGradientBg({
  title,
  kicker,
  copy,
  ctaLabel = 'Start building',
  ctaHref = '#',
  className = '',
}: HeroGradientBgProps) {
  return (
    <section className={`relative isolate w-full overflow-hidden rounded-2xl ${className}`}>
      <style>{PAN_KEYFRAMES}</style>

      <div
        className="absolute inset-0 -z-20 bg-[linear-gradient(115deg,#1e1b4b,#1d4ed8,#4c1d95,#1e1b4b)] bg-[length:300%_300%] animate-[hero-gradient-pan_18s_ease_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      />
      <div className="absolute inset-0 -z-10 bg-black/40" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/30 px-3 py-1 text-xs font-semibold text-white">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-5 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-5xl">
          {title}
        </h1>

        {copy ? (
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-gray-200">{copy}</p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 motion-reduce:transition-none"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}

export default function HeroGradientBgPreview() {
  return (
    <HeroGradientBg
      title="Build faster than you can spec it"
      kicker="Now in public beta"
      copy="A single toolkit for the whole team - design, ship and measure without leaving the tab."
      ctaLabel="Start building"
      ctaHref="#"
    />
  );
}
