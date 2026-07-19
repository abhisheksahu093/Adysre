'use client';

import { useEffect, useId, useRef, useState } from 'react';

/**
 * Live preview for `multiselect-grouped`.
 *
 * Mirrors the `typescript` code variant, seeded open with two groups
 * deliberately half-chosen - the dash on their select-all box is the third
 * state (`indeterminate`) the whole component exists for. Projects is empty and
 * shows the ordinary unchecked box for contrast.
 *
 * Keep in step with `src/data/components/forms-select.ts`.
 */
interface GroupOption {
  value: string;
  label: string;
}

interface PermissionGroup {
  label: string;
  options: GroupOption[];
}

interface MultiselectGroupedProps {
  label: string;
  items: PermissionGroup[];
  value: string[];
  onSelect?: (next: string[]) => void;
  disabled?: boolean;
  defaultOpen?: boolean;
}

type GroupState = 'none' | 'some' | 'all';

function SelectAllBox({
  groupLabel,
  state,
  onToggle,
}: {
  groupLabel: string;
  state: GroupState;
  onToggle: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === 'some';
  }, [state]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={state === 'all'}
      aria-label={`Select all ${groupLabel}`}
      onChange={onToggle}
      className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
    />
  );
}

function MultiselectGrouped({
  label,
  items,
  value,
  onSelect,
  disabled = false,
  defaultOpen = false,
}: MultiselectGroupedProps) {
  const baseId = useId();
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function groupState(group: PermissionGroup): GroupState {
    const chosen = group.options.filter((option) => value.includes(option.value)).length;
    if (chosen === 0) return 'none';
    if (chosen === group.options.length) return 'all';
    return 'some';
  }

  function toggleGroup(group: PermissionGroup): void {
    const values = group.options.map((option) => option.value);
    const next =
      groupState(group) === 'all'
        ? value.filter((v) => !values.includes(v))
        : [...value, ...values.filter((v) => !value.includes(v))];
    onSelect?.(next);
  }

  function toggleValue(next: string): void {
    onSelect?.(value.includes(next) ? value.filter((v) => v !== next) : [...value, next]);
  }

  return (
    <div
      className="relative"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        setOpen(false);
        toggleRef.current?.focus();
      }}
    >
      <button
        ref={toggleRef}
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={`${baseId}-panel`}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span>
          {label}: {value.length === 0 ? 'none selected' : `${value.length} selected`}
        </span>
        <svg
          className="h-4 w-4 shrink-0 text-gray-500 dark:text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          id={`${baseId}-panel`}
          className="absolute inset-x-0 top-[calc(100%+0.25rem)] z-10 max-h-[17rem] overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:[color-scheme:dark]"
        >
          {items.map((group, index) => (
            <fieldset
              key={group.label}
              className={`border-0 p-0 ${
                index > 0 ? 'mt-2 border-t border-gray-100 pt-2 dark:border-gray-800' : ''
              }`}
            >
              <legend className="px-1 pb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {group.label}
              </legend>
              <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-[0.3125rem] text-sm font-semibold text-gray-900 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-50 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]">
                <SelectAllBox
                  groupLabel={group.label}
                  state={groupState(group)}
                  onToggle={() => toggleGroup(group)}
                />
                <span>Select all</span>
              </label>
              {group.options.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center gap-2 rounded-md py-[0.3125rem] pl-5 pr-1 text-sm text-gray-700 hover:bg-gray-100 has-[:focus-visible]:bg-gray-100 has-[:focus-visible]:shadow-[inset_2px_0_0_#2563eb] dark:text-gray-300 dark:hover:bg-gray-800 dark:has-[:focus-visible]:bg-gray-800 dark:has-[:focus-visible]:shadow-[inset_2px_0_0_#60a5fa]"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => toggleValue(option.value)}
                    className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:accent-blue-500 dark:focus-visible:outline-blue-400"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </fieldset>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const PERMISSIONS: PermissionGroup[] = [
  {
    label: 'Billing',
    options: [
      { value: 'billing:read', label: 'View invoices' },
      { value: 'billing:write', label: 'Edit payment methods' },
      { value: 'billing:refund', label: 'Issue refunds' },
    ],
  },
  {
    label: 'Members',
    options: [
      { value: 'members:read', label: 'View members' },
      { value: 'members:invite', label: 'Invite members' },
      { value: 'members:remove', label: 'Remove members' },
    ],
  },
  {
    label: 'Projects',
    options: [
      { value: 'projects:read', label: 'View projects' },
      { value: 'projects:deploy', label: 'Deploy' },
    ],
  },
];

export default function MultiselectGroupedPreview() {
  // Billing and Members are half-chosen on purpose: their select-all boxes show
  // the indeterminate dash, which is the state this component exists to model.
  const [perms, setPerms] = useState(['billing:read', 'members:read', 'members:invite']);

  return (
    <div className="w-full max-w-sm pb-72">
      <MultiselectGrouped
        label="Permissions"
        items={PERMISSIONS}
        value={perms}
        onSelect={setPerms}
        defaultOpen
      />
    </div>
  );
}
