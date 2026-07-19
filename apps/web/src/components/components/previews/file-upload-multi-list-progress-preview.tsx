'use client';

/**
 * Live preview for `file-upload-multi-list-progress`.
 *
 * Mirrors the `typescript` code variant verbatim. Nothing is uploaded - a single
 * timer fakes progress; a real uploader would drive each bar from an XHR/fetch
 * progress event. Keep this in step with `src/data/components/file-uploads.ts`.
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';

interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  done: boolean;
}

interface FileUploadMultiListProps {
  label?: string;
  accept?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
}

function FileUploadMultiList({
  label = 'Add files to upload',
  accept = '',
  onFiles,
  className = '',
}: FileUploadMultiListProps) {
  const inputId = useId();
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);

  // Simulated upload: one timer advances every in-flight item. Swap this effect
  // for real per-request progress events and the rest of the component is unchanged.
  useEffect(() => {
    if (!items.some((it) => !it.done)) return;
    const timer = window.setInterval(() => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.done) return it;
          const next = Math.min(100, it.progress + 11);
          return { ...it, progress: next, done: next >= 100 };
        }),
      );
    }, 240);
    return () => window.clearInterval(timer);
  }, [items]);

  function addFiles(list: FileList | null) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${nextId.current++}`,
        name: file.name,
        size: file.size,
        progress: 0,
        done: false,
      })),
    ]);
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
    addFiles(event.dataTransfer.files);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(event.target.files);
    event.target.value = '';
  }

  return (
    <div className={`w-full max-w-xl ${className}`}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
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
          accept={accept}
          multiple
          onChange={handleChange}
          className="sr-only"
        />
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <label
          htmlFor={inputId}
          className="mt-1 inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          or browse your computer
        </label>
      </div>

      <ul aria-live="polite" className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.done ? 'Uploaded' : `Uploading… ${item.progress}%`} · {formatBytes(item.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
                aria-label={item.done ? `Remove ${item.name}` : `Cancel ${item.name}`}
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
            </div>
            {/* The bar is decorative - the percentage lives in the text above,
                which is what a screen reader announces. */}
            <div
              className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800"
              aria-hidden="true"
            >
              <div
                className={`h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none ${
                  item.done ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500'
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FileUploadMultiListProgressPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadMultiList label="Add files to upload" />
    </div>
  );
}

export const minHeight = 360;
