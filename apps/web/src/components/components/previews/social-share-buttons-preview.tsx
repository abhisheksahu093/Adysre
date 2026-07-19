/**
 * Live preview for `social-share-buttons`. Mirrors the `typescript` variant.
 * Keep in step with `src/data/components/social.ts`.
 */
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

interface SocialShareButtonsProps {
  url: string;
  title?: string;
  platforms?: SharePlatform[];
  className?: string;
}

function SocialShareButtons({
  url,
  title = '',
  platforms = ['x', 'linkedin', 'facebook'],
  className = '',
}: SocialShareButtonsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {platforms.map((key) => {
        const item = SHARE[key];
        return (
          <a
            key={key}
            href={item.href(url, title)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d={item.path} />
            </svg>
            Share on {item.label}
          </a>
        );
      })}
    </div>
  );
}

export default function SocialShareButtonsPreview() {
  return <SocialShareButtons url="https://example.com/article" title="Read this" />;
}
