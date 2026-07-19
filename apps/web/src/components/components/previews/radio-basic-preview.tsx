'use client';

import { useState } from 'react';

/**
 * Live preview for `radio-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Try the arrow keys: the group
 * is one tab stop and Up/Down move the selection, all of it from the native radio
 * type rather than from any code here. Keep this in step with
 * `src/data/components/forms-choice.ts`.
 */
interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  legend: string;
  options: readonly RadioOption[];
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

const DOT =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

function RadioGroup({ name, legend, options, value, onChange, hint }: RadioGroupProps) {
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <fieldset className="border-0 p-0" aria-describedby={hintId}>
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label
          key={option.value}
          htmlFor={`${name}-${option.value}`}
          className="flex min-h-7 cursor-pointer items-center gap-2.5"
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
          <span className="text-sm text-gray-900 dark:text-gray-100">{option.label}</span>
        </label>
      ))}

      {hint ? (
        <p id={hintId} className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          {hint}
        </p>
      ) : null}
    </fieldset>
  );
}

const OPTIONS: readonly RadioOption[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Every 3 months' },
  { value: 'yearly', label: 'Yearly - save 20%' },
];

export default function RadioBasicPreview() {
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="w-full max-w-sm">
      <RadioGroup
        name="preview-billing"
        legend="Billing period"
        options={OPTIONS}
        value={billing}
        onChange={setBilling}
        hint="You can change this at any time from Settings."
      />
    </div>
  );
}
