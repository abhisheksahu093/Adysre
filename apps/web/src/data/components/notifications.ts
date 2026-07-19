import type { ComponentEntry } from './types';

/**
 * Notifications category.
 *
 * The line against `alerts` is a semantic one, not a visual one: a notification
 * is TRANSIENT and EVENT-DRIVEN. Something happened - a job finished, a message
 * arrived - and the UI has to say so without the user having asked. That shape
 * shows up in the code: every entry here holds a queue or a timer, mounts into
 * an overlay layer rather than the document flow, and announces itself through a
 * live region that already exists in the DOM before the event fires. An alert,
 * by contrast, is static markup describing the state of the thing next to it.
 *
 * ─── The live region rule ───────────────────────────────────────────────────
 * Toasts are `role="status"` (implicit `aria-live="polite"`), never
 * `role="alert"`. Assertive announcements interrupt a screen-reader user
 * mid-sentence; "Message sent" does not earn that. The only notifications that
 * may be assertive are ones a user would want to hear over their own reading -
 * and a toast is by definition already gone by the time they react to it, which
 * is exactly why it must not be the carrier for anything that urgent.
 *
 * The region must be in the DOM *before* its contents change. Mounting a
 * `role="status"` node and populating it in the same tick is the classic bug:
 * most screen readers never announce it, because there was no mutation to
 * observe. Every entry below renders an empty region up front and pushes into
 * it.
 */
