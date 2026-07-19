import type { ComponentEntry } from './types';

/**
 * File-trees category.
 *
 * Ten recursive, data-driven trees - not ten recolours of one list. Every
 * variant takes its `nodes` as a prop and renders itself by recursion, so depth
 * is unbounded; what changes between them is the payload each row carries (git
 * status, byte size, a checkbox, an action rail) and the interaction on top.
 *
 * Two constraints are shared and load-bearing across all ten:
 *   1. ARIA. The container is `role="tree"`, every row `role="treeitem"`, every
 *      nested list `role="group"`, and folders carry `aria-expanded`. A bare
 *      nested `<ul>` looks like a tree but is announced as a plain list.
 *   2. Width. Deep nesting must never scroll the *page* sideways at 320px. Indent
 *      is a nested `pl-2 sm:ml-4` step (it scales down on phones), and every
 *      label is `min-w-0 truncate` - so a very deep or very long name eats into
 *      its own row and ellipses, it does not push the viewport.
 */
export const fileTreesComponents: ComponentEntry[] = [
  {
    slug: 'file-tree-collapsible-basic',
    category: 'file-trees',
    tags: ['file-tree', 'tree', 'collapsible', 'recursive', 'aria'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Project files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!--
  Static two-level snapshot; the React/TypeScript tabs add expand/collapse and
  arbitrary depth. role="tree" + treeitem + group and aria-expanded are what make
  this a tree to a screen reader, not just an indented list. min-w-0 + truncate
  on every label is what stops deep nesting scrolling the page at 320px.
-->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Project files" class="space-y-0.5">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
        <span class="truncate font-medium text-gray-900 dark:text-gray-100">src</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem">
          <span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
            <span class="w-3.5 shrink-0" aria-hidden="true"></span>
            <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg>
            <span class="truncate">index.ts</span>
          </span>
        </li>
      </ul>
    </li>
    <li role="treeitem">
      <span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        <span class="w-3.5 shrink-0" aria-hidden="true"></span>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg>
        <span class="truncate">package.json</span>
      </span>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function TreeItem({ node, level }) {
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
        </span>
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
          className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}
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
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCollapsibleBasic({ nodes, label = 'Project files' }) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  /** Presence of \`children\` (even empty) marks a folder; its absence marks a file. */
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

function TreeItem({ node, level }: { node: TreeNode; level: number }): JSX.Element {
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
        </span>
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
          className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}
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
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCollapsibleBasic({ nodes, label = 'Project files' }: FileTreeProps): JSX.Element {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-file-type-icons',
    category: 'file-trees',
    tags: ['file-tree', 'icons', 'file-type', 'recursive', 'extension'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Project files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- The colour hints at the file type from its extension; the icon stays
     aria-hidden so a screen reader is never asked to read a decorative glyph. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Project files" class="space-y-0.5">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
        <span class="truncate font-medium text-gray-900 dark:text-gray-100">app</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">page.tsx</span></span></li>
        <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-sky-500" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">globals.css</span></span></li>
      </ul>
    </li>
    <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">tsconfig.json</span></span></li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function extColor(name) {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'text-blue-500';
    case 'js':
    case 'jsx':
      return 'text-yellow-500';
    case 'json':
      return 'text-amber-500';
    case 'css':
      return 'text-sky-500';
    case 'svg':
    case 'png':
      return 'text-purple-500';
    default:
      return 'text-gray-400';
  }
}

function TreeItem({ node, level }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className={'h-4 w-4 shrink-0 ' + extColor(node.name)} aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </span>
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
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeFileTypeIcons({ nodes, label = 'Project files' }) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

function extColor(name: string): string {
  const ext = name.slice(name.lastIndexOf('.') + 1).toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'text-blue-500';
    case 'js':
    case 'jsx':
      return 'text-yellow-500';
    case 'json':
      return 'text-amber-500';
    case 'css':
      return 'text-sky-500';
    case 'svg':
    case 'png':
      return 'text-purple-500';
    default:
      return 'text-gray-400';
  }
}

function TreeItem({ node, level }: { node: TreeNode; level: number }): JSX.Element {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className={'h-4 w-4 shrink-0 ' + extColor(node.name)} aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </span>
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
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeFileTypeIcons({ nodes, label = 'Project files' }: FileTreeProps): JSX.Element {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-git-status',
    category: 'file-trees',
    tags: ['file-tree', 'git', 'status', 'diff', 'source-control'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Changed files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- Status is colour AND a letter (M/A/D/U): a red tint alone is invisible to a
     colour-blind reader, so the letter carries the same meaning, with an
     sr-only long form for assistive tech. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Changed files" class="space-y-0.5">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
        <span class="truncate font-medium text-gray-900 dark:text-gray-100">src</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate text-amber-600 dark:text-amber-400">app.tsx</span><span class="ml-auto shrink-0 pl-2 text-xs font-bold text-amber-600 dark:text-amber-400"><span class="sr-only">modified</span><span aria-hidden="true">M</span></span></span></li>
        <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate text-emerald-600 dark:text-emerald-400">router.tsx</span><span class="ml-auto shrink-0 pl-2 text-xs font-bold text-emerald-600 dark:text-emerald-400"><span class="sr-only">added</span><span aria-hidden="true">A</span></span></span></li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

const STATUS_META = {
  modified: { letter: 'M', label: 'modified', cls: 'text-amber-600 dark:text-amber-400' },
  added: { letter: 'A', label: 'added', cls: 'text-emerald-600 dark:text-emerald-400' },
  deleted: { letter: 'D', label: 'deleted', cls: 'text-red-600 dark:text-red-400' },
  untracked: { letter: 'U', label: 'untracked', cls: 'text-sky-600 dark:text-sky-400' },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  return (
    <span className={'ml-auto shrink-0 pl-2 text-xs font-bold ' + meta.cls}>
      <span className="sr-only">{meta.label}</span>
      <span aria-hidden="true">{meta.letter}</span>
    </span>
  );
}

function TreeItem({ node, level }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const tint = node.status ? STATUS_META[node.status].cls : '';

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className={'truncate ' + tint}>{node.name}</span>
          {node.status ? <StatusBadge status={node.status} /> : null}
        </span>
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
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeGitStatus({ nodes, label = 'Changed files' }) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export type GitStatus = 'modified' | 'added' | 'deleted' | 'untracked';

export interface TreeNode {
  name: string;
  status?: GitStatus;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

const STATUS_META: Record<GitStatus, { letter: string; label: string; cls: string }> = {
  modified: { letter: 'M', label: 'modified', cls: 'text-amber-600 dark:text-amber-400' },
  added: { letter: 'A', label: 'added', cls: 'text-emerald-600 dark:text-emerald-400' },
  deleted: { letter: 'D', label: 'deleted', cls: 'text-red-600 dark:text-red-400' },
  untracked: { letter: 'U', label: 'untracked', cls: 'text-sky-600 dark:text-sky-400' },
};

function StatusBadge({ status }: { status: GitStatus }): JSX.Element {
  const meta = STATUS_META[status];
  return (
    <span className={'ml-auto shrink-0 pl-2 text-xs font-bold ' + meta.cls}>
      <span className="sr-only">{meta.label}</span>
      <span aria-hidden="true">{meta.letter}</span>
    </span>
  );
}

function TreeItem({ node, level }: { node: TreeNode; level: number }): JSX.Element {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const tint = node.status ? STATUS_META[node.status].cls : '';

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className={'truncate ' + tint}>{node.name}</span>
          {node.status ? <StatusBadge status={node.status} /> : null}
        </span>
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
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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
            <TreeItem key={child.name + i} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeGitStatus({ nodes, label = 'Changed files' }: FileTreeProps): JSX.Element {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-checkbox-select',
    category: 'file-trees',
    tags: ['file-tree', 'checkbox', 'multi-select', 'indeterminate', 'recursive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Select files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- A folder's checkbox is DERIVED from its files, never stored: all leaves
     checked => checked, some => indeterminate. Indeterminate has no HTML
     attribute; it is set on the DOM node in JS, so this static snapshot shows
     the checked and unchecked states only. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Select files" aria-multiselectable="true" class="space-y-0.5">
    <li role="treeitem" aria-expanded="true" aria-checked="false">
      <div class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        <input type="checkbox" aria-label="assets" class="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 dark:border-gray-700 dark:bg-gray-900" />
        <button type="button" class="flex min-w-0 flex-1 items-center gap-1.5 text-left">
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
          <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
          <span class="truncate font-medium text-gray-900 dark:text-gray-100">assets</span>
        </button>
      </div>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem" aria-checked="false"><div class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><input type="checkbox" aria-label="logo.svg" class="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 dark:border-gray-700 dark:bg-gray-900" /><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">logo.svg</span></div></li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function collectLeafPaths(node, path) {
  const children = node.children;
  if (!children) return [path];
  return children.flatMap((child) => collectLeafPaths(child, path + '/' + child.name));
}

function TreeItem({ node, level, path, checked, onToggle }) {
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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
            <TreeItem key={child.name + i} node={child} level={level + 1} path={path + '/' + child.name} checked={checked} onToggle={onToggle} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCheckboxSelect({ nodes, label = 'Select files' }) {
  const [checked, setChecked] = useState(() => new Set());

  const onToggle = (node, path) => {
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
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

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

function TreeItem({ node, level, path, checked, onToggle }: ItemProps): JSX.Element {
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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
            <TreeItem key={child.name + i} node={child} level={level + 1} path={path + '/' + child.name} checked={checked} onToggle={onToggle} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCheckboxSelect({ nodes, label = 'Select files' }: FileTreeProps): JSX.Element {
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
}`,
    },
  },
  {
    slug: 'file-tree-search-filter',
    category: 'file-trees',
    tags: ['file-tree', 'search', 'filter', 'highlight', 'recursive'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Search files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- Static, fully-expanded snapshot. The React/TypeScript tabs add the live
     filter: a matching file drags its ancestor folders into view, the tree
     auto-expands while a query is active, and the match is <mark>ed. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <div class="relative mb-2">
    <svg viewBox="0 0 16 16" fill="currentColor" class="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true"><path d="M7 2a5 5 0 0 1 3.9 8.1l3 3-1 1-3-3A5 5 0 1 1 7 2zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/></svg>
    <input type="search" placeholder="Filter files…" aria-label="Search files" class="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100" />
  </div>
  <ul role="tree" aria-label="Files" class="space-y-0.5">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
        <span class="truncate font-medium text-gray-900 dark:text-gray-100">components</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">button.tsx</span></span></li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function filterTree(nodes, q) {
  if (!q) return nodes;
  const out = [];
  for (const node of nodes) {
    const children = node.children;
    if (children) {
      if (node.name.toLowerCase().includes(q)) {
        out.push(node);
        continue;
      }
      const kept = filterTree(children, q);
      if (kept.length > 0) out.push({ name: node.name, children: kept });
    } else if (node.name.toLowerCase().includes(q)) {
      out.push(node);
    }
  }
  return out;
}

function Highlight({ text, q }) {
  const idx = q ? text.toLowerCase().indexOf(q) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-200 text-inherit dark:bg-yellow-500/30 dark:text-yellow-100">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function TreeItem({ node, level, q, expandAll }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const isOpen = expandAll || open;

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate"><Highlight text={node.name} q={q} /></span>
        </span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={isOpen}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={isOpen ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true">
          <path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z" />
        </svg>
        <span className="truncate font-medium text-gray-900 dark:text-gray-100"><Highlight text={node.name} q={q} /></span>
      </button>
      {isOpen ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} q={q} expandAll={expandAll} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeSearchFilter({ nodes, label = 'Search files' }) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = filterTree(nodes, q);

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <div className="relative mb-2">
        <svg viewBox="0 0 16 16" fill="currentColor" className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true">
          <path d="M7 2a5 5 0 0 1 3.9 8.1l3 3-1 1-3-3A5 5 0 1 1 7 2zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
        </svg>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter files…" aria-label={label} className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100" />
      </div>
      {filtered.length > 0 ? (
        <ul role="tree" aria-label="Files" className="space-y-0.5">
          {filtered.map((node, i) => (
            <TreeItem key={node.name + i} node={node} level={0} q={q} expandAll={q.length > 0} />
          ))}
        </ul>
      ) : (
        <p className="px-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No files match.</p>
      )}
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

function filterTree(nodes: TreeNode[], q: string): TreeNode[] {
  if (!q) return nodes;
  const out: TreeNode[] = [];
  for (const node of nodes) {
    const children = node.children;
    if (children) {
      if (node.name.toLowerCase().includes(q)) {
        out.push(node);
        continue;
      }
      const kept = filterTree(children, q);
      if (kept.length > 0) out.push({ name: node.name, children: kept });
    } else if (node.name.toLowerCase().includes(q)) {
      out.push(node);
    }
  }
  return out;
}

function Highlight({ text, q }: { text: string; q: string }): JSX.Element {
  const idx = q ? text.toLowerCase().indexOf(q) : -1;
  if (idx < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-200 text-inherit dark:bg-yellow-500/30 dark:text-yellow-100">{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function TreeItem({ node, level, q, expandAll }: { node: TreeNode; level: number; q: string; expandAll: boolean }): JSX.Element {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const isOpen = expandAll || open;

  if (!children) {
    return (
      <li role="treeitem" className="text-gray-700 dark:text-gray-300">
        <span className="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate"><Highlight text={node.name} q={q} /></span>
        </span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={isOpen}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={isOpen ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true">
          <path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z" />
        </svg>
        <span className="truncate font-medium text-gray-900 dark:text-gray-100"><Highlight text={node.name} q={q} /></span>
      </button>
      {isOpen ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} q={q} expandAll={expandAll} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeSearchFilter({ nodes, label = 'Search files' }: FileTreeProps): JSX.Element {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = filterTree(nodes, q);

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <div className="relative mb-2">
        <svg viewBox="0 0 16 16" fill="currentColor" className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true">
          <path d="M7 2a5 5 0 0 1 3.9 8.1l3 3-1 1-3-3A5 5 0 1 1 7 2zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
        </svg>
        <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter files…" aria-label={label} className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100" />
      </div>
      {filtered.length > 0 ? (
        <ul role="tree" aria-label="Files" className="space-y-0.5">
          {filtered.map((node, i) => (
            <TreeItem key={node.name + i} node={node} level={0} q={q} expandAll={q.length > 0} />
          ))}
        </ul>
      ) : (
        <p className="px-2 py-6 text-center text-sm text-gray-500 dark:text-gray-400">No files match.</p>
      )}
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-code-project',
    category: 'file-trees',
    tags: ['file-tree', 'ide', 'explorer', 'editor', 'sidebar'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Explorer'", descriptionKey: 'label' },
      { name: 'activeFile', type: 'string', default: "''", descriptionKey: 'activeFile' },
    ],
    code: {
      tailwind: `<!-- The panel paints its own dark surface, so it reads the same on a light or
     dark page and needs no dark: variants. The open file is marked with both a
     background and aria-current so it is not signalled by colour alone. -->
<nav class="w-full max-w-xs overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-sm">
  <p class="border-b border-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Explorer</p>
  <ul role="tree" aria-label="Explorer" class="space-y-0.5 p-2">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-200 hover:bg-white/5">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-500" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <span class="truncate font-medium uppercase tracking-wide text-gray-300">src</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-white/10 pl-2 sm:ml-4">
        <li role="treeitem" aria-current="true"><span class="flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-blue-400 bg-white/10 px-2 py-1.5 text-white"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">router.tsx</span></span></li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function TreeItem({ node, level, path, activeFile }) {
  const children = node.children;
  const [open, setOpen] = useState(true);

  if (!children) {
    const active = path === activeFile;
    return (
      <li role="treeitem" aria-current={active ? 'true' : undefined}>
        <span className={active ? 'flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-blue-400 bg-white/10 px-2 py-1.5 text-white' : 'flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-transparent px-2 py-1.5 text-gray-300 hover:bg-white/5'}>
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-500 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none'}>
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <span className="truncate font-medium uppercase tracking-wide text-gray-300">{node.name}</span>
      </button>
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-white/10 pl-2 sm:ml-4">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} path={path + '/' + child.name} activeFile={activeFile} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCodeProject({ nodes, label = 'Explorer', activeFile = '' }) {
  return (
    <nav className="w-full max-w-xs overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-sm">
      <p className="border-b border-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <ul role="tree" aria-label={label} className="space-y-0.5 p-2">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} path={node.name} activeFile={activeFile} />
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
  /** Full slash path of the open file, e.g. 'src/app.tsx'. */
  activeFile?: string;
}

function TreeItem({ node, level, path, activeFile }: { node: TreeNode; level: number; path: string; activeFile: string }): JSX.Element {
  const children = node.children;
  const [open, setOpen] = useState(true);

  if (!children) {
    const active = path === activeFile;
    return (
      <li role="treeitem" aria-current={active ? 'true' : undefined}>
        <span className={active ? 'flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-blue-400 bg-white/10 px-2 py-1.5 text-white' : 'flex min-w-0 items-center gap-1.5 rounded-md border-l-2 border-transparent px-2 py-1.5 text-gray-300 hover:bg-white/5'}>
          <span className="w-3.5 shrink-0" aria-hidden="true" />
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 shrink-0 text-gray-500" aria-hidden="true">
            <path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z" />
          </svg>
          <span className="truncate">{node.name}</span>
        </span>
      </li>
    );
  }

  return (
    <li role="treeitem" aria-expanded={open}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-200 hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-500 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-500 transition-transform motion-reduce:transition-none'}>
          <path d="M6 4l4 4-4 4z" />
        </svg>
        <span className="truncate font-medium uppercase tracking-wide text-gray-300">{node.name}</span>
      </button>
      {open ? (
        <ul role="group" className="ml-3 space-y-0.5 border-l border-white/10 pl-2 sm:ml-4">
          {children.map((child, i) => (
            <TreeItem key={child.name + i} node={child} level={level + 1} path={path + '/' + child.name} activeFile={activeFile} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function FileTreeCodeProject({ nodes, label = 'Explorer', activeFile = '' }: FileTreeProps): JSX.Element {
  return (
    <nav className="w-full max-w-xs overflow-hidden rounded-xl border border-gray-800 bg-gray-900 text-sm">
      <p className="border-b border-gray-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <ul role="tree" aria-label={label} className="space-y-0.5 p-2">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} path={node.name} activeFile={activeFile} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-context-actions',
    category: 'file-trees',
    tags: ['file-tree', 'actions', 'hover', 'toolbar', 'crud'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Project files'", descriptionKey: 'label' },
      { name: 'onAction', type: '(action: TreeAction, path: string) => void', descriptionKey: 'onAction' },
    ],
    code: {
      tailwind: `<!-- Per-row actions are hidden by opacity, not display, so they stay in the tab
     order and reveal on keyboard focus (group-focus-within) as well as hover.
     Each button has a real aria-label. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Project files" class="space-y-0.5">
    <li role="treeitem">
      <div class="group flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        <span class="w-3.5 shrink-0"></span>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg>
        <span class="truncate">main.ts</span>
        <span class="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
          <button type="button" aria-label="Rename main.ts" class="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-700 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 dark:hover:bg-gray-800"><svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path d="M11.5 1.5 14.5 4.5 6 13H3v-3zM10.4 2.6 12 4.2"/></svg></button>
          <button type="button" aria-label="Delete main.ts" class="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-700 focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 dark:hover:bg-gray-800"><svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5" aria-hidden="true"><path d="M6 2h4l.5 1H13v1.5H3V3h2.5zM4 5h8l-.6 8.5A1 1 0 0 1 10.4 14.5H5.6a1 1 0 0 1-1-1z"/></svg></button>
        </span>
      </div>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function ActionButton({ label, onClick, children }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group-hover:opacity-100 group-focus-within:opacity-100 dark:hover:bg-gray-800 dark:hover:text-gray-200">
      {children}
    </button>
  );
}

function TreeItem({ node, level, path, onAction }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  const actions = (
    <span className="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
      {children ? (
        <ActionButton label={'New file in ' + node.name} onClick={() => onAction('add', path)}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M8 3.5a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 0 1.5h-3v3a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3v-3A.75.75 0 0 1 8 3.5z" /></svg>
        </ActionButton>
      ) : null}
      <ActionButton label={'Rename ' + node.name} onClick={() => onAction('rename', path)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M11.5 1.5 14.5 4.5 6 13H3v-3zM10.4 2.6 12 4.2" /></svg>
      </ActionButton>
      <ActionButton label={'Delete ' + node.name} onClick={() => onAction('delete', path)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M6 2h4l.5 1H13v1.5H3V3h2.5zM4 5h8l-.6 8.5A1 1 0 0 1 10.4 14.5H5.6a1 1 0 0 1-1-1z" /></svg>
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeContextActions({ nodes, label = 'Project files', onAction }) {
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
}`,
      typescript: `import { useState, type ReactNode } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export type TreeAction = 'rename' | 'add' | 'delete';

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
  onAction?: (action: TreeAction, path: string) => void;
}

function ActionButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }): JSX.Element {
  return (
    <button type="button" onClick={onClick} aria-label={label} className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-200 hover:text-gray-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 group-hover:opacity-100 group-focus-within:opacity-100 dark:hover:bg-gray-800 dark:hover:text-gray-200">
      {children}
    </button>
  );
}

function TreeItem({ node, level, path, onAction }: { node: TreeNode; level: number; path: string; onAction: (action: TreeAction, path: string) => void }): JSX.Element {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);

  const actions = (
    <span className="ml-auto flex shrink-0 items-center gap-0.5 pl-1">
      {children ? (
        <ActionButton label={'New file in ' + node.name} onClick={() => onAction('add', path)}>
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M8 3.5a.75.75 0 0 1 .75.75v3h3a.75.75 0 0 1 0 1.5h-3v3a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3v-3A.75.75 0 0 1 8 3.5z" /></svg>
        </ActionButton>
      ) : null}
      <ActionButton label={'Rename ' + node.name} onClick={() => onAction('rename', path)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M11.5 1.5 14.5 4.5 6 13H3v-3zM10.4 2.6 12 4.2" /></svg>
      </ActionButton>
      <ActionButton label={'Delete ' + node.name} onClick={() => onAction('delete', path)}>
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true"><path d="M6 2h4l.5 1H13v1.5H3V3h2.5zM4 5h8l-.6 8.5A1 1 0 0 1 10.4 14.5H5.6a1 1 0 0 1-1-1z" /></svg>
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeContextActions({ nodes, label = 'Project files', onAction }: FileTreeProps): JSX.Element {
  const handle: (action: TreeAction, path: string) => void = onAction ?? (() => undefined);
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} path={node.name} onAction={handle} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-breadcrumb-sync',
    category: 'file-trees',
    tags: ['file-tree', 'breadcrumb', 'selection', 'path', 'sync'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Project files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- The breadcrumb reflects the selected file. It wraps and truncates rather
     than scrolling the page, and aria-live announces the change on selection. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <div class="flex flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-gray-200 px-3 py-2 text-xs dark:border-gray-800" aria-live="polite">
    <span class="truncate text-gray-500">src</span>
    <span class="text-gray-300 dark:text-gray-600" aria-hidden="true">/</span>
    <span class="truncate font-medium text-gray-900 dark:text-gray-100">index.ts</span>
  </div>
  <ul role="tree" aria-label="Project files" class="space-y-0.5 p-2">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
        <span class="truncate font-medium text-gray-900 dark:text-gray-100">src</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem" aria-selected="true"><button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1.5 text-left text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">index.ts</span></button></li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function TreeItem({ node, level, trail, selected, onSelect }) {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const path = trail.concat(node.name);
  const key = path.join('/');

  if (!children) {
    const active = key === selected;
    return (
      <li role="treeitem" aria-selected={active}>
        <button type="button" onClick={() => onSelect(path)} className={active ? 'flex w-full min-w-0 items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1.5 text-left text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500/15 dark:text-blue-300' : 'flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-900'}>
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
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeBreadcrumbSync({ nodes, label = 'Project files' }) {
  const [path, setPath] = useState([]);
  const selected = path.join('/');

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-gray-200 px-3 py-2 text-xs dark:border-gray-800" aria-live="polite">
        {path.length === 0 ? (
          <span className="text-gray-400">Select a file…</span>
        ) : (
          path.map((seg, i) => (
            <span key={seg + i} className="flex min-w-0 items-center gap-1">
              {i > 0 ? <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">/</span> : null}
              <span className={i === path.length - 1 ? 'truncate font-medium text-gray-900 dark:text-gray-100' : 'truncate text-gray-500'}>{seg}</span>
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
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

function TreeItem({ node, level, trail, selected, onSelect }: { node: TreeNode; level: number; trail: string[]; selected: string; onSelect: (path: string[]) => void }): JSX.Element {
  const children = node.children;
  const [open, setOpen] = useState(level < 1);
  const path = trail.concat(node.name);
  const key = path.join('/');

  if (!children) {
    const active = key === selected;
    return (
      <li role="treeitem" aria-selected={active}>
        <button type="button" onClick={() => onSelect(path)} className={active ? 'flex w-full min-w-0 items-center gap-1.5 rounded-md bg-blue-50 px-2 py-1.5 text-left text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-blue-500/15 dark:text-blue-300' : 'flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-gray-300 dark:hover:bg-gray-900'}>
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
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeBreadcrumbSync({ nodes, label = 'Project files' }: FileTreeProps): JSX.Element {
  const [path, setPath] = useState<string[]>([]);
  const selected = path.join('/');

  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 border-b border-gray-200 px-3 py-2 text-xs dark:border-gray-800" aria-live="polite">
        {path.length === 0 ? (
          <span className="text-gray-400">Select a file…</span>
        ) : (
          path.map((seg, i) => (
            <span key={seg + i} className="flex min-w-0 items-center gap-1">
              {i > 0 ? <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">/</span> : null}
              <span className={i === path.length - 1 ? 'truncate font-medium text-gray-900 dark:text-gray-100' : 'truncate text-gray-500'}>{seg}</span>
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
}`,
    },
  },
  {
    slug: 'file-tree-file-size-meta',
    category: 'file-trees',
    tags: ['file-tree', 'metadata', 'file-size', 'bytes', 'recursive'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Project files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- File size sits right-aligned with tabular-nums so the digits line up; the
     label keeps min-w-0 truncate so the meta column never pushes the row wider
     than the panel. Folders show a child count instead of a size. -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Project files" class="space-y-0.5">
    <li role="treeitem" aria-expanded="true">
      <button type="button" class="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400" aria-hidden="true"><path d="M6 4l4 4-4 4z"/></svg>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true"><path d="M1.5 4A1.5 1.5 0 0 1 3 2.5h3L7.5 4H13A1.5 1.5 0 0 1 14.5 5.5v6A1.5 1.5 0 0 1 13 13H3a1.5 1.5 0 0 1-1.5-1.5z"/></svg>
        <span class="truncate font-medium text-gray-900 dark:text-gray-100">public</span>
        <span class="ml-auto shrink-0 pl-2 text-xs tabular-nums text-gray-400 dark:text-gray-500">2 items</span>
      </button>
      <ul role="group" class="ml-3 space-y-0.5 border-l border-gray-200 pl-2 sm:ml-4 dark:border-gray-800">
        <li role="treeitem"><span class="flex min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"><span class="w-3.5 shrink-0"></span><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg><span class="truncate">hero.png</span><span class="ml-auto shrink-0 pl-2 text-xs tabular-nums text-gray-400 dark:text-gray-500">793.0 KB</span></span></li>
      </ul>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function TreeItem({ node, level }) {
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
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeFileSizeMeta({ nodes, label = 'Project files' }) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  /** Bytes, on files only. Folders derive a count from their children instead. */
  size?: number;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function TreeItem({ node, level }: { node: TreeNode; level: number }): JSX.Element {
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
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1.5 text-left hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-gray-900">
        <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeFileSizeMeta({ nodes, label = 'Project files' }: FileTreeProps): JSX.Element {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
  {
    slug: 'file-tree-drag-handle-visual',
    category: 'file-trees',
    tags: ['file-tree', 'drag', 'handle', 'reorder', 'affordance'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    props: [
      { name: 'nodes', type: 'TreeNode[]', required: true, descriptionKey: 'nodes' },
      { name: 'label', type: 'string', default: "'Reorderable files'", descriptionKey: 'label' },
    ],
    code: {
      tailwind: `<!-- Visual affordance only. The grip shows where a drag would start (cursor-grab)
     and reveals on hover/focus; it is aria-hidden because a screen reader must
     not be told about a gesture it cannot perform. Wire real reordering to your
     own DnD layer (dnd-kit, HTML5 drag events, etc.). -->
<nav class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
  <ul role="tree" aria-label="Reorderable files" class="space-y-0.5">
    <li role="treeitem">
      <div class="group flex min-w-0 select-none items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-900">
        <span class="shrink-0 cursor-grab text-gray-300 opacity-0 group-hover:opacity-100 dark:text-gray-600" aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4"><circle cx="6" cy="4" r="1.2"/><circle cx="10" cy="4" r="1.2"/><circle cx="6" cy="8" r="1.2"/><circle cx="10" cy="8" r="1.2"/><circle cx="6" cy="12" r="1.2"/><circle cx="10" cy="12" r="1.2"/></svg></span>
        <svg viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true"><path d="M4 1.5h4.6L13 5.9V14a.5.5 0 0 1-.5.5h-8A.5.5 0 0 1 4 14V2a.5.5 0 0 1 .5-.5z"/></svg>
        <span class="truncate">canvas.json</span>
      </div>
    </li>
  </ul>
</nav>`,
      react: `import { useState } from 'react';

function DragHandle() {
  return (
    <span className="shrink-0 cursor-grab text-gray-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 dark:text-gray-600" aria-hidden="true">
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

function TreeItem({ node, level }) {
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeDragHandleVisual({ nodes, label = 'Reorderable files' }) {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
      typescript: `import { useState } from 'react';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

export interface FileTreeProps {
  nodes: TreeNode[];
  label?: string;
}

// Visual affordance only: aria-hidden so a screen reader is never told about a
// gesture it cannot perform. Wire real reordering to your own DnD layer.
function DragHandle(): JSX.Element {
  return (
    <span className="shrink-0 cursor-grab text-gray-300 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 dark:text-gray-600" aria-hidden="true">
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

function TreeItem({ node, level }: { node: TreeNode; level: number }): JSX.Element {
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
        <button type="button" onClick={() => setOpen((v) => !v)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={open ? 'h-3.5 w-3.5 shrink-0 rotate-90 text-gray-400 transition-transform motion-reduce:transition-none' : 'h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform motion-reduce:transition-none'}>
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

export function FileTreeDragHandleVisual({ nodes, label = 'Reorderable files' }: FileTreeProps): JSX.Element {
  return (
    <nav className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 text-sm text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300">
      <ul role="tree" aria-label={label} className="space-y-0.5">
        {nodes.map((node, i) => (
          <TreeItem key={node.name + i} node={node} level={0} />
        ))}
      </ul>
    </nav>
  );
}`,
    },
  },
];
