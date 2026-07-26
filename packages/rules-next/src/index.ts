/**
 * `@adysre/rules-next` - rules over HTTP.
 *
 * Route handlers and server actions over the storage contract, on the Web
 * standard: `(Request) => Response`, which is all the App Router asks for and
 * all any other standard runtime asks for either. Nothing here imports from
 * Next, so the same handlers run under Hono, Deno, Bun or a Worker - and a
 * change to Next's own helpers cannot break them.
 *
 * Two decisions carry the rest.
 *
 * `authorize` is REQUIRED. Not optional with a permissive default, because the
 * way an unauthenticated rules API reaches production is a factory that worked
 * without being told about auth. A callback that THROWS is a refusal, not a
 * pass: the one failure mode worse than refusing a legitimate request is
 * admitting an illegitimate one.
 *
 * A body is PARSED, never cast. It comes in through `parseRule` - the same door
 * an import uses - so an older document is migrated and one written by a newer
 * engine is refused, and a rule naming an operator this deployment lacks is
 * turned away with a message rather than stored to fail at evaluation.
 */

export * from './handlers.ts';
export * from './next.ts';
export * from './params.ts';
export * from './responses.ts';
