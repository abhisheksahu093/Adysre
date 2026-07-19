import type { ComponentEntry } from './types';

/**
 * Tooltips category.
 *
 * Ten *true* tooltips, not popovers wearing the name: the content is a short,
 * non-interactive hint, and every one of them obeys the same three rules that
 * separate a tooltip from a decoration nobody can reach -
 *   1. it appears on keyboard FOCUS as well as hover, because a hint bound to
 *      hover alone does not exist for anyone driving by keyboard;
 *   2. it is wired with `role="tooltip"` + `aria-describedby`, so a screen
 *      reader announces it as the description of its trigger;
 *   3. the trigger is a real focusable control, which is also the only reason a
 *      touch user can summon the hint at all - a tap focuses the control, and
 *      `focus`/`focus-within` opens the tip.
 *
 * The pure-Tailwind tabs are CSS-only (`group-hover` + `group-focus-within`) and
 * ship zero JS; the React/TypeScript tabs add the behaviour that CSS genuinely
 * cannot express - a shared open-delay across a group, cursor tracking, a
 * click-to-pin latch, an open timer.
 */
export const tooltipsComponents: ComponentEntry[] = [
  {
    slug: 'tooltip-basic',
    category: 'tooltips',
    tags: ['tooltip', 'hint', 'hover', 'focus', 'accessible'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
      { name: 'delay', type: 'number', default: '150', descriptionKey: 'delay' },
    ],
    code: {
      tailwind: `<!--
  CSS-only, zero JS. group-hover handles the mouse; group-focus-within handles
  keyboard focus AND a touch tap (tapping the button focuses it) - so the hint is
  reachable without a pointer. That is why the trigger is a real <button>.
  role="tooltip" + aria-describedby ties the hint to its trigger for a screen reader.
-->
<span class="group relative inline-flex">
  <button
    type="button"
    aria-describedby="tt-basic"
    class="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
  >
    Hover or focus me
  </button>

  <span
    id="tt-basic"
    role="tooltip"
    class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900"
  >
    Changes are saved automatically.
    <span aria-hidden="true" class="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900 dark:bg-gray-100"></span>
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function Tooltip({ label, children, delay = 150 }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Hover waits out the delay; focus (keyboard or a touch tap) opens instantly -
  // a keyboard user should not have to hover-hold a control they cannot hover.
  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900 dark:bg-gray-100"
        />
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface TooltipProps {
  /** The hint text. Keep it short - a tooltip is a hint, not a paragraph. */
  label: string;
  /** The trigger. Must be focusable (a <button> or link) so keyboard and touch users can summon it too. */
  children: ReactNode;
  /** Hover-open delay in ms. Focus opens instantly. */
  delay?: number;
}

export function Tooltip({ label, children, delay = 150 }: TooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), delay);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-gray-900 dark:bg-gray-100"
        />
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-positions',
    category: 'tooltips',
    tags: ['tooltip', 'position', 'placement', 'top', 'bottom'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
      { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", descriptionKey: 'side' },
    ],
    code: {
      tailwind: `<!--
  One trigger per side. The placement is pure offset math - the tip is absolutely
  positioned against the group, and each side swaps which edge it anchors to.
  Every one is still keyboard-reachable (group-focus-within) and screen-reader
  described (role="tooltip" + aria-describedby).
-->
<div class="flex flex-wrap items-center justify-center gap-8">
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-pos-top" class="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Top</button>
    <span id="tt-pos-top" role="tooltip" class="pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Above</span>
  </span>

  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-pos-right" class="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Right</button>
    <span id="tt-pos-right" role="tooltip" class="pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Beside</span>
  </span>

  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-pos-bottom" class="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Bottom</button>
    <span id="tt-pos-bottom" role="tooltip" class="pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Below</span>
  </span>

  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-pos-left" class="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Left</button>
    <span id="tt-pos-left" role="tooltip" class="pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2 group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Beside</span>
  </span>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

// The four placements are offset presets, applied to a shared bubble.
const POSITIONS = {
  top: 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  right: 'left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2',
  bottom: 'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  left: 'right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2',
};

export function Tooltip({ label, children, side = 'top' }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          POSITIONS[side] +
          ' ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';

// The four placements are offset presets, applied to a shared bubble.
const POSITIONS: Record<TooltipSide, string> = {
  top: 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  right: 'left-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2',
  bottom: 'top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
  left: 'right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2',
};

export interface TooltipProps {
  label: string;
  children: ReactNode;
  /** Which edge of the trigger the tip anchors to. */
  side?: TooltipSide;
}

export function Tooltip({ label, children, side = 'top' }: TooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute z-30 w-max max-w-xs rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          POSITIONS[side] +
          ' ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-delay-group',
    category: 'tooltips',
    tags: ['tooltip', 'delay', 'group', 'provider', 'toolbar'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'delay', type: 'number', default: '600', descriptionKey: 'delay' },
      { name: 'skipDelay', type: 'number', default: '300', descriptionKey: 'skipDelay' },
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
    ],
    code: {
      tailwind: `<!--
  The CSS-only baseline: each icon in the toolbar owns an independent tooltip via
  group-hover / group-focus-within. The "warm group" behaviour - first tip waits
  out the delay, the rest open instantly while your pointer sweeps the row - is
  cross-element timing that CSS cannot express, so it lives in the React/TS tabs.
-->
<div class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-grp-bold" class="flex h-9 w-9 items-center justify-center rounded-md text-sm font-bold text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">B</button>
    <span id="tt-grp-bold" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Bold</span>
  </span>
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-grp-italic" class="flex h-9 w-9 items-center justify-center rounded-md text-sm italic text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">I</button>
    <span id="tt-grp-italic" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Italic</span>
  </span>
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-grp-under" class="flex h-9 w-9 items-center justify-center rounded-md text-sm text-gray-700 underline hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">U</button>
    <span id="tt-grp-under" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Underline</span>
  </span>
</div>`,
      react: `import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';

const GroupContext = createContext(null);

// Wrap a row of tooltips. The first opens after delay; once one has opened the
// group is "warm", so the rest open instantly until skipDelay after you leave.
export function TooltipGroup({ delay = 600, skipDelay = 300, children }) {
  const [warm, setWarm] = useState(false);
  const off = useRef(undefined);

  useEffect(() => () => window.clearTimeout(off.current), []);

  function arm() {
    window.clearTimeout(off.current);
    setWarm(true);
  }
  function disarm() {
    off.current = window.setTimeout(() => setWarm(false), skipDelay);
  }

  return (
    <GroupContext.Provider value={{ warm, arm, disarm, delay }}>{children}</GroupContext.Provider>
  );
}

export function Tooltip({ label, children }) {
  const group = useContext(GroupContext);
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show() {
    window.clearTimeout(timer.current);
    const wait = group && group.warm ? 0 : group ? group.delay : 150;
    timer.current = window.setTimeout(() => {
      setOpen(true);
      if (group) group.arm();
    }, wait);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
    if (group) group.disarm();
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
      typescript: `import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

interface GroupState {
  warm: boolean;
  arm: () => void;
  disarm: () => void;
  delay: number;
}

const GroupContext = createContext<GroupState | null>(null);

export interface TooltipGroupProps {
  /** Delay before the FIRST tip in the group opens (ms). */
  delay?: number;
  /** Grace window after leaving a trigger during which the next opens instantly (ms). */
  skipDelay?: number;
  children: ReactNode;
}

export function TooltipGroup({ delay = 600, skipDelay = 300, children }: TooltipGroupProps): JSX.Element {
  const [warm, setWarm] = useState(false);
  const off = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(off.current), []);

  function arm(): void {
    window.clearTimeout(off.current);
    setWarm(true);
  }
  function disarm(): void {
    off.current = window.setTimeout(() => setWarm(false), skipDelay);
  }

  return (
    <GroupContext.Provider value={{ warm, arm, disarm, delay }}>{children}</GroupContext.Provider>
  );
}

export interface TooltipProps {
  label: string;
  children: ReactNode;
}

export function Tooltip({ label, children }: TooltipProps): JSX.Element {
  const group = useContext(GroupContext);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(): void {
    window.clearTimeout(timer.current);
    const wait = group && group.warm ? 0 : group ? group.delay : 150;
    timer.current = window.setTimeout(() => {
      setOpen(true);
      group?.arm();
    }, wait);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
    group?.disarm();
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-rich',
    category: 'tooltips',
    tags: ['tooltip', 'rich', 'title', 'description', 'card'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'body', type: 'string', required: true, descriptionKey: 'body' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
    ],
    code: {
      tailwind: `<!--
  A richer bubble - a bold title over a line of description - but still a tooltip:
  the content is read-only, so it stays non-interactive (no links or buttons in
  here, or it would need to be a popover with focus management). Everything else
  is the same contract: focus-reachable, role="tooltip", aria-describedby.
-->
<span class="group relative inline-flex">
  <button type="button" aria-describedby="tt-rich" class="cursor-default rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    SLA
  </button>
  <span id="tt-rich" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-left opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100">
    <span class="block text-xs font-semibold text-gray-50 dark:text-gray-900">99.99% uptime</span>
    <span class="mt-1 block text-xs leading-snug text-gray-300 dark:text-gray-600">Measured monthly, excluding scheduled maintenance windows announced 48h ahead.</span>
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function RichTooltip({ title, body, children }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-left shadow-lg transition motion-reduce:transition-none dark:bg-gray-100 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        <span className="block text-xs font-semibold text-gray-50 dark:text-gray-900">{title}</span>
        <span className="mt-1 block text-xs leading-snug text-gray-300 dark:text-gray-600">{body}</span>
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface RichTooltipProps {
  title: string;
  body: string;
  children: ReactNode;
}

export function RichTooltip({ title, body, children }: RichTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg bg-gray-900 p-3 text-left shadow-lg transition motion-reduce:transition-none dark:bg-gray-100 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        <span className="block text-xs font-semibold text-gray-50 dark:text-gray-900">{title}</span>
        <span className="mt-1 block text-xs leading-snug text-gray-300 dark:text-gray-600">{body}</span>
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-icon-help',
    category: 'tooltips',
    tags: ['tooltip', 'help', 'icon', 'form', 'hint'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'hint', type: 'string', required: true, descriptionKey: 'hint' },
      { name: 'srLabel', type: 'string', default: "'More information'", descriptionKey: 'srLabel' },
      { name: 'children', type: 'ReactNode', descriptionKey: 'trigger' },
    ],
    code: {
      tailwind: `<!--
  The classic help dot beside a field label. The button carries an aria-label
  ("More information") because a bare "?" is not a name, and aria-describedby
  points at the hint. Focus-within reveals it, so keyboard and touch both work.
-->
<span class="inline-flex items-center gap-1.5">
  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">API key</span>
  <span class="group relative inline-flex">
    <button type="button" aria-label="More information" aria-describedby="tt-help" class="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-[0.7rem] font-bold leading-none text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">?</button>
    <span id="tt-help" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Found under Settings → Developer. Treat it like a password.</span>
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function HelpTooltip({ hint, srLabel = 'More information', children }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {children ? (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</span>
      ) : null}
      <span
        className="relative inline-flex"
        onMouseEnter={() => show(false)}
        onMouseLeave={hide}
        onFocus={() => show(true)}
        onBlur={hide}
        onKeyDown={(e) => {
          if (e.key === 'Escape') hide();
        }}
      >
        <button
          type="button"
          aria-label={srLabel}
          aria-describedby={id}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-[0.7rem] font-bold leading-none text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          ?
        </button>
        <span
          id={id}
          role="tooltip"
          className={
            'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
            (open ? 'visible opacity-100' : 'invisible opacity-0')
          }
        >
          {hint}
        </span>
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface HelpTooltipProps {
  /** The hint the "?" reveals. */
  hint: string;
  /** Accessible name for the icon button - a bare "?" is not a name. */
  srLabel?: string;
  /** Optional visible label rendered before the icon. */
  children?: ReactNode;
}

export function HelpTooltip({ hint, srLabel = 'More information', children }: HelpTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {children ? (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{children}</span>
      ) : null}
      <span
        className="relative inline-flex"
        onMouseEnter={() => show(false)}
        onMouseLeave={hide}
        onFocus={() => show(true)}
        onBlur={hide}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Escape') hide();
        }}
      >
        <button
          type="button"
          aria-label={srLabel}
          aria-describedby={id}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-[0.7rem] font-bold leading-none text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:text-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
        >
          ?
        </button>
        <span
          id={id}
          role="tooltip"
          className={
            'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
            (open ? 'visible opacity-100' : 'invisible opacity-0')
          }
        >
          {hint}
        </span>
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-truncation',
    category: 'tooltips',
    tags: ['tooltip', 'truncate', 'ellipsis', 'overflow', 'text'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'text', type: 'string', required: true, descriptionKey: 'text' },
      { name: 'className', type: 'string', default: "''", descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A cell that ellipsises its text and reveals the full string on hover/focus. The
  trigger IS the truncated text, made a real <button> so it can take focus (and a
  tap) - truncated text with no way to read the rest is a dead end on a phone.
  The full string lives in the tooltip AND remains the button's text, so a screen
  reader reads it whole regardless of the visual clip.
-->
<span class="group relative inline-flex max-w-[12rem]">
  <button type="button" aria-describedby="tt-trunc" class="block max-w-full truncate rounded text-left text-sm text-gray-800 underline decoration-dotted decoration-gray-400 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-200 dark:decoration-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    /var/log/app/2026-07-17/request-9f2c1a-timeout.log
  </button>
  <span id="tt-trunc" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max max-w-[calc(100vw-2rem)] rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">
    /var/log/app/2026-07-17/request-9f2c1a-timeout.log
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function TruncatedTooltip({ text, className = '' }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className={'relative inline-flex max-w-full ' + className}
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <button
        type="button"
        aria-describedby={id}
        className="block max-w-full truncate rounded text-left text-sm text-gray-800 underline decoration-dotted decoration-gray-400 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-200 dark:decoration-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {text}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max max-w-[calc(100vw-2rem)] rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {text}
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface TruncatedTooltipProps {
  /** The full string. Shown clipped in the trigger, whole in the tooltip. */
  text: string;
  /** Width constraint for the trigger, e.g. 'max-w-[12rem]'. */
  className?: string;
}

export function TruncatedTooltip({ text, className = '' }: TruncatedTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className={'relative inline-flex max-w-full ' + className}
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <button
        type="button"
        aria-describedby={id}
        className="block max-w-full truncate rounded text-left text-sm text-gray-800 underline decoration-dotted decoration-gray-400 underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-gray-200 dark:decoration-gray-500 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {text}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max max-w-[calc(100vw-2rem)] rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {text}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-kbd-shortcut',
    category: 'tooltips',
    tags: ['tooltip', 'keyboard', 'shortcut', 'kbd', 'hotkey'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'keys', type: 'string[]', required: true, descriptionKey: 'keys' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
    ],
    code: {
      tailwind: `<!--
  Label plus its hotkey, the keys in real <kbd> elements so they read as keys, not
  prose. The keys are decoration of the label, so the whole bubble is one
  tooltip - announced as the trigger's description.
-->
<span class="group relative inline-flex">
  <button type="button" aria-describedby="tt-kbd" class="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    <svg viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path d="M4 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Zm2 3h8v2H6V6Zm0 4h5v2H6v-2Z" /></svg>
    <span class="sr-only">Save</span>
  </button>
  <span id="tt-kbd" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-1.5 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">
    Save
    <kbd class="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[0.65rem] dark:border-black/20 dark:bg-black/10">Ctrl</kbd>
    <kbd class="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[0.65rem] dark:border-black/20 dark:bg-black/10">S</kbd>
  </span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function ShortcutTooltip({ label, keys, children }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-1.5 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[0.65rem] dark:border-black/20 dark:bg-black/10"
          >
            {k}
          </kbd>
        ))}
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface ShortcutTooltipProps {
  label: string;
  /** Each key rendered as its own <kbd>, e.g. ['Ctrl', 'S']. */
  keys: string[];
  children: ReactNode;
}

export function ShortcutTooltip({ label, keys, children }: ShortcutTooltipProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 flex w-max -translate-x-1/2 items-center gap-1.5 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
        {keys.map((k, i) => (
          <kbd
            key={i}
            className="rounded border border-white/25 bg-white/10 px-1.5 py-0.5 font-sans text-[0.65rem] dark:border-black/20 dark:bg-black/10"
          >
            {k}
          </kbd>
        ))}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-follow-cursor',
    category: 'tooltips',
    tags: ['tooltip', 'cursor', 'pointer', 'follow', 'motion'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
    ],
    code: {
      tailwind: `<!--
  CSS-only baseline: the hint pins above the trigger on hover/focus. Making it
  TRACK the pointer needs per-move coordinate math, which is JS - that is in the
  React/TS tabs. When the tip is summoned by keyboard focus (no pointer to
  follow) those tabs fall back to exactly this anchored position.
-->
<span class="group relative inline-flex">
  <button type="button" aria-describedby="tt-cursor" class="cursor-default rounded-md border border-dashed border-gray-400 bg-white px-6 py-4 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-500 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Hover across me
  </button>
  <span id="tt-cursor" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Drag me anywhere</span>
</span>`,
      react: `import { useId, useRef, useState } from 'react';

export function CursorTooltip({ label, children }) {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  // coords are relative to the wrapper; null means "not following" (keyboard/touch),
  // so the tip falls back to a fixed anchor above the trigger.
  const [coords, setCoords] = useState(null);
  const id = useId();

  function onMove(e) {
    const rect = wrapRef.current && wrapRef.current.getBoundingClientRect();
    if (!rect) return;
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setOpen(false);
        setCoords(null);
      }}
      onFocus={() => {
        setOpen(true);
        setCoords(null);
      }}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        style={coords ? { left: coords.x, top: coords.y } : undefined}
        className={
          'pointer-events-none absolute z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm dark:bg-gray-100 dark:text-gray-900 ' +
          (coords
            ? '-translate-x-1/2 -translate-y-[calc(100%+0.75rem)] '
            : 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 transition motion-reduce:transition-none ') +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
      typescript: `import { useId, useRef, useState } from 'react';
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react';

interface Point {
  x: number;
  y: number;
}

export interface CursorTooltipProps {
  label: string;
  children: ReactNode;
}

export function CursorTooltip({ label, children }: CursorTooltipProps): JSX.Element {
  const wrapRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  // coords are relative to the wrapper; null means "not following" (keyboard/touch),
  // so the tip falls back to a fixed anchor above the trigger.
  const [coords, setCoords] = useState<Point | null>(null);
  const id = useId();

  function onMove(e: MouseEvent<HTMLSpanElement>): void {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <span
      ref={wrapRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setOpen(false);
        setCoords(null);
      }}
      onFocus={() => {
        setOpen(true);
        setCoords(null);
      }}
      onBlur={() => setOpen(false)}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      }}
    >
      <span aria-describedby={id}>{children}</span>
      <span
        id={id}
        role="tooltip"
        style={coords ? { left: coords.x, top: coords.y } : undefined}
        className={
          'pointer-events-none absolute z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm dark:bg-gray-100 dark:text-gray-900 ' +
          (coords
            ? '-translate-x-1/2 -translate-y-[calc(100%+0.75rem)] '
            : 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 transition motion-reduce:transition-none ') +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-click-pin',
    category: 'tooltips',
    tags: ['tooltip', 'pin', 'click', 'toggle', 'latch'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'label', type: 'string', required: true, descriptionKey: 'label' },
      { name: 'children', type: 'ReactNode', required: true, descriptionKey: 'trigger' },
    ],
    code: {
      tailwind: `<!--
  CSS-only baseline: hover/focus preview only. The "click to pin it open" latch is
  a persistent toggle - state - so it lives in the React/TS tabs. aria-pressed
  there tells a screen reader whether it is pinned; the pin survives the pointer
  leaving, which is the whole point.
-->
<span class="group relative inline-flex">
  <button type="button" aria-describedby="tt-pin" class="cursor-help rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
    Build #4821
  </button>
  <span id="tt-pin" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Passed in 3m 12s on commit a1b2c3d.</span>
</span>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

export function PinTooltip({ label, children }) {
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef(undefined);
  const id = useId();
  const open = hovering || pinned;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setHovering(true);
      return;
    }
    timer.current = window.setTimeout(() => setHovering(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setHovering(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          setPinned(false);
          hide();
        }
      }}
    >
      {/* Click latches the tip open so it survives the pointer leaving. */}
      <button
        type="button"
        aria-describedby={id}
        aria-pressed={pinned}
        onClick={() => setPinned((p) => !p)}
        className="cursor-help rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-pressed:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

export interface PinTooltipProps {
  label: string;
  children: ReactNode;
}

export function PinTooltip({ label, children }: PinTooltipProps): JSX.Element {
  const [hovering, setHovering] = useState(false);
  const [pinned, setPinned] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();
  const open = hovering || pinned;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setHovering(true);
      return;
    }
    timer.current = window.setTimeout(() => setHovering(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setHovering(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setPinned(false);
          hide();
        }
      }}
    >
      {/* Click latches the tip open so it survives the pointer leaving. */}
      <button
        type="button"
        aria-describedby={id}
        aria-pressed={pinned}
        onClick={() => setPinned((p) => !p)}
        className="cursor-help rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white aria-pressed:border-blue-500 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      >
        {children}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-1/2 z-30 w-max max-w-xs -translate-x-1/2 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium leading-snug text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {label}
      </span>
    </span>
  );
}`,
    },
  },
  {
    slug: 'tooltip-status-bar',
    category: 'tooltips',
    tags: ['tooltip', 'status-bar', 'toolbar', 'footer', 'icons'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'items', type: 'StatusItem[]', required: true, descriptionKey: 'items' },
    ],
    code: {
      tailwind: `<!--
  An editor-style status bar: compact items whose meaning lives in a tooltip
  ABOVE each one (the bar sits at the bottom, so tips can only go up). The row
  WRAPS rather than scrolls - an overflow container would clip the tips. Each item
  is CSS-only, focus-reachable and role="tooltip" described.
-->
<div class="flex w-full flex-wrap items-center gap-1 border-t border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-800 dark:bg-gray-900">
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-sb-branch" class="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">main</button>
    <span id="tt-sb-branch" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">Current branch - click to switch</span>
  </span>
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-sb-errors" class="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">0 errors</button>
    <span id="tt-sb-errors" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">No problems detected</span>
  </span>
  <span class="group relative inline-flex">
    <button type="button" aria-describedby="tt-sb-enc" class="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400">UTF-8</button>
    <span id="tt-sb-enc" role="tooltip" class="pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900">File encoding</span>
  </span>
</div>`,
      react: `import { useEffect, useId, useRef, useState } from 'react';

function StatusBarItem({ label, hint }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant) {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <button
        type="button"
        aria-describedby={id}
        className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        {label}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {hint}
      </span>
    </span>
  );
}

export function StatusBar({ items }) {
  // Wrap, do not scroll: an overflow container would clip the upward tooltips.
  return (
    <div className="flex w-full flex-wrap items-center gap-1 border-t border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-800 dark:bg-gray-900">
      {items.map((item) => (
        <StatusBarItem key={item.id} label={item.label} hint={item.hint} />
      ))}
    </div>
  );
}`,
      typescript: `import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface StatusItem {
  id: string;
  label: string;
  hint: string;
}

function StatusBarItem({ label, hint }: Omit<StatusItem, 'id'>): JSX.Element {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const id = useId();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function show(instant: boolean): void {
    window.clearTimeout(timer.current);
    if (instant) {
      setOpen(true);
      return;
    }
    timer.current = window.setTimeout(() => setOpen(true), 150);
  }

  function hide(): void {
    window.clearTimeout(timer.current);
    setOpen(false);
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => show(false)}
      onMouseLeave={hide}
      onFocus={() => show(true)}
      onBlur={hide}
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === 'Escape') hide();
      }}
    >
      <button
        type="button"
        aria-describedby={id}
        className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400"
      >
        {label}
      </button>
      <span
        id={id}
        role="tooltip"
        className={
          'pointer-events-none absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-max rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-50 shadow-sm transition motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 ' +
          (open ? 'visible opacity-100' : 'invisible opacity-0')
        }
      >
        {hint}
      </span>
    </span>
  );
}

export interface StatusBarProps {
  items: StatusItem[];
}

export function StatusBar({ items }: StatusBarProps): JSX.Element {
  // Wrap, do not scroll: an overflow container would clip the upward tooltips.
  return (
    <div className="flex w-full flex-wrap items-center gap-1 border-t border-gray-200 bg-gray-50 px-2 py-1 dark:border-gray-800 dark:bg-gray-900">
      {items.map((item) => (
        <StatusBarItem key={item.id} label={item.label} hint={item.hint} />
      ))}
    </div>
  );
}`,
    },
  },
];
