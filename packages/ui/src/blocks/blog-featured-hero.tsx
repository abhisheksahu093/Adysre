/**
 * Live preview for `blog-featured-hero`.
 * Keep in step with `src/data/components/blog.ts`.
 */
export function BlogFeaturedHero() {
  return (
    <a href="#" className="group relative flex aspect-[16/9] w-full max-w-4xl items-end overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
      <div className="relative max-w-xl p-6 sm:p-8">
        <span className="inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
          Featured
        </span>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-4xl">
          What a year of shipping every week taught us about pace
        </h2>
        <p className="mt-2 hidden text-sm leading-relaxed text-gray-200 sm:block">
          Momentum is a system, not a sprint. Here is the loop that kept it going.
        </p>
      </div>
    </a>
  );
}

export const minHeight = 320;

export default function BlogFeaturedHeroPreview() {
  return <BlogFeaturedHero />;
}
