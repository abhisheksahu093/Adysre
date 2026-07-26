'use client';

import { Badge, cn } from 'adysre';
import { previewDuration, previewOperands } from './format.ts';
import { englishDebuggerLabels, type DebuggerLabels } from './labels.ts';
import { NOT_RUN, flatten, type NodeState, type TraceNode } from './tree.ts';

export interface TraceViewProps {
  tree: TraceNode;
  labels?: DebuggerLabels;
  /** The row that decided the verdict, highlighted. */
  decidedId?: string | undefined;
  onSelectNode?: ((nodeId: string) => void) | undefined;
  className?: string;
}

/** Which badge a state gets. Errors and never-ran must not look like a pass. */
function toneFor(state: NodeState): 'success' | 'warning' | 'outline' | 'default' {
  if (state === 'matched') return 'success';
  if (state === 'errored') return 'warning';
  if (state === NOT_RUN) return 'outline';
  return 'default';
}

/**
 * The trace, as a tree somebody can read.
 *
 * Rendered from a FLAT list rather than by recursing components. `flatten`
 * returns parents before children with a depth on each, which is exactly a
 * indented list, and it means the view has no recursion of its own to overflow
 * and no chance of a hook being called inside a branch.
 *
 * A row that never ran is drawn, greyed, and says so. Leaving it out would make
 * a skipped branch indistinguishable from a passing one, which is the failure
 * the trace was designed to prevent in the first place.
 */
export function TraceView({
  tree,
  labels = englishDebuggerLabels,
  decidedId,
  onSelectNode,
  className,
}: TraceViewProps): React.JSX.Element {
  const rows = flatten(tree);

  return (
    <ul className={cn('flex list-none flex-col gap-1 p-0', className)}>
      {rows.map((row) => (
        <TraceRow
          key={row.node.id}
          decided={row.node.id === decidedId}
          labels={labels}
          row={row}
          onSelect={onSelectNode}
        />
      ))}
    </ul>
  );
}

function TraceRow({
  row,
  labels,
  decided,
  onSelect,
}: {
  row: TraceNode;
  labels: DebuggerLabels;
  decided: boolean;
  onSelect: ((nodeId: string) => void) | undefined;
}): React.JSX.Element {
  const { node, event, state } = row;
  const received = previewOperands(event?.left, event?.args);

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={toneFor(state)}>{labels.states[state]}</Badge>

        {node.kind === 'group' ? (
          <span className="text-sm text-muted-foreground">
            {labels.combinators[node.combinator]}
          </span>
        ) : (
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">{node.operator}</code>
        )}

        {node.negate === true && <span className="text-xs text-warning">{labels.negated}</span>}

        {event !== undefined && (
          <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground">
            {previewDuration(event.ms)}
          </span>
        )}
      </div>

      {/* What the operator was handed, which is the question a trace answers
          that a verdict cannot. */}
      {received !== '' && (
        <p className="font-mono text-xs text-muted-foreground">
          {labels.received}: {received}
        </p>
      )}

      {event?.error !== undefined && (
        <p className="text-xs text-danger" role="alert">
          {event.error}
        </p>
      )}

      {node.comment !== undefined && (
        <p className="text-xs italic text-muted-foreground">{node.comment}</p>
      )}
    </>
  );

  const className = cn(
    'flex flex-col gap-1 rounded-md border p-2 text-left',
    decided ? 'border-primary bg-primary/5' : 'border-border',
    state === NOT_RUN && 'opacity-60',
  );

  return (
    <li style={{ marginLeft: `${String(row.depth * 1.25)}rem` }}>
      {onSelect === undefined ? (
        <div className={className}>{content}</div>
      ) : (
        <button className={cn(className, 'w-full')} type="button" onClick={() => onSelect(node.id)}>
          {content}
        </button>
      )}
    </li>
  );
}
