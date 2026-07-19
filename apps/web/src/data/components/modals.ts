import type { ComponentEntry } from './types';

/**
 * Modals category.
 *
 * Every entry here is an overlay, and an overlay is defined by the things it
 * takes away from the user rather than the box it draws: while it is up, the
 * page behind it must not scroll, must not be reachable by Tab, and must not be
 * what Escape talks to. So the shared contract across all five is not a look -
 * it is `role="dialog"` + `aria-modal="true"` + `aria-labelledby`, a real focus
 * trap, Escape, focus restored to the trigger on close, a scroll lock, and a
 * backdrop that dismisses. A modal missing any one of those is not a styling
 * bug, it is a keyboard user stranded behind a box they cannot leave.
 *
 * They are built on a plain positioned element rather than `<dialog>` on
 * purpose: `<dialog>` hands you the trap and the top layer for free, but it also
 * hides the mechanism, and these entries exist to be read and adapted. The
 * FOCUSABLE selector and the Tab-wrap are the component.
 */
export const modalsComponents: ComponentEntry[] = [
  {
    slug: 'modal-basic',
    category: 'modals',
    tags: ['modal', 'dialog', 'overlay', 'focus-trap', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-14',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 3120, copies: 918, downloads: 240 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'dismissLabel', type: 'string', default: "'Close'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The panel - not the backdrop - carries the dialog semantics. aria-modal="true"
  is what tells a screen reader the rest of the document is inert; it does NOT
  implement that, which is why the script below still has to trap Tab. The two
  together are the component. Either alone is a half-measure.

  aria-labelledby points at the visible <h2>, so the dialog announces with the
  same name a sighted user reads. Do not duplicate it into an aria-label.
-->
<button class="modal-trigger" type="button" data-modal-open="basic-modal">
  Share project
</button>

<div class="modal" id="basic-modal" hidden>
  <div class="modal__backdrop" data-modal-close></div>
  <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="basic-modal-title">
    <div class="modal__head">
      <h2 class="modal__title" id="basic-modal-title">Share project</h2>
      <button class="modal__close" type="button" aria-label="Close" data-modal-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
    <p class="modal__body">
      Anyone with the link can view this project. Members of your workspace keep
      the access they already have.
    </p>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--primary" type="button" data-modal-close>Done</button>
    </div>
  </div>
</div>

<script>
  (function () {
    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var root = document.getElementById('basic-modal');
    var trigger = document.querySelector('[data-modal-open="basic-modal"]');
    var panel = root.querySelector('.modal__panel');
    var restore = null;

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE));
    }

    function open() {
      // Remember who summoned us before moving focus, not after.
      restore = document.activeElement;
      root.hidden = false;
      // Scrolling the page behind a modal detaches the backdrop from the thing
      // it is meant to be blocking. Lock it.
      document.body.style.overflow = 'hidden';
      var first = focusables()[0];
      if (first) first.focus();
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = '';
      // Without this the keyboard user is dumped at the top of the document
      // with no idea where they are. Restoring focus is not a nicety.
      if (restore && typeof restore.focus === 'function') restore.focus();
    }

    trigger.addEventListener('click', open);
    Array.prototype.forEach.call(root.querySelectorAll('[data-modal-close]'), function (el) {
      el.addEventListener('click', close);
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;

      // The trap. Tab off the last control wraps to the first, Shift+Tab off
      // the first wraps to the last. Without it, focus walks straight out into
      // the page this dialog claims to be blocking.
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  })();
</script>`,
      css: `.modal[hidden] {
  display: none;
}

.modal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal__panel {
  position: relative;
  width: min(100%, 28rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.modal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #6b7280;
  cursor: pointer;
}

.modal__close svg {
  width: 1rem;
  height: 1rem;
}

.modal__close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.modal__body {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.modal__btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.modal__btn--primary {
  border-color: transparent;
  background-color: #2563eb;
  color: #fff;
}

.modal__close:focus-visible,
.modal__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/*
 * The panel is a surface of its own - it paints a background and inherits
 * nothing from the page, so every colour on it has to be restated for dark.
 * The backdrop does not: black at 50% works over either theme, and lightening
 * it for dark mode only makes the page behind it harder to ignore.
 */
@media (prefers-color-scheme: dark) {
  .modal__panel {
    border-color: #1f2937;
    background-color: #111827;
  }

  .modal__title {
    color: #f3f4f6;
  }

  .modal__body {
    color: #9ca3af;
  }

  .modal__close {
    color: #9ca3af;
  }

  .modal__close:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .modal__btn {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .modal__btn--primary {
    border-color: transparent;
    background-color: #2563eb;
    color: #fff;
  }

  .modal__close:focus-visible,
  .modal__btn:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="basic-modal-title"
    class="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex items-start justify-between gap-4">
      <h2 id="basic-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Share project
      </h2>
      <button
        type="button"
        aria-label="Close"
        data-modal-close
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
    <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Anyone with the link can view this project. Members of your workspace keep
      the access they already have.
    </p>
    <div class="mt-6 flex justify-end gap-2">
      <button
        type="button"
        data-modal-close
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Done
      </button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalBasic({ open, title, children, dismissLabel = 'Close', onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    // Capture the trigger before we steal focus from it.
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      {/* Backdrop. A click here dismisses - the standard "I'm done" gesture. */}
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalBasicProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
  className?: string;
}

// 'use client' is not optional here: a focus trap is a DOM measurement and a
// keydown listener. There is no server rendering of "where is focus".
export function ModalBasic({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
  className = '',
}: ModalBasicProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 \${className}\`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Everything focusable a dialog can plausibly contain. The \`:not([disabled])\`
 * clauses matter - a disabled control is not a tab stop, and treating one as
 * the "last" element makes the wrap point silently wrong.
 */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalBasicProps {
  /** Mount state. The dialog renders nothing when false. */
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  /** Called by Escape, the close button and a backdrop click alike. */
  onDismiss: () => void;
  className?: string;
}

export function ModalBasic({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
  className = '',
}: ModalBasicProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    // The cleanup is the restore path: it runs on close and on unmount, so a
    // dialog torn down by a route change still hands focus back.
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 \${className}\`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-confirm',
    category: 'modals',
    tags: ['modal', 'confirm', 'destructive', 'alertdialog', 'a11y'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-05-02',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 2480, copies: 731, downloads: 196 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'text', labelKey: 'text' },
    ],
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'ctaLabel', type: 'string', default: "'Delete'", descriptionKey: 'ctaLabel' },
      { name: 'dismissLabel', type: 'string', default: "'Cancel'", descriptionKey: 'dismissLabel' },
      { name: 'onConfirm', type: '() => void', required: true, descriptionKey: 'onConfirm' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      html: `<!--
  A confirm is an alertdialog, not a dialog: the difference tells a screen
  reader this interrupted the user with something consequential rather than
  merely opening a panel. aria-describedby points at the sentence that says what
  will be destroyed, so the dialog announces its name AND its stakes.

  Note which button gets initial focus. The trap opens on Cancel - the SAFE
  action - because a modal that steals focus and lands it on "Delete" turns a
  reflexive Enter into data loss. Autofocus goes to the way out, never the
  irreversible thing. Red is not a safeguard; it means nothing to a screen
  reader and little to a red-blind user. Focus order is the safeguard.
-->
<button class="cmodal-trigger" type="button" data-cmodal-open>Delete workspace</button>

<div class="cmodal" id="confirm-modal" hidden>
  <div class="cmodal__backdrop" data-cmodal-close></div>
  <div
    class="cmodal__panel"
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="confirm-modal-title"
    aria-describedby="confirm-modal-desc"
  >
    <div class="cmodal__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
    </div>
    <h2 class="cmodal__title" id="confirm-modal-title">Delete workspace?</h2>
    <p class="cmodal__desc" id="confirm-modal-desc">
      This deletes 428 projects and removes 12 members. It cannot be undone.
    </p>
    <div class="cmodal__actions">
      <button class="cmodal__btn" type="button" data-cmodal-cancel data-cmodal-close>Cancel</button>
      <button class="cmodal__btn cmodal__btn--danger" type="button" data-cmodal-confirm>Delete</button>
    </div>
  </div>
</div>

<script>
  (function () {
    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var root = document.getElementById('confirm-modal');
    var trigger = document.querySelector('[data-cmodal-open]');
    var panel = root.querySelector('.cmodal__panel');
    var cancel = root.querySelector('[data-cmodal-cancel]');
    var confirm = root.querySelector('[data-cmodal-confirm]');
    var restore = null;

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE));
    }

    function open() {
      restore = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      // Explicitly Cancel - NOT focusables()[0], which would drift to whatever
      // markup happens to come first the next time this panel is edited.
      cancel.focus();
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = '';
      if (restore && typeof restore.focus === 'function') restore.focus();
    }

    trigger.addEventListener('click', open);
    Array.prototype.forEach.call(root.querySelectorAll('[data-cmodal-close]'), function (el) {
      el.addEventListener('click', close);
    });
    confirm.addEventListener('click', function () {
      // Do the destructive work here, then close.
      close();
    });

    root.addEventListener('keydown', function (event) {
      // Escape is a cancel, never a confirm. An overlay's dismiss gesture must
      // always resolve to the harmless outcome.
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  })();
</script>`,
      css: `.cmodal[hidden] {
  display: none;
}

.cmodal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.cmodal__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.cmodal__panel {
  position: relative;
  width: min(100%, 24rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  text-align: center;
}

.cmodal__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background-color: #fee2e2;
  /*
   * #b91c1c on #fee2e2 clears AA. The lighter #ef4444 you would reach for
   * first does not - and this glyph is the only thing signalling danger
   * before the text is read.
   */
  color: #b91c1c;
}

.cmodal__icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.cmodal__title {
  margin: 1rem 0 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.cmodal__desc {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.cmodal__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.cmodal__btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.cmodal__btn--danger {
  border-color: transparent;
  background-color: #dc2626;
  color: #fff;
}

.cmodal__btn--danger:hover {
  background-color: #b91c1c;
}

.cmodal__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.cmodal__btn--danger:focus-visible {
  outline-color: #dc2626;
}

@media (prefers-color-scheme: dark) {
  .cmodal__panel {
    border-color: #1f2937;
    background-color: #111827;
  }

  .cmodal__title {
    color: #f3f4f6;
  }

  .cmodal__desc {
    color: #9ca3af;
  }

  /* The light tint goes near-black and the glyph goes light - the same
     contrast relationship, inverted, rather than the same two colours. */
  .cmodal__icon {
    background-color: rgba(127, 29, 29, 0.4);
    color: #fca5a5;
  }

  .cmodal__btn {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .cmodal__btn--danger {
    border-color: transparent;
    background-color: #dc2626;
    color: #fff;
  }

  .cmodal__btn:focus-visible {
    outline-color: #60a5fa;
  }

  .cmodal__btn--danger:focus-visible {
    outline-color: #f87171;
  }
}`,
      tailwind: `<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-cmodal-close></div>
  <div
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="confirm-modal-title"
    aria-describedby="confirm-modal-desc"
    class="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" aria-hidden="true">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
    </div>
    <h2 id="confirm-modal-title" class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
      Delete workspace?
    </h2>
    <p id="confirm-modal-desc" class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      This deletes 428 projects and removes 12 members. It cannot be undone.
    </p>
    <div class="mt-6 flex gap-2">
      <!-- Cancel is first in the DOM and takes initial focus. -->
      <button
        type="button"
        data-cmodal-cancel
        class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Cancel
      </button>
      <button
        type="button"
        data-cmodal-confirm
        class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
      >
        Delete
      </button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalConfirm({
  open,
  title,
  message,
  ctaLabel = 'Delete',
  dismissLabel = 'Cancel',
  onConfirm,
  onDismiss,
}) {
  const panelRef = useRef(null);
  const cancelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    // The safe action, by name. Never "the first focusable".
    cancelRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalConfirmProps {
  open: boolean;
  title: string;
  message: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ModalConfirm({
  open,
  title,
  message,
  ctaLabel = 'Delete',
  dismissLabel = 'Cancel',
  onConfirm,
  onDismiss,
}: ModalConfirmProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * \`onConfirm\` and \`onDismiss\` are separate required props rather than one
 * \`onClose(confirmed: boolean)\`. A single callback invites the caller to branch
 * on a boolean and get the branch backwards; two callbacks make deleting on
 * cancel something you have to write on purpose.
 */
export interface ModalConfirmProps {
  open: boolean;
  title: string;
  /** The stakes, in a sentence. Wired to aria-describedby - say what is lost. */
  message: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function ModalConfirm({
  open,
  title,
  message,
  ctaLabel = 'Delete',
  dismissLabel = 'Cancel',
  onConfirm,
  onDismiss,
}: ModalConfirmProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    cancelRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
          aria-hidden="true"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            focusable="false"
          >
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onDismiss}
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-form',
    category: 'modals',
    tags: ['modal', 'form', 'dialog', 'submit', 'focus-trap'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-27',
    updatedAt: '2026-07-05',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1960, copies: 552, downloads: 144 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'ctaLabel', type: 'string', default: "'Create'", descriptionKey: 'ctaLabel' },
      { name: 'dismissLabel', type: 'string', default: "'Cancel'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
      {
        name: 'onSubmit',
        type: '(draft: ProjectDraft) => void',
        descriptionKey: 'onSubmit',
        example: '(draft) => createProject(draft)',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A form in a dialog is still a form: the submit button is type="submit" inside a
  real <form>, so Enter from any field submits and the browser's own required/
  type validation runs before your handler does. Wiring the primary action as a
  type="button" with an onclick is the common mistake here - it silently breaks
  Enter-to-submit for everyone and validation for everyone.

  Initial focus goes to the first FIELD, not the close button: the reason this
  dialog opened is that the user intends to type.
-->
<button class="fmodal-trigger" type="button" data-fmodal-open>New project</button>

<div class="fmodal" id="form-modal" hidden>
  <div class="fmodal__backdrop" data-fmodal-close></div>
  <div class="fmodal__panel" role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
    <h2 class="fmodal__title" id="form-modal-title">New project</h2>
    <form class="fmodal__form" id="form-modal-form">
      <div class="fmodal__field">
        <label class="fmodal__label" for="form-modal-name">Project name</label>
        <input class="fmodal__input" id="form-modal-name" name="name" type="text" required placeholder="Orbit redesign" />
      </div>
      <div class="fmodal__field">
        <label class="fmodal__label" for="form-modal-desc">Description</label>
        <textarea class="fmodal__input" id="form-modal-desc" name="description" rows="3" placeholder="What is this for?"></textarea>
      </div>
      <div class="fmodal__actions">
        <button class="fmodal__btn" type="button" data-fmodal-close>Cancel</button>
        <button class="fmodal__btn fmodal__btn--primary" type="submit">Create</button>
      </div>
    </form>
  </div>
</div>

<script>
  (function () {
    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var root = document.getElementById('form-modal');
    var trigger = document.querySelector('[data-fmodal-open]');
    var panel = root.querySelector('.fmodal__panel');
    var form = document.getElementById('form-modal-form');
    var firstField = document.getElementById('form-modal-name');
    var restore = null;

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE));
    }

    function open() {
      restore = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      firstField.focus();
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = '';
      if (restore && typeof restore.focus === 'function') restore.focus();
    }

    trigger.addEventListener('click', open);
    Array.prototype.forEach.call(root.querySelectorAll('[data-fmodal-close]'), function (el) {
      el.addEventListener('click', close);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      // Submitting is a successful exit, so it closes and resets - a dialog
      // reopened with the last submission still in it reads as a failure.
      close();
      form.reset();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  })();
</script>`,
      css: `.fmodal[hidden] {
  display: none;
}

.fmodal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.fmodal__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.fmodal__panel {
  position: relative;
  width: min(100%, 30rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.fmodal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.fmodal__form {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.fmodal__field {
  display: grid;
  gap: 0.375rem;
}

.fmodal__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.fmodal__input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #111827;
  font: inherit;
  font-size: 0.875rem;
}

.fmodal__input::placeholder {
  /* #6b7280 is the lightest grey that still clears 4.5:1 on white. */
  color: #6b7280;
}

.fmodal__input:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: transparent;
}

.fmodal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.fmodal__btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.fmodal__btn--primary {
  border-color: transparent;
  background-color: #2563eb;
  color: #fff;
}

.fmodal__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .fmodal__panel {
    border-color: #1f2937;
    background-color: #111827;
  }

  .fmodal__title {
    color: #f3f4f6;
  }

  .fmodal__label {
    color: #d1d5db;
  }

  /* The field goes DARKER than the panel, not lighter - an inset well reads as
     editable, a raised patch reads as a card. */
  .fmodal__input {
    border-color: #374151;
    background-color: #030712;
    color: #f3f4f6;
  }

  .fmodal__input::placeholder {
    color: #9ca3af;
  }

  .fmodal__input:focus-visible {
    outline-color: #60a5fa;
  }

  .fmodal__btn {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .fmodal__btn--primary {
    border-color: transparent;
    background-color: #2563eb;
    color: #fff;
  }

  .fmodal__btn:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-fmodal-close></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="form-modal-title"
    class="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
  >
    <h2 id="form-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
      New project
    </h2>
    <form class="mt-5 grid gap-4">
      <div class="grid gap-1.5">
        <label for="form-modal-name" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Project name
        </label>
        <input
          id="form-modal-name"
          name="name"
          type="text"
          required
          placeholder="Orbit redesign"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        />
      </div>
      <div class="grid gap-1.5">
        <label for="form-modal-desc" class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="form-modal-desc"
          name="description"
          rows="3"
          placeholder="What is this for?"
          class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
        ></textarea>
      </div>
      <div class="mt-1 flex justify-end gap-2">
        <button
          type="button"
          data-fmodal-close
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalForm({
  open,
  title,
  ctaLabel = 'Create',
  dismissLabel = 'Cancel',
  onDismiss,
  onSubmit,
}) {
  const panelRef = useRef(null);
  const firstFieldRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const nameId = useId();
  const descId = useId();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    // The user opened this to type. Land them in the field.
    firstFieldRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function handleSubmit(event) {
    // A real <form> with a type="submit" button, so Enter from any field works
    // and the browser validates \`required\` before we ever see the event.
    event.preventDefault();
    onSubmit?.({ name, description });
    setName('');
    setDescription('');
    onDismiss();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor={nameId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project name
            </label>
            <input
              ref={firstFieldRef}
              id={nameId}
              name="name"
              type="text"
              required
              placeholder="Orbit redesign"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={descId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id={descId}
              name="description"
              rows={3}
              placeholder="What is this for?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {dismissLabel}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ProjectDraft {
  name: string;
  description: string;
}

interface ModalFormProps {
  open: boolean;
  title: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onDismiss: () => void;
  onSubmit?: (draft: ProjectDraft) => void;
  className?: string;
}

export function ModalForm({
  open,
  title,
  ctaLabel = 'Create',
  dismissLabel = 'Cancel',
  onDismiss,
  onSubmit,
  className = '',
}: ModalFormProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const nameId = useId();
  const descId = useId();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ name, description });
    setName('');
    setDescription('');
    onDismiss();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 \${className}\`}
      >
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor={nameId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project name
            </label>
            <input
              ref={firstFieldRef}
              id={nameId}
              name="name"
              type="text"
              required
              placeholder="Orbit redesign"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={descId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id={descId}
              name="description"
              rows={3}
              placeholder="What is this for?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {dismissLabel}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ProjectDraft {
  name: string;
  description: string;
}

export interface ModalFormProps {
  open: boolean;
  title: string;
  ctaLabel?: string;
  dismissLabel?: string;
  onDismiss: () => void;
  /** Receives the draft on a valid submit. The dialog closes either way. */
  onSubmit?: (draft: ProjectDraft) => void;
  className?: string;
}

export function ModalForm({
  open,
  title,
  ctaLabel = 'Create',
  dismissLabel = 'Cancel',
  onDismiss,
  onSubmit,
  className = '',
}: ModalFormProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const nameId = useId();
  const descId = useId();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    firstFieldRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.({ name, description });
    setName('');
    setDescription('');
    onDismiss();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900 \${className}\`}
      >
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
          <div className="grid gap-1.5">
            <label htmlFor={nameId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Project name
            </label>
            <input
              ref={firstFieldRef}
              id={nameId}
              name="name"
              type="text"
              required
              placeholder="Orbit redesign"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor={descId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id={descId}
              name="description"
              rows={3}
              placeholder="What is this for?"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400"
            />
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {dismissLabel}
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {ctaLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-fullscreen',
    category: 'modals',
    tags: ['modal', 'fullscreen', 'responsive', 'mobile', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-16',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1140, copies: 296, downloads: 78 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'dismissLabel', type: 'string', default: "'Close'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  One dialog, two shapes. On a phone it takes the whole viewport - a centred
  card with 16px of dimmed backdrop around it wastes the only screen there is,
  and a long body inside one scrolls in a cramped box instead of the page. From
  sm: up it collapses back to a normal centred panel.

  The header is sticky and the BODY scrolls, not the panel: the title and the
  close button must stay reachable no matter how far down the content the user
  is. A fullscreen dialog whose only exit has scrolled off the top is a trap
  with extra steps.
-->
<button class="fsmodal-trigger" type="button" data-fsmodal-open>Open settings</button>

<div class="fsmodal" id="fs-modal" hidden>
  <div class="fsmodal__backdrop" data-fsmodal-close></div>
  <div class="fsmodal__panel" role="dialog" aria-modal="true" aria-labelledby="fs-modal-title">
    <header class="fsmodal__head">
      <h2 class="fsmodal__title" id="fs-modal-title">Workspace settings</h2>
      <button class="fsmodal__close" type="button" aria-label="Close" data-fsmodal-close>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </header>
    <div class="fsmodal__body">
      <p>Long-form settings content goes here. This region is what scrolls.</p>
    </div>
    <footer class="fsmodal__foot">
      <button class="fsmodal__btn" type="button" data-fsmodal-close>Cancel</button>
      <button class="fsmodal__btn fsmodal__btn--primary" type="button" data-fsmodal-close>Save changes</button>
    </footer>
  </div>
</div>

<script>
  (function () {
    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var root = document.getElementById('fs-modal');
    var trigger = document.querySelector('[data-fsmodal-open]');
    var panel = root.querySelector('.fsmodal__panel');
    var restore = null;

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE));
    }

    function open() {
      restore = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      var first = focusables()[0];
      if (first) first.focus();
    }

    function close() {
      root.hidden = true;
      document.body.style.overflow = '';
      if (restore && typeof restore.focus === 'function') restore.focus();
    }

    trigger.addEventListener('click', open);
    Array.prototype.forEach.call(root.querySelectorAll('[data-fsmodal-close]'), function (el) {
      el.addEventListener('click', close);
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  })();
</script>`,
      css: `.fsmodal[hidden] {
  display: none;
}

.fsmodal {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: stretch;
  justify-content: center;
}

.fsmodal__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

/*
 * Mobile first: the panel IS the viewport. No radius, no border, no margin -
 * anything that reads as "a card floating on a page" is a lie at this size.
 */
.fsmodal__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* dvh, not vh: on mobile Safari vh includes the collapsing URL bar, so a
     100vh dialog puts its footer under the browser chrome. */
  height: 100dvh;
  background-color: #fff;
}

.fsmodal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex: none;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
}

.fsmodal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.fsmodal__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 0;
  border-radius: 0.5rem;
  background-color: transparent;
  color: #6b7280;
  cursor: pointer;
}

.fsmodal__close svg {
  width: 1.125rem;
  height: 1.125rem;
}

.fsmodal__close:hover {
  background-color: #f3f4f6;
  color: #111827;
}

/* The scroll region. min-height: 0 is what lets a flex child actually shrink
   and scroll instead of pushing the footer off the bottom. */
.fsmodal__body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.fsmodal__foot {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  flex: none;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e5e7eb;
}

.fsmodal__btn {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.fsmodal__btn--primary {
  border-color: transparent;
  background-color: #2563eb;
  color: #fff;
}

.fsmodal__close:focus-visible,
.fsmodal__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* From a tablet up there is room to spare, so it becomes an ordinary dialog. */
@media (min-width: 640px) {
  .fsmodal {
    align-items: center;
    padding: 1rem;
  }

  .fsmodal__panel {
    width: min(100%, 36rem);
    height: auto;
    max-height: min(85dvh, 44rem);
    border: 1px solid #e5e7eb;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }
}

@media (prefers-color-scheme: dark) {
  .fsmodal__panel {
    background-color: #111827;
    border-color: #1f2937;
  }

  .fsmodal__head,
  .fsmodal__foot {
    border-color: #1f2937;
  }

  .fsmodal__title {
    color: #f3f4f6;
  }

  .fsmodal__body {
    color: #9ca3af;
  }

  .fsmodal__close {
    color: #9ca3af;
  }

  .fsmodal__close:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .fsmodal__btn {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .fsmodal__btn--primary {
    border-color: transparent;
    background-color: #2563eb;
    color: #fff;
  }

  .fsmodal__close:focus-visible,
  .fsmodal__btn:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<!-- Every fullscreen trait is the mobile base; sm: undoes it into a card. -->
<div class="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-4">
  <div class="absolute inset-0 bg-black/50" data-fsmodal-close></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="fs-modal-title"
    class="relative flex h-[100dvh] w-full flex-col bg-white sm:h-auto sm:max-h-[min(85dvh,44rem)] sm:max-w-xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:bg-gray-900 dark:sm:border-gray-800"
  >
    <header class="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <h2 id="fs-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
        Workspace settings
      </h2>
      <button
        type="button"
        aria-label="Close"
        data-fsmodal-close
        class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </header>
    <!-- min-h-0 is load-bearing: without it this flex child refuses to shrink
         and shoves the footer off the bottom instead of scrolling. -->
    <div class="min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      <p>Long-form settings content goes here. This region is what scrolls.</p>
    </div>
    <footer class="flex flex-none justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
      <button
        type="button"
        data-fsmodal-close
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Cancel
      </button>
      <button
        type="button"
        data-fsmodal-close
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Save changes
      </button>
    </footer>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalFullscreen({ open, title, children, dismissLabel = 'Close', onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-4"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[100dvh] w-full flex-col bg-white sm:h-auto sm:max-h-[min(85dvh,44rem)] sm:max-w-xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:bg-gray-900 dark:sm:border-gray-800"
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <footer className="flex flex-none justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalFullscreenProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
  className?: string;
}

export function ModalFullscreen({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
  className = '',
}: ModalFullscreenProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-4"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative flex h-[100dvh] w-full flex-col bg-white sm:h-auto sm:max-h-[min(85dvh,44rem)] sm:max-w-xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:bg-gray-900 dark:sm:border-gray-800 \${className}\`}
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <footer className="flex flex-none justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalFullscreenProps {
  open: boolean;
  title: string;
  /** Rendered into the scroll region between the sticky header and footer. */
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
  className?: string;
}

export function ModalFullscreen({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
  className = '',
}: ModalFullscreenProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-4"
      onKeyDown={onKeyDown}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative flex h-[100dvh] w-full flex-col bg-white sm:h-auto sm:max-h-[min(85dvh,44rem)] sm:max-w-xl sm:overflow-hidden sm:rounded-2xl sm:border sm:border-gray-200 sm:shadow-2xl dark:bg-gray-900 dark:sm:border-gray-800 \${className}\`}
      >
        <header className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
          <button
            type="button"
            aria-label={dismissLabel}
            onClick={onDismiss}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <footer className="flex flex-none justify-end gap-2 border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Save changes
          </button>
        </footer>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-drawer-bottom',
    category: 'modals',
    tags: ['drawer', 'sheet', 'bottom', 'modal', 'mobile'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-30',
    updatedAt: '2026-07-15',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1420, copies: 388, downloads: 102 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'dismissLabel', type: 'string', default: "'Close'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A bottom sheet is a modal dialog that happens to arrive from below - it is not
  a lesser thing because it does not cover the screen. Same role="dialog", same
  aria-modal, same trap, same Escape, same restore.

  The grabber bar is aria-hidden: it is a 36px affordance that says "this came
  from the bottom edge", and announcing "image" or an empty div to a screen
  reader adds nothing the dialog's name does not already carry.

  The slide is a transform, not a height animation - height cannot be composited
  and janks on the exact low-end phones this pattern targets. It is skipped
  entirely under prefers-reduced-motion, where a sheet flying up the viewport is
  precisely the vestibular trigger the setting exists to switch off.
-->
<button class="sheet-trigger" type="button" data-sheet-open>Choose a plan</button>

<div class="sheet" id="bottom-sheet" hidden>
  <div class="sheet__backdrop" data-sheet-close></div>
  <div class="sheet__panel" role="dialog" aria-modal="true" aria-labelledby="bottom-sheet-title">
    <div class="sheet__grabber" aria-hidden="true"></div>
    <h2 class="sheet__title" id="bottom-sheet-title">Choose a plan</h2>
    <p class="sheet__body">Switch at any time. Changes take effect on the next invoice.</p>
    <div class="sheet__actions">
      <button class="sheet__btn sheet__btn--primary" type="button" data-sheet-close>Continue</button>
      <button class="sheet__btn" type="button" data-sheet-close>Not now</button>
    </div>
  </div>
</div>

<script>
  (function () {
    var FOCUSABLE =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    var root = document.getElementById('bottom-sheet');
    var trigger = document.querySelector('[data-sheet-open]');
    var panel = root.querySelector('.sheet__panel');
    var restore = null;

    function focusables() {
      return Array.prototype.slice.call(panel.querySelectorAll(FOCUSABLE));
    }

    function open() {
      restore = document.activeElement;
      root.hidden = false;
      document.body.style.overflow = 'hidden';
      // Next frame, so the element is laid out at translateY(100%) before the
      // class flips it to 0 - set both in one frame and there is no transition,
      // just a jump.
      window.requestAnimationFrame(function () {
        root.classList.add('sheet--in');
      });
      var first = focusables()[0];
      if (first) first.focus();
    }

    function close() {
      root.classList.remove('sheet--in');
      root.hidden = true;
      document.body.style.overflow = '';
      if (restore && typeof restore.focus === 'function') restore.focus();
    }

    trigger.addEventListener('click', open);
    Array.prototype.forEach.call(root.querySelectorAll('[data-sheet-close]'), function (el) {
      el.addEventListener('click', close);
    });

    root.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  })();
</script>`,
      css: `.sheet[hidden] {
  display: none;
}

.sheet {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  /* The single line that makes it a bottom sheet rather than a dialog. */
  align-items: flex-end;
  justify-content: center;
}

.sheet__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.sheet__panel {
  position: relative;
  width: 100%;
  max-width: 32rem;
  max-height: 85dvh;
  overflow-y: auto;
  padding: 0.75rem 1.25rem calc(1.5rem + env(safe-area-inset-bottom));
  /* Only the top corners: the bottom two are off-screen, and rounding them
     leaves two bright slivers of backdrop under the sheet. */
  border-radius: 1rem 1rem 0 0;
  background-color: #fff;
  box-shadow: 0 -20px 40px -12px rgba(0, 0, 0, 0.25);
  transform: translateY(100%);
  transition: transform 260ms cubic-bezier(0.32, 0.72, 0, 1);
}

.sheet--in .sheet__panel {
  transform: translateY(0);
}

.sheet__grabber {
  width: 2.25rem;
  height: 0.25rem;
  margin: 0 auto 0.75rem;
  border-radius: 9999px;
  background-color: #d1d5db;
}

.sheet__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.sheet__body {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.sheet__actions {
  display: grid;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.sheet__btn {
  width: 100%;
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.75rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.sheet__btn--primary {
  border-color: transparent;
  background-color: #2563eb;
  color: #fff;
}

.sheet__btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

@media (prefers-color-scheme: dark) {
  .sheet__panel {
    background-color: #111827;
  }

  .sheet__grabber {
    background-color: #4b5563;
  }

  .sheet__title {
    color: #f3f4f6;
  }

  .sheet__body {
    color: #9ca3af;
  }

  .sheet__btn {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .sheet__btn--primary {
    border-color: transparent;
    background-color: #2563eb;
    color: #fff;
  }

  .sheet__btn:focus-visible {
    outline-color: #60a5fa;
  }
}

/*
 * A sheet flying up the viewport is exactly the motion this setting exists to
 * turn off. The dialog still appears - only the travel is dropped.
 */
@media (prefers-reduced-motion: reduce) {
  .sheet__panel {
    transition: none;
    transform: translateY(0);
  }
}`,
      tailwind: `<div class="fixed inset-0 z-50 flex items-end justify-center">
  <div class="absolute inset-0 bg-black/50" data-sheet-close></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="bottom-sheet-title"
    class="relative max-h-[85dvh] w-full max-w-lg translate-y-0 overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-[0_-20px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none dark:bg-gray-900"
  >
    <div class="mx-auto mb-3 h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-600" aria-hidden="true"></div>
    <h2 id="bottom-sheet-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">
      Choose a plan
    </h2>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Switch at any time. Changes take effect on the next invoice.
    </p>
    <div class="mt-5 grid gap-2">
      <button
        type="button"
        data-sheet-close
        class="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Continue
      </button>
      <button
        type="button"
        data-sheet-close
        class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        Not now
      </button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalDrawerBottom({ open, title, children, dismissLabel = 'Close', onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    // Paint at translate-y-full first, then flip - same frame means no slide.
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-[0_-20px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none motion-reduce:translate-y-0 dark:bg-gray-900 \${entered ? 'translate-y-0' : 'translate-y-full'}\`}
      >
        <div
          className="mx-auto mb-3 h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-600"
          aria-hidden="true"
        />
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalDrawerBottomProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
  className?: string;
}

export function ModalDrawerBottom({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
  className = '',
}: ModalDrawerBottomProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-[0_-20px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-900 \${entered ? 'translate-y-0' : 'translate-y-full'} \${className}\`}
      >
        <div
          className="mx-auto mb-3 h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-600"
          aria-hidden="true"
        />
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalDrawerBottomProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
  className?: string;
}

export function ModalDrawerBottom({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
  className = '',
}: ModalDrawerBottomProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  /**
   * Two renders on purpose. The panel must be painted at translate-y-full
   * before the class flips to translate-y-0, or the browser has nothing to
   * transition FROM and the sheet simply appears.
   */
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={\`relative max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white px-5 pb-6 pt-3 shadow-[0_-20px_40px_-12px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none dark:bg-gray-900 \${entered ? 'translate-y-0' : 'translate-y-full'} \${className}\`}
      >
        <div
          className="mx-auto mb-3 h-1 w-9 rounded-full bg-gray-300 dark:bg-gray-600"
          aria-hidden="true"
        />
        <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <div className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="mt-5 grid gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            Continue
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {dismissLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-alert-warning',
    category: 'modals',
    tags: ['modal', 'alert', 'warning', 'alertdialog', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'ctaLabel', type: 'string', default: "'Got it'", descriptionKey: 'ctaLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A warning is an alertdialog, not a dialog: it interrupted the user with
  something they need to act on. It is not destructive, so there is one button
  and focus lands on it - the single thing this dialog is asking for. Escape
  dismisses. Amber #b45309 on #fef3c7 clears AA; the lighter amber you reach for
  first does not, and this glyph is the only danger signal before the text.
-->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div
    role="alertdialog"
    aria-modal="true"
    aria-labelledby="warn-modal-title"
    aria-describedby="warn-modal-desc"
    class="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" aria-hidden="true">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
    </div>
    <h2 id="warn-modal-title" class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
      Your session is about to expire
    </h2>
    <p id="warn-modal-desc" class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      You have been inactive for a while. Save your work now to avoid losing unsaved changes.
    </p>
    <div class="mt-6">
      <button
        type="button"
        data-modal-close
        class="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-gray-900"
      >
        Got it
      </button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalAlertWarning({ open, title, message, ctaLabel = 'Got it', onDismiss }) {
  const panelRef = useRef(null);
  const ackRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    ackRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" aria-hidden="true">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6">
          <button
            ref={ackRef}
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalAlertWarningProps {
  open: boolean;
  title: string;
  /** Wired to aria-describedby - say what the user must act on. */
  message: string;
  ctaLabel?: string;
  onDismiss: () => void;
}

export function ModalAlertWarning({
  open,
  title,
  message,
  ctaLabel = 'Got it',
  onDismiss,
}: ModalAlertWarningProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const ackRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    ackRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" aria-hidden="true">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6">
          <button
            ref={ackRef}
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-success',
    category: 'modals',
    tags: ['modal', 'success', 'confirmation', 'dialog', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'ctaLabel', type: 'string', default: "'Done'", descriptionKey: 'ctaLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A success confirmation. The check mark scales in once; the animation is
  decoration, so it is dropped under motion-reduce and the glyph still reads.
  The green is a signal, not the message - the title and body carry the meaning
  for anyone who cannot see the colour.
-->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="ok-modal-title"
    aria-describedby="ok-modal-desc"
    class="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" aria-hidden="true">
      <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </div>
    <h2 id="ok-modal-title" class="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
      Payment successful
    </h2>
    <p id="ok-modal-desc" class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      We have emailed your receipt. Your plan is active and ready to use right away.
    </p>
    <div class="mt-6">
      <button
        type="button"
        data-modal-close
        class="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900"
      >
        Done
      </button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const POP = '@keyframes modal-success-pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}';

export function ModalSuccess({ open, title, message, ctaLabel = 'Done', onDismiss }) {
  const panelRef = useRef(null);
  const doneRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    doneRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="inline-flex h-12 w-12 origin-center animate-[modal-success-pop_240ms_ease-out] items-center justify-center rounded-full bg-emerald-100 text-emerald-700 motion-reduce:animate-none dark:bg-emerald-900/40 dark:text-emerald-300" aria-hidden="true">
          <style>{POP}</style>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6">
          <button
            ref={doneRef}
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const POP = '@keyframes modal-success-pop{0%{transform:scale(.6);opacity:0}100%{transform:scale(1);opacity:1}}';

export interface ModalSuccessProps {
  open: boolean;
  title: string;
  message: string;
  ctaLabel?: string;
  onDismiss: () => void;
}

export function ModalSuccess({
  open,
  title,
  message,
  ctaLabel = 'Done',
  onDismiss,
}: ModalSuccessProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    doneRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="inline-flex h-12 w-12 origin-center animate-[modal-success-pop_240ms_ease-out] items-center justify-center rounded-full bg-emerald-100 text-emerald-700 motion-reduce:animate-none dark:bg-emerald-900/40 dark:text-emerald-300" aria-hidden="true">
          <style>{POP}</style>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" focusable="false">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 id={titleId} className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {message}
        </p>
        <div className="mt-6">
          <button
            ref={doneRef}
            type="button"
            onClick={onDismiss}
            className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-emerald-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-scrollable-terms',
    category: 'modals',
    tags: ['modal', 'terms', 'scrollable', 'consent', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'acceptLabel', type: 'string', default: "'Accept'", descriptionKey: 'acceptLabel' },
      { name: 'declineLabel', type: 'string', default: "'Decline'", descriptionKey: 'declineLabel' },
      { name: 'onAccept', type: '() => void', required: true, descriptionKey: 'onAccept' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  The panel is a flex column with a fixed frame: a flex-none header and footer
  bracket a flex-1 min-h-0 overflow-y-auto body. min-h-0 is the load-bearing
  line - without it the flex child refuses to shrink and the body pushes the
  Accept/Decline row off the panel instead of scrolling under it. The way out
  stays reachable however far you read.
-->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="terms-modal-title"
    class="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="flex-none border-b border-gray-200 px-6 py-4 dark:border-gray-800">
      <h2 id="terms-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">Terms of Service</h2>
    </div>
    <div class="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      <p>By using this service you agree to the terms below. Please read them in full before continuing.</p>
      <p>1. Accounts. You are responsible for keeping your credentials secure.</p>
      <p>2. Acceptable use. You agree not to misuse the service or interfere with its operation.</p>
      <p>3. Content. You retain ownership of the content you submit.</p>
      <p>4. Privacy. We process personal data as described in our Privacy Policy.</p>
      <p>5. Termination. You may stop using the service at any time.</p>
    </div>
    <div class="flex-none border-t border-gray-200 px-6 py-4 dark:border-gray-800">
      <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" data-modal-close class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Decline</button>
        <button type="button" data-modal-accept class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Accept</button>
      </div>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalScrollableTerms({
  open,
  title,
  children,
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
  onAccept,
  onDismiss,
}) {
  const panelRef = useRef(null);
  const declineRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    declineRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex-none border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="flex-none border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              ref={declineRef}
              type="button"
              onClick={onDismiss}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {declineLabel}
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {acceptLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalScrollableTermsProps {
  open: boolean;
  title: string;
  children: ReactNode;
  acceptLabel?: string;
  declineLabel?: string;
  onAccept: () => void;
  onDismiss: () => void;
}

export function ModalScrollableTerms({
  open,
  title,
  children,
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
  onAccept,
  onDismiss,
}: ModalScrollableTermsProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const declineRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    declineRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex-none border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        </div>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {children}
        </div>
        <div className="flex-none border-t border-gray-200 px-6 py-4 dark:border-gray-800">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              ref={declineRef}
              type="button"
              onClick={onDismiss}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {declineLabel}
            </button>
            <button
              type="button"
              onClick={onAccept}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:w-auto dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
            >
              {acceptLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-image-lightbox',
    category: 'modals',
    tags: ['modal', 'lightbox', 'gallery', 'image', 'dialog'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'slides', type: 'Slide[]', required: true, descriptionKey: 'slides' },
      { name: 'startIndex', type: 'number', default: '0', descriptionKey: 'startIndex' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A lightbox is a dialog over a dark scrim with Prev/Next/Close as real buttons,
  each at least 40px. The media here is a CSS gradient rather than an <img> so
  the snippet is self-contained; swap the gradient div for your <img>. Arrow keys
  page the slides in the React versions, and the counter is aria-live so a screen
  reader hears the slide change.
-->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/80" data-modal-close></div>
  <div role="dialog" aria-modal="true" aria-labelledby="lb-modal-title" class="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto">
    <div class="flex items-center justify-between gap-4 text-white">
      <h2 id="lb-modal-title" class="min-w-0 truncate text-sm font-semibold">Sunrise ridge</h2>
      <button type="button" aria-label="Close" data-modal-close class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div class="relative mt-2">
      <div class="aspect-video w-full rounded-xl bg-gradient-to-br from-amber-400 to-rose-500" role="img" aria-label="Sunrise ridge"></div>
      <button type="button" aria-label="Previous image" data-modal-prev class="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
      </button>
      <button type="button" aria-label="Next image" data-modal-next class="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
      </button>
    </div>
    <p class="mt-3 text-center text-xs font-medium text-white/70" aria-live="polite">1 / 3</p>
  </div>
</div>`,
      react: `import { useCallback, useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalImageLightbox({ open, slides, startIndex = 0, onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (!open) return undefined;
    setIndex(startIndex);
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open, startIndex]);

  const count = slides.length;
  const go = useCallback((delta) => {
    if (count === 0) return;
    setIndex((i) => (i + delta + count) % count);
  }, [count]);

  function onKeyDown(event) {
    if (event.key === 'Escape') return onDismiss();
    if (event.key === 'ArrowRight') { event.preventDefault(); return go(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); return go(-1); }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  if (!open) return null;
  const current = slides[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/80" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto">
        <div className="flex items-center justify-between gap-4 text-white">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold">{current ? current.label : ''}</h2>
          <button type="button" aria-label="Close" onClick={onDismiss} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="relative mt-2">
          <div className={'aspect-video w-full rounded-xl bg-gradient-to-br ' + (current ? current.gradient : 'from-gray-700 to-gray-900')} role="img" aria-label={current ? current.label : 'Image'} />
          <button type="button" aria-label="Previous image" onClick={() => go(-1)} className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button type="button" aria-label="Next image" onClick={() => go(1)} className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-white/70" aria-live="polite">{count === 0 ? '0 / 0' : (index + 1) + ' / ' + count}</p>
      </div>
    </div>
  );
}`,
      typescript: `import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface Slide {
  id: string;
  label: string;
  /** A Tailwind gradient pair, e.g. 'from-sky-400 to-indigo-600'. Swap for an <img>. */
  gradient: string;
}

export interface ModalImageLightboxProps {
  open: boolean;
  slides: Slide[];
  startIndex?: number;
  onDismiss: () => void;
}

export function ModalImageLightbox({
  open,
  slides,
  startIndex = 0,
  onDismiss,
}: ModalImageLightboxProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    if (!open) return undefined;
    setIndex(startIndex);
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open, startIndex]);

  const count = slides.length;
  const go = useCallback(
    (delta: number) => {
      if (count === 0) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(1);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(-1);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;
  const current = slides[index];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/80" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto">
        <div className="flex items-center justify-between gap-4 text-white">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold">{current ? current.label : ''}</h2>
          <button type="button" aria-label="Close" onClick={onDismiss} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="relative mt-2">
          <div className={'aspect-video w-full rounded-xl bg-gradient-to-br ' + (current ? current.gradient : 'from-gray-700 to-gray-900')} role="img" aria-label={current ? current.label : 'Image'} />
          <button type="button" aria-label="Previous image" onClick={() => go(-1)} className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <button type="button" aria-label="Next image" onClick={() => go(1)} className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
        <p className="mt-3 text-center text-xs font-medium text-white/70" aria-live="polite">{count === 0 ? '0 / 0' : (index + 1) + ' / ' + count}</p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-video',
    category: 'modals',
    tags: ['modal', 'video', 'player', 'media', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'posterGradient', type: 'string', default: "'from-indigo-500 via-purple-500 to-pink-500'", descriptionKey: 'posterGradient' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A video dialog, mocked. There is no real <video> here - the poster is a
  gradient and the play button toggles a CSS timeline - so the snippet ships no
  media. Drop your <video> into the aspect-video frame and wire the play button
  to its .play()/.pause(). The controls are real buttons at least 40px.
-->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/70" data-modal-close></div>
  <div role="dialog" aria-modal="true" aria-labelledby="video-modal-title" class="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
    <div class="flex items-center justify-between gap-4 px-4 py-3">
      <h2 id="video-modal-title" class="min-w-0 truncate text-sm font-semibold text-gray-100">Product tour (2:14)</h2>
      <button type="button" aria-label="Close" data-modal-close class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div class="relative flex aspect-video w-full items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <button type="button" aria-label="Play video" data-modal-play class="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none">
        <svg class="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
      </button>
    </div>
    <div class="flex items-center gap-3 px-4 py-3">
      <button type="button" aria-label="Play" class="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <svg class="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
      </button>
      <div class="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"><div class="h-full w-0 rounded-full bg-white"></div></div>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PROGRESS = '@keyframes modal-video-progress{from{width:0%}to{width:100%}}';

export function ModalVideo({ open, title, posterGradient = 'from-indigo-500 via-purple-500 to-pink-500', onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!open) { setPlaying(false); return undefined; }
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') { onDismiss(); return; }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <style>{PROGRESS}</style>
      <div className="absolute inset-0 bg-black/70" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold text-gray-100">{title}</h2>
          <button type="button" aria-label="Close" onClick={onDismiss} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className={'relative flex aspect-video w-full items-center justify-center bg-gradient-to-br ' + posterGradient}>
          {playing ? (
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white" aria-live="polite">Playing preview</span>
          ) : (
            <button type="button" aria-label="Play video" onClick={() => setPlaying(true)} className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none">
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} aria-pressed={playing} onClick={() => setPlaying((p) => !p)} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {playing ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className={'h-full rounded-full bg-white ' + (playing ? 'animate-[modal-video-progress_8s_linear] motion-reduce:animate-none' : 'w-0')} />
          </div>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const PROGRESS = '@keyframes modal-video-progress{from{width:0%}to{width:100%}}';

export interface ModalVideoProps {
  open: boolean;
  title: string;
  posterGradient?: string;
  onDismiss: () => void;
}

export function ModalVideo({
  open,
  title,
  posterGradient = 'from-indigo-500 via-purple-500 to-pink-500',
  onDismiss,
}: ModalVideoProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!open) {
      setPlaying(false);
      return undefined;
    }
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <style>{PROGRESS}</style>
      <div className="absolute inset-0 bg-black/70" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-2xl flex-col overflow-y-auto rounded-2xl border border-gray-800 bg-gray-950 shadow-2xl">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <h2 id={titleId} className="min-w-0 truncate text-sm font-semibold text-gray-100">{title}</h2>
          <button type="button" aria-label="Close" onClick={onDismiss} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className={'relative flex aspect-video w-full items-center justify-center bg-gradient-to-br ' + posterGradient}>
          {playing ? (
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white" aria-live="polite">Playing preview</span>
          ) : (
            <button type="button" aria-label="Play video" onClick={() => setPlaying(true)} className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-gray-900 shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none">
              <svg className="ml-1 h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 px-4 py-3">
          <button type="button" aria-label={playing ? 'Pause' : 'Play'} aria-pressed={playing} onClick={() => setPlaying((p) => !p)} className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-lg text-gray-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
            {playing ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
            ) : (
              <svg className="ml-0.5 h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
          <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/20">
            <div className={'h-full rounded-full bg-white ' + (playing ? 'animate-[modal-video-progress_8s_linear] motion-reduce:animate-none' : 'w-0')} />
          </div>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-command-palette',
    category: 'modals',
    tags: ['modal', 'command-palette', 'search', 'cmdk', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'commands', type: 'Command[]', required: true, descriptionKey: 'commands' },
      { name: 'placeholder', type: 'string', default: "'Type a command or search...'", descriptionKey: 'placeholder' },
      { name: 'onRun', type: '(command: Command) => void', required: true, descriptionKey: 'onRun' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A Spotlight-style palette: opens top-aligned, focuses the input, filters as you
  type. It is a listbox of options, so the active row is announced, not just
  tinted. In the React versions ArrowUp/Down move the active row and Enter runs
  it; Escape closes. Keep the panel w-full max-w-lg so it never exceeds a 320px
  viewport.
-->
<div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div role="dialog" aria-modal="true" aria-label="Command palette" class="relative flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-none items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-800">
      <svg class="h-4 w-4 flex-none text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
      <input type="text" placeholder="Type a command or search..." aria-label="Search commands" class="w-full min-w-0 bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100" />
    </div>
    <ul role="listbox" aria-label="Commands" class="min-h-0 flex-1 overflow-y-auto p-2">
      <li role="option" aria-selected="true">
        <button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg bg-blue-600 px-3 py-2.5 text-left text-sm text-white">
          <span class="min-w-0 truncate font-medium">Create new project</span><span class="flex-none text-xs text-blue-100">C</span>
        </button>
      </li>
      <li role="option" aria-selected="false">
        <button type="button" class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300">
          <span class="min-w-0 truncate font-medium">Invite teammate</span><span class="flex-none text-xs text-gray-400">I</span>
        </button>
      </li>
    </ul>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

export function ModalCommandPalette({ open, commands, placeholder = 'Type a command or search...', onRun, onDismiss }) {
  const inputRef = useRef(null);
  const restoreRef = useRef(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActive(0);
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === '' ? commands : commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => { setActive(0); }, [query]);

  function onKeyDown(event) {
    if (event.key === 'Escape') { onDismiss(); return; }
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive((i) => results.length === 0 ? 0 : (i + 1) % results.length); return; }
    if (event.key === 'ArrowUp') { event.preventDefault(); setActive((i) => results.length === 0 ? 0 : (i - 1 + results.length) % results.length); return; }
    if (event.key === 'Enter') { event.preventDefault(); const chosen = results[active]; if (chosen) onRun(chosen); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="relative flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-none items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-800">
          <svg className="h-4 w-4 flex-none text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-controls={listId} aria-label="Search commands" className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100" />
        </div>
        <ul id={listId} role="listbox" aria-label="Commands" className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No matching commands</li>
          ) : (
            results.map((command, i) => (
              <li key={command.id} role="option" aria-selected={i === active}>
                <button type="button" onClick={() => onRun(command)} onMouseMove={() => setActive(i)} className={'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm focus-visible:outline-none ' + (i === active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300')}>
                  <span className="min-w-0 truncate font-medium">{command.label}</span>
                  <span className={'flex-none text-xs ' + (i === active ? 'text-blue-100' : 'text-gray-400')}>{command.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Command {
  id: string;
  label: string;
  /** A short shortcut hint shown on the right, e.g. 'C'. */
  hint: string;
}

export interface ModalCommandPaletteProps {
  open: boolean;
  commands: Command[];
  placeholder?: string;
  onRun: (command: Command) => void;
  onDismiss: () => void;
}

export function ModalCommandPalette({
  open,
  commands,
  placeholder = 'Type a command or search...',
  onRun,
  onDismiss,
}: ModalCommandPaletteProps): JSX.Element | null {
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const listId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setQuery('');
    setActive(0);
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q === '' ? commands : commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i + 1) % results.length));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (results.length === 0 ? 0 : (i - 1 + results.length) % results.length));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const chosen = results[active];
      if (chosen) onRun(chosen);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="relative flex max-h-[70vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-none items-center gap-2 border-b border-gray-200 px-4 dark:border-gray-800">
          <svg className="h-4 w-4 flex-none text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input ref={inputRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} aria-controls={listId} aria-label="Search commands" className="w-full min-w-0 bg-transparent py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-gray-100" />
        </div>
        <ul id={listId} role="listbox" aria-label="Commands" className="min-h-0 flex-1 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No matching commands</li>
          ) : (
            results.map((command, i) => (
              <li key={command.id} role="option" aria-selected={i === active}>
                <button type="button" onClick={() => onRun(command)} onMouseMove={() => setActive(i)} className={'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm focus-visible:outline-none ' + (i === active ? 'bg-blue-600 text-white' : 'text-gray-700 dark:text-gray-300')}>
                  <span className="min-w-0 truncate font-medium">{command.label}</span>
                  <span className={'flex-none text-xs ' + (i === active ? 'text-blue-100' : 'text-gray-400')}>{command.hint}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-cookie',
    category: 'modals',
    tags: ['modal', 'cookie', 'consent', 'privacy', 'gdpr'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'onAccept', type: '() => void', required: true, descriptionKey: 'onAccept' },
      { name: 'onReject', type: '() => void', required: true, descriptionKey: 'onReject' },
      { name: 'onManage', type: '() => void', required: true, descriptionKey: 'onManage' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  Consent needs three real choices - Accept all, Reject non-essential, Manage -
  not a single "OK" that consents by exhaustion. Focus opens on Reject, the least
  committal option, and Escape resolves to onDismiss (a reject), never a silent
  accept. It is items-end on a phone (a bottom sheet) and centres from sm: up.
-->
<div class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
  <div class="absolute inset-0 bg-black/40" data-modal-close></div>
  <div role="dialog" aria-modal="true" aria-labelledby="cookie-modal-title" aria-describedby="cookie-modal-desc" class="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
    <h2 id="cookie-modal-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">We value your privacy</h2>
    <p id="cookie-modal-desc" class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      We use cookies to keep you signed in and to understand how the product is used. You can accept all, reject the non-essential ones, or choose which to allow.
    </p>
    <div class="mt-4 grid gap-2 sm:grid-cols-2">
      <button type="button" data-modal-accept class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Accept all</button>
      <button type="button" data-modal-reject class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Reject non-essential</button>
    </div>
    <button type="button" data-modal-manage class="mt-3 inline-flex min-h-[40px] items-center text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400">Manage preferences</button>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalCookie({ open, title, message, onAccept, onReject, onManage, onDismiss }) {
  const panelRef = useRef(null);
  const rejectRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    rejectRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') { onDismiss(); return; }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={onAccept} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Accept all</button>
          <button ref={rejectRef} type="button" onClick={onReject} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Reject non-essential</button>
        </div>
        <button type="button" onClick={onManage} className="mt-3 inline-flex min-h-[40px] items-center text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400">Manage preferences</button>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalCookieProps {
  open: boolean;
  title: string;
  message: string;
  onAccept: () => void;
  onReject: () => void;
  onManage: () => void;
  onDismiss: () => void;
}

export function ModalCookie({
  open,
  title,
  message,
  onAccept,
  onReject,
  onManage,
  onDismiss,
}: ModalCookieProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const rejectRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    rejectRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/40" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        <p id={descId} className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={onAccept} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Accept all</button>
          <button ref={rejectRef} type="button" onClick={onReject} className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Reject non-essential</button>
        </div>
        <button type="button" onClick={onManage} className="mt-3 inline-flex min-h-[40px] items-center text-sm font-medium text-blue-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400">Manage preferences</button>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-side-panel',
    category: 'modals',
    tags: ['modal', 'side-panel', 'drawer', 'slide-over', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'dismissLabel', type: 'string', default: "'Close'", descriptionKey: 'dismissLabel' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A slide-over: a modal dialog that arrives from the right. Full-width on a phone,
  capped at max-w-md from there up, so it never exceeds the viewport. The slide is
  a translate-x transform (composited, unlike a width/right animation); in the
  React versions it paints at translate-x-full and flips on the next frame, and
  motion-reduce drops the travel.
-->
<div class="fixed inset-0 z-50 flex justify-end">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div role="dialog" aria-modal="true" aria-labelledby="side-modal-title" class="relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
    <div class="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
      <h2 id="side-modal-title" class="text-base font-semibold text-gray-900 dark:text-gray-100">Edit profile</h2>
      <button type="button" aria-label="Close" data-modal-close class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Update your display name, role and notification settings. Changes apply across every workspace you belong to as soon as you save.
    </div>
    <div class="flex-none border-t border-gray-200 px-5 py-4 dark:border-gray-800">
      <button type="button" data-modal-close class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Save changes</button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalSidePanel({ open, title, children, dismissLabel = 'Close', onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) { setEntered(false); return undefined; }
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') { onDismiss(); return; }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={'relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 ' + (entered ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button type="button" aria-label={dismissLabel} onClick={onDismiss} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{children}</div>
        <div className="flex-none border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button type="button" onClick={onDismiss} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Save changes</button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface ModalSidePanelProps {
  open: boolean;
  title: string;
  children: ReactNode;
  dismissLabel?: string;
  onDismiss: () => void;
}

export function ModalSidePanel({
  open,
  title,
  children,
  dismissLabel = 'Close',
  onDismiss,
}: ModalSidePanelProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!open) {
      setEntered(false);
      return undefined;
    }
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const raf = window.requestAnimationFrame(() => setEntered(true));
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      window.cancelAnimationFrame(raf);
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={'relative flex h-full w-full max-w-md flex-col overflow-hidden border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out motion-reduce:translate-x-0 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 ' + (entered ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex flex-none items-center justify-between gap-4 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
          <h2 id={titleId} className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button type="button" aria-label={dismissLabel} onClick={onDismiss} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{children}</div>
        <div className="flex-none border-t border-gray-200 px-5 py-4 dark:border-gray-800">
          <button type="button" onClick={onDismiss} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Save changes</button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'modal-stacked',
    category: 'modals',
    tags: ['modal', 'stacked', 'nested', 'dialog', 'focus-trap'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  Two dialogs, stacked. The second sits at a higher z-index with its own backdrop,
  and Escape only ever closes the TOPMOST layer - so the user peels the stack one
  at a time rather than being dumped back to the page. Closing the top layer
  returns focus to the control that raised it. This markup shows both layers open;
  the React versions manage the second with state.
-->
<div class="fixed inset-0 z-40 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50"></div>
  <div role="dialog" aria-modal="true" aria-labelledby="base-modal-title" class="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
    <h2 id="base-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">Account settings</h2>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Manage your account. Some actions here are permanent and will ask you to confirm.</p>
    <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
      <button type="button" data-modal-open-confirm class="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 sm:w-auto dark:border-red-900 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950">Delete account</button>
      <button type="button" data-modal-close class="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto">Done</button>
    </div>
  </div>
</div>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-modal-close-confirm></div>
  <div role="alertdialog" aria-modal="true" aria-labelledby="confirm2-modal-title" class="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900">
    <h2 id="confirm2-modal-title" class="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete account?</h2>
    <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">This removes everything tied to your account and cannot be undone.</p>
    <div class="mt-6 flex gap-2">
      <button type="button" data-modal-close-confirm class="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
      <button type="button" class="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">Delete</button>
    </div>
  </div>
</div>`,
      react: `import { useCallback, useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trap(panel, event) {
  if (event.key !== 'Tab') return;
  const items = Array.from(panel?.querySelectorAll(FOCUSABLE) ?? []);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

export function ModalStacked({ open, onDismiss }) {
  const baseRef = useRef(null);
  const confirmRef = useRef(null);
  const reopenRef = useRef(null);
  const restoreRef = useRef(null);
  const cancelRef = useRef(null);
  const baseTitleId = useId();
  const confirmTitleId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) { setConfirmOpen(false); return undefined; }
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    baseRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  useEffect(() => { if (confirmOpen) cancelRef.current?.focus(); }, [confirmOpen]);

  const openConfirm = useCallback(() => {
    reopenRef.current = document.activeElement;
    setConfirmOpen(true);
  }, []);
  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    reopenRef.current?.focus();
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onKeyDown={(e) => { if (e.key === 'Escape') { onDismiss(); return; } if (!confirmOpen) trap(baseRef.current, e); }}>
        <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
        <div ref={baseRef} role="dialog" aria-modal="true" aria-labelledby={baseTitleId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <h2 id={baseTitleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account settings</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Manage your account. Some actions here are permanent and will ask you to confirm.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <button type="button" onClick={openConfirm} className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:w-auto dark:border-red-900 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950">Delete account</button>
            <button type="button" onClick={onDismiss} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:w-auto">Done</button>
          </div>
        </div>
      </div>
      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={(e) => { if (e.key === 'Escape') { closeConfirm(); return; } trap(confirmRef.current, e); }}>
          <div className="absolute inset-0 bg-black/50" onClick={closeConfirm} />
          <div ref={confirmRef} role="alertdialog" aria-modal="true" aria-labelledby={confirmTitleId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <h2 id={confirmTitleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete account?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">This removes everything tied to your account and cannot be undone.</p>
            <div className="mt-6 flex gap-2">
              <button ref={cancelRef} type="button" onClick={closeConfirm} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
              <button type="button" onClick={closeConfirm} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}`,
      typescript: `import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function trap(panel: HTMLElement | null, event: KeyboardEvent<HTMLDivElement>): void {
  if (event.key !== 'Tab') return;
  const items = Array.from(panel?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

export interface ModalStackedProps {
  open: boolean;
  onDismiss: () => void;
}

export function ModalStacked({ open, onDismiss }: ModalStackedProps): JSX.Element | null {
  const baseRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const reopenRef = useRef<HTMLElement | null>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const baseTitleId = useId();
  const confirmTitleId = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmOpen(false);
      return undefined;
    }
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    baseRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (confirmOpen) cancelRef.current?.focus();
  }, [confirmOpen]);

  const openConfirm = useCallback(() => {
    reopenRef.current = document.activeElement as HTMLElement | null;
    setConfirmOpen(true);
  }, []);
  const closeConfirm = useCallback(() => {
    setConfirmOpen(false);
    reopenRef.current?.focus();
  }, []);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4" onKeyDown={(e) => { if (e.key === 'Escape') { onDismiss(); return; } if (!confirmOpen) trap(baseRef.current, e); }}>
        <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
        <div ref={baseRef} role="dialog" aria-modal="true" aria-labelledby={baseTitleId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
          <h2 id={baseTitleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Account settings</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Manage your account. Some actions here are permanent and will ask you to confirm.</p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
            <button type="button" onClick={openConfirm} className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 sm:w-auto dark:border-red-900 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950">Delete account</button>
            <button type="button" onClick={onDismiss} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:w-auto">Done</button>
          </div>
        </div>
      </div>
      {confirmOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={(e) => { if (e.key === 'Escape') { closeConfirm(); return; } trap(confirmRef.current, e); }}>
          <div className="absolute inset-0 bg-black/50" onClick={closeConfirm} />
          <div ref={confirmRef} role="alertdialog" aria-modal="true" aria-labelledby={confirmTitleId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <h2 id={confirmTitleId} className="text-lg font-semibold text-gray-900 dark:text-gray-100">Delete account?</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">This removes everything tied to your account and cannot be undone.</p>
            <div className="mt-6 flex gap-2">
              <button ref={cancelRef} type="button" onClick={closeConfirm} className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800">Cancel</button>
              <button type="button" onClick={closeConfirm} className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600">Delete</button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}`,
    },
  },
  {
    slug: 'modal-onboarding-steps',
    category: 'modals',
    tags: ['modal', 'onboarding', 'wizard', 'steps', 'dialog'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    props: [
      { name: 'open', type: 'boolean', required: true, descriptionKey: 'open' },
      { name: 'steps', type: 'Step[]', required: true, descriptionKey: 'steps' },
      { name: 'onFinish', type: '() => void', required: true, descriptionKey: 'onFinish' },
      { name: 'onDismiss', type: '() => void', required: true, descriptionKey: 'onDismiss' },
    ],
    code: {
      tailwind: `<!--
  A multi-step wizard inside one dialog. Back is disabled on the first step and
  the primary button becomes Finish on the last. The step region is aria-live so
  each change is announced, and the progress is not colour-only - the active dot
  is wider. The dialog keeps its focus trap and Escape throughout. This markup
  shows one step; the React versions advance with state.
-->
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-black/50" data-modal-close></div>
  <div role="dialog" aria-modal="true" aria-labelledby="wiz-modal-title" class="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-1.5" aria-hidden="true">
        <span class="h-1.5 w-5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
        <span class="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
        <span class="h-1.5 w-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></span>
      </div>
      <button type="button" aria-label="Close" data-modal-close class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
      </button>
    </div>
    <div class="mt-4" aria-live="polite">
      <p class="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Step 1 of 3</p>
      <h2 id="wiz-modal-title" class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Welcome aboard</h2>
      <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">A quick three-step setup gets your workspace ready. It takes under a minute.</p>
    </div>
    <div class="mt-6 flex items-center justify-between gap-2">
      <button type="button" disabled class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">Back</button>
      <button type="button" data-modal-next class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Next</button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ModalOnboardingSteps({ open, steps, onFinish, onDismiss }) {
  const panelRef = useRef(null);
  const restoreRef = useRef(null);
  const titleId = useId();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setIndex(0);
    restoreRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event) {
    if (event.key === 'Escape') { onDismiss(); return; }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  if (!open) return null;
  const count = steps.length;
  const current = steps[index];
  const isLast = index >= count - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {steps.map((step, i) => (
              <span key={step.title} className={'h-1.5 rounded-full transition-all ' + (i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-1.5 bg-gray-300 dark:bg-gray-700')} />
            ))}
          </div>
          <button type="button" aria-label="Close" onClick={onDismiss} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="mt-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Step {index + 1} of {count}</p>
          <h2 id={titleId} className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{current ? current.title : ''}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{current ? current.body : ''}</p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-2">
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Back</button>
          <button type="button" onClick={() => (isLast ? onFinish() : setIndex((i) => Math.min(count - 1, i + 1)))} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{isLast ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface Step {
  title: string;
  body: string;
}

export interface ModalOnboardingStepsProps {
  open: boolean;
  steps: Step[];
  onFinish: () => void;
  onDismiss: () => void;
}

export function ModalOnboardingSteps({
  open,
  steps,
  onFinish,
  onDismiss,
}: ModalOnboardingStepsProps): JSX.Element | null {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return undefined;
    setIndex(0);
    restoreRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    return () => {
      document.body.style.overflow = '';
      restoreRef.current?.focus();
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      onDismiss();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  if (!open) return null;
  const count = steps.length;
  const current = steps[index];
  const isLast = index >= count - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onKeyDown={onKeyDown}>
      <div className="absolute inset-0 bg-black/50" onClick={onDismiss} />
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {steps.map((step, i) => (
              <span key={step.title} className={'h-1.5 rounded-full transition-all ' + (i === index ? 'w-5 bg-blue-600 dark:bg-blue-400' : 'w-1.5 bg-gray-300 dark:bg-gray-700')} />
            ))}
          </div>
          <button type="button" aria-label="Close" onClick={onDismiss} className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="mt-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">Step {index + 1} of {count}</p>
          <h2 id={titleId} className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{current ? current.title : ''}</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{current ? current.body : ''}</p>
        </div>
        <div className="mt-6 flex items-center justify-between gap-2">
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Back</button>
          <button type="button" onClick={() => (isLast ? onFinish() : setIndex((i) => Math.min(count - 1, i + 1)))} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{isLast ? 'Finish' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}`,
    },
  },
];
