'use client';

/**
 * Live preview for `file-upload-button-compact`.
 *
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/file-uploads.ts`.
 */
import { useId, useState, type ChangeEvent } from 'react';

interface FileUploadButtonProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUploadButton({
  label = 'Choose file',
  accept = '',
  multiple = false,
  onFiles,
  className = '',
}: FileUploadButtonProps) {
  const inputId = useId();
  const [names, setNames] = useState<string[]>([]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    if (files.length === 0) return;
    setNames(files.map((file) => file.name));
    onFiles?.(files);
    event.target.value = '';
  }

  const summary =
    names.length === 0
      ? 'No file selected'
      : names.length === 1
        ? (names[0] ?? '')
        : `${names.length} files selected`;

  return (
    <div className={`flex w-full max-w-md flex-wrap items-center gap-3 ${className}`}>
      {/* The label IS the button. The real input keeps its own tab stop
          underneath it (sr-only, not hidden), so the peer-focus ring below is
          driven by genuine input focus, not a scripted imitation. */}
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="peer sr-only"
      />
      <label
        htmlFor={inputId}
        className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.375 12.74 11.7 19.415a4.5 4.5 0 0 1-6.364-6.364l8.485-8.486a3 3 0 0 1 4.243 4.243l-8.132 8.132a1.5 1.5 0 0 1-2.121-2.121l6.293-6.293"
          />
        </svg>
        {label}
      </label>

      {/* aria-live: the file name is the entire feedback of this component, so
          it must be announced, not just painted. */}
      <span
        aria-live="polite"
        className={`min-w-0 flex-1 truncate text-sm ${
          names.length > 0
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400'
        }`}
      >
        {summary}
      </span>

      {names.length > 0 ? (
        <button
          type="button"
          onClick={() => setNames([])}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
          aria-label="Clear selected file"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

export default function FileUploadButtonCompactPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadButton label="Choose file" />
    </div>
  );
}
