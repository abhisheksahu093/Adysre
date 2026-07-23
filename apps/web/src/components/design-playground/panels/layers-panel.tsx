'use client';

import { useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Circle,
  Eye,
  EyeOff,
  Frame,
  Group,
  Image as ImageIcon,
  Lock,
  LockOpen,
  Trash2,
  Square,
  Type,
  type LucideIcon,
} from 'lucide-react';
import { cn } from 'adysre';
import { topLevelNodes } from '@/lib/design-playground/document';
import type { Document, Node, NodeType } from '@/lib/design-playground/types';
import { useDesignDocumentStore } from '@/stores/design-document-store';

/**
 * The layers panel: the current page's node tree.
 *
 * Rows are FLAT in the DOM with `aria-level`/`aria-posinset`/`aria-setsize`
 * rather than nested `role="group"` elements. A flat list is what the keyboard
 * model wants (up/down walk visible rows in order) and it mirrors the flat
 * document model, so a row maps to exactly one node with no intermediate markup.
 *
 * Paint order is reversed on the way in: the document stores children
 * bottom-first (last child paints on top), while every design tool shows the
 * topmost layer at the top of the list.
 *
 * Collapse state is local: it is a per-view preference, not part of the document,
 * so it must never make the document dirty or land in an undo step.
 */

/** Which icon stands for a node type. Type is structural, so this is not config. */
const NODE_ICONS: Record<NodeType, LucideIcon> = {
  frame: Frame,
  group: Group,
  rectangle: Square,
  ellipse: Circle,
  text: Type,
  image: ImageIcon,
};

/** One visible row: a node plus the tree position ARIA needs. */
interface LayerRow {
  node: Node;
  level: number;
  posInSet: number;
  setSize: number;
  hasChildren: boolean;
  expanded: boolean;
  /** True when the node itself or any ancestor is hidden - a child of a hidden
   * frame is invisible on canvas even with its own `hidden` false. */
  inheritedHidden: boolean;
  /**
   * Whether this row can move towards the viewer / away from it. The panel
   * lists topmost-first, so "up" in the list means LATER in the document's
   * children array - the two orders are inverted, and the flags are computed
   * here so the row does not have to reason about it.
   */
  canMoveUp: boolean;
  canMoveDown: boolean;
}

