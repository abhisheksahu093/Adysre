import {
  Boxes,
  Frame,
  Image as ImageIcon,
  Layers,
  Files,
  LayoutTemplate,
  Shapes,
  Sparkles,
  MousePointer2,
  Square,
  Circle,
  Type,
  PenLine,
  Hand,
  type LucideIcon,
} from 'lucide-react';

/**
 * Design Playground - editor configuration.
 *
 * The single source of truth for what the editor OFFERS: its tools, its side
 * panels, its frame presets and its zoom range. Components read this and never
 * hardcode a tool, a panel or a size - adding a tool is an entry here, not a
 * change to the toolbar. Labels are translation keys under the
 * `designPlayground` namespace, resolved at render time.
 *
 * See `documents/DESIGN_PLAYGROUND_PRD.md`.
 */

/** A tool the user can arm from the toolbar (or its keyboard shortcut). */
export interface EditorTool {
  /** Key under `designPlayground.tools`. */
  id: string;
  icon: LucideIcon;
  /** Single-key shortcut, matching the PRD's shortcut table. */
  shortcut: string;
  /** False until the tool's engine lands (Phase 1+); shown but inert. */
  ready: boolean;
}

export const EDITOR_TOOLS: EditorTool[] = [
  { id: 'select', icon: MousePointer2, shortcut: 'V', ready: true },
  { id: 'hand', icon: Hand, shortcut: 'H', ready: true },
  { id: 'frame', icon: Frame, shortcut: 'F', ready: true },
  { id: 'rectangle', icon: Square, shortcut: 'R', ready: true },
  { id: 'ellipse', icon: Circle, shortcut: 'O', ready: true },
  { id: 'text', icon: Type, shortcut: 'T', ready: true },
  { id: 'pen', icon: PenLine, shortcut: 'P', ready: false },
];

export type EditorToolId = (typeof EDITOR_TOOLS)[number]['id'];

/** A tab in the left rail. */
export interface EditorPanel {
  /** Key under `designPlayground.panels`. */
  id: string;
  icon: LucideIcon;
  /** False until the panel's engine lands (Phase 1+); shown but inert. */
  ready: boolean;
  /**
   * False keeps the panel in this registry but out of the editor entirely - no
   * rail icon, no body. Use it for a finished panel we are not shipping yet;
   * `ready: false` is the weaker statement ("visible, but coming soon").
   */
  enabled?: boolean;
}

export const EDITOR_PANELS: EditorPanel[] = [
  { id: 'pages', icon: Files, ready: true },
  { id: 'layers', icon: Layers, ready: true },
  { id: 'sections', icon: LayoutTemplate, ready: true },
  { id: 'components', icon: Boxes, ready: true },
  { id: 'assets', icon: Shapes, ready: true },
  { id: 'images', icon: ImageIcon, ready: true },
  // Hidden until AI generation is configured end to end (it needs a server-side
  // ANTHROPIC_API_KEY). Flip to `enabled: true` to bring it back - the panel and
  // its route are complete and untouched.
  { id: 'ai', icon: Sparkles, ready: true, enabled: false },
];

/**
 * The panels the editor actually offers. Everything that renders the rail reads
 * this, so hiding a panel is one flag above rather than an edit in each consumer.
 */
export const AVAILABLE_EDITOR_PANELS: EditorPanel[] = EDITOR_PANELS.filter(
  (panel) => panel.enabled !== false,
);

/**
 * Where the editor's chrome stops floating and starts docking, in CSS pixels.
 *
 * A phone cannot give a 16rem rail panel AND a 16rem inspector a column of their
 * own - that is the whole viewport, with nothing left to draw on. Below these
 * widths the panels open as sheets over the canvas instead, and the toolbar
 * splits its context controls onto a second row.
 *
 * The values are Tailwind's `md` and `lg` on purpose: the components pair a
 * `md:`/`lg:` class with the matching query here, so the CSS and the JS switch
 * at the same pixel. Change one, change the other.
 */
export const EDITOR_LAYOUT = {
  /** The rail's panel docks beside the canvas from here up (Tailwind `md`). */
  panelDock: 768,
  /** The inspector docks beside the canvas from here up (Tailwind `lg`). */
  inspectorDock: 1024,
  /** The toolbar fits on one row from here up (Tailwind `md`). */
  toolbarSingleRow: 768,
} as const;

/** Inspector groups in the right panel, in render order. */
export const INSPECTOR_GROUPS = [
  'transform',
  'layout',
  'style',
  'effects',
  'typography',
  'export',
] as const;

export type InspectorGroupId = (typeof INSPECTOR_GROUPS)[number];

/**
 * Frame presets. Sizes are CSS pixels at 1x - the canvas scales them, so these
 * are the real artboard dimensions a design exports at.
 */
export interface FramePreset {
  /** Key under `designPlayground.frames`. */
  id: string;
  groupId: FramePresetGroupId;
  width: number;
  height: number;
}

export const FRAME_PRESET_GROUPS = ['screens', 'social', 'print'] as const;
export type FramePresetGroupId = (typeof FRAME_PRESET_GROUPS)[number];

export const FRAME_PRESETS: FramePreset[] = [
  { id: 'desktop', groupId: 'screens', width: 1440, height: 1024 },
  { id: 'laptop', groupId: 'screens', width: 1280, height: 832 },
  { id: 'tablet', groupId: 'screens', width: 834, height: 1194 },
  { id: 'mobile', groupId: 'screens', width: 390, height: 844 },
  { id: 'instagram', groupId: 'social', width: 1080, height: 1080 },
  { id: 'facebook', groupId: 'social', width: 1200, height: 630 },
  { id: 'twitter', groupId: 'social', width: 1600, height: 900 },
  { id: 'youtube', groupId: 'social', width: 1280, height: 720 },
  { id: 'presentation', groupId: 'print', width: 1920, height: 1080 },
  { id: 'a4', groupId: 'print', width: 794, height: 1123 },
];

/**
 * Responsive breakpoints a node can be overridden at. `minWidth` is the CSS
 * media-query floor, so these map straight onto the export's breakpoints.
 */
export interface EditorBreakpoint {
  /** Key under `designPlayground.breakpoints`. */
  id: string;
  minWidth: number;
  /** The frame preset opened when the user switches to this breakpoint. */
  presetId: string;
}

export const EDITOR_BREAKPOINTS: EditorBreakpoint[] = [
  { id: 'desktop', minWidth: 1280, presetId: 'desktop' },
  { id: 'laptop', minWidth: 1024, presetId: 'laptop' },
  { id: 'tablet', minWidth: 768, presetId: 'tablet' },
  { id: 'mobile', minWidth: 0, presetId: 'mobile' },
];

export type EditorBreakpointId = (typeof EDITOR_BREAKPOINTS)[number]['id'];

/** Viewport limits and steps, shared by the toolbar, wheel zoom and shortcuts. */
export const ZOOM = {
  min: 0.02,
  max: 64,
  default: 1,
  /** Discrete stops for the zoom menu and the +/- buttons. */
  steps: [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4] as const,
} as const;

/** Canvas grid, in CSS pixels at 100% zoom. */
export const CANVAS_GRID = { size: 8, majorEvery: 8 } as const;
