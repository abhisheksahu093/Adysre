'use client';

/**
 * Live preview for `hero-split-image`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the <img> for next/image). The picture is a local SVG so the
 * preview never hits the network. Below `md` the stage shows the mobile stack,
 * which is the layout worth seeing anyway.
 * Keep this in step with `src/data/components/hero.ts`.
 */
interface HeroSplitImageProps {
  title: string;
  kicker?: string;
  copy?: string;
  imageSrc: string;
  imageAlt?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

function HeroSplitImage({
  title,
  kicker,
  copy,
  imageSrc,
  imageAlt = '',
  ctaLabel = 'Get started',
  ctaHref = '#',
}: HeroSplitImageProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 md:px-6 md:py-16">
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
            {kicker}
          </p>
        ) : null}

        <h1 className="mt-3 text-[1.75rem] font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl md:text-[2.75rem] dark:text-gray-100">
          {title}
        </h1>

        {copy ? (
          <p className="mt-4 max-w-lg text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {copy}
          </p>
        ) : null}

        <a
          href={ctaHref}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {ctaLabel}
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        { }
        <img
          src={imageSrc}
          alt={imageAlt}
          width={560}
          height={420}
          className="block aspect-[4/3] w-full object-cover"
        />
      </div>
    </section>
  );
}

export default function HeroSplitImagePreview() {
  return (
    <HeroSplitImage
      title="See what your customers actually do"
      kicker="Analytics"
      copy="Session-level insight without a tag manager, a data team, or a six-week rollout."
      imageSrc="/promo/all-access.svg"
      ctaLabel="Get started"
      ctaHref="#"
    />
  );
}
