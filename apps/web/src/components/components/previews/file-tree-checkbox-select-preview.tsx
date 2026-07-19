'use client';

/**
 * Live preview for `file-tree-checkbox-select`. Mirrors the `typescript` variant
 * verbatim. Keep in step with `src/data/components/file-trees.ts`.
 */
import { useState } from 'react';

interface TreeNode {
  name: string;
  children?: TreeNode[];
}

interface FileTreeCheckboxSelectProps {
  nodes: TreeNode[];
  label?: string;
}

// A folder's checkbox is derived from its files, never stored: check every leaf
// under it and it reads checked, some and it reads indeterminate. Storing folder
// state as well is the classic tri-state bug - two sources of truth that drift.
function collectLeafPaths(node: TreeNode, path: string): string[] {
  const children = node.children;
  if (!children) return [path];
  return children.flatMap((child) => collectLeafPaths(child, path + '/' + child.name));
}

interface ItemProps {
  node: TreeNode;
  level: number;
  path: string;
  checked: Set<string>;
  onToggle: (node: TreeNode, path: string) => void;
}

function TreeItem({ node, level, path, checked, onToggle }: ItemProps) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const leaves = collectLeafPaths(node, path);
  const selected = leaves.filter((p) => checked.has(p)).length;
  const isChecked = leaves.length > 0 && selected === leaves.length;
  const isIndeterminate = selected > 0 && !isChecked;

  const checkbox = (
    <input
      type="checkbox"
      checked={isChecked}
      ref={(el) => {
        if (el) el.indeterminate = isIndeterminate;
      }}
      onChange={() => onToggle(node, path)}
      aria-label={node.name}
      className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
    />
  );

  if (!children) {
    return (
      <li role="treeitem" aria-checked={isChecked} className="text-gray-700 dark:text-gray-300">
        <div className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          {checkbox}
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </div>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open} aria-checked={isChecked}>
      <div className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        {checkbox}
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
            <TreeItem
              key={child.name + i}
              node={child}
              level={level + 1}
              path={path + '/' + child.name}
              checked={checked}
              onToggle={onToggle}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function FileTreeCheckboxSelect({ nodes, label = 'Select files' }: FileTreeCheckboxSelectProps) {
  const [checked, setChecked] = useState<Set<string>>(() => new Set<string>());

  const onToggle = (node: TreeNode, path: string) => {
    const leaves = collectLeafPaths(node, path);
    setChecked((prev) => {
      const next = new Set(prev);
      const allOn = leaves.every((p) => next.has(p));
      for (const p of leaves) {
        if (allOn) next.delete(p);
        else next.add(p);
      }
      return next;
    });
  };

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} aria-multiselectable="true" className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} path={node.name} checked={checked} onToggle={onToggle} />
        ))}
      </ul>
    </nav>
  );
}

const SAMPLE: TreeNode[] = [
  {
    name: 'assets',
    children: [
      { name: 'logo.svg' },
      { name: 'icons', children: [{ name: 'home.svg' }, { name: 'user.svg' }] },
    ],
  },
  { name: 'index.html' },
  { name: 'styles.css' },
];

export default function FileTreeCheckboxSelectPreview() {
  return (
    <div className="flex justify-center p-4">
      <FileTreeCheckboxSelect nodes={SAMPLE} />
    </div>
  );
}

export const minHeight = 340;
