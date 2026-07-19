'use client';

/**
 * Live preview for `file-upload-validation-hints`.
 *
 * Mirrors the `typescript` code variant verbatim. Validation runs client-side on
 * pick - accepted files list, rejected files carry the reason they bounced.
 * Keep this in step with `src/data/components/file-uploads.ts`.
 */
import { useId, useState, type ChangeEvent } from 'react';

interface RejectedFile {
  name: string;
  reason: string;
}

interface FileUploadValidationProps {
  accept?: string;
  maxSizeMb?: number;
  maxFiles?: number;
  onFiles?: (files: File[]) => void;
  className?: string;
}

function extAccepted(file: File, tokens: string[]): boolean {
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  return tokens.some((token) => {
    if (token.endsWith('/*')) return file.type.startsWith(token.slice(0, -1));
    if (token.startsWith('.')) return name.endsWith(token);
    return file.type === token;
  });
}

function FileUploadValidation({
  accept = 'image/*,.pdf',
  maxSizeMb = 5,
  maxFiles = 4,
  onFiles,
  className = '',
}: FileUploadValidationProps) {
  const inputId = useId();
  const hintId = useId();
  const [accepted, setAccepted] = useState<string[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);

  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const maxBytes = maxSizeMb * 1_048_576;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    const ok: File[] = [];
    const bad: RejectedFile[] = [];
    for (const file of files) {
      if (!extAccepted(file, tokens)) {
        bad.push({ name: file.name, reason: 'Type not allowed' });
      } else if (file.size > maxBytes) {
        bad.push({ name: file.name, reason: `Larger than ${maxSizeMb} MB` });
      } else if (ok.length >= maxFiles) {
        bad.push({ name: file.name, reason: `Over the ${maxFiles}-file limit` });
      } else {
        ok.push(file);
      }
    }
    setAccepted(ok.map((file) => file.name));
    setRejected(bad);
    if (ok.length > 0) onFiles?.(ok);
  }

  return (
    <div className={`w-full max-w-md ${className}`}>
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
        <input
          id={inputId}
          type="file"
          accept={accept}
          multiple
          aria-describedby={hintId}
          onChange={handleChange}
          className="sr-only"
        />
        <label
          htmlFor={inputId}
          className="inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Choose files
        </label>
        {/* The rules are stated up front, not just enforced on failure. */}
        <p id={hintId} className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {accept.replace(/,/g, ', ')} · up to {maxSizeMb} MB · max {maxFiles} files
        </p>
      </div>

      <div aria-live="polite">
        {accepted.length > 0 ? (
          <ul className="mt-3 space-y-1">
            {accepted.map((name, index) => (
              <li
                key={`ok-${name}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
                <span className="truncate">{name}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {rejected.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {rejected.map((file, index) => (
              <li
                key={`bad-${file.name}-${index}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
              >
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs font-medium">{file.reason}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

export default function FileUploadValidationHintsPreview() {
  return (
    <div className="flex w-full justify-center px-4 py-6">
      <FileUploadValidation accept="image/*,.pdf" maxSizeMb={5} maxFiles={4} />
    </div>
  );
}

export const minHeight = 320;
