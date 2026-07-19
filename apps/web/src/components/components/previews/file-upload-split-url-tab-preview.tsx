'use client';

/**
 * Live preview for `file-upload-split-url-tab`.
 *
 * Mirrors the `typescript` code variant verbatim. Two real tabs - a file input
 * and a URL field - sharing one "added" list; nothing is fetched. Keep this in
 * step with `src/data/components/file-uploads.ts`.
 */
import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

type Tab = 'file' | 'url';

interface AddedSource {
  id: string;
  label: string;
  kind: Tab;
}

interface FileUploadSplitUrlProps {
  onFile?: (file: File) => void;
  onUrl?: (url: string) => void;
  className?: string;
}

function FileUploadSplitUrl({ onFile, onUrl, className = '' }: FileUploadSplitUrlProps) {
  const fileInputId = useId();
  const urlInputId = useId();
  const [tab, setTab] = useState<Tab>('file');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState<AddedSource[]>([]);
  const nextId = useState(() => ({ n: 0 }))[0];

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setAdded((prev) => [...prev, { id: `${nextId.n++}`, label: file.name, kind: 'file' }]);
    onFile?.(file);
  }

  function handleUrlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = url.trim();
    if (!/^https?:\/\/\S+$/i.test(value)) {
      setError('Enter a valid http(s) URL.');
      return;
    }
    setError('');
    setAdded((prev) => [...prev, { id: `${nextId.n++}`, label: value, kind: 'url' }]);
    onUrl?.(value);
    setUrl('');
  }

  const tabClass = (active: boolean) =>
    `min-h-10 flex-1 border-b-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 ${
      active
        ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
    }`;

  return (
    <div
      className={`w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <div role="tablist" aria-label="Add a file" className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          role="tab"
          id="fu-tab-file"
          aria-selected={tab === 'file'}
          aria-controls="fu-panel-file"
          onClick={() => setTab('file')}
          className={tabClass(tab === 'file')}
        >
          Upload file
        </button>
        <button
          type="button"
          role="tab"
          id="fu-tab-url"
          aria-selected={tab === 'url'}
          aria-controls="fu-panel-url"
          onClick={() => setTab('url')}
          className={tabClass(tab === 'url')}
        >
          From URL
        </button>
      </div>

      <div className="p-4">
        {tab === 'file' ? (
          <div role="tabpanel" id="fu-panel-file" aria-labelledby="fu-tab-file">
            <input id={fileInputId} type="file" onChange={handleFile} className="peer sr-only" />
            <label
              htmlFor={fileInputId}
              className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-900"
            >
              Choose a file from your device
            </label>
          </div>
        ) : (
          <form
            role="tabpanel"
            id="fu-panel-url"
            aria-labelledby="fu-tab-url"
            onSubmit={handleUrlSubmit}
            className="flex flex-col gap-2 sm:flex-row"
          >
            <label htmlFor={urlInputId} className="sr-only">
              File URL
            </label>
            <input
              id={urlInputId}
              type="url"
              inputMode="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/file.pdf"
              aria-invalid={error !== ''}
              aria-describedby={error ? 'fu-url-error' : undefined}
              className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400"
            />
            <button
              type="submit"
              className="inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              Add
            </button>
          </form>
        )}
        {error ? (
          <p id="fu-url-error" className="mt-2 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        ) : null}

        {added.length > 0 ? (
          <ul aria-live="polite" className="mt-3 space-y-1">
            {added.map((source) => (
              <li
                key={source.id}
                className="flex items-center gap-2 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              >
                <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {source.kind}
                </span>
                <span className="truncate">{source.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default function FileUploadSplitUrlTabPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadSplitUrl />
    </div>
  );
}

export const minHeight = 300;
