'use client';

import { useState } from 'react';

/**
 * Live preview for `list-selectable-checkbox`.
 *
 * Mirrors the `typescript` code variant verbatim. One row starts selected so the
 * header count opens at "1 selected". Keep this in step with
 * `src/data/components/lists.ts`.
 */
interface SelectableItem {
  id: string;
  label: string;
}

interface ListSelectableCheckboxProps {
  items: SelectableItem[];
  defaultSelected?: string[];
  legend?: string;
}

export function ListSelectableCheckbox({
  items,
  defaultSelected = [],
  legend = 'Select items',
}: ListSelectableCheckboxProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(defaultSelected));

  function toggle(id: string): void {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <fieldset className="w-full border-0 p-0">
      <legend className="mb-2 flex w-full items-center justify-between p-0">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{legend}</span>
        <span className="text-xs font-normal tabular-nums text-gray-500 dark:text-gray-400">
          {selected.size} selected
        </span>
      </legend>
      <ul className="divide-y divide-gray-200 overflow-hidden rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50 has-[:checked]:bg-blue-50 dark:hover:bg-gray-800 dark:has-[:checked]:bg-blue-950">
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
                className="h-5 w-5 shrink-0 accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500"
              />
              <span className="min-w-0 flex-1 truncate text-sm text-gray-900 dark:text-gray-100">
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

const FILES: SelectableItem[] = [
  { id: '1', label: 'Q3 revenue report.pdf' },
  { id: '2', label: 'Design system audit.fig' },
  { id: '3', label: 'Onboarding walkthrough.mp4' },
  { id: '4', label: 'Customer interviews.csv' },
];

export const minHeight = 280;

export default function ListSelectableCheckboxPreview() {
  return (
    <div className="w-full max-w-sm">
      <ListSelectableCheckbox items={FILES} defaultSelected={['1']} legend="Attach files" />
    </div>
  );
}
