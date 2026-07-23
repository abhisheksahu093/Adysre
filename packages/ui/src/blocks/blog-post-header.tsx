/**
 * Live preview for `blog-post-header`.
 * Keep in step with `src/data/components/blog.ts`.
 */
export function BlogPostHeader() {
  return (
    <header className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Engineering</p>
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        Migrating a design system to semantic tokens
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium text-gray-700 dark:text-gray-300">Priya Nair</span>
        <span aria-hidden="true">&middot;</span>
        <time dateTime="2026-07-19">Jul 19, 2026</time>
        <span aria-hidden="true">&middot;</span>
        <span>8 min read</span>
      </div>
      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500" aria-hidden="true" />
    </header>
  );
}

export const minHeight = 380;

export default function BlogPostHeaderPreview() {
  return <BlogPostHeader />;
}
