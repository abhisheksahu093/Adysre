'use client';

/**
 * Live preview for `blog-post-card`.
 *
 * Mirrors the `typescript` code variant verbatim (the `nextjs` variant differs
 * only in swapping the `<a>` for `next/link`). Images point at a local SVG so
 * the preview never hits the network.
 * Keep this in step with `src/data/components/cards.ts`.
 */
interface BlogPostCardProps {
  title: string;
  href: string;
  excerpt: string;
  category: string;
  coverSrc: string;
  authorName: string;
  authorAvatarSrc: string;
  date: string;
  dateLabel: string;
  className?: string;
}

function BlogPostCard({
  title,
  href,
  excerpt,
  category,
  coverSrc,
  authorName,
  authorAvatarSrc,
  date,
  dateLabel,
  className = '',
}: BlogPostCardProps) {
  return (
    <article
      className={`relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <img
        className="h-[12.5rem] w-full bg-gray-100 object-cover dark:bg-gray-800"
        src={coverSrc}
        alt=""
        width={384}
        height={200}
      />

      <div className="p-5">
        <p className="inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {category}
        </p>

        <h3 className="mt-2.5 text-[1.0625rem] font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <a
            href={href}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {title}
          </a>
        </h3>

        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{excerpt}</p>

        <div className="mt-4 flex items-center gap-2 text-[0.8125rem] text-gray-600 dark:text-gray-300">
          <img
            className="h-7 w-7 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            src={authorAvatarSrc}
            alt=""
            width={28}
            height={28}
          />
          <span className="font-medium text-gray-900 dark:text-gray-100">{authorName}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={date}>{dateLabel}</time>
        </div>
      </div>
    </article>
  );
}

export default function BlogPostCardPreview() {
  return (
    <BlogPostCard
      title="Why we rewrote our design tokens in one afternoon"
      href="#"
      excerpt="Four years of drift left us with 312 colours for what turned out to be nine decisions. Here is how we found them."
      category="Engineering"
      coverSrc="/promo/all-access.svg"
      authorName="Priya Raman"
      authorAvatarSrc="/promo/all-access.svg"
      date="2026-06-18"
      dateLabel="18 Jun 2026"
    />
  );
}
