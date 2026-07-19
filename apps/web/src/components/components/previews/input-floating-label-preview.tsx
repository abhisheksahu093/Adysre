'use client';

import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * Live preview for `input-floating-label`.
 *
 * Mirrors the `typescript` code variant. Left EMPTY on purpose: the float is
 * the component, and it only reads as a float if the viewer sees the label
 * resting over the box and then travelling when they focus or type. A seeded
 * value would show the destination and hide the trip.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface InputFloatingLabelProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'placeholder'> {
  label: string;
}

function InputFloatingLabel({ label, className = '', ...props }: InputFloatingLabelProps) {
  const id = useId();

  return (
    <div className={`relative ${className}`}>
      {/* placeholder=" " is load-bearing - it makes :placeholder-shown mean
          "empty", which is what drives the float. */}
      <input
        id={id}
        placeholder=" "
        className="peer w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1.5 origin-left text-[0.6875rem] font-medium text-gray-600 transition-all motion-reduce:transition-none peer-[:placeholder-shown:not(:focus)]:translate-y-2 peer-[:placeholder-shown:not(:focus)]:text-sm peer-focus:text-blue-700 dark:text-gray-400 dark:peer-focus:text-blue-300"
      >
        {label}
      </label>
    </div>
  );
}

export default function InputFloatingLabelPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* Empty: the label rests over the box. Focus it to see it float. */}
      <InputFloatingLabel label="Full name" type="text" autoComplete="name" />
      {/* Pre-filled: the same label, already floated. */}
      <InputFloatingLabel label="Work email" type="email" defaultValue="jane@adysre.com" />
    </div>
  );
}
