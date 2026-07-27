import {
  FolderTree,
  History,
  KeyRound,
  ServerCog,
  SquareCheckBig,
  Variable,
  type LucideIcon,
} from 'lucide-react';
import { AUTH_TYPES, BODY_TYPES, HTTP_METHODS, type HttpMethod } from '@/modules/api-studio/types/http';
import { ASSERTION_OPERATORS } from '@/modules/api-studio/types/testing';
import type { Assertion } from '@/modules/api-studio/types/testing';
import type { ExecutionResponse } from '@/modules/api-studio/types/execution';

/**
 * API Studio, as the marketing page describes it.
 *
 * STRUCTURE ONLY, like `data/landing.ts` and `data/website-intelligence.ts`:
 * ids that resolve to translation keys, icons, and the fixture the home-page
 * preview renders. No copy, no colours.
 *
 * The figures are COUNTED FROM THE MODULE rather than typed here, so the page
 * cannot advertise an auth scheme or a body type the studio does not implement -
 * add one to `types/http.ts` and the home page says so on the next build. Same
 * rule the library counts and the rules engine already follow (Rule 6).
 */

export const API_STUDIO_ROUTE = '/api-studio';

/**
 * The auth schemes a request can actually carry.
 *
 * `inherit` and `none` are answers to "which credential?", not credentials, so
 * counting them would inflate the figure by two.
 */
export const AUTH_SCHEMES = AUTH_TYPES.filter((type) => type !== 'inherit' && type !== 'none');

export interface ApiStudioStat {
  /** Key under `landing.apiStudio.stats.<id>`. */
  id: string;
  value: number;
}

export const API_STUDIO_STATS: readonly ApiStudioStat[] = [
  { id: 'methods', value: HTTP_METHODS.length },
  { id: 'auth', value: AUTH_SCHEMES.length },
  { id: 'bodies', value: BODY_TYPES.length },
  { id: 'assertions', value: ASSERTION_OPERATORS.length },
];

export interface ApiStudioCapability {
  /** Key under `landing.apiStudio.capabilities.<id>`. */
  id: string;
  icon: LucideIcon;
}

export const API_STUDIO_CAPABILITIES: readonly ApiStudioCapability[] = [
  { id: 'collections', icon: FolderTree },
  { id: 'environments', icon: Variable },
  { id: 'auth', icon: KeyRound },
  { id: 'history', icon: History },
  { id: 'tests', icon: SquareCheckBig },
  { id: 'selfHosted', icon: ServerCog },
];

/* ─── The preview fixture ──────────────────────────────────────────────────── */

/**
 * One request in the preview's collection rail.
 *
 * Method rather than a colour: the pill takes its tone from the module's own
 * `METHOD_TONES`, so a preview request is painted by the same rule as a real
 * one.
 */
export interface PreviewNode {
  id: string;
  method: HttpMethod;
  /** Request names are the user's own words in the real studio; sample data here. */
  name: string;
}

/** A URL split so the template variable can be styled apart from the path. */
export interface UrlSegment {
  text: string;
  /** True for a `{{variable}}` the environment resolves at send time. */
  variable?: boolean;
}

const RESPONSE_BODY = `{
  "id": "ord_7Kd91",
  "status": "confirmed",
  "total": 148.5,
  "currency": "EUR",
  "items": [
    { "sku": "ADY-2410", "quantity": 2 }
  ],
  "createdAt": "2026-07-27T09:14:02.881Z"
}`;

const REQUEST_BODY = `{
  "customerId": "{{customerId}}",
  "items": [
    { "sku": "ADY-2410", "quantity": 2 }
  ],
  "currency": "EUR"
}`;

/**
 * The response the preview shows.
 *
 * A full `ExecutionResponse`, not a loose object, because the assertions under
 * it are evaluated by the studio's OWN engine at render time. A fixture that
 * only looked like a response would need a second, hand-written set of results
 * beside it - which is exactly how a preview starts lying.
 */
export const PREVIEW_RESPONSE: ExecutionResponse = {
  status: 201,
  statusText: 'Created',
  httpVersion: 'HTTP/2',
  headers: [
    { name: 'content-type', value: 'application/json; charset=utf-8' },
    { name: 'x-request-id', value: 'req_9f2c41' },
    { name: 'cache-control', value: 'no-store' },
  ],
  cookies: [],
  bodyEncoding: 'utf8',
  body: RESPONSE_BODY,
  truncated: false,
  size: { headers: 214, body: 198, total: 412 },
  requestSize: { headers: 186, body: 121, total: 307 },
  timings: { dns: 4, tcp: 11, tls: 21, firstByte: 78, download: 14, total: 128 },
  redirects: [],
  insecure: false,
};

/** The checks the preview runs against {@link PREVIEW_RESPONSE}. */
export const PREVIEW_ASSERTIONS: readonly Assertion[] = [
  {
    id: 'as_1',
    enabled: true,
    target: 'status',
    path: '',
    operator: 'equals',
    expected: '201',
    label: '',
  },
  {
    id: 'as_2',
    enabled: true,
    target: 'responseTime',
    path: '',
    operator: 'lessThan',
    expected: '500',
    label: '',
  },
  {
    id: 'as_3',
    enabled: true,
    target: 'jsonPath',
    path: '$.status',
    operator: 'equals',
    expected: 'confirmed',
    label: '',
  },
];

export const API_STUDIO_PREVIEW = {
  /** The collection rail: one folder's worth of requests. */
  collection: 'Orders API',
  nodes: [
    { id: 'rq_1', method: 'GET', name: 'List orders' },
    { id: 'rq_2', method: 'POST', name: 'Create order' },
    { id: 'rq_3', method: 'PATCH', name: 'Update order' },
    { id: 'rq_4', method: 'DELETE', name: 'Cancel order' },
  ] as readonly PreviewNode[],
  /** The open tab, matching `nodes[1]`. */
  activeId: 'rq_2',
  environment: 'Production',
  request: {
    method: 'POST' as HttpMethod,
    url: [{ text: '{{baseUrl}}', variable: true }, { text: '/v1/orders' }] as readonly UrlSegment[],
    body: REQUEST_BODY,
    /** Row counts on the builder tabs, so the preview reads as a real request. */
    params: 2,
    headers: 3,
  },
} as const;
