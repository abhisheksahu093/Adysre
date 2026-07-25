/**
 * ADYSRE Image & Utility Tools - domain types.
 *
 * Everything runs in the browser: files are read into memory, processed on a
 * canvas (or a bundled WASM engine, per tool) and never leave ADYSRE. A tool is
 * declared once in the registry; the shared workspace renders any tool from
 * that declaration.
 */

export type ToolStatus = 'ready' | 'soon';

/** An output artifact a tool produces for one input. */
export interface ToolResult {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  /** Filename (with the correct extension) for download. */
  filename: string;
  /** Optional text payload (OCR, QR/barcode readers) shown instead of an image. */
  text?: string;
  /** Optional MIME of the result, when it differs from the source. */
  mime?: string;
}

export type ItemStatus = 'idle' | 'queued' | 'processing' | 'done' | 'error' | 'canceled';

/** One uploaded file and its processing state. */
export interface MediaItem {
  id: string;
  file: File;
  name: string;
  /** Object URL of the ORIGINAL, for the "before" preview. */
  srcUrl: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  status: ItemStatus;
  progress: number;
  /** Applied rotation in degrees (0/90/180/270), part of the edit history. */
  rotation: number;
  /** Rotation history for undo/redo, and the pointer into it. */
  history: number[];
  historyIndex: number;
  result?: ToolResult;
  error?: string;
}

/** The context a tool's process function receives. */
export interface ProcessContext {
  item: MediaItem;
  settings: Record<string, unknown>;
  /** Report 0..1 progress for this item. */
  onProgress: (fraction: number) => void;
  /** Rejects/short-circuits when the run was canceled. */
  signal: AbortSignal;
}

/** A registered tool. `process` is pure w.r.t. the item; the workspace owns state. */
export interface ToolDefinition {
  id: string;
  /** Key under `aiTools.tools.<id>` for label + description. */
  status: ToolStatus;
  /** Lucide icon name resolved by the registry. */
  icon: string;
  /** Accepted MIME types (input). */
  accept: string[];
  /** Default settings for this tool. */
  defaultSettings: Record<string, unknown>;
  /** Runs one item to a result. Client-side only. */
  process?: (ctx: ProcessContext) => Promise<ToolResult>;
  /** Tool-specific settings panel component id (resolved by the workspace). */
  settingsPanel?: string;
  /** True when the tool returns text (readers/OCR) rather than an image. */
  textOutput?: boolean;
}

export const IMAGE_ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'image/bmp'];

/** Props every tool settings panel receives. */
export interface PanelProps {
  settings: Record<string, unknown>;
  onChange: (patch: Record<string, unknown>) => void;
  selected: MediaItem | null;
}
