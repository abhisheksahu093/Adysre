'use client';

/**
 * Live preview for `notification-banner-gradient`.
 *
 * Mirrors the `typescript` code variant. Solid white text on the gradient plus
 * an icon so meaning survives without colour; a real dismiss button. Keep this
 * in step with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface NotificationBannerGradientProps {
  title: string;
  message?: string;
  ctaLabel?: string;
  onClick?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

function NotificationBannerGradient({
  title,
  message,
  ctaLabel,
  onClick,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationBannerGradientProps) {
  return (
    <div
      className={`relative flex flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white sm:flex-row sm:items-center sm:gap-4 ${className}`}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {message !== undefined ? <p className="mt-0.5 text-sm text-white/90">{message}</p> : null}
      </div>
      {ctaLabel !== undefined ? (
        <button
          type="button"
          onClick={onClick}
          className="flex-none rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 motion-reduce:transition-none"
        >
          {ctaLabel}
        </button>
      ) : null}
      {onDismiss !== undefined ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:static"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default function NotificationBannerGradientPreview() {
  const [visible, setVisible] = useState<boolean>(true);

  return (
    <div className="w-full max-w-lg">
      {visible ? (
        <NotificationBannerGradient
          title="Realtime alerts are live"
          message="Get pinged the moment a deploy finishes or fails."
          ctaLabel="Explore"
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">Banner dismissed.</p>
      )}

      <button
        type="button"
        onClick={() => setVisible(true)}
        className="mx-auto mt-3 block rounded text-xs font-medium text-gray-600 underline underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        Reset preview
      </button>
    </div>
  );
}
