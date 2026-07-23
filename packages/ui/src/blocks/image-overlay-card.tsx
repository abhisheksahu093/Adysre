'use client';

/**
 * Live preview for `image-overlay-card`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the `<a>` for `next/link`). The photo is a local SVG so the
 * preview never hits the network - the scrim and hover zoom are the point.
 * Keep this in step with `src/data/components/cards.ts`.
 */
interface ImageOverlayCardProps {
  title: string;
  kicker?: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export function ImageOverlayCard({
  title,
  kicker,
  href,
  imageSrc,
  imageAlt = '',
  className = '',
}: ImageOverlayCardProps) {
  return (
    <a
      href={href}
      className={`group relative block aspect-[4/3] w-full max-w-sm overflow-hidden rounded-2xl bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${className}`}
    >
      <img
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
        src={imageSrc}
        alt={imageAlt}
        width={384}
        height={288}
      />

      <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" aria-hidden="true" />

      <span className="absolute inset-x-0 bottom-0 p-5">
        {kicker ? (
          <span className="block text-[0.6875rem] font-semibold uppercase tracking-widest text-gray-200">{kicker}</span>
        ) : null}
        <span className="mt-1 block text-xl font-bold leading-snug text-white">{title}</span>
      </span>
    </a>
  );
}

export default function ImageOverlayCardPreview() {
  return (
    <ImageOverlayCard
      title="Three weeks above the tree line"
      kicker="Field notes"
      href="#"
      imageSrc="/promo/all-access.svg"
    />
  );
}
