/**
 * Live preview for `social-share-floating`. Mirrors the `typescript` variant,
 * wrapped in a fixed-height scroll box so the sticky rail's pinning behaviour is
 * visible on the stage. The scroll box is preview scaffolding, not part of the
 * component. Keep in step with `src/data/components/social.ts`.
 */
import type { ReactNode } from 'react';

type SharePlatform = 'x' | 'linkedin' | 'facebook';

interface ShareTarget {
  label: string;
  href: (url: string, title: string) => string;
  path: string;
}

const SHARE: Record<SharePlatform, ShareTarget> = {
  x: {
    label: 'X',
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    label: 'LinkedIn',
    href: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  facebook: {
    label: 'Facebook',
    href: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
};

const KEYS: SharePlatform[] = ['x', 'linkedin', 'facebook'];

interface SocialShareFloatingProps {
  url: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

function SocialShareFloating({ url, title = '', children, className = '' }: SocialShareFloatingProps) {
  return (
    <div className={`mx-auto flex w-full max-w-3xl gap-3 sm:gap-5 ${className}`}>
      <aside className="sticky top-4 flex h-fit shrink-0 flex-col gap-2" aria-label="Share this article">
        {KEYS.map((key) => {
          const item = SHARE[key];
          return (
            <a
              key={key}
              href={item.href(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Share on ${item.label}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d={item.path} />
              </svg>
            </a>
          );
        })}
      </aside>
      <article className="min-w-0 flex-1">{children}</article>
    </div>
  );
}

export default function SocialShareFloatingPreview() {
  return (
    <div className="h-[380px] overflow-y-auto rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <SocialShareFloating url="https://example.com/article" title="Read this">
        <div className="space-y-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Designing for the scroll</h3>
          <p>
            As you scroll this panel, the share rail on the left stays pinned within the row rather than fixing to the
            window, so it never floats over other sections.
          </p>
          <p>
            Sticky positioning is scoped to its flex parent. That keeps the rail beside the article body and prevents it
            from overlapping content on a narrow screen.
          </p>
          <p>
            The article column carries min-w-0 so long words and code can wrap instead of pushing the layout past the
            viewport edge.
          </p>
          <p>
            Keep scrolling and watch the icons hold their position. This is the whole trick: no JavaScript, no scroll
            listeners, just CSS sticky doing the work.
          </p>
          <p>
            When the reader reaches the end of the article, the rail scrolls away with its container, exactly as a real
            in-article share widget should behave.
          </p>
        </div>
      </SocialShareFloating>
    </div>
  );
}

export const minHeight = 440;
