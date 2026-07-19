'use client';

/**
 * Live preview for `file-upload-drag-overlay`.
 *
 * Mirrors the `typescript` code variant verbatim. The overlay is an enhancement
 * over the always-present browse button - drag is never the only way in. Keep
 * this in step with `src/data/components/file-uploads.ts`.
 */
import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

interface FileUploadDragOverlayProps {
  title?: string;
  hint?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}

function FileUploadDragOverlay({
  title = 'Project attachments',
  hint = 'Drag files anywhere onto this card, or use the button.',
  onFiles,
  className = '',
}: FileUploadDragOverlayProps) {
  const inputId = useId();
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [names, setNames] = useState<string[]>([]);

  function addFiles(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setNames((prev) => [...prev, ...files.map((file) => file.name)]);
    onFiles?.(files);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);
    event.target.value = '';
  }

  return (
    <div
      onDragEnter={(event) => {
        event.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => {
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
          dragDepth.current = 0;
          setDragging(false);
        }
      }}
      onDrop={(event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        addFiles(event.dataTransfer.files);
      }}
      className={`relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{hint}</p>

      <div className="mt-4">
        <input id={inputId} type="file" multiple onChange={handleChange} className="peer sr-only" />
        <label
          htmlFor={inputId}
          className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-900"
        >
          Browse files
        </label>
      </div>

      {names.length > 0 ? (
        <ul aria-live="polite" className="mt-4 space-y-1">
          {names.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="truncate text-sm text-gray-700 dark:text-gray-300"
            >
              {name}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Overlay is aria-hidden and pointer-events-none: it is a visual cue for
          the drag, never a control and never a focus trap. */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-600 bg-blue-50/90 text-sm font-semibold text-blue-700 transition-opacity motion-reduce:transition-none dark:border-blue-400 dark:bg-blue-950/80 dark:text-blue-200 ${
          dragging ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Drop to upload
      </div>
    </div>
  );
}

export default function FileUploadDragOverlayPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadDragOverlay />
    </div>
  );
}

export const minHeight = 280;
