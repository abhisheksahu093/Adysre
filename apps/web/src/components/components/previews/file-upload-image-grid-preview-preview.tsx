'use client';

/**
 * Live preview for `file-upload-image-grid-preview`.
 *
 * Mirrors the `typescript` code variant verbatim. Object URLs are a resource,
 * not a string: each preview pins its file's bytes until revoked, so remove and
 * unmount both call revokeObjectURL. Keep this in step with
 * `src/data/components/file-uploads.ts`.
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';

interface ImageItem {
  id: string;
  name: string;
  url: string;
}

interface FileUploadImageGridProps {
  label?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}

function FileUploadImageGrid({
  label = 'Add images',
  onFiles,
  className = '',
}: FileUploadImageGridProps) {
  const inputId = useId();
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<ImageItem[]>([]);

  // Mirror state into a ref so the unmount cleanup can revoke every URL still
  // alive without re-subscribing on each change.
  const itemsRef = useRef<ImageItem[]>([]);
  itemsRef.current = items;
  useEffect(
    () => () => {
      itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url));
    },
    [],
  );

  function addFiles(list: FileList | null) {
    const files = (list ? Array.from(list) : []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${nextId.current++}`,
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ]);
    onFiles?.(files);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      // Revoke on remove - the thumbnail is gone, so its bytes should be too.
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((it) => it.id !== id);
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);
    event.target.value = '';
  }

  return (
    <div className={`w-full max-w-xl ${className}`}>
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
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 ${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }`}
      >
        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="sr-only"
        />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <label
          htmlFor={inputId}
          className="mt-1 inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          or browse - images only
        </label>
      </div>

      {items.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <li key={item.id} className="group relative">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
                {/* eslint-disable-next-line @next/next/no-img-element -- object URL, not a static asset */}
                <img
                  src={item.url}
                  alt={item.name}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                aria-label={`Remove ${item.name}`}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default function FileUploadImageGridPreviewPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadImageGrid label="Add images" />
    </div>
  );
}

export const minHeight = 320;
