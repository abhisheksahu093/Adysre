'use client';

import { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';

/**
 * Live preview for `tooltip-delay-group`. Mirrors the `typescript` variant.
 * Hover the first icon - it waits ~600ms; then sweep to its neighbours and they
 * open instantly while the group stays "warm". Keep in step with
 * `src/data/components/tooltips.ts`.
 */
interface GroupState {
  warm: boolean;
  arm: () => void;
  disarm: () => void;
  delay: number;
}

const GroupContext = createContext<GroupState | null>(null);

interface TooltipGroupProps {
  delay?: number;
  skipDelay?: number;
  children: ReactNode;
}

function TooltipGroup({ delay = 600, skipDelay = 300, children }: TooltipGroupProps) {
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

  return <GroupContext.Provider value={{ warm, arm, disarm, delay }}>{children}</GroupContext.Provider>;
}

interface TooltipProps {
  label: string;
  children: ReactNode;
}

function Tooltip({ label, children }: TooltipProps) {
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
}

const ICON =
  'flex h-9 w-9 items-center justify-center rounded-md text-sm text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-200 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400';

export default function TooltipDelayGroupPreview() {
  return (
    <div className="flex w-full items-center justify-center px-4 pb-4 pt-24">
      <TooltipGroup>
        <div className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-800 dark:bg-gray-900">
          <Tooltip label="Bold">
            <button type="button" className={ICON + ' font-bold'}>
              B
            </button>
          </Tooltip>
          <Tooltip label="Italic">
            <button type="button" className={ICON + ' italic'}>
              I
            </button>
          </Tooltip>
          <Tooltip label="Underline">
            <button type="button" className={ICON + ' underline'}>
              U
            </button>
          </Tooltip>
        </div>
      </TooltipGroup>
    </div>
  );
}

export const minHeight = 200;