export function LayersPanel() {
  const t = useTranslations('designPlayground');
  const document = useDesignDocumentStore((s) => s.document);
  const pageId = useDesignDocumentStore((s) => s.pageId);
  const selection = useDesignDocumentStore((s) => s.selection);
  const select = useDesignDocumentStore((s) => s.select);
  const toggleSelection = useDesignDocumentStore((s) => s.toggleSelection);
  const patchNode = useDesignDocumentStore((s) => s.patchNode);
  const deleteSelection = useDesignDocumentStore((s) => s.deleteSelection);
  const nudgeOrder = useDesignDocumentStore((s) => s.nudgeOrder);

  const [collapsed, setCollapsed] = useState<ReadonlySet<string>>(() => new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const treeRef = useRef<HTMLDivElement>(null);

  const page = document.pages.find((p) => p.id === pageId) ?? null;
  const rows = page ? buildRows(document, topLevelNodes(document, page), collapsed) : [];

  const toggleCollapsed = (id: string): void => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /** Move DOM focus between rows without owning a focus state each row reads. */
  const focusRow = (id: string | undefined): void => {
    if (!id) return;
    treeRef.current?.querySelector<HTMLElement>(`[data-row-id="${id}"]`)?.focus();
  };

  const onRowKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number): void => {
    const row = rows[index];
    if (!row) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusRow(rows[index + 1]?.node.id);
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusRow(rows[index - 1]?.node.id);
        break;
      case 'ArrowRight':
        if (!row.hasChildren) break;
        event.preventDefault();
        // Standard tree behaviour: open a closed branch, then step into it.
        if (!row.expanded) toggleCollapsed(row.node.id);
        else focusRow(rows[index + 1]?.node.id);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (row.hasChildren && row.expanded) toggleCollapsed(row.node.id);
        else focusRow(parentRowId(rows, index));
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select([row.node.id]);
        break;
      case 'F2':
        event.preventDefault();
        setRenamingId(row.node.id);
        break;
      default:
        break;
    }
  };

  if (rows.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-border p-3 text-center text-xs leading-relaxed text-muted-foreground">
        {t('panels.layers.empty')}
      </p>
    );
  }

  return (
    <div ref={treeRef} role="tree" aria-label={t('panels.layers.title')} className="-mx-1">
      {rows.map((row, index) => {
        const { node } = row;
        const Icon = NODE_ICONS[node.type];
        const selected = selection.includes(node.id);
        const renaming = renamingId === node.id;

        return (
          <div
            key={node.id}
            role="treeitem"
            data-row-id={node.id}
            aria-selected={selected}
            aria-level={row.level + 1}
            aria-posinset={row.posInSet}
            aria-setsize={row.setSize}
            {...(row.hasChildren ? { 'aria-expanded': row.expanded } : {})}
            tabIndex={index === 0 ? 0 : -1}
            onKeyDown={(event) => onRowKeyDown(event, index)}
            onClick={(event: MouseEvent<HTMLDivElement>) => {
              // ⌘/ctrl and shift both extend here: the tree has no range concept
              // yet, so shift behaves as an additive toggle rather than lying.
              if (event.metaKey || event.ctrlKey || event.shiftKey) toggleSelection(node.id);
              else select([node.id]);
            }}
            onDoubleClick={() => setRenamingId(node.id)}
            className={cn(
              'group flex h-7 cursor-default items-center gap-1 rounded-md pr-1 text-[13px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              selected ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
              row.inheritedHidden && !selected && 'text-muted-foreground',
            )}
          >
            {/* Depth is drawn with spacer elements rather than a computed
                padding, so nesting stays on token widths and the row's hover and
                selection fill still spans the full panel width. */}
            {Array.from({ length: row.level }, (_, depth) => (
              <span key={depth} aria-hidden className="w-3 shrink-0" />
            ))}

            {row.hasChildren ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleCollapsed(node.id);
                }}
                aria-label={t(row.expanded ? 'panels.layers.collapse' : 'panels.layers.expand')}
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight
                  className={cn('h-3.5 w-3.5 transition-transform', row.expanded && 'rotate-90')}
                />
              </button>
            ) : (
              <span aria-hidden className="h-5 w-5 shrink-0" />
            )}

            <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            {renaming ? (
              <InlineRename
                value={node.name}
                label={t('panels.layers.nameLabel')}
                onCommit={(name) => {
                  setRenamingId(null);
                  if (name && name !== node.name) patchNode(node.id, { name });
                }}
                onCancel={() => setRenamingId(null)}
              />
            ) : (
              <span className={cn('min-w-0 flex-1 truncate', node.hidden && 'line-through')}>
                {node.name}
              </span>
            )}

            <RowToggle
              active={false}
              // Disabled at the ends rather than hidden: a control that vanishes
              // at the top of the list makes the row jump as you move things.
              disabled={!row.canMoveUp}
              label={t('panels.layers.moveUp')}
              onToggle={() => nudgeOrder(node.id, 'up')}
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </RowToggle>

            <RowToggle
              active={false}
              disabled={!row.canMoveDown}
              label={t('panels.layers.moveDown')}
              onToggle={() => nudgeOrder(node.id, 'down')}
            >
              <ChevronDown className="h-3.5 w-3.5" />
            </RowToggle>

            <RowToggle
              active={node.hidden}
              // A toggle that only appears on hover is unreachable by keyboard and
              // invisible on touch, so an active one stays permanently visible.
              label={t(node.hidden ? 'panels.layers.show' : 'panels.layers.hide')}
              onToggle={() => patchNode(node.id, { hidden: !node.hidden })}
            >
              {node.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </RowToggle>

            <RowToggle
              active={node.locked}
              label={t(node.locked ? 'panels.layers.unlock' : 'panels.layers.lock')}
              onToggle={() => patchNode(node.id, { locked: !node.locked })}
            >
              {node.locked ? (
                <Lock className="h-3.5 w-3.5" />
              ) : (
                <LockOpen className="h-3.5 w-3.5" />
              )}
            </RowToggle>

            <RowToggle
              active={false}
              danger
              label={t('panels.layers.remove')}
              // Delete acts on THIS row, not on whatever happened to be selected:
              // clicking a trash icon on one layer must never remove another.
              onToggle={() => {
                select([node.id]);
                deleteSelection();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </RowToggle>
          </div>
        );
      })}
    </div>
  );
}

