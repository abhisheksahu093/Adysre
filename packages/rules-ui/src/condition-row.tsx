'use client';

import type { ConditionNode } from '@adysre/rules-types';
import { Button, Input, Select, cn } from 'adysre';
import { useBuilder, useNodeDiagnostics } from './context.tsx';
import { DiagnosticList } from './diagnostics.tsx';
import { labelFor } from './labels.ts';
import { OperandEditor } from './operand-editor.tsx';
import { argSlots, canAddValue, operatorsFor } from './operators.ts';
import { typeOfOperand } from './operands.ts';
import { RowActions } from './row-actions.tsx';

export interface ConditionRowProps {
  node: ConditionNode;
  parentId: string;
  index: number;
  siblingCount: number;
}

/**
 * One comparison.
 *
 * Left operand, operator, and however many values the operator wants. The
 * number of value boxes comes from the operator plugin rather than from a table
 * here, and the operators offered come from the type of whatever is on the
 * left, so registering `withinBusinessHours` puts it in the right rows without
 * this file hearing about it.
 */
export function ConditionRow({
  node,
  parentId,
  index,
  siblingCount,
}: ConditionRowProps): React.JSX.Element {
  const { actions, labels, registry, lookup, selectedId, readOnly } = useBuilder();
  const diagnostics = useNodeDiagnostics(node.id);

  const operator = registry.operator(node.operator);
  const leftType = typeOfOperand(node.left, lookup);
  const offered = operatorsFor(registry.operators.values(), leftType);
  const slots = argSlots(operator, node.args);
  const selected = selectedId === node.id;

  // The values on the right are compared against the left, so that is the type
  // their boxes draw and the option list they offer.
  const leftField = node.left.source === 'field' ? lookup.field(node.left.path) : undefined;

  return (
    <li
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'flex flex-col gap-2 rounded-md border border-border bg-card p-3',
        selected && 'ring-2 ring-ring',
        node.negate === true && 'border-warning/60',
      )}
      onFocusCapture={() => actions.select(node.id)}
    >
      <div className="flex flex-wrap items-start gap-2">
        <OperandEditor
          aria-label={labels.chooseField}
          className="min-w-64 flex-1"
          operand={node.left}
          onChange={(operand) => actions.setOperand(node.id, 'left', operand)}
        />

        <Select
          aria-label={labels.operator}
          className="w-52 shrink-0"
          disabled={readOnly}
          value={node.operator}
          onChange={(event) => actions.setOperator(node.id, event.target.value)}
        >
          {/*
           * An operator this deployment does not have still shows, as itself.
           * Dropping it would silently rewrite the rule to whichever operator
           * happened to be first in the list.
           */}
          {operator === undefined && <option value={node.operator}>{node.operator}</option>}
          {offered.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {labelFor(candidate, labels)}
            </option>
          ))}
        </Select>

        <div className="flex min-w-64 flex-1 flex-col gap-2">
          {Array.from({ length: slots }, (_, slot) => (
            <OperandEditor
              key={slot}
              aria-label={`${labels.value} ${String(slot + 1)}`}
              operand={node.args[slot] ?? { source: 'literal', value: null }}
              expectedType={leftType === 'any' ? undefined : leftType}
              options={leftField?.options}
              onChange={(operand) => actions.setOperand(node.id, slot, operand)}
            />
          ))}

          {canAddValue(operator) && (
            <Button
              className="self-start"
              disabled={readOnly}
              size="sm"
              type="button"
              variant="ghost"
              onClick={() => actions.setArgCount(node.id, node.args.length + 1)}
            >
              {labels.addValue}
            </Button>
          )}
        </div>

        <RowActions id={node.id} index={index} parentId={parentId} siblingCount={siblingCount} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
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

        <Input
          aria-label={labels.comment}
          className="h-8 flex-1 text-xs"
          disabled={readOnly}
          placeholder={labels.commentPlaceholder}
          value={node.comment ?? ''}
          onChange={(event) => actions.setComment(node.id, event.target.value)}
        />
      </div>

      {operator === undefined && (
        <p className="text-xs text-danger" role="alert">
          {labels.unknownOperator}
        </p>
      )}

      <DiagnosticList diagnostics={diagnostics} />
    </li>
  );
}
