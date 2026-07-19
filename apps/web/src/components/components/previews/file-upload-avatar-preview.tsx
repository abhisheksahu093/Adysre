'use client';

/**
 * Live preview for `file-upload-avatar`.
 *
 * Mirrors the `typescript` code variant verbatim. The "upload" is a timeout; the
 * object URL is revoked on replace and on unmount so a chain of re-picks never
 * leaks. Keep this in step with `src/data/components/file-uploads.ts`.
 */
import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';

interface FileUploadAvatarProps {
  label?: string;
  onFile?: (file: File) => void;
  className?: string;
}

function FileUploadAvatar({
  label = 'Profile photo',
  onFile,
  className = '',
}: FileUploadAvatarProps) {
  const inputId = useId();
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const urlRef = useRef<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  function setPreview(next: string | null) {
    // Revoke the previous URL before swapping - replacing an avatar should not
    // strand the bytes of the one it replaces.
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = next;
    setUrl(next);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !file.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(file));
    onFile?.(file);
    // Simulated upload: a real one would PUT the file and clear on the response.
    setUploading(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setUploading(false), 1200);
  }

  function remove() {
    setPreview(null);
    setUploading(false);
  }

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="relative h-20 w-20 shrink-0">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element -- object URL, not a static asset
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-full w-full p-4 text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0"
              />
            </svg>
          )}
        </div>
        {uploading ? (
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-[0.65rem] font-semibold text-white">
            Uploading…
          </span>
        ) : null}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            id={inputId}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="peer sr-only"
          />
          <label
            htmlFor={inputId}
            className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950"
          >
            {url ? 'Change' : 'Upload'}
          </label>
          {url ? (
            <button
              type="button"
              onClick={remove}
              className="inline-flex min-h-9 items-center rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
            >
              Remove
            </button>
          ) : null}
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, PNG or GIF.</p>
      </div>
    </div>
  );
}

export default function FileUploadAvatarPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-8">
      <FileUploadAvatar label="Profile photo" />
    </div>
  );
}

export const minHeight = 240;
