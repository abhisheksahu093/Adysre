'use client';

import type { ScriptContext, ScriptOutcome } from '../types';
import { SCRIPT_WORKER_SOURCE } from './script-runtime-source';

/**
 * Running a user script in a worker.
 *
 * A worker rather than the main thread for one reason above all: a script with
 * `while (true)` in it must not take the tab with it. The worker can be
 * terminated, so a runaway script costs one timeout and a clear message instead
 * of a forced reload and lost drafts.
 *
 * Every run gets a FRESH worker. Reusing one would let a script leave state
 * behind for the next run (a redefined global, a monkey-patched prototype),
 * which turns "my test passes on the second send" into a mystery.
 */

/** A script gets this long before it is stopped. */
export const SCRIPT_TIMEOUT_MS = 2_000;

function emptyOutcome(error: string | null): ScriptOutcome {
  return { logs: [], tests: [], setVariables: {}, unsetVariables: [], error };
}

/**
 * Execute a script and return what it produced.
 *
 * Never throws and never rejects: a failure is an outcome carrying `error`, so
 * the caller renders it in the tests pane like any other result.
 */
export async function runScriptSandboxed(
  source: string,
  context: ScriptContext,
  timeoutMs = SCRIPT_TIMEOUT_MS,
): Promise<ScriptOutcome> {
  if (source.trim() === '') return emptyOutcome(null);

  if (typeof Worker === 'undefined' || typeof Blob === 'undefined') {
    // Server rendering, or a browser without workers. Refusing beats running
    // the script on the main thread where nothing could stop it.
    return emptyOutcome('Scripts need a browser that supports workers.');
  }

  const blob = new Blob([SCRIPT_WORKER_SOURCE], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  try {
    return await new Promise<ScriptOutcome>((resolve) => {
      const timer = setTimeout(() => {
        worker.terminate();
        resolve(emptyOutcome(`The script did not finish within ${timeoutMs} ms and was stopped.`));
      }, timeoutMs);

      worker.onmessage = (event: MessageEvent<ScriptOutcome>) => {
        clearTimeout(timer);
        resolve(event.data);
      };

      worker.onerror = (event) => {
        clearTimeout(timer);
        resolve(emptyOutcome(event.message || 'The script could not be run.'));
      };

      worker.postMessage({ source, context });
    });
  } finally {
    worker.terminate();
    // The blob would otherwise be held for the life of the document, once per
    // send.
    URL.revokeObjectURL(url);
  }
}
