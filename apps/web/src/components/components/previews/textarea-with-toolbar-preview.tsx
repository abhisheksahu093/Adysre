'use client';

import { useId, useRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * Live preview for `textarea-with-toolbar`.
 *
 * Mirrors the `typescript` code variant. Seeded with a sentence and a hint,
 * because the toolbar acts on a SELECTION - an empty field would let a viewer
 * press Bold and watch it insert `****` around nothing, which is the least
 * interesting thing this component does.
 * Keep this in step with `src/data/components/forms-text.ts`.
 */
interface TextareaWithToolbarProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value' | 'onChange'> {
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
}

interface Tool {
  id: string;
  label: string;
  before: string;
  after: string;
  path: string;
}

const BTN =
  'inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400';

const TOOLS: Tool[] = [
  {
    id: 'bold',
    label: 'Bold',
    before: '**',
    after: '**',
    path: 'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z',
  },
  { id: 'italic', label: 'Italic', before: '_', after: '_', path: 'M19 4h-9M14 20H5M15 4 9 20' },
  {
    id: 'link',
    label: 'Insert link',
    before: '[',
    after: '](https://)',
    path: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  },
];

function TextareaWithToolbar({
  label,
  helperText,
  value,
  onChange,
  ...props
}: TextareaWithToolbarProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const ref = useRef<HTMLTextAreaElement>(null);

  function surround(before: string, after: string): void {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);

    onChange(value.slice(0, start) + before + selected + after + value.slice(end));

    // Restore focus and selection after React has written the new value.
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        <div
          role="toolbar"
          aria-label="Formatting"
          aria-controls={id}
          className="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
        >
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              aria-label={tool.label}
              onClick={() => surround(tool.before, tool.after)}
              className={BTN}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d={tool.path} />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={helperText ? helpId : undefined}
          className="block w-full resize-y border-0 bg-transparent px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
      </div>
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

const SEEDED = 'Select any word in this sentence, then press Bold.';

export default function TextareaWithToolbarPreview() {
  const [value, setValue] = useState(SEEDED);

  return (
    <div className="w-full max-w-sm">
      <TextareaWithToolbar
        label="Description"
        value={value}
        rows={5}
        placeholder="Markdown is supported."
        helperText="Select text, then choose a format."
        onChange={setValue}
      />
    </div>
  );
}
