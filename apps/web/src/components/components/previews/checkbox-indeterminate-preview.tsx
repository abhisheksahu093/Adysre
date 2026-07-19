'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `checkbox-indeterminate`.
 *
 * Mirrors the `typescript` code variant verbatim. It opens with exactly one of
 * three children selected, so the parent is genuinely in the mixed state on first
 * paint - the dash is drawn by the platform off the `indeterminate` DOM property
 * set in the effect below, which is the entire point of the component. Keep this
 * in step with `src/data/components/forms-choice.ts`.
 */
interface IndeterminateOption {
  value: string;
  label: string;
}

interface IndeterminateCheckboxTreeProps {
  legend: string;
  parentLabel: string;
  options: readonly IndeterminateOption[];
  defaultSelected?: readonly string[];
}

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

function IndeterminateCheckboxTree({
  legend,
  parentLabel,
  options,
  defaultSelected = [],
}: IndeterminateCheckboxTreeProps) {
  const [selected, setSelected] = useState<string[]>([...defaultSelected]);
  const parentRef = useRef<HTMLInputElement>(null);

  const allChecked = selected.length === options.length && options.length > 0;
  const mixed = selected.length > 0 && !allChecked;

  // `indeterminate` is a DOM property - no HTML attribute, no JSX prop - so a ref
  // in an effect is the only way to write it.
  useEffect(() => {
    if (parentRef.current) parentRef.current.indeterminate = mixed;
  }, [mixed]);

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <label htmlFor="preview-tree-all" className="flex min-h-7 cursor-pointer items-center gap-2.5">
        <input
          ref={parentRef}
          id="preview-tree-all"
          type="checkbox"
          checked={allChecked}
          aria-checked={mixed ? 'mixed' : allChecked}
          onChange={() => setSelected(allChecked ? [] : options.map((o) => o.value))}
          className={BOX}
        />
        <span className="text-sm text-gray-900 dark:text-gray-100">{parentLabel}</span>
      </label>

      <ul className="ml-2 mt-1 list-none border-l border-gray-200 pl-[1.875rem] dark:border-gray-700">
        {options.map((option) => (
          <li key={option.value}>
            <label
              htmlFor={`preview-tree-${option.value}`}
              className="flex min-h-7 cursor-pointer items-center gap-2.5"
            >
              <input
                id={`preview-tree-${option.value}`}
                type="checkbox"
                value={option.value}
                checked={selected.includes(option.value)}
                onChange={() =>
                  setSelected((current) =>
                    current.includes(option.value)
                      ? current.filter((v) => v !== option.value)
                      : [...current, option.value],
                  )
                }
                className={BOX}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{option.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

const OPTIONS: readonly IndeterminateOption[] = [
  { value: 'mentions', label: 'Mentions and replies' },
  { value: 'assignments', label: 'Assignments' },
  { value: 'deploys', label: 'Deploys' },
];

export default function CheckboxIndeterminatePreview() {
  return (
    <div className="w-full max-w-sm">
      <IndeterminateCheckboxTree
        legend="Notify me about"
        parentLabel="All activity"
        options={OPTIONS}
        defaultSelected={['mentions']}
      />
    </div>
  );
}
