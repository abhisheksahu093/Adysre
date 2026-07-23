/**
 * Live preview for `blog-post-grid`.
 * Keep in step with `src/data/components/blog.ts`.
 */
interface Post {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  gradient: string;
}

const POSTS: Post[] = [
  { id: 'a', category: 'Design', title: 'The quiet power of consistent spacing', excerpt: 'A four-point scale removed most of our layout debates overnight.', date: 'Jul 8, 2026', readTime: '5 min read', gradient: 'from-blue-400 to-indigo-500' },
  { id: 'b', category: 'Engineering', title: 'Token-first theming in practice', excerpt: 'One source of truth for every surface, light and dark.', date: 'Jul 2, 2026', readTime: '7 min read', gradient: 'from-rose-400 to-orange-300' },
  { id: 'c', category: 'Product', title: 'Shipping weekly without burning out', excerpt: 'The loop that kept momentum a system, not a sprint.', date: 'Jun 24, 2026', readTime: '4 min read', gradient: 'from-emerald-400 to-teal-500' },
];

export function BlogPostGrid() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">From the blog</h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Notes on building, designing and shipping.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <article key={post.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className={`aspect-[16/10] bg-gradient-to-br ${post.gradient}`} aria-hidden="true" />
            <div className="flex flex-1 flex-col p-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{post.category}</span>
              <h3 className="mt-2 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">{post.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{post.excerpt}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <span>{post.date}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export const minHeight = 420;

export default function BlogPostGridPreview() {
  return <BlogPostGrid />;
}
