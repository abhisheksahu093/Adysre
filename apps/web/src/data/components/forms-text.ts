import type { ComponentEntry } from './types';

/**
 * Forms - text entry (inputs and textareas).
 *
 * Split out of the other `forms-*` files by shape, not by category: everything
 * here is `category: 'forms'` alongside `forms-select` and `forms-choice`. The
 * split is a file-size and merge-conflict concern only; the registry flattens
 * them back into one category.
 *
 * The one rule every entry in this file obeys: **a placeholder is not a label.**
 * Every field owns a real `<label for>` - visually hidden where the design has
 * no room for it (the icon and addon fields), never absent. A placeholder
 * vanishes the moment the user types, which is exactly when someone re-reading
 * the form needs to know what the box was for.
 */
export const formsTextComponents: ComponentEntry[] = [
  {
    slug: 'input-basic',
    category: 'forms',
    tags: ['input', 'text', 'label', 'helper', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-11',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3120, copies: 902, downloads: 214 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The three parts of a text field, in the order a screen reader meets them:
  the label names it, the input is it, and the helper text explains it. The
  helper is wired with aria-describedby rather than left floating next to the
  box - otherwise it is announced to nobody, which is the one audience that
  cannot see it sitting there.
-->
<div class="field">
  <label class="field__label" for="field-email">Email address</label>
  <input
    class="field__input"
    id="field-email"
    name="email"
    type="email"
    autocomplete="email"
    placeholder="you@example.com"
    aria-describedby="field-email-help"
  />
  <p class="field__help" id="field-email-help">We only use this to send receipts.</p>
</div>`,
      css: `.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

/*
 * Placeholder colour is a contrast decision, not a taste one. #6b7280 on white
 * is 4.8:1 - the lightest grey that still clears AA. Anything softer looks
 * better in a mock and fails for the people the rule exists for.
 */
.field__input::placeholder {
  color: #6b7280;
}

.field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.field__help {
  margin: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

/*
 * A text field is almost entirely inherited surface - the box, the label, the
 * helper and the placeholder all sit on the page background, so every one of
 * them has to be re-tuned for dark. Note the placeholder LIGHTENS to #9ca3af:
 * keeping #6b7280 would drop it to 4.0:1 on #111827 and fail.
 */
@media (prefers-color-scheme: dark) {
  .field__label {
    color: #f3f4f6;
  }

  .field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .field__input::placeholder {
    color: #9ca3af;
  }

  .field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .field__help {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="field-email">
    Email address
  </label>
  <input
    id="field-email"
    name="email"
    type="email"
    autocomplete="email"
    placeholder="you@example.com"
    aria-describedby="field-email-help"
    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
  />
  <p id="field-email-help" class="text-xs text-gray-600 dark:text-gray-400">
    We only use this to send receipts.
  </p>
</div>`,
      react: `import { useId } from 'react';

export function InputBasic({ label, helperText, className = '', ...props }) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText && (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputBasicProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  helperText?: string;
}

// No 'use client' - useId works on the server and the field holds no state of
// its own. Let the parent form own the value.
export function InputBasic({ label, helperText, className = '', ...props }: InputBasicProps) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * \`id\` is omitted from the inherited attributes and generated internally, so
 * the label and the input cannot be wired to different ids by accident - the
 * single most common way a "labelled" field turns out not to be.
 */
export interface InputBasicProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  helperText?: string;
}

export function InputBasic({
  label,
  helperText,
  className = '',
  ...props
}: InputBasicProps): JSX.Element {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'input-with-icon',
    category: 'forms',
    tags: ['input', 'icon', 'search', 'clear', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-29',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2480, copies: 671, downloads: 178 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  A search field with a magnifier in it still needs a real <label>. The design
  has no room for one, so it is visually hidden rather than dropped: the icon is
  aria-hidden decoration and the placeholder disappears on the first keystroke,
  which would leave the field with no accessible name at all.

  The clear button is a real <button> with its own name, not a click handler on
  a <span> - it has to be reachable by Tab and Enter like any other action.
-->
<div class="icon-field">
  <label class="icon-field__label" for="icon-field-search">Search components</label>
  <div class="icon-field__box">
    <svg class="icon-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <input
      class="icon-field__input"
      id="icon-field-search"
      name="q"
      type="search"
      placeholder="Search components"
      value="gradient"
    />
    <button class="icon-field__clear" type="button" aria-label="Clear search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>

<script>
  document.querySelectorAll('.icon-field').forEach(function (root) {
    var input = root.querySelector('.icon-field__input');
    var clear = root.querySelector('.icon-field__clear');

    // The clear button only exists when there is something to clear - an
    // always-visible X on an empty field is a control that does nothing.
    function sync() {
      clear.hidden = input.value.length === 0;
    }

    input.addEventListener('input', sync);
    clear.addEventListener('click', function () {
      input.value = '';
      sync();
      input.focus();
    });

    sync();
  });
</script>`,
      css: `.icon-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

/*
 * The label is hidden from sight, not from the accessibility tree. \`display:
 * none\` or \`visibility: hidden\` would remove it from both and leave the input
 * unnamed - this clip-rect technique is the only one that hides it visually
 * while a screen reader still reads it.
 */
.icon-field__label {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.icon-field__box {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-field__icon {
  position: absolute;
  left: 0.75rem;
  width: 1rem;
  height: 1rem;
  color: #6b7280;
  pointer-events: none;
}

/* Padding, not margin: the text must never slide under the glyph. */
.icon-field__input {
  width: 100%;
  padding: 0.5rem 2.25rem 0.5rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.icon-field__input::placeholder {
  color: #6b7280;
}

.icon-field__input::-webkit-search-cancel-button {
  display: none;
}

.icon-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.icon-field__clear {
  position: absolute;
  right: 0.375rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #4b5563;
  cursor: pointer;
}

.icon-field__clear svg {
  width: 0.875rem;
  height: 0.875rem;
}

.icon-field__clear:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.icon-field__clear:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

@media (prefers-color-scheme: dark) {
  .icon-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  /* Lightened, not kept: #6b7280 on #111827 is 4.0:1 and fails AA. */
  .icon-field__input::placeholder {
    color: #9ca3af;
  }

  .icon-field__icon {
    color: #9ca3af;
  }

  .icon-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .icon-field__clear {
    color: #9ca3af;
  }

  .icon-field__clear:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .icon-field__clear:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="sr-only" for="icon-field-search">Search components</label>
  <div class="relative flex items-center">
    <svg class="pointer-events-none absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
    <input
      id="icon-field-search"
      name="q"
      type="search"
      placeholder="Search components"
      value="gradient"
      class="w-full rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder-gray-500 [&::-webkit-search-cancel-button]:hidden focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
    />
    <button
      type="button"
      aria-label="Clear search"
      class="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>`,
      react: `import { useId, useRef } from 'react';

const SearchIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export function InputWithIcon({ label, icon = SearchIcon, value, onChange, onClear, ...props }) {
  const id = useId();
  const inputRef = useRef(null);

  return (
    <div className="flex flex-col gap-1.5">
      {/* sr-only, not omitted: the icon is decoration and the placeholder
          vanishes on the first keystroke. */}
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder-gray-500 [&::-webkit-search-cancel-button]:hidden focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
          {...props}
        />
        {value.length > 0 && (
          <button
            type="button"
            aria-label={\`Clear \${label.toLowerCase()}\`}
            onClick={() => {
              onClear?.();
              inputRef.current?.focus();
            }}
            className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputWithIconProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value'> {
  label: string;
  icon?: ReactNode;
  value: string;
  onClear?: () => void;
}

// 'use client' - the clear button needs a ref and a click handler.
export function InputWithIcon({
  label,
  icon,
  value,
  onChange,
  onClear,
  ...props
}: InputWithIconProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder-gray-500 [&::-webkit-search-cancel-button]:hidden focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
          {...props}
        />
        {value.length > 0 ? (
          <button
            type="button"
            aria-label={\`Clear \${label.toLowerCase()}\`}
            onClick={() => {
              onClear?.();
              inputRef.current?.focus();
            }}
            className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}`,
      typescript: `import { useId, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * \`label\` is required even though it renders \`sr-only\` - the icon is
 * \`aria-hidden\` and the placeholder is gone the moment the user types, so
 * without it the field has no accessible name at any point that matters.
 */
export interface InputWithIconProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'value'> {
  label: string;
  icon?: ReactNode;
  value: string;
  /** Called when the clear button is pressed. Reset your state to ''. */
  onClear?: () => void;
}

export function InputWithIcon({
  label,
  icon,
  value,
  onChange,
  onClear,
  ...props
}: InputWithIconProps): JSX.Element {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-3 h-4 w-4 text-gray-500 dark:text-gray-400">
          {icon}
        </span>
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border border-gray-300 bg-white px-9 py-2 text-sm text-gray-900 placeholder-gray-500 [&::-webkit-search-cancel-button]:hidden focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
          {...props}
        />
        {value.length > 0 ? (
          <button
            type="button"
            aria-label={\`Clear \${label.toLowerCase()}\`}
            onClick={() => {
              onClear?.();
              inputRef.current?.focus();
            }}
            className="absolute right-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'input-floating-label',
    category: 'forms',
    tags: ['input', 'floating', 'label', 'animated', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-14',
    updatedAt: '2026-07-06',
    license: 'MIT',
    version: '1.0.2',
    featured: true,
    stats: { views: 4010, copies: 1183, downloads: 296 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The trick that makes this work without a line of JavaScript: the input carries
  placeholder=" " - a single space, never empty. :placeholder-shown then means
  exactly "the user has typed nothing", and the label parks itself over the box
  in that state and floats up otherwise.

  This is still a real <label for>, not a placeholder cosplaying as one. It is
  in the accessibility tree the whole time; it only moves.
-->
<div class="float-field">
  <input
    class="float-field__input"
    id="float-field-name"
    name="fullName"
    type="text"
    placeholder=" "
    autocomplete="name"
  />
  <label class="float-field__label" for="float-field-name">Full name</label>
</div>`,
      css: `.float-field {
  position: relative;
}

/*
 * The top padding is asymmetric on purpose - it reserves the strip the floated
 * label lands in, so the value never has to share a row with it.
 */
.float-field__input {
  width: 100%;
  padding: 1.25rem 0.75rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.float-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.float-field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

/*
 * pointer-events: none so a click passes through to the input underneath -
 * without it the label swallows clicks aimed at the middle of the field, and
 * for=… would be the only thing still focusing it.
 */
.float-field__label {
  position: absolute;
  top: 0.375rem;
  left: 0.75rem;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #4b5563;
  pointer-events: none;
  transform-origin: 0 0;
  transition: transform 150ms ease, font-size 150ms ease, color 150ms ease;
}

/* Resting state: empty and unfocused - the label sits where the value will. */
.float-field__input:placeholder-shown:not(:focus) + .float-field__label {
  transform: translateY(0.5rem);
  font-size: 0.875rem;
}

.float-field__input:focus + .float-field__label {
  color: #1d4ed8;
}

@media (prefers-color-scheme: dark) {
  .float-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .float-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .float-field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .float-field__label {
    color: #9ca3af;
  }

  .float-field__input:focus + .float-field__label {
    color: #93c5fd;
  }
}

/* The float still happens for these users - only the tween is dropped. */
@media (prefers-reduced-motion: reduce) {
  .float-field__label {
    transition: none;
  }
}`,
      tailwind: `<div class="relative">
  <input
    id="float-field-name"
    name="fullName"
    type="text"
    placeholder=" "
    autocomplete="name"
    class="peer w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
  />
  <label
    for="float-field-name"
    class="pointer-events-none absolute left-3 top-1.5 origin-left text-[0.6875rem] font-medium text-gray-600 transition-all motion-reduce:transition-none peer-[:placeholder-shown:not(:focus)]:translate-y-2 peer-[:placeholder-shown:not(:focus)]:text-sm peer-focus:text-blue-700 dark:text-gray-400 dark:peer-focus:text-blue-300"
  >
    Full name
  </label>
</div>`,
      react: `import { useId } from 'react';

export function InputFloatingLabel({ label, className = '', ...props }) {
  const id = useId();

  return (
    <div className={\`relative \${className}\`}>
      {/* placeholder=" " is load-bearing: it makes :placeholder-shown mean
          "empty", which is what drives the float. Do not remove it. */}
      <input
        id={id}
        placeholder=" "
        className="peer w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1.5 origin-left text-[0.6875rem] font-medium text-gray-600 transition-all motion-reduce:transition-none peer-[:placeholder-shown:not(:focus)]:translate-y-2 peer-[:placeholder-shown:not(:focus)]:text-sm peer-focus:text-blue-700 dark:text-gray-400 dark:peer-focus:text-blue-300"
      >
        {label}
      </label>
    </div>
  );
}`,
      nextjs: `import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputFloatingLabelProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'placeholder'> {
  label: string;
}

// No 'use client' - the float is pure CSS (peer + :placeholder-shown). Nothing
// here reads state, so it renders as a Server Component.
export function InputFloatingLabel({ label, className = '', ...props }: InputFloatingLabelProps) {
  const id = useId();

  return (
    <div className={\`relative \${className}\`}>
      <input
        id={id}
        placeholder=" "
        className="peer w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1.5 origin-left text-[0.6875rem] font-medium text-gray-600 transition-all motion-reduce:transition-none peer-[:placeholder-shown:not(:focus)]:translate-y-2 peer-[:placeholder-shown:not(:focus)]:text-sm peer-focus:text-blue-700 dark:text-gray-400 dark:peer-focus:text-blue-300"
      >
        {label}
      </label>
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * \`placeholder\` is omitted from the inherited attributes because the component
 * sets it to " " itself - the float is driven by \`:placeholder-shown\`, so a
 * caller-supplied placeholder would silently pin the label in its floated
 * position forever. The type makes that mistake unrepresentable.
 */
export interface InputFloatingLabelProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'placeholder'> {
  label: string;
}

export function InputFloatingLabel({
  label,
  className = '',
  ...props
}: InputFloatingLabelProps): JSX.Element {
  const id = useId();

  return (
    <div className={\`relative \${className}\`}>
      <input
        id={id}
        placeholder=" "
        className="peer w-full rounded-lg border border-gray-300 bg-white px-3 pb-2 pt-5 text-sm text-gray-900 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3 top-1.5 origin-left text-[0.6875rem] font-medium text-gray-600 transition-all motion-reduce:transition-none peer-[:placeholder-shown:not(:focus)]:translate-y-2 peer-[:placeholder-shown:not(:focus)]:text-sm peer-focus:text-blue-700 dark:text-gray-400 dark:peer-focus:text-blue-300"
      >
        {label}
      </label>
    </div>
  );
}`,
    },
  },
  {
    slug: 'input-with-error',
    category: 'forms',
    tags: ['input', 'error', 'validation', 'aria-invalid', 'form'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-03',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.1.1',
    stats: { views: 2760, copies: 814, downloads: 203 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Red is not the error state. A red border is invisible to a red-blind user and
  completely silent to a screen reader - the two attributes below are what make
  this field actually invalid:

    aria-invalid="true"    the field announces as invalid
    aria-describedby=…     the announcement includes WHY

  The colour is the third channel, not the only one. The icon and the message
  text carry the same information for anyone the hue does not reach.
-->
<div class="error-field">
  <label class="error-field__label" for="error-field-email">Email address</label>
  <input
    class="error-field__input"
    id="error-field-email"
    name="email"
    type="email"
    value="jane@"
    aria-invalid="true"
    aria-describedby="error-field-email-msg"
  />
  <p class="error-field__message" id="error-field-email-msg">
    <svg class="error-field__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
    Enter a complete email address, like jane@example.com.
  </p>
</div>`,
      css: `.error-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.error-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.error-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

/*
 * Styled off [aria-invalid], not off a .is-error class. The attribute that
 * screen readers act on and the attribute that paints the border are then the
 * same one - they cannot drift apart, which is how a field ends up looking
 * invalid while announcing as fine.
 */
.error-field__input[aria-invalid='true'] {
  border-color: #dc2626;
}

.error-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.error-field__input[aria-invalid='true']:focus-visible {
  outline-color: #dc2626;
  border-color: #dc2626;
}

.error-field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

/* #b91c1c on white is 6.4:1 - red-600 would be 4.0:1 and fail as body text. */
.error-field__message {
  display: flex;
  align-items: flex-start;
  gap: 0.375rem;
  margin: 0;
  font-size: 0.75rem;
  color: #b91c1c;
}

.error-field__icon {
  flex-shrink: 0;
  width: 0.875rem;
  height: 0.875rem;
  margin-top: 0.0625rem;
}

/* #f87171 on #111827 is 6.5:1; #b91c1c on it would be 2.3:1 and disappear. */
@media (prefers-color-scheme: dark) {
  .error-field__label {
    color: #f3f4f6;
  }

  .error-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .error-field__input[aria-invalid='true'] {
    border-color: #ef4444;
  }

  .error-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .error-field__input[aria-invalid='true']:focus-visible {
    outline-color: #ef4444;
    border-color: #ef4444;
  }

  .error-field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .error-field__message {
    color: #f87171;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="error-field-email">
    Email address
  </label>
  <input
    id="error-field-email"
    name="email"
    type="email"
    value="jane@"
    aria-invalid="true"
    aria-describedby="error-field-email-msg"
    class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus-visible:border-red-600 aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:aria-[invalid=true]:border-red-500 dark:aria-[invalid=true]:focus-visible:border-red-500 dark:aria-[invalid=true]:focus-visible:ring-red-500"
  />
  <p id="error-field-email-msg" class="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400">
    <svg class="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
    Enter a complete email address, like jane@example.com.
  </p>
</div>`,
      react: `import { useId } from 'react';

export function InputWithError({ label, error, helperText, ...props }) {
  const id = useId();
  const msgId = \`\${id}-msg\`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        // Both derived from the same \`error\` value - the border and the
        // announcement can never disagree.
        aria-invalid={invalid || undefined}
        aria-describedby={error || helperText ? msgId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus-visible:border-red-600 aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:aria-[invalid=true]:border-red-500"
        {...props}
      />
      {invalid ? (
        <p id={msgId} className="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400">
          <svg className="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : (
        helperText && (
          <p id={msgId} className="text-xs text-gray-600 dark:text-gray-400">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}`,
      nextjs: `import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputWithErrorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'aria-invalid'> {
  label: string;
  error?: string;
  helperText?: string;
}

// No 'use client' - validation state arrives as a prop from whatever owns the
// form. The field only renders it.
export function InputWithError({ label, error, helperText, ...props }: InputWithErrorProps) {
  const id = useId();
  const msgId = \`\${id}-msg\`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={error ?? helperText ? msgId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus-visible:border-red-600 aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:aria-[invalid=true]:border-red-500"
        {...props}
      />
      {invalid ? (
        <p id={msgId} className="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400">
          <svg className="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={msgId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

/**
 * \`aria-invalid\` is omitted from the inherited attributes and derived from
 * \`error\` instead. A caller cannot set one without the other, so the field
 * cannot end up painted red while announcing as valid - or announcing as
 * invalid with no message to say why.
 */
export interface InputWithErrorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'aria-invalid'> {
  label: string;
  /** Present means invalid. Write it as a fix, not a diagnosis. */
  error?: string;
  helperText?: string;
}

export function InputWithError({
  label,
  error,
  helperText,
  ...props
}: InputWithErrorProps): JSX.Element {
  const id = useId();
  const msgId = \`\${id}-msg\`;
  const invalid = Boolean(error);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={error ?? helperText ? msgId : undefined}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 aria-[invalid=true]:border-red-600 aria-[invalid=true]:focus-visible:border-red-600 aria-[invalid=true]:focus-visible:ring-red-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:aria-[invalid=true]:border-red-500"
        {...props}
      />
      {invalid ? (
        <p id={msgId} className="flex items-start gap-1.5 text-xs text-red-700 dark:text-red-400">
          <svg className="mt-px h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p id={msgId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'input-with-addon',
    category: 'forms',
    tags: ['input', 'addon', 'prefix', 'suffix', 'url'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-19',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1890, copies: 502, downloads: 131 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The addons are aria-hidden, and that is the point: "https://" and ".com" are
  scaffolding the user cannot edit, not part of the field's name. Left audible
  they turn the announcement into "https:// Site domain .com edit text", which
  is noise. The label says what to type; the addons show where it lands.

  The focus ring goes on the WRAPPER, not the input - the input has no border of
  its own, so a ring on it would draw inside the group and look like a bug.
-->
<div class="addon-field">
  <label class="addon-field__label" for="addon-field-domain">Site domain</label>
  <div class="addon-field__group">
    <span class="addon-field__addon addon-field__addon--prefix" aria-hidden="true">https://</span>
    <input
      class="addon-field__input"
      id="addon-field-domain"
      name="domain"
      type="text"
      placeholder="adysre"
      aria-describedby="addon-field-domain-help"
    />
    <span class="addon-field__addon addon-field__addon--suffix" aria-hidden="true">.com</span>
  </div>
  <p class="addon-field__help" id="addon-field-domain-help">Lowercase letters and hyphens only.</p>
</div>`,
      css: `.addon-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.addon-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

/*
 * The group owns the border and the radius; the three children are seamless
 * inside it. focus-within is what lets the ring belong to the whole unit -
 * which is what the user perceives they are focusing.
 */
.addon-field__group {
  display: flex;
  align-items: stretch;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  overflow: hidden;
}

.addon-field__group:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.addon-field__addon {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  background-color: #f9fafb;
  color: #4b5563;
  font-size: 0.875rem;
  white-space: nowrap;
  user-select: none;
}

.addon-field__addon--prefix {
  border-right: 1px solid #d1d5db;
}

.addon-field__addon--suffix {
  border-left: 1px solid #d1d5db;
}

/* Borderless and transparent: the group already drew both. */
.addon-field__input {
  flex: 1;
  min-width: 0;
  padding: 0.5rem 0.75rem;
  border: 0;
  background-color: transparent;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
}

.addon-field__input::placeholder {
  color: #6b7280;
}

.addon-field__input:focus {
  outline: none;
}

.addon-field__help {
  margin: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .addon-field__label {
    color: #f3f4f6;
  }

  .addon-field__group {
    border-color: #374151;
    background-color: #111827;
  }

  .addon-field__group:focus-within {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  /* Lifted off the field, not dropped onto it - the addon must still read as
     a separate, inert surface in dark. */
  .addon-field__addon {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .addon-field__addon--prefix {
    border-right-color: #374151;
  }

  .addon-field__addon--suffix {
    border-left-color: #374151;
  }

  .addon-field__input {
    color: #f3f4f6;
  }

  .addon-field__input::placeholder {
    color: #9ca3af;
  }

  .addon-field__help {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="addon-field-domain">
    Site domain
  </label>
  <div class="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
    <span
      aria-hidden="true"
      class="inline-flex select-none items-center border-r border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
      https://
    </span>
    <input
      id="addon-field-domain"
      name="domain"
      type="text"
      placeholder="adysre"
      aria-describedby="addon-field-domain-help"
      class="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
    />
    <span
      aria-hidden="true"
      class="inline-flex select-none items-center border-l border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
    >
      .com
    </span>
  </div>
  <p id="addon-field-domain-help" class="text-xs text-gray-600 dark:text-gray-400">
    Lowercase letters and hyphens only.
  </p>
</div>`,
      react: `import { useId } from 'react';

const ADDON = 'inline-flex select-none items-center bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400';

export function InputWithAddon({ label, prefix, suffix, helperText, ...props }) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        {prefix && (
          // aria-hidden: this is scaffolding, not part of the field's name.
          <span aria-hidden="true" className={\`\${ADDON} border-r border-gray-300 dark:border-gray-700\`}>
            {prefix}
          </span>
        )}
        <input
          id={id}
          aria-describedby={helperText ? helpId : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
        {suffix && (
          <span aria-hidden="true" className={\`\${ADDON} border-l border-gray-300 dark:border-gray-700\`}>
            {suffix}
          </span>
        )}
      </div>
      {helperText && (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputWithAddonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'prefix'> {
  label: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  helperText?: string;
}

const ADDON =
  'inline-flex select-none items-center bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400';

// Stateless - no 'use client' needed.
export function InputWithAddon({
  label,
  prefix,
  suffix,
  helperText,
  ...props
}: InputWithAddonProps) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        {prefix ? (
          <span aria-hidden="true" className={\`\${ADDON} border-r border-gray-300 dark:border-gray-700\`}>
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          aria-describedby={helperText ? helpId : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
        {suffix ? (
          <span aria-hidden="true" className={\`\${ADDON} border-l border-gray-300 dark:border-gray-700\`}>
            {suffix}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

/**
 * \`prefix\` is omitted from the inherited attributes for a reason that is not
 * obvious: it is already a real HTML attribute (the RDFa one), typed as
 * \`string\`. Redeclaring it as \`ReactNode\` without the Omit is a compile error,
 * and the fix is not to rename the prop - the RDFa attribute is not something
 * anyone is passing to a text field. \`suffix\` has no such clash.
 */
export interface InputWithAddonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'prefix'> {
  label: string;
  /** Inert scaffolding shown before the value, e.g. 'https://'. */
  prefix?: ReactNode;
  /** Inert scaffolding shown after the value, e.g. '.com'. */
  suffix?: ReactNode;
  helperText?: string;
}

const ADDON =
  'inline-flex select-none items-center bg-gray-50 px-3 py-2 text-sm text-gray-600 dark:bg-gray-800 dark:text-gray-400';

export function InputWithAddon({
  label,
  prefix,
  suffix,
  helperText,
  ...props
}: InputWithAddonProps): JSX.Element {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        {prefix ? (
          <span aria-hidden="true" className={\`\${ADDON} border-r border-gray-300 dark:border-gray-700\`}>
            {prefix}
          </span>
        ) : null}
        <input
          id={id}
          aria-describedby={helperText ? helpId : undefined}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
        {suffix ? (
          <span aria-hidden="true" className={\`\${ADDON} border-l border-gray-300 dark:border-gray-700\`}>
            {suffix}
          </span>
        ) : null}
      </div>
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'textarea-basic',
    category: 'forms',
    tags: ['textarea', 'multiline', 'label', 'helper', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-17',
    updatedAt: '2026-06-27',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2210, copies: 588, downloads: 149 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Same three parts as a text input, one extra decision: rows. It is the initial
  height, and it is a promise about how much you expect someone to write -
  rows="4" invites a paragraph, rows="2" invites a sentence. Set it to the
  answer you actually want.
-->
<div class="ta-field">
  <label class="ta-field__label" for="ta-field-bio">Short bio</label>
  <textarea
    class="ta-field__input"
    id="ta-field-bio"
    name="bio"
    rows="4"
    placeholder="Tell us what you work on."
    aria-describedby="ta-field-bio-help"
  ></textarea>
  <p class="ta-field__help" id="ta-field-bio-help">Shown on your public profile.</p>
</div>`,
      css: `.ta-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ta-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.ta-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
  /* A textarea does NOT inherit the page font - without this it renders in the
     browser's monospace default and looks like a bug. */
  font-family: inherit;
  resize: vertical;
}

.ta-field__input::placeholder {
  color: #6b7280;
}

.ta-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.ta-field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
  resize: none;
}

.ta-field__help {
  margin: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .ta-field__label {
    color: #f3f4f6;
  }

  .ta-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .ta-field__input::placeholder {
    color: #9ca3af;
  }

  .ta-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .ta-field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .ta-field__help {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="ta-field-bio">
    Short bio
  </label>
  <textarea
    id="ta-field-bio"
    name="bio"
    rows="4"
    placeholder="Tell us what you work on."
    aria-describedby="ta-field-bio-help"
    class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
  ></textarea>
  <p id="ta-field-bio-help" class="text-xs text-gray-600 dark:text-gray-400">
    Shown on your public profile.
  </p>
</div>`,
      react: `import { useId } from 'react';

export function TextareaBasic({ label, helperText, rows = 4, className = '', ...props }) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText && (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaBasicProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
}

// Stateless - no 'use client' needed.
export function TextareaBasic({
  label,
  helperText,
  rows = 4,
  className = '',
  ...props
}: TextareaBasicProps) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface TextareaBasicProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
}

export function TextareaBasic({
  label,
  helperText,
  rows = 4,
  className = '',
  ...props
}: TextareaBasicProps): JSX.Element {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'textarea-autosize',
    category: 'forms',
    tags: ['textarea', 'autosize', 'grow', 'multiline', 'chat'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-26',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3340, copies: 1021, downloads: 267 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A textarea cannot measure itself while it has a height. The two-line dance in
  resize() is the whole technique and the order is not negotiable:

    1. height = 'auto'   - collapse it so scrollHeight reports the CONTENT
    2. height = scrollHeight - grow the box to exactly that

  Skip step 1 and scrollHeight just reports the current height back at you, and
  the box never shrinks when text is deleted.
-->
<div class="grow-field">
  <label class="grow-field__label" for="grow-field-note">Message</label>
  <textarea
    class="grow-field__input"
    id="grow-field-note"
    name="note"
    rows="1"
    placeholder="Write a message…"
    aria-describedby="grow-field-note-help"
  ></textarea>
  <p class="grow-field__help" id="grow-field-note-help">The box grows as you type.</p>
</div>

<script>
  document.querySelectorAll('.grow-field__input').forEach(function (el) {
    function resize() {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }

    el.addEventListener('input', resize);
    // Run once on load - the field may be server-rendered with a value already
    // in it, and a pre-filled box that starts at one row defeats the point.
    resize();
  });
</script>`,
      css: `.grow-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.grow-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.grow-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-family: inherit;
  /* Both are required. resize: none because the box sizes itself - a drag
     handle would fight the script. overflow-y: hidden because the height always
     equals the content, so a scrollbar would only ever be a phantom that
     steals horizontal space. */
  resize: none;
  overflow-y: hidden;
}

.grow-field__input::placeholder {
  color: #6b7280;
}

.grow-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.grow-field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.grow-field__help {
  margin: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .grow-field__label {
    color: #f3f4f6;
  }

  .grow-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .grow-field__input::placeholder {
    color: #9ca3af;
  }

  .grow-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .grow-field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .grow-field__help {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="grow-field-note">
    Message
  </label>
  <textarea
    id="grow-field-note"
    name="note"
    rows="1"
    placeholder="Write a message…"
    aria-describedby="grow-field-note-help"
    oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
    class="w-full resize-none overflow-y-hidden rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
  ></textarea>
  <p id="grow-field-note-help" class="text-xs text-gray-600 dark:text-gray-400">
    The box grows as you type.
  </p>
</div>`,
      react: `import { useEffect, useId, useLayoutEffect, useRef } from 'react';

export function TextareaAutosize({ label, helperText, value, onChange, ...props }) {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const ref = useRef(null);

  // useLayoutEffect, not useEffect: the resize must land before paint or the
  // box visibly snaps from one row to its real height on every keystroke.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = \`\${el.scrollHeight}px\`;
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        onChange={onChange}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-none overflow-y-hidden rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      {helperText && (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useLayoutEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaAutosizeProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'rows' | 'value'> {
  label: string;
  helperText?: string;
  value: string;
}

// 'use client' - this one genuinely needs the DOM: it measures scrollHeight in
// a layout effect, which has no server equivalent.
export function TextareaAutosize({
  label,
  helperText,
  value,
  onChange,
  ...props
}: TextareaAutosizeProps) {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = \`\${el.scrollHeight}px\`;
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        onChange={onChange}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-none overflow-y-hidden rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId, useLayoutEffect, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * \`rows\` is omitted - the component pins it to 1 and lets the measured height
 * take over, so a caller-supplied rows would only ever be overwritten one frame
 * later. \`value\` is required and narrowed to \`string\`: the effect keys off it,
 * and an uncontrolled autosize textarea would stop resizing the moment React
 * stopped re-rendering it.
 */
export interface TextareaAutosizeProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'rows' | 'value'> {
  label: string;
  helperText?: string;
  value: string;
}

export function TextareaAutosize({
  label,
  helperText,
  value,
  onChange,
  ...props
}: TextareaAutosizeProps): JSX.Element {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Collapse first so scrollHeight reports the content, not the box.
    el.style.height = 'auto';
    el.style.height = \`\${el.scrollHeight}px\`;
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={ref}
        id={id}
        rows={1}
        value={value}
        onChange={onChange}
        aria-describedby={helperText ? helpId : undefined}
        className="w-full resize-none overflow-y-hidden rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'textarea-with-counter',
    category: 'forms',
    tags: ['textarea', 'counter', 'maxlength', 'limit', 'aria-live'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2930, copies: 776, downloads: 188 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'count', type: 'number', descriptionKey: 'count' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Two things worth stealing here:

  1. aria-live="polite" on the counter, NOT on every keystroke. A live region
     that fires per character is a machine gun. It only speaks inside the last
     20 characters - the point where the number stops being trivia and starts
     being a warning.

  2. The counter is inside aria-describedby, so a screen reader user is told the
     limit exists when they ENTER the field, not when they hit it.
-->
<div class="count-field">
  <label class="count-field__label" for="count-field-bio">Short bio</label>
  <textarea
    class="count-field__input"
    id="count-field-bio"
    name="bio"
    rows="4"
    maxlength="180"
    placeholder="Tell us what you work on."
    aria-describedby="count-field-bio-count"
  ></textarea>
  <p class="count-field__count" id="count-field-bio-count" aria-live="polite">
    <span class="count-field__used">0</span> of 180 characters used
  </p>
</div>

<script>
  document.querySelectorAll('.count-field').forEach(function (root) {
    var input = root.querySelector('.count-field__input');
    var readout = root.querySelector('.count-field__count');
    var used = root.querySelector('.count-field__used');
    var max = Number(input.getAttribute('maxlength'));
    var WARN_AT = 20;

    function sync() {
      var length = input.value.length;
      used.textContent = String(length);

      var remaining = max - length;
      root.classList.toggle('count-field--warn', remaining <= WARN_AT);

      // Silent until the number matters, then polite. Never assertive: this is
      // information, not an interruption.
      readout.setAttribute('aria-live', remaining <= WARN_AT ? 'polite' : 'off');
    }

    input.addEventListener('input', sync);
    sync();
  });
</script>`,
      css: `.count-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.count-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.count-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-family: inherit;
  resize: vertical;
}

.count-field__input::placeholder {
  color: #6b7280;
}

.count-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.count-field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.count-field__count {
  margin: 0;
  align-self: flex-end;
  font-size: 0.75rem;
  color: #4b5563;
  /* Without this the readout jitters horizontally as the digits change - a
     small thing that makes a form feel broken. */
  font-variant-numeric: tabular-nums;
}

/* The warning is a colour AND a weight change. Colour alone would be the only
   signal for a red-blind user, which is no signal. */
.count-field--warn .count-field__count {
  color: #b45309;
  font-weight: 600;
}

.count-field--warn .count-field__input {
  border-color: #b45309;
}

@media (prefers-color-scheme: dark) {
  .count-field__label {
    color: #f3f4f6;
  }

  .count-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .count-field__input::placeholder {
    color: #9ca3af;
  }

  .count-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .count-field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .count-field__count {
    color: #9ca3af;
  }

  /* #b45309 is 2.6:1 on #111827; #fbbf24 is 9.6:1. The amber has to invert. */
  .count-field--warn .count-field__count {
    color: #fbbf24;
  }

  .count-field--warn .count-field__input {
    border-color: #f59e0b;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5" data-warn="false">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="count-field-bio">
    Short bio
  </label>
  <textarea
    id="count-field-bio"
    name="bio"
    rows="4"
    maxlength="180"
    placeholder="Tell us what you work on."
    aria-describedby="count-field-bio-count"
    class="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400"
  ></textarea>
  <p
    id="count-field-bio-count"
    aria-live="off"
    class="self-end text-xs tabular-nums text-gray-600 dark:text-gray-400"
  >
    <span data-used>0</span> of 180 characters used
  </p>
</div>

<script>
  document.querySelectorAll('[data-warn]').forEach(function (root) {
    var input = root.querySelector('textarea');
    var readout = root.querySelector('[aria-live]');
    var used = root.querySelector('[data-used]');
    var max = Number(input.getAttribute('maxlength'));

    input.addEventListener('input', function () {
      var remaining = max - input.value.length;
      var warn = remaining <= 20;
      used.textContent = String(input.value.length);
      readout.setAttribute('aria-live', warn ? 'polite' : 'off');
      readout.className = warn
        ? 'self-end text-xs font-semibold tabular-nums text-amber-700 dark:text-amber-400'
        : 'self-end text-xs tabular-nums text-gray-600 dark:text-gray-400';
      input.classList.toggle('border-amber-700', warn);
      input.classList.toggle('dark:border-amber-500', warn);
    });
  });
</script>`,
      react: `import { useId } from 'react';

const WARN_AT = 20;

export function TextareaWithCounter({ label, value, onChange, maxLength = 180, ...props }) {
  const id = useId();
  const countId = \`\${id}-count\`;
  const remaining = maxLength - value.length;
  const warn = remaining <= WARN_AT;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        // The counter is in describedby, so the limit is announced on ENTRY -
        // not discovered by hitting it.
        aria-describedby={countId}
        className={\`w-full resize-y rounded-lg border bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 \${
          warn
            ? 'border-amber-700 focus-visible:border-amber-700 focus-visible:ring-amber-700 dark:border-amber-500 dark:focus-visible:ring-amber-500'
            : 'border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400'
        }\`}
        {...props}
      />
      <p
        id={countId}
        // Silent until it matters. A live region that fires on every keystroke
        // is unusable.
        aria-live={warn ? 'polite' : 'off'}
        className={\`self-end text-xs tabular-nums \${
          warn ? 'font-semibold text-amber-700 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'
        }\`}
      >
        {value.length} of {maxLength} characters used
      </p>
    </div>
  );
}`,
      nextjs: `'use client';

import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaWithCounterProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value'> {
  label: string;
  value: string;
  maxLength?: number;
}

const WARN_AT = 20;

// 'use client' - the counter reads \`value\` on every change.
export function TextareaWithCounter({
  label,
  value,
  onChange,
  maxLength = 180,
  ...props
}: TextareaWithCounterProps) {
  const id = useId();
  const countId = \`\${id}-count\`;
  const remaining = maxLength - value.length;
  const warn = remaining <= WARN_AT;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        aria-describedby={countId}
        className={\`w-full resize-y rounded-lg border bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 \${
          warn
            ? 'border-amber-700 focus-visible:border-amber-700 focus-visible:ring-amber-700 dark:border-amber-500 dark:focus-visible:ring-amber-500'
            : 'border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400'
        }\`}
        {...props}
      />
      <p
        id={countId}
        aria-live={warn ? 'polite' : 'off'}
        className={\`self-end text-xs tabular-nums \${
          warn
            ? 'font-semibold text-amber-700 dark:text-amber-400'
            : 'text-gray-600 dark:text-gray-400'
        }\`}
      >
        {value.length} of {maxLength} characters used
      </p>
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * \`value\` is required and narrowed to \`string\` - the counter is derived from
 * \`value.length\`, so an uncontrolled textarea would render a count stuck at 0
 * while the user typed into it.
 */
export interface TextareaWithCounterProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value'> {
  label: string;
  value: string;
  /** Hard cap, enforced by the native attribute as well as the readout. */
  maxLength?: number;
}

/** Characters remaining at which the counter starts warning - and speaking. */
const WARN_AT = 20;

export function TextareaWithCounter({
  label,
  value,
  onChange,
  maxLength = 180,
  ...props
}: TextareaWithCounterProps): JSX.Element {
  const id = useId();
  const countId = \`\${id}-count\`;
  const remaining = maxLength - value.length;
  const warn = remaining <= WARN_AT;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        aria-describedby={countId}
        className={\`w-full resize-y rounded-lg border bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 \${
          warn
            ? 'border-amber-700 focus-visible:border-amber-700 focus-visible:ring-amber-700 dark:border-amber-500 dark:focus-visible:ring-amber-500'
            : 'border-gray-300 focus-visible:border-blue-600 focus-visible:ring-blue-600 dark:border-gray-700 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400'
        }\`}
        {...props}
      />
      <p
        id={countId}
        aria-live={warn ? 'polite' : 'off'}
        className={\`self-end text-xs tabular-nums \${
          warn
            ? 'font-semibold text-amber-700 dark:text-amber-400'
            : 'text-gray-600 dark:text-gray-400'
        }\`}
      >
        {value.length} of {maxLength} characters used
      </p>
    </div>
  );
}`,
    },
  },
  {
    slug: 'textarea-with-toolbar',
    category: 'forms',
    tags: ['textarea', 'toolbar', 'markdown', 'editor', 'formatting'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1420, copies: 361, downloads: 94 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', required: true, descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A markdown toolbar, not a rich-text editor: every button wraps the selection
  in plain syntax the textarea can hold. That is a deliberate ceiling - the
  moment you want real bold you need contenteditable, and you have signed up for
  a different component entirely.

  Three details that make it a toolbar rather than three loose buttons:
  - role="toolbar" + aria-controls, so it announces as belonging to the field
  - each button has an aria-label; the glyphs are aria-hidden
  - setSelectionRange after the edit, so focus lands back where you were typing
    with the wrapped text still selected
-->
<div class="tb-field">
  <label class="tb-field__label" for="tb-field-body">Description</label>
  <div class="tb-field__box">
    <div class="tb-field__toolbar" role="toolbar" aria-label="Formatting" aria-controls="tb-field-body">
      <button class="tb-field__btn" type="button" data-wrap="**" aria-label="Bold">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />
        </svg>
      </button>
      <button class="tb-field__btn" type="button" data-wrap="_" aria-label="Italic">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M19 4h-9M14 20H5M15 4 9 20" />
        </svg>
      </button>
      <button class="tb-field__btn" type="button" data-link aria-label="Insert link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
      </button>
    </div>
    <textarea
      class="tb-field__input"
      id="tb-field-body"
      name="body"
      rows="5"
      placeholder="Markdown is supported."
      aria-describedby="tb-field-body-help"
    ></textarea>
  </div>
  <p class="tb-field__help" id="tb-field-body-help">Select text, then choose a format.</p>
</div>

<script>
  document.querySelectorAll('.tb-field').forEach(function (root) {
    var input = root.querySelector('.tb-field__input');

    function surround(before, after) {
      var start = input.selectionStart;
      var end = input.selectionEnd;
      var selected = input.value.slice(start, end);

      input.value =
        input.value.slice(0, start) + before + selected + after + input.value.slice(end);

      // Focus first: setSelectionRange on an unfocused textarea is a no-op in
      // some browsers, and the caret would land at the end.
      input.focus();
      input.setSelectionRange(start + before.length, start + before.length + selected.length);
    }

    root.querySelectorAll('.tb-field__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.getAttribute('data-wrap');
        if (wrap) surround(wrap, wrap);
        else surround('[', '](https://)');
      });
    });
  });
</script>`,
      css: `.tb-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.tb-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

/*
 * Toolbar and textarea share one border and one focus ring, because they are
 * one control as far as the user is concerned.
 */
.tb-field__box {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  overflow: hidden;
}

.tb-field__box:focus-within {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

.tb-field__toolbar {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.25rem;
  border-bottom: 1px solid #e5e7eb;
  background-color: #f9fafb;
}

.tb-field__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  padding: 0;
  border: 0;
  border-radius: 0.25rem;
  background-color: transparent;
  color: #4b5563;
  cursor: pointer;
}

.tb-field__btn svg {
  width: 0.875rem;
  height: 0.875rem;
}

.tb-field__btn:hover {
  background-color: #e5e7eb;
  color: #111827;
}

.tb-field__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -1px;
}

/* Borderless: the box drew it. No focus ring either - focus-within on the box
   is the ring, and a second one inside would double up. */
.tb-field__input {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  background-color: transparent;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-family: inherit;
  resize: vertical;
}

.tb-field__input::placeholder {
  color: #6b7280;
}

.tb-field__input:focus {
  outline: none;
}

.tb-field__help {
  margin: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .tb-field__label {
    color: #f3f4f6;
  }

  .tb-field__box {
    border-color: #374151;
    background-color: #111827;
  }

  .tb-field__box:focus-within {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .tb-field__toolbar {
    border-bottom-color: #374151;
    background-color: #1f2937;
  }

  .tb-field__btn {
    color: #9ca3af;
  }

  .tb-field__btn:hover {
    background-color: #374151;
    color: #f3f4f6;
  }

  .tb-field__btn:focus-visible {
    outline-color: #60a5fa;
  }

  .tb-field__input {
    color: #f3f4f6;
  }

  .tb-field__input::placeholder {
    color: #9ca3af;
  }

  .tb-field__help {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="tb-field-body">
    Description
  </label>
  <div class="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
    <div
      role="toolbar"
      aria-label="Formatting"
      aria-controls="tb-field-body"
      class="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
    >
      <button type="button" data-wrap="**" aria-label="Bold" class="inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400">
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z" />
        </svg>
      </button>
      <button type="button" data-wrap="_" aria-label="Italic" class="inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400">
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M19 4h-9M14 20H5M15 4 9 20" />
        </svg>
      </button>
      <button type="button" data-link aria-label="Insert link" class="inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400">
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
          <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
          <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
        </svg>
      </button>
    </div>
    <textarea
      id="tb-field-body"
      name="body"
      rows="5"
      placeholder="Markdown is supported."
      aria-describedby="tb-field-body-help"
      class="block w-full resize-y border-0 bg-transparent px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
    ></textarea>
  </div>
  <p id="tb-field-body-help" class="text-xs text-gray-600 dark:text-gray-400">
    Select text, then choose a format.
  </p>
</div>

<script>
  document.querySelectorAll('[role="toolbar"]').forEach(function (bar) {
    var input = document.getElementById(bar.getAttribute('aria-controls'));

    bar.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrap = btn.getAttribute('data-wrap');
        var before = wrap || '[';
        var after = wrap || '](https://)';
        var start = input.selectionStart;
        var end = input.selectionEnd;
        var selected = input.value.slice(start, end);

        input.value =
          input.value.slice(0, start) + before + selected + after + input.value.slice(end);
        input.focus();
        input.setSelectionRange(start + before.length, start + before.length + selected.length);
      });
    });
  });
</script>`,
      react: `import { useId, useRef } from 'react';

const BTN = 'inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400';

const TOOLS = [
  { id: 'bold', label: 'Bold', before: '**', after: '**', path: 'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z' },
  { id: 'italic', label: 'Italic', before: '_', after: '_', path: 'M19 4h-9M14 20H5M15 4 9 20' },
  { id: 'link', label: 'Insert link', before: '[', after: '](https://)', path: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1' },
];

export function TextareaWithToolbar({ label, helperText, value, onChange, ...props }) {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const ref = useRef(null);

  function surround(before, after) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);
    const next = value.slice(0, start) + before + selected + after + value.slice(end);

    onChange(next);

    // The DOM value updates on the next render, so restore the selection after
    // it - otherwise the caret jumps to the end and typing continues there.
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        <div
          role="toolbar"
          aria-label="Formatting"
          aria-controls={id}
          className="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
        >
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              aria-label={tool.label}
              onClick={() => surround(tool.before, tool.after)}
              className={BTN}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={tool.path} />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={helperText ? helpId : undefined}
          className="block w-full resize-y border-0 bg-transparent px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
      </div>
      {helperText && (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useId, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaWithToolbarProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value' | 'onChange'> {
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
}

const BTN =
  'inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400';

const TOOLS = [
  { id: 'bold', label: 'Bold', before: '**', after: '**', path: 'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z' },
  { id: 'italic', label: 'Italic', before: '_', after: '_', path: 'M19 4h-9M14 20H5M15 4 9 20' },
  { id: 'link', label: 'Insert link', before: '[', after: '](https://)', path: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1' },
] as const;

// 'use client' - the toolbar reads and rewrites the textarea's selection.
export function TextareaWithToolbar({
  label,
  helperText,
  value,
  onChange,
  ...props
}: TextareaWithToolbarProps) {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const ref = useRef<HTMLTextAreaElement>(null);

  function surround(before: string, after: string): void {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);

    onChange(value.slice(0, start) + before + selected + after + value.slice(end));

    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        <div
          role="toolbar"
          aria-label="Formatting"
          aria-controls={id}
          className="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
        >
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              aria-label={tool.label}
              onClick={() => surround(tool.before, tool.after)}
              className={BTN}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={tool.path} />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={helperText ? helpId : undefined}
          className="block w-full resize-y border-0 bg-transparent px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
      </div>
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId, useRef } from 'react';
import type { TextareaHTMLAttributes } from 'react';

/**
 * \`onChange\` is re-declared as \`(value: string) => void\` rather than the DOM
 * event handler: the toolbar produces a new string with no event behind it, so
 * the native signature would be a lie for half the ways this field changes.
 */
export interface TextareaWithToolbarProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'value' | 'onChange'> {
  label: string;
  helperText?: string;
  value: string;
  onChange: (value: string) => void;
}

interface Tool {
  id: string;
  label: string;
  before: string;
  after: string;
  path: string;
}

const BTN =
  'inline-flex h-7 w-7 items-center justify-center rounded text-gray-600 hover:bg-gray-200 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 dark:focus-visible:outline-blue-400';

const TOOLS: Tool[] = [
  { id: 'bold', label: 'Bold', before: '**', after: '**', path: 'M6 4h8a4 4 0 0 1 0 8H6zM6 12h9a4 4 0 0 1 0 8H6z' },
  { id: 'italic', label: 'Italic', before: '_', after: '_', path: 'M19 4h-9M14 20H5M15 4 9 20' },
  { id: 'link', label: 'Insert link', before: '[', after: '](https://)', path: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1' },
];

export function TextareaWithToolbar({
  label,
  helperText,
  value,
  onChange,
  ...props
}: TextareaWithToolbarProps): JSX.Element {
  const id = useId();
  const helpId = \`\${id}-help\`;
  const ref = useRef<HTMLTextAreaElement>(null);

  function surround(before: string, after: string): void {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);

    onChange(value.slice(0, start) + before + selected + after + value.slice(end));

    // Restore focus and selection after React has written the new value.
    window.requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-blue-600 focus-within:outline focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:focus-within:border-blue-400 dark:focus-within:outline-blue-400">
        <div
          role="toolbar"
          aria-label="Formatting"
          aria-controls={id}
          className="flex items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800"
        >
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              type="button"
              aria-label={tool.label}
              onClick={() => surround(tool.before, tool.after)}
              className={BTN}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d={tool.path} />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={helperText ? helpId : undefined}
          className="block w-full resize-y border-0 bg-transparent px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400"
          {...props}
        />
      </div>
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'textarea-resizable',
    category: 'forms',
    tags: ['textarea', 'resize', 'handle', 'multiline', 'form'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-08',
    updatedAt: '2026-07-04',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1560, copies: 412, downloads: 103 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The opposite trade to the autosize field: the user drags, not the script. The
  browser's own handle does the work, so this needs no JavaScript at all - the
  entire component is three CSS properties.

  min-height and max-height are the actual design decisions. resize: vertical
  with no bounds lets someone drag the box to 4px or to 9000, and both are
  layouts you never designed. resize is vertical only, never both: horizontal
  dragging breaks out of the form column and there is no reason to allow it.
-->
<div class="rz-field">
  <label class="rz-field__label" for="rz-field-notes">Release notes</label>
  <textarea
    class="rz-field__input"
    id="rz-field-notes"
    name="notes"
    rows="3"
    placeholder="What changed in this release?"
    aria-describedby="rz-field-notes-help"
  ></textarea>
  <p class="rz-field__help" id="rz-field-notes-help">Drag the corner to resize.</p>
</div>`,
      css: `.rz-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.rz-field__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.rz-field__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-size: 0.875rem;
  line-height: 1.5rem;
  font-family: inherit;

  /* The three lines that are the whole component. */
  resize: vertical;
  min-height: 5rem;
  max-height: 20rem;
}

.rz-field__input::placeholder {
  color: #6b7280;
}

.rz-field__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}

/* A disabled field must not be draggable - resizing something you cannot edit
   is a control that lies about being live. */
.rz-field__input:disabled {
  background-color: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
  resize: none;
}

.rz-field__help {
  margin: 0;
  font-size: 0.75rem;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .rz-field__label {
    color: #f3f4f6;
  }

  .rz-field__input {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .rz-field__input::placeholder {
    color: #9ca3af;
  }

  .rz-field__input:focus-visible {
    outline-color: #60a5fa;
    border-color: #60a5fa;
  }

  .rz-field__input:disabled {
    background-color: #1f2937;
    color: #9ca3af;
  }

  .rz-field__help {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="flex flex-col gap-1.5">
  <label class="text-sm font-medium text-gray-900 dark:text-gray-100" for="rz-field-notes">
    Release notes
  </label>
  <textarea
    id="rz-field-notes"
    name="notes"
    rows="3"
    placeholder="What changed in this release?"
    aria-describedby="rz-field-notes-help"
    class="max-h-80 min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
  ></textarea>
  <p id="rz-field-notes-help" class="text-xs text-gray-600 dark:text-gray-400">
    Drag the corner to resize.
  </p>
</div>`,
      react: `import { useId } from 'react';

export function TextareaResizable({ label, helperText, className = '', ...props }) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      {/* resize-y, never resize (both): horizontal dragging escapes the form
          column. min-h/max-h bound what the user can do to your layout. */}
      <textarea
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="max-h-80 min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText && (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}`,
      nextjs: `import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaResizableProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
}

// No 'use client' - the resize handle is the browser's, driven by CSS. There is
// no JavaScript in this component at all.
export function TextareaResizable({
  label,
  helperText,
  className = '',
  ...props
}: TextareaResizableProps) {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="max-h-80 min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface TextareaResizableProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  helperText?: string;
}

export function TextareaResizable({
  label,
  helperText,
  className = '',
  ...props
}: TextareaResizableProps): JSX.Element {
  const id = useId();
  const helpId = \`\${id}-help\`;

  return (
    <div className={\`flex flex-col gap-1.5 \${className}\`}>
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        aria-describedby={helperText ? helpId : undefined}
        className="max-h-80 min-h-20 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 font-sans text-sm text-gray-900 placeholder-gray-500 focus-visible:border-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:resize-none disabled:bg-gray-100 disabled:text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 dark:focus-visible:border-blue-400 dark:focus-visible:ring-blue-400 dark:disabled:bg-gray-800 dark:disabled:text-gray-400"
        {...props}
      />
      {helperText ? (
        <p id={helpId} className="text-xs text-gray-600 dark:text-gray-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}`,
    },
  },
];
