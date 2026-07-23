'use client';

import { useState } from 'react';

/**
 * Live preview for `radio-card`.
 *
 * Mirrors the `typescript` code variant verbatim. One card is selected on load
 * and the selection is exclusive - click a second and the first releases, which
 * is the native radio doing the work rather than the state below. Keep this in
 * step with `src/data/components/forms-choice.ts`.
 */
interface RadioCardOption {
  value: string;
  title: string;
  meta: string;
}

interface RadioCardGroupProps {
  name: string;
  legend: string;
  options: readonly RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
}

const CARD =
  'relative flex cursor-pointer items-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3.5 transition-colors hover:bg-gray-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue-600 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:has-[:checked]:border-blue-500 dark:has-[:checked]:bg-blue-950 dark:has-[:focus-visible]:outline-blue-400';

const DOT =
  'ml-auto h-5 w-5 shrink-0 rounded-full border border-gray-400 bg-white peer-checked:border-blue-600 peer-checked:bg-[radial-gradient(circle,#2563eb_0_45%,transparent_46%)] dark:border-gray-500 dark:bg-gray-900 dark:peer-checked:border-blue-500 dark:peer-checked:bg-[radial-gradient(circle,#60a5fa_0_45%,transparent_46%)]';

export function RadioCardGroup({ name, legend, options, value, onChange }: RadioCardGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => (
        <label key={option.value} htmlFor={`${name}-${option.value}`} className={CARD}>
          <input
            id={`${name}-${option.value}`}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="peer sr-only"
          />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {option.title}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{option.meta}</span>
          </span>
          <span aria-hidden="true" className={DOT} />
        </label>
      ))}
    </fieldset>
  );
}

const PLANS: readonly RadioCardOption[] = [
  { value: 'starter', title: 'Starter', meta: '$12 / month · 3 projects' },
  { value: 'growth', title: 'Growth', meta: '$29 / month · Unlimited projects' },
  { value: 'scale', title: 'Scale', meta: '$79 / month · SSO and audit log' },
];

export default function RadioCardPreview() {
  const [plan, setPlan] = useState('growth');

  return (
    <div className="w-full max-w-sm">
      <RadioCardGroup
        name="preview-plan"
        legend="Choose a plan"
        options={PLANS}
        value={plan}
        onChange={setPlan}
      />
    </div>
  );
}
