import type { ComponentEntry } from './types';

/**
 * Floating action button category.
 *
 * A FAB is an icon-only control that floats over the page, which means it has
 * two problems every entry here has to solve rather than decorate around:
 *
 *  1. **It has no visible label.** An icon is not an accessible name and a
 *     tooltip is not one either - a tooltip is a `title`/popup that assistive
 *     tech may never announce. Every trigger below carries an explicit
 *     `aria-label` (or visually-hidden text) regardless of what hovers next to
 *     it.
 *  2. **It floats over an unknown surface.** A focus ring drawn directly
 *     against a coloured or blurred backdrop disappears. Every ring here uses
 *     an explicit `ring-offset-*` colour that is set for both themes, so the
 *     ring reads whether the FAB sits on a white page or a dark one.
 *
 * The shipped snippets use `position: fixed`, which is correct for a real app.
 * The gallery previews deliberately bound themselves instead - see the
 * `*-preview.tsx` files for why.
 */
export const fabComponents: ComponentEntry[] = [
  {
    slug: 'fab-basic',
    category: 'fab',
    tags: ['fab', 'floating', 'icon', 'action', 'button'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-08',
    updatedAt: '2026-06-30',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1460, copies: 372, downloads: 108 },
    variants: [
      { id: 'primary', labelKey: 'primary' },
      { id: 'default', labelKey: 'default' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'ariaLabel', type: 'string', required: true, descriptionKey: 'ariaLabel' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  aria-label is the whole component's accessibility budget: the SVG is
  aria-hidden, so without the label a screen reader announces "button" and
  nothing else. It is not optional decoration.
-->
<button class="fab" type="button" aria-label="New message">
  <svg class="fab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
</button>`,
      css: `/*
 * The FAB paints its own surface (#2563eb) and its white glyph clears AA
 * against it on any page, so the button itself needs no dark-mode block.
 * The focus ring does: it is drawn with a ring-offset in the PAGE colour, and
 * that colour is the one thing here that follows the theme.
 */
.fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 0;
  border-radius: 9999px;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.45);
  transition: background-color 150ms, transform 150ms, box-shadow 150ms;
}

.fab:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 16px 34px -8px rgba(15, 23, 42, 0.55);
}

.fab:active {
  transform: translateY(0);
}

.fab:focus-visible {
  outline: none;
  /*
   * Two rings, not one. The inner white ring separates the blue focus ring
   * from the blue button; without it the ring vanishes into the FAB itself.
   */
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #2563eb,
    0 12px 28px -8px rgba(15, 23, 42, 0.45);
}

.fab[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.fab__icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Motion is decoration; the hover lift is what a reduced-motion user drops. */
@media (prefers-reduced-motion: reduce) {
  .fab {
    transition: none;
  }

  .fab:hover {
    transform: none;
  }
}

@media (prefers-color-scheme: dark) {
  /* The offset ring has to match the dark page, not stay white. */
  .fab:focus-visible {
    box-shadow:
      0 0 0 2px #030712,
      0 0 0 4px #60a5fa,
      0 12px 28px -8px rgba(0, 0, 0, 0.7);
  }
}`,
      tailwind: `<button
  type="button"
  aria-label="New message"
  class="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
>
  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
</button>`,
      react: `export function Fab({ ariaLabel, icon, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={\`fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
      {...props}
    >
      {icon ?? (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: the icon is aria-hidden, so this is the only name it has. */
  ariaLabel: string;
  icon?: ReactNode;
}

/**
 * Stateless - no 'use client'. It renders as a Server Component; pass the
 * handler from a client parent if you need one.
 */
export function Fab({ ariaLabel, icon, className = '', ...props }: FabProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={\`fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
      {...props}
    >
      {icon ?? (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface FabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  icon?: ReactNode;
}

export function Fab({ ariaLabel, icon, className = '', ...props }: FabProps): JSX.Element {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={\`fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
      {...props}
    >
      {icon ?? (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-extended',
    category: 'fab',
    tags: ['fab', 'extended', 'pill', 'label', 'action'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-02',
    updatedAt: '2026-07-04',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 980, copies: 251, downloads: 74 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The visible label IS the accessible name here, so there is no aria-label to
  keep in sync - and no chance of the two drifting apart. That is the reason to
  reach for an extended FAB over a round one whenever you have the width.
-->
<button class="fab-ext" type="button">
  <svg class="fab-ext__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
  New invoice
</button>`,
      css: `/*
 * Same surface logic as the round FAB: #2563eb with a white label is 8.6:1 and
 * carries its own contrast on any page, so only the focus ring's offset colour
 * needs a dark-mode block.
 */
.fab-ext {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  height: 3.5rem;
  padding: 0 1.5rem;
  border: 0;
  border-radius: 9999px;
  background-color: #2563eb;
  color: #fff;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.45);
  transition: background-color 150ms, transform 150ms;
}

.fab-ext:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.fab-ext:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #2563eb,
    0 12px 28px -8px rgba(15, 23, 42, 0.45);
}

.fab-ext[disabled] {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.fab-ext__icon {
  width: 1.25rem;
  height: 1.25rem;
  /* The glyph is redundant with the label - hide it from the a11y tree. */
  flex-shrink: 0;
}

@media (prefers-reduced-motion: reduce) {
  .fab-ext {
    transition: none;
  }

  .fab-ext:hover {
    transform: none;
  }
}

@media (prefers-color-scheme: dark) {
  .fab-ext:focus-visible {
    box-shadow:
      0 0 0 2px #030712,
      0 0 0 4px #60a5fa,
      0 12px 28px -8px rgba(0, 0, 0, 0.7);
  }
}`,
      tailwind: `<button
  type="button"
  class="fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-blue-600 px-6 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
>
  <svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
    <path d="M12 5v14M5 12h14" />
  </svg>
  New invoice
</button>`,
      react: `export function ExtendedFab({ label, icon, className = '', ...props }) {
  return (
    <button
      type="button"
      className={\`fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-blue-600 px-6 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
      {...props}
    >
      {icon ?? (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
      {label}
    </button>
  );
}`,
      nextjs: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ExtendedFabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visible text - and, because it is visible, the accessible name too. */
  label: string;
  icon?: ReactNode;
}

export function ExtendedFab({ label, icon, className = '', ...props }: ExtendedFabProps) {
  return (
    <button
      type="button"
      className={\`fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-blue-600 px-6 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
      {...props}
    >
      {icon ?? (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
      {label}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ExtendedFabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon?: ReactNode;
}

export function ExtendedFab({
  label,
  icon,
  className = '',
  ...props
}: ExtendedFabProps): JSX.Element {
  return (
    <button
      type="button"
      className={\`fixed bottom-6 right-6 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-blue-600 px-6 text-[0.9375rem] font-semibold text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition hover:bg-blue-700 motion-safe:hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 \${className}\`}
      {...props}
    >
      {icon ?? (
        <svg
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
      {label}
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-speed-dial',
    category: 'fab',
    tags: ['fab', 'speed-dial', 'menu', 'expand', 'actions'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-11',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 2140, copies: 528, downloads: 163 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'up', labelKey: 'up' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'items', type: 'SpeedDialAction[]', required: true, descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Quick actions'", descriptionKey: 'ariaLabel' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The disclosure pattern, not a menu: aria-expanded on the trigger and
  aria-controls pointing at the panel it opens. The actions are a plain list of
  buttons - they are commands, each carrying its own aria-label, and each one is
  reachable by Tab because they are real buttons rather than divs.
-->
<div class="dial">
  <ul class="dial__actions" id="dial-actions" hidden>
    <li>
      <button class="dial__action" type="button" aria-label="New note" data-id="note">
        <svg class="dial__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M4 4h16v12l-4 4H4z" />
        </svg>
      </button>
    </li>
    <li>
      <button class="dial__action" type="button" aria-label="Upload file" data-id="upload">
        <svg class="dial__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </li>
    <li>
      <button class="dial__action" type="button" aria-label="Invite teammate" data-id="invite">
        <svg class="dial__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
      </button>
    </li>
  </ul>

  <button
    class="dial__trigger"
    type="button"
    aria-expanded="false"
    aria-controls="dial-actions"
    aria-label="Open quick actions"
  >
    <svg class="dial__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" />
    </svg>
  </button>
</div>

<script>
  document.querySelectorAll('.dial').forEach(function (root) {
    var trigger = root.querySelector('.dial__trigger');
    var panel = root.querySelector('.dial__actions');

    function setOpen(open) {
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Close quick actions' : 'Open quick actions');
      panel.hidden = !open;
      if (open) {
        // Move focus into the stack so the keyboard lands where the eye does.
        var first = panel.querySelector('.dial__action');
        if (first) first.focus();
      }
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    // Escape closes and hands focus BACK to the trigger - never leave a
    // keyboard user stranded on a button that just disappeared.
    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      if (trigger.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
      trigger.focus();
    });

    // Clicking away collapses, but focus stays where the user put it.
    document.addEventListener('click', function (event) {
      if (root.contains(event.target)) return;
      if (trigger.getAttribute('aria-expanded') !== 'true') return;
      setOpen(false);
    });

    panel.addEventListener('click', function (event) {
      var action = event.target.closest('.dial__action');
      if (!action) return;
      setOpen(false);
      trigger.focus();
      console.log('speed dial action:', action.dataset.id);
    });
  });
</script>`,
      css: `.dial {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.dial__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

/*
 * The stack animates in from below. Note the end state is the DEFAULT and the
 * animation only plays for users who want motion - see the reduced-motion
 * block, which lands on opacity:1/translate:0 rather than freezing mid-flight.
 */
.dial__actions:not([hidden]) .dial__action {
  animation: dial-in 160ms ease-out both;
}

.dial__actions li:nth-child(2) .dial__action {
  animation-delay: 40ms;
}

.dial__actions li:nth-child(3) .dial__action {
  animation-delay: 80ms;
}

@keyframes dial-in {
  from {
    opacity: 0;
    transform: translateY(0.5rem) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dial__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  /* #374151 on #fff is 10.3:1 - the secondary actions stay quiet but legible. */
  background-color: #fff;
  color: #374151;
  cursor: pointer;
  box-shadow: 0 8px 20px -6px rgba(15, 23, 42, 0.35);
}

.dial__action:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.dial__action:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #2563eb,
    0 8px 20px -6px rgba(15, 23, 42, 0.35);
}

.dial__action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.dial__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 0;
  border-radius: 9999px;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.45);
}

.dial__trigger:hover {
  background-color: #1d4ed8;
}

.dial__trigger:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #2563eb,
    0 12px 28px -8px rgba(15, 23, 42, 0.45);
}

/*
 * The plus becomes a cross by rotating 45deg, and the rotation hangs off
 * aria-expanded - so the icon physically cannot contradict the state it is
 * announcing.
 */
.dial__icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 160ms ease-out;
}

.dial__trigger[aria-expanded='true'] .dial__icon {
  transform: rotate(45deg);
}

/*
 * Reduced motion lands on the END state: the actions are fully visible and
 * un-transformed, the icon still rotates to the cross (it carries meaning), it
 * simply gets there instantly.
 */
@media (prefers-reduced-motion: reduce) {
  .dial__actions:not([hidden]) .dial__action {
    animation: none;
    opacity: 1;
    transform: none;
  }

  .dial__icon {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .dial__action {
    border-color: #1f2937;
    /* #d1d5db on #111827 is 11.2:1. */
    background-color: #111827;
    color: #d1d5db;
  }

  .dial__action:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .dial__action:focus-visible,
  .dial__trigger:focus-visible {
    box-shadow:
      0 0 0 2px #030712,
      0 0 0 4px #60a5fa,
      0 12px 28px -8px rgba(0, 0, 0, 0.7);
  }
}`,
      tailwind: `<div class="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
  <ul class="flex flex-col items-end gap-3" id="dial-actions" hidden>
    <li>
      <button
        type="button"
        aria-label="New note"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M4 4h16v12l-4 4H4z" />
        </svg>
      </button>
    </li>
    <li>
      <button
        type="button"
        aria-label="Upload file"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </li>
    <li>
      <button
        type="button"
        aria-label="Invite teammate"
        class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false">
          <path d="M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        </svg>
      </button>
    </li>
  </ul>

  <button
    type="button"
    aria-expanded="false"
    aria-controls="dial-actions"
    aria-label="Open quick actions"
    class="group inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
  >
    <svg
      class="h-6 w-6 transition-transform group-aria-expanded:rotate-45 motion-reduce:transition-none"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  </button>
</div>`,
      react: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ACTIONS = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6' },
];

export function SpeedDialFab({ onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);

  // Closing always returns focus to the trigger - the actions are gone, so
  // focus cannot stay on them.
  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    panelRef.current?.querySelector('button')?.focus();

    function onKeyDown(event) {
      if (event.key === 'Escape') close();
    }

    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <ul ref={panelRef} id="dial-actions" className="flex flex-col items-end gap-3">
          {ACTIONS.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                aria-label={action.label}
                onClick={() => {
                  onSelect?.(action.id);
                  close();
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={action.path} />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="dial-actions"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className={\`h-6 w-6 transition-transform motion-reduce:transition-none \${open ? 'rotate-45' : ''}\`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
      nextjs: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface SpeedDialAction {
  id: string;
  label: string;
  path: string;
}

interface SpeedDialFabProps {
  items?: SpeedDialAction[];
  onSelect?: (id: string) => void;
}

const DEFAULT_ACTIONS: readonly SpeedDialAction[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6' },
];

export function SpeedDialFab({ items = [...DEFAULT_ACTIONS], onSelect }: SpeedDialFabProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    panelRef.current?.querySelector('button')?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }

    function onPointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <ul ref={panelRef} id="dial-actions" className="flex flex-col items-end gap-3">
          {items.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                aria-label={action.label}
                onClick={() => {
                  onSelect?.(action.id);
                  close();
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={action.path} />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="dial-actions"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className={\`h-6 w-6 transition-transform motion-reduce:transition-none \${open ? 'rotate-45' : ''}\`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface SpeedDialAction {
  id: string;
  label: string;
  /** SVG path data for the action's glyph. */
  path: string;
}

export interface SpeedDialFabProps {
  items?: SpeedDialAction[];
  onSelect?: (id: string) => void;
}

const DEFAULT_ACTIONS: readonly SpeedDialAction[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6' },
];

export function SpeedDialFab({
  items = [...DEFAULT_ACTIONS],
  onSelect,
}: SpeedDialFabProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    panelRef.current?.querySelector('button')?.focus();

    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }

    function onPointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <ul ref={panelRef} id="dial-actions" className="flex flex-col items-end gap-3">
          {items.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                aria-label={action.label}
                onClick={() => {
                  onSelect?.(action.id);
                  close();
                }}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d={action.path} />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="dial-actions"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className={\`h-6 w-6 transition-transform motion-reduce:transition-none \${open ? 'rotate-45' : ''}\`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'fab-with-tooltip',
    category: 'fab',
    tags: ['fab', 'tooltip', 'hover', 'focus', 'label'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-24',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1120, copies: 296, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'text', labelKey: 'text' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Two things carry the label and they are NOT the same mechanism:

    aria-label  → the accessible name. This is what a screen reader announces.
    the tooltip → a visual affordance for sighted mouse/keyboard users.

  A tooltip alone is not a name - it is a popup that may never be announced,
  and it does not exist at all on touch. So the button keeps its aria-label and
  the tooltip is aria-hidden: the name is stated once, the bubble is pure
  decoration, and they cannot disagree because both read from the same source.

  The tooltip appears on :hover AND :focus-visible. Hover-only would make it
  mouse-only - exactly the users who need it least.
-->
<div class="tip-fab">
  <button class="tip-fab__button" type="button" aria-label="Start a call">
    <svg class="tip-fab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  </button>
  <span class="tip-fab__tooltip" aria-hidden="true">Start a call</span>
</div>`,
      css: `.tip-fab {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-direction: row-reverse;
}

.tip-fab__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border: 0;
  border-radius: 9999px;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 12px 28px -8px rgba(15, 23, 42, 0.45);
}

.tip-fab__button:hover {
  background-color: #1d4ed8;
}

.tip-fab__button:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #2563eb,
    0 12px 28px -8px rgba(15, 23, 42, 0.45);
}

.tip-fab__icon {
  width: 1.5rem;
  height: 1.5rem;
}

/*
 * visibility (not display) so the fade has something to animate, and
 * pointer-events:none so the bubble can never sit between the cursor and the
 * button it describes.
 */
.tip-fab__tooltip {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  /* #fff on #111827 is 16.1:1. */
  background-color: #111827;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 500;
  box-shadow: 0 8px 20px -6px rgba(15, 23, 42, 0.4);
  transition: opacity 140ms ease-out, visibility 140ms;
}

/*
 * :focus-visible on the sibling, not just :hover - a keyboard user tabbing to
 * the FAB gets the same bubble a mouse user gets.
 */
.tip-fab__button:hover + .tip-fab__tooltip,
.tip-fab__button:focus-visible + .tip-fab__tooltip {
  visibility: visible;
  opacity: 1;
}

/* Reduced motion lands on the END state: the bubble still shows, instantly. */
@media (prefers-reduced-motion: reduce) {
  .tip-fab__tooltip {
    transition: none;
  }
}

@media (prefers-color-scheme: dark) {
  .tip-fab__tooltip {
    /* #111827 on #f9fafb is 16.6:1 - invert so the bubble stays a foreground. */
    background-color: #f9fafb;
    color: #111827;
  }

  .tip-fab__button:focus-visible {
    box-shadow:
      0 0 0 2px #030712,
      0 0 0 4px #60a5fa,
      0 12px 28px -8px rgba(0, 0, 0, 0.7);
  }
}`,
      tailwind: `<div class="group fixed bottom-6 right-6 z-40 inline-flex flex-row-reverse items-center gap-2">
  <button
    type="button"
    aria-label="Start a call"
    class="peer inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
  >
    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  </button>

  <!--
    aria-hidden: the button's aria-label already names it, so announcing this
    too would just repeat the name. peer-hover AND peer-focus-visible, because
    a tooltip that only answers to the mouse is a tooltip half the users cannot
    reach.
  -->
  <span
    aria-hidden="true"
    class="pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[0.8125rem] font-medium text-white opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
  >
    Start a call
  </span>
</div>`,
      react: `export function TooltipFab({ label, icon, onClick }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 inline-flex flex-row-reverse items-center gap-2">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="peer inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {icon ?? (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
          </svg>
        )}
      </button>

      {/* aria-hidden: the aria-label above is the name; this is the picture of it. */}
      <span
        aria-hidden="true"
        className="pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[0.8125rem] font-medium text-white opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
      >
        {label}
      </span>
    </div>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface TooltipFabProps {
  /** Names the button AND fills the bubble - one string, so they cannot drift. */
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function TooltipFab({ label, icon, onClick }: TooltipFabProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40 inline-flex flex-row-reverse items-center gap-2">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="peer inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {icon ?? (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
          </svg>
        )}
      </button>

      <span
        aria-hidden="true"
        className="pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[0.8125rem] font-medium text-white opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
      >
        {label}
      </span>
    </div>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface TooltipFabProps {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function TooltipFab({ label, icon, onClick }: TooltipFabProps): JSX.Element {
  return (
    <div className="fixed bottom-6 right-6 z-40 inline-flex flex-row-reverse items-center gap-2">
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="peer inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        {icon ?? (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
          </svg>
        )}
      </button>

      <span
        aria-hidden="true"
        className="pointer-events-none whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[0.8125rem] font-medium text-white opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition-opacity peer-hover:opacity-100 peer-focus-visible:opacity-100 motion-reduce:transition-none dark:bg-gray-50 dark:text-gray-900"
      >
        {label}
      </span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'fab-scroll-to-top',
    category: 'fab',
    tags: ['fab', 'scroll', 'back-to-top', 'threshold', 'smooth'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-19',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1680, copies: 441, downloads: 132 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'none', labelKey: 'none' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Back to top'", descriptionKey: 'label' },
      { name: 'distance', type: 'number', default: '320', descriptionKey: 'distance' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  inert while hidden, not just transparent. A button faded to opacity:0 is
  still focusable - Tab lands on an invisible control and the focus ring
  appears over nothing. \`inert\` removes it from the tab order and the
  accessibility tree in one attribute; the class only handles the paint.
-->
<button class="totop" type="button" aria-label="Back to top" inert>
  <svg class="totop__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
</button>

<script>
  (function () {
    var button = document.querySelector('.totop');
    if (!button) return;

    var THRESHOLD = 320;

    function sync() {
      var past = window.scrollY > THRESHOLD;
      button.classList.toggle('totop--visible', past);
      // Keep the tab order in step with what is on screen.
      if (past) {
        button.removeAttribute('inert');
      } else {
        button.setAttribute('inert', '');
      }
    }

    // passive: this handler never calls preventDefault, and saying so lets the
    // browser scroll without waiting on it.
    window.addEventListener('scroll', sync, { passive: true });
    sync();

    button.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      // The button is about to hide, so focus cannot stay on it - hand the
      // keyboard back to the top of the document, which is where the click
      // just took the eye.
      document.body.focus();
    });
  })();
</script>`,
      css: `.totop {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 40;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  /* #374151 on #fff is 10.3:1. */
  background-color: #fff;
  color: #374151;
  cursor: pointer;
  box-shadow: 0 10px 24px -8px rgba(15, 23, 42, 0.4);

  /* Hidden state. visibility keeps it out of hit-testing while it fades. */
  opacity: 0;
  visibility: hidden;
  transform: translateY(0.5rem);
  transition: opacity 180ms ease-out, transform 180ms ease-out, visibility 180ms;
}

.totop--visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.totop:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.totop:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #2563eb,
    0 10px 24px -8px rgba(15, 23, 42, 0.4);
}

.totop__icon {
  width: 1.25rem;
  height: 1.25rem;
}

/*
 * Reduced motion lands on the END state of whichever state it is in: the
 * button still appears past the threshold and still disappears below it, it
 * simply cuts instead of fading, and never sits mid-slide. The transform is
 * dropped entirely so the resting position is the real one.
 */
@media (prefers-reduced-motion: reduce) {
  .totop {
    transition: none;
    transform: none;
  }

  .totop--visible {
    transform: none;
  }
}

@media (prefers-color-scheme: dark) {
  .totop {
    border-color: #1f2937;
    /* #d1d5db on #111827 is 11.2:1. */
    background-color: #111827;
    color: #d1d5db;
  }

  .totop:hover {
    background-color: #1f2937;
    color: #f9fafb;
  }

  .totop:focus-visible {
    box-shadow:
      0 0 0 2px #030712,
      0 0 0 4px #60a5fa,
      0 10px 24px -8px rgba(0, 0, 0, 0.7);
  }
}`,
      tailwind: `<!--
  data-visible drives the paint; inert drives the tab order. Both are written
  by the same handler, so an invisible button is never focusable.
-->
<button
  type="button"
  aria-label="Back to top"
  data-visible="false"
  inert
  class="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 translate-y-2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-[0_10px_24px_-8px_rgba(15,23,42,0.4)] transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
>
  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
</button>

<script>
  (function () {
    var button = document.querySelector('[data-visible]');
    function sync() {
      var past = window.scrollY > 320;
      button.dataset.visible = String(past);
      if (past) button.removeAttribute('inert');
      else button.setAttribute('inert', '');
    }
    window.addEventListener('scroll', sync, { passive: true });
    sync();
    button.addEventListener('click', function () {
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  })();
</script>`,
      react: `'use client';

import { useEffect, useState } from 'react';

export function ScrollToTopFab({ label = 'Back to top', distance = 320 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(window.scrollY > distance);
    // passive - the handler never preventDefaults, so let the browser scroll
    // without waiting on it.
    window.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => window.removeEventListener('scroll', sync);
  }, [distance]);

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  // Unmounted rather than faded-out-but-focusable: a transparent button still
  // takes Tab, and a focus ring on empty space is a real bug.
  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={toTop}
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_10px_24px_-8px_rgba(15,23,42,0.4)] transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
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
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}`,
      nextjs: `'use client';

import { useEffect, useState } from 'react';

interface ScrollToTopFabProps {
  label?: string;
  /** Scroll distance in px before the button appears. */
  distance?: number;
}

export function ScrollToTopFab({ label = 'Back to top', distance = 320 }: ScrollToTopFabProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = (): void => setVisible(window.scrollY > distance);
    window.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => window.removeEventListener('scroll', sync);
  }, [distance]);

  const toTop = (): void => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={toTop}
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_10px_24px_-8px_rgba(15,23,42,0.4)] transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
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
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}`,
      typescript: `'use client';

import { useEffect, useState } from 'react';

export interface ScrollToTopFabProps {
  label?: string;
  /** Scroll distance in px before the button appears. */
  distance?: number;
}

export function ScrollToTopFab({
  label = 'Back to top',
  distance = 320,
}: ScrollToTopFabProps): JSX.Element | null {
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const sync = (): void => setVisible(window.scrollY > distance);
    window.addEventListener('scroll', sync, { passive: true });
    sync();
    return () => window.removeEventListener('scroll', sync);
  }, [distance]);

  const toTop = (): void => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={label}
      onClick={toTop}
      className="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_10px_24px_-8px_rgba(15,23,42,0.4)] transition hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
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
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-menu-radial',
    category: 'fab',
    tags: ['fab', 'radial', 'menu', 'speed-dial', 'actions'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'quarter', labelKey: 'quarter' },
    ],
    props: [
      { name: 'items', type: 'RadialAction[]', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  The actions fan out along a quarter arc. They stay in the DOM but toggle
  \`invisible\` (visibility, not opacity) - a collapsed action is removed from the
  tab order, so a keyboard user never lands on a control they cannot see.
-->
<div class="fab-radial group fixed bottom-6 right-6 z-40 h-14 w-14" data-open="false">
  <div id="fab-radial-actions" class="contents">
    <button type="button" aria-label="New note" class="invisible absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 scale-50 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white group-data-[open=true]:visible group-data-[open=true]:-translate-y-[4.75rem] group-data-[open=true]:scale-100 group-data-[open=true]:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 4h16v12l-4 4H4z" /></svg>
    </button>
    <button type="button" aria-label="Upload file" class="invisible absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 scale-50 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white group-data-[open=true]:visible group-data-[open=true]:-translate-x-[3.375rem] group-data-[open=true]:-translate-y-[3.375rem] group-data-[open=true]:scale-100 group-data-[open=true]:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
    </button>
    <button type="button" aria-label="Invite teammate" class="invisible absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 scale-50 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 opacity-0 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white group-data-[open=true]:visible group-data-[open=true]:-translate-x-[4.75rem] group-data-[open=true]:scale-100 group-data-[open=true]:opacity-100 motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" /></svg>
    </button>
  </div>
  <button type="button" aria-expanded="false" aria-controls="fab-radial-actions" aria-label="Open actions" class="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg class="h-6 w-6 transition-transform group-data-[open=true]:rotate-45 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
  </button>
</div>

<script>
  document.querySelectorAll('.fab-radial').forEach(function (root) {
    var trigger = root.querySelector('[aria-controls="fab-radial-actions"]');
    trigger.addEventListener('click', function () {
      var open = root.dataset.open !== 'true';
      root.dataset.open = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Close actions' : 'Open actions');
    });
  });
</script>`,
      react: `'use client';

import { useState } from 'react';

const ACTIONS = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z', pos: '-translate-y-[4.75rem]' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7', pos: '-translate-x-[3.375rem] -translate-y-[3.375rem]' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6', pos: '-translate-x-[4.75rem]' },
];

export function RadialFab({ items = ACTIONS, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 h-14 w-14">
      <div id="fab-radial-actions" className="contents">
        {items.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            onClick={() => {
              onSelect && onSelect(action.id);
              setOpen(false);
            }}
            className={
              'absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' +
              (open ? 'visible scale-100 opacity-100 ' + action.pos : 'invisible scale-50 opacity-0')
            }
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={action.path} />
            </svg>
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="fab-radial-actions"
        aria-label={open ? 'Close actions' : 'Open actions'}
        onClick={() => setOpen((value) => !value)}
        className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (open ? 'rotate-45' : '')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface RadialAction {
  id: string;
  label: string;
  /** SVG path data for the action's glyph. */
  path: string;
  /** Tailwind translate utilities placing this action on the arc when open. */
  pos: string;
}

export interface RadialFabProps {
  items?: RadialAction[];
  onSelect?: (id: string) => void;
}

const DEFAULT_ACTIONS: readonly RadialAction[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z', pos: '-translate-y-[4.75rem]' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7', pos: '-translate-x-[3.375rem] -translate-y-[3.375rem]' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6', pos: '-translate-x-[4.75rem]' },
];

export function RadialFab({ items = [...DEFAULT_ACTIONS], onSelect }: RadialFabProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 h-14 w-14">
      <div id="fab-radial-actions" className="contents">
        {items.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            onClick={() => {
              onSelect?.(action.id);
              setOpen(false);
            }}
            className={
              'absolute bottom-1.5 right-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' +
              (open ? 'visible scale-100 opacity-100 ' + action.pos : 'invisible scale-50 opacity-0')
            }
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
              <path d={action.path} />
            </svg>
          </button>
        ))}
      </div>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="fab-radial-actions"
        aria-label={open ? 'Close actions' : 'Open actions'}
        onClick={() => setOpen((value) => !value)}
        className="relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg
          className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (open ? 'rotate-45' : '')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'fab-morphing',
    category: 'fab',
    tags: ['fab', 'morph', 'toggle', 'animation', 'record'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'square', labelKey: 'square' },
    ],
    props: [
      { name: 'idleLabel', type: 'string', default: "'Start recording'", descriptionKey: 'label' },
      { name: 'activeLabel', type: 'string', default: "'Stop recording'", descriptionKey: 'label' },
      { name: 'onChange', type: '(active: boolean) => void', descriptionKey: 'onClick' },
    ],
    code: {
      tailwind: `<!--
  This is a toggle, so its state lives on aria-pressed - the border-radius and
  colour morph are hung off that same attribute, so the shape can never
  contradict the state a screen reader announces.
-->
<button type="button" aria-pressed="false" aria-label="Start recording" class="fab-morph group fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-all duration-300 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-pressed:rounded-2xl aria-pressed:bg-rose-600 aria-pressed:hover:bg-rose-700 aria-pressed:focus-visible:ring-rose-600 motion-reduce:transition-none dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 dark:aria-pressed:bg-rose-500 dark:aria-pressed:focus-visible:ring-rose-400">
  <svg class="h-6 w-6 group-aria-pressed:hidden" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="6" /></svg>
  <svg class="hidden h-5 w-5 group-aria-pressed:block" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
</button>

<script>
  document.querySelectorAll('.fab-morph').forEach(function (button) {
    button.addEventListener('click', function () {
      var active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      button.setAttribute('aria-label', active ? 'Stop recording' : 'Start recording');
    });
  });
</script>`,
      react: `'use client';

import { useState } from 'react';

export function MorphingFab({ idleLabel = 'Start recording', activeLabel = 'Stop recording', onChange }) {
  const [active, setActive] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? activeLabel : idleLabel}
      onClick={() => {
        const next = !active;
        setActive(next);
        onChange && onChange(next);
      }}
      className={
        'fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950 ' +
        (active
          ? 'rounded-2xl bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600 dark:bg-rose-500 dark:focus-visible:ring-rose-400'
          : 'rounded-full bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600 dark:bg-blue-500 dark:focus-visible:ring-blue-400')
      }
    >
      {active ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
      ) : (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="6" /></svg>
      )}
    </button>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface MorphingFabProps {
  idleLabel?: string;
  activeLabel?: string;
  onChange?: (active: boolean) => void;
}

export function MorphingFab({
  idleLabel = 'Start recording',
  activeLabel = 'Stop recording',
  onChange,
}: MorphingFabProps): JSX.Element {
  const [active, setActive] = useState<boolean>(false);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? activeLabel : idleLabel}
      onClick={() => {
        const next = !active;
        setActive(next);
        onChange?.(next);
      }}
      className={
        'fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-offset-gray-950 ' +
        (active
          ? 'rounded-2xl bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-600 dark:bg-rose-500 dark:focus-visible:ring-rose-400'
          : 'rounded-full bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600 dark:bg-blue-500 dark:focus-visible:ring-blue-400')
      }
    >
      {active ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
      ) : (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="6" /></svg>
      )}
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-labeled-pill',
    category: 'fab',
    tags: ['fab', 'pill', 'label', 'expand', 'hover'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'left', labelKey: 'left' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      tailwind: `<!--
  The label is real text inside the button, so it IS the accessible name even
  while it is clipped to width 0 - no aria-label needed, and nothing to keep in
  sync. It reveals on hover AND focus-visible: a reveal that only answers to the
  mouse is invisible to the keyboard users who most need to know what the circle
  does. It expands leftward (label before icon) so a right-anchored FAB never
  runs off the edge.
-->
<button type="button" class="group fixed bottom-6 right-6 z-40 inline-flex h-14 items-center justify-end rounded-full bg-blue-600 px-4 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
  <span class="max-w-0 overflow-hidden whitespace-nowrap text-[0.9375rem] font-semibold opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:max-w-xs group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:max-w-xs group-focus-visible:opacity-100 motion-reduce:transition-none">New task</span>
  <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
</button>`,
      react: `export function LabeledPillFab({ label = 'New task', icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-40 inline-flex h-14 items-center justify-end rounded-full bg-blue-600 px-4 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.9375rem] font-semibold opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:max-w-xs group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:max-w-xs group-focus-visible:opacity-100 motion-reduce:transition-none">
        {label}
      </span>
      {icon ?? (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface LabeledPillFabProps {
  label?: string;
  icon?: ReactNode;
  onClick?: () => void;
}

export function LabeledPillFab({ label = 'New task', icon, onClick }: LabeledPillFabProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group fixed bottom-6 right-6 z-40 inline-flex h-14 items-center justify-end rounded-full bg-blue-600 px-4 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.9375rem] font-semibold opacity-0 transition-all duration-300 group-hover:mr-2 group-hover:max-w-xs group-hover:opacity-100 group-focus-visible:mr-2 group-focus-visible:max-w-xs group-focus-visible:opacity-100 motion-reduce:transition-none">
        {label}
      </span>
      {icon ?? (
        <svg className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-multi-action-list',
    category: 'fab',
    tags: ['fab', 'menu', 'list', 'labeled', 'disclosure'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      { name: 'items', type: 'ActionItem[]', descriptionKey: 'items' },
      { name: 'ariaLabel', type: 'string', default: "'Quick actions'", descriptionKey: 'ariaLabel' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  Each row carries its own VISIBLE label, so the label is the accessible name -
  no aria-label per row to keep in sync. The disclosure contract is the same as
  a speed dial: aria-expanded on the trigger, aria-controls at the list.
-->
<div class="fab-list group fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3" data-open="false">
  <ul id="fab-list-actions" class="flex flex-col items-end gap-2 group-data-[open=false]:hidden">
    <li><button type="button" class="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 pr-4 text-sm font-medium text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"><svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 4h16v12l-4 4H4z" /></svg>New note</button></li>
    <li><button type="button" class="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 pr-4 text-sm font-medium text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"><svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 19V5M5 12l7-7 7 7" /></svg>Upload file</button></li>
    <li><button type="button" class="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 pr-4 text-sm font-medium text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"><svg class="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" /></svg>Invite teammate</button></li>
  </ul>
  <button type="button" aria-expanded="false" aria-controls="fab-list-actions" aria-label="Open quick actions" class="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg class="h-6 w-6 transition-transform group-data-[open=true]:rotate-45 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
  </button>
</div>

<script>
  document.querySelectorAll('.fab-list').forEach(function (root) {
    var trigger = root.querySelector('[aria-controls="fab-list-actions"]');
    trigger.addEventListener('click', function () {
      var open = root.dataset.open !== 'true';
      root.dataset.open = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Close quick actions' : 'Open quick actions');
    });
  });
</script>`,
      react: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ACTIONS = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6' },
];

export function MultiActionFab({ items = ACTIONS, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current && triggerRef.current.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event) {
      if (event.key === 'Escape') close();
    }
    function onPointerDown(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <ul id="fab-list-actions" className="flex flex-col items-end gap-2">
          {items.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect && onSelect(action.id);
                  close();
                }}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 pr-4 text-sm font-medium text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d={action.path} />
                </svg>
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="fab-list-actions"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (open ? 'rotate-45' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ActionItem {
  id: string;
  label: string;
  path: string;
}

export interface MultiActionFabProps {
  items?: ActionItem[];
  onSelect?: (id: string) => void;
}

const DEFAULT_ACTIONS: readonly ActionItem[] = [
  { id: 'note', label: 'New note', path: 'M4 4h16v12l-4 4H4z' },
  { id: 'upload', label: 'Upload file', path: 'M12 19V5M5 12l7-7 7 7' },
  { id: 'invite', label: 'Invite teammate', path: 'M16 19v-2a4 4 0 0 0-8 0v2M12 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6' },
];

export function MultiActionFab({ items = [...DEFAULT_ACTIONS], onSelect }: MultiActionFabProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }
    function onPointerDown(event: PointerEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  return (
    <div ref={rootRef} className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <ul id="fab-list-actions" className="flex flex-col items-end gap-2">
          {items.map((action) => (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect?.(action.id);
                  close();
                }}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-gray-200 bg-white pl-3 pr-4 text-sm font-medium text-gray-700 shadow-[0_8px_20px_-6px_rgba(15,23,42,0.35)] hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-1 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
              >
                <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
                  <path d={action.path} />
                </svg>
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="fab-list-actions"
        aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        onClick={() => (open ? close() : setOpen(true))}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className={'h-6 w-6 transition-transform motion-reduce:transition-none ' + (open ? 'rotate-45' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'fab-chat-bubble',
    category: 'fab',
    tags: ['fab', 'chat', 'launcher', 'badge', 'support'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'unread', labelKey: 'unread' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Support'", descriptionKey: 'title' },
      { name: 'message', type: 'string', descriptionKey: 'message' },
      { name: 'unread', type: 'number', default: '0', descriptionKey: 'unread' },
    ],
    code: {
      tailwind: `<!--
  The unread count is folded into the button's aria-label ("Open chat, 3
  unread") so it is announced, not left to a coloured dot the badge is only a
  picture of and is aria-hidden. The panel is width-capped with
  max-w-[calc(100vw-3rem)] so it never crosses the viewport edge on a phone.
-->
<div class="fab-chat fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3" data-open="false">
  <div id="fab-chat-panel" role="dialog" aria-label="Support chat" class="w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 group-data-[open=false]:hidden dark:border-gray-800 dark:bg-gray-900">
    <p class="text-sm font-semibold text-gray-900 dark:text-gray-50">Support</p>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Hi there - how can we help you today?</p>
  </div>
  <button type="button" aria-expanded="false" aria-controls="fab-chat-panel" aria-label="Open chat, 3 unread" class="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" /></svg>
    <span aria-hidden="true" class="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950">3</span>
  </button>
</div>

<script>
  document.querySelectorAll('.fab-chat').forEach(function (root) {
    var trigger = root.querySelector('[aria-controls="fab-chat-panel"]');
    var badge = root.querySelector('span[aria-hidden]');
    trigger.addEventListener('click', function () {
      var open = root.dataset.open !== 'true';
      root.dataset.open = String(open);
      trigger.setAttribute('aria-expanded', String(open));
      trigger.setAttribute('aria-label', open ? 'Close chat' : 'Open chat, 3 unread');
      if (badge) badge.style.display = open ? 'none' : '';
    });
  });
</script>`,
      react: `'use client';

import { useState } from 'react';

export function ChatBubbleFab({ title = 'Support', message = 'Hi there - how can we help you today?', unread = 3 }) {
  const [open, setOpen] = useState(false);
  const label = open ? 'Close chat' : unread > 0 ? 'Open chat, ' + unread + ' unread' : 'Open chat';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div role="dialog" aria-label={title + ' chat'} id="fab-chat-panel" className="w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls="fab-chat-panel"
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
        </svg>
        {!open && unread > 0 ? (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>
    </div>
  );
}`,
      typescript: `'use client';

import { useState } from 'react';

export interface ChatBubbleFabProps {
  title?: string;
  message?: string;
  unread?: number;
}

export function ChatBubbleFab({
  title = 'Support',
  message = 'Hi there - how can we help you today?',
  unread = 3,
}: ChatBubbleFabProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const label = open ? 'Close chat' : unread > 0 ? 'Open chat, ' + unread + ' unread' : 'Open chat';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open ? (
        <div role="dialog" aria-label={title + ' chat'} id="fab-chat-panel" className="w-72 max-w-[calc(100vw-3rem)] rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{title}</p>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      ) : null}

      <button
        type="button"
        aria-expanded={open}
        aria-controls="fab-chat-panel"
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5Z" />
        </svg>
        {!open && unread > 0 ? (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'fab-progress-ring',
    category: 'fab',
    tags: ['fab', 'progress', 'ring', 'svg', 'upload'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      { name: 'progress', type: 'number', default: '0', descriptionKey: 'progress' },
      { name: 'label', type: 'string', default: "'Cancel upload'", descriptionKey: 'label' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      tailwind: `<!--
  The ring is a pure decoration (aria-hidden); the button keeps a plain
  aria-label. The dashoffset is what makes the arc - here shown at ~65%
  (offset 55 of circumference 157). The transition on stroke-dashoffset is
  dropped for reduced-motion users.
-->
<div class="fixed bottom-6 right-6 z-40 h-14 w-14">
  <svg class="absolute inset-0 h-14 w-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
    <circle cx="28" cy="28" r="25" fill="none" stroke-width="4" class="stroke-blue-100 dark:stroke-gray-800" />
    <circle cx="28" cy="28" r="25" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="157" stroke-dashoffset="55" class="stroke-blue-600 transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none dark:stroke-blue-400" />
  </svg>
  <button type="button" aria-label="Cancel upload" class="absolute inset-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" /></svg>
  </button>
</div>`,
      react: `const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRingFab({ progress = 0, label = 'Cancel upload', onClick }) {
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <div className="fixed bottom-6 right-6 z-40 h-14 w-14">
      <svg className="absolute inset-0 h-14 w-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
        <circle cx="28" cy="28" r={RADIUS} fill="none" strokeWidth="4" className="stroke-blue-100 dark:stroke-gray-800" />
        <circle cx="28" cy="28" r={RADIUS} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none dark:stroke-blue-400" />
      </svg>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="absolute inset-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}`,
      typescript: `export interface ProgressRingFabProps {
  /** 0-100; values outside are clamped. */
  progress?: number;
  label?: string;
  onClick?: () => void;
}

const RADIUS = 25;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProgressRingFab({ progress = 0, label = 'Cancel upload', onClick }: ProgressRingFabProps): JSX.Element {
  const clamped = Math.max(0, Math.min(100, progress));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <div className="fixed bottom-6 right-6 z-40 h-14 w-14">
      <svg className="absolute inset-0 h-14 w-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true" focusable="false">
        <circle cx="28" cy="28" r={RADIUS} fill="none" strokeWidth="4" className="stroke-blue-100 dark:stroke-gray-800" />
        <circle cx="28" cy="28" r={RADIUS} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset} className="stroke-blue-600 transition-[stroke-dashoffset] duration-500 motion-reduce:transition-none dark:stroke-blue-400" />
      </svg>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="absolute inset-1 inline-flex items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'fab-draggable-visual',
    category: 'fab',
    tags: ['fab', 'draggable', 'pointer', 'move', 'reposition'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      { name: 'label', type: 'string', default: "'Quick add'", descriptionKey: 'label' },
      { name: 'step', type: 'number', default: '16', descriptionKey: 'step' },
    ],
    code: {
      tailwind: `<!--
  Pointer drag alone would strand keyboard users, so the arrow keys move it too -
  a drag handle that only answers to the mouse is not operable. touch-none keeps
  a drag from also scrolling the page under the finger.
-->
<button type="button" aria-label="Quick add, draggable - use arrow keys to move" class="fab-drag fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:cursor-grabbing dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" /></svg>
</button>

<script>
  document.querySelectorAll('.fab-drag').forEach(function (button) {
    var x = 0, y = 0, dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    function apply() { button.style.transform = 'translate(' + x + 'px, ' + y + 'px)'; }
    button.addEventListener('pointerdown', function (e) { dragging = true; sx = e.clientX; sy = e.clientY; ox = x; oy = y; button.setPointerCapture(e.pointerId); });
    button.addEventListener('pointermove', function (e) { if (!dragging) return; x = ox + (e.clientX - sx); y = oy + (e.clientY - sy); apply(); });
    button.addEventListener('pointerup', function () { dragging = false; });
    button.addEventListener('keydown', function (e) {
      var step = 16;
      if (e.key === 'ArrowUp') { y -= step; e.preventDefault(); }
      else if (e.key === 'ArrowDown') { y += step; e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { x -= step; e.preventDefault(); }
      else if (e.key === 'ArrowRight') { x += step; e.preventDefault(); }
      else return;
      apply();
    });
  });
</script>`,
      react: `'use client';

import { useRef, useState } from 'react';

export function DraggableFab({ label = 'Quick add', step = 16 }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  const onPointerDown = (event) => {
    drag.current = { active: true, sx: event.clientX, sy: event.clientY, ox: pos.x, oy: pos.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!drag.current.active) return;
    setPos({ x: drag.current.ox + (event.clientX - drag.current.sx), y: drag.current.oy + (event.clientY - drag.current.sy) });
  };
  const onPointerUp = () => {
    drag.current.active = false;
  };
  const onKeyDown = (event) => {
    if (event.key === 'ArrowUp') setPos((p) => ({ ...p, y: p.y - step }));
    else if (event.key === 'ArrowDown') setPos((p) => ({ ...p, y: p.y + step }));
    else if (event.key === 'ArrowLeft') setPos((p) => ({ ...p, x: p.x - step }));
    else if (event.key === 'ArrowRight') setPos((p) => ({ ...p, x: p.x + step }));
    else return;
    event.preventDefault();
  };

  return (
    <button
      type="button"
      aria-label={label + ', draggable - use arrow keys to move'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ transform: 'translate(' + pos.x + 'px, ' + pos.y + 'px)' }}
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:cursor-grabbing dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
      </svg>
    </button>
  );
}`,
      typescript: `'use client';

import { useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';

export interface DraggableFabProps {
  label?: string;
  /** Pixels moved per arrow-key press. */
  step?: number;
}

interface DragState {
  active: boolean;
  sx: number;
  sy: number;
  ox: number;
  oy: number;
}

export function DraggableFab({ label = 'Quick add', step = 16 }: DraggableFabProps): JSX.Element {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const drag = useRef<DragState>({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>): void => {
    drag.current = { active: true, sx: event.clientX, sy: event.clientY, ox: pos.x, oy: pos.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event: PointerEvent<HTMLButtonElement>): void => {
    if (!drag.current.active) return;
    setPos({ x: drag.current.ox + (event.clientX - drag.current.sx), y: drag.current.oy + (event.clientY - drag.current.sy) });
  };
  const onPointerUp = (): void => {
    drag.current.active = false;
  };
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === 'ArrowUp') setPos((p) => ({ ...p, y: p.y - step }));
    else if (event.key === 'ArrowDown') setPos((p) => ({ ...p, y: p.y + step }));
    else if (event.key === 'ArrowLeft') setPos((p) => ({ ...p, x: p.x - step }));
    else if (event.key === 'ArrowRight') setPos((p) => ({ ...p, x: p.x + step }));
    else return;
    event.preventDefault();
  };

  return (
    <button
      type="button"
      aria-label={label + ', draggable - use arrow keys to move'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onKeyDown={onKeyDown}
      style={{ transform: 'translate(' + pos.x + 'px, ' + pos.y + 'px)' }}
      className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 cursor-grab touch-none items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:cursor-grabbing dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <circle cx="9" cy="6" r="1.6" /><circle cx="15" cy="6" r="1.6" /><circle cx="9" cy="12" r="1.6" /><circle cx="15" cy="12" r="1.6" /><circle cx="9" cy="18" r="1.6" /><circle cx="15" cy="18" r="1.6" />
      </svg>
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-bottom-sheet-trigger',
    category: 'fab',
    tags: ['fab', 'bottom-sheet', 'dialog', 'trigger', 'mobile'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Create new'", descriptionKey: 'title' },
      { name: 'items', type: 'SheetItem[]', descriptionKey: 'items' },
      { name: 'onSelect', type: '(id: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<!--
  The sheet is a modal dialog: aria-modal, an Escape close, and focus that moves
  in on open and returns to the trigger on close (the trigger it came from). The
  scrim and the sheet both fade/slide only under motion-safe.
-->
<button type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="fab-sheet" aria-label="Create new" class="fab-sheet-trigger fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
</button>

<div id="fab-sheet" class="fixed inset-0 z-50 hidden">
  <div class="fab-sheet-scrim absolute inset-0 bg-gray-900/40 motion-safe:animate-in motion-safe:fade-in"></div>
  <div role="dialog" aria-modal="true" aria-label="Create new" class="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-gray-200 bg-white p-5 shadow-[0_-20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:slide-in-from-bottom dark:border-gray-800 dark:bg-gray-900">
    <div class="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true"></div>
    <h2 class="text-base font-semibold text-gray-900 dark:text-gray-50">Create new</h2>
    <div class="mt-4 grid gap-2">
      <button type="button" class="fab-sheet-item flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Document</button>
      <button type="button" class="fab-sheet-item flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Spreadsheet</button>
      <button type="button" class="fab-sheet-item flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Folder</button>
    </div>
  </div>
</div>

<script>
  (function () {
    var trigger = document.querySelector('.fab-sheet-trigger');
    var sheet = document.getElementById('fab-sheet');
    if (!trigger || !sheet) return;
    var scrim = sheet.querySelector('.fab-sheet-scrim');
    function open(state) {
      sheet.classList.toggle('hidden', !state);
      trigger.setAttribute('aria-expanded', String(state));
      if (state) { var first = sheet.querySelector('.fab-sheet-item'); if (first) first.focus(); }
      else trigger.focus();
    }
    trigger.addEventListener('click', function () { open(true); });
    scrim.addEventListener('click', function () { open(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !sheet.classList.contains('hidden')) open(false); });
    sheet.querySelectorAll('.fab-sheet-item').forEach(function (item) { item.addEventListener('click', function () { open(false); }); });
  })();
</script>`,
      react: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const ITEMS = [
  { id: 'doc', label: 'Document' },
  { id: 'sheet', label: 'Spreadsheet' },
  { id: 'folder', label: 'Folder' },
];

export function BottomSheetFab({ title = 'Create new', items = ITEMS, onSelect }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const sheetRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current && triggerRef.current.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    sheetRef.current && sheetRef.current.querySelector('button') && sheetRef.current.querySelector('button').focus();
    function onKeyDown(event) {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="fab-sheet"
        aria-label={title}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {open ? (
        <div id="fab-sheet" className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/40 motion-safe:animate-in motion-safe:fade-in" onClick={close} />
          <div ref={sheetRef} role="dialog" aria-modal="true" aria-label={title} className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-gray-200 bg-white p-5 shadow-[0_-20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:slide-in-from-bottom dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
            <div className="mt-4 grid gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect && onSelect(item.id);
                    close();
                  }}
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}`,
      typescript: `'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface SheetItem {
  id: string;
  label: string;
}

export interface BottomSheetFabProps {
  title?: string;
  items?: SheetItem[];
  onSelect?: (id: string) => void;
}

const DEFAULT_ITEMS: readonly SheetItem[] = [
  { id: 'doc', label: 'Document' },
  { id: 'sheet', label: 'Spreadsheet' },
  { id: 'folder', label: 'Folder' },
];

export function BottomSheetFab({
  title = 'Create new',
  items = [...DEFAULT_ITEMS],
  onSelect,
}: BottomSheetFabProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    sheetRef.current?.querySelector('button')?.focus();
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="fab-sheet"
        aria-label={title}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
      >
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>

      {open ? (
        <div id="fab-sheet" className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-gray-900/40 motion-safe:animate-in motion-safe:fade-in" onClick={close} />
          <div ref={sheetRef} role="dialog" aria-modal="true" aria-label={title} className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-gray-200 bg-white p-5 shadow-[0_-20px_40px_-12px_rgba(15,23,42,0.4)] motion-safe:animate-in motion-safe:slide-in-from-bottom dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300 dark:bg-gray-700" aria-hidden="true" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
            <div className="mt-4 grid gap-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelect?.(item.id);
                    close();
                  }}
                  className="flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
                >
                  {item.label}
                </button>
              ))}
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
    slug: 'fab-badge-count',
    category: 'fab',
    tags: ['fab', 'badge', 'count', 'notifications', 'unread'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'capped', labelKey: 'capped' },
    ],
    props: [
      { name: 'count', type: 'number', default: '0', descriptionKey: 'count' },
      { name: 'label', type: 'string', default: "'Notifications'", descriptionKey: 'label' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      tailwind: `<!--
  The count belongs in the accessible name ("Notifications, 5 unread"), not only
  in a coloured pill - so the badge is aria-hidden and the button's aria-label
  carries the number. Counts over 99 clamp to "99+" so the badge cannot grow
  wide enough to escape the FAB.
-->
<button type="button" aria-label="Notifications, 5 unread" class="relative fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
  <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" /></svg>
  <span aria-hidden="true" class="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950">5</span>
</button>`,
      react: `export function BadgeFab({ count = 0, label = 'Notifications', onClick }) {
  const clamped = Math.max(0, Math.round(count));
  const display = clamped > 99 ? '99+' : String(clamped);

  return (
    <button
      type="button"
      aria-label={clamped > 0 ? label + ', ' + clamped + ' unread' : label}
      onClick={onClick}
      className="relative fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
      {clamped > 0 ? (
        <span aria-hidden="true" className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950">
          {display}
        </span>
      ) : null}
    </button>
  );
}`,
      typescript: `export interface BadgeFabProps {
  count?: number;
  label?: string;
  onClick?: () => void;
}

export function BadgeFab({ count = 0, label = 'Notifications', onClick }: BadgeFabProps): JSX.Element {
  const clamped = Math.max(0, Math.round(count));
  const display = clamped > 99 ? '99+' : String(clamped);

  return (
    <button
      type="button"
      aria-label={clamped > 0 ? label + ', ' + clamped + ' unread' : label}
      onClick={onClick}
      className="relative fixed bottom-6 right-6 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_12px_28px_-8px_rgba(15,23,42,0.45)] hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />
      </svg>
      {clamped > 0 ? (
        <span aria-hidden="true" className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-rose-600 px-1 text-xs font-semibold text-white dark:border-gray-950">
          {display}
        </span>
      ) : null}
    </button>
  );
}`,
    },
  },
  {
    slug: 'fab-mini',
    category: 'fab',
    tags: ['fab', 'mini', 'small', 'compact', 'icon'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'primary', labelKey: 'primary' },
      { id: 'disabled', labelKey: 'disabled' },
    ],
    props: [
      { name: 'ariaLabel', type: 'string', required: true, descriptionKey: 'ariaLabel' },
      { name: 'icon', type: 'ReactNode', descriptionKey: 'icon' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
      { name: 'disabled', type: 'boolean', default: 'false', descriptionKey: 'disabled' },
    ],
    code: {
      tailwind: `<!--
  A mini FAB is 44px, not smaller - that is the minimum comfortable touch target,
  so "mini" trims the standard 56px to the floor and stops. The aria-label is
  still the whole accessible name; the smaller glyph does not change that.
-->
<button type="button" aria-label="Add item" class="fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">
  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>
</button>`,
      react: `export function MiniFab({ ariaLabel, icon, className = '', ...props }) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={'fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + className}
      {...props}
    >
      {icon ?? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
      typescript: `import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface MiniFabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ariaLabel: string;
  icon?: ReactNode;
}

export function MiniFab({ ariaLabel, icon, className = '', ...props }: MiniFabProps): JSX.Element {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={'fixed bottom-6 right-6 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)] transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-safe:hover:-translate-y-px disabled:pointer-events-none disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950 ' + className}
      {...props}
    >
      {icon ?? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M12 5v14M5 12h14" />
        </svg>
      )}
    </button>
  );
}`,
    },
  },
];
