'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Live preview for `checkbox-list-group`.
 *
 * Mirrors the `typescript` code variant verbatim. One of three rows starts
 * selected, so the select-all opens in its mixed state and the header count reads
 * "1 of 3" - the two things this component exists to get right. Keep this in step
 * with `src/data/components/forms-choice.ts`.
 */
interface CheckboxListItem {
  value: string;
  name: string;
  meta?: string;
}

interface CheckboxListGroupProps {
  legend: string;
  items: readonly CheckboxListItem[];
  defaultSelected?: readonly string[];
}

const BOX =
  'h-5 w-5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400';

function CheckboxListGroup({ legend, items, defaultSelected = [] }: CheckboxListGroupProps) {
  const [selected, setSelected] = useState<string[]>([...defaultSelected]);
  const allRef = useRef<HTMLInputElement>(null);

  const every = selected.length === items.length && items.length > 0;
  const mixed = selected.length > 0 && !every;

  useEffect(() => {
    if (allRef.current) allRef.current.indeterminate = mixed;
  }, [mixed]);

  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2 p-0 text-sm font-semibold text-gray-900 dark:text-gray-100">
        {legend}
      </legend>

      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        <label
          htmlFor="preview-list-all"
          className="flex cursor-pointer items-center gap-3 bg-gray-50 px-4 py-3 font-semibold hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <input
            ref={allRef}
            id="preview-list-all"
            type="checkbox"
            checked={every}
            aria-checked={mixed ? 'mixed' : every}
            onChange={() => setSelected(every ? [] : items.map((i) => i.value))}
            className={BOX}
          />
          <span className="text-sm text-gray-900 dark:text-gray-100">Select all</span>
          <span className="ml-auto text-xs font-normal tabular-nums text-gray-600 dark:text-gray-400">
            {selected.length} of {items.length} selected
          </span>
        </label>

        {items.map((item) => (
          <label
            key={item.value}
            htmlFor={`preview-list-${item.value}`}
            className="flex cursor-pointer items-center gap-3 border-t border-gray-200 px-4 py-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <input
              id={`preview-list-${item.value}`}
              type="checkbox"
              value={item.value}
              checked={selected.includes(item.value)}
              onChange={() =>
                setSelected((current) =>
                  current.includes(item.value)
                    ? current.filter((v) => v !== item.value)
                    : [...current, item.value],
                )
              }
              className={BOX}
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-sm text-gray-900 dark:text-gray-100">{item.name}</span>
              {item.meta ? (
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.meta}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

const REPOS: readonly CheckboxListItem[] = [
  { value: 'web', name: 'adysre/web', meta: 'Updated 2 hours ago' },
  { value: 'api', name: 'adysre/api', meta: 'Updated yesterday' },
  { value: 'worker', name: 'adysre/worker', meta: 'Updated last week' },
];

export default function CheckboxListGroupPreview() {
  return (
    <div className="w-full max-w-sm">
      <CheckboxListGroup
        legend="Sync these repositories"
        items={REPOS}
        defaultSelected={['web']}
      />
    </div>
  );
}
