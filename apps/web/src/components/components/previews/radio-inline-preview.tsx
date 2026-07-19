'use client';

import { useState } from 'react';

/**
 * Live preview for `radio-inline`.
 *
 * Mirrors the `typescript` code variant verbatim. Four options inside a
 * `max-w-sm` column, which is deliberate: it is narrow enough that the row wraps,
 * so the `flex-wrap` and `gap-y-2` that keep this usable at 320px are visible
 * rather than theoretical. Keep this in step with
 * `src/data/components/forms-choice.ts`.
 */
interface InlineOption {
  value: string;
  label: string;
}

interface InlineRadioGroupProps {
  name: string;
  legend: string;
  options: readonly InlineOption[];
  value: string;
  onChange: (value: string) => void;
}

const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

function InlineRadioGroup({ name, legend, options, value, onChange }: InlineRadioGroupProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={`${name}-${option.value}`}
            className="flex min-h-7 cursor-pointer items-center gap-2"
          >
            <input
              id={`${name}-${option.value}`}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className={DOT}
            />
            <span className="whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const PRIORITIES: readonly InlineOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function RadioInlinePreview() {
  const [priority, setPriority] = useState('normal');

  return (
    <div className="w-full max-w-sm">
      <InlineRadioGroup
        name="preview-priority"
        legend="Priority"
        options={PRIORITIES}
        value={priority}
        onChange={setPriority}
      />
    </div>
  );
}
