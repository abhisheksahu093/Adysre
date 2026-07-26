'use client';

import { Badge, Button, cn } from 'adysre';
import { useBuilder } from './context.tsx';

export interface RuleToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  onSave?: (() => void) | undefined;
  className?: string;
}

/**
 * Undo, redo, and whether anything is unsaved.
 *
 * `isDirty` is measured by `logicHash`, so renaming a rule does not raise the
 * warning. That is deliberate upstream and worth knowing here: a builder that
 * says "unsaved changes" for a touched-then-untouched field trains people to
 * ignore the one time it matters.
 */
export function RuleToolbar({
  canUndo,
  canRedo,
  isDirty,
  onSave,
  className,
}: RuleToolbarProps): React.JSX.Element {
  const { actions, labels, readOnly } = useBuilder();

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={actions.undo}
        disabled={readOnly || !canUndo}
      >
        {labels.undo}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={actions.redo}
        disabled={readOnly || !canRedo}
      >
        {labels.redo}
      </Button>

      {/* Announced rather than merely coloured: "unsaved" is the one piece of
          state in the builder somebody can lose work by not noticing. */}
      <Badge variant={isDirty ? 'warning' : 'default'} aria-live="polite">
        {isDirty ? labels.unsavedChanges : labels.saved}
      </Badge>

      {onSave !== undefined && (
        <Button
          type="button"
          size="sm"
          className="ml-auto"
          onClick={onSave}
          disabled={readOnly || !isDirty}
        >
          {labels.save}
        </Button>
      )}
    </div>
  );
}
