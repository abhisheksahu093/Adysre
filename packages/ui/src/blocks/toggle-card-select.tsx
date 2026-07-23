'use client';

/**
 * Live preview for `toggle-card-select`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface CardSelectOption {
  value: string;
  title: string;
  detail: string;
}

interface ToggleCardSelectProps {
  legend: string;
  name: string;
  options: CardSelectOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ToggleCardSelect({
  legend,
  name,
  options,
  defaultValue,
  onChange,
  className = '',
}: ToggleCardSelectProps) {
  const initial = defaultValue ?? options[0]?.value;
  return (
    <fieldset className={`grid w-full gap-3 sm:grid-cols-2 ${className}`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => (
        <label
          key={opt.value}
          className="relative flex cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-4 transition-colors has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:has-[:checked]:border-blue-400"
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === initial}
            className="peer sr-only"
            onChange={() => onChange?.(opt.value)}
          />
          <span aria-hidden="true" className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white opacity-0 peer-checked:opacity-100">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
              <path d="M4 10l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">{opt.title}</span>
          <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{opt.detail}</span>
        </label>
      ))}
    </fieldset>
  );
}

export default function ToggleCardSelectPreview() {
  return (
    <ToggleCardSelect
      legend="Choose a plan"
      name="preview-plan"
      defaultValue="starter"
      options={[
        { value: 'starter', title: 'Starter', detail: '$9 / month' },
        { value: 'pro', title: 'Pro', detail: '$29 / month' },
      ]}
    />
  );
}
