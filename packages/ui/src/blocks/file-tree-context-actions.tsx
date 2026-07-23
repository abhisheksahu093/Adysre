'use client';

/**
 * Live preview for `file-tree-context-actions`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState, type ReactNode } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

type TreeAction = 'rename' | 'add' | 'delete';

interface FileTreeContextActionsProps {
  nodes: TreeNode[];
  label?: string;
  onAction?: (action: TreeAction, path: string) => void;
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      // The actions are hidden by opacity, not display, so they stay in the tab
      // order and reveal on keyboard focus too - not just mouse hover.
      className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group-hover:opacity-100 group-focus-within:opacity-100 dark:hover:bg-gray-800 dark:hover:text-gray-200"
    >
      {children}
    </button>
  );
}

function TreeItem({
  node,
  level,
  path,
  onAction,
}: {
  node: TreeNode;
  level: number;
  path: string;
  onAction: (action: TreeAction, path: string) => void;
}) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  const actions = (
    <span className="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
      {children ? (
        <ActionButton label={'New file in ' + node.name} onClick={() => onAction('add', path)}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
            <path d="M8 3.5a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 0 1.5h-3v3a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3v-3A.75.75 0 0 1 8 3.5z" />
          </svg>
        </ActionButton>
      ) : null}
      <ActionButton label={'Rename ' + node.name} onClick={() => onAction('rename', path)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M11.5 1.5 14.5 4.5 6 13H3v-3zM10.4 2.6 12 4.2" />
        </svg>
      </ActionButton>
      <ActionButton label={'Delete ' + node.name} onClick={() => onAction('delete', path)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
          <path d="M6 2h4l.5 1H13v1.5H3V3h2.5zM4 5h8l-.6 8.5A1 1 0 0 1 10.4 14.5H5.6a1 1 0 0 1-1-1z" />
        </svg>
      </ActionButton>
    </span>
  );

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <div className="group flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
          {actions}
        </div>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open}>
      <div className="group flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            className={
              open
                ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none'
                : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'
            }
          >
            <path d="M6 4l4 4-4 4z" />
          </svg>
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true">
            <path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z" />
          </svg>
          <span className="truncate font-medium text-gray-900 dark:text-gray-100">{node.name}</span>
        </button>
        {actions}
      </div>
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} path={path + '/' + child.name} onAction={onAction} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeContextActions({ nodes, label = 'Project files', onAction }: FileTreeContextActionsProps) {
  const handle = onAction ?? (() => undefined);
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} path={node.name} onAction={handle} />
        ))}
      </ul>
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'src',
    children: [
      { name: 'main.ts' },
      { name: 'styles.css' },
    ],
  },
  { name: 'package.json' },
];

export default function FileTreeContextActionsPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeContextActions nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 300;
