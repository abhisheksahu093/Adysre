/**
 * Live preview for `blog-author-byline`.
 * The avatar is a gradient disc rather than a network image.
 * Keep in step with `src/data/components/blog.ts`.
 */
export function BlogAuthorByline() {
  return (
    <div className="flex items-center gap-3">
      <span
        className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 ring-1 ring-gray-200 dark:ring-gray-700"
        aria-hidden="true"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Priya Nair</p>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Staff Engineer</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime="2026-07-19">Jul 19, 2026</time>
          <span aria-hidden="true">&middot;</span>
          <span>8 min read</span>
        </div>
      </div>
    </div>
  );
}

export default function BlogAuthorBylinePreview() {
  return <BlogAuthorByline />;
}
