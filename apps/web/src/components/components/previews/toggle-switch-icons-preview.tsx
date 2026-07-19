'use client';

/**
 * Live preview for `toggle-switch-icons`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleSwitchIconsProps {
  label: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

function ToggleSwitchIcons({
  label,
  defaultChecked = false,
  onChange,
  className = '',
}: ToggleSwitchIconsProps) {
  return (
    <label className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center ${className}`}>
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
        className="absolute inset-0 rounded-full bg-gray-400 transition-colors peer-checked:bg-emerald-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-emerald-600 dark:bg-gray-600 dark:peer-checked:bg-emerald-500 dark:peer-focus-visible:outline-emerald-400"
      />
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} className="pointer-events-none absolute left-1.5 h-3 w-3 text-white opacity-0 peer-checked:opacity-100">
        <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={3} className="pointer-events-none absolute right-1.5 h-3 w-3 text-gray-100 peer-checked:opacity-0">
        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
      </svg>
      <span aria-hidden="true" className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-7 motion-reduce:transition-none" />
    </label>
  );
}

export default function ToggleSwitchIconsPreview() {
  return <ToggleSwitchIcons label="Autoplay" defaultChecked />;
}
