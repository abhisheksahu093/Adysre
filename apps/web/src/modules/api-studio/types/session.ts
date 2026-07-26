/**
 * ADYSRE API Studio - session state: tabs, history, layout and settings.
 *
 * This is the state that belongs to a person at a keyboard rather than to the
 * workspace: which tabs are open, what they have typed but not saved, how the
 * panels are sized. It is persisted locally (and per workspace), which is what
 * makes "remember tabs after refresh", draft recovery and crash recovery the
 * same mechanism rather than three.
 *
 * A tab holds its own `draft`. Saving copies the draft onto the request node
 * and clears `dirty`; nothing else in the app reads a half-typed request, so an
 * unsaved edit can never leak into a collection, an export or another tab.
 */

import type { RequestDefinition } from './http';
import type { HttpMethod } from './http';
import type { Assertion } from './testing';

export interface ApiTab {
  id: string;
  /** The saved request this tab edits, or `null` for a scratch request. */
  nodeId: string | null;
  /** Falls back to the request's URL when the tab is unnamed. */
  title: string;
  draft: RequestDefinition;
  assertions: Assertion[];
  pinned: boolean;
  dirty: boolean;
  /** Id of the last response received in this tab, if any. */
  responseId: string | null;
  createdAt: number;
}

/** A closed tab held for `Reopen closed tab`, newest first. */
export interface ClosedTab {
  tab: ApiTab;
  closedAt: number;
}

/**
 * One history row. History stores a summary plus the full request, so an entry
 * can be restored into a tab; response bodies are stored separately and evicted
 * first, because they are what actually consume space.
 */
export interface HistoryEntry {
  id: string;
  workspaceId: string;
  /** The saved request it came from, when it came from one. */
  nodeId: string | null;
  method: HttpMethod;
  url: string;
  /** `null` when the exchange failed before a response. */
  status: number | null;
  /** Failure code when there was no response. */
  errorCode: string | null;
  durationMs: number;
  responseBytes: number;
  executedAt: number;
  favorite: boolean;
  request: RequestDefinition;
}

export const PANEL_ORIENTATIONS = ['horizontal', 'vertical'] as const;
export type PanelOrientation = (typeof PANEL_ORIENTATIONS)[number];

export const SIDEBAR_PANELS = ['collections', 'history', 'environments'] as const;
export type SidebarPanel = (typeof SIDEBAR_PANELS)[number];

/** Panel geometry. Ratios, not pixels, so a restored layout survives a resize. */
export interface LayoutState {
  sidebarCollapsed: boolean;
  /** Sidebar width in pixels: a rail is fixed furniture, not a ratio. */
  sidebarWidth: number;
  activePanel: SidebarPanel;
  orientation: PanelOrientation;
  /** Share of the workspace given to the request builder, 0.2 to 0.8. */
  requestPaneRatio: number;
}

export const API_STUDIO_THEMES = ['light', 'dark', 'system'] as const;
export type ApiStudioTheme = (typeof API_STUDIO_THEMES)[number];

/** User settings for the module. Transport defaults feed new requests. */
export interface ApiStudioSettings {
  theme: ApiStudioTheme;
  /** Wrap long lines in the request and response editors. */
  wordWrap: boolean;
  fontSize: number;
  /** Pretty-print JSON responses by default. */
  prettyPrintResponses: boolean;
  /** Milliseconds of idle typing before a draft is written to storage. */
  autosaveDebounceMs: number;
  /** How many history rows to keep before evicting the oldest. */
  historyLimit: number;
  /** Send requests through the server runner or a local desktop agent. */
  preferLocalAgent: boolean;
  defaultTimeoutMs: number;
  defaultFollowRedirects: boolean;
  defaultVerifyTls: boolean;
}