export const notificationsComponents: ComponentEntry[] = [
  {
    slug: 'toast-basic',
    category: 'notifications',
    tags: ['toast', 'snackbar', 'transient', 'live-region', 'auto-dismiss'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-04',
    updatedAt: '2026-07-02',
    license: 'MIT',
    version: '1.1.0',
    featured: true,
    stats: { views: 2140, copies: 604, downloads: 171 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'duration', type: 'number', default: '5', descriptionKey: 'autoDismissAfter', example: '5' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The live region is part of the page shell, not the toast. It ships empty and
  stays mounted; JS appends the toast INTO it. A role="status" element that is
  inserted already-populated is usually not announced at all - screen readers
  watch mounted regions for mutations.

  role="status" is polite on purpose: a toast interrupting someone mid-sentence
  to say "Saved" is a bug, not a feature.
-->
<div class="toast-region" role="status" aria-live="polite"></div>

<template id="toast-template">
  <div class="toast">
    <svg class="toast__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
    </svg>
    <div class="toast__body">
      <p class="toast__title"></p>
      <p class="toast__message"></p>
    </div>
    <button class="toast__close" type="button" aria-label="Dismiss">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  </div>
</template>

<script>
  const region = document.querySelector('.toast-region');
  const template = document.querySelector('#toast-template');

  function showToast(title, message, duration = 5000) {
    const toast = template.content.firstElementChild.cloneNode(true);
    toast.querySelector('.toast__title').textContent = title;
    toast.querySelector('.toast__message').textContent = message;

    const remove = () => toast.remove();
    toast.querySelector('.toast__close').addEventListener('click', remove);

    // Appending into the already-mounted region is what triggers the
    // announcement.
    region.append(toast);
    setTimeout(remove, duration);
  }
</script>`,
      css: `/*
 * The region is fixed to the viewport but has no size of its own - it must not
 * swallow clicks on the page behind it, hence pointer-events: none here and
 * pointer-events: auto on the toast itself.
 */
.toast-region {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 50;
  display: grid;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  width: 22rem;
  max-width: calc(100vw - 2rem);
  padding: 0.875rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  animation: toast-in 200ms ease-out;
}

/* green-700 on white is 5.02:1 - green-500 would be 2.3:1 and fail AA. The
   icon is not decoration: colour alone must never be the signal. */
.toast__icon {
  flex: none;
  width: 1.25rem;
  height: 1.25rem;
  margin-top: 0.125rem;
  color: #15803d;
}

.toast__body {
  min-width: 0;
  flex: 1;
}

.toast__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.toast__message {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  line-height: 1.4;
  color: #4b5563; /* 7.56:1 on white */
}

.toast__close {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  margin: -0.25rem -0.25rem 0 0;
  padding: 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
}

.toast__close svg {
  width: 1rem;
  height: 1rem;
}

.toast__close:hover {
  background: #f3f4f6;
  color: #111827;
}

.toast__close:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem);
  }
}

/* The toast still appears; it just stops sliding. Never remove the toast for
   reduced-motion users - remove the motion. */
@media (prefers-reduced-motion: reduce) {
  .toast {
    animation: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * green-300 on gray-900 is 12.63:1.
 */
@media (prefers-color-scheme: dark) {
  .toast {
    border-color: #1f2937;
    background: #111827;
  }

  .toast__icon {
    color: #86efac;
  }

  .toast__title {
    color: #f3f4f6;
  }

  .toast__message,
  .toast__close {
    color: #9ca3af; /* 6.99:1 on gray-900 */
  }

  .toast__close:hover {
    background: #1f2937;
    color: #f3f4f6;
  }

  .toast__close:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  Ships empty and stays mounted; JS appends toasts into it. Populating a
  role="status" node in the same tick you mount it is the classic silent-toast
  bug - the region has to exist first for the mutation to be observed.
  pointer-events-none on the region, pointer-events-auto on the toast: the
  region spans a corner of the viewport and must not eat clicks.
-->
<div class="pointer-events-none fixed bottom-4 right-4 z-50 grid gap-2" role="status" aria-live="polite">
  <!-- One toast, as JS should build it: -->
  <div class="pointer-events-auto flex w-88 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900">
    <!-- green-700/green-300 clear AA on both themes (5.02:1 / 12.63:1); green-500 would be 2.3:1 on white. The icon carries the meaning too - never colour alone. -->
    <svg class="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
    </svg>

    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Changes saved</p>
      <p class="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">Your workspace settings are up to date.</p>
    </div>

    <button
      type="button"
      aria-label="Dismiss"
      class="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  </div>
</div>`,
      react: `import { useEffect } from 'react';

// The region is rendered by the app shell and never unmounts. The toast is what
// comes and goes. That ordering is the whole trick: a role="status" element
// mounted with its text already inside it usually goes unannounced.
export function ToastRegion({ children }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 grid gap-2"
    >
      {children}
    </div>
  );
}

export function Toast({
  title,
  message,
  duration = 5,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}) {
  useEffect(() => {
    if (duration <= 0 || !onDismiss) return;
    const id = setTimeout(onDismiss, duration * 1000);
    return () => clearTimeout(id);
  }, [duration, onDismiss]);

  return (
    <div
      className={\`pointer-events-auto flex w-88 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
      nextjs: `'use client';

// A timer and a dismiss handler - client-only by necessity. Render <ToastRegion>
// once in your root layout (inside a client boundary) so it is mounted before
// any event can fire a toast into it.
import { useEffect, type ReactNode } from 'react';

export function ToastRegion({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 grid gap-2"
    >
      {children}
    </div>
  );
}

interface ToastProps {
  title: string;
  message?: string;
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function Toast({
  title,
  message,
  duration = 5,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: ToastProps) {
  useEffect(() => {
    if (duration <= 0 || !onDismiss) return;
    const id = setTimeout(onDismiss, duration * 1000);
    return () => clearTimeout(id);
  }, [duration, onDismiss]);

  return (
    <div
      className={\`pointer-events-auto flex w-88 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `import { useEffect, type ReactNode } from 'react';

export interface ToastProps {
  title: string;
  message?: string;
  /** Seconds before auto-dismiss. Pass 0 to keep it until dismissed. */
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function ToastRegion({ children }: { children: ReactNode }): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-50 grid gap-2"
    >
      {children}
    </div>
  );
}

export function Toast({
  title,
  message,
  duration = 5,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: ToastProps): JSX.Element {
  useEffect(() => {
    if (duration <= 0 || !onDismiss) return;
    const id: ReturnType<typeof setTimeout> = setTimeout(onDismiss, duration * 1000);
    return () => clearTimeout(id);
  }, [duration, onDismiss]);

  return (
    <div
      className={\`pointer-events-auto flex w-88 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message !== undefined ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'toast-stack',
    category: 'notifications',
    tags: ['toast', 'stack', 'queue', 'live-region', 'transient'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-19',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1490, copies: 388, downloads: 104 },
    variants: [
      { id: 'multiple', labelKey: 'multiple' },
      { id: 'single', labelKey: 'single' },
    ],
    props: [
      { name: 'items', type: 'ToastItem[]', required: true, descriptionKey: 'items' },
      { name: 'onDismiss', type: '(id: string) => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A stack is a queue with a cap. Three things make it different from N copies of
  a single toast:

  1. The cap. Unbounded stacks are how a retry loop covers the whole screen.
     Overflow waits its turn rather than rendering.
  2. One region, N children. The live region is the container - announcing each
     toast means appending into the SAME mounted region, not mounting a region
     per toast.
  3. Newest first, visually - but appended last in the DOM, so reading order
     matches the queue. column-reverse keeps those two facts independent.
-->
<div class="toast-stack" role="status" aria-live="polite"></div>

<script>
  const MAX_VISIBLE = 3;
  const stack = document.querySelector('.toast-stack');
  const queue = [];

  function render() {
    stack.replaceChildren();
    queue.slice(0, MAX_VISIBLE).forEach((toast) => {
      const el = document.createElement('div');
      el.className = 'toast';
      el.innerHTML =
        '<p class="toast__title"></p><button class="toast__close" type="button" aria-label="Dismiss">&times;</button>';
      el.querySelector('.toast__title').textContent = toast.title;
      el.querySelector('.toast__close').addEventListener('click', () => dismiss(toast.id));
      stack.append(el);
    });
  }

  function dismiss(id) {
    const index = queue.findIndex((t) => t.id === id);
    if (index > -1) queue.splice(index, 1);
    render();
  }

  function push(title, duration = 5000) {
    const id = crypto.randomUUID();
    queue.unshift({ id, title });
    render();
    setTimeout(() => dismiss(id), duration);
  }
</script>`,
      css: `/*
 * column-reverse is what lets the newest toast sit at the bottom (nearest the
 * corner the eye is already on) while still being the first child. Reading
 * order and paint order stop fighting.
 */
.toast-stack {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 20rem;
  max-width: calc(100vw - 2rem);
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.35);
  pointer-events: auto;
  animation: toast-in 180ms ease-out;
}

.toast__title {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.toast__close {
  flex: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 1rem;
  line-height: 1;
  color: #4b5563;
  cursor: pointer;
}

.toast__close:hover {
  background: #f3f4f6;
  color: #111827;
}

.toast__close:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.98);
  }
}

/* Stacks are the worst offender for motion sickness - several elements sliding
   at once. Reduced motion gets the same stack, instantly. */
@media (prefers-reduced-motion: reduce) {
  .toast {
    animation: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .toast {
    border-color: #1f2937;
    background: #111827;
  }

  .toast__title {
    color: #f3f4f6;
  }

  .toast__close {
    color: #9ca3af;
  }

  .toast__close:hover {
    background: #1f2937;
    color: #f3f4f6;
  }

  .toast__close:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!--
  flex-col-reverse: newest toast paints nearest the corner while remaining the
  first child, so DOM order still matches queue order. Cap the rendered slice at
  three in JS - an uncapped stack is how one retry loop fills the viewport.
-->
<div class="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2" role="status" aria-live="polite">
  <div class="pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900">
    <span class="h-2 w-2 flex-none rounded-full bg-blue-700 dark:bg-blue-300" aria-hidden="true"></span>
    <p class="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">Invite sent to dana@adysre.co</p>
    <button
      type="button"
      aria-label="Dismiss"
      class="flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  </div>
  <!-- …repeat per queued toast, capped at MAX_VISIBLE -->
</div>`,
      react: `import { useCallback, useState } from 'react';

const MAX_VISIBLE = 3;

// The hook owns the queue; the component owns the region. Keeping them apart is
// what lets any part of the app push a toast without knowing where toasts live.
export function useToastQueue() {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (title, duration = 5) => {
      const id = crypto.randomUUID();
      setItems((current) => [{ id, title }, ...current]);
      if (duration > 0) setTimeout(() => dismiss(id), duration * 1000);
    },
    [dismiss],
  );

  return { items, push, dismiss };
}

export function ToastStack({ items, onDismiss, dismissLabel = 'Dismiss', className = '' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 \${className}\`}
    >
      {items.slice(0, MAX_VISIBLE).map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900"
        >
          <span
            className="h-2 w-2 flex-none rounded-full bg-blue-700 dark:bg-blue-300"
            aria-hidden="true"
          />
          <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {toast.title}
          </p>
          <button
            type="button"
            onClick={() => onDismiss?.(toast.id)}
            aria-label={\`\${dismissLabel}: \${toast.title}\`}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}`,
      nextjs: `'use client';

// Mount <ToastStack> once in the root layout and drive it from a context that
// wraps useToastQueue. The stack must outlive every route, or a toast fired by
// a navigation dies with the page that fired it.
import { useCallback, useState } from 'react';

const MAX_VISIBLE = 3;

export interface ToastItem {
  id: string;
  title: string;
}

export function useToastQueue() {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (title: string, duration = 5) => {
      const id = crypto.randomUUID();
      setItems((current) => [{ id, title }, ...current]);
      if (duration > 0) setTimeout(() => dismiss(id), duration * 1000);
    },
    [dismiss],
  );

  return { items, push, dismiss };
}

interface ToastStackProps {
  items: ToastItem[];
  onDismiss?: (id: string) => void;
  dismissLabel?: string;
  className?: string;
}

export function ToastStack({
  items,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: ToastStackProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 \${className}\`}
    >
      {items.slice(0, MAX_VISIBLE).map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900"
        >
          <span
            className="h-2 w-2 flex-none rounded-full bg-blue-700 dark:bg-blue-300"
            aria-hidden="true"
          />
          <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {toast.title}
          </p>
          <button
            type="button"
            onClick={() => onDismiss?.(toast.id)}
            aria-label={\`\${dismissLabel}: \${toast.title}\`}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}`,
      typescript: `import { useCallback, useState } from 'react';

const MAX_VISIBLE = 3;

export interface ToastItem {
  id: string;
  title: string;
}

export interface ToastStackProps {
  items: ToastItem[];
  onDismiss?: (id: string) => void;
  dismissLabel?: string;
  className?: string;
}

export interface ToastQueue {
  items: ToastItem[];
  push: (title: string, duration?: number) => void;
  dismiss: (id: string) => void;
}

export function useToastQueue(): ToastQueue {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string): void => {
    setItems((current) => current.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (title: string, duration = 5): void => {
      const id = crypto.randomUUID();
      setItems((current) => [{ id, title }, ...current]);
      if (duration > 0) setTimeout(() => dismiss(id), duration * 1000);
    },
    [dismiss],
  );

  return { items, push, dismiss };
}

export function ToastStack({
  items,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: ToastStackProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2 \${className}\`}
    >
      {items.slice(0, MAX_VISIBLE).map((toast: ToastItem) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900"
        >
          <span
            className="h-2 w-2 flex-none rounded-full bg-blue-700 dark:bg-blue-300"
            aria-hidden="true"
          />
          <p className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
            {toast.title}
          </p>
          <button
            type="button"
            onClick={() => onDismiss?.(toast.id)}
            aria-label={\`\${dismissLabel}: \${toast.title}\`}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-inline-banner',
    category: 'notifications',
    tags: ['banner', 'inline', 'live-region', 'transient', 'dismissible'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-21',
    updatedAt: '2026-06-26',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 980, copies: 241, downloads: 63 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'count', type: 'number', descriptionKey: 'eventCount', example: '3' },
      { name: 'ctaLabel', type: 'string', descriptionKey: 'ctaLabel' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
    ],
    code: {
      html: `<!--
  Not an alert. This is the "3 new items arrived while you were reading" banner
  - pushed by a subscription, not by page state - so it keeps a notification's
  anatomy (live region, dismiss, an action that consumes the event) while
  sitting in the document flow instead of an overlay.

  It reserves its slot with min-height even when empty. A banner that appears
  from nothing shoves the list down under the reader's cursor; reserving the
  space costs 44px of blank and buys a stable page.
-->
<div class="banner-slot" role="status" aria-live="polite"></div>

<template id="banner-template">
  <div class="banner">
    <svg class="banner__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
    </svg>
    <p class="banner__text"></p>
    <button class="banner__cta" type="button">Show them</button>
    <button class="banner__close" type="button" aria-label="Dismiss">
      <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  </div>
</template>

<script>
  const slot = document.querySelector('.banner-slot');
  const template = document.querySelector('#banner-template');

  function announce(count) {
    slot.replaceChildren();
    const banner = template.content.firstElementChild.cloneNode(true);
    banner.querySelector('.banner__text').textContent =
      count + (count === 1 ? ' new update' : ' new updates');
    banner.querySelector('.banner__close').addEventListener('click', () => slot.replaceChildren());
    slot.append(banner);
  }
</script>`,
      css: `/* Reserve the row whether or not a banner is in it - see the HTML tab. */
.banner-slot {
  min-height: 2.75rem;
}

.banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  border: 1px solid #bfdbfe;
  border-radius: 0.625rem;
  background: #eff6ff;
  animation: banner-in 180ms ease-out;
}

/* blue-800 on blue-50 is 8.01:1. The bell icon repeats the signal so the
   banner still reads as "new activity" without colour. */
.banner__icon {
  flex: none;
  width: 1.125rem;
  height: 1.125rem;
  color: #1e40af;
}

.banner__text {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e40af;
}

.banner__cta {
  flex: none;
  padding: 0.25rem 0.625rem;
  border: 0;
  border-radius: 0.375rem;
  background: #1d4ed8;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
}

.banner__cta:hover {
  background: #1e40af;
}

.banner__close {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: #1e40af;
  cursor: pointer;
}

.banner__close svg {
  width: 0.875rem;
  height: 0.875rem;
}

.banner__cta:focus-visible,
.banner__close:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}

@keyframes banner-in {
  from {
    opacity: 0;
    transform: translateY(-0.25rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .banner {
    animation: none;
  }
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * blue-200 on blue-950 is 10.34:1.
 */
@media (prefers-color-scheme: dark) {
  .banner {
    border-color: #1e3a8a;
    background: #172554;
  }

  .banner__icon,
  .banner__text,
  .banner__close {
    color: #bfdbfe;
  }

  .banner__cta {
    background: #3b82f6;
    color: #0b1120;
  }

  .banner__cta:hover {
    background: #60a5fa;
  }

  .banner__cta:focus-visible,
  .banner__close:focus-visible {
    outline-color: #93c5fd;
  }
}`,
      tailwind: `<!--
  min-h-11 on the slot reserves the row so the banner's arrival doesn't shove
  the list under the reader's cursor. blue-800/blue-200 clear AA on their tints
  (8.01:1 and 10.34:1); the bell repeats the signal for anyone who can't use
  the colour.
-->
<div class="min-h-11" role="status" aria-live="polite">
  <div class="flex items-center gap-3 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3 py-2.5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 dark:border-blue-900 dark:bg-blue-950">
    <svg class="h-[1.125rem] w-[1.125rem] flex-none text-blue-800 dark:text-blue-200" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
    </svg>

    <p class="flex-1 text-sm font-medium text-blue-800 dark:text-blue-200">3 new updates</p>

    <button
      type="button"
      class="flex-none rounded-md bg-blue-700 px-2.5 py-1 text-[0.8125rem] font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-blue-500 dark:text-gray-950 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-blue-950"
    >
      Show them
    </button>

    <button
      type="button"
      aria-label="Dismiss"
      class="flex h-6 w-6 flex-none items-center justify-center rounded-md text-blue-800 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:text-blue-200 dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  </div>
</div>`,
      react: `// The slot is always rendered; only its contents come and go. Same rule as a
// toast region - a live region populated on mount usually isn't announced.
export function NotificationInlineBanner({
  message,
  count,
  ctaLabel,
  onClick,
  onDismiss,
  dismissLabel = 'Dismiss',
}) {
  return (
    <div className="min-h-11" role="status" aria-live="polite">
      {message ? (
        <div className="flex items-center gap-3 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-900 dark:bg-blue-950">
          <svg
            className="h-[1.125rem] w-[1.125rem] flex-none text-blue-800 dark:text-blue-200"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
          </svg>

          <p className="flex-1 text-sm font-medium text-blue-800 dark:text-blue-200">
            {count !== undefined ? \`\${count} \` : ''}
            {message}
          </p>

          {ctaLabel ? (
            <button
              type="button"
              onClick={onClick}
              className="flex-none rounded-md bg-blue-700 px-2.5 py-1 text-[0.8125rem] font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-blue-500 dark:text-gray-950 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-blue-950"
            >
              {ctaLabel}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-blue-800 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:text-blue-200 dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
      nextjs: `'use client';

// Client-only: the message arrives from a subscription (websocket, SSE, polling
// query) after hydration. Render the slot from a Server Component if you like,
// but the thing that fills it lives here.
interface NotificationInlineBannerProps {
  message?: string;
  count?: number;
  ctaLabel?: string;
  onClick?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function NotificationInlineBanner({
  message,
  count,
  ctaLabel,
  onClick,
  onDismiss,
  dismissLabel = 'Dismiss',
}: NotificationInlineBannerProps) {
  return (
    <div className="min-h-11" role="status" aria-live="polite">
      {message ? (
        <div className="flex items-center gap-3 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-900 dark:bg-blue-950">
          <svg
            className="h-[1.125rem] w-[1.125rem] flex-none text-blue-800 dark:text-blue-200"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
          </svg>

          <p className="flex-1 text-sm font-medium text-blue-800 dark:text-blue-200">
            {count !== undefined ? \`\${count} \` : ''}
            {message}
          </p>

          {ctaLabel ? (
            <button
              type="button"
              onClick={onClick}
              className="flex-none rounded-md bg-blue-700 px-2.5 py-1 text-[0.8125rem] font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-blue-500 dark:text-gray-950 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-blue-950"
            >
              {ctaLabel}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-blue-800 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:text-blue-200 dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `export interface NotificationInlineBannerProps {
  /** Omit to render the reserved-but-empty slot. */
  message?: string;
  count?: number;
  ctaLabel?: string;
  onClick?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function NotificationInlineBanner({
  message,
  count,
  ctaLabel,
  onClick,
  onDismiss,
  dismissLabel = 'Dismiss',
}: NotificationInlineBannerProps): JSX.Element {
  return (
    <div className="min-h-11" role="status" aria-live="polite">
      {message !== undefined ? (
        <div className="flex items-center gap-3 rounded-[0.625rem] border border-blue-200 bg-blue-50 px-3 py-2.5 dark:border-blue-900 dark:bg-blue-950">
          <svg
            className="h-[1.125rem] w-[1.125rem] flex-none text-blue-800 dark:text-blue-200"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
          </svg>

          <p className="flex-1 text-sm font-medium text-blue-800 dark:text-blue-200">
            {count !== undefined ? \`\${count} \` : ''}
            {message}
          </p>

          {ctaLabel !== undefined ? (
            <button
              type="button"
              onClick={onClick}
              className="flex-none rounded-md bg-blue-700 px-2.5 py-1 text-[0.8125rem] font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-blue-500 dark:text-gray-950 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-blue-950"
            >
              {ctaLabel}
            </button>
          ) : null}

          <button
            type="button"
            onClick={onDismiss}
            aria-label={dismissLabel}
            className="flex h-6 w-6 flex-none items-center justify-center rounded-md text-blue-800 transition hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 motion-reduce:transition-none dark:text-blue-200 dark:hover:bg-blue-900 dark:focus-visible:ring-blue-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-list-panel',
    category: 'notifications',
    tags: ['panel', 'inbox', 'list', 'unread', 'dropdown'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1310, copies: 297, downloads: 82 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'PanelNotification[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'onDismiss', type: '(id: string) => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The panel is the notification system's memory: everything the toasts already
  showed and threw away. That difference drives the markup.

  - No live region. Nothing here is breaking news; the user opened this panel
    deliberately. Announcing a list they asked to read would be noise.
  - <ul>, not a stack of divs. Now a screen reader says "list, 3 items" and
    arrow keys work.
  - Unread is marked with a dot AND the word "Unread" in a visually hidden
    span. The dot alone is colour-only signalling.
-->
<section class="panel" aria-labelledby="panel-heading">
  <header class="panel__head">
    <h2 class="panel__title" id="panel-heading">Notifications</h2>
    <button class="panel__mark" type="button">Mark all read</button>
  </header>

  <ul class="panel__list">
    <li class="panel__item panel__item--unread">
      <span class="panel__dot" aria-hidden="true"></span>
      <a class="panel__link" href="/deploys/9f2">
        <span class="panel__sr">Unread. </span>
        <span class="panel__text">Deploy #914 finished in 42s</span>
        <span class="panel__time">2m ago</span>
      </a>
    </li>
    <li class="panel__item">
      <span class="panel__dot" aria-hidden="true"></span>
      <a class="panel__link" href="/invites/7c1">
        <span class="panel__text">Dana accepted your invite</span>
        <span class="panel__time">1h ago</span>
      </a>
    </li>
  </ul>
</section>`,
      css: `.panel {
  width: 22rem;
  max-width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.panel__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.panel__mark {
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 0.75rem;
  font-weight: 500;
  color: #1d4ed8; /* 6.7:1 on white */
  cursor: pointer;
}

.panel__mark:hover {
  text-decoration: underline;
}

.panel__list {
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 18rem;
  overflow-y: auto;
}

.panel__item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0 0.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.panel__item:last-child {
  border-bottom: 0;
}

/* The dot is present but transparent on read rows, so the text never shifts
   left when a row is marked read. */
.panel__dot {
  flex: none;
  width: 0.375rem;
  height: 0.375rem;
  margin-top: 1rem;
  border-radius: 9999px;
  background: transparent;
}

.panel__item--unread .panel__dot {
  background: #1d4ed8;
}

.panel__link {
  flex: 1;
  display: grid;
  gap: 0.125rem;
  padding: 0.625rem 0.5rem;
  border-radius: 0.375rem;
  text-decoration: none;
}

.panel__link:hover {
  background: #f9fafb;
}

.panel__link:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: -2px;
}

.panel__text {
  font-size: 0.875rem;
  color: #111827;
}

.panel__item--unread .panel__text {
  font-weight: 600;
}

.panel__time {
  font-size: 0.75rem;
  color: #4b5563;
}

/* "Unread." for screen readers - the dot is colour-only, and colour is never
   allowed to be the only carrier of meaning. */
.panel__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 */
@media (prefers-color-scheme: dark) {
  .panel {
    border-color: #1f2937;
    background: #111827;
  }

  .panel__head {
    border-bottom-color: #1f2937;
  }

  .panel__title,
  .panel__text {
    color: #f3f4f6;
  }

  .panel__mark {
    color: #93c5fd; /* 9.84:1 on gray-900 */
  }

  .panel__item {
    border-bottom-color: #1f2937;
  }

  .panel__item--unread .panel__dot {
    background: #93c5fd;
  }

  .panel__link:hover {
    background: #1f2937;
  }

  .panel__link:focus-visible {
    outline-color: #60a5fa;
  }

  .panel__time {
    color: #9ca3af;
  }
}`,
      tailwind: `<!--
  No live region on purpose: the user opened this panel, so nothing in it is an
  interruption. It's a list, so it's a <ul> - "list, 3 items" beats three
  anonymous divs. Unread carries a dot AND a sr-only "Unread." because a blue
  dot on its own is colour-only signalling.
-->
<section class="w-88 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] dark:border-gray-800 dark:bg-gray-900" aria-labelledby="panel-heading">
  <header class="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
    <h2 class="text-sm font-semibold text-gray-900 dark:text-gray-100" id="panel-heading">Notifications</h2>
    <button type="button" class="rounded text-xs font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:focus-visible:ring-blue-400">
      Mark all read
    </button>
  </header>

  <ul class="max-h-72 overflow-y-auto">
    <li class="flex items-start gap-2.5 border-b border-gray-100 px-2 last:border-0 dark:border-gray-800">
      <!-- Always rendered, transparent when read: the text must not shift when a row is marked. -->
      <span class="mt-4 h-1.5 w-1.5 flex-none rounded-full bg-blue-700 dark:bg-blue-300" aria-hidden="true"></span>
      <a href="/deploys/9f2" class="grid flex-1 gap-0.5 rounded-md px-2 py-2.5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <span class="sr-only">Unread. </span>
        <span class="text-sm font-semibold text-gray-900 dark:text-gray-100">Deploy #914 finished in 42s</span>
        <span class="text-xs text-gray-600 dark:text-gray-400">2m ago</span>
      </a>
    </li>
    <li class="flex items-start gap-2.5 border-b border-gray-100 px-2 last:border-0 dark:border-gray-800">
      <span class="mt-4 h-1.5 w-1.5 flex-none rounded-full bg-transparent" aria-hidden="true"></span>
      <a href="/invites/7c1" class="grid flex-1 gap-0.5 rounded-md px-2 py-2.5 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">
        <span class="text-sm text-gray-900 dark:text-gray-100">Dana accepted your invite</span>
        <span class="text-xs text-gray-600 dark:text-gray-400">1h ago</span>
      </a>
    </li>
  </ul>
</section>`,
      react: `// A panel, not a toast: no live region, because the user opened it. See the
// HTML tab for why that's the deliberate choice and not an omission.
export function NotificationListPanel({ items, onSelect, onDismiss, className = '' }) {
  const unread = items.filter((item) => !item.read).length;

  return (
    <section
      aria-labelledby="panel-heading"
      className={\`w-88 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h2 id="panel-heading" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Notifications
          {unread > 0 ? (
            <span className="ml-1 font-normal text-gray-600 dark:text-gray-400">({unread})</span>
          ) : null}
        </h2>
      </header>

      <ul className="max-h-72 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2.5 border-b border-gray-100 px-2 last:border-0 dark:border-gray-800"
          >
            <span
              className={\`mt-4 h-1.5 w-1.5 flex-none rounded-full \${item.read ? 'bg-transparent' : 'bg-blue-700 dark:bg-blue-300'}\`}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => onSelect?.(item.id)}
              className="grid flex-1 gap-0.5 rounded-md px-2 py-2.5 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              {!item.read ? <span className="sr-only">Unread. </span> : null}
              <span
                className={\`text-sm text-gray-900 dark:text-gray-100 \${item.read ? '' : 'font-semibold'}\`}
              >
                {item.title}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</span>
            </button>
            <button
              type="button"
              onClick={() => onDismiss?.(item.id)}
              aria-label={\`Dismiss: \${item.title}\`}
              className="mt-2.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `'use client';

// Interactive rows make this a Client Component. The data itself is a good fit
// for a Server Component parent that fetches and passes \`items\` down.
export interface PanelNotification {
  id: string;
  title: string;
  timestamp: string;
  read?: boolean;
}

interface NotificationListPanelProps {
  items: PanelNotification[];
  onSelect?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function NotificationListPanel({
  items,
  onSelect,
  onDismiss,
  className = '',
}: NotificationListPanelProps) {
  const unread = items.filter((item) => !item.read).length;

  return (
    <section
      aria-labelledby="panel-heading"
      className={\`w-88 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h2 id="panel-heading" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Notifications
          {unread > 0 ? (
            <span className="ml-1 font-normal text-gray-600 dark:text-gray-400">({unread})</span>
          ) : null}
        </h2>
      </header>

      <ul className="max-h-72 overflow-y-auto">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-2.5 border-b border-gray-100 px-2 last:border-0 dark:border-gray-800"
          >
            <span
              className={\`mt-4 h-1.5 w-1.5 flex-none rounded-full \${item.read ? 'bg-transparent' : 'bg-blue-700 dark:bg-blue-300'}\`}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => onSelect?.(item.id)}
              className="grid flex-1 gap-0.5 rounded-md px-2 py-2.5 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              {!item.read ? <span className="sr-only">Unread. </span> : null}
              <span
                className={\`text-sm text-gray-900 dark:text-gray-100 \${item.read ? '' : 'font-semibold'}\`}
              >
                {item.title}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</span>
            </button>
            <button
              type="button"
              onClick={() => onDismiss?.(item.id)}
              aria-label={\`Dismiss: \${item.title}\`}
              className="mt-2.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface PanelNotification {
  id: string;
  title: string;
  timestamp: string;
  read?: boolean;
}

export interface NotificationListPanelProps {
  items: PanelNotification[];
  onSelect?: (id: string) => void;
  onDismiss?: (id: string) => void;
  className?: string;
}

export function NotificationListPanel({
  items,
  onSelect,
  onDismiss,
  className = '',
}: NotificationListPanelProps): JSX.Element {
  const unread: number = items.filter((item) => item.read !== true).length;

  return (
    <section
      aria-labelledby="panel-heading"
      className={\`w-88 max-w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <header className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <h2 id="panel-heading" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Notifications
          {unread > 0 ? (
            <span className="ml-1 font-normal text-gray-600 dark:text-gray-400">({unread})</span>
          ) : null}
        </h2>
      </header>

      <ul className="max-h-72 overflow-y-auto">
        {items.map((item: PanelNotification) => (
          <li
            key={item.id}
            className="flex items-start gap-2.5 border-b border-gray-100 px-2 last:border-0 dark:border-gray-800"
          >
            <span
              className={\`mt-4 h-1.5 w-1.5 flex-none rounded-full \${item.read === true ? 'bg-transparent' : 'bg-blue-700 dark:bg-blue-300'}\`}
              aria-hidden="true"
            />
            <button
              type="button"
              onClick={() => onSelect?.(item.id)}
              className="grid flex-1 gap-0.5 rounded-md px-2 py-2.5 text-left hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
            >
              {item.read !== true ? <span className="sr-only">Unread. </span> : null}
              <span
                className={\`text-sm text-gray-900 dark:text-gray-100 \${item.read === true ? '' : 'font-semibold'}\`}
              >
                {item.title}
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</span>
            </button>
            <button
              type="button"
              onClick={() => onDismiss?.(item.id)}
              aria-label={\`Dismiss: \${item.title}\`}
              className="mt-2.5 flex h-6 w-6 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'notification-badge-bell',
    category: 'notifications',
    tags: ['badge', 'bell', 'unread', 'counter', 'live-region'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-08',
    updatedAt: '2026-06-15',
    license: 'MIT',
    version: '1.2.0',
    stats: { views: 1720, copies: 512, downloads: 140 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'count', type: 'number', default: '0', descriptionKey: 'count' },
      { name: 'ariaLabel', type: 'string', descriptionKey: 'ariaLabel' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The badge is the notification system's ambient channel: it never interrupts,
  it just accrues. Three details make it work.

  1. The visible "3" is aria-hidden and the button's accessible name carries the
     whole sentence - "Notifications, 3 unread". A screen reader announcing
     "button, 3" tells you nothing.
  2. The polite live region is a SEPARATE hidden span. Putting aria-live on the
     button itself makes some screen readers re-announce the entire button
     (label, role, state) on every tick.
  3. At zero the badge is not rendered - not hidden, not empty. An empty badge
     still paints a dot that means nothing.

  Anything over 99 collapses to "99+" visually, while the accessible name keeps
  the true count.
-->
<button class="bell" type="button" aria-label="Notifications, 3 unread">
  <svg class="bell__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
  </svg>
  <span class="bell__badge" aria-hidden="true">3</span>
</button>

<span class="bell__announce" role="status" aria-live="polite">3 unread notifications</span>`,
      css: `.bell {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #fff;
  color: #374151;
  cursor: pointer;
}

.bell:hover {
  background: #f9fafb;
  color: #111827;
}

.bell:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.bell__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/*
 * White on red-600 (#dc2626) is 4.83:1 - over AA for the 12px bold badge.
 * red-500 would be 3.76:1 and fail. The badge also has a light ring so it stays
 * legible when it overlaps the icon.
 */
.bell__badge {
  position: absolute;
  top: -0.3125rem;
  right: -0.3125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  border-radius: 9999px;
  background: #dc2626;
  box-shadow: 0 0 0 2px #fff;
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
  color: #fff;
}

.bell__announce {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

/*
 * Dark mode: this stylesheet uses prefers-color-scheme (the same signal
 * Tailwind's dark: variant defaults to), so the snippet works in any project.
 * The ring switches to the dark surface so the badge stays cut out of the icon.
 */
@media (prefers-color-scheme: dark) {
  .bell {
    border-color: #1f2937;
    background: #111827;
    color: #d1d5db;
  }

  .bell:hover {
    background: #1f2937;
    color: #f3f4f6;
  }

  .bell:focus-visible {
    outline-color: #60a5fa;
  }

  .bell__badge {
    box-shadow: 0 0 0 2px #111827;
  }
}`,
      tailwind: `<!--
  The count is aria-hidden; the button's aria-label carries the sentence. The
  polite region is a separate sr-only span - aria-live on the button itself makes
  several screen readers re-read the whole button on every tick.
  White on red-600 is 4.83:1 (red-500 would be 3.76:1 and fail AA); the ring
  keeps the badge cut out of the icon on both themes.
-->
<button
  type="button"
  aria-label="Notifications, 3 unread"
  class="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
>
  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
  </svg>

  <!-- Render nothing at zero - an empty badge is still a meaningless dot. -->
  <span
    aria-hidden="true"
    class="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900"
  >
    3
  </span>
</button>

<span class="sr-only" role="status" aria-live="polite">3 unread notifications</span>`,
      react: `export function NotificationBadgeBell({ count = 0, ariaLabel, onClick, className = '' }) {
  const label = ariaLabel ?? \`Notifications, \${count} unread\`;
  // Visual truncation only - the accessible name keeps the real number.
  const display = count > 99 ? '99+' : String(count);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={\`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>

        {count > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900"
          >
            {display}
          </span>
        ) : null}
      </button>

      {/* Separate from the button: aria-live on the button re-announces its
          whole label on every change. */}
      <span className="sr-only" role="status" aria-live="polite">
        {count > 0 ? \`\${count} unread notifications\` : ''}
      </span>
    </>
  );
}`,
      nextjs: `'use client';

// The count comes from a live source, so this is a Client Component. Pass the
// initial count from a Server Component to avoid a flash of "0".
interface NotificationBadgeBellProps {
  count?: number;
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function NotificationBadgeBell({
  count = 0,
  ariaLabel,
  onClick,
  className = '',
}: NotificationBadgeBellProps) {
  const label = ariaLabel ?? \`Notifications, \${count} unread\`;
  const display = count > 99 ? '99+' : String(count);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={\`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>

        {count > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900"
          >
            {display}
          </span>
        ) : null}
      </button>

      <span className="sr-only" role="status" aria-live="polite">
        {count > 0 ? \`\${count} unread notifications\` : ''}
      </span>
    </>
  );
}`,
      typescript: `export interface NotificationBadgeBellProps {
  count?: number;
  /** Overrides the generated "Notifications, N unread". */
  ariaLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function NotificationBadgeBell({
  count = 0,
  ariaLabel,
  onClick,
  className = '',
}: NotificationBadgeBellProps): JSX.Element {
  const label: string = ariaLabel ?? \`Notifications, \${count} unread\`;
  const display: string = count > 99 ? '99+' : String(count);

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className={\`relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${className}\`}
      >
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>

        {count > 0 ? (
          <span
            aria-hidden="true"
            className="absolute -right-1.5 -top-1.5 flex h-[1.125rem] min-w-[1.125rem] items-center justify-center rounded-full bg-red-600 px-1 text-[0.6875rem] font-bold leading-none text-white ring-2 ring-white dark:ring-gray-900"
          >
            {display}
          </span>
        ) : null}
      </button>

      <span className="sr-only" role="status" aria-live="polite">
        {count > 0 ? \`\${count} unread notifications\` : ''}
      </span>
    </>
  );
}`,
    },
  },
  {
    slug: 'notification-toast-success',
    category: 'notifications',
    tags: ['toast', 'success', 'status', 'dismissible', 'transient'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Success toast. role="status" (polite) never role="alert" - "Saved" must not cut
  a screen-reader user off mid-sentence. Width caps at the viewport with
  max-w-[calc(100vw-2rem)] so it can't overflow at 320px, and the check icon
  repeats what the green already says - colour is never the sole signal.
-->
<div role="status" aria-live="polite" class="pointer-events-auto flex w-96 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-green-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-green-900 dark:bg-gray-900">
  <svg class="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
  </svg>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Payment received</p>
    <p class="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">Invoice #2043 has been marked as paid.</p>
  </div>
  <button type="button" aria-label="Dismiss" class="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
    </svg>
  </button>
</div>`,
      react: `export function NotificationToastSuccess({
  title,
  message,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-auto flex w-96 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-green-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-green-900 dark:bg-gray-900 \${className}\`}
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `export interface NotificationToastSuccessProps {
  title: string;
  message?: string;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function NotificationToastSuccess({
  title,
  message,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationToastSuccessProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-auto flex w-96 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-green-200 bg-white px-4 py-3.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-green-900 dark:bg-gray-900 \${className}\`}
    >
      <svg
        className="mt-0.5 h-5 w-5 flex-none text-green-700 dark:text-green-300"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        {message !== undefined ? (
          <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label={dismissLabel}
        className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-toast-progress',
    category: 'notifications',
    tags: ['toast', 'progress', 'timer', 'auto-dismiss', 'motion-reduce'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'paused', labelKey: 'paused' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'duration', type: 'number', default: '6', descriptionKey: 'autoDismissAfter', example: '6' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Toast with a countdown bar. The bar is ONE width transition (100% -> 0% over the
  duration), which is why motion-reduce can switch it off with a single
  motion-reduce:transition-none - the toast still dismisses on its timer, only the
  sliding stops. The bar is aria-hidden: its meaning is the timer, not content.
  role="status" stays polite; width caps at the viewport at 320px.
-->
<div role="status" aria-live="polite" class="pointer-events-auto w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-start gap-3 px-4 py-3.5">
    <svg class="mt-0.5 h-5 w-5 flex-none text-blue-700 dark:text-blue-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z" />
    </svg>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Export started</p>
      <p class="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">We'll email you when the file is ready.</p>
    </div>
    <button type="button" aria-label="Dismiss" class="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400">
      <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
      </svg>
    </button>
  </div>
  <div class="h-1 w-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
    <div class="h-full w-full bg-blue-600 transition-[width] ease-linear motion-reduce:transition-none dark:bg-blue-400" style="width:0%;transition-duration:6s"></div>
  </div>
</div>`,
      react: `import { useEffect, useState } from 'react';

export function NotificationToastProgress({
  title,
  message,
  duration = 6,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}) {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    // Flip on the next frame so the browser has a full-width start to animate FROM.
    const frame = requestAnimationFrame(() => setRunning(true));
    const timer = onDismiss ? setTimeout(onDismiss, duration * 1000) : undefined;
    return () => {
      cancelAnimationFrame(frame);
      if (timer) clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-auto w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <svg
          className="mt-0.5 h-5 w-5 flex-none text-blue-700 dark:text-blue-300"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
          {message ? (
            <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
        <div
          className="h-full bg-blue-600 transition-[width] ease-linear motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: running ? '0%' : '100%', transitionDuration: \`\${duration}s\` }}
        />
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useState } from 'react';

export interface NotificationToastProgressProps {
  title: string;
  message?: string;
  /** Seconds before auto-dismiss and how long the bar takes to drain. */
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function NotificationToastProgress({
  title,
  message,
  duration = 6,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationToastProgressProps): JSX.Element {
  const [running, setRunning] = useState<boolean>(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRunning(true));
    const timer = onDismiss ? setTimeout(onDismiss, duration * 1000) : undefined;
    return () => {
      cancelAnimationFrame(frame);
      if (timer !== undefined) clearTimeout(timer);
    };
  }, [duration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-auto w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start gap-3 px-4 py-3.5">
        <svg
          className="mt-0.5 h-5 w-5 flex-none text-blue-700 dark:text-blue-300"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z" />
        </svg>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
          {message !== undefined ? (
            <p className="mt-0.5 text-sm leading-normal text-gray-600 dark:text-gray-400">{message}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-mr-1 -mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      </div>
      <div className="h-1 w-full bg-gray-100 dark:bg-gray-800" aria-hidden="true">
        <div
          className="h-full bg-blue-600 transition-[width] ease-linear motion-reduce:transition-none dark:bg-blue-400"
          style={{ width: running ? '0%' : '100%', transitionDuration: \`\${duration}s\` }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-in-app-feed',
    category: 'notifications',
    tags: ['feed', 'inbox', 'list', 'activity', 'in-app'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'FeedNotification[]', required: true, descriptionKey: 'items' },
      { name: 'title', type: 'string', default: "'Activity'", descriptionKey: 'title' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  In-app feed: what the user opens to catch up, so NO live region - announcing a
  list someone asked to read is noise (same rule as the panel). It's a <ul>, so a
  screen reader says "list, N items". Each row leads with a typed icon plus an
  sr-only word ("Success", "Warning") so the meaning never rides on colour, and
  the row is min-w-0 + flex so long text wraps rather than overflowing at 320px.
-->
<section aria-labelledby="feed-heading" class="w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
  <h2 id="feed-heading" class="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100">Activity</h2>
  <ul class="divide-y divide-gray-100 dark:divide-gray-800">
    <li class="flex gap-3 px-4 py-3">
      <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z" /></svg>
        <span class="sr-only">Success. </span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm text-gray-900 dark:text-gray-100">Deploy <span class="font-semibold">#914</span> finished in 42s</p>
        <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">2m ago</p>
      </div>
    </li>
    <li class="flex gap-3 px-4 py-3">
      <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10.9 3.6a1 1 0 0 0-1.8 0l-6 11A1 1 0 0 0 4 16h12a1 1 0 0 0 .9-1.4l-6-11ZM9 8a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V8Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" /></svg>
        <span class="sr-only">Warning. </span>
      </span>
      <div class="min-w-0 flex-1">
        <p class="text-sm text-gray-900 dark:text-gray-100">Usage is at 82% of your monthly quota</p>
        <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">1h ago</p>
      </div>
    </li>
    <!-- ...repeat per feed item -->
  </ul>
</section>`,
      react: `const TYPE_META = {
  success: {
    label: 'Success',
    tint: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  },
  info: {
    label: 'Update',
    tint: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    path: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z',
  },
  warning: {
    label: 'Warning',
    tint: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    path: 'M10.9 3.6a1 1 0 0 0-1.8 0l-6 11A1 1 0 0 0 4 16h12a1 1 0 0 0 .9-1.4l-6-11ZM9 8a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V8Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  },
};

// No live region: the user opened this feed, so nothing in it is an interruption.
export function NotificationInAppFeed({ items, title = 'Activity', className = '' }) {
  return (
    <section
      aria-labelledby="feed-heading"
      className={\`w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h2
        id="feed-heading"
        className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
      >
        {title}
      </h2>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item) => {
          const meta = TYPE_META[item.type] ?? TYPE_META.info;
          return (
            <li key={item.id} className="flex gap-3 px-4 py-3">
              <span className={\`flex h-9 w-9 flex-none items-center justify-center rounded-full \${meta.tint}\`}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d={meta.path} />
                </svg>
                <span className="sr-only">{meta.label}. </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
      typescript: `export type FeedNotificationType = 'success' | 'info' | 'warning';

export interface FeedNotification {
  id: string;
  type: FeedNotificationType;
  title: string;
  timestamp: string;
}

export interface NotificationInAppFeedProps {
  items: FeedNotification[];
  title?: string;
  className?: string;
}

const TYPE_META: Record<FeedNotificationType, { label: string; tint: string; path: string }> = {
  success: {
    label: 'Success',
    tint: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
    path: 'M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4Z',
  },
  info: {
    label: 'Update',
    tint: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    path: 'M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm1 4a1 1 0 0 0-2 0v4a1 1 0 0 0 2 0v-4Z',
  },
  warning: {
    label: 'Warning',
    tint: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    path: 'M10.9 3.6a1 1 0 0 0-1.8 0l-6 11A1 1 0 0 0 4 16h12a1 1 0 0 0 .9-1.4l-6-11ZM9 8a1 1 0 1 1 2 0v3a1 1 0 1 1-2 0V8Zm1 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z',
  },
};

export function NotificationInAppFeed({
  items,
  title = 'Activity',
  className = '',
}: NotificationInAppFeedProps): JSX.Element {
  return (
    <section
      aria-labelledby="feed-heading"
      className={\`w-full max-w-md rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <h2
        id="feed-heading"
        className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-gray-900 dark:border-gray-800 dark:text-gray-100"
      >
        {title}
      </h2>
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map((item: FeedNotification) => {
          const meta = TYPE_META[item.type];
          return (
            <li key={item.id} className="flex gap-3 px-4 py-3">
              <span className={\`flex h-9 w-9 flex-none items-center justify-center rounded-full \${meta.tint}\`}>
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d={meta.path} />
                </svg>
                <span className="sr-only">{meta.label}. </span>
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-900 dark:text-gray-100">{item.title}</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.timestamp}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'notification-grouped',
    category: 'notifications',
    tags: ['grouped', 'digest', 'avatars', 'summary', 'collapse'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'actors', type: 'GroupedActor[]', required: true, descriptionKey: 'actors' },
      { name: 'action', type: 'string', required: true, descriptionKey: 'action' },
      { name: 'target', type: 'string', descriptionKey: 'target' },
      { name: 'timestamp', type: 'string', descriptionKey: 'timestamp' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Grouped notification: N related events collapsed into one line ("Dana, Mateo and
  3 others commented"). The avatar stack is initials only - no network images - and
  each avatar carries the full name in its title/sr text so the group isn't
  colour-and-shape alone. min-w-0 + flex-wrap keeps the sentence wrapping cleanly
  at 320px instead of pushing the card wider than the screen.
-->
<article class="flex w-full max-w-md gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex flex-none -space-x-2">
    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 ring-2 ring-white dark:bg-indigo-900 dark:text-indigo-200 dark:ring-gray-900">DA</span>
    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700 ring-2 ring-white dark:bg-emerald-900 dark:text-emerald-200 dark:ring-gray-900">MO</span>
    <span class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-900">+3</span>
  </div>
  <div class="min-w-0 flex-1">
    <p class="text-sm text-gray-900 dark:text-gray-100">
      <span class="font-semibold">Dana, Mateo</span> and 3 others commented on <span class="font-semibold">Roadmap Q3</span>
    </p>
    <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">12m ago</p>
  </div>
</article>`,
      react: `function initialsOf(name) {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

const TINTS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
];

export function NotificationGrouped({ actors, action, target, timestamp, className = '' }) {
  const shown = actors.slice(0, 2);
  const overflow = actors.length - shown.length;
  const names = actors.map((a) => a.name);
  const lead =
    names.length <= 2
      ? names.join(' and ')
      : \`\${names[0]}, \${names[1]} and \${names.length - 2} others\`;

  return (
    <article
      className={\`flex w-full max-w-md gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex flex-none -space-x-2">
        {shown.map((actor, i) => (
          <span
            key={actor.name}
            title={actor.name}
            className={\`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-white dark:ring-gray-900 \${TINTS[i % TINTS.length]}\`}
          >
            {actor.initials ?? initialsOf(actor.name)}
          </span>
        ))}
        {overflow > 0 ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-900">
            +{overflow}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{lead}</span> {action}
          {target ? (
            <>
              {' '}
              <span className="font-semibold">{target}</span>
            </>
          ) : null}
        </p>
        {timestamp ? (
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
        ) : null}
      </div>
    </article>
  );
}`,
      typescript: `export interface GroupedActor {
  name: string;
  initials?: string;
}

export interface NotificationGroupedProps {
  actors: GroupedActor[];
  action: string;
  target?: string;
  timestamp?: string;
  className?: string;
}

const TINTS = [
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200',
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200',
  'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200',
] as const;

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function NotificationGrouped({
  actors,
  action,
  target,
  timestamp,
  className = '',
}: NotificationGroupedProps): JSX.Element {
  const shown = actors.slice(0, 2);
  const overflow = actors.length - shown.length;
  const names = actors.map((a) => a.name);
  const lead =
    names.length <= 2
      ? names.join(' and ')
      : \`\${names[0]}, \${names[1]} and \${names.length - 2} others\`;

  return (
    <article
      className={\`flex w-full max-w-md gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex flex-none -space-x-2">
        {shown.map((actor: GroupedActor, i: number) => (
          <span
            key={actor.name}
            title={actor.name}
            className={\`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-white dark:ring-gray-900 \${TINTS[i % TINTS.length]}\`}
          >
            {actor.initials ?? initialsOf(actor.name)}
          </span>
        ))}
        {overflow > 0 ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-700 ring-2 ring-white dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-900">
            +{overflow}
          </span>
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{lead}</span> {action}
          {target !== undefined ? (
            <>
              {' '}
              <span className="font-semibold">{target}</span>
            </>
          ) : null}
        </p>
        {timestamp !== undefined ? (
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
        ) : null}
      </div>
    </article>
  );
}`,
    },
  },
  {
    slug: 'notification-with-avatar',
    category: 'notifications',
    tags: ['avatar', 'row', 'unread', 'mention', 'initials'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'unread', labelKey: 'unread' },
      { id: 'read', labelKey: 'read' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'action', type: 'string', required: true, descriptionKey: 'action' },
      { name: 'timestamp', type: 'string', descriptionKey: 'timestamp' },
      { name: 'initials', type: 'string', descriptionKey: 'initials' },
      { name: 'unread', type: 'boolean', default: 'false', descriptionKey: 'unread' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Single notification with an actor avatar. The avatar is initials, not a remote
  image, so it always renders and never leaks a request. Unread is BOTH a dot and
  an sr-only "Unread" word - a coloured dot on its own is colour-only signalling.
  The row is flex + min-w-0 so the text wraps under the avatar at 320px.
-->
<div class="flex w-full max-w-md items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
  <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200" aria-hidden="true">DA</span>
  <div class="min-w-0 flex-1">
    <p class="text-sm text-gray-900 dark:text-gray-100"><span class="font-semibold">Dana Okoro</span> mentioned you in <span class="font-semibold">Sprint notes</span></p>
    <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">5m ago</p>
  </div>
  <span class="mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-600 dark:bg-blue-400" aria-hidden="true"></span>
  <span class="sr-only">Unread</span>
</div>`,
      react: `function initialsOf(name) {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function NotificationWithAvatar({
  name,
  action,
  timestamp,
  initials,
  unread = false,
  className = '',
}) {
  return (
    <div
      className={\`flex w-full max-w-md items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
      >
        {initials ?? initialsOf(name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{name}</span> {action}
        </p>
        {timestamp ? (
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
        ) : null}
      </div>
      {unread ? (
        <>
          <span
            className="mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-600 dark:bg-blue-400"
            aria-hidden="true"
          />
          <span className="sr-only">Unread</span>
        </>
      ) : null}
    </div>
  );
}`,
      typescript: `export interface NotificationWithAvatarProps {
  name: string;
  action: string;
  timestamp?: string;
  initials?: string;
  unread?: boolean;
  className?: string;
}

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function NotificationWithAvatar({
  name,
  action,
  timestamp,
  initials,
  unread = false,
  className = '',
}: NotificationWithAvatarProps): JSX.Element {
  return (
    <div
      className={\`flex w-full max-w-md items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200"
      >
        {initials ?? initialsOf(name)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-semibold">{name}</span> {action}
        </p>
        {timestamp !== undefined ? (
          <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{timestamp}</p>
        ) : null}
      </div>
      {unread ? (
        <>
          <span
            className="mt-1.5 h-2 w-2 flex-none rounded-full bg-blue-600 dark:bg-blue-400"
            aria-hidden="true"
          />
          <span className="sr-only">Unread</span>
        </>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-settings-list',
    category: 'notifications',
    tags: ['settings', 'preferences', 'toggle', 'switch', 'channels'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'NotificationSetting[]', required: true, descriptionKey: 'items' },
      { name: 'onToggle', type: '(id: string, enabled: boolean) => void', descriptionKey: 'onToggle' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Notification preferences. Each toggle is a real <button role="switch"> with
  aria-checked and its own accessible name - state is carried by the knob's
  position AND aria-checked, never by colour alone. The row is flex-col at the
  phone width and only becomes a justified sm:flex-row once there's space, so the
  label and switch never collide at 320px.
-->
<ul class="w-full max-w-md divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
  <li class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Product updates</p>
      <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">News about features and improvements.</p>
    </div>
    <button type="button" role="switch" aria-checked="true" aria-label="Product updates" class="relative inline-flex h-6 w-11 flex-none items-center rounded-full bg-blue-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-blue-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      <span class="inline-block h-5 w-5 translate-x-5 rounded-full bg-white shadow transition motion-reduce:transition-none"></span>
    </button>
  </li>
  <li class="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div class="min-w-0">
      <p class="text-sm font-medium text-gray-900 dark:text-gray-100">Security alerts</p>
      <p class="mt-0.5 text-xs text-gray-600 dark:text-gray-400">Sign-ins and password changes.</p>
    </div>
    <button type="button" role="switch" aria-checked="false" aria-label="Security alerts" class="relative inline-flex h-6 w-11 flex-none items-center rounded-full bg-gray-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-700 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      <span class="inline-block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition motion-reduce:transition-none"></span>
    </button>
  </li>
</ul>`,
      react: `export function NotificationSettingsList({ items, onToggle, className = '' }) {
  return (
    <ul
      className={\`w-full max-w-md divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
            {item.description ? (
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={item.enabled}
            aria-label={item.label}
            onClick={() => onToggle?.(item.id, !item.enabled)}
            className={\`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${item.enabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}\`}
          >
            <span
              className={\`inline-block h-5 w-5 rounded-full bg-white shadow transition motion-reduce:transition-none \${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}\`}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}`,
      typescript: `export interface NotificationSetting {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export interface NotificationSettingsListProps {
  items: NotificationSetting[];
  onToggle?: (id: string, enabled: boolean) => void;
  className?: string;
}

export function NotificationSettingsList({
  items,
  onToggle,
  className = '',
}: NotificationSettingsListProps): JSX.Element {
  return (
    <ul
      className={\`w-full max-w-md divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      {items.map((item: NotificationSetting) => (
        <li
          key={item.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
            {item.description !== undefined ? (
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-400">{item.description}</p>
            ) : null}
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={item.enabled}
            aria-label={item.label}
            onClick={() => onToggle?.(item.id, !item.enabled)}
            className={\`relative inline-flex h-6 w-11 flex-none items-center rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${item.enabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}\`}
          >
            <span
              className={\`inline-block h-5 w-5 rounded-full bg-white shadow transition motion-reduce:transition-none \${item.enabled ? 'translate-x-5' : 'translate-x-0.5'}\`}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'notification-permission-prompt',
    category: 'notifications',
    tags: ['permission', 'prompt', 'opt-in', 'push', 'consent'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Turn on notifications?'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'allowLabel', type: 'string', default: "'Allow'", descriptionKey: 'allowLabel' },
      { name: 'dismissLabel', type: 'string', default: "'Not now'", descriptionKey: 'dismissLabel' },
      { name: 'onAllow', type: '() => void', descriptionKey: 'onAllow' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A soft opt-in shown BEFORE you call the real Notification.requestPermission() -
  the browser prompt only fires once, so earn the yes here first. Both choices are
  real <button>s; the actions stack full-width at 320px (flex-col) and only sit
  side by side once there's room (sm:flex-row). The bell repeats what the copy says.
-->
<section aria-labelledby="perm-title" class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900">
  <div class="flex items-start gap-3">
    <span class="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
      <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" /></svg>
    </span>
    <div class="min-w-0 flex-1">
      <h2 id="perm-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Turn on notifications?</h2>
      <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Get notified about mentions and replies, even when this tab is closed.</p>
    </div>
  </div>
  <div class="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
    <button type="button" class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Not now</button>
    <button type="button" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Allow</button>
  </div>
</section>`,
      react: `export function NotificationPermissionPrompt({
  title = 'Turn on notifications?',
  description,
  allowLabel = 'Allow',
  dismissLabel = 'Not now',
  onAllow,
  onDismiss,
  className = '',
}) {
  return (
    <section
      aria-labelledby="perm-title"
      className={\`w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="perm-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {dismissLabel}
        </button>
        <button
          type="button"
          onClick={onAllow}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {allowLabel}
        </button>
      </div>
    </section>
  );
}`,
      typescript: `export interface NotificationPermissionPromptProps {
  title?: string;
  description?: string;
  allowLabel?: string;
  dismissLabel?: string;
  onAllow?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function NotificationPermissionPrompt({
  title = 'Turn on notifications?',
  description,
  allowLabel = 'Allow',
  dismissLabel = 'Not now',
  onAllow,
  onDismiss,
  className = '',
}: NotificationPermissionPromptProps): JSX.Element {
  return (
    <section
      aria-labelledby="perm-title"
      className={\`w-full max-w-sm rounded-xl border border-gray-200 bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="perm-title" className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          {description !== undefined ? (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onDismiss}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {dismissLabel}
        </button>
        <button
          type="button"
          onClick={onAllow}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {allowLabel}
        </button>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'notification-snackbar-action',
    category: 'notifications',
    tags: ['snackbar', 'undo', 'action', 'status', 'transient'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'no-dismiss', labelKey: 'noDismiss' },
    ],
    props: [
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'actionLabel', type: 'string', descriptionKey: 'actionLabel' },
      { name: 'onAction', type: '() => void', descriptionKey: 'onAction' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A dark snackbar carrying one reversible action ("Undo"). role="status" keeps it
  polite. The action is a real <button>, not the whole bar - a bar-wide click
  target is a trap for anyone who meant to read it. Width caps at the viewport with
  max-w-[calc(100vw-2rem)]; the message is min-w-0 flex-1 so it wraps rather than
  shoving the buttons off-screen at 320px.
-->
<div role="status" aria-live="polite" class="pointer-events-auto flex w-full max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:bg-gray-100">
  <p class="min-w-0 flex-1 text-sm text-gray-100 dark:text-gray-900">Message moved to Archive</p>
  <button type="button" class="flex-none rounded text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-blue-700 dark:hover:text-blue-600 dark:focus-visible:ring-blue-600">Undo</button>
  <button type="button" aria-label="Dismiss" class="flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-gray-500 dark:hover:bg-black/10 dark:hover:text-gray-900 dark:focus-visible:ring-blue-600">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" /></svg>
  </button>
</div>`,
      react: `export function NotificationSnackbarAction({
  message,
  actionLabel,
  onAction,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-auto flex w-full max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:bg-gray-100 \${className}\`}
    >
      <p className="min-w-0 flex-1 text-sm text-gray-100 dark:text-gray-900">{message}</p>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="flex-none rounded text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-blue-700 dark:hover:text-blue-600 dark:focus-visible:ring-blue-600"
        >
          {actionLabel}
        </button>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-gray-500 dark:hover:bg-black/10 dark:hover:text-gray-900 dark:focus-visible:ring-blue-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}`,
      typescript: `export interface NotificationSnackbarActionProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function NotificationSnackbarAction({
  message,
  actionLabel,
  onAction,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationSnackbarActionProps): JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      className={\`pointer-events-auto flex w-full max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] dark:bg-gray-100 \${className}\`}
    >
      <p className="min-w-0 flex-1 text-sm text-gray-100 dark:text-gray-900">{message}</p>
      {actionLabel !== undefined ? (
        <button
          type="button"
          onClick={onAction}
          className="flex-none rounded text-sm font-semibold text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-blue-700 dark:hover:text-blue-600 dark:focus-visible:ring-blue-600"
        >
          {actionLabel}
        </button>
      ) : null}
      {onDismiss !== undefined ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-md text-gray-400 transition hover:bg-white/10 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 motion-reduce:transition-none dark:text-gray-500 dark:hover:bg-black/10 dark:hover:text-gray-900 dark:focus-visible:ring-blue-600"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-banner-gradient',
    category: 'notifications',
    tags: ['banner', 'gradient', 'announcement', 'promo', 'dismissible'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'no-cta', labelKey: 'noCta' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'ctaLabel', type: 'string', descriptionKey: 'ctaLabel' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'onDismiss', type: '() => void', descriptionKey: 'onDismiss' },
      { name: 'dismissLabel', type: 'string', default: "'Dismiss'", descriptionKey: 'dismissLabel' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Announcement banner on a gradient. This is a marketing message, not a transient
  event, so it carries no live region - it's here on load, not pushed at you. Text
  is solid white on a saturated indigo->violet fill (well past AA), and an icon
  sits alongside so the meaning survives without colour. It stacks (flex-col) at
  320px and lays out as a row once there's room; the close is a real <button>.
-->
<div class="relative flex flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white sm:flex-row sm:items-center sm:gap-4">
  <span class="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15">
    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" /></svg>
  </span>
  <div class="min-w-0 flex-1">
    <p class="text-sm font-semibold">Realtime alerts are live</p>
    <p class="mt-0.5 text-sm text-white/90">Get pinged the moment a deploy finishes or fails.</p>
  </div>
  <button type="button" class="flex-none rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 motion-reduce:transition-none">Explore</button>
  <button type="button" aria-label="Dismiss" class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:static">
    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" /></svg>
  </button>
</div>`,
      react: `export function NotificationBannerGradient({
  title,
  message,
  ctaLabel,
  onClick,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}) {
  return (
    <div
      className={\`relative flex flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white sm:flex-row sm:items-center sm:gap-4 \${className}\`}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {message ? <p className="mt-0.5 text-sm text-white/90">{message}</p> : null}
      </div>
      {ctaLabel ? (
        <button
          type="button"
          onClick={onClick}
          className="flex-none rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 motion-reduce:transition-none"
        >
          {ctaLabel}
        </button>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:static"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}`,
      typescript: `export interface NotificationBannerGradientProps {
  title: string;
  message?: string;
  ctaLabel?: string;
  onClick?: () => void;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
}

export function NotificationBannerGradient({
  title,
  message,
  ctaLabel,
  onClick,
  onDismiss,
  dismissLabel = 'Dismiss',
  className = '',
}: NotificationBannerGradientProps): JSX.Element {
  return (
    <div
      className={\`relative flex flex-col gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-4 text-white sm:flex-row sm:items-center sm:gap-4 \${className}\`}
    >
      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-white/15">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        {message !== undefined ? <p className="mt-0.5 text-sm text-white/90">{message}</p> : null}
      </div>
      {ctaLabel !== undefined ? (
        <button
          type="button"
          onClick={onClick}
          className="flex-none rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-600 motion-reduce:transition-none"
        >
          {ctaLabel}
        </button>
      ) : null}
      {onDismiss !== undefined ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:static"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6.3 6.3a1 1 0 0 1 1.4 0L10 8.6l2.3-2.3a1 1 0 1 1 1.4 1.4L11.4 10l2.3 2.3a1 1 0 0 1-1.4 1.4L10 11.4l-2.3 2.3a1 1 0 0 1-1.4-1.4L8.6 10 6.3 7.7a1 1 0 0 1 0-1.4Z" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'notification-empty-state',
    category: 'notifications',
    tags: ['empty-state', 'inbox', 'zero-state', 'placeholder', 'illustration'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'with-action', labelKey: 'withAction' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'You're all caught up'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'actionLabel', type: 'string', descriptionKey: 'actionLabel' },
      { name: 'onAction', type: '() => void', descriptionKey: 'onAction' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The empty inbox. The illustration is an inline SVG - no network image to fail -
  and it's aria-hidden because the heading already says everything; a screen reader
  reading "bell" here would only add noise. Centred, fluid, and comfortable from
  320px up. The optional action is a real <button>.
-->
<div class="flex w-full max-w-sm flex-col items-center justify-center gap-3 px-6 py-10 text-center">
  <span class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500" aria-hidden="true">
    <svg class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" /></svg>
  </span>
  <div>
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">You're all caught up</p>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">New notifications will show up here.</p>
  </div>
  <button type="button" class="mt-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Notification settings</button>
</div>`,
      react: `export function NotificationEmptyState({
  title = "You're all caught up",
  description = 'New notifications will show up here.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div
      className={\`flex w-full max-w-sm flex-col items-center justify-center gap-3 px-6 py-10 text-center \${className}\`}
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
      >
        <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}`,
      typescript: `export interface NotificationEmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function NotificationEmptyState({
  title = "You're all caught up",
  description = 'New notifications will show up here.',
  actionLabel,
  onAction,
  className = '',
}: NotificationEmptyStateProps): JSX.Element {
  return (
    <div
      className={\`flex w-full max-w-sm flex-col items-center justify-center gap-3 px-6 py-10 text-center \${className}\`}
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
      >
        <svg className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a5 5 0 0 0-5 5v3.6l-1.3 2.6A1 1 0 0 0 4.6 15h10.8a1 1 0 0 0 .9-1.8L15 10.6V7a5 5 0 0 0-5-5Zm0 16a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 10 18Z" />
        </svg>
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
      {actionLabel !== undefined ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}`,
    },
  },
];
