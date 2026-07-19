/**
 * Live preview for `blog-card-vertical`.
 * Mirrors the code variant with baked sample content; the cover is a gradient
 * rather than a network image. Keep in step with `src/data/components/blog.ts`.
 */
function BlogCardVertical() {
  return (
    <a
      href="#"
      className="group flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-blue-400 via-indigo-400 to-violet-500" aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
          Engineering
        </span>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
          Designing a token-first color system that scales
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          How we moved every surface onto semantic tokens and deleted a thousand one-off hex values along the way.
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span className="font-medium text-gray-700 dark:text-gray-300">Priya Nair</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime="2026-07-12">Jul 12, 2026</time>
        </div>
      </div>
    </a>
  );
}

export default function BlogCardVerticalPreview() {
  return <BlogCardVertical />;
}
