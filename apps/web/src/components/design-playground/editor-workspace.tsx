'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent,
} from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { CANVAS_GRID, ZOOM } from '@/config/design-playground';
import {
  DEFAULT_TEXT,
  absolutePosition,
  frameAt,
  topLevelNodes,
} from '@/lib/design-playground/document';
import { nodesInMarquee } from '@/lib/design-playground/grouping';
import type { NodeType, Transform } from '@/lib/design-playground/types';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { useDesignPlaygroundStore } from '@/stores/design-playground-store';
import { EditorStatusBar } from './editor-status-bar';
import { CanvasContextMenu, type ContextMenuState } from './context-menu';
import { TextEditorOverlay, type TextEditTarget } from './canvas/text-editor-overlay';
import type { DraftRect } from './canvas/canvas-stage';

/**
 * Konva touches `window` at import time, so the stage must never be part of the
 * server bundle. Everything above it (viewport, tools, shortcuts) is plain React
 * and renders fine either way.
 */
const CanvasStage = dynamic(() => import('./canvas/canvas-stage').then((m) => m.CanvasStage), {
  ssr: false,
});

/** Tools that create a node by dragging (or clicking, for text). */
const DRAW_TOOLS: Record<string, NodeType> = {
  frame: 'frame',
  rectangle: 'rectangle',
  ellipse: 'ellipse',
  text: 'text',
};

/** Default size for a click (rather than a drag) with a drawing tool. */
const CLICK_SIZE: Record<NodeType, { width: number; height: number }> = {
  frame: { width: 1440, height: 1024 },
  rectangle: { width: 160, height: 120 },
  ellipse: { width: 160, height: 160 },
  text: { width: 240, height: 32 },
  // Placed from the images panel, never drawn with a tool; the size comes from
  // the bitmap's own dimensions.
  image: { width: 320, height: 240 },
  group: { width: 0, height: 0 },
};

/** Below this drag distance a press counts as a click, not a drag-out. */
const DRAG_THRESHOLD = 4;

/**
 * The canvas column: viewport, tools and the Konva stage, plus the status bar.
 *
 * The viewport (pan offset) is local state on purpose - it changes at pointer
 * frequency and no other panel needs it. The zoom LEVEL is shared, because the
 * toolbar and status bar display it.
 */
