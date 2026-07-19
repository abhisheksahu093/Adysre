import type { ComponentEntry } from './types';

/**
 * File uploads category.
 *
 * Ten upload patterns with one shared spine: a real `<input type="file">` that
 * stays reachable by keyboard and screen reader. Everything else - the dashed
 * zone, the drag highlight, the paste handler, the full-card overlay - is an
 * enhancement layered on top of that input, never a replacement for it. A
 * dropzone whose only entry point is a drop event is a component that simply
 * does not exist for anyone without a pointer.
 *
 * The second shared constraint: every "upload" here is a simulation. Progress
 * is a timer, failure is deterministic, and nothing touches the network - the
 * components own the selection, preview and queue UX and hand you `File`
 * objects at the callback boundary, because that is exactly where a real
 * uploader (fetch, tus, S3 presigned POST) plugs in.
 *
 * Third: object URLs are a resource, not a string. Every `createObjectURL`
 * pins its file's bytes until `revokeObjectURL` - so the image components
 * revoke on remove, on replace and on unmount, and the comments say so at the
 * exact lines it would be tempting to delete.
 */
export const fileUploadsComponents: ComponentEntry[] = [
  {
    slug: 'file-upload-dropzone-basic',
    category: 'file-uploads',
    tags: ['upload', 'dropzone', 'drag-and-drop', 'file-input', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 940, copies: 262, downloads: 71 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Drag and drop files here'", descriptionKey: 'label' },
      { name: 'hint', type: 'string', descriptionKey: 'hint' },
      { name: 'accept', type: 'string', default: "''", descriptionKey: 'accept' },
      { name: 'multiple', type: 'boolean', default: 'true', descriptionKey: 'multiple' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Static resting state. The drag-over highlight and the picked-file list live
  in the React/TypeScript tabs - markup alone cannot read a FileList. What the
  markup CAN get right is the accessibility spine: the input is sr-only, not
  display:none, so it keeps its tab stop, and the zone's focus-within ring
  shows exactly where that focus is.
-->
<div class="w-full max-w-xl">
  <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
    <input id="dropzone-input" type="file" multiple aria-describedby="dropzone-hint" class="sr-only" />
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
    <p class="mt-3 text-sm font-medium text-gray-900 dark:text-gray-100">Drag and drop files here</p>
    <label for="dropzone-input" class="mt-1 inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
      or browse your computer
    </label>
    <p id="dropzone-hint" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      Any file type, any size.
    </p>
  </div>
</div>`,
      react: `import { useId, useRef, useState } from 'react';

export function FileUploadDropzone({
  label = 'Drag and drop files here',
  hint = 'Any file type, any size.',
  accept = '',
  multiple = true,
  onFiles,
  className = '',
}) {
  const inputId = useId();
  const hintId = useId();
  // Drag enter/leave fire for every child the cursor crosses; a depth counter
  // is what stops the highlight flickering on the way through.
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [names, setNames] = useState([]);

  function handleFiles(list) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setNames(files.map((file) => file.name));
    onFiles?.(files);
  }

  function handleDragEnter(event) {
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

  function handleDrop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    handleFiles(event.dataTransfer.files);
  }

  function handleChange(event) {
    handleFiles(event.target.files);
    // Reset so picking the same file again still fires a change event.
    event.target.value = '';
  }

  return (
    <div className={\`w-full max-w-xl \${className}\`}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={\`rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 \${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }\`}
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
}`,
      typescript: `import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

export interface FileUploadDropzoneProps {
  label?: string;
  hint?: string;
  /** Passed straight to the input, e.g. 'image/*' or '.pdf,.docx'. */
  accept?: string;
  multiple?: boolean;
  /** Fires with the picked or dropped files. No upload happens here. */
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUploadDropzone({
  label = 'Drag and drop files here',
  hint = 'Any file type, any size.',
  accept = '',
  multiple = true,
  onFiles,
  className = '',
}: FileUploadDropzoneProps): JSX.Element {
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
    <div className={\`w-full max-w-xl \${className}\`}>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={\`rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 \${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }\`}
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
}`,
    },
  },
  {
    slug: 'file-upload-button-compact',
    category: 'file-uploads',
    tags: ['upload', 'button', 'file-input', 'compact', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 610, copies: 188, downloads: 44 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Choose file'", descriptionKey: 'label' },
      { name: 'accept', type: 'string', default: "''", descriptionKey: 'accept' },
      { name: 'multiple', type: 'boolean', default: 'false', descriptionKey: 'multiple' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The label IS the button - no scripted click-forwarding to a hidden input.
  The input sits underneath as a peer (sr-only, so it keeps its tab stop), and
  peer-focus-visible paints the ring on the label when the real input has
  focus. The selected name is rendered by the React tabs.
-->
<div class="flex w-full max-w-md flex-wrap items-center gap-3">
  <input id="file-button-input" type="file" class="peer sr-only" />
  <label
    for="file-button-input"
    class="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950"
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-4 w-4" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.74 11.7 19.415a4.5 4.5 0 0 1-6.364-6.364l8.485-8.486a3 3 0 0 1 4.243 4.243l-8.132 8.132a1.5 1.5 0 0 1-2.121-2.121l6.293-6.293" />
    </svg>
    Choose file
  </label>
  <span aria-live="polite" class="min-w-0 flex-1 truncate text-sm text-gray-500 dark:text-gray-400">
    No file selected
  </span>
</div>`,
      react: `import { useId, useState } from 'react';

export function FileUploadButton({
  label = 'Choose file',
  accept = '',
  multiple = false,
  onFiles,
  className = '',
}) {
  const inputId = useId();
  const [names, setNames] = useState([]);

  function handleChange(event) {
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
        : \`\${names.length} files selected\`;

  return (
    <div className={\`flex w-full max-w-md flex-wrap items-center gap-3 \${className}\`}>
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
        className={\`min-w-0 flex-1 truncate text-sm \${
          names.length > 0
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400'
        }\`}
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
}`,
      typescript: `import { useId, useState, type ChangeEvent } from 'react';

export interface FileUploadButtonProps {
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
}: FileUploadButtonProps): JSX.Element {
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
        : \`\${names.length} files selected\`;

  return (
    <div className={\`flex w-full max-w-md flex-wrap items-center gap-3 \${className}\`}>
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
        className={\`min-w-0 flex-1 truncate text-sm \${
          names.length > 0
            ? 'text-gray-900 dark:text-gray-100'
            : 'text-gray-500 dark:text-gray-400'
        }\`}
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
}`,
    },
  },
  {
    slug: 'file-upload-multi-list-progress',
    category: 'file-uploads',
    tags: ['upload', 'progress', 'multiple', 'list', 'file-input'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 720, copies: 205, downloads: 58 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Add files to upload'", descriptionKey: 'label' },
      { name: 'accept', type: 'string', default: "''", descriptionKey: 'accept' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state. The per-file progress bars and cancel buttons appear once files
  are picked, which needs a FileList the markup cannot read - see the React/TS
  tabs. The spine the markup owns: an sr-only input that keeps its tab stop and a
  label that browses.
-->
<div class="w-full max-w-xl">
  <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
    <input id="multi-input" type="file" multiple class="sr-only" />
    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Add files to upload</p>
    <label for="multi-input" class="mt-1 inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
      or browse your computer
    </label>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

function formatBytes(bytes) {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1_048_576) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  return \`\${(bytes / 1_048_576).toFixed(1)} MB\`;
}

export function FileUploadMultiList({
  label = 'Add files to upload',
  accept = '',
  onFiles,
  className = '',
}) {
  const inputId = useId();
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState([]);

  // Simulated upload: one timer advances every in-flight item. Swap this effect
  // for real per-request progress events and the rest of the component is the same.
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

  function addFiles(list) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: \`\${nextId.current++}\`,
        name: file.name,
        size: file.size,
        progress: 0,
        done: false,
      })),
    ]);
    onFiles?.(files);
  }

  function handleDrop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleChange(event) {
    addFiles(event.target.files);
    event.target.value = '';
  }

  return (
    <div className={\`w-full max-w-xl \${className}\`}>
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
        className={\`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 \${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }\`}
      >
        <input id={inputId} type="file" accept={accept} multiple onChange={handleChange} className="sr-only" />
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
          <li key={item.id} className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.done ? 'Uploaded' : \`Uploading… \${item.progress}%\`} · {formatBytes(item.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
                aria-label={item.done ? \`Remove \${item.name}\` : \`Cancel \${item.name}\`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* The bar is decorative - the percentage lives in the text above,
                which is what a screen reader announces. */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
              <div
                className={\`h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none \${
                  item.done ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500'
                }\`}
                style={{ width: \`\${item.progress}%\` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
      typescript: `import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from 'react';

export interface UploadItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  done: boolean;
}

export interface FileUploadMultiListProps {
  label?: string;
  accept?: string;
  /** Fires with the newly added files. No upload happens here. */
  onFiles?: (files: File[]) => void;
  className?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1_048_576) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  return \`\${(bytes / 1_048_576).toFixed(1)} MB\`;
}

export function FileUploadMultiList({
  label = 'Add files to upload',
  accept = '',
  onFiles,
  className = '',
}: FileUploadMultiListProps): JSX.Element {
  const inputId = useId();
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);

  // Simulated upload: one timer advances every in-flight item. Swap this effect
  // for real per-request progress events and the rest of the component is the same.
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
        id: \`\${nextId.current++}\`,
        name: file.name,
        size: file.size,
        progress: 0,
        done: false,
      })),
    ]);
    onFiles?.(files);
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
    <div className={\`w-full max-w-xl \${className}\`}>
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
        className={\`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 \${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }\`}
      >
        <input id={inputId} type="file" accept={accept} multiple onChange={handleChange} className="sr-only" />
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
          <li key={item.id} className="rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {item.done ? 'Uploaded' : \`Uploading… \${item.progress}%\`} · {formatBytes(item.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200 dark:focus-visible:ring-blue-400"
                aria-label={item.done ? \`Remove \${item.name}\` : \`Cancel \${item.name}\`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* The bar is decorative - the percentage lives in the text above,
                which is what a screen reader announces. */}
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800" aria-hidden="true">
              <div
                className={\`h-full rounded-full transition-[width] duration-200 motion-reduce:transition-none \${
                  item.done ? 'bg-green-600 dark:bg-green-500' : 'bg-blue-600 dark:bg-blue-500'
                }\`}
                style={{ width: \`\${item.progress}%\` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    },
  },
  {
    slug: 'file-upload-image-grid-preview',
    category: 'file-uploads',
    tags: ['upload', 'image', 'grid', 'preview', 'thumbnail'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 830, copies: 241, downloads: 66 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Add images'", descriptionKey: 'label' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state. Thumbnails are object URLs built from picked files at runtime,
  so the grid lives in the React/TS tabs - and so does the revokeObjectURL that
  keeps those URLs from leaking. The markup owns the sr-only input and label.
-->
<div class="w-full max-w-xl">
  <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
    <input id="grid-input" type="file" accept="image/*" multiple class="sr-only" />
    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Add images</p>
    <label for="grid-input" class="mt-1 inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
      or browse - images only
    </label>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function FileUploadImageGrid({ label = 'Add images', onFiles, className = '' }) {
  const inputId = useId();
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState([]);

  // Mirror state into a ref so the unmount cleanup can revoke every URL still
  // alive without re-subscribing on each change.
  const itemsRef = useRef([]);
  itemsRef.current = items;
  useEffect(() => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url)), []);

  function addFiles(list) {
    const files = (list ? Array.from(list) : []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: \`\${nextId.current++}\`, name: file.name, url: URL.createObjectURL(file) })),
    ]);
    onFiles?.(files);
  }

  function removeItem(id) {
    setItems((prev) => {
      const target = prev.find((it) => it.id === id);
      // Revoke on remove - the thumbnail is gone, so its bytes should be too.
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((it) => it.id !== id);
    });
  }

  function handleDrop(event) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function handleChange(event) {
    addFiles(event.target.files);
    event.target.value = '';
  }

  return (
    <div className={\`w-full max-w-xl \${className}\`}>
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
        className={\`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 \${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }\`}
      >
        <input id={inputId} type="file" accept="image/*" multiple onChange={handleChange} className="sr-only" />
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
                <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                aria-label={\`Remove \${item.name}\`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

export interface ImageItem {
  id: string;
  name: string;
  url: string;
}

export interface FileUploadImageGridProps {
  label?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUploadImageGrid({
  label = 'Add images',
  onFiles,
  className = '',
}: FileUploadImageGridProps): JSX.Element {
  const inputId = useId();
  const dragDepth = useRef(0);
  const nextId = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [items, setItems] = useState<ImageItem[]>([]);

  // Mirror state into a ref so the unmount cleanup can revoke every URL still
  // alive without re-subscribing on each change.
  const itemsRef = useRef<ImageItem[]>([]);
  itemsRef.current = items;
  useEffect(() => () => itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url)), []);

  function addFiles(list: FileList | null) {
    const files = (list ? Array.from(list) : []).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: \`\${nextId.current++}\`, name: file.name, url: URL.createObjectURL(file) })),
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
    <div className={\`w-full max-w-xl \${className}\`}>
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
        className={\`rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white motion-reduce:transition-none dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950 \${
          dragging
            ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
            : 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900'
        }\`}
      >
        <input id={inputId} type="file" accept="image/*" multiple onChange={handleChange} className="sr-only" />
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
                <img src={item.url} alt={item.name} className="aspect-square w-full object-cover" />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-900/70 text-white transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
                aria-label={\`Remove \${item.name}\`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'file-upload-avatar',
    category: 'file-uploads',
    tags: ['upload', 'avatar', 'image', 'profile', 'preview'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 690, copies: 210, downloads: 51 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'empty', labelKey: 'empty' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Profile photo'", descriptionKey: 'label' },
      { name: 'onFile', type: '(file: File) => void', descriptionKey: 'onFile' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting (no photo) state. The chosen image is an object URL created at runtime,
  so the preview swap and its revokeObjectURL live in the React/TS tabs. The
  label is the trigger for a peer sr-only input, so it keeps a real tab stop.
-->
<div class="flex items-center gap-4">
  <div class="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-full w-full p-4 text-gray-400 dark:text-gray-500" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0" />
    </svg>
  </div>
  <div>
    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Profile photo</p>
    <input id="avatar-input" type="file" accept="image/*" class="peer sr-only" />
    <label for="avatar-input" class="mt-2 inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950">
      Upload
    </label>
    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">JPG, PNG or GIF.</p>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function FileUploadAvatar({ label = 'Profile photo', onFile, className = '' }) {
  const inputId = useId();
  const [url, setUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const urlRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  function setPreview(next) {
    // Revoke the previous URL before swapping - replacing an avatar should not
    // strand the bytes of the one it replaces.
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = next;
    setUrl(next);
  }

  function handleChange(event) {
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
    <div className={\`flex items-center gap-4 \${className}\`}>
      <div className="relative h-20 w-20 shrink-0">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-full w-full p-4 text-gray-400 dark:text-gray-500" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0" />
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
          <input id={inputId} type="file" accept="image/*" onChange={handleChange} className="peer sr-only" />
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
}`,
      typescript: `import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';

export interface FileUploadAvatarProps {
  label?: string;
  /** Fires with the chosen image. No upload happens here. */
  onFile?: (file: File) => void;
  className?: string;
}

export function FileUploadAvatar({
  label = 'Profile photo',
  onFile,
  className = '',
}: FileUploadAvatarProps): JSX.Element {
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
    <div className={\`flex items-center gap-4 \${className}\`}>
      <div className="relative h-20 w-20 shrink-0">
        <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          {url ? (
            <img src={url} alt="" className="h-full w-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-full w-full p-4 text-gray-400 dark:text-gray-500" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 19.5a7.5 7.5 0 0 1 15 0" />
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
          <input id={inputId} type="file" accept="image/*" onChange={handleChange} className="peer sr-only" />
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
}`,
    },
  },
  {
    slug: 'file-upload-drag-overlay',
    category: 'file-uploads',
    tags: ['upload', 'drag-and-drop', 'overlay', 'card', 'dropzone'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 540, copies: 160, downloads: 39 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'dragging', labelKey: 'dragging' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Project attachments'", descriptionKey: 'title' },
      { name: 'hint', type: 'string', descriptionKey: 'hint' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state - the drop overlay is toggled by drag events the markup cannot
  observe, so it lives in the React/TS tabs (there it is aria-hidden and
  pointer-events-none: a visual cue, never a control). The always-present browse
  button below is why the card works with no pointer at all.
-->
<div class="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
  <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">Project attachments</h3>
  <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Drag files anywhere onto this card, or use the button.</p>
  <div class="mt-4">
    <input id="overlay-input" type="file" multiple class="peer sr-only" />
    <label for="overlay-input" class="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-900">
      Browse files
    </label>
  </div>
</div>`,
      react: `import { useId, useRef, useState } from 'react';

export function FileUploadDragOverlay({
  title = 'Project attachments',
  hint = 'Drag files anywhere onto this card, or use the button.',
  onFiles,
  className = '',
}) {
  const inputId = useId();
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [names, setNames] = useState([]);

  function addFiles(list) {
    const files = list ? Array.from(list) : [];
    if (files.length === 0) return;
    setNames((prev) => [...prev, ...files.map((file) => file.name)]);
    onFiles?.(files);
  }

  function handleChange(event) {
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
      onDrop={(event) => {
        event.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        addFiles(event.dataTransfer.files);
      }}
      className={\`relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
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
            <li key={\`\${name}-\${index}\`} className="truncate text-sm text-gray-700 dark:text-gray-300">
              {name}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Overlay is aria-hidden and pointer-events-none: it is a visual cue for
          the drag, never a control and never a focus trap. */}
      <div
        aria-hidden="true"
        className={\`pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-600 bg-blue-50/90 text-sm font-semibold text-blue-700 transition-opacity motion-reduce:transition-none dark:border-blue-400 dark:bg-blue-950/80 dark:text-blue-200 \${
          dragging ? 'opacity-100' : 'opacity-0'
        }\`}
      >
        Drop to upload
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';

export interface FileUploadDragOverlayProps {
  title?: string;
  hint?: string;
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUploadDragOverlay({
  title = 'Project attachments',
  hint = 'Drag files anywhere onto this card, or use the button.',
  onFiles,
  className = '',
}: FileUploadDragOverlayProps): JSX.Element {
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
      className={\`relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 \${className}\`}
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
            <li key={\`\${name}-\${index}\`} className="truncate text-sm text-gray-700 dark:text-gray-300">
              {name}
            </li>
          ))}
        </ul>
      ) : null}

      {/* Overlay is aria-hidden and pointer-events-none: it is a visual cue for
          the drag, never a control and never a focus trap. */}
      <div
        aria-hidden="true"
        className={\`pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-600 bg-blue-50/90 text-sm font-semibold text-blue-700 transition-opacity motion-reduce:transition-none dark:border-blue-400 dark:bg-blue-950/80 dark:text-blue-200 \${
          dragging ? 'opacity-100' : 'opacity-0'
        }\`}
      >
        Drop to upload
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'file-upload-validation-hints',
    category: 'file-uploads',
    tags: ['upload', 'validation', 'file-input', 'accept', 'form'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 580, copies: 176, downloads: 47 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'error', labelKey: 'error' },
    ],
    props: [
      { name: 'accept', type: 'string', default: "'image/*,.pdf'", descriptionKey: 'accept' },
      { name: 'maxSizeMb', type: 'number', default: '5', descriptionKey: 'maxSizeMb' },
      { name: 'maxFiles', type: 'number', default: '4', descriptionKey: 'maxFiles' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state - the accepted/rejected lists are computed from a FileList on
  pick, so they live in the React/TS tabs. The rules themselves are stated up
  front in the hint, not sprung on the user only when a file bounces.
-->
<div class="w-full max-w-md">
  <div class="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
    <input id="validate-input" type="file" accept="image/*,.pdf" multiple aria-describedby="validate-hint" class="sr-only" />
    <label for="validate-input" class="inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
      Choose files
    </label>
    <p id="validate-hint" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      image/*, .pdf · up to 5 MB · max 4 files
    </p>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

function extAccepted(file, tokens) {
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  return tokens.some((token) => {
    if (token.endsWith('/*')) return file.type.startsWith(token.slice(0, -1));
    if (token.startsWith('.')) return name.endsWith(token);
    return file.type === token;
  });
}

export function FileUploadValidation({
  accept = 'image/*,.pdf',
  maxSizeMb = 5,
  maxFiles = 4,
  onFiles,
  className = '',
}) {
  const inputId = useId();
  const hintId = useId();
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);

  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
  const maxBytes = maxSizeMb * 1_048_576;

  function handleChange(event) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    const ok = [];
    const bad = [];
    for (const file of files) {
      if (!extAccepted(file, tokens)) {
        bad.push({ name: file.name, reason: 'Type not allowed' });
      } else if (file.size > maxBytes) {
        bad.push({ name: file.name, reason: \`Larger than \${maxSizeMb} MB\` });
      } else if (ok.length >= maxFiles) {
        bad.push({ name: file.name, reason: \`Over the \${maxFiles}-file limit\` });
      } else {
        ok.push(file);
      }
    }
    setAccepted(ok.map((file) => file.name));
    setRejected(bad);
    if (ok.length > 0) onFiles?.(ok);
  }

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
        <input id={inputId} type="file" accept={accept} multiple aria-describedby={hintId} onChange={handleChange} className="sr-only" />
        <label htmlFor={inputId} className="inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
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
              <li key={\`ok-\${name}-\${index}\`} className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0" aria-hidden="true">
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
              <li key={\`bad-\${file.name}-\${index}\`} className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs font-medium">{file.reason}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useState, type ChangeEvent } from 'react';

export interface RejectedFile {
  name: string;
  reason: string;
}

export interface FileUploadValidationProps {
  /** Comma-separated accept tokens, e.g. 'image/*,.pdf'. */
  accept?: string;
  maxSizeMb?: number;
  maxFiles?: number;
  /** Fires with the files that passed validation. No upload happens here. */
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

export function FileUploadValidation({
  accept = 'image/*,.pdf',
  maxSizeMb = 5,
  maxFiles = 4,
  onFiles,
  className = '',
}: FileUploadValidationProps): JSX.Element {
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
        bad.push({ name: file.name, reason: \`Larger than \${maxSizeMb} MB\` });
      } else if (ok.length >= maxFiles) {
        bad.push({ name: file.name, reason: \`Over the \${maxFiles}-file limit\` });
      } else {
        ok.push(file);
      }
    }
    setAccepted(ok.map((file) => file.name));
    setRejected(bad);
    if (ok.length > 0) onFiles?.(ok);
  }

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 focus-within:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-within:ring-blue-400 dark:focus-within:ring-offset-gray-950">
        <input id={inputId} type="file" accept={accept} multiple aria-describedby={hintId} onChange={handleChange} className="sr-only" />
        <label htmlFor={inputId} className="inline-block cursor-pointer text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
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
              <li key={\`ok-\${name}-\${index}\`} className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0" aria-hidden="true">
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
              <li key={\`bad-\${file.name}-\${index}\`} className="flex items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                <span className="truncate">{file.name}</span>
                <span className="shrink-0 text-xs font-medium">{file.reason}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'file-upload-paste',
    category: 'file-uploads',
    tags: ['upload', 'paste', 'clipboard', 'image', 'screenshot'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 470, copies: 142, downloads: 33 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'filled', labelKey: 'filled' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Paste a screenshot'", descriptionKey: 'label' },
      { name: 'onFile', type: '(file: File) => void', descriptionKey: 'onFile' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state - pasted-image previews are object URLs read from a paste event,
  so they live in the React/TS tabs (which also revoke on replace and unmount).
  The paste target is a real focusable control with a keyboard route to the
  file input, so it is never a paste-only dead end.
-->
<div class="w-full max-w-md">
  <div tabindex="0" role="button" aria-label="Paste a screenshot. Press Enter to browse for a file instead." class="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75M15.75 3.75v3a1.5 1.5 0 0 0 1.5 1.5h3M12 3.75h4.5L21 8.25v6.75" />
    </svg>
    <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Paste a screenshot</p>
    <p class="text-xs text-gray-500 dark:text-gray-400">
      Press Ctrl/⌘ + V here, or
      <label for="paste-input" class="cursor-pointer font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">browse</label>
    </p>
    <input id="paste-input" type="file" accept="image/*" class="sr-only" />
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function FileUploadPaste({ label = 'Paste a screenshot', onFile, className = '' }) {
  const inputId = useId();
  const [preview, setPreview] = useState(null);
  const urlRef = useRef(null);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  function accept(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const url = URL.createObjectURL(file);
    urlRef.current = url;
    setPreview({ url, name: file.name || 'pasted-image' });
    onFile?.(file);
  }

  function handlePaste(event) {
    const file = Array.from(event.clipboardData.files).find((f) => f.type.startsWith('image/'));
    if (file) {
      event.preventDefault();
      accept(file);
    }
  }

  function handleChange(event) {
    accept(event.target.files?.[0]);
    event.target.value = '';
  }

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      {/* tabIndex 0 so the paste target is reachable; Enter/Space forwards to the
          real <input>, so a keyboard user is never stuck at a paste-only box. */}
      <div
        tabIndex={0}
        role="button"
        aria-label={\`\${label}. Press Enter to browse for a file instead.\`}
        onPaste={handlePaste}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            document.getElementById(inputId)?.click();
          }
        }}
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75M15.75 3.75v3a1.5 1.5 0 0 0 1.5 1.5h3M12 3.75h4.5L21 8.25v6.75" />
        </svg>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Ctrl/⌘ + V here, or{' '}
          <label htmlFor={inputId} className="cursor-pointer font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            browse
          </label>
        </p>
        <input id={inputId} type="file" accept="image/*" onChange={handleChange} className="sr-only" />
      </div>

      <div aria-live="polite">
        {preview ? (
          <figure className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <img src={preview.url} alt={preview.name} className="max-h-48 w-full object-contain" />
            <figcaption className="truncate px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{preview.name}</figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState, type ChangeEvent, type ClipboardEvent } from 'react';

export interface FileUploadPasteProps {
  label?: string;
  /** Fires with the pasted or picked image. No upload happens here. */
  onFile?: (file: File) => void;
  className?: string;
}

interface Preview {
  url: string;
  name: string;
}

export function FileUploadPaste({
  label = 'Paste a screenshot',
  onFile,
  className = '',
}: FileUploadPasteProps): JSX.Element {
  const inputId = useId();
  const [preview, setPreview] = useState<Preview | null>(null);
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

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
    <div className={\`w-full max-w-md \${className}\`}>
      {/* tabIndex 0 so the paste target is reachable; Enter/Space forwards to the
          real <input>, so a keyboard user is never stuck at a paste-only box. */}
      <div
        tabIndex={0}
        role="button"
        aria-label={\`\${label}. Press Enter to browse for a file instead.\`}
        onPaste={handlePaste}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            document.getElementById(inputId)?.click();
          }
        }}
        className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75M15.75 3.75v3a1.5 1.5 0 0 0 1.5 1.5h3M12 3.75h4.5L21 8.25v6.75" />
        </svg>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press Ctrl/⌘ + V here, or{' '}
          <label htmlFor={inputId} className="cursor-pointer font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
            browse
          </label>
        </p>
        <input id={inputId} type="file" accept="image/*" onChange={handleChange} className="sr-only" />
      </div>

      <div aria-live="polite">
        {preview ? (
          <figure className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <img src={preview.url} alt={preview.name} className="max-h-48 w-full object-contain" />
            <figcaption className="truncate px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{preview.name}</figcaption>
          </figure>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'file-upload-queue-retry',
    category: 'file-uploads',
    tags: ['upload', 'queue', 'retry', 'error', 'status'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 520, copies: 168, downloads: 45 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'error', labelKey: 'error' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Upload queue'", descriptionKey: 'label' },
      { name: 'onFiles', type: '(files: File[]) => void', descriptionKey: 'onFiles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state - the queue rows, their statuses and the Retry button are driven
  by a simulated transfer that the markup cannot run, so they live in the
  React/TS tabs. The markup owns the add-files control: a peer sr-only input
  with a label that keeps a real tab stop.
-->
<div class="w-full max-w-md">
  <div class="flex items-center justify-between gap-3">
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Upload queue</p>
    <input id="queue-input" type="file" multiple class="peer sr-only" />
    <label for="queue-input" class="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950">
      Add files
    </label>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function FileUploadQueue({ label = 'Upload queue', onFiles, className = '' }) {
  const inputId = useId();
  const nextId = useRef(0);
  const [items, setItems] = useState([]);

  // Simulated transfer: each in-flight item counts down; at zero it resolves.
  // A first attempt on an even id "fails" so retry always has something to do.
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

  function handleChange(event) {
    const files = event.target.files ? Array.from(event.target.files) : [];
    event.target.value = '';
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: \`\${nextId.current++}\`, name: file.name, status: 'uploading', ticks: 3, attempts: 0 })),
    ]);
    onFiles?.(files);
  }

  function retry(id) {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, status: 'uploading', ticks: 3, attempts: it.attempts + 1 } : it)),
    );
  }

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        <input id={inputId} type="file" multiple onChange={handleChange} className="peer sr-only" />
        <label htmlFor={inputId} className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950">
          Add files
        </label>
      </div>

      <ul aria-live="polite" className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
            <span
              className={\`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs \${
                item.status === 'done'
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : item.status === 'error'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
              }\`}
              aria-hidden="true"
            >
              {item.status === 'done' ? '✓' : item.status === 'error' ? '!' : '…'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className={\`text-xs \${item.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}\`}>
                {item.status === 'done' ? 'Uploaded' : item.status === 'error' ? 'Upload failed' : 'Uploading…'}
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
}`,
      typescript: `import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react';

export type QueueStatus = 'uploading' | 'done' | 'error';

export interface QueueItem {
  id: string;
  name: string;
  status: QueueStatus;
  ticks: number;
  attempts: number;
}

export interface FileUploadQueueProps {
  label?: string;
  /** Fires with the newly queued files. No upload happens here. */
  onFiles?: (files: File[]) => void;
  className?: string;
}

export function FileUploadQueue({
  label = 'Upload queue',
  onFiles,
  className = '',
}: FileUploadQueueProps): JSX.Element {
  const inputId = useId();
  const nextId = useRef(0);
  const [items, setItems] = useState<QueueItem[]>([]);

  // Simulated transfer: each in-flight item counts down; at zero it resolves.
  // A first attempt on an even id "fails" so retry always has something to do.
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
        id: \`\${nextId.current++}\`,
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
      prev.map((it) => (it.id === id ? { ...it, status: 'uploading', ticks: 3, attempts: it.attempts + 1 } : it)),
    );
  }

  return (
    <div className={\`w-full max-w-md \${className}\`}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</p>
        <input id={inputId} type="file" multiple onChange={handleChange} className="peer sr-only" />
        <label htmlFor={inputId} className="inline-flex min-h-9 cursor-pointer items-center rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-950">
          Add files
        </label>
      </div>

      <ul aria-live="polite" className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
            <span
              className={\`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs \${
                item.status === 'done'
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : item.status === 'error'
                    ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
              }\`}
              aria-hidden="true"
            >
              {item.status === 'done' ? '✓' : item.status === 'error' ? '!' : '…'}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-gray-900 dark:text-gray-100">{item.name}</p>
              <p className={\`text-xs \${item.status === 'error' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}\`}>
                {item.status === 'done' ? 'Uploaded' : item.status === 'error' ? 'Upload failed' : 'Uploading…'}
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
}`,
    },
  },
  {
    slug: 'file-upload-split-url-tab',
    category: 'file-uploads',
    tags: ['upload', 'tabs', 'url', 'file-input', 'form'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 500, copies: 151, downloads: 40 },
    variants: [
      { id: 'file', labelKey: 'file' },
      { id: 'url', labelKey: 'url' },
    ],
    props: [
      { name: 'onFile', type: '(file: File) => void', descriptionKey: 'onFile' },
      { name: 'onUrl', type: '(url: string) => void', descriptionKey: 'onUrl' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Resting state (file tab active). The tab switch and the added-sources list are
  stateful, so they live in the React/TS tabs - with real role="tab"/tabpanel
  wiring. Both routes stay keyboard-reachable: a real file input under a label,
  and a real <form> with a labelled URL field.
-->
<div class="w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <div role="tablist" aria-label="Add a file" class="flex border-b border-gray-200 dark:border-gray-800">
    <button type="button" role="tab" aria-selected="true" class="min-h-10 flex-1 border-b-2 border-blue-600 px-3 py-2 text-sm font-semibold text-blue-700 dark:border-blue-400 dark:text-blue-400">Upload file</button>
    <button type="button" role="tab" aria-selected="false" class="min-h-10 flex-1 border-b-2 border-transparent px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">From URL</button>
  </div>
  <div class="p-4">
    <input id="split-file-input" type="file" class="peer sr-only" />
    <label for="split-file-input" class="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-900">
      Choose a file from your device
    </label>
  </div>
</div>`,
      react: `import { useId, useState } from 'react';

export function FileUploadSplitUrl({ onFile, onUrl, className = '' }) {
  const fileInputId = useId();
  const urlInputId = useId();
  const [tab, setTab] = useState('file');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [added, setAdded] = useState([]);
  const nextId = useState(() => ({ n: 0 }))[0];

  function handleFile(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setAdded((prev) => [...prev, { id: \`\${nextId.n++}\`, label: file.name, kind: 'file' }]);
    onFile?.(file);
  }

  function handleUrlSubmit(event) {
    event.preventDefault();
    const value = url.trim();
    if (!/^https?:\\/\\/\\S+$/i.test(value)) {
      setError('Enter a valid http(s) URL.');
      return;
    }
    setError('');
    setAdded((prev) => [...prev, { id: \`\${nextId.n++}\`, label: value, kind: 'url' }]);
    onUrl?.(value);
    setUrl('');
  }

  const tabClass = (active) =>
    \`min-h-10 flex-1 border-b-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
      active
        ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
    }\`;

  return (
    <div className={\`w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div role="tablist" aria-label="Add a file" className="flex border-b border-gray-200 dark:border-gray-800">
        <button type="button" role="tab" id="fu-tab-file" aria-selected={tab === 'file'} aria-controls="fu-panel-file" onClick={() => setTab('file')} className={tabClass(tab === 'file')}>
          Upload file
        </button>
        <button type="button" role="tab" id="fu-tab-url" aria-selected={tab === 'url'} aria-controls="fu-panel-url" onClick={() => setTab('url')} className={tabClass(tab === 'url')}>
          From URL
        </button>
      </div>

      <div className="p-4">
        {tab === 'file' ? (
          <div role="tabpanel" id="fu-panel-file" aria-labelledby="fu-tab-file">
            <input id={fileInputId} type="file" onChange={handleFile} className="peer sr-only" />
            <label htmlFor={fileInputId} className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-900">
              Choose a file from your device
            </label>
          </div>
        ) : (
          <form role="tabpanel" id="fu-panel-url" aria-labelledby="fu-tab-url" onSubmit={handleUrlSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor={urlInputId} className="sr-only">File URL</label>
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
            <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
              Add
            </button>
          </form>
        )}
        {error ? (
          <p id="fu-url-error" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        {added.length > 0 ? (
          <ul aria-live="polite" className="mt-3 space-y-1">
            {added.map((source) => (
              <li key={source.id} className="flex items-center gap-2 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-400">{source.kind}</span>
                <span className="truncate">{source.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useState, type ChangeEvent, type FormEvent } from 'react';

type Tab = 'file' | 'url';

interface AddedSource {
  id: string;
  label: string;
  kind: Tab;
}

export interface FileUploadSplitUrlProps {
  /** Fires with a picked file. No upload happens here. */
  onFile?: (file: File) => void;
  /** Fires with a validated http(s) URL string. */
  onUrl?: (url: string) => void;
  className?: string;
}

export function FileUploadSplitUrl({
  onFile,
  onUrl,
  className = '',
}: FileUploadSplitUrlProps): JSX.Element {
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
    setAdded((prev) => [...prev, { id: \`\${nextId.n++}\`, label: file.name, kind: 'file' }]);
    onFile?.(file);
  }

  function handleUrlSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = url.trim();
    if (!/^https?:\\/\\/\\S+$/i.test(value)) {
      setError('Enter a valid http(s) URL.');
      return;
    }
    setError('');
    setAdded((prev) => [...prev, { id: \`\${nextId.n++}\`, label: value, kind: 'url' }]);
    onUrl?.(value);
    setUrl('');
  }

  const tabClass = (active: boolean) =>
    \`min-h-10 flex-1 border-b-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400 \${
      active
        ? 'border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400'
        : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
    }\`;

  return (
    <div className={\`w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}>
      <div role="tablist" aria-label="Add a file" className="flex border-b border-gray-200 dark:border-gray-800">
        <button type="button" role="tab" id="fu-tab-file" aria-selected={tab === 'file'} aria-controls="fu-panel-file" onClick={() => setTab('file')} className={tabClass(tab === 'file')}>
          Upload file
        </button>
        <button type="button" role="tab" id="fu-tab-url" aria-selected={tab === 'url'} aria-controls="fu-panel-url" onClick={() => setTab('url')} className={tabClass(tab === 'url')}>
          From URL
        </button>
      </div>

      <div className="p-4">
        {tab === 'file' ? (
          <div role="tabpanel" id="fu-panel-file" aria-labelledby="fu-tab-file">
            <input id={fileInputId} type="file" onChange={handleFile} className="peer sr-only" />
            <label htmlFor={fileInputId} className="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:peer-focus-visible:ring-blue-400 dark:peer-focus-visible:ring-offset-gray-900">
              Choose a file from your device
            </label>
          </div>
        ) : (
          <form role="tabpanel" id="fu-panel-url" aria-labelledby="fu-tab-url" onSubmit={handleUrlSubmit} className="flex flex-col gap-2 sm:flex-row">
            <label htmlFor={urlInputId} className="sr-only">File URL</label>
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
            <button type="submit" className="inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
              Add
            </button>
          </form>
        )}
        {error ? (
          <p id="fu-url-error" className="mt-2 text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        {added.length > 0 ? (
          <ul aria-live="polite" className="mt-3 space-y-1">
            {added.map((source) => (
              <li key={source.id} className="flex items-center gap-2 truncate rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
                <span className="shrink-0 rounded bg-gray-200 px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-400">{source.kind}</span>
                <span className="truncate">{source.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
];
