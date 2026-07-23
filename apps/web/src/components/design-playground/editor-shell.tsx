'use client';

import { EditorToolbar } from './editor-toolbar';
import { EditorRail } from './editor-rail';
import { EditorWorkspace } from './editor-workspace';
import { EditorInspector } from './editor-inspector';

/**
 * Design Playground - the editor shell.
 *
 * Composition only: toolbar on top, rail and inspector either side, canvas in
 * the middle, status bar under it. Every piece owns its own state, so the shell
 * never becomes the place where features get bolted on.
 *
 * The shell is deliberately the whole viewport (see the `(editor)` route
 * group): an editor competes with the app chrome for space, so it replaces it.
 *
 * The body row is `relative` because below `EDITOR_LAYOUT`'s dock widths the
 * rail panel and the inspector stop taking columns and float over the canvas
 * instead - they position against this row, so a sheet spans the canvas exactly
 * and never the toolbar or the status bar.
 *
 * Spec: `documents/DESIGN_PLAYGROUND_PRD.md`.
 */
export function EditorShell() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <EditorToolbar />
      <div className="relative flex min-h-0 flex-1">
        <EditorRail />
        <EditorWorkspace />
        <EditorInspector />
      </div>
    </div>
  );
}
