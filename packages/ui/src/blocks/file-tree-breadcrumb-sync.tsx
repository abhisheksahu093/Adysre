'use client';

/**
 * Live preview for `file-tree-breadcrumb-sync`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FileTreeBreadcrumbSyncProps {
  nodes: TreeNode[];
  label?: string;
}

function TreeItem({
  node,
  level,
  trail,
  selected,
  onSelect,
}: {
  node: TreeNode;
  level: number;
  trail: string[];
  selected: string;
  onSelect: (path: string[]) => void;
}) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const path = trail.concat(node.name);
  const key = path.join('/');

  if (!children) {
    const active = key === selected;
    return (
      <li role="treeitem" aria-selected={active}>
        <button
          type="button"
          onClick={() => onSelect(path)}
          className={
            active
              ? 'flex w-full min-w-0 items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1.5 text-left text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500/15 dark:text-blue-300'
              : 'flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-900'
          }
        >
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </button>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900"
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
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} trail={path} selected={selected} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeBreadcrumbSync({ nodes, label = 'Project files' }: FileTreeBreadcrumbSyncProps) {
  const [path, setPath] = useState<string[]>([]);
  const selected = path.join('/');

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      {/* The breadcrumb reflects the selection; it never scrolls the page - it
          wraps and truncates instead. aria-live announces the change. */}
      <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-gray-200 px-3 py-2 text-xs dark:border-gray-800" aria-live="polite">
        {path.length === 0 ? (
          <span className="text-gray-400">Select a file…</span>
        ) : (
          path.map((seg, i) => (
            <span key={seg + i} className="flex min-w-0 items-center gap-1">
              {i > 0 ? <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">/</span> : null}
              <span className={i === path.length - 1 ? 'truncate font-medium text-gray-900 dark:text-gray-100' : 'truncate text-gray-500'}>
                {seg}
              </span>
            </span>
          ))
        )}
      </div>
      <ul role="tree" aria-label={label} className="space-y-0.5 p-2">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} trail={[]} selected={selected} onSelect={setPath} />
        ))}
      </ul>
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'src',
    children: [
      { name: 'features', children: [{ name: 'auth', children: [{ name: 'login.tsx' }, { name: 'signup.tsx' }] }] },
      { name: 'index.ts' },
    ],
  },
  { name: 'package.json' },
];

export default function FileTreeBreadcrumbSyncPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeBreadcrumbSync nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 380;
