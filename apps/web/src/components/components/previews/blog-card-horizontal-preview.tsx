/**
 * Live preview for `blog-card-horizontal`.
 * Keep in step with `src/data/components/blog.ts`.
 */
function BlogCardHorizontal() {
  return (
    <a
      href="#"
      className="group grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md sm:grid-cols-[40%_1fr] dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="aspect-video bg-gradient-to-br from-emerald-400 to-teal-500 sm:aspect-auto" aria-hidden="true" />
      <div className="flex flex-col justify-center p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Product</span>
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-gray-900 sm:text-lg dark:text-gray-100">
          Shipping accessible components without slowing the team down
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          A practical checklist we run before any component leaves review.
        </p>
        <span className="mt-3 text-xs text-gray-500 dark:text-gray-500">6 min read</span>
      </div>
    </a>
  );
}

export default function BlogCardHorizontalPreview() {
  return <BlogCardHorizontal />;
}
