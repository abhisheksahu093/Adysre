import type { ComponentEntry } from './types';

/**
 * Popover category.
 *
 * A popover is a modal's opposite number: it floats over the page WITHOUT
 * taking it away. Nothing here traps focus or locks scrolling, because a
 * popover is not an interruption - it is an annexe of the control that opened
 * it. What every entry does owe is the other half of the contract: it opens
 * from a trigger the keyboard can reach, it closes on Escape, it hands focus
 * back to that trigger, and a click outside dismisses it.
 *
 * The one that earns the most attention is `popover-tooltip`, because the
 * hover-only tooltip is the single most common accessibility regression on the
 * web: it works perfectly for the person who wrote it and does not exist for
 * anyone navigating by keyboard.
 */
export const popoverComponents: ComponentEntry[] = [
  {
    slug: 'popover-basic',
    category: 'popover',
    tags: ['popover', 'click', 'overlay', 'dismiss', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-04-21',
    updatedAt: '2026-07-07',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1680, copies: 442, downloads: 118 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Click-triggered, so the trigger is a real <button> and the relationship is
  spelled out: aria-expanded says whether the panel is showing, aria-controls
  says which panel. aria-haspopup="dialog" - NOT "menu": this holds prose, and
  promising a menu makes a screen reader announce arrow-key navigation that
  does not exist here.

  The wrapper is position: relative so the panel anchors to the trigger rather
  than the viewport. That is the whole positioning story - no floating library,
  no measurement.
-->
<div class="pop">
  <button
    class="pop__trigger"
    type="button"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="pop-basic-panel"
  >
    Storage details
  </button>

  <div class="pop__panel" id="pop-basic-panel" role="dialog" aria-label="Storage details" hidden>
    <p class="pop__text">
      You are using <strong>18.2 GB</strong> of 50 GB. Old versions are pruned
      after 30 days.
    </p>
  </div>
</div>

<script>
  document.querySelectorAll('.pop').forEach(function (root) {
    var trigger = root.querySelector('.pop__trigger');
    var panel = root.querySelector('.pop__panel');

    function setOpen(open) {
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    // Escape closes and gives focus back. A popover the keyboard can open but
    // not leave is worse than one that never opened.
    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.focus();
    });

    // Outside click dismisses - mousedown, not click, so the popover is gone
    // before the thing underneath reacts.
    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.pop {
  position: relative;
  display: inline-block;
}

.pop__trigger {
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.pop__trigger:hover {
  background-color: #f9fafb;
}

.pop__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pop__panel[hidden] {
  display: none;
}

.pop__panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 20;
  width: 16rem;
  max-width: calc(100vw - 2rem);
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.pop__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

/*
 * The panel paints its own surface and floats over unknown content, so it needs
 * a border in BOTH themes - a shadow alone reads as depth on white and vanishes
 * on near-black, which is exactly when you most need the edge.
 */
@media (prefers-color-scheme: dark) {
  .pop__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .pop__trigger:hover {
    background-color: #1f2937;
  }

  .pop__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .pop__panel {
    border-color: #374151;
    background-color: #111827;
  }

  .pop__text {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="dialog"
    aria-expanded="true"
    aria-controls="pop-basic-panel"
    class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Storage details
  </button>

  <div
    id="pop-basic-panel"
    role="dialog"
    aria-label="Storage details"
    class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      You are using <strong class="font-semibold text-gray-900 dark:text-gray-100">18.2 GB</strong>
      of 50 GB. Old versions are pruned after 30 days.
    </p>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverBasic({ label, children }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event) {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        // "dialog", not "menu" - this holds prose, not menuitems.
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3.5 text-sm leading-relaxed text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {children}
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface PopoverBasicProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function PopoverBasic({ label, children, className = '' }: PopoverBasicProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className={\`relative inline-block \${className}\`} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3.5 text-sm leading-relaxed text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface PopoverBasicProps {
  /** The trigger's text, reused as the panel's accessible name. */
  label: string;
  children: ReactNode;
  className?: string;
}

export function PopoverBasic({
  label,
  children,
  className = '',
}: PopoverBasicProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    // mousedown, not click: dismiss before the element underneath reacts, or a
    // click that was meant to close the popover also activates what it lands on.
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    // No trap here - a popover does not take the page away - but focus must
    // still come home, or Tab resumes from a node that no longer exists.
    triggerRef.current?.focus();
  }

  return (
    <div className={\`relative inline-block \${className}\`} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3.5 text-sm leading-relaxed text-gray-600 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-tooltip',
    category: 'popover',
    tags: ['tooltip', 'hover', 'focus', 'aria-describedby', 'a11y'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-11',
    updatedAt: '2026-07-14',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 2890, copies: 806, downloads: 214 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'text', labelKey: 'text' },
    ],
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'delay', type: 'number', default: '150', descriptionKey: 'delay' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Read the listeners before the CSS. There are FOUR of them, in two pairs:

    mouseenter / mouseleave   the mouse user
    focus     / blur          everyone else

  A tooltip bound to hover alone is invisible to a keyboard user, and hover
  cannot be produced by a touch screen at all. The focus pair is not an
  enhancement; it is half the component. This is why a CSS :hover-only tooltip
  is a bug however elegant it looks.

  aria-describedby is what makes the text reach a screen reader. Without it the
  tooltip is a floating div that happens to be near a button, semantically
  unrelated to it. The tooltip's own role="tooltip" gives it the right
  announcement; the id link is what gets it announced at all.

  Escape dismisses it even while hovered - per APG, a tooltip covering the thing
  you are trying to read must be dismissable without moving the pointer.
-->
<span class="tip">
  <button class="tip__trigger" type="button" aria-describedby="tip-1">
    Retention
  </button>
  <span class="tip__bubble" id="tip-1" role="tooltip">
    Deleted items are recoverable for 30 days.
  </span>
</span>

<script>
  document.querySelectorAll('.tip').forEach(function (root) {
    var trigger = root.querySelector('.tip__trigger');
    var bubble = root.querySelector('.tip__bubble');
    var timer = null;

    function show() {
      // A short delay keeps the tooltip from strobing as the pointer crosses a
      // row of controls on its way somewhere else.
      timer = window.setTimeout(function () {
        bubble.classList.add('tip__bubble--in');
      }, 150);
    }

    function hide() {
      window.clearTimeout(timer);
      bubble.classList.remove('tip__bubble--in');
    }

    // Pointer.
    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    // Keyboard. Same handlers - the tooltip cannot tell how you arrived.
    trigger.addEventListener('focus', show);
    trigger.addEventListener('blur', hide);

    trigger.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') hide();
    });
  });
</script>`,
      css: `.tip {
  position: relative;
  display: inline-block;
}

.tip__trigger {
  padding: 0.375rem 0.625rem;
  border: 1px dashed #9ca3af;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: help;
}

.tip__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.tip__bubble {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 50%;
  z-index: 30;
  width: max-content;
  max-width: 16rem;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  background-color: #111827;
  color: #f9fafb;
  font-size: 0.75rem;
  line-height: 1.4;
  /*
   * visibility, NOT display: none. A display:none element is removed from the
   * accessibility tree, which would break the aria-describedby association the
   * whole component depends on. Opacity alone is not enough either - an
   * invisible bubble would still swallow the pointer.
   */
  visibility: hidden;
  opacity: 0;
  transform: translateX(-50%) translateY(0.25rem);
  transition: opacity 120ms ease-out, transform 120ms ease-out, visibility 120ms;
  pointer-events: none;
}

.tip__bubble--in {
  visibility: visible;
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/*
 * The bubble inverts against the page rather than matching it - that contrast
 * is what makes it read as "floating above" instead of "part of the layout".
 * So dark mode flips it the other way: near-white on dark, dark text.
 */
@media (prefers-color-scheme: dark) {
  .tip__trigger {
    border-color: #6b7280;
    color: #d1d5db;
  }

  .tip__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .tip__bubble {
    background-color: #f3f4f6;
    color: #111827;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tip__bubble {
    transition: none;
  }
}`,
      tailwind: `<!--
  group-hover AND group-focus-within. Dropping the second is the classic
  hover-only tooltip bug - it looks finished and is unreachable by keyboard.
-->
<span class="group relative inline-block">
  <button
    type="button"
    aria-describedby="tip-1"
    class="cursor-help rounded-md border border-dashed border-gray-400 px-2.5 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Retention
  </button>
  <span
    id="tip-1"
    role="tooltip"
    class="pointer-events-none invisible absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-64 -translate-x-1/2 translate-y-1 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs leading-snug text-gray-50 opacity-0 transition delay-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900"
  >
    Deleted items are recoverable for 30 days.
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function Tooltip({ text, children, delay = 150 }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(undefined);
  const tooltipId = useId();

  // Clear on unmount, or a tooltip whose trigger vanished mid-delay tries to
  // set state on a component that is gone.
  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show() {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-block"
      // Pointer users...
      onMouseEnter={show}
      onMouseLeave={hide}
      // ...and everyone else. Both, always.
      onFocus={show}
      onBlur={hide}
      onKeyDown={(event) => {
        if (event.key === 'Escape') hide();
      }}
    >
      {/* The trigger must carry aria-describedby={tooltipId} - that link is what
          makes the bubble reach a screen reader at all. */}
      <span aria-describedby={tooltipId}>{children}</span>

      <span
        id={tooltipId}
        role="tooltip"
        className={\`pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-64 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs leading-snug text-gray-50 transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 \${
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
        }\`}
      >
        {text}
      </span>
    </span>
  );
}

// Usage - the trigger has to be focusable, or the focus half never fires.
export function RetentionTooltip() {
  return (
    <Tooltip text="Deleted items are recoverable for 30 days.">
      <button
        type="button"
        className="cursor-help rounded-md border border-dashed border-gray-400 px-2.5 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400"
      >
        Retention
      </button>
    </Tooltip>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface TooltipProps {
  text: string;
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function Tooltip({ text, children, delay = 150, className = '' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show(): void {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    if (event.key === 'Escape') hide();
  }

  return (
    <span
      className={\`relative inline-block \${className}\`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      <span
        id={tooltipId}
        role="tooltip"
        className={\`pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-64 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs leading-snug text-gray-50 transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 \${
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
        }\`}
      >
        {text}
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TooltipProps {
  /** Plain text. A tooltip is a hint, not a container - no interactive nodes. */
  text: string;
  /** The trigger. Must be focusable, or the keyboard half never fires. */
  children: ReactNode;
  /** Milliseconds before showing. Stops a strobe as the pointer crosses a row. */
  delay?: number;
  className?: string;
}

export function Tooltip({
  text,
  children,
  delay = 150,
  className = '',
}: TooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show(): void {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    // APG: a tooltip must be dismissable without moving the pointer, because
    // it may be covering the very thing the user is trying to read.
    if (event.key === 'Escape') hide();
  }

  return (
    <span
      className={\`relative inline-block \${className}\`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={onKeyDown}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      {/*
        Kept mounted and hidden with visibility rather than unmounted: an
        aria-describedby pointing at an id that is not in the document
        describes nothing, and the bubble's job is to be described.
      */}
      <span
        id={tooltipId}
        role="tooltip"
        className={\`pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-64 -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs leading-snug text-gray-50 transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 \${
          open ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
        }\`}
      >
        {text}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'popover-rich-content',
    category: 'popover',
    tags: ['popover', 'rich', 'heading', 'action', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-04',
    updatedAt: '2026-07-11',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1310, copies: 344, downloads: 88 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', required: true, descriptionKey: 'copy' },
      { name: 'ctaLabel', type: 'string', default: "'Learn more'", descriptionKey: 'ctaLabel' },
      { name: 'onClick', type: '() => void', descriptionKey: 'onClick' },
    ],
    code: {
      html: `<!--
  This is the point where a tooltip stops being viable. There is a button
  inside, and a tooltip may not contain interactive content - you cannot hover
  your way to a control that disappears when the pointer leaves the trigger.
  So it is role="dialog", click-triggered, and labelled by its own heading via
  aria-labelledby instead of a hand-written aria-label.
-->
<div class="rpop">
  <button
    class="rpop__trigger"
    type="button"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="rpop-panel"
  >
    What is a seat?
  </button>

  <div
    class="rpop__panel"
    id="rpop-panel"
    role="dialog"
    aria-labelledby="rpop-title"
    hidden
  >
    <h3 class="rpop__title" id="rpop-title">Seats and billing</h3>
    <p class="rpop__copy">
      A seat is one person with access to this workspace. Seats are billed
      monthly and prorated the day someone joins.
    </p>
    <a class="rpop__cta" href="#billing">Read the billing guide</a>
  </div>
</div>

<script>
  document.querySelectorAll('.rpop').forEach(function (root) {
    var trigger = root.querySelector('.rpop__trigger');
    var panel = root.querySelector('.rpop__panel');

    function setOpen(open) {
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      // Move into the panel on open: the reason this popover exists is the
      // thing inside it, and Tab from the trigger should not have to walk past
      // the rest of the page to get there.
      if (next) root.querySelector('.rpop__cta').focus();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.focus();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.rpop {
  position: relative;
  display: inline-block;
}

.rpop__trigger {
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.rpop__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.rpop__panel[hidden] {
  display: none;
}

.rpop__panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  z-index: 20;
  width: 18rem;
  max-width: calc(100vw - 2rem);
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.rpop__title {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}

.rpop__copy {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.rpop__cta {
  display: inline-block;
  margin-top: 0.75rem;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
}

.rpop__cta:hover {
  text-decoration: underline;
}

.rpop__cta:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 0.25rem;
}

@media (prefers-color-scheme: dark) {
  .rpop__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .rpop__panel {
    border-color: #374151;
    background-color: #111827;
  }

  .rpop__title {
    color: #f3f4f6;
  }

  .rpop__copy {
    color: #9ca3af;
  }

  /* #1d4ed8 on #111827 fails AA outright - a link colour tuned for white is
     never reusable on a dark surface. */
  .rpop__cta {
    color: #93c5fd;
  }

  .rpop__trigger:focus-visible,
  .rpop__cta:focus-visible {
    outline-color: #60a5fa;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="dialog"
    aria-expanded="true"
    aria-controls="rpop-panel"
    class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    What is a seat?
  </button>

  <div
    id="rpop-panel"
    role="dialog"
    aria-labelledby="rpop-title"
    class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <h3 id="rpop-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">
      Seats and billing
    </h3>
    <p class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      A seat is one person with access to this workspace. Seats are billed
      monthly and prorated the day someone joins.
    </p>
    <a
      href="#billing"
      class="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
    >
      Read the billing guide
    </a>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverRichContent({ label, title, copy, ctaLabel = 'Learn more', onClick }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const ctaRef = useRef(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event) {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => ctaRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          // Labelled BY the heading - no duplicate aria-label to drift from it.
          aria-labelledby={titleId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          <button
            ref={ctaRef}
            type="button"
            onClick={onClick}
            className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface PopoverRichContentProps {
  label: string;
  title: string;
  copy: string;
  ctaLabel?: string;
  onClick?: () => void;
}

export function PopoverRichContent({
  label,
  title,
  copy,
  ctaLabel = 'Learn more',
  onClick,
}: PopoverRichContentProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => ctaRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          <button
            ref={ctaRef}
            type="button"
            onClick={onClick}
            className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * The presence of \`ctaLabel\`/\`onClick\` is exactly why this is a dialog rather
 * than a tooltip: a tooltip may not contain interactive content, because you
 * cannot hover your way into a bubble that closes when the pointer leaves.
 */
export interface PopoverRichContentProps {
  label: string;
  title: string;
  copy: string;
  ctaLabel?: string;
  onClick?: () => void;
}

export function PopoverRichContent({
  label,
  title,
  copy,
  ctaLabel = 'Learn more',
  onClick,
}: PopoverRichContentProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          // rAF, not a bare focus(): the panel does not exist until React has
          // committed this render, and focusing an unmounted node is a no-op.
          if (next) window.requestAnimationFrame(() => ctaRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
          <button
            ref={ctaRef}
            type="button"
            onClick={onClick}
            className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-menu',
    category: 'popover',
    tags: ['popover', 'menu', 'menuitem', 'keyboard', 'roving'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-06-19',
    updatedAt: '2026-07-12',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1040, copies: 271, downloads: 66 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'string[]', required: true, descriptionKey: 'items' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      html: `<!--
  The moment a popover contains a list of ACTIONS it stops being a dialog and
  becomes a menu, and the contract changes with it:

    aria-haspopup="menu"    promises the arrow-key model...
    role="menu"/"menuitem"  ...and these are the promise being kept
    Arrow/Home/End          the model itself
    Escape                  out, focus back to the trigger

  role="menu" without the key handling is the worse of the two failures: it
  tells a screen reader user to press Down and then does nothing when they do.
  The <li role="none"> is not noise - role="menu" only permits menuitem
  children, and a stray listitem in between breaks the structure.
-->
<div class="pmenu">
  <button
    class="pmenu__trigger"
    type="button"
    aria-haspopup="menu"
    aria-expanded="false"
    aria-controls="pmenu-list"
  >
    Actions
  </button>

  <ul class="pmenu__list" id="pmenu-list" role="menu" aria-label="Actions" hidden>
    <li role="none"><button class="pmenu__item" type="button" role="menuitem">Rename</button></li>
    <li role="none"><button class="pmenu__item" type="button" role="menuitem">Duplicate</button></li>
    <li role="none"><button class="pmenu__item" type="button" role="menuitem">Move to…</button></li>
    <li role="none"><button class="pmenu__item" type="button" role="menuitem">Archive</button></li>
  </ul>
</div>

<script>
  document.querySelectorAll('.pmenu').forEach(function (root) {
    var trigger = root.querySelector('.pmenu__trigger');
    var list = root.querySelector('.pmenu__list');
    var items = Array.prototype.slice.call(root.querySelectorAll('.pmenu__item'));

    function setOpen(open) {
      list.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    function close() {
      setOpen(false);
      trigger.focus();
    }

    trigger.addEventListener('click', function () {
      var next = trigger.getAttribute('aria-expanded') !== 'true';
      setOpen(next);
      if (next && items[0]) items[0].focus();
    });

    // Down from the closed trigger opens onto the first item, Up onto the last
    // - the platform convention, and the reason Up exists at all.
    trigger.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      event.preventDefault();
      setOpen(true);
      (event.key === 'ArrowDown' ? items[0] : items[items.length - 1]).focus();
    });

    list.addEventListener('keydown', function (event) {
      var index = items.indexOf(document.activeElement);

      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        items[0].focus();
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        items[items.length - 1].focus();
        return;
      }
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      if (index === -1) return;
      event.preventDefault();
      var next = event.key === 'ArrowDown' ? index + 1 : index - 1;
      // Wraps, because a menu is a ring: Down on the last item is the fastest
      // way back to the first.
      items[(next + items.length) % items.length].focus();
    });

    items.forEach(function (item) {
      item.addEventListener('click', close);
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.pmenu {
  position: relative;
  display: inline-block;
}

.pmenu__trigger {
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.pmenu__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.pmenu__list[hidden] {
  display: none;
}

.pmenu__list {
  position: absolute;
  top: calc(100% + 0.375rem);
  left: 0;
  z-index: 20;
  min-width: 12rem;
  margin: 0;
  padding: 0.25rem;
  list-style: none;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

.pmenu__item {
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

/*
 * :focus-visible, not :focus - arrow keys move real focus here, and the
 * highlight IS the cursor. Styling only :hover would leave a keyboard user
 * moving an invisible selection down an unchanged list.
 */
.pmenu__item:hover,
.pmenu__item:focus-visible {
  background-color: #f3f4f6;
  color: #111827;
  outline: none;
}

@media (prefers-color-scheme: dark) {
  .pmenu__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .pmenu__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .pmenu__list {
    border-color: #374151;
    background-color: #111827;
  }

  .pmenu__item {
    color: #d1d5db;
  }

  .pmenu__item:hover,
  .pmenu__item:focus-visible {
    background-color: #1f2937;
    color: #f3f4f6;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded="true"
    aria-controls="pmenu-list"
    class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Actions
  </button>

  <ul
    id="pmenu-list"
    role="menu"
    aria-label="Actions"
    class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Rename
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Duplicate
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Move to…
      </button>
    </li>
    <li role="none">
      <button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Archive
      </button>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverMenu({ label, items, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const itemsRef = useRef([]);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index) {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement);
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      window.requestAnimationFrame(() => focusItem(event.key === 'ArrowDown' ? 0 : items.length - 1));
      return;
    }
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <ul
          id={listId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
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

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface PopoverMenuProps {
  label: string;
  items: readonly string[];
  onSelect?: (item: string) => void;
}

export function PopoverMenu({ label, items, onSelect }: PopoverMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function focusItem(index: number): void {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul
          id={listId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
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
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface PopoverMenuProps {
  label: string;
  /** Menu item labels. Also the React keys, so keep them unique. */
  items: readonly string[];
  onSelect?: (item: string) => void;
}

export function PopoverMenu({ label, items, onSelect }: PopoverMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  /** Wraps both ways - a menu is a ring, not a list with two dead ends. */
  function focusItem(index: number): void {
    const count = items.length;
    itemsRef.current[((index % count) + count) % count]?.focus();
  }

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      close();
      return;
    }
    const index = itemsRef.current.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'Home') {
      event.preventDefault();
      focusItem(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      focusItem(items.length - 1);
      return;
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    // Down on the CLOSED trigger opens onto the first item, Up onto the last.
    // That asymmetry is the platform convention and the only reason Up exists
    // as an opening key at all.
    if (!open) {
      setOpen(true);
      const target = event.key === 'ArrowDown' ? 0 : items.length - 1;
      window.requestAnimationFrame(() => focusItem(target));
      return;
    }
    if (index === -1) return;
    focusItem(event.key === 'ArrowDown' ? index + 1 : index - 1);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) window.requestAnimationFrame(() => focusItem(0));
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul
          id={listId}
          role="menu"
          aria-label={label}
          className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {items.map((item, index) => (
            /* role="none" strips the implicit listitem: role="menu" only
               permits menuitem children, and a stray one breaks the tree. */
            <li role="none" key={item}>
              <button
                ref={(node) => {
                  itemsRef.current[index] = node;
                }}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect?.(item);
                  close();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
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
    slug: 'popover-arrow',
    category: 'popover',
    tags: ['popover', 'arrow', 'pointer', 'tail', 'anchored'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-02',
    updatedAt: '2026-07-16',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 720, copies: 184, downloads: 44 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'children' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Same popover, plus a tail that says which control it belongs to. Worth it when
  several triggers sit close together and "the panel under the button" is
  ambiguous.

  The arrow is a rotated square, not a border triangle. A CSS triangle is a
  solid colour and cannot carry the panel's 1px border across its two visible
  faces, so on a bordered panel it reads as a blob stuck to the edge. Half a
  rotated square, clipped by the panel, does.

  It is aria-hidden. It is a drawing of a relationship that aria-controls has
  already stated properly.
-->
<div class="apop">
  <button
    class="apop__trigger"
    type="button"
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-controls="apop-panel"
  >
    Sync status
  </button>

  <div class="apop__panel" id="apop-panel" role="dialog" aria-label="Sync status" hidden>
    <span class="apop__arrow" aria-hidden="true"></span>
    <p class="apop__text">
      Last synced 4 minutes ago. Changes upload automatically when you are back
      online.
    </p>
  </div>
</div>

<script>
  document.querySelectorAll('.apop').forEach(function (root) {
    var trigger = root.querySelector('.apop__trigger');
    var panel = root.querySelector('.apop__panel');

    function setOpen(open) {
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', String(open));
    }

    trigger.addEventListener('click', function () {
      setOpen(trigger.getAttribute('aria-expanded') !== 'true');
    });

    root.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      trigger.focus();
    });

    document.addEventListener('mousedown', function (event) {
      if (!root.contains(event.target)) setOpen(false);
    });
  });
</script>`,
      css: `.apop {
  position: relative;
  display: inline-block;
}

.apop__trigger {
  padding: 0.5rem 0.875rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #fff;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.apop__trigger:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.apop__panel[hidden] {
  display: none;
}

.apop__panel {
  position: absolute;
  top: calc(100% + 0.625rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: 16rem;
  max-width: calc(100vw - 2rem);
  padding: 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  background-color: #fff;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
}

/*
 * A rotated square, half of it poking out above the panel's top edge. Only the
 * two upper faces are given a border, so the arrow continues the panel's
 * outline instead of drawing a diamond on top of it.
 */
.apop__arrow {
  position: absolute;
  top: -0.3125rem;
  left: 50%;
  width: 0.625rem;
  height: 0.625rem;
  transform: translateX(-50%) rotate(45deg);
  border-top: 1px solid #e5e7eb;
  border-left: 1px solid #e5e7eb;
  background-color: #fff;
}

.apop__text {
  /* Above the arrow, so the tail cannot bleed over the copy. */
  position: relative;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .apop__trigger {
    border-color: #374151;
    background-color: #111827;
    color: #d1d5db;
  }

  .apop__trigger:focus-visible {
    outline-color: #60a5fa;
  }

  .apop__panel {
    border-color: #374151;
    background-color: #111827;
  }

  /* The arrow must be recoloured with the panel or it stays a white chip
     stuck to a dark card - the most visible way to get this wrong. */
  .apop__arrow {
    border-color: #374151;
    background-color: #111827;
  }

  .apop__text {
    color: #9ca3af;
  }
}`,
      tailwind: `<div class="relative inline-block">
  <button
    type="button"
    aria-haspopup="dialog"
    aria-expanded="true"
    aria-controls="apop-panel"
    class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Sync status
  </button>

  <div
    id="apop-panel"
    role="dialog"
    aria-label="Sync status"
    class="absolute left-1/2 top-[calc(100%+0.625rem)] z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
  >
    <!-- Rotated square with only two bordered faces - it continues the panel's
         outline rather than drawing a diamond on top of it. -->
    <span
      aria-hidden="true"
      class="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
    ></span>
    <p class="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      Last synced 4 minutes ago. Changes upload automatically when you are back
      online.
    </p>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverArrow({ label, children }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event) {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-1/2 top-[calc(100%+0.625rem)] z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {/* Decoration. aria-controls already states the relationship. */}
          <span
            aria-hidden="true"
            className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          />
          <div className="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}`,
      nextjs: `'use client';

import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface PopoverArrowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function PopoverArrow({ label, children, className = '' }: PopoverArrowProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className={\`relative inline-block \${className}\`} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-1/2 top-[calc(100%+0.625rem)] z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          <span
            aria-hidden="true"
            className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          />
          <div className="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface PopoverArrowProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export function PopoverArrow({
  label,
  children,
  className = '',
}: PopoverArrowProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className={\`relative inline-block \${className}\`} ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={label}
          className="absolute left-1/2 top-[calc(100%+0.625rem)] z-20 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-3.5 shadow-lg dark:border-gray-700 dark:bg-gray-900"
        >
          {/*
            border-l + border-t only. Rotated 45deg those two faces become the
            arrow's outward-facing edges, so the tail continues the panel's
            border; give it all four and you get a diamond seam across the top.
          */}
          <span
            aria-hidden="true"
            className="absolute -top-[5px] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-l border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
          />
          <div className="relative text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-form',
    category: 'popover',
    tags: ['popover', 'form', 'inline-edit', 'dialog', 'focus'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'fieldLabel', type: 'string', required: true, descriptionKey: 'fieldLabel' },
      { name: 'defaultValue', type: 'string', descriptionKey: 'defaultValue' },
      { name: 'onSubmit', type: '(value: string) => void', descriptionKey: 'onSubmit' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pform-panel" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Rename project
  </button>

  <div id="pform-panel" role="dialog" aria-labelledby="pform-title" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <h3 id="pform-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Rename project</h3>
    <form class="mt-3">
      <label for="pform-field" class="block text-xs font-medium text-gray-600 dark:text-gray-400">Project name</label>
      <input id="pform-field" type="text" value="Aurora" class="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      <div class="mt-3 flex justify-end gap-2">
        <button type="button" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cancel</button>
        <button type="submit" class="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Save</button>
      </div>
    </form>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverForm({ label, title, fieldLabel, defaultValue = '', onSubmit }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const panelId = useId();
  const titleId = useId();
  const fieldId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onSubmitForm(event) {
    event.preventDefault();
    onSubmit?.(value);
    close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          // Move focus into the field on open - the reason the panel exists.
          if (next) window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-labelledby={titleId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <form onSubmit={onSubmitForm} className="mt-3">
            <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400">{fieldLabel}</label>
            <input ref={inputRef} id={fieldId} type="text" value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={close} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cancel</button>
              <button type="submit" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

export interface PopoverFormProps {
  label: string;
  title: string;
  fieldLabel: string;
  defaultValue?: string;
  onSubmit?: (value: string) => void;
}

export function PopoverForm({
  label,
  title,
  fieldLabel,
  defaultValue = '',
  onSubmit,
}: PopoverFormProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const titleId = useId();
  const fieldId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  function onSubmitForm(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit?.(value);
    close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          // rAF: the input does not exist until React commits this render.
          if (next) window.requestAnimationFrame(() => inputRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-labelledby={titleId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <form onSubmit={onSubmitForm} className="mt-3">
            <label htmlFor={fieldId} className="block text-xs font-medium text-gray-600 dark:text-gray-400">{fieldLabel}</label>
            <input ref={inputRef} id={fieldId} type="text" value={value} onChange={(event) => setValue(event.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={close} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cancel</button>
              <button type="submit" className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Save</button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-confirm',
    category: 'popover',
    tags: ['popover', 'confirm', 'alertdialog', 'destructive', 'a11y'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'message', type: 'string', required: true, descriptionKey: 'message' },
      { name: 'confirmLabel', type: 'string', default: "'Confirm'", descriptionKey: 'confirmLabel' },
      { name: 'onConfirm', type: '() => void', descriptionKey: 'onConfirm' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pconfirm-panel" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Delete file
  </button>

  <!-- role="alertdialog": it interrupts to ask about a consequence, so it is
       labelled by its title AND described by its message. -->
  <div id="pconfirm-panel" role="alertdialog" aria-labelledby="pconfirm-title" aria-describedby="pconfirm-msg" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <h3 id="pconfirm-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Delete this file?</h3>
    <p id="pconfirm-msg" class="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">This permanently removes report.pdf. This action cannot be undone.</p>
    <div class="mt-4 flex justify-end gap-2">
      <!-- Focus lands here on open: the SAFE choice, never the destructive one. -->
      <button type="button" class="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cancel</button>
      <button type="button" class="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900">Delete</button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverConfirm({ label, title, message, confirmLabel = 'Confirm', onConfirm }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const cancelRef = useRef(null);
  const panelId = useId();
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          // Focus the SAFE action, not the destructive one a keystroke away.
          if (next) window.requestAnimationFrame(() => cancelRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div id={panelId} role="alertdialog" aria-labelledby={titleId} aria-describedby={messageId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p id={messageId} className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button ref={cancelRef} type="button" onClick={close} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cancel</button>
            <button type="button" onClick={() => { onConfirm?.(); close(); }} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900">{confirmLabel}</button>
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface PopoverConfirmProps {
  label: string;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
}

export function PopoverConfirm({
  label,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
}: PopoverConfirmProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          const next = !open;
          setOpen(next);
          // alertdialog convention: focus the least destructive action (Cancel),
          // so Enter on open never fires the irreversible path.
          if (next) window.requestAnimationFrame(() => cancelRef.current?.focus());
        }}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div id={panelId} role="alertdialog" aria-labelledby={titleId} aria-describedby={messageId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p id={messageId} className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{message}</p>
          <div className="mt-4 flex justify-end gap-2">
            <button ref={cancelRef} type="button" onClick={close} className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Cancel</button>
            <button type="button" onClick={() => { onConfirm?.(); close(); }} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-red-400 dark:focus-visible:ring-offset-gray-900">{confirmLabel}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-user-card',
    category: 'popover',
    tags: ['popover', 'user', 'profile', 'avatar', 'dialog'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'role', type: 'string', required: true, descriptionKey: 'role' },
      { name: 'bio', type: 'string', required: true, descriptionKey: 'bio' },
      { name: 'onFollow', type: '() => void', descriptionKey: 'onFollow' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="puser-panel" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Mara Lindqvist
  </button>

  <div id="puser-panel" role="dialog" aria-labelledby="puser-name" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="flex items-center gap-3">
      <!-- Initials on a gradient - no external image needed. -->
      <span aria-hidden="true" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white">ML</span>
      <div class="min-w-0">
        <p id="puser-name" class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Mara Lindqvist</p>
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">Staff Engineer - Platform</p>
      </div>
    </div>
    <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Works on the deployment pipeline and the CLI. Usually online 09:00-17:00 CET.</p>
    <button type="button" class="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Follow</button>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

export function PopoverUserCard({ name, role, bio, onFollow }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();
  const nameId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {name}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-labelledby={nameId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white">{initialsOf(name)}</span>
            <div className="min-w-0">
              <p id={nameId} className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{bio}</p>
          <button type="button" onClick={onFollow} className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Follow</button>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

/** First + last initial - the avatar's fallback when there is no image. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

export interface PopoverUserCardProps {
  name: string;
  role: string;
  bio: string;
  onFollow?: () => void;
}

export function PopoverUserCard({ name, role, bio, onFollow }: PopoverUserCardProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const nameId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {name}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-labelledby={nameId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-semibold text-white">{initialsOf(name)}</span>
            <div className="min-w-0">
              <p id={nameId} className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">{role}</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{bio}</p>
          <button type="button" onClick={onFollow} className="mt-3 w-full rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Follow</button>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-color-picker',
    category: 'popover',
    tags: ['popover', 'color', 'swatch', 'radiogroup', 'picker'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'colors', type: 'ReadonlyArray<{ name: string; swatch: string }>', required: true, descriptionKey: 'colors' },
      { name: 'value', type: 'string', descriptionKey: 'value' },
      { name: 'onChange', type: '(name: string) => void', descriptionKey: 'onChange' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pcolor-panel" class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <span aria-hidden="true" class="h-3.5 w-3.5 rounded-full bg-blue-500"></span>
    Label: Blue
  </button>

  <div id="pcolor-panel" role="dialog" aria-label="Label" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <!-- radiogroup + radio: a colour choice is single-select, so a reader
         announces "6 of 8, selected". Each swatch needs an aria-label. -->
    <div role="radiogroup" aria-label="Label" class="grid grid-cols-4 gap-2">
      <button type="button" role="radio" aria-checked="false" aria-label="Slate" class="flex h-9 w-full items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"><span class="h-6 w-6 rounded-full bg-slate-500"></span></button>
      <button type="button" role="radio" aria-checked="false" aria-label="Red" class="flex h-9 w-full items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"><span class="h-6 w-6 rounded-full bg-red-500"></span></button>
      <button type="button" role="radio" aria-checked="false" aria-label="Green" class="flex h-9 w-full items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"><span class="h-6 w-6 rounded-full bg-green-500"></span></button>
      <button type="button" role="radio" aria-checked="true" aria-label="Blue" class="flex h-9 w-full items-center justify-center rounded-md ring-2 ring-gray-900 ring-offset-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:ring-gray-100 dark:ring-offset-gray-900 dark:focus-visible:ring-blue-400"><span class="h-6 w-6 rounded-full bg-blue-500"></span></button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverColorPicker({ label, colors, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? colors[0]?.name ?? '');
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  const current = colors.find((color) => color.name === selected) ?? colors[0];

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true" className={\`h-3.5 w-3.5 rounded-full \${current?.swatch ?? ''}\`} />
        {label}: {current?.name}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2">
            {colors.map((color) => {
              const isActive = color.name === selected;
              return (
                <button
                  key={color.name}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={color.name}
                  onClick={() => { setSelected(color.name); onChange?.(color.name); }}
                  className={\`flex h-9 w-full items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${isActive ? 'ring-2 ring-gray-900 ring-offset-2 ring-offset-white dark:ring-gray-100 dark:ring-offset-gray-900' : ''}\`}
                >
                  <span className={\`h-6 w-6 rounded-full \${color.swatch}\`} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Swatch {
  name: string;
  /** A Tailwind background class, e.g. 'bg-blue-500'. Keep it a literal string
      so the JIT compiler can see and generate it. */
  swatch: string;
}

export interface PopoverColorPickerProps {
  label: string;
  colors: readonly Swatch[];
  value?: string;
  onChange?: (name: string) => void;
}

export function PopoverColorPicker({
  label,
  colors,
  value,
  onChange,
}: PopoverColorPickerProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value ?? colors[0]?.name ?? '');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  const current = colors.find((color) => color.name === selected) ?? colors[0];

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <span aria-hidden="true" className={\`h-3.5 w-3.5 rounded-full \${current?.swatch ?? ''}\`} />
        {label}: {current?.name}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-56 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {/* radiogroup + radio: a colour is single-select. aria-label per swatch
              because a colour block carries no text of its own. */}
          <div role="radiogroup" aria-label={label} className="grid grid-cols-4 gap-2">
            {colors.map((color) => {
              const isActive = color.name === selected;
              return (
                <button
                  key={color.name}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={color.name}
                  onClick={() => { setSelected(color.name); onChange?.(color.name); }}
                  className={\`flex h-9 w-full items-center justify-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 \${isActive ? 'ring-2 ring-gray-900 ring-offset-2 ring-offset-white dark:ring-gray-100 dark:ring-offset-gray-900' : ''}\`}
                >
                  <span className={\`h-6 w-6 rounded-full \${color.swatch}\`} />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-date-mini',
    category: 'popover',
    tags: ['popover', 'date', 'calendar', 'month', 'picker'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'year', type: 'number', required: true, descriptionKey: 'year' },
      { name: 'month', type: 'number', required: true, descriptionKey: 'month' },
      { name: 'selected', type: 'number', descriptionKey: 'selected' },
      { name: 'onSelect', type: '(day: number) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pdate-panel" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Due date: July 14
  </button>

  <div id="pdate-panel" role="dialog" aria-label="July 2026" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <p class="px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">July 2026</p>
    <div class="mt-2 grid grid-cols-7 gap-0.5">
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">Su</span>
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">Mo</span>
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">Tu</span>
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">We</span>
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">Th</span>
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">Fr</span>
      <span class="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">Sa</span>
      <!-- Leading blanks pad the first weekday; days follow. -->
      <span></span><span></span><span></span>
      <button type="button" aria-pressed="false" class="flex h-8 items-center justify-center rounded-md text-sm tabular-nums text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">1</button>
      <button type="button" aria-pressed="true" class="flex h-8 items-center justify-center rounded-md bg-blue-600 text-sm font-semibold tabular-nums text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">14</button>
      <!-- ...remaining days... -->
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useMemo, useRef, useState } from 'react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function PopoverDateMini({ label, year, month, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState(selected);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  const cells = useMemo(() => {
    const leading = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: leading }, () => null);
    const numbered = Array.from({ length: days }, (_, index) => index + 1);
    return [...blanks, ...numbered];
  }, [year, month]);

  const heading = useMemo(
    () => new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [year, month],
  );

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {chosen ? \`\${label}: \${heading.split(' ')[0]} \${chosen}\` : label}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-label={heading} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <p className="px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</p>
          <div className="mt-2 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} aria-hidden="true" className="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">{weekday}</span>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <span key={\`blank-\${index}\`} />;
              const isActive = day === chosen;
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => { setChosen(day); onSelect?.(day); close(); }}
                  className={\`flex h-8 items-center justify-center rounded-md text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${isActive ? 'bg-blue-600 font-semibold text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

const WEEKDAYS: readonly string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export interface PopoverDateMiniProps {
  label: string;
  year: number;
  /** 0-based, matching the Date constructor (0 = January). */
  month: number;
  selected?: number;
  onSelect?: (day: number) => void;
}

export function PopoverDateMini({
  label,
  year,
  month,
  selected,
  onSelect,
}: PopoverDateMiniProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<number | undefined>(selected);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const cells = useMemo<Array<number | null>>(() => {
    // getDay() of the 1st is the leading blank count; day 0 of next month is
    // this month's last day.
    const leading = new Date(year, month, 1).getDay();
    const days = new Date(year, month + 1, 0).getDate();
    const blanks: Array<number | null> = Array.from({ length: leading }, () => null);
    const numbered: Array<number | null> = Array.from({ length: days }, (_, index) => index + 1);
    return [...blanks, ...numbered];
  }, [year, month]);

  const heading = useMemo(
    () => new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    [year, month],
  );

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {chosen ? \`\${label}: \${heading.split(' ')[0]} \${chosen}\` : label}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-label={heading} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <p className="px-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</p>
          <div className="mt-2 grid grid-cols-7 gap-0.5">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} aria-hidden="true" className="py-1 text-center text-[0.65rem] font-medium uppercase text-gray-400 dark:text-gray-500">{weekday}</span>
            ))}
            {cells.map((day, index) => {
              if (day === null) return <span key={\`blank-\${index}\`} />;
              const isActive = day === chosen;
              return (
                <button
                  key={day}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => { setChosen(day); onSelect?.(day); close(); }}
                  className={\`flex h-8 items-center justify-center rounded-md text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 \${isActive ? 'bg-blue-600 font-semibold text-white' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-emoji',
    category: 'popover',
    tags: ['popover', 'emoji', 'reaction', 'picker', 'grid'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'emojis', type: 'ReadonlyArray<{ char: string; name: string }>', required: true, descriptionKey: 'emojis' },
      { name: 'onSelect', type: '(char: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pemoji-panel" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Add reaction
  </button>

  <div id="pemoji-panel" role="dialog" aria-label="Add reaction" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="grid grid-cols-6 gap-0.5">
      <!-- Each button carries an aria-label: the glyph alone announces
           inconsistently across screen readers. -->
      <button type="button" aria-label="Thumbs up" class="flex h-9 w-full items-center justify-center rounded-md text-lg hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:ring-blue-400"><span aria-hidden="true">&#128077;</span></button>
      <button type="button" aria-label="Heart" class="flex h-9 w-full items-center justify-center rounded-md text-lg hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:ring-blue-400"><span aria-hidden="true">&#10084;&#65039;</span></button>
      <button type="button" aria-label="Party" class="flex h-9 w-full items-center justify-center rounded-md text-lg hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:ring-blue-400"><span aria-hidden="true">&#127881;</span></button>
      <!-- ...more emoji... -->
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverEmoji({ label, emojis, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') close(); }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-6 gap-0.5">
            {emojis.map((emoji) => (
              <button
                key={emoji.name}
                type="button"
                aria-label={emoji.name}
                onClick={() => { onSelect?.(emoji.char); close(); }}
                className="flex h-9 w-full items-center justify-center rounded-md text-lg hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <span aria-hidden="true">{emoji.char}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Emoji {
  char: string;
  /** Accessible name for the button - the glyph alone is not reliable. */
  name: string;
}

export interface PopoverEmojiProps {
  label: string;
  emojis: readonly Emoji[];
  onSelect?: (char: string) => void;
}

export function PopoverEmoji({ label, emojis, onSelect }: PopoverEmojiProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function close(): void {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') close();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-label={label} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="grid grid-cols-6 gap-0.5">
            {emojis.map((emoji) => (
              <button
                key={emoji.name}
                type="button"
                aria-label={emoji.name}
                onClick={() => { onSelect?.(emoji.char); close(); }}
                className="flex h-9 w-full items-center justify-center rounded-md text-lg hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800 dark:focus-visible:ring-blue-400"
              >
                <span aria-hidden="true">{emoji.char}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-share',
    category: 'popover',
    tags: ['popover', 'share', 'copy', 'link', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'url', type: 'string', required: true, descriptionKey: 'url' },
      { name: 'destinations', type: 'readonly string[]', descriptionKey: 'destinations' },
      { name: 'onCopy', type: '() => void', descriptionKey: 'onCopy' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pshare-panel" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Share
  </button>

  <div id="pshare-panel" role="dialog" aria-labelledby="pshare-title" class="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <h3 id="pshare-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Share this page</h3>
    <!-- The row stacks under 320px (flex-col) and sits inline from sm up. -->
    <div class="mt-3 flex flex-col gap-2 sm:flex-row">
      <input type="text" readonly value="https://adysre.app/p/aurora-launch" aria-label="Shareable link" class="w-full min-w-0 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400" />
      <button type="button" class="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Copy</button>
    </div>
    <div class="mt-3 flex flex-wrap gap-2">
      <button type="button" class="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Email</button>
      <button type="button" class="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Slack</button>
      <button type="button" class="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">Link</button>
    </div>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverShare({ label, url, destinations = ['Email', 'Slack', 'Link'], onCopy }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function copy() {
    inputRef.current?.select();
    navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    onCopy?.();
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-labelledby={titleId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">Share this page</h3>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input ref={inputRef} type="text" readOnly value={url} aria-label="Shareable link" className="w-full min-w-0 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400" />
            <button type="button" onClick={copy} className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {destinations.map((destination) => (
              <button key={destination} type="button" className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{destination}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface PopoverShareProps {
  label: string;
  url: string;
  destinations?: readonly string[];
  onCopy?: () => void;
}

export function PopoverShare({
  label,
  url,
  destinations = ['Email', 'Slack', 'Link'],
  onCopy,
}: PopoverShareProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  function copy(): void {
    inputRef.current?.select();
    // Optional chaining short-circuits where the Clipboard API is unavailable.
    navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    onCopy?.();
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-labelledby={titleId} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">Share this page</h3>
          {/* Stacks under 320px, inline from sm up. */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input ref={inputRef} type="text" readOnly value={url} aria-label="Shareable link" className="w-full min-w-0 rounded-md border border-gray-300 bg-gray-50 px-2.5 py-1.5 text-sm text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:focus-visible:ring-blue-400" />
            <button type="button" onClick={copy} className="shrink-0 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {destinations.map((destination) => (
              <button key={destination} type="button" className="rounded-md border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">{destination}</button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-nested',
    category: 'popover',
    tags: ['popover', 'menu', 'submenu', 'nested', 'keyboard'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'items', type: 'readonly string[]', required: true, descriptionKey: 'items' },
      { name: 'moreLabel', type: 'string', required: true, descriptionKey: 'moreLabel' },
      { name: 'moreItems', type: 'readonly string[]', required: true, descriptionKey: 'moreItems' },
      { name: 'onSelect', type: '(item: string) => void', descriptionKey: 'onSelect' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <button type="button" aria-haspopup="menu" aria-expanded="true" aria-controls="pnest-menu" class="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Actions
  </button>

  <ul id="pnest-menu" role="menu" aria-label="Actions" class="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Rename</button></li>
    <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Duplicate</button></li>
    <li role="none" class="relative">
      <!-- Submenu trigger: aria-haspopup="menu" + aria-expanded describe the
           branch. ArrowRight/Enter open it, ArrowLeft/Escape step back. -->
      <button type="button" role="menuitem" aria-haspopup="menu" aria-expanded="true" aria-controls="pnest-sub" class="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">
        Move to&#8230;
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="m9 6 6 6-6 6" /></svg>
      </button>
      <!-- Flies out on sm+, stacks inline at 320px so it never leaves the viewport. -->
      <ul id="pnest-sub" role="menu" aria-label="Move to" class="mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 shadow-lg sm:absolute sm:left-full sm:top-0 sm:ml-1 sm:mt-0 sm:w-44 dark:border-gray-700 dark:bg-gray-900">
        <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Inbox</button></li>
        <li role="none"><button type="button" role="menuitem" class="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">Archive</button></li>
      </ul>
    </li>
  </ul>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverNested({ label, items, moreLabel, moreItems, onSelect }) {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const subTriggerRef = useRef(null);
  const firstSubRef = useRef(null);
  const menuId = useId();
  const subId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) { setOpen(false); setSubOpen(false); }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function closeAll() { setOpen(false); setSubOpen(false); triggerRef.current?.focus(); }
  function openSub() { setSubOpen(true); window.requestAnimationFrame(() => firstSubRef.current?.focus()); }
  function closeSub() { setSubOpen(false); subTriggerRef.current?.focus(); }
  function choose(item) { onSelect?.(item); closeAll(); }

  return (
    <div
      className="relative inline-block"
      ref={rootRef}
      onKeyDown={(event) => {
        if (event.key !== 'Escape') return;
        event.stopPropagation();
        if (subOpen) closeSub(); else closeAll();
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open && (
        <ul id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item) => (
            <li role="none" key={item}>
              <button type="button" role="menuitem" onClick={() => choose(item)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
            </li>
          ))}
          <li role="none" className="relative">
            <button
              ref={subTriggerRef}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={subOpen}
              aria-controls={subId}
              onClick={() => (subOpen ? closeSub() : openSub())}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openSub(); }
              }}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
            >
              {moreLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" /></svg>
            </button>
            {subOpen && (
              <ul
                id={subId}
                role="menu"
                aria-label={moreLabel}
                onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); closeSub(); } }}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 shadow-lg sm:absolute sm:left-full sm:top-0 sm:ml-1 sm:mt-0 sm:w-44 dark:border-gray-700 dark:bg-gray-900"
              >
                {moreItems.map((item, index) => (
                  <li role="none" key={item}>
                    <button ref={index === 0 ? firstSubRef : undefined} type="button" role="menuitem" onClick={() => choose(item)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface PopoverNestedProps {
  label: string;
  items: readonly string[];
  moreLabel: string;
  moreItems: readonly string[];
  onSelect?: (item: string) => void;
}

export function PopoverNested({
  label,
  items,
  moreLabel,
  moreItems,
  onSelect,
}: PopoverNestedProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const subTriggerRef = useRef<HTMLButtonElement>(null);
  const firstSubRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const subId = useId();

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) { setOpen(false); setSubOpen(false); }
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function closeAll(): void {
    setOpen(false);
    setSubOpen(false);
    triggerRef.current?.focus();
  }

  function openSub(): void {
    setSubOpen(true);
    window.requestAnimationFrame(() => firstSubRef.current?.focus());
  }

  function closeSub(): void {
    setSubOpen(false);
    subTriggerRef.current?.focus();
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    // Escape peels one layer: the submenu first, then the whole menu.
    event.stopPropagation();
    if (subOpen) closeSub();
    else closeAll();
  }

  function choose(item: string): void {
    onSelect?.(item);
    closeAll();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((state) => !state)}
        className="rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>

      {open ? (
        <ul id={menuId} role="menu" aria-label={label} className="absolute left-0 top-[calc(100%+0.375rem)] z-20 min-w-48 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {items.map((item) => (
            <li role="none" key={item}>
              <button type="button" role="menuitem" onClick={() => choose(item)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
            </li>
          ))}
          <li role="none" className="relative">
            <button
              ref={subTriggerRef}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={subOpen}
              aria-controls={subId}
              onClick={() => (subOpen ? closeSub() : openSub())}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openSub();
                }
              }}
              className="flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100"
            >
              {moreLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" /></svg>
            </button>

            {subOpen ? (
              <ul
                id={subId}
                role="menu"
                aria-label={moreLabel}
                onKeyDown={(event) => { if (event.key === 'ArrowLeft') { event.preventDefault(); closeSub(); } }}
                // Flies out on sm+, stacks inline at 320px so it never escapes.
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white p-1 shadow-lg sm:absolute sm:left-full sm:top-0 sm:ml-1 sm:mt-0 sm:w-44 dark:border-gray-700 dark:bg-gray-900"
              >
                {moreItems.map((item, index) => (
                  <li role="none" key={item}>
                    <button ref={index === 0 ? firstSubRef : undefined} type="button" role="menuitem" onClick={() => choose(item)} className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:bg-gray-100 focus-visible:text-gray-900 focus-visible:outline-none dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:bg-gray-800 dark:focus-visible:text-gray-100">{item}</button>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        </ul>
      ) : null}
    </div>
  );
}`,
    },
  },
  {
    slug: 'popover-hover-card',
    category: 'popover',
    tags: ['popover', 'hover', 'focus', 'preview', 'card'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'trigger', type: 'string', required: true, descriptionKey: 'trigger' },
      { name: 'name', type: 'string', required: true, descriptionKey: 'name' },
      { name: 'meta', type: 'string', required: true, descriptionKey: 'meta' },
      { name: 'description', type: 'string', required: true, descriptionKey: 'description' },
      { name: 'linkLabel', type: 'string', default: "'View profile'", descriptionKey: 'linkLabel' },
      { name: 'delay', type: 'number', default: '200', descriptionKey: 'delay' },
    ],
    code: {
      tailwind: `<!--
  Hover cards are the one popover that opens on hover - but hover alone is a bug:
  invisible to the keyboard and impossible on touch. So this opens on
  group-hover AND group-focus-within, the same pairing the tooltip needs.
-->
<span class="group relative inline-block">
  <button type="button" class="rounded-sm font-semibold text-blue-700 underline decoration-dotted underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400">
    @dorian
  </button>

  <span role="dialog" aria-label="Dorian Vega" class="pointer-events-none invisible absolute left-0 top-[calc(100%+0.5rem)] z-20 block w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 text-left opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900">
    <span class="flex items-center gap-3">
      <span aria-hidden="true" class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">DV</span>
      <span class="min-w-0">
        <span class="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Dorian Vega</span>
        <span class="block truncate text-xs text-gray-500 dark:text-gray-400">Design Systems - joined 2023</span>
      </span>
    </span>
    <span class="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-400">Maintains the token pipeline and the icon set.</span>
    <a href="#profile" class="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">View profile</a>
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

function initialsOf(name) {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

export function PopoverHoverCard({ trigger, name, meta, description, linkLabel = 'View profile', delay = 200 }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const timerRef = useRef(undefined);
  const cardId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show() {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-block"
      ref={rootRef}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(event) => { if (!rootRef.current?.contains(event.relatedTarget)) hide(); }}
      onKeyDown={(event) => { if (event.key === 'Escape') hide(); }}
    >
      <button type="button" aria-expanded={open} aria-controls={cardId} className="rounded-sm font-semibold text-blue-700 underline decoration-dotted underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400">
        {trigger}
      </button>

      {open && (
        <span id={cardId} role="dialog" aria-label={name} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 block w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 text-left shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">{initialsOf(name)}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{meta}</span>
            </span>
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</span>
          <a href="#profile" className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{linkLabel}</a>
        </span>
      )}
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';

/** First + last initial for the gradient avatar - no external image. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\\s+/);
  const first = parts[0]?.charAt(0) ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.charAt(0) ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

export interface PopoverHoverCardProps {
  /** The inline word or handle that reveals the card. */
  trigger: string;
  name: string;
  meta: string;
  description: string;
  linkLabel?: string;
  /** Milliseconds before opening - stops a flicker as the pointer passes. */
  delay?: number;
}

export function PopoverHoverCard({
  trigger,
  name,
  meta,
  description,
  linkLabel = 'View profile',
  delay = 200,
}: PopoverHoverCardProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | undefined>(undefined);
  const cardId = useId();

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  function show(): void {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  }

  function onBlur(event: FocusEvent<HTMLSpanElement>): void {
    // Keep open while focus travels BETWEEN the trigger and the card's own link.
    if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
    hide();
  }

  function onKeyDown(event: KeyboardEvent<HTMLSpanElement>): void {
    if (event.key === 'Escape') hide();
  }

  return (
    <span
      className="relative inline-block"
      ref={rootRef}
      // Pointer AND keyboard: the focus half is not optional - hover alone is
      // invisible to the keyboard and impossible on touch.
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
    >
      <button type="button" aria-expanded={open} aria-controls={cardId} className="rounded-sm font-semibold text-blue-700 underline decoration-dotted underline-offset-2 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:text-blue-200 dark:focus-visible:ring-blue-400">
        {trigger}
      </button>

      {open ? (
        <span id={cardId} role="dialog" aria-label={name} className="absolute left-0 top-[calc(100%+0.5rem)] z-20 block w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-4 text-left shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <span className="flex items-center gap-3">
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-sm font-semibold text-white">{initialsOf(name)}</span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{name}</span>
              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{meta}</span>
            </span>
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-gray-600 dark:text-gray-400">{description}</span>
          <a href="#profile" className="mt-3 inline-block rounded-sm text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{linkLabel}</a>
        </span>
      ) : null}
    </span>
  );
}`,
    },
  },
  {
    slug: 'popover-notification',
    category: 'popover',
    tags: ['popover', 'notifications', 'bell', 'badge', 'dialog'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'notes', type: 'ReadonlyArray<{ id: string; title: string; time: string; unread: boolean }>', required: true, descriptionKey: 'notes' },
      { name: 'onMarkAllRead', type: '() => void', descriptionKey: 'onMarkAllRead' },
    ],
    code: {
      tailwind: `<div class="relative inline-block">
  <!-- The unread count is announced via aria-label, not just painted on a badge. -->
  <button type="button" aria-haspopup="dialog" aria-expanded="true" aria-controls="pnotif-panel" aria-label="Notifications, 2 unread" class="relative rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-5 w-5" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9" /></svg>
    <span aria-hidden="true" class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[0.6rem] font-semibold text-white">2</span>
  </button>

  <!-- right-0: a top-right bell would run a left-anchored panel off-screen. -->
  <div id="pnotif-panel" role="dialog" aria-labelledby="pnotif-title" class="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
    <div class="flex items-center justify-between px-2 py-1">
      <h3 id="pnotif-title" class="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
      <button type="button" class="rounded text-xs font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:focus-visible:ring-blue-400">Mark all read</button>
    </div>
    <ul class="mt-1 flex flex-col">
      <li>
        <button type="button" class="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
          <span aria-hidden="true" class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400"></span>
          <span class="min-w-0">
            <span class="block text-sm text-gray-800 dark:text-gray-200">Mara approved your pull request</span>
            <span class="block text-xs text-gray-500 dark:text-gray-400">2m ago</span>
          </span>
        </button>
      </li>
    </ul>
  </div>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PopoverNotification({ label, notes, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(notes);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();
  const titleId = useId();

  const unreadCount = items.filter((item) => item.unread).length;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function markAllRead() {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    onMarkAllRead?.();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={(event) => { if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus(); } }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={\`\${label}, \${unreadCount} unread\`}
        onClick={() => setOpen((state) => !state)}
        className="relative rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9" /></svg>
        {unreadCount > 0 && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[0.6rem] font-semibold text-white">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div id={panelId} role="dialog" aria-labelledby={titleId} className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between px-2 py-1">
            <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
            <button type="button" onClick={markAllRead} disabled={unreadCount === 0} className="rounded text-xs font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:text-gray-400 disabled:no-underline dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:disabled:text-gray-600">Mark all read</button>
          </div>
          <ul className="mt-1 flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button type="button" className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                  <span aria-hidden="true" className={\`mt-1.5 h-2 w-2 shrink-0 rounded-full \${item.unread ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}\`} />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface Note {
  id: string;
  title: string;
  time: string;
  unread: boolean;
}

export interface PopoverNotificationProps {
  label: string;
  notes: readonly Note[];
  onMarkAllRead?: () => void;
}

export function PopoverNotification({
  label,
  notes,
  onMarkAllRead,
}: PopoverNotificationProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<readonly Note[]>(notes);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  const unreadCount = items.filter((item) => item.unread).length;

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event: MouseEvent): void {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key !== 'Escape') return;
    setOpen(false);
    triggerRef.current?.focus();
  }

  function markAllRead(): void {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
    onMarkAllRead?.();
  }

  return (
    <div className="relative inline-block" ref={rootRef} onKeyDown={onKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        // The count is announced, not just painted on the badge.
        aria-label={\`\${label}, \${unreadCount} unread\`}
        onClick={() => setOpen((state) => !state)}
        className="relative rounded-lg border border-gray-300 bg-white p-2 text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 0 1-6 0v-1m6 0H9" /></svg>
        {unreadCount > 0 ? (
          <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[0.6rem] font-semibold text-white">{unreadCount}</span>
        ) : null}
      </button>

      {open ? (
        <div id={panelId} role="dialog" aria-labelledby={titleId} className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-72 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between px-2 py-1">
            <h3 id={titleId} className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</h3>
            <button type="button" onClick={markAllRead} disabled={unreadCount === 0} className="rounded text-xs font-medium text-blue-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:text-gray-400 disabled:no-underline dark:text-blue-300 dark:focus-visible:ring-blue-400 dark:disabled:text-gray-600">Mark all read</button>
          </div>
          <ul className="mt-1 flex flex-col">
            {items.map((item) => (
              <li key={item.id}>
                <button type="button" className="flex w-full items-start gap-2 rounded-md px-2 py-2 text-left hover:bg-gray-100 focus-visible:bg-gray-100 focus-visible:outline-none dark:hover:bg-gray-800 dark:focus-visible:bg-gray-800">
                  <span aria-hidden="true" className={\`mt-1.5 h-2 w-2 shrink-0 rounded-full \${item.unread ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}\`} />
                  <span className="min-w-0">
                    <span className="block text-sm text-gray-800 dark:text-gray-200">{item.title}</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400">{item.time}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}`,
    },
  },
];
