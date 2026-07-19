'use client';

/**
 * Live preview for `toggle-switch-labeled`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleSwitchLabeledProps {
  label: string;
  onText?: string;
  offText?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

function ToggleSwitchLabeled({
  label,
  onText = 'On',
  offText = 'Off',
  defaultChecked = false,
  onChange,
  className = '',
}: ToggleSwitchLabeledProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <label className="relative inline-flex h-7 w-16 shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          role="switch"
          aria-label={label}
          className="peer sr-only"
          defaultChecked={defaultChecked}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-blue-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:bg-gray-600 dark:peer-checked:bg-blue-500 dark:peer-focus-visible:outline-blue-400"
        />
        <span aria-hidden="true" className="pointer-events-none absolute left-2 text-[0.625rem] font-bold uppercase tracking-wide text-white opacity-0 peer-checked:opacity-100">
          {onText}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute right-2 text-[0.625rem] font-bold uppercase tracking-wide text-gray-700 peer-checked:opacity-0 dark:text-gray-100">
          {offText}
        </span>
        <span aria-hidden="true" className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-9 motion-reduce:transition-none" />
      </label>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
    </div>
  );
}

export default function ToggleSwitchLabeledPreview() {
  return <ToggleSwitchLabeled label="Wi-Fi" defaultChecked />;
}
