'use client';

import { RULE_KINDS, RULE_STATUSES, type RuleKind, type RuleStatus } from '@adysre/rules-types';
import { Input, Label, Select, Textarea, cn } from 'adysre';
import { useId } from 'react';
import { useBuilder } from './context.tsx';

export interface MetaEditorProps {
  className?: string;
}

/**
 * The rule's own fields: what it is called, what it is for, when it runs.
 *
 * Every edit here goes through `setMeta`, which merges per field, so typing a
 * name is one undo step and changing the kind afterwards is another. Renaming
 * is also the one edit that does NOT make the rule dirty, because dirtiness is
 * measured by `logicHash`.
 */
export function MetaEditor({ className }: MetaEditorProps): React.JSX.Element {
  const { rule, labels, actions, readOnly } = useBuilder();
  const id = useId();

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor={`${id}-name`}>{labels.name}</Label>
        <Input
          disabled={readOnly}
          id={`${id}-name`}
          placeholder={labels.namePlaceholder}
          value={rule.name}
          onChange={(event) => actions.setMeta({ name: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor={`${id}-description`}>{labels.description}</Label>
        <Textarea
          disabled={readOnly}
          id={`${id}-description`}
          placeholder={labels.descriptionPlaceholder}
          rows={2}
          value={rule.description}
          onChange={(event) => actions.setMeta({ description: event.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-kind`}>{labels.kind}</Label>
        <Select
          disabled={readOnly}
          id={`${id}-kind`}
          value={rule.kind}
          onChange={(event) => actions.setMeta({ kind: event.target.value as RuleKind })}
        >
          {RULE_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {labels.kinds[kind]}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-status`}>{labels.status}</Label>
        <Select
          disabled={readOnly}
          id={`${id}-status`}
          value={rule.status}
          onChange={(event) => actions.setMeta({ status: event.target.value as RuleStatus })}
        >
          {RULE_STATUSES.map((status) => (
            <option key={status} value={status}>
              {labels.statuses[status]}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-priority`}>{labels.priority}</Label>
        {/* Lower runs first, which is the opposite of what several other engines
            do; the importers already negate it on the way in. */}
        <Input
          disabled={readOnly}
          id={`${id}-priority`}
          type="number"
          value={String(rule.priority)}
          onChange={(event) => {
            const parsed = Number(event.target.value);
            actions.setMeta({ priority: Number.isFinite(parsed) ? parsed : 0 });
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-tags`}>{labels.tags}</Label>
        <Input
          disabled={readOnly}
          id={`${id}-tags`}
          placeholder={labels.tagsPlaceholder}
          value={rule.tags.join(', ')}
          onChange={(event) =>
            actions.setMeta({
              tags: event.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag !== ''),
            })
          }
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
        <input
          checked={rule.enabled}
          className="h-4 w-4 rounded border-input accent-primary"
          disabled={readOnly}
          type="checkbox"
          onChange={(event) => actions.setMeta({ enabled: event.target.checked })}
        />
        {labels.enabled}
      </label>
    </div>
  );
}
