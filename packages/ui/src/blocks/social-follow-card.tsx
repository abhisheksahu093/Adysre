'use client';

/**
 * Live preview for `social-follow-card`. Mirrors the `typescript` variant.
 * Tab to the button and press it - the label flips and aria-pressed tracks it.
 * Keep in step with `src/data/components/social.ts`.
 */
import { useState } from 'react';

interface SocialFollowCardProps {
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
}: SocialFollowCardProps) {
  const [isFollowing, setIsFollowing] = useState<boolean>(following);
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
    <div
      className={`w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div className="flex items-start gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-sm font-bold text-white"
          aria-hidden="true"
        >
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
      {bio ? <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{bio}</p> : null}
    </div>
  );
}

export default function SocialFollowCardPreview() {
  return (
    <SocialFollowCard
      name="Ada Ross"
      handle="adaross"
      bio="Design engineer. Writing about interfaces, type and the web."
    />
  );
}

export const minHeight = 240;
