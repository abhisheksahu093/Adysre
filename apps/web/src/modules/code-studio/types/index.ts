/**
 * ADYSRE Code Studio - domain types.
 *
 * A project is a flat map of files keyed by their forward-slash path (folders
 * are implied by the path, e.g. `components/Button.tsx`). Keeping files flat
 * makes the compiler, explorer tree and persistence layer trivially agree on
 * identity, and the tree is derived on render rather than stored.
 */

export const LANGUAGES = [
  'html',
  'css',
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'vue',
  'json',
  'plaintext',
] as const;

export type Language = (typeof LANGUAGES)[number];

export interface ProjectFile {
  /** Stable id, independent of the path so a rename keeps tabs and models. */
  id: string;
  /** Forward-slash path, unique within the project, e.g. `src/App.tsx`. */
  path: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  files: ProjectFile[];
  /** Path of the file the preview treats as its script entry, if fixed. */
  entry?: string;
  createdAt: number;
  updatedAt: number;
}

export type EditorTheme = 'dark' | 'light' | 'system';

export interface StudioSettings {
  theme: EditorTheme;
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  autosave: boolean;
}

export const DEFAULT_SETTINGS: StudioSettings = {
  theme: 'system',
  fontSize: 13,
  tabSize: 2,
  wordWrap: false,
  minimap: true,
  autosave: true,
};

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error' | 'table' | 'debug';

export interface ConsoleEntry {
  id: string;
  level: ConsoleLevel;
  /** Already-stringified argument parts, ready to render. */
  parts: string[];
  timestamp: number;
}

export interface PreviewDiagnostic {
  message: string;
  /** File path the error was attributed to, when known. */
  file?: string;
  line?: number;
  column?: number;
}

export type PreviewDevice = 'desktop' | 'laptop' | 'tablet' | 'mobile';

export interface PreviewViewport {
  id: PreviewDevice;
  /** Width in CSS px; `null` means fluid (fill the pane). */
  width: number | null;
  height: number | null;
}

export const PREVIEW_VIEWPORTS: PreviewViewport[] = [
  { id: 'desktop', width: null, height: null },
  { id: 'laptop', width: 1280, height: 800 },
  { id: 'tablet', width: 834, height: 1112 },
  { id: 'mobile', width: 390, height: 844 },
];
