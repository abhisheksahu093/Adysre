import * as React from 'react';
import { ChevronDown } from '../icons/generated/chevron-down.tsx';
import { cn } from '../lib/cn.ts';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

/**
 * Native select in ADYSRE styling. Native rather than a custom listbox on
 * purpose: it inherits keyboard behaviour, screen-reader semantics and the
 * platform picker on mobile for free.
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'h-9 w-full appearance-none rounded-md border border-input bg-background pl-3 pr-8 text-sm',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  ),
);
Select.displayName = 'Select';
