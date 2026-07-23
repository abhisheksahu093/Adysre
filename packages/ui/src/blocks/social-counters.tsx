/**
 * Live preview for `social-counters`. Mirrors the `typescript` variant.
 * Keep in step with `src/data/components/social.ts`.
 */
import type { ReactElement } from 'react';

type CounterIcon = 'followers' | 'likes' | 'posts' | 'views';

interface Counter {
  icon: CounterIcon;
  value: string;
  label: string;
}

const ICONS: Record<Exclude<CounterIcon, 'likes'>, ReactElement> = {
  followers: (
    <>
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </>
  ),
  posts: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </>
  ),
  views: (
    <>
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </>
  ),
};

interface SocialCountersProps {
  counters?: Counter[];
  className?: string;
}

export function SocialCounters({ counters = [], className = '' }: SocialCountersProps) {
  return (
    <dl className={`flex flex-wrap gap-3 ${className}`}>
      {counters.map((c) => (
        <div
          key={c.label}
          className="flex min-w-[8rem] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            aria-hidden="true"
          >
            {c.icon === 'likes' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[c.icon]}
              </svg>
            )}
          </span>
          <div className="min-w-0">
            <dd className="text-xl font-bold text-gray-900 dark:text-gray-100">{c.value}</dd>
            <dt className="text-xs text-gray-500 dark:text-gray-400">{c.label}</dt>
          </div>
        </div>
      ))}
    </dl>
  );
}

export default function SocialCountersPreview() {
  return (
    <SocialCounters
      counters={[
        { icon: 'followers', value: '48.2K', label: 'Followers' },
        { icon: 'likes', value: '312K', label: 'Likes' },
        { icon: 'posts', value: '1,204', label: 'Posts' },
      ]}
    />
  );
}

export const minHeight = 260;
