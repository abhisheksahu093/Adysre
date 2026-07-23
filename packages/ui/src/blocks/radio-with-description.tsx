'use client';

import { useState } from 'react';

/**
 * Live preview for `radio-with-description`.
 *
 * Mirrors the `typescript` code variant verbatim. Worth arrowing through with a
 * screen reader on: each option announces its title as the name and the
 * description afterwards, because the description is referenced with
 * aria-describedby rather than wrapped in the label. Keep this in step with
 * `src/data/components/forms-choice.ts`.
 */
interface DescribedOption {
  value: string;
  title: string;
  description: string;
}

interface DescribedRadioGroupProps {
  name: string;
  legend: string;
  options: readonly DescribedOption[];
  value: string;
  onChange: (value: string) => void;
}

const DOT =
  'mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

export function DescribedRadioGroup({ name, legend, options, value, onChange }: DescribedRadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-3.5 border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      {options.map((option) => {
        const id = `${name}-${option.value}`;
        const descId = `${id}-desc`;

        return (
          <div key={option.value} className="flex items-start gap-2.5">
            <input
              id={id}
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              aria-describedby={descId}
              className={DOT}
            />
            <div>
              <label
                htmlFor={id}
                className="block min-h-6 cursor-pointer text-sm font-medium leading-6 text-gray-900 dark:text-gray-100"
              >
                {option.title}
              </label>
              <p
                id={descId}
                className="mt-0.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400"
              >
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </fieldset>
  );
}

const VISIBILITY: readonly DescribedOption[] = [
  {
    value: 'private',
    title: 'Private',
    description: 'Only people you invite can open the workspace.',
  },
  {
    value: 'team',
    title: 'Everyone at ADYSRE',
    description: 'Anyone with a verified company email can join.',
  },
  {
    value: 'public',
    title: 'Public',
    description: 'Anyone with the link can read; only members can edit.',
  },
];

export default function RadioWithDescriptionPreview() {
  const [visibility, setVisibility] = useState('private');

  return (
    <div className="w-full max-w-sm">
      <DescribedRadioGroup
        name="preview-visibility"
        legend="Workspace visibility"
        options={VISIBILITY}
        value={visibility}
        onChange={setVisibility}
      />
    </div>
  );
}