export function EditorWorkspace() {
  const t = useTranslations('designPlayground');

  const zoom = useDesignPlaygroundStore((s) => s.zoom);
  const setZoom = useDesignPlaygroundStore((s) => s.setZoom);
  const gridVisible = useDesignPlaygroundStore((s) => s.gridVisible);
  const tool = useDesignPlaygroundStore((s) => s.tool);
  const setTool = useDesignPlaygroundStore((s) => s.setTool);

  const doc = useDesignDocumentStore((s) => s.document);
  const pageId = useDesignDocumentStore((s) => s.pageId);
  const selection = useDesignDocumentStore((s) => s.selection);
  const select = useDesignDocumentStore((s) => s.select);
  const createNodeAt = useDesignDocumentStore((s) => s.createNodeAt);
  const patchNode = useDesignDocumentStore((s) => s.patchNode);
  const page = doc.pages.find((p) => p.id === pageId) ?? doc.pages[0];

  const surfaceRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [viewport, setViewport] = useState({ x: 0, y: 0 });
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<DraftRect | null>(null);
  const drawFrom = useRef<{ x: number; y: number } | null>(null);
  // The draft is mirrored in a ref because the pointer-up handler must read the
  // box the user actually dragged: React batches the moves that precede it, so
  // reading state there can commit a rectangle one frame stale.
  const draftRef = useRef<DraftRect | null>(null);
  const panFrom = useRef<{ x: number; y: number; viewport: { x: number; y: number } } | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  // Which node is being typed into, if any. Only the id lives in state - the
  // geometry and typography are read from the document below, so the overlay
  // follows the node if something else moves or restyles it mid-edit.
  const [editing, setEditing] = useState<{ id: string; selectAll: boolean } | null>(null);

  const drawType = DRAW_TOOLS[tool];
  const drawing = drawType !== undefined;

  // Konva needs pixel dimensions, so the stage is sized from the element rather
  // than from CSS.
  useEffect(() => {
    const element = surfaceRef.current;
    if (!element) return;
    const measure = (): void =>
      setSize({ width: element.clientWidth, height: element.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Open the tenant's latest project once, on mount. Falls back to the local
  // buffer when the server is unreachable, so a reload never loses work.
  useEffect(() => {
    void useDesignDocumentStore.getState().open();
  }, []);

  const toCanvas = useCallback(
    (clientX: number, clientY: number) => {
      const rect = surfaceRef.current?.getBoundingClientRect();
      if (!rect) return { x: 0, y: 0 };
      return {
        x: (clientX - rect.left) / zoom - viewport.x,
        y: (clientY - rect.top) / zoom - viewport.y,
      };
    },
    [zoom, viewport],
  );

  /**
   * Frame everything on the page.
   *
   * Zoom is capped at 1 so fitting a small sketch magnifies it to a sane size
   * rather than blowing it up to fill a 4K screen; the margin keeps the artwork
   * off the panel edges.
   */
  const fitToContent = useCallback((): void => {
    if (!page || size.width === 0) return;
    const roots = topLevelNodes(doc, page);
    if (roots.length === 0) return;

    const minX = Math.min(...roots.map((n) => n.transform.x));
    const minY = Math.min(...roots.map((n) => n.transform.y));
    const maxX = Math.max(...roots.map((n) => n.transform.x + n.transform.width));
    const maxY = Math.max(...roots.map((n) => n.transform.y + n.transform.height));
    const width = maxX - minX;
    const height = maxY - minY;
    if (width <= 0 || height <= 0) return;

    const margin = 64;
    const next = Math.min(
      1,
      Math.max(
        ZOOM.min,
        Math.min((size.width - margin) / width, (size.height - margin) / height),
      ),
    );
    setZoom(next);
    setViewport({
      x: -minX + (size.width / next - width) / 2,
      y: -minY + (size.height / next - height) / 2,
    });
  }, [doc, page, size, setZoom]);

  /* ----------------------------------------------------------- text editing */

  /** Start an edit session on `id`, if it is a text node that can be changed. */
  const beginTextEdit = useCallback((id: string, selectAll = false): void => {
    const node = useDesignDocumentStore.getState().document.nodes[id];
    if (!node || node.type !== 'text' || node.locked) return;
    setEditing({ id, selectAll });
  }, []);

  // A node deleted (or undone away) while its editor is open would leave the
  // overlay pointing at nothing.
  useEffect(() => {
    setEditing((current) => (current && !doc.nodes[current.id] ? null : current));
  }, [doc]);

  /**
   * End the session and record the result as ONE command, so undo steps back
   * over the whole edit rather than one keystroke at a time. An edit that
   * changed nothing dispatches nothing - an undo entry that does nothing is
   * worse than no entry at all.
   */
  const commitTextEdit = useCallback(
    (id: string, value: string, height: number): void => {
      setEditing(null);
      const node = useDesignDocumentStore.getState().document.nodes[id];
      if (!node) return;
      const textChanged = value !== (node.text?.text ?? '');
      // Auto-grow: the overlay measures the typed content, so the box tracks
      // what is actually in it. Growing only - shrinking on every edit would
      // undo a height the user deliberately dragged out.
      const grew = height > node.transform.height;
      if (!textChanged && !grew) return;
      patchNode(id, {
        text: { text: value },
        ...(grew ? { transform: { height } } : {}),
      });
    },
    [patchNode],
  );

  const editNode = editing ? doc.nodes[editing.id] : undefined;
  const editTarget: TextEditTarget | null =
    editing && editNode && editNode.type === 'text'
      ? {
          id: editNode.id,
          ...absolutePosition(doc, editNode.id),
          width: editNode.transform.width,
          height: editNode.transform.height,
          rotation: editNode.transform.rotation,
          spec: editNode.text ?? DEFAULT_TEXT,
          color: editNode.style.fill,
          selectAll: editing.selectAll,
        }
      : null;

  /* ------------------------------------------------------------- shortcuts */

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      const target = event.target as HTMLElement | null;
      // Never steal keys from a field: renaming a layer types 'r', it does not
      // arm the rectangle tool.
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (target?.isContentEditable) return;

      const store = useDesignDocumentStore.getState();
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) store.redo();
        else store.undo();
        return;
      }
      if (mod && event.key.toLowerCase() === 'g') {
        event.preventDefault();
        if (event.shiftKey) store.ungroupSelection();
        else store.groupSelection();
        return;
      }
      if (mod && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        store.duplicateSelection();
        return;
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (store.selection.length === 0) return;
        event.preventDefault();
        store.deleteSelection();
        return;
      }
      if (event.key === 'Escape') {
        store.clearSelection();
        setTool('select');
        return;
      }
      if (mod) return;

      // Enter opens the selected text node for typing - the same gesture as a
      // double-click, for people who never leave the keyboard.
      if (event.key === 'Enter') {
        const id = store.selection.length === 1 ? store.selection[0] : undefined;
        if (id && store.document.nodes[id]?.type === 'text') {
          event.preventDefault();
          beginTextEdit(id);
        }
        return;
      }

      // Shift+1 frames the artwork - the shortcut every canvas editor uses.
      if (event.key === '!' || (event.shiftKey && event.key === '1')) {
        event.preventDefault();
        fitToContent();
        return;
      }

      // Nudge the selection with the arrow keys; shift moves by the major grid.
      const nudge: Record<string, [number, number]> = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      const delta = nudge[event.key];
      if (delta && store.selection.length > 0) {
        event.preventDefault();
        const step = event.shiftKey ? CANVAS_GRID.size : 1;
        for (const id of store.selection) {
          const node = store.document.nodes[id];
          if (!node || node.locked) continue;
          store.patchNode(id, {
            transform: {
              x: node.transform.x + delta[0] * step,
              y: node.transform.y + delta[1] * step,
            },
          });
        }
        return;
      }

      const byShortcut: Record<string, string> = {
        v: 'select',
        h: 'hand',
        f: 'frame',
        r: 'rectangle',
        o: 'ellipse',
        t: 'text',
      };
      const next = byShortcut[event.key.toLowerCase()];
      if (next) setTool(next);
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setTool, fitToContent, beginTextEdit]);

  /* -------------------------------------------------------- viewport input */

  const onWheel = (event: WheelEvent<HTMLDivElement>): void => {
    // Ctrl/⌘ + wheel is the platform zoom gesture (and what a trackpad pinch
    // reports); a bare wheel pans, as every canvas editor does.
    if (event.ctrlKey || event.metaKey) {
      const next = Math.min(ZOOM.max, Math.max(ZOOM.min, zoom * Math.exp(-event.deltaY / 300)));
      // Zoom toward the pointer, not the origin, so the thing under the cursor
      // stays put - the difference between usable and infuriating.
      const focus = toCanvas(event.clientX, event.clientY);
      const rect = surfaceRef.current?.getBoundingClientRect();
      if (rect) {
        setViewport({
          x: (event.clientX - rect.left) / next - focus.x,
          y: (event.clientY - rect.top) / next - focus.y,
        });
      }
      setZoom(next);
      return;
    }
    setViewport((current) => ({
      x: current.x - event.deltaX / zoom,
      y: current.y - event.deltaY / zoom,
    }));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.button !== 1 && !(event.button === 0 && tool === 'hand')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    panFrom.current = { x: event.clientX, y: event.clientY, viewport };
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    setPointer(toCanvas(event.clientX, event.clientY));
    const from = panFrom.current;
    if (!from) return;
    setViewport({
      x: from.viewport.x + (event.clientX - from.x) / zoom,
      y: from.viewport.y + (event.clientY - from.y) / zoom,
    });
  };

  const endPan = (): void => {
    panFrom.current = null;
  };

  /* ------------------------------------------------------------- authoring */

  function beginDraw(point: { x: number; y: number }): void {
    if (!drawing) {
      // The select tool drags out a marquee. The band is the same draft rect the
      // drawing tools use, so the preview and the maths stay in one place.
      select([]);
      if (tool !== 'select') return;
      drawFrom.current = point;
      const start = { x: point.x, y: point.y, width: 0, height: 0 };
      draftRef.current = start;
      setDraft(start);
      return;
    }
    drawFrom.current = point;
    const start = { x: point.x, y: point.y, width: 0, height: 0 };
    draftRef.current = start;
    setDraft(start);
  }

  function updateDraw(point: { x: number; y: number }): void {
    const from = drawFrom.current;
    if (!from) return;
    const box = {
      x: Math.min(from.x, point.x),
      y: Math.min(from.y, point.y),
      width: Math.abs(point.x - from.x),
      height: Math.abs(point.y - from.y),
    };
    draftRef.current = box;
    setDraft(box);
  }

  function endDraw(): void {
    const from = drawFrom.current;
    drawFrom.current = null;
    const box = draftRef.current;
    draftRef.current = null;
    setDraft(null);
    if (!from || !page) return;

    if (!drawType) {
      // Marquee: a drag selects what it touched; a click (below threshold) has
      // already cleared the selection in beginDraw.
      if (box && (box.width >= DRAG_THRESHOLD || box.height >= DRAG_THRESHOLD)) {
        select(nodesInMarquee(doc, page.rootId, box));
      }
      return;
    }

    // A click (rather than a drag) drops a default-sized node at that point.
    const isClick =
      !box || box.width < DRAG_THRESHOLD || box.height < DRAG_THRESHOLD;
    const fallback = CLICK_SIZE[drawType];
    const transform: Transform = isClick
      ? { x: Math.round(from.x), y: Math.round(from.y), ...fallback, rotation: 0 }
      : {
          x: Math.round(box.x),
          y: Math.round(box.y),
          width: Math.round(box.width),
          height: Math.round(box.height),
          rotation: 0,
        };

    // A shape drawn over a frame belongs to that frame; a frame always sits at
    // the top level, because nested frames are a Phase 2 concern.
    const parent = drawType === 'frame' ? undefined : (frameAt(doc, page, transform)?.id ?? undefined);
    createNodeAt(drawType, transform, parent);
    // Drawing is one-shot, like Figma: the pointer returns after each shape.
    setTool('select');

    // A new text box goes straight into edit mode with its placeholder selected,
    // so the tool ends where the user expects: with a caret, ready to type.
    if (drawType === 'text') {
      const id = useDesignDocumentStore.getState().selection[0];
      if (id) beginTextEdit(id, true);
    }
  }

  const gridStep = CANVAS_GRID.size * CANVAS_GRID.majorEvery * zoom;
  const hasContent = page ? (doc.nodes[page.rootId]?.children.length ?? 0) > 0 : false;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div
        ref={surfaceRef}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onPointerLeave={() => {
          setPointer(null);
          endPan();
        }}
        onContextMenu={(event) => {
          // Only offer the menu when it has something to act on; an empty-canvas
          // right-click should still give the browser's own menu.
          if (useDesignDocumentStore.getState().selection.length === 0) return;
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY });
        }}
        data-tool={tool}
        className="relative min-h-0 flex-1 overflow-hidden bg-muted/30 data-[tool=hand]:cursor-grab data-[tool=ellipse]:cursor-crosshair data-[tool=frame]:cursor-crosshair data-[tool=rectangle]:cursor-crosshair data-[tool=text]:cursor-text"
      >
        {/* The grid is generated, not an asset: its pitch follows the configured
            grid size and the live zoom, and its colour is the border token, so
            it tracks the theme. Continuous values - a class cannot express it. */}
        {gridVisible && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--border) 1px, transparent 1px)',
              backgroundSize: `${gridStep}px ${gridStep}px`,
              backgroundPosition: `${viewport.x * zoom}px ${viewport.y * zoom}px`,
            }}
          />
        )}

        {page && size.width > 0 && (
          <CanvasStage
            doc={doc}
            page={page}
            size={size}
            viewport={viewport}
            zoom={zoom}
            selection={selection}
            draft={draft}
            drawing={drawing}
            editingId={editing?.id ?? null}
            onSelect={select}
            onNodeDoubleClick={(id) => {
              if (tool === 'select') beginTextEdit(id);
            }}
            onNodeMoved={(id, position) =>
              patchNode(id, {
                transform: { x: Math.round(position.x), y: Math.round(position.y) },
              })
            }
            onNodeTransformed={(id, box) => patchNode(id, { transform: box })}
            onBackgroundPointerDown={beginDraw}
            onPointerMove={updateDraw}
            onPointerUp={endDraw}
          />
        )}

        {editTarget && (
          <TextEditorOverlay
            key={editTarget.id}
            target={editTarget}
            viewport={viewport}
            zoom={zoom}
            onCommit={commitTextEdit}
          />
        )}

        {!hasContent && <EmptyState />}
      </div>

      <CanvasContextMenu state={contextMenu} onClose={() => setContextMenu(null)} />

      <EditorStatusBar pointer={pointer} label={t('status.coordinates')} onFit={fitToContent} />
    </div>
  );
}

/**
 * What the canvas says before the page has anything on it.
 *
 * It points at the Frames tab rather than repeating the preset list: two copies
 * of the same control would drift, and the tab is where the sizes live now that
 * they are reachable at any time - not only while the page is empty.
 */
function EmptyState() {
  const t = useTranslations('designPlayground');
  const setInspectorTab = useDesignPlaygroundStore((s) => s.setInspectorTab);
  const inspectorOpen = useDesignPlaygroundStore((s) => s.inspectorOpen);
  const toggleInspector = useDesignPlaygroundStore((s) => s.toggleInspector);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
      <div className="pointer-events-auto w-full max-w-sm rounded-xl border border-border bg-card/95 p-5 text-center shadow-sm backdrop-blur">
        <h2 className="text-sm font-semibold">{t('canvas.empty.title')}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t('canvas.empty.description')}</p>
        <button
          type="button"
          onClick={() => {
            // Opening the sidebar first would leave the user on whichever tab
            // they last used, so set the tab either way.
            setInspectorTab('frames');
            if (!inspectorOpen) toggleInspector();
          }}
          className="mt-3 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('canvas.empty.cta')}
        </button>
      </div>
    </div>
  );
}
