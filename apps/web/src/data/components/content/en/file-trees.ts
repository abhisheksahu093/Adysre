import type { ComponentContentMap } from '../types';

/** English prose for the file-trees category. Keys are component slugs. */
export const fileTreesContent: ComponentContentMap = {
  'file-tree-collapsible-basic': {
    title: 'Collapsible File Tree',
    description:
      'A recursive, data-driven tree of folders and files with expand/collapse toggles.',
    customization:
      'Pass any depth of `nodes`; a node with a `children` array renders as a folder, everything else as a file. Indentation is a nested `pl-2 sm:ml-4` step and every label is `min-w-0 truncate`, so deep nesting narrows the label rather than scrolling the page at 320px.',
    seoTitle: 'Collapsible File Tree - Free React Component',
    seoDescription:
      'A recursive, accessible file tree with expand/collapse folders, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['file tree', 'collapsible tree', 'react tree view', 'folder tree'],
  },
  'file-tree-file-type-icons': {
    title: 'File Tree With Type Icons',
    description:
      'A file tree that tints each file icon by its extension for quick visual scanning.',
    customization:
      'The `extColor` helper maps an extension to a colour class; extend the switch to add languages. The icon stays `aria-hidden`, so colour is a scanning aid layered on top of the filename, never the only signal.',
    seoTitle: 'File Tree With File-Type Icons - Free React Component',
    seoDescription:
      'A recursive file tree with colour-coded file-type icons, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['file type icons', 'file tree icons', 'extension icons', 'tree view'],
  },
  'file-tree-git-status': {
    title: 'Git Status File Tree',
    description:
      'A file tree that flags each change with an M/A/D/U badge and a matching tint.',
    customization:
      'Give a node a `status` of `modified`, `added`, `deleted` or `untracked`. Each is shown as both a coloured letter and an `sr-only` long form, so the state never rides on colour alone - the letter and the announced label carry it for colour-blind and screen-reader users.',
    seoTitle: 'Git Status File Tree - Free React Component',
    seoDescription:
      'A file tree with git status badges (modified, added, deleted, untracked), in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['git status tree', 'source control tree', 'file diff tree', 'git file tree'],
  },
  'file-tree-checkbox-select': {
    title: 'Checkbox Select File Tree',
    description:
      'A multi-select file tree where a folder reflects and toggles all of its files.',
    customization:
      'A folder checkbox is derived, never stored: it reads checked when every leaf under it is selected and indeterminate when only some are, and toggling it flips them all. Because indeterminate has no HTML attribute, it is set on the DOM node through a ref - the one bit of imperative code the pattern needs.',
    seoTitle: 'Checkbox File Tree With Indeterminate State - Free React Component',
    seoDescription:
      'A recursive multi-select file tree with indeterminate parent checkboxes, in Tailwind, React and TypeScript. WCAG AA and MIT licensed.',
    keywords: ['checkbox tree', 'multi-select tree', 'indeterminate checkbox', 'tree select'],
  },
  'file-tree-search-filter': {
    title: 'Searchable File Tree',
    description:
      'A file tree with a live filter that keeps ancestors, auto-expands and highlights matches.',
    customization:
      'Typing filters the tree recursively: a matching file drags its parent folders into view, the whole tree force-expands while a query is active, and the matched substring is wrapped in `<mark>`. An empty result shows a friendly message instead of a blank panel.',
    seoTitle: 'Searchable File Tree With Highlight - Free React Component',
    seoDescription:
      'A file tree with a live search filter, auto-expand and match highlighting, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['searchable tree', 'file tree filter', 'tree search', 'filter file tree'],
  },
  'file-tree-code-project': {
    title: 'Code Project File Tree',
    description:
      'An IDE-style explorer panel with an EXPLORER header and a highlighted active file.',
    customization:
      'Pass the open file as `activeFile` (a full slash path) and it is marked with both a background and `aria-current`, never colour alone. The panel paints its own dark surface, so it reads identically on a light or dark page with no `dark:` variants.',
    seoTitle: 'IDE File Explorer Tree - Free React Component',
    seoDescription:
      'A VS Code-style file explorer panel with an active-file highlight, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['ide file tree', 'code explorer', 'vscode sidebar', 'project tree'],
  },
  'file-tree-context-actions': {
    title: 'File Tree With Row Actions',
    description:
      'A file tree whose rows reveal add, rename and delete buttons on hover and focus.',
    customization:
      'Each row carries an action rail wired to an `onAction(action, path)` callback. The buttons are hidden with opacity rather than display, so they stay in the tab order and reveal on keyboard focus via `group-focus-within` as well as on hover - a hover-only menu is unreachable by keyboard.',
    seoTitle: 'File Tree With Hover Actions - Free React Component',
    seoDescription:
      'A file tree with per-row add, rename and delete actions revealed on hover and keyboard focus, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['file tree actions', 'hover actions tree', 'context menu tree', 'row actions'],
  },
  'file-tree-breadcrumb-sync': {
    title: 'Breadcrumb-Synced File Tree',
    description:
      'A file tree that mirrors the selected file as a wrapping breadcrumb path above it.',
    customization:
      'Selecting a file lifts its full path into a breadcrumb that wraps and truncates rather than scrolling the page, and announces the change via `aria-live`. The selected row is highlighted with `aria-selected`; drive the state upward if you want the breadcrumb to control other panels.',
    seoTitle: 'File Tree With Synced Breadcrumb - Free React Component',
    seoDescription:
      'A file tree that syncs the selected file to a breadcrumb trail, in Tailwind, React and TypeScript. Accessible and MIT licensed.',
    keywords: ['breadcrumb tree', 'file path breadcrumb', 'tree selection', 'synced breadcrumb'],
  },
  'file-tree-file-size-meta': {
    title: 'File Tree With Size Metadata',
    description:
      'A file tree showing a formatted byte size per file and a child count per folder.',
    customization:
      'Give files a `size` in bytes and `formatSize` renders B/KB/MB; folders show their child count instead. The meta column is right-aligned with `tabular-nums` so digits line up, and `shrink-0` keeps it from being squeezed while the truncating label absorbs any overflow.',
    seoTitle: 'File Tree With File Sizes - Free React Component',
    seoDescription:
      'A file tree with formatted file-size metadata and folder item counts, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['file size tree', 'file metadata tree', 'tree with sizes', 'file browser'],
  },
  'file-tree-drag-handle-visual': {
    title: 'File Tree With Drag Handles',
    description:
      'A file tree with a grip handle that appears on hover to signal reorderable rows.',
    customization:
      'The grip reveals on hover and focus, uses `cursor-grab`, and is `aria-hidden` because a screen reader must not be told about a drag it cannot perform. This is the visual affordance only - wire the actual reordering to your own DnD layer (dnd-kit, HTML5 drag events, and so on).',
    seoTitle: 'File Tree With Drag Handles - Free React Component',
    seoDescription:
      'A file tree with hover-revealed drag handles as a reorder affordance, in Tailwind, React and TypeScript. MIT licensed.',
    keywords: ['drag handle tree', 'reorderable tree', 'draggable file tree', 'drag affordance'],
  },
};
