'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * Live preview for `textarea-autosize`.
 *
 * Mirrors the `typescript` code variant. Seeded with enough text to have
 * ALREADY grown past its one-row start: the entry's claim is that the box fits
 * its content with no scrollbar, and a preview that opened at one empty row
 * would be indistinguishable from a plain textarea. Delete a few lines and it
 * shrinks back - the half of the behaviour that a naive implementation misses.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface TextareaAutosizeProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'rows' | 'value'> {
  label: string;
  helperText?: string;
  value: string;
}

function TextareaAutosize({
  label,
  helperText,
  value,
  onChange,
  ...props
}: TextareaAutosizeProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first so scrollHeight reports the content, not the box.
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        onChange={onChange}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-none overflow-y-hidden rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
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

const SEEDED = [
  'The box below started at a single row.',
  '',
  'It grew to fit this text before you saw it, and it will keep growing as you type - no scrollbar, no drag handle. Delete a few lines and it shrinks back down again.',
].join('\n');

export default function TextareaAutosizePreview() {
  const [value, setValue] = useState(SEEDED);

  return (
    <div className="w-full max-w-sm">
      <TextareaAutosize
        label="Message"
        value={value}
        placeholder="Write a message…"
        helperText="The box grows as you type."
        onChange={(event) => setValue(event.target.value)}
      />
    </div>
  );
}
