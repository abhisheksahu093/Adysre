/**
 * Live preview for `blog-newsletter-inline`.
 * Static render (no submit handler) - shows the design.
 * Keep in step with `src/data/components/blog.ts`.
 */
export function BlogNewsletterInline() {
  return (
    <section className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Get the weekly digest</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        One email a week with our newest posts. No spam, unsubscribe anytime.
      </p>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="np-email" className="sr-only">Email address</label>
        <input
          id="np-email"
          type="email"
          placeholder="you@example.com"
          className="w-full flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}

export default function BlogNewsletterInlinePreview() {
  return <BlogNewsletterInline />;
}
