'use client';

import { cn } from 'adysre';
import { hasFindings, type RunComparison } from './compare.ts';
import { englishDebuggerLabels, type DebuggerLabels } from './labels.ts';

export interface FindingsProps {
  comparison: RunComparison;
  labels?: DebuggerLabels;
  className?: string;
}

/**
 * What the exhaustive run found that the real one could not.
 *
 * Deliberately loud, and deliberately silent when there is nothing. A hidden
 * error is the one finding here that changes what somebody has to do today:
 * the rule is answering correctly by luck, and the luck runs out the moment a
 * group is reordered. Everything else is information.
 */
export function Findings({
  comparison,
  labels = englishDebuggerLabels,
  className,
}: FindingsProps): React.JSX.Element {
  if (!hasFindings(comparison)) {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>
        {comparison.skipped.length === 0
          ? labels.nothingHidden
          : `${String(comparison.skipped.length)} ${labels.skippedCount}`}
      </p>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {comparison.hiddenErrors.length > 0 && (
        <div className="rounded-md border border-danger/40 bg-danger/5 p-3" role="alert">
          <p className="text-sm font-medium text-danger">{labels.hiddenErrorsTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">{labels.hiddenErrorsBody}</p>
          <ul className="mt-2 flex list-none flex-col gap-1 p-0">
            {comparison.hiddenErrors.map((entry) => (
              <li key={entry.nodeId} className="font-mono text-xs text-danger">
                {entry.nodeId}
                {entry.error === undefined ? '' : `: ${entry.error}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!comparison.agreed && (
        <div className="rounded-md border border-warning/40 bg-warning/5 p-3">
          <p className="text-sm font-medium text-warning">{labels.disagreedTitle}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {labels.disagreedBody} {labels.verdicts[comparison.fastVerdict]} /{' '}
            {labels.verdicts[comparison.fullVerdict]}
          </p>
        </div>
      )}
    </div>
  );
}
