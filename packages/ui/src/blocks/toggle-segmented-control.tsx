'use client';

/**
 * Live preview for `toggle-segmented-control`.
 * Mirrors the `typescript` variant. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface SegmentedOption {
  value: string;
  label: string;
}

interface ToggleSegmentedControlProps {
  legend: string;
  name: string;
  options: SegmentedOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function ToggleSegmentedControl({
  legend,
  name,
  options,
  defaultValue,
  onChange,
  className = '',
}: ToggleSegmentedControlProps) {
  const initial = defaultValue ?? options[0]?.value;
  return (
    <fieldset className={`inline-flex w-full max-w-xs rounded-lg bg-gray-100 p-1 dark:bg-gray-800 ${className}`}>
      <legend className="sr-only">{legend}</legend>
      {options.map((opt) => (
        <label key={opt.value} className="flex-1">
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === initial}
            className="peer sr-only"
            onChange={() => onChange?.(opt.value)}
          />
          <span className="flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:font-semibold peer-checked:text-gray-900 peer-checked:shadow-sm peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 dark:text-gray-300 dark:peer-checked:bg-gray-950 dark:peer-checked:text-white">
            {opt.label}
          </span>
        </label>
      ))}
    </fieldset>
  );
}

export default function ToggleSegmentedControlPreview() {
  return (
    <ToggleSegmentedControl
      legend="View density"
      name="preview-density"
      options={[
        { value: 'comfortable', label: 'Comfortable' },
        { value: 'compact', label: 'Compact' },
      ]}
      defaultValue="comfortable"
    />
  );
}
