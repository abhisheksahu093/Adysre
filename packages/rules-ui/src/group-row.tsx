'use client';

import { COMBINATORS, type Combinator, type GroupNode } from '@adysre/rules-types';
import { Button, Select, cn } from 'adysre';
import { ConditionRow } from './condition-row.tsx';
import { useBuilder, useNodeDiagnostics } from './context.tsx';
import { DiagnosticList } from './diagnostics.tsx';
import { RowActions } from './row-actions.tsx';

export interface GroupRowProps {
  node: GroupNode;
  /** The root is the rule's `when`: it cannot be removed or reordered. */
  isRoot?: boolean;
  parentId?: string;
  index?: number;
  siblingCount?: number;
  depth?: number;
}

/**
 * A branch of the condition tree.
 *
 * Recurses into itself for nested groups, which is the whole of the tree's
 * shape: `when` is always a group, so this component draws the root and every
 * branch below it with no special case for either.
 */
export function GroupRow({
  node,
  isRoot = false,
  parentId,
  index = 0,
  siblingCount = 1,
  depth = 0,
}: GroupRowProps): React.JSX.Element {
  const { actions, labels, selectedId, readOnly } = useBuilder();
  const diagnostics = useNodeDiagnostics(node.id);
  const selected = selectedId === node.id;

  return (
    <div
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex flex-col gap-3 rounded-lg border border-border p-3',
        isRoot ? 'bg-background' : 'bg-muted/30',
        selected && 'ring-2 ring-ring',
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Select
          aria-label={labels.conditions}
          className="w-56 shrink-0"
          disabled={readOnly}
          value={node.combinator}
          onChange={(event) => actions.setCombinator(node.id, event.target.value as Combinator)}
        >
          {COMBINATORS.map((combinator) => (
            <option key={combinator} value={combinator}>
              {labels.combinators[combinator]}
            </option>
          ))}
        </Select>

        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            checked={node.negate === true}
            className="h-4 w-4 rounded border-input accent-primary"
            disabled={readOnly}
            type="checkbox"
            onChange={(event) => actions.setNegate(node.id, event.target.checked)}
          />
          {labels.negate}
        </label>

        <div className="ml-auto flex items-center gap-1">
          <Button
            disabled={readOnly}
            size="sm"
            type="button"
            variant="outline"
            onClick={() => actions.addCondition(node.id)}
          >
            {labels.addCondition}
          </Button>
          <Button
            disabled={readOnly}
            size="sm"
            type="button"
            variant="outline"
            onClick={() => actions.addGroup(node.id)}
          >
            {labels.addGroup}
          </Button>

          {!isRoot && parentId !== undefined && (
            <RowActions
              id={node.id}
              index={index}
              parentId={parentId}
              siblingCount={siblingCount}
            />
          )}
        </div>
      </div>

      <DiagnosticList diagnostics={diagnostics} />

      {node.children.length === 0 ? (
        /*
         * An empty group MATCHES, for all three combinators, and saying so here
         * matters more than it looks: every rule starts as one, and an author
         * who is told nothing assumes the opposite.
         */
        <p className="text-xs text-muted-foreground">{labels.emptyGroup}</p>
      ) : (
        <ul className="flex list-none flex-col gap-2 p-0">
          {node.children.map((child, position) =>
            child.kind === 'condition' ? (
              <ConditionRow
                key={child.id}
                index={position}
                node={child}
                parentId={node.id}
                siblingCount={node.children.length}
              />
            ) : (
              <li key={child.id}>
                <GroupRow
                  depth={depth + 1}
                  index={position}
                  node={child}
                  parentId={node.id}
                  siblingCount={node.children.length}
                />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}
