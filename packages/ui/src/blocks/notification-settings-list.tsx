'use client';

/**
 * Live preview for `notification-settings-list`.
 *
 * Mirrors the `typescript` code variant. Each toggle is a real button with
 * role="switch" + aria-checked; the preview owns the state so the switches
 * actually flip. Keep this in step with `src/data/components/notifications.ts`.
 */
import { useState } from 'react';

interface NotificationSetting {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

interface NotificationSettingsListProps {
  items: NotificationSetting[];
  onToggle?: (id: string, enabled: boolean) => void;
  className?: string;
}

export function NotificationSettingsList({ items, onToggle, className = '' }: NotificationSettingsListProps) {
  return (
    <ul
      className={`w-full max-w-md divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
            {item.description !== undefined ? (
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={item.enabled}
            aria-label={item.label}
            onClick={() => onToggle?.(item.id, !item.enabled)}
            className={`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ${item.enabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition motion-reduce:transition-none ${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}

const SEED: NotificationSetting[] = [
  { id: 's1', label: 'Product updates', description: 'News about features and improvements.', enabled: true },
  { id: 's2', label: 'Security alerts', description: 'Sign-ins and password changes.', enabled: false },
  { id: 's3', label: 'Weekly digest', description: 'A Monday summary of your workspace.', enabled: true },
];

export default function NotificationSettingsListPreview() {
  const [items, setItems] = useState<NotificationSetting[]>(SEED);

  const toggle = (id: string, enabled: boolean): void => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    );
  };

  return (
    <div className="w-full max-w-md">
      <NotificationSettingsList items={items} onToggle={toggle} />
    </div>
  );
}

export const minHeight = 320;
