'use client';

import { useId, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * Live preview for `textarea-with-counter`.
 *
 * Mirrors the `typescript` code variant. Seeded to sit INSIDE the warning
 * window: the counter is grey and silent for most of its life, so a preview
 * starting at 0 of 180 would show the state nobody needs to see. As rendered
 * the readout is amber, bold, and its aria-live has already flipped to polite.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface TextareaWithCounterProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value'> {
  label: string;
  value: string;
  maxLength?: number;
}

/** Characters remaining at which the counter starts warning - and speaking. */
const WARN_AT = 20;

function TextareaWithCounter({
  label,
  value,
  onChange,
  maxLength = 180,
  ...props
}: TextareaWithCounterProps) {
  const id = useId();
  const countId = `${id}-count`;
  const remaining = maxLength - value.length;
  const warn = remaining <= WARN_AT;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        aria-describedby={countId}
        className={`w-full resize-y rounded-lg border bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 ${
          warn
            ? 'border-amber-700 focus-visible:border-amber-700 focus-visible:ring-amber-700 dark:border-amber-500 dark:focus-visible:ring-amber-500'
            : 'border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400'
        }`}
        {...props}
      />
      <p
        id={countId}
        aria-live={warn ? 'polite' : 'off'}
        className={`self-end text-xs tabular-nums ${
          warn
            ? 'font-semibold text-amber-700 dark:text-amber-400'
            : 'text-gray-600 dark:text-gray-400'
        }`}
      >
        {value.length} of {maxLength} characters used
      </p>
    </div>
  );
}

/** 166 characters - fourteen remaining, so the field opens already warning. */
const SEEDED =
  'I build design systems and spend most of my time on the boring parts: focus rings, contrast ratios, and the exact grey a placeholder is allowed to be before it fails.';

export default function TextareaWithCounterPreview() {
  const [value, setValue] = useState(SEEDED);

  return (
    <div className="w-full max-w-sm">
      <TextareaWithCounter
        label="Short bio"
        value={value}
        rows={4}
        maxLength={180}
        placeholder="Tell us what you work on."
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
