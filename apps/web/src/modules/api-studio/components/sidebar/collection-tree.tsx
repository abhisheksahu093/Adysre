'use client';

import { useTranslations } from 'next-intl';
import { ChevronRight, FilePlus2, Folder, FolderOpen, FolderPlus, Star, Trash2 } from 'lucide-react';
import { cn } from 'adysre';
import type { ApiCollection, ApiTreeNode } from '../../types';
import { METHOD_TONES } from '../../constants/http';
import { TonePill } from '../tone';

/**
 * The collections tree.
 *
 * Rendered from the flat node map through the store's memoised tree, so a
 * keystroke in the URL bar does not rebuild it. Rows are buttons in a `tree`
 * role: arrow keys move, Enter opens, which is what a person who never touches
 * the mouse needs and what a screen reader needs to announce depth.
 */
export function CollectionTree({
  collections,
  treeOf,
  expanded,
  selectedId,
  onToggle,
  onOpen,
  onFavorite,
  onDelete,
  onNewRequest,
  onNewFolder,
}: {
  collections: ApiCollection[];
  treeOf: (collectionId: string) => ApiTreeNode[];
  expanded: Record<string, boolean>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onOpen: (nodeId: string) => void;
  onFavorite: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onNewRequest: (collectionId: string, parentId: string | null) => void;
  onNewFolder: (collectionId: string) => void;
}) {
  const t = useTranslations('apiStudio');

  if (collections.length === 0) {
    return <p className="px-3 py-6 text-center text-xs text-muted-foreground">{t('sidebar.noCollections')}</p>;
  }

  return (
    <div role="tree" aria-label={t('sidebar.collections')} className="space-y-2 py-1">
      {collections.map((collection) => {
        const open = expanded[collection.id] !== false;
        return (
          <div key={collection.id}>
            <div className="group flex items-center gap-1 px-2">
              <button
                type="button"
                onClick={() => onToggle(collection.id)}
                aria-expanded={open}
                className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight
                  className={cn('h-3.5 w-3.5 shrink-0 transition-transform', open && 'rotate-90')}
                  aria-hidden
                />
                <span className="truncate">{collection.name}</span>
              </button>

              <RowAction
                label={t('sidebar.newRequest')}
                onClick={() => onNewRequest(collection.id, null)}
                icon={<FilePlus2 className="h-3.5 w-3.5" aria-hidden />}
              />
              <RowAction
                label={t('sidebar.newFolder')}
                onClick={() => onNewFolder(collection.id)}
                icon={<FolderPlus className="h-3.5 w-3.5" aria-hidden />}
              />
            </div>

            {open && (
              <TreeLevel
                nodes={treeOf(collection.id)}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={onToggle}
                onOpen={onOpen}
                onFavorite={onFavorite}
                onDelete={onDelete}
                onNewRequest={(parentId) => onNewRequest(collection.id, parentId)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TreeLevel({
  nodes,
  expanded,
  selectedId,
  onToggle,
  onOpen,
  onFavorite,
  onDelete,
  onNewRequest,
}: {
  nodes: ApiTreeNode[];
  expanded: Record<string, boolean>;
  selectedId: string | null;
  onToggle: (id: string) => void;
  onOpen: (nodeId: string) => void;
  onFavorite: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
  onNewRequest: (parentId: string) => void;
}) {
  const t = useTranslations('apiStudio');

  return (
    <ul role="group" className="space-y-px">
      {nodes.map(({ node, depth, children }) => {
        const open = Boolean(expanded[node.id]);
        const selected = selectedId === node.id;
        const indent = { paddingInlineStart: `${0.5 + depth * 0.75}rem` };

        return (
          <li key={node.id} role="treeitem" aria-selected={selected} aria-expanded={node.kind === 'folder' ? open : undefined}>
            <div
              className={cn(
                'group flex items-center gap-1 pe-2',
                selected ? 'bg-primary/10' : 'hover:bg-muted',
              )}
            >
              <button
                type="button"
                style={indent}
                onClick={() => (node.kind === 'folder' ? onToggle(node.id) : onOpen(node.id))}
                className={cn(
                  'flex min-w-0 flex-1 items-center gap-1.5 py-1.5 pe-1 text-left text-xs',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  selected ? 'text-primary' : 'text-foreground',
                )}
              >
                {node.kind === 'folder' ? (
                  open ? (
                    <FolderOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  ) : (
                    <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  )
                ) : (
                  <TonePill tone={METHOD_TONES[node.request.method]} className="w-12 justify-center">
                    {node.request.method.slice(0, 4)}
                  </TonePill>
                )}
                <span className="truncate">{node.name}</span>
                {node.favorite && (
                  <Star className="h-3 w-3 shrink-0 fill-warning text-warning" aria-label={t('sidebar.favorited')} />
                )}
              </button>

              {node.kind === 'folder' && (
                <RowAction
                  label={t('sidebar.newRequest')}
                  onClick={() => onNewRequest(node.id)}
                  icon={<FilePlus2 className="h-3.5 w-3.5" aria-hidden />}
                />
              )}
              <RowAction
                label={node.favorite ? t('sidebar.unfavorite') : t('sidebar.favorite')}
                onClick={() => onFavorite(node.id)}
                icon={<Star className={cn('h-3.5 w-3.5', node.favorite && 'fill-warning text-warning')} aria-hidden />}
              />
              <RowAction
                label={t('sidebar.delete')}
                onClick={() => onDelete(node.id)}
                icon={<Trash2 className="h-3.5 w-3.5" aria-hidden />}
                danger
              />
            </div>

            {node.kind === 'folder' && open && children.length > 0 && (
              <TreeLevel
                nodes={children}
                expanded={expanded}
                selectedId={selectedId}
                onToggle={onToggle}
                onOpen={onOpen}
                onFavorite={onFavorite}
                onDelete={onDelete}
                onNewRequest={onNewRequest}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A row action. Visible on hover and on focus, never on hover alone: an action
 * a keyboard user cannot see is an action they do not have.
 */
function RowAction({
  label,
  onClick,
  icon,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded text-muted-foreground opacity-0 transition',
        'group-hover:opacity-100 focus:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        danger ? 'hover:text-danger' : 'hover:text-foreground',
      )}
    >
      {icon}
    </button>
  );
}
