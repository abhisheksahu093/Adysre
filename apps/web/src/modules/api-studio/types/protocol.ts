/**
 * ADYSRE API Studio - protocol extension point.
 *
 * HTTP is the only protocol Phase 1 models, but the roadmap (GraphQL, WebSocket,
 * SSE, gRPC, MQTT, SOAP) has to land without reshaping collections, tabs or
 * history. So every request node carries a `protocol` discriminant from day one
 * and everything protocol-specific goes behind {@link ProtocolAdapter}: adding a
 * protocol means registering an adapter, never editing the store or the tree.
 *
 * The adapter is deliberately split in two halves that run in different places:
 * `normalize` is pure and runs in the browser (turning a saved definition plus
 * resolved variables into a wire request), `execute` runs on the server (or a
 * local agent) where sockets, TLS and cookies actually live.
 */

export const PROTOCOLS = [
  'http',
  'graphql',
  'websocket',
  'sse',
  'grpc',
  'mqtt',
  'soap',
] as const;

export type Protocol = (typeof PROTOCOLS)[number];

/** Protocols the module can execute today. The rest are reserved ids. */
export const SUPPORTED_PROTOCOLS: readonly Protocol[] = ['http'];

/**
 * Where a request is executed. The browser cannot issue most requests itself
 * (CORS strips headers, forbids cookies and hides timings), so `server` is the
 * default: the app posts a normalized request to its own route handler, which
 * performs the call. `desktop` is the reserved id for the optional local agent
 * that reaches a developer's `localhost` when the server is remote.
 */
export const EXECUTION_AGENTS = ['server', 'browser', 'desktop'] as const;
export type ExecutionAgent = (typeof EXECUTION_AGENTS)[number];

/**
 * Contract every protocol implementation satisfies.
 *
 * @typeParam TDefinition - the saved, template-bearing request definition.
 * @typeParam TRequest - the normalized wire request handed to the runner.
 * @typeParam TResult - the runner's result envelope.
 */
export interface ProtocolAdapter<TDefinition, TRequest, TResult> {
  readonly protocol: Protocol;
  /** Translation key for the adapter's display name, under `apiStudio.protocols`. */
  readonly labelKey: string;
  /** True when this adapter owns the given definition. */
  supports(definition: TDefinition): boolean;
  /**
   * Pure: resolve templates and produce the request the runner will send.
   * Never performs IO, so it is safe to call on every keystroke for previews.
   */
  normalize(definition: TDefinition): TRequest;
  /** Perform the call. Implemented server-side; `signal` carries cancellation. */
  execute(request: TRequest, signal: AbortSignal): Promise<TResult>;
}

/**
 * Adapter lookup. Partial by design: unregistered protocols are "not built yet"
 * rather than a compile error, which is what lets the roadmap land in slices.
 */
export type ProtocolRegistry<TDefinition, TRequest, TResult> = Partial<
  Record<Protocol, ProtocolAdapter<TDefinition, TRequest, TResult>>
>;
