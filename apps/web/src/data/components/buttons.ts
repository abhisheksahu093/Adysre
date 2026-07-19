import type { ComponentEntry } from './types';

/**
 * Buttons category.
 *
 * `code` carries all six framework variants per the spec. Note how little the
 * html/css/tailwind trio actually differ - `css` is the same markup with a
 * stylesheet instead of utilities - which is why the schema allows a partial
 * set rather than forcing six near-duplicates for every future entry.
 */
export const buttonComponents: ComponentEntry[] = [
  {
    slug: 'gradient-glow-button',
    category: 'buttons',
    tags: ['gradient', 'glow', 'hover', 'cta', 'animated'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-10',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1240, copies: 318, downloads: 96 },
    variants: [
      { id: 'primary', labelKey: 'primary' },
      { id: 'glow', labelKey: 'glow' },
      { id: 'gradient', labelKey: 'gradient' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<button class="glow-btn" type="button">
  Get started
</button>`,
      css: `.glow-btn {
  padding: 0.625rem 1.25rem;
  border: 0;
  border-radius: 0.5rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  background-image: linear-gradient(to right, #2563eb, #6366f1);
  box-shadow: 0 10px 30px -10px rgba(37, 99, 235, 0.7);
  transition: box-shadow 200ms, transform 200ms;
}

.glow-btn:hover {
  box-shadow: 0 14px 40px -8px rgba(37, 99, 235, 0.9);
  transform: translateY(-1px);
}

.glow-btn:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The gradient and its white label carry their own contrast on either
 * background, so only the focus ring is lifted for dark surfaces.
 */
@media (prefers-color-scheme: dark) {
  .glow-btn:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<button
  type="button"
  class="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)] transition hover:-translate-y-px hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  Get started
</button>`,
      react: `export function GradientGlowButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)] transition hover:-translate-y-px hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      nextjs: `'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface GradientGlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GradientGlowButton({ children, ...props }: GradientGlowButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)] transition hover:-translate-y-px hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface GradientGlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GradientGlowButton({
  children,
  ...props
}: GradientGlowButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 px-5 py-2.5 font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)] transition hover:-translate-y-px hover:shadow-[0_14px_40px_-8px_rgba(37,99,235,0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
    },
  },
  {
    slug: 'loading-button',
    category: 'buttons',
    tags: ['loading', 'spinner', 'async', 'form', 'state'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-28',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 890, copies: 244, downloads: 61 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'loading', labelKey: 'loading' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'loading', type: 'boolean', default: 'false', descriptionKey: 'loading' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<button class="load-btn" type="button" aria-busy="true" disabled>
  <span class="load-btn__spinner" aria-hidden="true"></span>
  Saving…
</button>`,
      css: `/*
 * No dark-mode block here: the button paints its own surface (#2563eb) and its
 * white label clears AA against it on any page background, so there is nothing
 * that inherits the theme. The Tailwind tabs are the same - no dark: variants
 * because none are needed.
 */
.load-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background: #2563eb;
  color: #fff;
  font-weight: 500;
}

.load-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.load-btn__spinner {
  width: 0.875rem;
  height: 0.875rem;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: load-btn-spin 700ms linear infinite;
}

@keyframes load-btn-spin {
  to { transform: rotate(360deg); }
}

/* Respect users who ask for less motion. */
@media (prefers-reduced-motion: reduce) {
  .load-btn__spinner { animation-duration: 2s; }
}`,
      tailwind: `<button
  type="button"
  aria-busy="true"
  disabled
  class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
>
  <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true"></span>
  Saving…
</button>`,
      react: `export function LoadingButton({ loading = false, children, ...props }) {
  return (
    <button
      type="button"
      aria-busy={loading}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}`,
      nextjs: `'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export function LoadingButton({ loading = false, children, ...props }: LoadingButtonProps) {
  return (
    <button
      type="button"
      // aria-busy tells a screen reader work is in flight; the spinner is
      // decorative and must stay hidden from it.
      aria-busy={loading}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

export function LoadingButton({
  loading = false,
  children,
  ...props
}: LoadingButtonProps): JSX.Element {
  return (
    <button
      type="button"
      aria-busy={loading}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {loading ? (
        <span
          className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}`,
    },
  },
  {
    slug: 'outline-button',
    category: 'buttons',
    tags: ['outline', 'secondary', 'bordered', 'hover', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-08',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 2130, copies: 604, downloads: 152 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<button class="outline-btn" type="button">
  Learn more
</button>`,
      css: `.outline-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #2563eb;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #1d4ed8;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.outline-btn:hover {
  background-color: #2563eb;
  color: #fff;
}

.outline-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.outline-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

/*
 * Unlike a filled button, the resting state is transparent - the label sits on
 * whatever the page background is, so both the border and the text have to be
 * re-tuned for dark surfaces to keep 4.5:1. The hover fill paints its own
 * background and needs no such treatment.
 */
@media (prefers-color-scheme: dark) {
  .outline-btn {
    border-color: #60a5fa;
    color: #93c5fd;
  }

  .outline-btn:hover {
    color: #fff;
  }

  .outline-btn:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .outline-btn {
    transition: none;
  }
}`,
      tailwind: `<button
  type="button"
  class="rounded-lg border border-blue-600 bg-transparent px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  Learn more
</button>`,
      react: `export function OutlineButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

// No 'use client' - this button holds no state; hover and focus are pure CSS,
// so it renders fine as a Server Component.
export function OutlineButton({ children, ...props }: OutlineButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function OutlineButton({ children, ...props }: OutlineButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="rounded-lg border border-blue-600 bg-transparent px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
    },
  },
  {
    slug: 'ghost-button',
    category: 'buttons',
    tags: ['ghost', 'subtle', 'tertiary', 'toolbar', 'minimal'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-22',
    updatedAt: '2026-06-18',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1680, copies: 471, downloads: 108 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'text', labelKey: 'text' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<button class="ghost-btn" type="button">
  Cancel
</button>`,
      css: `.ghost-btn {
  padding: 0.5rem 0.875rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.ghost-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.ghost-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.ghost-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

/*
 * A ghost button is nothing but text until it is hovered, so the label colour
 * is the entire component - it must be inverted for dark surfaces or it
 * disappears. The transparent border is kept at rest so the box does not shift
 * by 2px when a bordered sibling sits next to it.
 */
@media (prefers-color-scheme: dark) {
  .ghost-btn {
    color: #d1d5db;
  }

  .ghost-btn:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .ghost-btn:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ghost-btn {
    transition: none;
  }
}`,
      tailwind: `<button
  type="button"
  class="rounded-lg border border-transparent bg-transparent px-3.5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  Cancel
</button>`,
      react: `export function GhostButton({ children, ...props }) {
  return (
    <button
      type="button"
      className="rounded-lg border border-transparent bg-transparent px-3.5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

// Stateless - no 'use client' needed.
export function GhostButton({ children, ...props }: GhostButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg border border-transparent bg-transparent px-3.5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GhostButton({ children, ...props }: GhostButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="rounded-lg border border-transparent bg-transparent px-3.5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
    },
  },
  {
    slug: 'icon-button',
    category: 'buttons',
    tags: ['icon', 'square', 'accessibility', 'aria-label', 'toolbar'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-06',
    updatedAt: '2026-07-02',
    license: 'MIT',
    version: '1.3.0',
    stats: { views: 2440, copies: 712, downloads: 190 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'ariaLabel' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  An icon-only button has no text node, so without aria-label a screen reader
  announces nothing but "button". The label is not optional decoration - it is
  the button's entire accessible name. The svg is aria-hidden so it cannot
  compete with it.
-->
<button class="icon-btn" type="button" aria-label="Add to favourites">
  <svg class="icon-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12c-1.8 4.4-9.3 9-9.3 9Z" />
  </svg>
</button>`,
      css: `.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Square by construction, and 2.5rem clears the 24x24 minimum target size. */
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #374151;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.icon-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.icon-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.icon-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

.icon-btn__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* The glyph is drawn with currentColor, so recolouring the text recolours it. */
@media (prefers-color-scheme: dark) {
  .icon-btn {
    border-color: #374151;
    color: #d1d5db;
  }

  .icon-btn:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .icon-btn:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .icon-btn {
    transition: none;
  }
}`,
      tailwind: `<button
  type="button"
  aria-label="Add to favourites"
  class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12c-1.8 4.4-9.3 9-9.3 9Z" />
  </svg>
</button>`,
      react: `export function IconButton({ label, children, ...props }) {
  return (
    <button
      type="button"
      // Required, not optional: this is the button's only accessible name.
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}

// Usage - the icon is passed as children and hidden from assistive tech.
export function FavouriteButton() {
  return (
    <IconButton label="Add to favourites">
      <svg
        className="h-5 w-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 21s-7.5-4.6-9.3-9A5.2 5.2 0 0 1 12 6.6 5.2 5.2 0 0 1 21.3 12c-1.8 4.4-9.3 9-9.3 9Z" />
      </svg>
    </IconButton>
  );
}`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** The accessible name. Required - an icon alone announces as "button". */
  label: string;
  children: ReactNode;
}

// Stateless - no 'use client' needed.
export function IconButton({ label, children, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * \`aria-label\` is omitted from the inherited attributes and re-declared as a
 * required \`label\`, so the type system refuses an icon button with no
 * accessible name instead of leaving it to a review to catch.
 */
export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, children, ...props }: IconButtonProps): JSX.Element {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {children}
    </button>
  );
}`,
    },
  },
  {
    slug: 'pill-button',
    category: 'buttons',
    tags: ['pill', 'rounded', 'badge', 'count', 'notification'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-19',
    updatedAt: '2026-06-24',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1120, copies: 289, downloads: 74 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'count', type: 'number', required: true, descriptionKey: 'count', example: '12' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<!--
  The count is a real text node inside the button, not an aria-hidden
  decoration, so the accessible name reads "12 Notifications" - which is the
  information a badge is there to convey in the first place.
-->
<button class="pill-btn" type="button">
  <span class="pill-btn__count">12</span>
  Notifications
</button>`,
      css: `.pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  /* Larger than any plausible height, which is what makes the ends true
     semicircles at every size rather than a guessed radius. */
  border-radius: 9999px;
  padding: 0.5rem 1rem 0.5rem 0.5rem;
  border: 0;
  background-color: #111827;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms;
}

.pill-btn:hover {
  background-color: #1f2937;
}

.pill-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pill-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

.pill-btn__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 0.375rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

/*
 * The pill paints its own surface, so it inverts wholesale in dark mode rather
 * than re-tuning a label: near-black on light, near-white on dark, with the
 * badge tint flipped to match.
 */
@media (prefers-color-scheme: dark) {
  .pill-btn {
    background-color: #f3f4f6;
    color: #111827;
  }

  .pill-btn:hover {
    background-color: #e5e7eb;
  }

  .pill-btn__count {
    background-color: rgba(17, 24, 39, 0.12);
  }

  .pill-btn:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pill-btn {
    transition: none;
  }
}`,
      tailwind: `<button
  type="button"
  class="inline-flex items-center gap-2 rounded-full bg-gray-900 py-2 pl-2 pr-4 font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums dark:bg-gray-900/10">
    12
  </span>
  Notifications
</button>`,
      react: `export function PillButton({ count, children, ...props }) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-gray-900 py-2 pl-2 pr-4 font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums dark:bg-gray-900/10">
        {count > 99 ? '99+' : count}
      </span>
      {children}
    </button>
  );
}`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  count: number;
  children: ReactNode;
}

// Stateless - no 'use client' needed. Drive \`count\` from the parent.
export function PillButton({ count, children, ...props }: PillButtonProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-gray-900 py-2 pl-2 pr-4 font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums dark:bg-gray-900/10">
        {count > 99 ? '99+' : count}
      </span>
      {children}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Rendered in the leading badge. Anything over 99 collapses to "99+". */
  count: number;
  children: ReactNode;
}

export function PillButton({ count, children, ...props }: PillButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-full bg-gray-900 py-2 pl-2 pr-4 font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold tabular-nums dark:bg-gray-900/10">
        {count > 99 ? '99+' : count}
      </span>
      {children}
    </button>
  );
}`,
    },
  },
  {
    slug: 'split-button',
    category: 'buttons',
    tags: ['split', 'dropdown', 'menu', 'keyboard', 'aria'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-02',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 760, copies: 173, downloads: 52 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Two buttons, one visual unit. The default action is a plain button - it must
  stay one tab stop and one Enter away. The toggle is a separate button with its
  own accessible name, because "Save" and "more Save options" are two different
  actions and a screen reader has to be able to tell them apart.
-->
<div class="split-btn">
  <button class="split-btn__action" type="button">Save</button>
  <button
    class="split-btn__toggle"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="split-btn-menu"
    aria-label="More save options"
  >
    <svg class="split-btn__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
  <ul class="split-btn__menu" id="split-btn-menu" role="menu" hidden>
    <li role="none"><button class="split-btn__item" type="button" role="menuitem">Save and duplicate</button></li>
    <li role="none"><button class="split-btn__item" type="button" role="menuitem">Save as template</button></li>
    <li role="none"><button class="split-btn__item" type="button" role="menuitem">Save and close</button></li>
  </ul>
</div>

<script>
  document.querySelectorAll('.split-btn').forEach(function (root) {
    var toggle = root.querySelector('.split-btn__toggle');
    var menu = root.querySelector('.split-btn__menu');
    var items = Array.prototype.slice.call(root.querySelectorAll('.split-btn__item'));

    function setOpen(open) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
      if (!open && items[0]) items[0].focus();
    });

    // Arrow keys move between items, Escape closes and returns focus to the
    // toggle - without this the menu is a mouse-only control.
    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggle.focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      var index = items.indexOf(document.activeElement);
      if (index === -1) return;
      event.preventDefault();
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      items[(next + items.length) % items.length].focus();
    });

    // Clicking away closes it, matching every native menu on the platform.
    document.addEventListener('click', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.split-btn {
  position: relative;
  display: inline-flex;
}

.split-btn__action,
.split-btn__toggle {
  border: 0;
  background-color: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.split-btn__action {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem 0 0 0.5rem;
}

/* A hairline seam so the two halves read as separate targets, not one button. */
.split-btn__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  border-radius: 0 0.5rem 0.5rem 0;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
}

.split-btn__action:hover,
.split-btn__toggle:hover {
  background-color: #1d4ed8;
}

.split-btn__action:focus-visible,
.split-btn__toggle:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  /* Lift the focused half above its sibling so the ring is never clipped. */
  z-index: 1;
}

.split-btn__chevron {
  width: 1rem;
  height: 1rem;
}

.split-btn__menu {
  position: absolute;
  top: calc(100% + 0.375rem);
  right: 0;
  z-index: 10;
  min-width: 12rem;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.split-btn__item {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  text-align: left;
  font-size: 0.875rem;
  cursor: pointer;
}

.split-btn__item:hover,
.split-btn__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

/*
 * The two halves paint themselves, but the popup is a surface of its own - it
 * needs a full dark treatment or it stays a white card on a dark page.
 */
@media (prefers-color-scheme: dark) {
  .split-btn__menu {
    border-color: #374151;
    background-color: #111827;
  }

  .split-btn__item {
    color: #d1d5db;
  }

  .split-btn__item:hover,
  .split-btn__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .split-btn__action:focus-visible,
  .split-btn__toggle:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .split-btn__action,
  .split-btn__toggle {
    transition: none;
  }
}`,
      tailwind: `<div class="relative inline-flex">
  <button
    type="button"
    class="rounded-l-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Save
  </button>
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="split-btn-menu"
    aria-label="More save options"
    class="inline-flex w-9 items-center justify-center rounded-r-lg border-l border-white/30 bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>
  <ul
    id="split-btn-menu"
    role="menu"
    class="absolute right-0 top-[calc(100%+0.375rem)] z-10 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Save and duplicate
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Save as template
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800">
        Save and close
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useRef, useState } from 'react';

const MENU_ITEMS = ['Save and duplicate', 'Save as template', 'Save and close'];

export function SplitButton({ children, onClick, onSelect, disabled = false }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const toggleRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = MENU_ITEMS.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-flex" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-l-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More save options"
        disabled={disabled}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex w-9 items-center justify-center rounded-r-lg border-l border-white/30 bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-10 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {MENU_ITEMS.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface SplitButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onSelect?: (item: string) => void;
  disabled?: boolean;
}

const MENU_ITEMS = ['Save and duplicate', 'Save as template', 'Save and close'];

// 'use client' - the open/closed state and the focus management both need the
// browser.
export function SplitButton({ children, onClick, onSelect, disabled = false }: SplitButtonProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number) {
    const count = MENU_ITEMS.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-flex" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-l-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More save options"
        disabled={disabled}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex w-9 items-center justify-center rounded-r-lg border-l border-white/30 bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-10 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {MENU_ITEMS.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface SplitButtonProps {
  /** Label for the default action - the left half. */
  children: ReactNode;
  /** Fired by the default action. */
  onClick?: () => void;
  /** Fired with the chosen menu item. */
  onSelect?: (item: string) => void;
  disabled?: boolean;
}

const MENU_ITEMS: readonly string[] = [
  'Save and duplicate',
  'Save as template',
  'Save and close',
];

export function SplitButton({
  children,
  onClick,
  onSelect,
  disabled = false,
}: SplitButtonProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // Close on a click outside - the one behaviour every native menu has and
  // every hand-rolled one forgets.
  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = MENU_ITEMS.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      setOpen(false);
      toggleRef.current?.focus();
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (index === -1) return;
    event.preventDefault();
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-flex" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="rounded-l-lg bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <button
        ref={toggleRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More save options"
        disabled={disabled}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="inline-flex w-9 items-center justify-center rounded-r-lg border-l border-white/30 bg-blue-600 text-white transition-colors hover:bg-blue-700 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          role="menu"
          className="absolute right-0 top-[calc(100%+0.375rem)] z-10 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {MENU_ITEMS.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800"
              >
                {item}
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
    slug: 'social-login-button',
    category: 'buttons',
    tags: ['social', 'oauth', 'github', 'login', 'auth'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-08',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1980, copies: 588, downloads: 167 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'icon', type: 'ReactNode', required: true, descriptionKey: 'icon' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<!--
  Full width because it stacks with the email field above it in a sign-in card,
  and a provider row that does not match the form's width reads as an afterthought.
  The brand glyph is aria-hidden - "Continue with GitHub" already names it.
-->
<button class="social-btn" type="button">
  <svg class="social-btn__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
  Continue with GitHub
</button>`,
      css: `.social-btn {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms;
}

.social-btn:hover {
  background-color: #f9fafb;
}

.social-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.social-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

.social-btn__icon {
  width: 1.125rem;
  height: 1.125rem;
  /* Drawn with currentColor, so the mark follows the label into dark mode
     instead of staying a black glyph on a black button. */
  flex-shrink: 0;
}

@media (prefers-color-scheme: dark) {
  .social-btn {
    border-color: #374151;
    background-color: #111827;
    color: #f3f4f6;
  }

  .social-btn:hover {
    background-color: #1f2937;
  }

  .social-btn:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .social-btn {
    transition: none;
  }
}`,
      tailwind: `<button
  type="button"
  class="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  <svg class="h-[1.125rem] w-[1.125rem] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
  Continue with GitHub
</button>`,
      react: `export function SocialLoginButton({ icon, children, ...props }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function GitHubIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

// Usage
// <SocialLoginButton icon={<GitHubIcon />}>Continue with GitHub</SocialLoginButton>`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Brand mark slot. Swap GitHub for Google, Microsoft, etc. */
  icon: ReactNode;
  children: ReactNode;
}

// Stateless - no 'use client'. Wire onClick to your OAuth start route, or drop
// this inside a <form action={signInWithGitHub}> and let it post.
export function SocialLoginButton({ icon, children, ...props }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function GitHubIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Brand mark slot. Draw it with \`fill="currentColor"\` so it follows the theme. */
  icon: ReactNode;
  children: ReactNode;
}

export function SocialLoginButton({
  icon,
  children,
  ...props
}: SocialLoginButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function GitHubIcon(): JSX.Element {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}`,
    },
  },
  {
    slug: 'copy-button',
    category: 'buttons',
    tags: ['copy', 'clipboard', 'feedback', 'aria-live', 'state'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-20',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 3010, copies: 934, downloads: 241 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'default', labelKey: 'default' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'children', type: 'ReactNode', default: "'Copy'", descriptionKey: 'children' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<button class="copy-btn" type="button" data-copy="npm install adysre">
  <svg class="copy-btn__icon" data-icon="copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
  <svg class="copy-btn__icon" data-icon="check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" hidden>
    <path d="m20 6-11 11-5-5" />
  </svg>
  <!-- aria-live makes the swap an announcement, not just a picture change. -->
  <span class="copy-btn__label" aria-live="polite">Copy</span>
</button>

<script>
  document.querySelectorAll('.copy-btn').forEach(function (button) {
    var copyIcon = button.querySelector('[data-icon="copy"]');
    var checkIcon = button.querySelector('[data-icon="check"]');
    var label = button.querySelector('.copy-btn__label');
    var timer;

    function fallbackCopy(text) {
      // navigator.clipboard needs a secure context (https or localhost). On
      // http:// it is simply undefined, so keep the old path alive.
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'absolute';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }

    button.addEventListener('click', async function () {
      var text = button.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        fallbackCopy(text);
      }
      copyIcon.hidden = true;
      checkIcon.hidden = false;
      label.textContent = 'Copied';
      button.dataset.copied = 'true';
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        copyIcon.hidden = false;
        checkIcon.hidden = true;
        label.textContent = 'Copy';
        delete button.dataset.copied;
      }, 2000);
    });
  });
</script>`,
      css: `.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  /* Fixed width so the box does not jump when "Copy" becomes "Copied". */
  min-width: 7rem;
  justify-content: center;
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms, color 150ms;
}

.copy-btn:hover {
  background-color: #f9fafb;
  color: #111827;
}

.copy-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.copy-btn[data-copied='true'] {
  border-color: #15803d;
  color: #15803d;
}

.copy-btn__icon {
  width: 1rem;
  height: 1rem;
}

@media (prefers-color-scheme: dark) {
  .copy-btn {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .copy-btn:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  /*
   * green-700 clears AA on white but not on #111827 - the confirmation colour
   * has to lighten as the surface darkens, not stay put.
   */
  .copy-btn[data-copied='true'] {
    border-color: #4ade80;
    color: #4ade80;
  }

  .copy-btn:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .copy-btn {
    transition: none;
  }
}`,
      tailwind: `<!-- Idle state. The data-copied attribute drives the confirmed styling. -->
<button
  type="button"
  class="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[copied=true]:border-green-700 data-[copied=true]:text-green-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:data-[copied=true]:border-green-400 dark:data-[copied=true]:text-green-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
  <span aria-live="polite">Copy</span>
</button>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function CopyButton({ text, children = 'Copy', ...props }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(undefined);

  // Clear the pending reset on unmount, or React warns about setting state on
  // a component that is already gone.
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // navigator.clipboard is undefined outside a secure context. Fall back
      // to the deprecated-but-universal textarea trick rather than failing.
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'absolute';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied || undefined}
      className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[copied=true]:border-green-700 data-[copied=true]:text-green-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:data-[copied=true]:border-green-400 dark:data-[copied=true]:text-green-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {copied ? (
          <path d="m20 6-11 11-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? 'Copied' : children}</span>
    </button>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The string written to the clipboard. */
  text: string;
  children?: ReactNode;
}

// 'use client' - clipboard access and the 2s reset are both browser-only.
export function CopyButton({ text, children = 'Copy', ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'absolute';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied || undefined}
      className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[copied=true]:border-green-700 data-[copied=true]:text-green-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:data-[copied=true]:border-green-400 dark:data-[copied=true]:text-green-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {copied ? (
          <path d="m20 6-11 11-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      <span aria-live="polite">{copied ? 'Copied' : children}</span>
    </button>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface CopyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The string written to the clipboard. */
  text: string;
  /** Idle label. Defaults to "Copy"; the copied label is always "Copied". */
  children?: ReactNode;
}

export function CopyButton({ text, children = 'Copy', ...props }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  // Cancel the pending reset on unmount so it cannot fire into a dead tree.
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  async function copy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // The Clipboard API requires a secure context and can be blocked by
      // permissions policy. The textarea path is deprecated but works
      // everywhere, so a copy button is never simply dead.
      const area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'absolute';
      area.style.left = '-9999px';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      data-copied={copied || undefined}
      className="inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[copied=true]:border-green-700 data-[copied=true]:text-green-700 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:data-[copied=true]:border-green-400 dark:data-[copied=true]:text-green-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <svg
        className="h-4 w-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        {copied ? (
          <path d="m20 6-11 11-5-5" />
        ) : (
          <>
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </>
        )}
      </svg>
      {/* aria-live announces the swap; without it the change is silent. */}
      <span aria-live="polite">{copied ? 'Copied' : children}</span>
    </button>
  );
}`,
    },
  },
  {
    slug: 'destructive-button',
    category: 'buttons',
    tags: ['destructive', 'danger', 'delete', 'confirm', 'state'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-01',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1450, copies: 402, downloads: 118 },
    variants: [
      { id: 'idle', labelKey: 'idle' },
      { id: 'default', labelKey: 'default' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'onConfirm', type: '() => void', descriptionKey: 'onConfirm' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      html: `<!--
  Colour alone is not a safeguard - red is invisible to a red-blind user and
  means nothing to a screen reader. The confirm step is the actual protection:
  the first click only arms the button, the second one deletes.
-->
<button class="danger-btn" type="button" data-armed="false">
  <span class="danger-btn__label" aria-live="polite">Delete project</span>
</button>

<script>
  document.querySelectorAll('.danger-btn').forEach(function (button) {
    var label = button.querySelector('.danger-btn__label');
    var idle = label.textContent;
    var timer;

    function disarm() {
      button.dataset.armed = 'false';
      label.textContent = idle;
      window.clearTimeout(timer);
    }

    button.addEventListener('click', function () {
      if (button.dataset.armed !== 'true') {
        button.dataset.armed = 'true';
        label.textContent = 'Are you sure?';
        // Disarm on its own so a forgotten armed button is not a landmine for
        // the next person who clicks it.
        timer = window.setTimeout(disarm, 4000);
        return;
      }
      disarm();
      // Real deletion goes here.
      console.log('deleted');
    });

    // Leaving the button is a signal the user changed their mind.
    button.addEventListener('blur', disarm);
  });
</script>`,
      css: `.danger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 9.5rem;
  padding: 0.5rem 1rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: #dc2626;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms;
}

.danger-btn:hover {
  background-color: #b91c1c;
}

/* Armed: darker, so the second click never looks like the first. */
.danger-btn[data-armed='true'] {
  background-color: #991b1b;
}

.danger-btn:focus-visible {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}

.danger-btn:disabled {
  opacity: 0.5;
  pointer-events: none;
}

/*
 * No dark-mode block for the surface: the button paints its own red and the
 * white label clears AA on every step of it (#dc2626 is 4.5:1 against white).
 * Only the focus ring, which sits on the page background, is lifted.
 */
@media (prefers-color-scheme: dark) {
  .danger-btn:focus-visible {
    outline-color: #f87171;
  }
}

@media (prefers-reduced-motion: reduce) {
  .danger-btn {
    transition: none;
  }
}`,
      tailwind: `<!-- Idle. Setting data-armed=true swaps in the darker confirm shade. -->
<button
  type="button"
  class="inline-flex min-w-[9.5rem] items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[armed=true]:bg-red-800 motion-reduce:transition-none dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
>
  <span aria-live="polite">Delete project</span>
</button>`,
      react: `import { useEffect, useRef, useState } from 'react';

export function DestructiveButton({ children, onConfirm, ...props }) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function disarm() {
    setArmed(false);
    window.clearTimeout(timerRef.current);
  }

  function onClick() {
    if (!armed) {
      setArmed(true);
      // Auto-disarm, so an armed button left alone cannot ambush the next click.
      timerRef.current = window.setTimeout(() => setArmed(false), 4000);
      return;
    }
    disarm();
    onConfirm?.();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onBlur={disarm}
      data-armed={armed || undefined}
      className="inline-flex min-w-[9.5rem] items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[armed=true]:bg-red-800 motion-reduce:transition-none dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span aria-live="polite">{armed ? 'Are you sure?' : children}</span>
    </button>
  );
}`,
      nextjs: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface DestructiveButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode;
  /** Fired on the SECOND click only - the first merely arms the button. */
  onConfirm?: () => void;
}

// 'use client' - the armed/idle state lives in the browser.
export function DestructiveButton({ children, onConfirm, ...props }: DestructiveButtonProps) {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function disarm(): void {
    setArmed(false);
    window.clearTimeout(timerRef.current);
  }

  function onClick(): void {
    if (!armed) {
      setArmed(true);
      timerRef.current = window.setTimeout(() => setArmed(false), 4000);
      return;
    }
    disarm();
    onConfirm?.();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onBlur={disarm}
      data-armed={armed || undefined}
      className="inline-flex min-w-[9.5rem] items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[armed=true]:bg-red-800 motion-reduce:transition-none dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      <span aria-live="polite">{armed ? 'Are you sure?' : children}</span>
    </button>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * \`onClick\` is omitted and replaced by \`onConfirm\` on purpose: a caller that
 * wires the destructive action to \`onClick\` would fire it on the arming click
 * and defeat the whole component. The type makes that mistake unspellable.
 */
export interface DestructiveButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  children: ReactNode;
  onConfirm?: () => void;
}

export function DestructiveButton({
  children,
  onConfirm,
  ...props
}: DestructiveButtonProps): JSX.Element {
  const [armed, setArmed] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function disarm(): void {
    setArmed(false);
    window.clearTimeout(timerRef.current);
  }

  function onClick(): void {
    if (!armed) {
      setArmed(true);
      // Auto-disarm after 4s so an armed button left alone cannot ambush the
      // next click that lands on it.
      timerRef.current = window.setTimeout(() => setArmed(false), 4000);
      return;
    }
    disarm();
    onConfirm?.();
  }

  return (
    <button
      type="button"
      onClick={onClick}
      // Tabbing away is a change of mind - re-arming should be deliberate.
      onBlur={disarm}
      data-armed={armed || undefined}
      className="inline-flex min-w-[9.5rem] items-center justify-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 data-[armed=true]:bg-red-800 motion-reduce:transition-none dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {/* aria-live carries the confirm step to a screen reader; the red does not. */}
      <span aria-live="polite">{armed ? 'Are you sure?' : children}</span>
    </button>
  );
}`,
    },
  },
];
