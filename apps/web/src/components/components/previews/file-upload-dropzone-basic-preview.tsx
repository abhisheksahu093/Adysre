'use client';

/**
 * Live preview for `file-upload-dropzone-basic`.
 *
 * Mirrors the `typescript` code variant verbatim. Nothing is uploaded - the
 * component only reports what was picked. Keep this in step with
 * `src/data/components/file-uploads.ts`.
 */
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

interface FileUploadDropzoneProps {
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  onFiles?: (files: File[]) => void;
  className?: string;
}

function FileUploadDropzone({
  label = 'Drag and drop files here',
  hint = 'Any file type, any size - this demo only lists what you pick.',
  accept = '',
  multiple = true,
  onFiles,
  className = '',
}: FileUploadDropzoneProps) {
  const inputId = useId();
  const hintId = useId();
  // Drag enter/leave fire for every child the cursor crosses; a depth counter
  // is what stops the highlight flickering on the way through.
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [names, setNames] = useState<string[]>([]);

  function handleFiles(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setNames(files.map((file) => file.name));
    onFiles?.(files);
  }

  function handleDragEnter(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    setDragging(true);
  }

  function handleDragLeave() {
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    handleFiles(event.target.files);
    // Reset so picking the same file again still fires a change event.
    event.target.value = '';
  }

  return (
    <div className={`w-full max-w-xl ${className}`}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 ${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }`}
      >
        {/* The input is sr-only, not display:none - it keeps its tab stop, and
            the zone's focus-within ring shows where focus is. */}
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          aria-describedby={hintId}
          onChange={handleChange}
          className="sr-only"
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
          />
        </svg>
        <p className="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <label
          htmlFor={inputId}
          className="mt-1 inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          or browse your computer
        </label>
        <p id={hintId} className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      </div>

      {/* aria-live so a keyboard or screen-reader user hears the result of the
          pick without hunting for it. */}
      <div aria-live="polite">
        {names.length > 0 ? (
          <ul className="mt-3 space-y-1 text-left">
            {names.map((name) => (
              <li
                key={name}
                className="truncate rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {name}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default function FileUploadDropzoneBasicPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadDropzone
        label="Drag and drop files here"
        hint="Any file type, any size - this demo only lists what you pick."
      />
    </div>
  );
}

export const minHeight = 340;
