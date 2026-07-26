'use client';

import type { Branch } from '@adysre/rules-react';
import type { ActionNode } from '@adysre/rules-types';
import { Button, Input, Select, cn } from 'adysre';
import { actionsFor, showsTarget, showsValue } from './actions.ts';
import { useBuilder } from './context.tsx';
import { FieldPicker } from './field-picker.tsx';
import { labelFor } from './labels.ts';
import { OperandEditor } from './operand-editor.tsx';

export interface ActionListProps {
  branch: Branch;
  className?: string;
}

/**
 * What a rule does, on each branch.
 *
 * The engine never performs any of it. An action is an INTENT the host applies,
 * which is why `reject` can be a form error in one app and a queue message in
 * another, and why this editor only ever writes to the AST.
 */
export function ActionList({ branch, className }: ActionListProps): React.JSX.Element {
  const { rule, labels, actions, registry, readOnly } = useBuilder();

  const nodes = (branch === 'then' ? rule.then : rule.otherwise) ?? [];
  const offered = actionsFor(registry.actions.values(), rule.kind);
  const heading = branch === 'then' ? labels.thenActions : labels.otherwiseActions;
  const add = branch === 'then' ? labels.addAction : labels.addOtherwiseAction;

  return (
    <section className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-foreground">{heading}</h3>
        <Button
          className="ml-auto"
          disabled={readOnly}
          size="sm"
          type="button"
          variant="outline"
          onClick={() => actions.addAction(offered[0]?.id ?? '', branch)}
        >
          {add}
        </Button>
      </div>

      {nodes.length === 0 ? (
        <p className="text-xs text-muted-foreground">{labels.noActions}</p>
      ) : (
        <ul className="flex list-none flex-col gap-2 p-0">
          {nodes.map((node) => (
            <ActionRow key={node.id} node={node} />
          ))}
        </ul>
      )}
    </section>
  );
}

function ActionRow({ node }: { node: ActionNode }): React.JSX.Element {
  const { rule, labels, actions, registry, readOnly } = useBuilder();

  const plugin = registry.action(node.type);
  const offered = actionsFor(registry.actions.values(), rule.kind);

  return (
    <li className="flex flex-wrap items-start gap-2 rounded-md border border-border bg-card p-3">
      {/*
       * A select when the host registered actions, a text box when it did not.
       * Nothing ships with the engine, so a builder that insisted on a select
       * would be a builder that cannot write its first action.
       */}
      {offered.length > 0 ? (
        <Select
          aria-label={labels.actionType}
          className="w-52 shrink-0"
          disabled={readOnly}
          value={node.type}
          onChange={(event) => actions.setAction(node.id, { type: event.target.value })}
        >
          {plugin === undefined && <option value={node.type}>{node.type}</option>}
          {offered.map((candidate) => (
            <option key={candidate.id} value={candidate.id}>
              {labelFor(candidate, labels)}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          aria-label={labels.actionType}
          className="w-52 shrink-0"
          disabled={readOnly}
          placeholder={labels.actionType}
          value={node.type}
          onChange={(event) => actions.setAction(node.id, { type: event.target.value })}
        />
      )}

      {showsTarget(plugin, node) && (
        <div className="min-w-48 flex-1">
          <FieldPicker
            aria-label={labels.actionTarget}
            disabled={readOnly}
            path={node.target ?? ''}
            onChange={(target) =>
              actions.setAction(node.id, { target: target === '' ? undefined : target })
            }
          />
        </div>
      )}

      {showsValue(plugin, node) && (
        <OperandEditor
          aria-label={labels.actionValue}
          className="min-w-64 flex-1"
          operand={node.value ?? { source: 'literal', value: null }}
          onChange={(value) => actions.setAction(node.id, { value })}
        />
      )}

      <Button
        aria-label={labels.remove}
        disabled={readOnly}
        size="sm"
        title={labels.remove}
        type="button"
        variant="ghost"
        onClick={() => actions.removeAction(node.id)}
      >
        &times;
      </Button>
    </li>
  );
}
