/**
 * Live preview for `social-feed-cards`. Mirrors the `typescript` variant.
 * Keep in step with `src/data/components/social.ts`.
 */
interface FeedPost {
  id: string;
  name: string;
  handle: string;
  initials: string;
  time: string;
  body: string;
  replies: number;
  reposts: number;
  likes: number;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

const GRADIENTS = ['from-emerald-500 to-teal-600', 'from-blue-500 to-violet-600', 'from-amber-500 to-orange-600'] as const;

interface SocialFeedCardsProps {
  posts?: FeedPost[];
  className?: string;
}

export function SocialFeedCards({ posts = [], className = '' }: SocialFeedCardsProps) {
  return (
    <div className={`mx-auto w-full max-w-md space-y-3 ${className}`}>
      {posts.map((post, i) => {
        const gradient = GRADIENTS[i % GRADIENTS.length] ?? GRADIENTS[0];
        return (
          <article
            key={post.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${gradient}`}
                aria-hidden="true"
              >
                {post.initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{post.name}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  @{post.handle} &middot; {post.time}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{post.body}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                {formatCount(post.replies)}
                <span className="sr-only"> replies</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 014-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 01-4 4H3" />
                </svg>
                {formatCount(post.reposts)}
                <span className="sr-only"> reposts</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
                </svg>
                {formatCount(post.likes)}
                <span className="sr-only"> likes</span>
              </span>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function SocialFeedCardsPreview() {
  return (
    <SocialFeedCards
      posts={[
        {
          id: '1',
          name: 'Maya Juno',
          handle: 'mayaj',
          initials: 'MJ',
          time: '2h',
          body: 'Shipped the new dashboard today. Smaller bundle, faster paint, and it finally works on a 320px screen.',
          replies: 24,
          reposts: 112,
          likes: 1200,
        },
        {
          id: '2',
          name: 'Devon Park',
          handle: 'devonp',
          initials: 'DP',
          time: '5h',
          body: 'Reminder that accessible engagement counts are icon plus number, never colour alone.',
          replies: 8,
          reposts: 47,
          likes: 2300000,
        },
      ]}
    />
  );
}

export const minHeight = 520;
