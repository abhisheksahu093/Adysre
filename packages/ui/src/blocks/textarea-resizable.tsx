'use client';

import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * Live preview for `textarea-resizable`.
 *
 * Mirrors the `typescript` code variant. The handle is the browser's own, so
 * there is nothing to drive here - drag the bottom-right corner and the bounds
 * are what you feel: it stops at 5rem and again at 20rem, and it will not move
 * sideways.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface TextareaResizableProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
}

export function TextareaResizable({
  label,
  helperText,
  className = '',
  ...props
}: TextareaResizableProps) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="max-h-80 min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

const SEEDED = 'Fixed the focus ring on the date picker.\nBumped the minimum contrast on disabled labels.';

export default function TextareaResizablePreview() {
  return (
    <div className="w-full max-w-sm">
      <TextareaResizable
        label="Release notes"
        rows={3}
        defaultValue={SEEDED}
        placeholder="What changed in this release?"
        helperText="Drag the corner to resize - vertically, between 5rem and 20rem."
      />
    </div>
  );
}
