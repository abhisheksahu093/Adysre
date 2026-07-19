'use client';

import { useState } from 'react';

/**
 * Live preview for `toggle-switch-async`.
 * Mirrors the `typescript` variant, with an onCommit that resolves after a
 * short delay to show the pending spinner. Keep in step with
 * `src/data/components/toggles.ts`.
 */
interface ToggleSwitchAsyncProps {
  label: string;
  defaultChecked?: boolean;
  onCommit: (checked: boolean) => Promise<void>;
  className?: string;
}

function ToggleSwitchAsync({
  label,
  defaultChecked = false,
  onCommit,
  className = '',
}: ToggleSwitchAsyncProps) {
  const [checked, setChecked] = useState<boolean>(defaultChecked);
  const [pending, setPending] = useState<boolean>(false);
  const flip = async () => {
    if (pending) return;
    const next = !checked;
    setPending(true);
    try {
      await onCommit(next);
      setChecked(next);
    } finally {
      setPending(false);
    }
  };
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-busy={pending}
      disabled={pending}
      onClick={flip}
      className={`group inline-flex items-center gap-3 ${pending ? 'cursor-progress' : 'cursor-pointer'} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${pending ? 'opacity-70' : ''} ${checked ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'} group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-blue-600`}
      >
        <span className={`absolute left-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow transition-transform motion-reduce:transition-none ${checked ? 'translate-x-5' : ''}`}>
          {pending ? (
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 motion-reduce:animate-none" />
          ) : null}
        </span>
      </span>
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</span>
    </button>
  );
}

export default function ToggleSwitchAsyncPreview() {
  const onCommit = () => new Promise<void>((resolve) => setTimeout(resolve, 900));
  return <ToggleSwitchAsync label="Sync to cloud" onCommit={onCommit} />;
}
