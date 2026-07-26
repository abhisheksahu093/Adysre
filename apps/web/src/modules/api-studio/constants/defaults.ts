/**
 * ADYSRE API Studio - the shape of everything new.
 *
 * A new tab, an imported request with fields missing and a request restored
 * from an old draft all start from the same constants, so "what does a request
 * look like before anyone touches it" has exactly one answer. Each export is
 * frozen: these are shared references, and a caller that mutated one would be
 * editing the default for every future request in the session.
 */

import type {
  ApiStudioSettings,
  AuthConfig,
  LayoutState,
  RequestBody,
  RequestDefinition,
  RequestScripts,
  RequestSettings,
  RetryPolicy,
} from '../types';
import {
  AUTOSAVE_DEBOUNCE_MS,
  DEFAULT_HISTORY_LIMIT,
  DEFAULT_MAX_REDIRECTS,
  DEFAULT_TIMEOUT_MS,
  MAX_RESPONSE_BYTES,
} from './limits';

/** Retries off by default: repeating a POST nobody asked to repeat is a bug. */
export const DEFAULT_RETRY_POLICY: RetryPolicy = Object.freeze({
  attempts: 0,
  backoffMs: 500,
  retryOnStatus: [] as number[],
  retryOnNetworkError: false,
});

export const DEFAULT_REQUEST_SETTINGS: RequestSettings = Object.freeze({
  timeoutMs: DEFAULT_TIMEOUT_MS,
  followRedirects: true,
  maxRedirects: DEFAULT_MAX_REDIRECTS,
  verifyTls: true,
  encodeUrl: true,
  sendCookies: true,
  storeCookies: true,
  decompress: true,
  retry: DEFAULT_RETRY_POLICY,
});

export const EMPTY_SCRIPTS: RequestScripts = Object.freeze({ preRequest: '', test: '' });

export const NO_BODY: RequestBody = Object.freeze({ type: 'none' });

/** New requests inherit auth, so a collection's credentials just work. */
export const INHERITED_AUTH: AuthConfig = Object.freeze({ type: 'inherit' });

/**
 * A blank request. `Object.freeze` is shallow, so callers clone the arrays
 * (`structuredClone`) rather than pushing into these.
 */
export const EMPTY_REQUEST: RequestDefinition = Object.freeze({
  protocol: 'http',
  method: 'GET',
  url: '',
  params: [],
  pathVariables: [],
  headers: [],
  body: NO_BODY,
  auth: INHERITED_AUTH,
  scripts: EMPTY_SCRIPTS,
  settings: DEFAULT_REQUEST_SETTINGS,
  variables: [],
  description: '',
  tags: [],
});

export const DEFAULT_LAYOUT: LayoutState = Object.freeze({
  sidebarCollapsed: false,
  sidebarWidth: 288,
  activePanel: 'collections',
  orientation: 'horizontal',
  requestPaneRatio: 0.5,
});

export const DEFAULT_SETTINGS: ApiStudioSettings = Object.freeze({
  theme: 'system',
  wordWrap: false,
  fontSize: 13,
  prettyPrintResponses: true,
  autosaveDebounceMs: AUTOSAVE_DEBOUNCE_MS,
  historyLimit: DEFAULT_HISTORY_LIMIT,
  preferLocalAgent: false,
  defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
  defaultFollowRedirects: true,
  defaultVerifyTls: true,
});

/** Runner defaults applied to a wire request that omits them. */
export const DEFAULT_WIRE_SETTINGS = Object.freeze({
  timeoutMs: DEFAULT_TIMEOUT_MS,
  followRedirects: true,
  maxRedirects: DEFAULT_MAX_REDIRECTS,
  verifyTls: true,
  decompress: true,
  sendCookies: true,
  storeCookies: true,
  maxResponseBytes: MAX_RESPONSE_BYTES,
});
