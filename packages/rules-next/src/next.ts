import type { RouteParams, RuleRoute } from './handlers.ts';

/**
 * The only thing in this package that knows Next.js exists, and it does not
 * import it.
 *
 * The App Router hands a route handler a second argument holding the dynamic
 * segments - as a plain object in Next 14, and as a PROMISE in Next 15. A
 * package that hard-coded either would break on an upgrade it has no stake in,
 * so the handlers take resolved parameters and this awaits whichever shape
 * arrived.
 *
 * @example
 * // app/api/v1/rules/[id]/route.ts
 * export const GET = nextRoute(api.get);
 * export const DELETE = nextRoute(api.remove);
 */
export interface RouteContext {
  params?: RouteParams | Promise<RouteParams>;
}

export function nextRoute(
  handler: RuleRoute,
): (request: Request, context?: RouteContext) => Promise<Response> {
  return async (request, context) => {
    // `await` on a plain object returns the object, so both conventions land
    // here without this having to know which one it was given.
    const params = context?.params === undefined ? {} : await context.params;
    return handler(request, params);
  };
}

/**
 * Server actions over the same handlers.
 *
 * A server action is an async function the client calls directly, so what it
 * needs is a `Request` it does not have. Building one keeps a single
 * implementation behind both doors: an action and a route cannot drift into
 * disagreeing about who may save a rule, because they run the same check.
 *
 * The host re-exports these from its own `'use server'` file. The directive is
 * a property of the file that declares the action, so it cannot live here.
 *
 * @example
 * // app/rules/actions.ts
 * 'use server';
 * export const saveRule = ruleAction(api.save);
 */
export function ruleAction<T>(
  handler: RuleRoute,
  options: { url?: string; method?: string } = {},
): (body: T, params?: RouteParams) => Promise<unknown> {
  return async (body, params) => {
    const request = new Request(options.url ?? 'http://server.local/rules', {
      method: options.method ?? 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body ?? null),
    });

    const response = await handler(request, params);
    // The envelope is returned as-is rather than unwrapped or thrown on: an
    // action's caller is a component, and a component needs the failure as a
    // value it can render, not as an exception that unmounts it.
    return (await response.json()) as unknown;
  };
}
