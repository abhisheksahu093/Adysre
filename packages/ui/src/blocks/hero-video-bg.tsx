'use client';

/**
 * Live preview for `hero-video-bg`.
 *
 * The ONE deliberate departure from the `typescript` variant: there is no video
 * and no poster. Shipping either would mean a real media file, and a preview
 * must never reach the network - so a static gradient stands in for the
 * backdrop layer.
 *
 * Everything the entry is actually teaching survives the swap, because none of
 * it lives in the <video> tag: the `relative isolate` stack, the -z-20 backdrop
 * under a -z-10 scrim at `black/60`, and white text that clears AA over it. The
 * scrim is the component; the video is just what happens to be under it.
 *
 * Keep this in step with `src/data/components/hero.ts`.
 */
interface HeroVideoBgProps {
  title: string;
  kicker?: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function HeroVideoBg({
  title,
  kicker,
  copy,
  ctaLabel = 'Watch the tour',
  ctaHref = '#',
  className = '',
}: HeroVideoBgProps) {
  return (
    <section className={`relative isolate w-full overflow-hidden rounded-2xl bg-gray-900 ${className}`}>
      {/* Stands in for the <video> + poster pair. In the real component this
          layer is the muted, looping, aria-hidden video. */}
      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(120%_120%_at_15%_10%,#334155_0%,#0f172a_55%,#020617_100%)]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 -z-10 bg-black/60" aria-hidden="true" />

      <div className="px-6 py-12 text-center sm:px-8 sm:py-20">
        {kicker ? (
          <p className="inline-block rounded-full border border-white/35 px-3 py-1 text-xs font-semibold text-white">
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

export default function HeroVideoBgPreview() {
  return (
    <HeroVideoBg
      title="Built for the days it all goes wrong"
      kicker="Field tested"
      copy="Uptime you can point at, support that answers, and a rollback that takes one click."
      ctaLabel="Watch the tour"
      ctaHref="#"
    />
  );
}
