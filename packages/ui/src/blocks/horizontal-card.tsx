'use client';

/**
 * Live preview for `horizontal-card`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the `<a>` for `next/link`). Resize the stage past `sm` and
 * the image moves from above the copy to beside it - that switch is the entry.
 * Keep this in step with `src/data/components/cards.ts`.
 */
interface HorizontalCardProps {
  title: string;
  href: string;
  copy: string;
  kicker?: string;
  imageSrc: string;
  imageAlt?: string;
  className?: string;
}

export function HorizontalCard({
  title,
  href,
  copy,
  kicker,
  imageSrc,
  imageAlt = '',
  className = '',
}: HorizontalCardProps) {
  return (
    <article
      className={`relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm sm:flex-row dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <img
        className="h-40 w-full flex-none bg-gray-100 object-cover sm:h-auto sm:w-40 sm:self-stretch dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={160}
        height={160}
      />

      <div className="flex-1 p-5">
        {kicker ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}

        <h3 className="mt-1.5 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <a
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </a>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{copy}</p>
      </div>
    </article>
  );
}

export default function HorizontalCardPreview() {
  return (
    <HorizontalCard
      title="Debugging performance with the Profiler"
      href="#"
      copy="Record a real session, read the flame graph, and find the one component re-rendering forty times a second."
      kicker="Workshop · 2 hours"
      imageSrc="/promo/all-access.svg"
    />
  );
}
