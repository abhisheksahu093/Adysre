'use client';

import { cn } from 'adysre';

/**
 * The small tab strip inside a pane (params/headers/body/auth, body/headers/
 * cookies/timings).
 *
 * Real tab semantics rather than styled buttons: `role="tablist"` with arrow-key
 * navigation, so the whole request builder is reachable without a mouse and a
 * screen reader announces "tab 2 of 4" instead of a row of anonymous buttons.
 */
export interface PaneTab<T extends string> {
  id: T;
  label: string;
  /** Small count shown after the label, e.g. the number of active headers. */
  count?: number;
}

export function PaneTabs<T extends string>({
  tabs,
  active,
  onSelect,
  label,
  className,
}: {
  tabs: readonly PaneTab<T>[];
  active: T;
  onSelect: (id: T) => void;
  /** Accessible name for the tablist. */
  label: string;
  className?: string;
}) {
  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    const index = tabs.findIndex((tab) => tab.id === active);
    if (index === -1) return;

    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (step === 0) return;

    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    if (next) onSelect(next.id);
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex items-center gap-1 overflow-x-auto', className)}
    >
      {tabs.map((tab) => {
        const selected = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-px text-[10px] tabular-nums text-muted-foreground">
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** The panel a {@link PaneTabs} tab controls. */
export function PanePanel({
  id,
  active,
  children,
  className,
}: {
  id: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  if (!active) return null;
  return (
    <div
      role="tabpanel"
      id={`panel-${id}`}
      aria-labelledby={`tab-${id}`}
      tabIndex={0}
      className={cn('focus-visible:outline-none', className)}
    >
      {children}
    </div>
  );
}