/** Depth-first walk of the visible tree, topmost layer first. */
function buildRows(
  doc: Document,
  siblings: Node[],
  collapsed: ReadonlySet<string>,
  level = 0,
  parentHidden = false,
): LayerRow[] {
  const ordered = [...siblings].reverse();
  const rows: LayerRow[] = [];

  ordered.forEach((node, index) => {
    const hasChildren = node.children.length > 0;
    const expanded = hasChildren && !collapsed.has(node.id);
    const inheritedHidden = parentHidden || node.hidden;

    rows.push({
      node,
      level,
      posInSet: index + 1,
      setSize: ordered.length,
      hasChildren,
      expanded,
      inheritedHidden,
      // `ordered` is already reversed, so the first row is the topmost node:
      // it cannot move further up, and the last cannot move further down.
      canMoveUp: index > 0,
      canMoveDown: index < ordered.length - 1,
    });

    if (!expanded) return;
    const children = node.children
      .map((id) => doc.nodes[id])
      .filter((child): child is Node => child !== undefined);
    rows.push(...buildRows(doc, children, collapsed, level + 1, inheritedHidden));
  });

  return rows;
}

/** The row that owns `index`: the nearest shallower row above it. */
function parentRowId(rows: LayerRow[], index: number): string | undefined {
  const level = rows[index]?.level ?? 0;
  for (let i = index - 1; i >= 0; i -= 1) {
    const candidate = rows[i];
    if (candidate && candidate.level < level) return candidate.node.id;
  }
  return undefined;
}

/** Row control (hide, lock, delete). Idle ones stay quiet until hover/focus. */
function RowToggle({
  active,
  label,
  onToggle,
  children,
  danger = false,
  disabled = false,
}: {
  active: boolean;
  label: string;
  onToggle: () => void;
  children: ReactNode;
  /** Destructive controls get their own tone so they read apart from toggles. */
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      // A destructive button is an action, not a state, so it has no pressed
      // state to announce.
      {...(danger ? {} : { 'aria-pressed': active })}
      disabled={disabled}
      title={label}
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        danger ? 'hover:text-danger' : 'hover:text-foreground',
        'disabled:cursor-not-allowed disabled:opacity-30',
        active
          ? 'text-foreground opacity-100'
          : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
      )}
    >
      {children}
      <span className="sr-only">{label}</span>
    </button>
  );
}

/**
 * Inline rename field. Enter and blur commit; Escape abandons the edit.
 *
 * Exported because the pages panel renames the same way - one rename behaviour
 * for the whole rail, not two that drift apart.
 */
export function InlineRename({
  value,
  label,
  onCommit,
  onCancel,
}: {
  value: string;
  label: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState(value);

  return (
    <input
      autoFocus
      aria-label={label}
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onClick={(event) => event.stopPropagation()}
      onDoubleClick={(event) => event.stopPropagation()}
      onBlur={() => onCommit(draft.trim())}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          onCommit(draft.trim());
        } else if (event.key === 'Escape') {
          event.preventDefault();
          onCancel();
        }
        // The tree's arrow-key navigation must not steal the caret.
        event.stopPropagation();
      }}
      className="h-5 min-w-0 flex-1 rounded border border-border bg-background px-1 text-[13px] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    />
  );
}
