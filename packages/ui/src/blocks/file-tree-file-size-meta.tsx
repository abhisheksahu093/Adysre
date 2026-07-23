'use client';

/**
 * Live preview for `file-tree-file-size-meta`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  // Bytes, on files only. Folders derive a count from their children instead.
  size?: number;
  children?: TreeNode[];
}

interface FileTreeFileSizeMetaProps {
  nodes: TreeNode[];
  label?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
          {node.size !== undefined ? (
            <span className="ml-auto shrink-0 pl-2 text-xs tabular-nums text-gray-400 dark:text-gray-500">{formatSize(node.size)}</span>
          ) : null}
        </span>
      </li>
    );
  }

  const count = children.length;
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
        <span className="ml-auto shrink-0 pl-2 text-xs tabular-nums text-gray-400 dark:text-gray-500">
          {count} {count === 1 ? 'item' : 'items'}
        </span>
      </button>
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeFileSizeMeta({ nodes, label = 'Project files' }: FileTreeFileSizeMetaProps) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'public',
    children: [
      { name: 'hero.png', size: 812000 },
      { name: 'favicon.ico', size: 4096 },
      { name: 'robots.txt', size: 128 },
    ],
  },
  { name: 'bundle.js', size: 1548000 },
  { name: 'index.html', size: 2300 },
];

export default function FileTreeFileSizeMetaPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeFileSizeMeta nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 320;
