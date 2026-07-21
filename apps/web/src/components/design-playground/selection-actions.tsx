'use client';

import { useTranslations } from 'next-intl';
import {
  Copy,
  Eye,
  Group,
  EyeOff,
  Lock,
  LockOpen,
  MoveDown,
  MoveUp,
  Ungroup,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@adysre/ui';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * The actions that apply to whatever is selected.
 *
 * Every one of these had a keyboard shortcut and no button, which made delete
 * effectively invisible: a user who never guesses ⌫ concludes the editor cannot
 * delete at all. The shortcuts still work - this is the discoverable half.
 *
 * Rendered as a row in the inspector and as the canvas/layer context menu, so
 * the two can never drift.
 */
export interface SelectionAction {
  id: string;
  icon: LucideIcon;
  run: () => void;
  /** Marks the destructive entry so menus can style it apart. */
  danger?: boolean;
}

/** Build the action list for the current selection. */
export function useSelectionActions(): SelectionAction[] {
  const doc = useDesignDocumentStore((s) => s.document);
  const selection = useDesignDocumentStore((s) => s.selection);
  const deleteSelection = useDesignDocumentStore((s) => s.deleteSelection);
  const duplicateSelection = useDesignDocumentStore((s) => s.duplicateSelection);
  const reorderSelection = useDesignDocumentStore((s) => s.reorderSelection);
  const patchSelection = useDesignDocumentStore((s) => s.patchSelection);
  const groupSelection = useDesignDocumentStore((s) => s.groupSelection);
  const ungroupSelection = useDesignDocumentStore((s) => s.ungroupSelection);

  const nodes = selection.map((id) => doc.nodes[id]).filter((node) => node !== undefined);
  // Toggles read the majority state so a mixed selection resolves one way and
  // then moves together, rather than flip-flopping per node.
  const allLocked = nodes.length > 0 && nodes.every((node) => node.locked);
  const allHidden = nodes.length > 0 && nodes.every((node) => node.hidden);

  // Group is offered when there is something to wrap; ungroup only when the
  // selection actually contains a group, so the row never lists a dead action.
  const canGroup = nodes.length > 1;
  const canUngroup = nodes.some((node) => node.type === 'group');

  return [
    { id: 'duplicate', icon: Copy, run: duplicateSelection },
    ...(canGroup ? [{ id: 'group', icon: Group, run: groupSelection }] : []),
    ...(canUngroup ? [{ id: 'ungroup', icon: Ungroup, run: ungroupSelection }] : []),
    { id: 'bringToFront', icon: MoveUp, run: () => reorderSelection('front') },
    { id: 'sendToBack', icon: MoveDown, run: () => reorderSelection('back') },
    {
      id: allLocked ? 'unlock' : 'lock',
      icon: allLocked ? LockOpen : Lock,
      run: () => patchSelection({ locked: !allLocked }),
    },
    {
      id: allHidden ? 'show' : 'hide',
      icon: allHidden ? Eye : EyeOff,
      run: () => patchSelection({ hidden: !allHidden }),
    },
    { id: 'delete', icon: Trash2, run: deleteSelection, danger: true },
  ];
}

/** Compact icon row for the inspector header. */
export function SelectionActions() {
  const t = useTranslations('designPlayground');
  const actions = useSelectionActions();
  const selection = useDesignDocumentStore((s) => s.selection);

  if (selection.length === 0) return null;

  return (
    <div
      role="toolbar"
      aria-label={t('actions.selectionLabel')}
      className="flex items-center gap-0.5 border-b border-border px-2 py-1.5"
    >
      {actions.map(({ id, icon: Icon, run, danger }) => (
        <button
          key={id}
          type="button"
          onClick={run}
          title={t(`actions.${id}`)}
          className={cn(
            'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            danger
              ? 'text-muted-foreground hover:bg-danger/10 hover:text-danger'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="sr-only">{t(`actions.${id}`)}</span>
        </button>
      ))}
    </div>
  );
}
