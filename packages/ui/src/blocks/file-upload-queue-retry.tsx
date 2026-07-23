'use client';

/**
 * Live preview for `file-upload-queue-retry`.
 *
 * Mirrors the `typescript` code variant verbatim. Uploads are simulated with a
 * countdown; failures are deterministic (even-id files fail once) so the retry
 * path is always reachable. Keep this in step with
 * `src/data/components/file-uploads.ts`.
 */
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
} from 'react';

type QueueStatus = 'uploading' | 'done' | 'error';

interface QueueItem {
  id: string;
  name: string;
  status: QueueStatus;
  ticks: number;
  attempts: number;
}

interface FileUploadQueueProps {
  label?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUploadQueue({
  label = 'Upload queue',
  onFiles,
  className = '',
}: FileUploadQueueProps) {
  const inputId = useId();
  const nextId = useRef(0);
  const [items, setItems] = useState<QueueItem[]>([]);

  // Simulated transfer: each in-flight item counts down; at zero it resolves.
  // A first attempt on an even id "fails" so retry has something to do.
  useEffect(() => {
    if (!items.some((it) => it.status === 'uploading')) return;
    const timer = window.setInterval(() => {
      setItems((prev) =>
        prev.map((it) => {
          if (it.status !== 'uploading') return it;
          const ticks = it.ticks - 1;
          if (ticks > 0) return { ...it, ticks };
          const willFail = it.attempts === 0 && Number(it.id) % 2 === 0;
          return { ...it, ticks: 0, status: willFail ? 'error' : 'done' };
        }),
      );
    }, 320);
    return () => window.clearInterval(timer);
  }, [items]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${nextId.current++}`,
        name: file.name,
        status: 'uploading' as const,
        ticks: 3,
        attempts: 0,
      })),
    ]);
    onFiles?.(files);
  }

  function retry(id: string) {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, status: 'uploading', ticks: 3, attempts: it.attempts + 1 } : it,
      ),
    );
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        <input id={inputId} type="file" multiple onChange={handleChange} className="peer sr-only" />
        <label
          htmlFor={inputId}
          className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950"
        >
          Add files
        </label>
      </div>

      <ul aria-live="polite" className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <span
              className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                item.status === 'done'
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : item.status === 'error'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
              }`}
              aria-hidden="true"
            >
              {item.status === 'done' ? '✓' : item.status === 'error' ? '!' : '…'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
              <p
                className={`text-xs ${
                  item.status === 'error'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.status === 'done'
                  ? 'Uploaded'
                  : item.status === 'error'
                    ? 'Upload failed'
                    : 'Uploading…'}
              </p>
            </div>
            {item.status === 'error' ? (
              <button
                type="button"
                onClick={() => retry(item.id)}
                className="inline-flex min-h-8 shrink-0 items-center rounded-lg px-2.5 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-blue-400 dark:hover:bg-blue-950/40 dark:focus-visible:ring-blue-400"
              >
                Retry
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function FileUploadQueueRetryPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadQueue label="Upload queue" />
    </div>
  );
}

export const minHeight = 320;
