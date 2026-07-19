/**
 * Live preview for `alert-system-status`.
 *
 * Mirrors the `typescript` code variant verbatim. State is never colour alone:
 * each row pairs a distinct icon shape (check / triangle / cross) with a written
 * label, so it reads in greyscale and to a screen reader.
 *
 * Keep this in step with `src/data/components/alerts.ts`.
 */
type SystemStatus = 'operational' | 'degraded' | 'down';

interface AlertSystemStatusProps {
  status: SystemStatus;
  label: string;
  description?: string;
  className?: string;
}

interface StatusMeta {
  text: string;
  chip: string;
  badge: string;
  path: string;
}

const STATUS_META: Record<SystemStatus, StatusMeta> = {
  operational: {
    text: 'Operational',
    chip: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  },
  degraded: {
    text: 'Degraded',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    path: 'M8.3 3.1a2 2 0 0 1 3.4 0l6 10A2 2 0 0 1 16 16H4a2 2 0 0 1-1.7-3l6-9.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  },
  down: {
    text: 'Down',
    chip: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    badge: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.7 7.7a1 1 0 0 1 1.4 0L10 8.6l.9-.9a1 1 0 1 1 1.4 1.4l-.9.9.9.9a1 1 0 0 1-1.4 1.4l-.9-.9-.9.9a1 1 0 0 1-1.4-1.4l.9-.9-.9-.9a1 1 0 0 1 0-1.4Z',
  },
};

function AlertSystemStatus({ status, label, description, className = '' }: AlertSystemStatusProps) {
  const meta: StatusMeta = STATUS_META[status];

  return (
    <div
      role="status"
      className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${meta.chip}`} aria-hidden="true">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d={meta.path} />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        {description !== undefined ? (
          <p className="text-sm leading-normal text-gray-600 dark:text-gray-400">{description}</p>
        ) : null}
      </div>
      <span className={`flex-none rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badge}`}>{meta.text}</span>
    </div>
  );
}

export default function AlertSystemStatusPreview() {
  return (
    <div className="w-full max-w-md space-y-2">
      <AlertSystemStatus status="operational" label="API" description="All endpoints responding normally." />
      <AlertSystemStatus status="degraded" label="Webhooks" description="Delivery is delayed by a few minutes." />
      <AlertSystemStatus status="down" label="Reporting" description="The dashboard is unavailable." />
    </div>
  );
}

export const minHeight = 240;
