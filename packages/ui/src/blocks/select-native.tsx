'use client';

import { useId, useState } from 'react';

/**
 * Live preview for `select-native`.
 *
 * Mirrors the `typescript` code variant. Nothing to seed open here - the popup
 * belongs to the browser, which is the entire point of the component. Keep this
 * in step with `src/data/components/forms-select.ts`.
 */
interface SelectItem {
  value: string;
  label: string;
  disabled?: boolean;
}

interface NativeSelectProps {
  label: string;
  items: SelectItem[];
  value?: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function NativeSelect({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  className = '',
}: NativeSelectProps) {
  const id = useId();

  return (
    <div className={className}>
      <label
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          disabled={disabled}
          onChange={(event) => onSelect?.(event.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-9 text-sm text-gray-900 [color-scheme:light] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:[color-scheme:dark] dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {items.map((item) => (
            <option key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  );
}

const PLANS: SelectItem[] = [
  { value: 'starter', label: 'Starter - $0/month' },
  { value: 'growth', label: 'Growth - $29/month' },
  { value: 'scale', label: 'Scale - $99/month' },
  { value: 'business', label: 'Business - $249/month' },
  { value: 'enterprise', label: 'Enterprise - talk to sales' },
  { value: 'legacy', label: 'Legacy (no longer sold)', disabled: true },
];

export default function SelectNativePreview() {
  const [plan, setPlan] = useState('growth');

  return (
    <div className="w-full max-w-sm">
      <NativeSelect label="Plan" items={PLANS} value={plan} onSelect={setPlan} />
      <p className="mt-3 text-xs text-gray-600 dark:text-gray-400">
        Selected: <span className="font-medium">{plan}</span>
      </p>
    </div>
  );
}
