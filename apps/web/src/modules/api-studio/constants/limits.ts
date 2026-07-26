/**
 * ADYSRE API Studio - ceilings, defaults and storage keys.
 *
 * Every bound the module enforces lives here rather than at the site that
 * enforces it, so a limit can be reviewed, tuned and tested in one place, and
 * so the client and the server runner can never disagree about what "too large"
 * means. These are the values that keep one request from taking a worker down.
 */

/** Request timeouts. The ceiling also bounds how long a runner slot is held. */
export const DEFAULT_TIMEOUT_MS = 30_000;
export const MIN_TIMEOUT_MS = 1_000;
export const MAX_TIMEOUT_MS = 300_000;

export const DEFAULT_MAX_REDIRECTS = 10;
export const MAX_REDIRECTS_CEILING = 20;

/** 2 KB, the practical limit every proxy and server agrees on. */
export const MAX_URL_LENGTH = 2_048;

/** 50 MB out, 25 MB back. Anything larger belongs in the file store. */
export const MAX_REQUEST_BODY_BYTES = 50 * 1024 * 1024;
export const MAX_RESPONSE_BYTES = 25 * 1024 * 1024;

/**
 * Response bodies above this are shown as a download and a hex/preview header
 * rather than pushed through the pretty printer, which is what stops a 20 MB
 * JSON blob from freezing the tab.
 */
export const MAX_PRETTY_PRINT_BYTES = 2 * 1024 * 1024;

/** Header hygiene: guards against unbounded header stuffing. */
export const MAX_HEADER_COUNT = 100;
export const MAX_HEADER_VALUE_LENGTH = 8_192;

/** Multipart. Files themselves are bounded by `MAX_REQUEST_BODY_BYTES`. */
export const MAX_FORM_PARTS = 100;

/** Session bounds. */
export const MAX_OPEN_TABS = 30;
export const MAX_CLOSED_TAB_STACK = 10;
export const DEFAULT_HISTORY_LIMIT = 500;
export const MAX_HISTORY_LIMIT = 5_000;

/** Autosave: long enough not to thrash storage, short enough to survive a crash. */
export const AUTOSAVE_DEBOUNCE_MS = 800;
/** Saved versions kept per request for the version history panel. */
export const MAX_REQUEST_VERSIONS = 50;

/**
 * Variable resolution. Templates may reference templates; the depth cap and the
 * cycle check together guarantee resolution terminates.
 */
export const MAX_VARIABLE_DEPTH = 10;

/** Rate limiting for the server runner, per tenant. */
export const RUNNER_RATE_LIMIT = { windowMs: 60_000, maxRequests: 300 } as const;

/** Concurrent in-flight requests one browser session may hold open. */
export const MAX_CONCURRENT_REQUESTS = 6;

/**
 * Local storage keys, versioned so a breaking shape change can be migrated or
 * discarded rather than crashing on someone's stale draft.
 */
export const STORAGE_KEYS = {
  tabs: 'adysre.api-studio.tabs.v1',
  layout: 'adysre.api-studio.layout.v1',
  settings: 'adysre.api-studio.settings.v1',
  history: 'adysre.api-studio.history.v1',
  cookies: 'adysre.api-studio.cookies.v1',
  activeWorkspace: 'adysre.api-studio.workspace.v1',
  offlineQueue: 'adysre.api-studio.offline-queue.v1',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Sibling ordering step. New nodes land on multiples of this, so an insert
 * between two siblings takes the midpoint and rewrites exactly one row.
 * Renumbering only happens when a gap closes completely.
 */
export const POSITION_STEP = 1_000;
