/**
 * ADYSRE API Studio - state.
 *
 * Six stores, split by lifetime rather than by screen: what the workspace is,
 * what the tree holds, what is open, what is in flight, what was sent, and what
 * the user prefers. A component subscribes to the one it needs, so a keystroke
 * in the URL bar cannot re-render the sidebar.
 *
 * Two rules hold across all of them. No store performs IO (services do, and
 * hand results in). And no store reads another store: state that spans two of
 * them is composed in a hook, which keeps each one testable on its own.
 *
 * There is deliberately no auth store: the session is the platform's, and a
 * module-level copy of it would be a second source of truth for who you are.
 */

export { useCollectionsStore } from './use-collections-store';
export { useExecutionStore, type ExecutionEntry, type ExecutionStatus } from './use-execution-store';
export { useHistoryStore, type HistoryFilters } from './use-history-store';
export { useLayoutStore, useSettingsStore } from './use-settings-store';
export { useTabsStore } from './use-tabs-store';
export { useWorkspaceStore, type LoadStatus } from './use-workspace-store';
