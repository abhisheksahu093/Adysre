'use client';

import type { ExecutionRequest, ExecutionResult } from '../types';

/**
 * The client half of sending a request.
 *
 * A thin, honest wrapper: it posts a prepared request to the runner and turns
 * every failure - including the ones that never reach the runner, like being
 * offline - into the SAME `ExecutionResult` shape. The response pane therefore
 * has one thing to render rather than a result type and a separate error path,
 * and a network failure looks like what it is (a failed exchange) rather than
 * like a crash.
 *
 * Cancellation is the caller's `AbortSignal`: aborting drops the connection,
 * which the route observes and uses to destroy the outbound socket, so a
 * cancelled request stops costing something on the server too.
 */

const ENDPOINT = '/api/api-studio/execute';

interface Envelope {
  success: boolean;
  code?: string;
  message?: string;
  data?: ExecutionResult;
}

export async function sendRequest(
  request: ExecutionRequest,
  signal?: AbortSignal,
): Promise<ExecutionResult> {
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
      ...(signal ? { signal } : {}),
    });

    const envelope = (await response.json()) as Envelope;

    if (response.ok && envelope.success && envelope.data) return envelope.data;

    return {
      id: request.id,
      ok: false,
      error: {
        code: response.status === 429 ? 'rate_limited' : 'network',
        message: envelope.message ?? `The runner answered ${response.status}.`,
        cause: envelope.code ?? String(response.status),
      },
    };
  } catch (error) {
    const aborted = error instanceof DOMException && error.name === 'AbortError';
    return {
      id: request.id,
      ok: false,
      error: {
        code: aborted ? 'cancelled' : 'network',
        message: aborted ? 'Cancelled.' : 'The runner could not be reached.',
        cause: error instanceof Error ? error.name : null,
      },
    };
  }
}
