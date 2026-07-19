'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `icon-button`.
 *
 * Mirrors the `typescript` code variant verbatim. The accessible name is the
 * whole subject of this component and it is invisible by definition, so the
 * preview prints each button's `label` underneath it - what a screen reader
 * announces, made visible.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  label: string;
  children: ReactNode;
}

function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}

const ICON_CLASS = 'h-5 w-5';
const ICON_PROPS = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
} as const;

export default function IconButtonPreview() {
  return (
    <div className="flex items-start gap-6">
      <figure className="flex flex-col items-center gap-2">
        <IconButton label="Add to favourites">
          <svg className={ICON_CLASS} {...ICON_PROPS}>
            <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12c-1.8 4.4-9.3 9-9.3 9Z" />
          </svg>
        </IconButton>
        <figcaption className="text-xs text-gray-600 dark:text-gray-400">
          &ldquo;Add to favourites&rdquo;
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <IconButton label="Share this page">
          <svg className={ICON_CLASS} {...ICON_PROPS}>
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
          </svg>
        </IconButton>
        <figcaption className="text-xs text-gray-600 dark:text-gray-400">
          &ldquo;Share this page&rdquo;
        </figcaption>
      </figure>
      <figure className="flex flex-col items-center gap-2">
        <IconButton label="Delete item">
          <svg className={ICON_CLASS} {...ICON_PROPS}>
            <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6" />
          </svg>
        </IconButton>
        <figcaption className="text-xs text-gray-600 dark:text-gray-400">
          &ldquo;Delete item&rdquo;
        </figcaption>
      </figure>
    </div>
  );
}
