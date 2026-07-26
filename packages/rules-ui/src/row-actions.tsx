'use client';

import { Button } from 'adysre';
import { useBuilder } from './context.tsx';

export interface RowActionsProps {
  id: string;
  parentId: string;
  index: number;
  siblingCount: number;
}

/**
 * Reorder, duplicate, remove.
 *
 * Buttons rather than drag and drop, and that is a decision rather than a
 * shortcut. A rule tree is reordered from the keyboard as often as with a
 * mouse, and dragging without an equivalent keyboard path is a builder that
 * fails WCAG on its most-used interaction. Buttons are also the version a test
 * can drive.
 *
 * `move`'s index is the position in the RESULTING list, so moving down by one
 * is `index + 1`: the node is removed before it is inserted, and the gap it
 * leaves is already accounted for.
 */
export function RowActions({
  id,
  parentId,
  index,
  siblingCount,
}: RowActionsProps): React.JSX.Element {
  const { actions, labels, readOnly } = useBuilder();

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Button
        aria-label={labels.moveUp}
        disabled={readOnly || index === 0}
        size="sm"
        title={labels.moveUp}
        type="button"
        variant="ghost"
        onClick={() => actions.move(id, parentId, index - 1)}
      >
        &uarr;
      </Button>
      <Button
        aria-label={labels.moveDown}
        disabled={readOnly || index >= siblingCount - 1}
        size="sm"
        title={labels.moveDown}
        type="button"
        variant="ghost"
        onClick={() => actions.move(id, parentId, index + 1)}
      >
        &darr;
      </Button>
      <Button
        aria-label={labels.duplicate}
        disabled={readOnly}
        size="sm"
        title={labels.duplicate}
        type="button"
        variant="ghost"
        onClick={() => actions.duplicate(id)}
      >
        &#10697;
      </Button>
      <Button
        aria-label={labels.remove}
        disabled={readOnly}
        size="sm"
        title={labels.remove}
        type="button"
        variant="ghost"
        onClick={() => actions.remove(id)}
      >
        &times;
      </Button>
    </div>
  );
}
