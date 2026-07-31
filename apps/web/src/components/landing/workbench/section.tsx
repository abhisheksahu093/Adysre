import type { ReactNode } from 'react';
import { cn } from 'adysre';

/**
 * The heading every home-page section shares.
 *
 * Left-aligned, never centred: the page is a work surface read from the top
 * left, and a centred stack is the shape this redesign exists to get away from.
 * The eyebrow is instrument type, the title is the display face, and the
 * description sits in a column beside the title on wide screens rather than
 * underneath it, so the eye reaches the panel below sooner.
 *
 * Text arrives already translated from the caller (Rule 6).
 */
export function WorkbenchSection({
  id,
  label,
  title,
  description,
  actions,
  children,
  className,
}: {
  id?: string;
  /** Instrument label, e.g. the module this section is about. */
  label?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Links or buttons that belong to the section as a whole. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        // Rendering work for a section is deferred until it is near the
        // viewport; see `.section-deferred`. Every section on the page is one
        // of these, so this is the one place it needs saying.
        'section-deferred mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-20',
        className,
      )}
    >
      <div className="grid gap-x-10 gap-y-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
        <div>
          {label && (
            <p className="font-hud text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground">
              {label}
            </p>
          )}
          <h2 className="mt-2.5 text-balance text-[26px] font-semibold leading-[1.06] tracking-[-0.03em] sm:text-[34px]">
            {title}
          </h2>
        </div>

        {(description || actions) && (
          <div className="lg:pb-1">
            {description && (
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
            {actions && <div className="mt-4 flex flex-wrap items-center gap-2.5">{actions}</div>}
          </div>
        )}
      </div>

      <div className="mt-8 sm:mt-10">{children}</div>
    </section>
  );
}
