/**
 * Live preview for `blog-post-list`.
 * Keep in step with `src/data/components/blog.ts`.
 */
interface Row {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  gradient: string;
}

const ROWS: Row[] = [
  { id: 'a', category: 'Product', date: 'Jul 15, 2026', title: 'Naming things: our lightweight component conventions', excerpt: 'The three rules that removed most of our review comments.', gradient: 'from-blue-400 to-indigo-500' },
  { id: 'b', category: 'Design', date: 'Jul 9, 2026', title: 'A spacing scale the whole team agreed on', excerpt: 'Four steps, no more pixel-pushing debates.', gradient: 'from-rose-400 to-orange-300' },
  { id: 'c', category: 'Engineering', date: 'Jul 1, 2026', title: 'Typed API contracts across the monorepo', excerpt: 'One schema, shared from server to client.', gradient: 'from-emerald-400 to-teal-500' },
];

export function BlogPostList() {
  return (
    <ul className="mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800">
      {ROWS.map((row) => (
        <li key={row.id}>
          <a href="#" className="flex items-start gap-4 py-4">
            <div className={`hidden h-16 w-24 shrink-0 rounded-lg bg-gradient-to-br ${row.gradient} sm:block`} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                <span className="font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{row.category}</span>
                <span aria-hidden="true">&middot;</span>
                <span>{row.date}</span>
              </div>
              <h3 className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{row.title}</h3>
              <p className="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">{row.excerpt}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export const minHeight = 300;

export default function BlogPostListPreview() {
  return <BlogPostList />;
}
