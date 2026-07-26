'use client';

import type { Diagnostic } from '@adysre/rules-types';
import { cn } from 'adysre';

export interface DiagnosticListProps {
  diagnostics: readonly Diagnostic[];
  className?: string;
}

/**
 * What is wrong with a row, on the row.
 *
 * `validateRule` reports an AST path, and `@adysre/rules-react` resolves each
 * one back to the node it belongs to, precisely so this can be rendered here
 * rather than as a list at the top of the screen. A form that says
 * `$.when.children[1].args[0]` has told the author nothing they can act on.
 */
export function DiagnosticList({
  diagnostics,
  className,
}: DiagnosticListProps): React.JSX.Element | null {
  if (diagnostics.length === 0) return null;

  return (
    <ul className={cn('flex flex-col gap-1', className)}>
      {diagnostics.map((diagnostic, index) => (
        <li
          key={`${diagnostic.code}:${String(index)}`}
          className={cn(
            'text-xs',
            diagnostic.severity === 'error' && 'text-danger',
            diagnostic.severity === 'warning' && 'text-warning',
            diagnostic.severity === 'info' && 'text-muted-foreground',
          )}
          // Errors are announced; warnings and notes are not, because a builder
          // that interrupts a screen reader on every keystroke of a half-typed
          // field path is one people turn off.
          role={diagnostic.severity === 'error' ? 'alert' : undefined}
        >
          {diagnostic.message}
        </li>
      ))}
    </ul>
  );
}
