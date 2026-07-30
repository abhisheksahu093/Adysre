import type { ReactNode } from 'react';
import { cn } from 'adysre';

/**
 * A panel docked on the canvas.
 *
 * Every block of content on the home page is one of these: a titled surface
 * with a hairline border, floating over the dot grid. It replaces the rounded
 * marketing card, and it is the only container the page uses, so twelve very
 * different sections still read as one work surface (Rule 3 - never duplicate).
 *
 * The header carries a name on the left and whatever instrumentation the panel
 * has on the right: a count, a status, a real control. Anything that goes in
 * `actions` must do something; a decorative tab strip would be a label that
 * lies about being a control.
 */
export function Panel({
  title,
  actions,
  children,
  className,
  bodyClassName,
  flush,
}: {
  /** Panel name, shown in the title bar. */
  title: ReactNode;
  /** Real controls or instrumentation, right-aligned in the title bar. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Drop the body padding, for panels whose content owns its own edges. */
  flush?: boolean;
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line bg-panel',
        // The lift is a shadow, not a glow: a panel sits on the canvas, it does
        // not emit light.
        'shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-24px_rgb(0_0_0/0.5)]',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-panel-raised px-4 py-2.5">
        <span className="text-[13px] font-semibold tracking-tight">{title}</span>
        {actions && <span className="ml-auto flex flex-wrap items-center gap-2">{actions}</span>}
      </div>
      <div className={cn(!flush && 'p-4 sm:p-5', bodyClassName)}>{children}</div>
    </div>
  );
}

/**
 * Instrument text: measurements, coordinates, counts, statuses, file names.
 *
 * Mono and uppercase because it is read as data rather than prose. Used across
 * every panel so a number always looks like a number.
 */
export function Hud({
  children,
  className,
  strong,
}: {
  children: ReactNode;
  className?: string;
  /** Promote to foreground, for the value in a label/value pair. */
  strong?: boolean;
}) {
  return (
    <span
      className={cn(
        'font-hud text-[10.5px] uppercase tracking-[0.08em]',
        strong ? 'font-medium text-foreground' : 'text-muted-foreground',
        className,
      )}
    >
      {children}
    </span>
  );
}
