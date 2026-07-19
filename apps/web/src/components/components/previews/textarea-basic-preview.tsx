'use client';

import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * Live preview for `textarea-basic`.
 *
 * Mirrors the `typescript` code variant. `font-sans` on the field is not
 * cosmetic - a textarea does not inherit the page font, and dropping it is how
 * a preview ends up rendering in the browser's monospace default.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface TextareaBasicProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
}

function TextareaBasic({
  label,
  helperText,
  rows = 4,
  className = '',
  ...props
}: TextareaBasicProps) {
  const id = useId();
  const helpId = `${id}-help`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
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

export default function TextareaBasicPreview() {
  return (
    <div className="w-full max-w-sm">
      <TextareaBasic
        label="Short bio"
        rows={4}
        placeholder="Tell us what you work on."
        helperText="Shown on your public profile."
      />
    </div>
  );
}
