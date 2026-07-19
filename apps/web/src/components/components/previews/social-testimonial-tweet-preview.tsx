/**
 * Live preview for `social-testimonial-tweet`. Mirrors the `typescript` variant.
 * Keep in step with `src/data/components/social.ts`.
 */
interface SocialTestimonialTweetProps {
  name: string;
  handle: string;
  quote: string;
  verified?: boolean;
  time?: string;
  likes?: string;
  className?: string;
}

function SocialTestimonialTweet({
  name,
  handle,
  quote,
  verified = false,
  time,
  likes,
  className = '',
}: SocialTestimonialTweetProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
  return (
    <figure
      className={`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white"
          aria-hidden="true"
        >
          {initials}
        </span>
        <figcaption className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
            {verified ? (
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0 text-blue-500"
                fill="currentColor"
                role="img"
                aria-label="Verified account"
              >
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
            ) : null}
          </div>
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">@{handle}</span>
        </figcaption>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-gray-800 dark:text-gray-100">{quote}</blockquote>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        {time ? <span>{time}</span> : null}
        {likes ? (
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
            </svg>
            {likes}
            <span className="sr-only"> likes</span>
          </span>
        ) : null}
      </div>
    </figure>
  );
}

export default function SocialTestimonialTweetPreview() {
  return (
    <SocialTestimonialTweet
      name="Lena Ng"
      handle="lenang"
      quote="Swapped our whole component pipeline over in an afternoon. The responsive defaults alone saved us a week of QA."
      verified
      time="2:14 PM · Jul 12, 2026"
      likes="2.3K"
    />
  );
}

export const minHeight = 260;
