'use client';

/**
 * Live preview for `file-tree-drag-handle-visual`. Mirrors the `typescript`
 * variant verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FileTreeDragHandleVisualProps {
  nodes: TreeNode[];
  label?: string;
}

// Visual affordance only: the grip shows where a drag would start. Wire real
// reordering to your own DnD layer - the handle is aria-hidden so a screen
// reader is never told about a gesture it cannot perform.
function DragHandle() {
  return (
    <span
      className="shrink-0 cursor-grab text-gray-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 dark:text-gray-600"
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4">
        <circle cx="6" cy="4" r="1.2" />
        <circle cx="10" cy="4" r="1.2" />
        <circle cx="6" cy="8" r="1.2" />
        <circle cx="10" cy="8" r="1.2" />
        <circle cx="6" cy="12" r="1.2" />
        <circle cx="10" cy="12" r="1.2" />
      </svg>
    </span>
  );
}

function TreeItem({ node, level }: { node: TreeNode; level: number }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <div className="group flex min-w-0 select-none items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <DragHandle />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </div>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open}>
      <div className="group flex min-w-0 select-none items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        <DragHandle />
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
      </div>
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

function FileTreeDragHandleVisual({ nodes, label = 'Reorderable files' }: FileTreeDragHandleVisualProps) {
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
    name: 'layers',
    children: [
      { name: 'background.svg' },
      { name: 'header.svg' },
      { name: 'content.svg' },
    ],
  },
  { name: 'canvas.json' },
];

export default function FileTreeDragHandleVisualPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeDragHandleVisual nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 300;
