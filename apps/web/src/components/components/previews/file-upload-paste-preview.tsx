'use client';

/**
 * Live preview for `file-upload-paste`.
 *
 * Mirrors the `typescript` code variant verbatim. The paste target is a real
 * focusable control with a keyboard fallback to the file input - pasting is the
 * enhancement, not the only path. Object URLs are revoked on replace and unmount.
 * Keep this in step with `src/data/components/file-uploads.ts`.
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
} from 'react';

interface FileUploadPasteProps {
  label?: string;
  onFile?: (file: File) => void;
  className?: string;
}

function FileUploadPaste({
  label = 'Paste a screenshot',
  onFile,
  className = '',
}: FileUploadPasteProps) {
  const inputId = useId();
  const [preview, setPreview] = useState<{ url: string; name: string } | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    },
    [],
  );

  function accept(file: File | undefined | null) {
    if (!file || !file.type.startsWith('image/')) return;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setPreview({ url, name: file.name || 'pasted-image' });
    onFile?.(file);
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>) {
    const file = Array.from(event.clipboardData.files).find((f) => f.type.startsWith('image/'));
    if (file) {
      event.preventDefault();
      accept(file);
    }
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    accept(event.target.files?.[0]);
    event.target.value = '';
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      {/* tabIndex 0 so the paste target is reachable; Enter/Space forwards to the
          real <input>, so a keyboard user is never stuck at a paste-only box. */}
      <div
        tabIndex={0}
        role="button"
        aria-label={`${label}. Press Enter to browse for a file instead.`}
        onPaste={handlePaste}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            document.getElementById(inputId)?.click();
          }
        }}
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-8 w-8 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75M15.75 3.75v3a1.5 1.5 0 0 0 1.5 1.5h3M12 3.75h4.5L21 8.25v6.75"
          />
        </svg>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Ctrl/⌘ + V here, or{' '}
          <label
            htmlFor={inputId}
            className="cursor-pointer font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            browse
          </label>
        </p>
        <input id={inputId} type="file" accept="image/*" onChange={handleChange} className="sr-only" />
      </div>

      <div aria-live="polite">
        {preview ? (
          <figure className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {/* eslint-disable-next-line @next/next/no-img-element -- object URL, not a static asset */}
            <img src={preview.url} alt={preview.name} className="max-h-48 w-full object-contain" />
            <figcaption className="truncate px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
              {preview.name}
            </figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}

export default function FileUploadPastePreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadPaste label="Paste a screenshot" />
    </div>
  );
}

export const minHeight = 300;
