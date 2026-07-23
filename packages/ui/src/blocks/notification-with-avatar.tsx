/**
 * Live preview for `notification-with-avatar`.
 *
 * Mirrors the `typescript` code variant. Initials avatar (no remote image) and
 * an unread marker that is both a dot and an sr-only word. Keep this in step
 * with `src/data/components/notifications.ts`.
 */
interface NotificationWithAvatarProps {
  name: string;
  action: string;
  timestamp?: string;
  initials?: string;
  unread?: boolean;
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function NotificationWithAvatar({
  name,
  action,
  timestamp,
  initials,
  unread = false,
  className = '',
}: NotificationWithAvatarProps) {
  return (
    <div
      className={`flex w-full max-w-md items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
      >
        {initials ?? initialsOf(name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{name}</span> {action}
        </p>
        {timestamp !== undefined ? (
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
        ) : null}
      </div>
      {unread ? (
        <>
          <span
            className="mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-600 dark:bg-blue-400"
            aria-hidden="true"
          />
          <span className="sr-only">Unread</span>
        </>
      ) : null}
    </div>
  );
}

export default function NotificationWithAvatarPreview() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <NotificationWithAvatar
        name="Dana Okoro"
        action="mentioned you in Sprint notes"
        timestamp="5m ago"
        unread
      />
      <NotificationWithAvatar
        name="Mateo Ruiz"
        action="approved your pull request"
        timestamp="1h ago"
      />
    </div>
  );
}
