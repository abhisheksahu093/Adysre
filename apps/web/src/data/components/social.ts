import type { ComponentEntry } from './types';

/**
 * Social category.
 *
 * Ten different social-media surfaces - a links bar, share buttons, a follow
 * card, a feed, a profile header, an icon grid, a proof strip, a tweet-style
 * quote, a floating share rail and a counters row. Two constraints run through
 * all of them. First, every brand and metric mark is an INLINE SVG with an
 * accessible name on the interactive element (`aria-label="Share on LinkedIn"`)
 * and `aria-hidden` on the glyph - no external icon font, no `<img>` that can
 * 404. Second, engagement is never colour alone: a like or a follower count is
 * always an icon *plus* a number, so it survives greyscale and colour blindness.
 * Rows wrap (`flex-wrap`) rather than overflow, so nothing clips at 320px.
 */
export const socialComponents: ComponentEntry[] = [
  {
    slug: 'social-links-bar',
    category: 'social',
    tags: ['social', 'links', 'icons', 'footer', 'svg'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'ghost', labelKey: 'ghost' },
    ],
    props: [
      { name: 'links', type: 'SocialLink[]', descriptionKey: 'links' },
      { name: 'label', type: 'string', default: "'Follow us'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Icon-only links, so the accessible name lives on the <a> (aria-label) and the
  glyph is aria-hidden. Each target is h-10 w-10 (40px) - the minimum comfortable
  tap size - and the row wraps instead of overflowing a narrow phone.
-->
<nav aria-label="Follow us" class="flex flex-wrap items-center gap-2">
  <a href="#" aria-label="Follow on X" class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  </a>
  <a href="#" aria-label="Follow on LinkedIn" class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
  </a>
  <a href="#" aria-label="Follow on GitHub" class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  </a>
  <a href="#" aria-label="Follow on YouTube" class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
  </a>
</nav>`,
      react: `const ICONS = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
};

const LABELS = {
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
};

const DEFAULT_LINKS = [
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
  { platform: 'github', href: '#' },
  { platform: 'youtube', href: '#' },
];

export function SocialLinksBar({ links = DEFAULT_LINKS, label = 'Follow us', className = '' }) {
  return (
    <nav aria-label={label} className={\`flex flex-wrap items-center gap-2 \${className}\`}>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          aria-label={\`Follow on \${LABELS[link.platform]}\`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={ICONS[link.platform]} />
          </svg>
        </a>
      ))}
    </nav>
  );
}`,
      typescript: `export type SocialPlatform = 'x' | 'linkedin' | 'github' | 'instagram' | 'youtube' | 'facebook';

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
}

// Record<union, string> is exhaustive, so ICONS[platform] is always defined -
// no runtime fallback needed and the compiler enforces every brand is present.
const ICONS: Record<SocialPlatform, string> = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
};

const LABELS: Record<SocialPlatform, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
};

const DEFAULT_LINKS: SocialLink[] = [
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
  { platform: 'github', href: '#' },
  { platform: 'youtube', href: '#' },
];

export interface SocialLinksBarProps {
  links?: SocialLink[];
  /** Names the nav landmark for assistive tech. */
  label?: string;
  className?: string;
}

export function SocialLinksBar({
  links = DEFAULT_LINKS,
  label = 'Follow us',
  className = '',
}: SocialLinksBarProps): JSX.Element {
  return (
    <nav aria-label={label} className={\`flex flex-wrap items-center gap-2 \${className}\`}>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          aria-label={\`Follow on \${LABELS[link.platform]}\`}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
            <path d={ICONS[link.platform]} />
          </svg>
        </a>
      ))}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'social-share-buttons',
    category: 'social',
    tags: ['social', 'share', 'buttons', 'labels', 'svg'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'url', type: 'string', required: true, descriptionKey: 'url' },
      { name: 'title', type: 'string', default: "''", descriptionKey: 'title' },
      { name: 'platforms', type: 'SharePlatform[]', descriptionKey: 'platforms' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Labelled share links: the visible text ("Share on X") is the accessible name,
  so the icon is aria-hidden. Real share-intent URLs, opened in a new tab with
  rel="noopener" so the target page cannot reach back through window.opener.
  The row wraps, so four buttons never push past a 320px viewport.
-->
<div class="flex flex-wrap gap-2">
  <a href="https://twitter.com/intent/tweet?url=https%3A%2F%2Fexample.com&text=Read%20this" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    Share on X
  </a>
  <a href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fexample.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
    Share on LinkedIn
  </a>
  <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fexample.com" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    Share on Facebook
  </a>
</div>`,
      react: `const SHARE = {
  x: {
    label: 'X',
    href: (url, title) =>
      \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title)}\`,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    label: 'LinkedIn',
    href: (url) => \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  facebook: {
    label: 'Facebook',
    href: (url) => \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
};

export function SocialShareButtons({
  url,
  title = '',
  platforms = ['x', 'linkedin', 'facebook'],
  className = '',
}) {
  return (
    <div className={\`flex flex-wrap gap-2 \${className}\`}>
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
}`,
      typescript: `export type SharePlatform = 'x' | 'linkedin' | 'facebook';

interface ShareTarget {
  label: string;
  href: (url: string, title: string) => string;
  path: string;
}

const SHARE: Record<SharePlatform, ShareTarget> = {
  x: {
    label: 'X',
    href: (url, title) =>
      \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title)}\`,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    label: 'LinkedIn',
    href: (url) => \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  facebook: {
    label: 'Facebook',
    href: (url) => \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
};

export interface SocialShareButtonsProps {
  /** The page being shared. */
  url: string;
  /** Used as the tweet text; ignored by networks that read Open Graph tags. */
  title?: string;
  platforms?: SharePlatform[];
  className?: string;
}

export function SocialShareButtons({
  url,
  title = '',
  platforms = ['x', 'linkedin', 'facebook'],
  className = '',
}: SocialShareButtonsProps): JSX.Element {
  return (
    <div className={\`flex flex-wrap gap-2 \${className}\`}>
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
}`,
    },
  },
  {
    slug: 'social-follow-card',
    category: 'social',
    tags: ['social', 'follow', 'card', 'profile', 'toggle'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'following', labelKey: 'following' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'handle', type: 'string', required: true, descriptionKey: 'handle' },
      { name: 'bio', type: 'string', descriptionKey: 'bio' },
      { name: 'following', type: 'boolean', default: 'false', descriptionKey: 'following' },
      { name: 'onToggle', type: '(next: boolean) => void', descriptionKey: 'onToggle' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Static markup. The follow button's active state is expressed with aria-pressed
  in the React tabs; here it is shown in the resting (not-following) state. The
  avatar is initials on a gradient - no <img> to break.
-->
<div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-start gap-3">
    <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white" aria-hidden="true">AR</span>
    <div class="min-w-0 flex-1">
      <p class="truncate font-semibold text-gray-900 dark:text-gray-100">Ada Ross</p>
      <p class="truncate text-sm text-gray-500 dark:text-gray-400">&#64;adaross</p>
    </div>
    <button type="button" aria-pressed="false" class="shrink-0 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      Follow
    </button>
  </div>
  <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
    Design engineer. Writing about interfaces, type and the web.
  </p>
</div>`,
      react: `import { useState } from 'react';

export function SocialFollowCard({
  name,
  handle,
  bio,
  following = false,
  onToggle,
  className = '',
}) {
  const [isFollowing, setIsFollowing] = useState(following);
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  const toggle = () => {
    const next = !isFollowing;
    setIsFollowing(next);
    onToggle?.(next);
  };

  return (
    <div className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white" aria-hidden="true">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{name}</p>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">@{handle}</p>
        </div>
        <button
          type="button"
          aria-pressed={isFollowing}
          onClick={toggle}
          className={
            isFollowing
              ? 'shrink-0 rounded-full border border-gray-300 bg-transparent px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:border-red-300 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950'
              : 'shrink-0 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950'
          }
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
      {bio ? (
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useState } from 'react';

export interface SocialFollowCardProps {
  name: string;
  handle: string;
  bio?: string;
  following?: boolean;
  onToggle?: (next: boolean) => void;
  className?: string;
}

export function SocialFollowCard({
  name,
  handle,
  bio,
  following = false,
  onToggle,
  className = '',
}: SocialFollowCardProps): JSX.Element {
  const [isFollowing, setIsFollowing] = useState<boolean>(following);
  // w[0] is string | undefined under noUncheckedIndexedAccess, so fall back to ''.
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  const toggle = (): void => {
    const next = !isFollowing;
    setIsFollowing(next);
    onToggle?.(next);
  };

  return (
    <div className={\`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white" aria-hidden="true">
          {initials}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900 dark:text-gray-100">{name}</p>
          <p className="truncate text-sm text-gray-500 dark:text-gray-400">@{handle}</p>
        </div>
        <button
          type="button"
          aria-pressed={isFollowing}
          onClick={toggle}
          className={
            isFollowing
              ? 'shrink-0 rounded-full border border-gray-300 bg-transparent px-4 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:border-red-300 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950'
              : 'shrink-0 rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950'
          }
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>
      {bio ? (
        <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'social-feed-cards',
    category: 'social',
    tags: ['social', 'feed', 'posts', 'engagement', 'timeline'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'posts', type: 'FeedPost[]', descriptionKey: 'posts' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each post is an <article>. Engagement is icon + number, never colour alone, so
  a like count reads the same in greyscale. Counts are given accessible names via
  the sr-only span; the glyph itself is aria-hidden.
-->
<div class="mx-auto w-full max-w-md space-y-3">
  <article class="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center gap-3">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white" aria-hidden="true">MJ</span>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Maya Juno</p>
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">&#64;mayaj &middot; 2h</p>
      </div>
    </div>
    <p class="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">
      Shipped the new dashboard today. Smaller bundle, faster paint, and it finally
      works on a 320px screen.
    </p>
    <div class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
      <span class="inline-flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        24<span class="sr-only"> replies</span>
      </span>
      <span class="inline-flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
        112<span class="sr-only"> reposts</span>
      </span>
      <span class="inline-flex items-center gap-1.5">
        <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
        1.2K<span class="sr-only"> likes</span>
      </span>
    </div>
  </article>
</div>`,
      react: `function formatCount(n) {
  if (n >= 1_000_000) return \`\${(n / 1_000_000).toFixed(1).replace(/\\.0$/, '')}M\`;
  if (n >= 1_000) return \`\${(n / 1_000).toFixed(1).replace(/\\.0$/, '')}K\`;
  return String(n);
}

const GRADIENTS = ['from-emerald-500 to-teal-600', 'from-blue-500 to-violet-600', 'from-amber-500 to-orange-600'];

export function SocialFeedCards({ posts = [], className = '' }) {
  return (
    <div className={\`mx-auto w-full max-w-md space-y-3 \${className}\`}>
      {posts.map((post, i) => (
        <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span className={\`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white \${GRADIENTS[i % GRADIENTS.length]}\`} aria-hidden="true">
              {post.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{post.name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{post.handle} &middot; {post.time}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{post.body}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {formatCount(post.replies)}<span className="sr-only"> replies</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
              {formatCount(post.reposts)}<span className="sr-only"> reposts</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
              {formatCount(post.likes)}<span className="sr-only"> likes</span>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}`,
      typescript: `export interface FeedPost {
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
  if (n >= 1_000_000) return \`\${(n / 1_000_000).toFixed(1).replace(/\\.0$/, '')}M\`;
  if (n >= 1_000) return \`\${(n / 1_000).toFixed(1).replace(/\\.0$/, '')}K\`;
  return String(n);
}

const GRADIENTS = ['from-emerald-500 to-teal-600', 'from-blue-500 to-violet-600', 'from-amber-500 to-orange-600'];

export interface SocialFeedCardsProps {
  posts?: FeedPost[];
  className?: string;
}

export function SocialFeedCards({ posts = [], className = '' }: SocialFeedCardsProps): JSX.Element {
  return (
    <div className={\`mx-auto w-full max-w-md space-y-3 \${className}\`}>
      {posts.map((post, i) => (
        <article key={post.id} className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span className={\`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white \${GRADIENTS[i % GRADIENTS.length] ?? GRADIENTS[0]}\`} aria-hidden="true">
              {post.initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{post.name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">@{post.handle} &middot; {post.time}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-200">{post.body}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {formatCount(post.replies)}<span className="sr-only"> replies</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg>
              {formatCount(post.reposts)}<span className="sr-only"> reposts</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
              {formatCount(post.likes)}<span className="sr-only"> likes</span>
            </span>
          </div>
        </article>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'social-profile-header',
    category: 'social',
    tags: ['social', 'profile', 'header', 'cover', 'stats'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'verified', labelKey: 'verified' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'handle', type: 'string', required: true, descriptionKey: 'handle' },
      { name: 'bio', type: 'string', descriptionKey: 'bio' },
      { name: 'verified', type: 'boolean', default: 'false', descriptionKey: 'verified' },
      { name: 'stats', type: 'ProfileStat[]', descriptionKey: 'stats' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The cover is a pure-CSS gradient, so there is no image to preload or 404. The
  avatar overlaps the cover with a negative margin and a ring that matches the
  card surface, so it reads as a cutout in both light and dark. Stats are a <dl>
  and each figure is icon + number.
-->
<div class="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div class="h-24 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" aria-hidden="true"></div>
  <div class="px-5 pb-5">
    <div class="-mt-8 flex items-end justify-between gap-3">
      <span class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-lg font-bold text-white ring-4 ring-white dark:ring-gray-900" aria-hidden="true">AR</span>
      <button type="button" class="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
        Follow
      </button>
    </div>
    <div class="mt-3">
      <div class="flex items-center gap-1">
        <h2 class="text-lg font-bold text-gray-900 dark:text-gray-100">Ada Ross</h2>
        <svg viewBox="0 0 24 24" class="h-4 w-4 text-blue-500" fill="currentColor" aria-label="Verified account" role="img"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">&#64;adaross</p>
      <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        Design engineer. Writing about interfaces, type and the web.
      </p>
    </div>
    <dl class="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
      <div class="flex items-baseline gap-1">
        <dt class="sr-only">Posts</dt>
        <dd class="font-bold text-gray-900 dark:text-gray-100">348</dd>
        <span class="text-gray-500 dark:text-gray-400">Posts</span>
      </div>
      <div class="flex items-baseline gap-1">
        <dt class="sr-only">Followers</dt>
        <dd class="font-bold text-gray-900 dark:text-gray-100">12.4K</dd>
        <span class="text-gray-500 dark:text-gray-400">Followers</span>
      </div>
      <div class="flex items-baseline gap-1">
        <dt class="sr-only">Following</dt>
        <dd class="font-bold text-gray-900 dark:text-gray-100">286</dd>
        <span class="text-gray-500 dark:text-gray-400">Following</span>
      </div>
    </dl>
  </div>
</div>`,
      react: `export function SocialProfileHeader({
  name,
  handle,
  bio,
  verified = false,
  stats = [],
  className = '',
}) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  return (
    <div className={\`mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="h-24 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" aria-hidden="true" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-lg font-bold text-white ring-4 ring-white dark:ring-gray-900" aria-hidden="true">
            {initials}
          </span>
          <button type="button" className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            Follow
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{name}</h2>
            {verified ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-500" fill="currentColor" role="img" aria-label="Verified account">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
              </svg>
            ) : null}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{handle}</p>
          {bio ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p> : null}
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
              <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}`,
      typescript: `export interface ProfileStat {
  label: string;
  value: string;
}

export interface SocialProfileHeaderProps {
  name: string;
  handle: string;
  bio?: string;
  verified?: boolean;
  stats?: ProfileStat[];
  className?: string;
}

export function SocialProfileHeader({
  name,
  handle,
  bio,
  verified = false,
  stats = [],
  className = '',
}: SocialProfileHeaderProps): JSX.Element {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  return (
    <div className={\`mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="h-24 bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500" aria-hidden="true" />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-lg font-bold text-white ring-4 ring-white dark:ring-gray-900" aria-hidden="true">
            {initials}
          </span>
          <button type="button" className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
            Follow
          </button>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-1">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{name}</h2>
            {verified ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-500" fill="currentColor" role="img" aria-label="Verified account">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
              </svg>
            ) : null}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">@{handle}</p>
          {bio ? <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p> : null}
        </div>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {stats.map((s) => (
            <div key={s.label} className="flex items-baseline gap-1">
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-bold text-gray-900 dark:text-gray-100">{s.value}</dd>
              <span className="text-gray-500 dark:text-gray-400">{s.label}</span>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'social-icon-grid',
    category: 'social',
    tags: ['social', 'icons', 'grid', 'links', 'svg'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'labelled', labelKey: 'labelled' },
    ],
    props: [
      { name: 'links', type: 'SocialLink[]', descriptionKey: 'links' },
      { name: 'label', type: 'string', default: "'Find us online'", descriptionKey: 'label' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A responsive grid of labelled tiles - two columns on a phone, three from sm up,
  so a six-icon set never crushes into an unreadable single row. The visible
  label doubles as the link's accessible name, so no aria-label is required.
-->
<nav aria-label="Find us online" class="grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3">
  <a href="#" class="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    <span class="text-xs font-medium">X</span>
  </a>
  <a href="#" class="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
    <span class="text-xs font-medium">LinkedIn</span>
  </a>
  <a href="#" class="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" class="h-6 w-6" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
    <span class="text-xs font-medium">Instagram</span>
  </a>
</nav>`,
      react: `const ICONS = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
};

const LABELS = {
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
};

const DEFAULT_LINKS = [
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'github', href: '#' },
  { platform: 'youtube', href: '#' },
  { platform: 'facebook', href: '#' },
];

export function SocialIconGrid({ links = DEFAULT_LINKS, label = 'Find us online', className = '' }) {
  return (
    <nav aria-label={label} className={\`grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3 \${className}\`}>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d={ICONS[link.platform]} />
          </svg>
          <span className="text-xs font-medium">{LABELS[link.platform]}</span>
        </a>
      ))}
    </nav>
  );
}`,
      typescript: `export type SocialPlatform = 'x' | 'linkedin' | 'github' | 'instagram' | 'youtube' | 'facebook';

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
}

const ICONS: Record<SocialPlatform, string> = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
};

const LABELS: Record<SocialPlatform, string> = {
  x: 'X',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  instagram: 'Instagram',
  youtube: 'YouTube',
  facebook: 'Facebook',
};

const DEFAULT_LINKS: SocialLink[] = [
  { platform: 'x', href: '#' },
  { platform: 'linkedin', href: '#' },
  { platform: 'instagram', href: '#' },
  { platform: 'github', href: '#' },
  { platform: 'youtube', href: '#' },
  { platform: 'facebook', href: '#' },
];

export interface SocialIconGridProps {
  links?: SocialLink[];
  label?: string;
  className?: string;
}

export function SocialIconGrid({
  links = DEFAULT_LINKS,
  label = 'Find us online',
  className = '',
}: SocialIconGridProps): JSX.Element {
  return (
    <nav aria-label={label} className={\`grid w-full max-w-lg grid-cols-2 gap-3 sm:grid-cols-3 \${className}\`}>
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.href}
          className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d={ICONS[link.platform]} />
          </svg>
          <span className="text-xs font-medium">{LABELS[link.platform]}</span>
        </a>
      ))}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'social-proof-strip',
    category: 'social',
    tags: ['social', 'proof', 'logos', 'followers', 'social-proof'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'centered', labelKey: 'centered' },
    ],
    props: [
      { name: 'proofLabel', type: 'string', default: "'As seen on'", descriptionKey: 'proofLabel' },
      { name: 'logos', type: 'string[]', descriptionKey: 'logos' },
      { name: 'followers', type: 'FollowerStat[]', descriptionKey: 'followers' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two proofs in one strip: a wrapping row of wordmarks ("as seen on") and a row
  of follower counts. The wordmarks are muted text rather than <img> so nothing
  ever ships a broken logo; swap them for inline SVG once you have brand assets.
  Every follower figure is icon + number, so it survives greyscale.
-->
<section class="w-full max-w-3xl">
  <p class="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">As seen on</p>
  <div class="mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
    <span class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">TechDaily</span>
    <span class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Wireframe</span>
    <span class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">The Verge</span>
    <span class="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">Product Hunt</span>
  </div>
  <div class="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
    <span class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      <span><strong class="font-bold text-gray-900 dark:text-gray-100">48K</strong> followers on X</span>
    </span>
    <span class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
      <span><strong class="font-bold text-gray-900 dark:text-gray-100">120K</strong> subscribers</span>
    </span>
  </div>
</section>`,
      react: `const ICONS = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
};

export function SocialProofStrip({
  proofLabel = 'As seen on',
  logos = [],
  followers = [],
  className = '',
}) {
  return (
    <section className={\`w-full max-w-3xl \${className}\`}>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{proofLabel}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {logos.map((logo) => (
          <span key={logo} className="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">{logo}</span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {followers.map((f) => (
          <span key={f.label} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d={ICONS[f.platform]} />
            </svg>
            <span><strong className="font-bold text-gray-900 dark:text-gray-100">{f.count}</strong> {f.label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export type ProofPlatform = 'x' | 'youtube' | 'instagram';

export interface FollowerStat {
  platform: ProofPlatform;
  count: string;
  label: string;
}

const ICONS: Record<ProofPlatform, string> = {
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  youtube: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z',
};

export interface SocialProofStripProps {
  proofLabel?: string;
  logos?: string[];
  followers?: FollowerStat[];
  className?: string;
}

export function SocialProofStrip({
  proofLabel = 'As seen on',
  logos = [],
  followers = [],
  className = '',
}: SocialProofStripProps): JSX.Element {
  return (
    <section className={\`w-full max-w-3xl \${className}\`}>
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">{proofLabel}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {logos.map((logo) => (
          <span key={logo} className="text-lg font-bold tracking-tight text-gray-400 dark:text-gray-500">{logo}</span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {followers.map((f) => (
          <span key={f.label} className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
              <path d={ICONS[f.platform]} />
            </svg>
            <span><strong className="font-bold text-gray-900 dark:text-gray-100">{f.count}</strong> {f.label}</span>
          </span>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'social-testimonial-tweet',
    category: 'social',
    tags: ['social', 'testimonial', 'tweet', 'quote', 'card'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'verified', labelKey: 'verified' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'handle', type: 'string', required: true, descriptionKey: 'handle' },
      { name: 'quote', type: 'string', required: true, descriptionKey: 'quote' },
      { name: 'verified', type: 'boolean', default: 'false', descriptionKey: 'verified' },
      { name: 'time', type: 'string', descriptionKey: 'time' },
      { name: 'likes', type: 'string', descriptionKey: 'likes' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A real <figure>/<blockquote>/<figcaption> so the quote is announced as a
  testimonial, not loose text. The X mark top-right is decorative (aria-hidden);
  the engagement figures are icon + number.
-->
<figure class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-start gap-3">
    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white" aria-hidden="true">LN</span>
    <figcaption class="min-w-0 flex-1">
      <div class="flex items-center gap-1">
        <span class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Lena Ng</span>
        <svg viewBox="0 0 24 24" class="h-4 w-4 shrink-0 text-blue-500" fill="currentColor" aria-label="Verified account" role="img"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
      </div>
      <span class="block truncate text-xs text-gray-500 dark:text-gray-400">&#64;lenang</span>
    </figcaption>
    <svg viewBox="0 0 24 24" class="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  </div>
  <blockquote class="mt-3 text-sm leading-relaxed text-gray-800 dark:text-gray-100">
    Swapped our whole component pipeline over in an afternoon. The responsive
    defaults alone saved us a week of QA.
  </blockquote>
  <div class="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
    <span>2:14 PM &middot; Jul 12, 2026</span>
    <span class="inline-flex items-center gap-1.5">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
      2.3K<span class="sr-only"> likes</span>
    </span>
  </div>
</figure>`,
      react: `export function SocialTestimonialTweet({
  name,
  handle,
  quote,
  verified = false,
  time,
  likes,
  className = '',
}) {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  return (
    <figure className={\`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white" aria-hidden="true">
          {initials}
        </span>
        <figcaption className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
            {verified ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-blue-500" fill="currentColor" role="img" aria-label="Verified account">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
              </svg>
            ) : null}
          </div>
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">@{handle}</span>
        </figcaption>
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-gray-800 dark:text-gray-100">{quote}</blockquote>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        {time ? <span>{time}</span> : null}
        {likes ? (
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
            {likes}<span className="sr-only"> likes</span>
          </span>
        ) : null}
      </div>
    </figure>
  );
}`,
      typescript: `export interface SocialTestimonialTweetProps {
  name: string;
  handle: string;
  quote: string;
  verified?: boolean;
  time?: string;
  likes?: string;
  className?: string;
}

export function SocialTestimonialTweet({
  name,
  handle,
  quote,
  verified = false,
  time,
  likes,
  className = '',
}: SocialTestimonialTweetProps): JSX.Element {
  const initials = name.split(' ').slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();
  return (
    <figure className={\`w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xs font-bold text-white" aria-hidden="true">
          {initials}
        </span>
        <figcaption className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
            {verified ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-blue-500" fill="currentColor" role="img" aria-label="Verified account">
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/>
              </svg>
            ) : null}
          </div>
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">@{handle}</span>
        </figcaption>
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-gray-800 dark:text-gray-100">{quote}</blockquote>
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        {time ? <span>{time}</span> : null}
        {likes ? (
          <span className="inline-flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
            {likes}<span className="sr-only"> likes</span>
          </span>
        ) : null}
      </div>
    </figure>
  );
}`,
    },
  },
  {
    slug: 'social-share-floating',
    category: 'social',
    tags: ['social', 'share', 'sticky', 'rail', 'article'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'url', type: 'string', required: true, descriptionKey: 'url' },
      { name: 'title', type: 'string', default: "''", descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A vertical share rail that sticks beside the article as it scrolls. It is
  position: sticky, scoped to the flex row - NOT fixed to the window - so it
  never floats over other page sections and never overlaps content at 320px,
  where it sits as a compact 40px column beside the flowing text.
-->
<div class="mx-auto flex w-full max-w-3xl gap-3 sm:gap-5">
  <aside class="sticky top-4 flex h-fit shrink-0 flex-col gap-2" aria-label="Share this article">
    <a href="#" aria-label="Share on X" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </a>
    <a href="#" aria-label="Share on LinkedIn" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
    </a>
    <a href="#" aria-label="Share on Facebook" class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg viewBox="0 0 24 24" class="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    </a>
  </aside>
  <article class="prose min-w-0 flex-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
    <p>Your article body goes here. As the reader scrolls, the share rail on the left stays pinned within this row.</p>
  </article>
</div>`,
      react: `const SHARE = {
  x: {
    label: 'X',
    href: (url, title) => \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title)}\`,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    label: 'LinkedIn',
    href: (url) => \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  facebook: {
    label: 'Facebook',
    href: (url) => \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
};

export function SocialShareFloating({ url, title = '', children, className = '' }) {
  const keys = ['x', 'linkedin', 'facebook'];
  return (
    <div className={\`mx-auto flex w-full max-w-3xl gap-3 sm:gap-5 \${className}\`}>
      <aside className="sticky top-4 flex h-fit shrink-0 flex-col gap-2" aria-label="Share this article">
        {keys.map((key) => {
          const item = SHARE[key];
          return (
            <a
              key={key}
              href={item.href(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={\`Share on \${item.label}\`}
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
}`,
      typescript: `import type { ReactNode } from 'react';

type SharePlatform = 'x' | 'linkedin' | 'facebook';

interface ShareTarget {
  label: string;
  href: (url: string, title: string) => string;
  path: string;
}

const SHARE: Record<SharePlatform, ShareTarget> = {
  x: {
    label: 'X',
    href: (url, title) => \`https://twitter.com/intent/tweet?url=\${encodeURIComponent(url)}&text=\${encodeURIComponent(title)}\`,
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  linkedin: {
    label: 'LinkedIn',
    href: (url) => \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(url)}\`,
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z',
  },
  facebook: {
    label: 'Facebook',
    href: (url) => \`https://www.facebook.com/sharer/sharer.php?u=\${encodeURIComponent(url)}\`,
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
};

export interface SocialShareFloatingProps {
  url: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

const KEYS: SharePlatform[] = ['x', 'linkedin', 'facebook'];

export function SocialShareFloating({
  url,
  title = '',
  children,
  className = '',
}: SocialShareFloatingProps): JSX.Element {
  return (
    <div className={\`mx-auto flex w-full max-w-3xl gap-3 sm:gap-5 \${className}\`}>
      <aside className="sticky top-4 flex h-fit shrink-0 flex-col gap-2" aria-label="Share this article">
        {KEYS.map((key) => {
          const item = SHARE[key];
          return (
            <a
              key={key}
              href={item.href(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={\`Share on \${item.label}\`}
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
}`,
    },
  },
  {
    slug: 'social-counters',
    category: 'social',
    tags: ['social', 'counters', 'stats', 'followers', 'metrics'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'boxed', labelKey: 'boxed' },
    ],
    props: [
      { name: 'counters', type: 'Counter[]', descriptionKey: 'counters' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A wrapping row of metric counters, each an icon + a number + a label - never
  colour alone. It is a <dl>: the number is the <dd>, the caption the <dt>, so a
  screen reader reads "Followers, 48.2K". Below sm the tiles wrap to two-up.
-->
<dl class="flex flex-wrap gap-3">
  <div class="flex min-w-[8rem] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
    </span>
    <div class="min-w-0">
      <dd class="text-xl font-bold text-gray-900 dark:text-gray-100">48.2K</dd>
      <dt class="text-xs text-gray-500 dark:text-gray-400">Followers</dt>
    </div>
  </div>
  <div class="flex min-w-[8rem] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
    </span>
    <div class="min-w-0">
      <dd class="text-xl font-bold text-gray-900 dark:text-gray-100">312K</dd>
      <dt class="text-xs text-gray-500 dark:text-gray-400">Likes</dt>
    </div>
  </div>
  <div class="flex min-w-[8rem] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" aria-hidden="true">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
    </span>
    <div class="min-w-0">
      <dd class="text-xl font-bold text-gray-900 dark:text-gray-100">1,204</dd>
      <dt class="text-xs text-gray-500 dark:text-gray-400">Posts</dt>
    </div>
  </div>
</dl>`,
      react: `const ICONS = {
  followers: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
  posts: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>,
  views: <><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></>,
};

export function SocialCounters({ counters = [], className = '' }) {
  return (
    <dl className={\`flex flex-wrap gap-3 \${className}\`}>
      {counters.map((c) => (
        <div key={c.label} className="flex min-w-[8rem] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" aria-hidden="true">
            {c.icon === 'likes' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{ICONS[c.icon]}</svg>
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
}`,
      typescript: `import type { ReactElement } from 'react';

export type CounterIcon = 'followers' | 'likes' | 'posts' | 'views';

export interface Counter {
  icon: CounterIcon;
  value: string;
  label: string;
}

// Stroke-icon glyphs, keyed by metric. 'likes' is a filled heart and is rendered
// separately below because it needs fill, not stroke.
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

export interface SocialCountersProps {
  counters?: Counter[];
  className?: string;
}

export function SocialCounters({ counters = [], className = '' }: SocialCountersProps): JSX.Element {
  return (
    <dl className={\`flex flex-wrap gap-3 \${className}\`}>
      {counters.map((c) => (
        <div key={c.label} className="flex min-w-[8rem] flex-1 items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" aria-hidden="true">
            {c.icon === 'likes' ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
}`,
    },
  },
];
