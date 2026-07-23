'use client';

import { useTranslations } from 'next-intl';
import {
  ClipboardPaste,
  Copy,
  CopyPlus,
  Eye,
  Frame,
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
import { cn } from 'adysre';
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
  /**
   * `at` is the canvas point the action was summoned from, which only paste
   * uses; every other action works on the selection and ignores it.
   */
  run: (at?: { x: number; y: number }) => void;
  /** Shortcut shown beside the label in menus, already platform-formatted. */
  shortcut?: string;
  /** Marks the destructive entry so menus can style it apart. */
  danger?: boolean;
  /**
   * Kept out of the inspector's compact icon row. Paste is the case: it applies
   * with nothing selected, so it belongs to the canvas menu, not to a row that
   * only appears once there IS a selection.
   */
  menuOnly?: boolean;
}

/**
 * The modifier symbol for this platform.
 *
 * Read once from the user agent rather than hardcoded to ⌘: the shortcuts
 * themselves already accept either key (`event.metaKey || event.ctrlKey`), so a
 * menu that only ever says ⌘ would be lying to every Windows and Linux user.
 */
function modifierSymbol(): string {
  if (typeof navigator === 'undefined') return 'Ctrl';
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl';
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
  const frameSelection = useDesignDocumentStore((s) => s.frameSelection);
  const ungroupSelection = useDesignDocumentStore((s) => s.ungroupSelection);
  const copySelection = useDesignDocumentStore((s) => s.copySelection);
  const pasteClipboard = useDesignDocumentStore((s) => s.pasteClipboard);
  // Subscribing to the document (not to canPaste()) is what re-evaluates this
  // after a copy - a selector over a function would never change identity.
  const canPaste = useDesignDocumentStore((s) => s.canPaste)();

  const nodes = selection.map((id) => doc.nodes[id]).filter((node) => node !== undefined);
  // Toggles read the majority state so a mixed selection resolves one way and
  // then moves together, rather than flip-flopping per node.
  const allLocked = nodes.length > 0 && nodes.every((node) => node.locked);
  const allHidden = nodes.length > 0 && nodes.every((node) => node.hidden);

  const mod = modifierSymbol();

  // Group needs two siblings to mean anything; a frame around ONE node is a
  // real request, so it is offered from a single selection. Ungroup appears only
  // when the selection holds something to dissolve, so no entry is ever dead.
  const canGroup = nodes.length > 1;
  const canFrame = nodes.length > 0;
  const canUngroup = nodes.some((node) => node.type === 'group' || node.type === 'frame');

  return [
    ...(nodes.length > 0
      ? [{ id: 'copy', icon: Copy, run: copySelection, shortcut: `${mod}C`, menuOnly: true }]
      : []),
    ...(canPaste
      ? [
          {
            id: 'paste',
            icon: ClipboardPaste,
            run: (at?: { x: number; y: number }) => pasteClipboard(at),
            shortcut: `${mod}V`,
            menuOnly: true,
          },
        ]
      : []),
    ...(nodes.length > 0
      ? [{ id: 'duplicate', icon: CopyPlus, run: duplicateSelection, shortcut: `${mod}D` }]
      : []),
    ...(canGroup
      ? [{ id: 'group', icon: Group, run: groupSelection, shortcut: `${mod}G` }]
      : []),
    ...(canFrame
      ? [{ id: 'frame', icon: Frame, run: frameSelection, shortcut: `⌥${mod}G` }]
      : []),
    ...(canUngroup
      ? [{ id: 'ungroup', icon: Ungroup, run: ungroupSelection, shortcut: `⇧${mod}G` }]
      : []),
    ...(nodes.length === 0
      ? []
      : [
          { id: 'bringToFront', icon: MoveUp, run: () => reorderSelection('front'), shortcut: ']' },
          { id: 'sendToBack', icon: MoveDown, run: () => reorderSelection('back'), shortcut: '[' },
          {
            id: allLocked ? 'unlock' : 'lock',
            icon: allLocked ? LockOpen : Lock,
            run: () => patchSelection({ locked: !allLocked }),
            shortcut: `⇧${mod}L`,
          },
          {
            id: allHidden ? 'show' : 'hide',
            icon: allHidden ? Eye : EyeOff,
            run: () => patchSelection({ hidden: !allHidden }),
            shortcut: `⇧${mod}H`,
          },
          { id: 'delete', icon: Trash2, run: deleteSelection, shortcut: '⌫', danger: true },
        ]),
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
      className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5"
    >
      {actions
        .filter((action) => !action.menuOnly)
        .map(({ id, icon: Icon, run, shortcut, danger }) => (
          <button
            key={id}
            type="button"
            // Wrapped: `run` takes an optional point, and passing it the click
            // event would look like one.
            onClick={() => run()}
            title={shortcut ? `${t(`actions.${id}`)} (${shortcut})` : t(`actions.${id}`)}
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
