'use client';

import { useState } from 'react';

/**
 * Live preview for `radio-button-group`.
 *
 * Mirrors the `typescript` code variant verbatim. The echo line underneath proves
 * the segments are one exclusive group, and the arrow keys move between them -
 * both inherited from the native radios hidden under the faces. Keep this in step
 * with `src/data/components/forms-choice.ts`.
 */
interface SegmentedOption {
  value: string;
  label: string;
}

interface SegmentedRadioGroupProps {
  name: string;
  legend: string;
  options: readonly SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}

const FACE =
  'flex min-h-8 items-center justify-center gap-1 whitespace-nowrap rounded-lg px-3 text-sm font-medium text-gray-600 transition-colors peer-checked:bg-white peer-checked:text-gray-900 peer-checked:shadow-sm peer-checked:[&_svg]:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-600 peer-disabled:opacity-50 motion-reduce:transition-none dark:text-gray-400 dark:peer-checked:bg-gray-700 dark:peer-checked:text-gray-50 dark:peer-focus-visible:outline-blue-400';

function Tick() {
  return (
    <svg
      className="h-3.5 w-3.5 text-blue-600 opacity-0 dark:text-blue-400"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

export function SegmentedRadioGroup({ name, legend, options, value, onChange }: SegmentedRadioGroupProps) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-[0.625rem] bg-gray-100 p-1 dark:bg-gray-800">
        {options.map((option) => (
          <label
            key={option.value}
            htmlFor={`${name}-${option.value}`}
            className="flex-1 cursor-pointer"
          >
            <input
              id={`${name}-${option.value}`}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className={FACE}>
              <Tick />
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const RANGES: readonly SegmentedOption[] = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
];

export default function RadioButtonGroupPreview() {
  const [range, setRange] = useState('7d');

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <SegmentedRadioGroup
        name="preview-range"
        legend="Date range"
        options={RANGES}
        value={range}
        onChange={setRange}
      />
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Showing the last <span className="font-medium">{range}</span>
      </p>
    </div>
  );
}
