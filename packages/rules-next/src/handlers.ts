import {
  collectPluginIds,
  createContext,
  evaluateRule,
  missingPlugins,
  parseRule,
  RuleError,
  type Registry,
} from '@adysre/rules-core';
import type { JsonValue, RuleDocument, RuleQuery, StoragePlugin } from '@adysre/rules-types';
import { metaFor, queryFromParams } from './params.ts';
import {
  badRequest,
  forbidden,
  notFound,
  ok,
  serverError,
  unauthenticated,
  type ResponseMeta,
} from './responses.ts';

/**
 * Rules over HTTP.
 *
 * Handlers are `(Request) => Response`, which is all the App Router asks for
 * and all any other Web-standard runtime asks for either. Nothing here imports
 * from Next.
 *
 * The route SHAPE is left to the host on purpose. Next changed `params` from an
 * object to a Promise between 14 and 15, and a package that had hard-coded
 * either would have broken on an upgrade it has no stake in. So a handler takes
 * the parameters already resolved, and `nextRoute` is the two-line adapter for
 * whichever convention the host's version uses.
 */

export type RuleApiAction =
  | { type: 'list' }
  | { type: 'read'; id: string }
  | { type: 'write'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'evaluate' };

export type Authorization =
  { allowed: true; actor?: string } | { allowed: false; status?: 401 | 403; message?: string };

export type Authorize = (
  request: Request,
  action: RuleApiAction,
) => Authorization | Promise<Authorization>;

/**
 * An adapter that can count without paging.
 *
 * Not part of `StoragePlugin`, because a store is not obliged to be able to.
 * The API standard asks for `total` in the pagination meta, and the only two
 * honest ways to produce it are to ask the adapter or to load every row and
 * count them - so an adapter that can, does, and one that cannot omits the
 * field rather than the handler quietly fetching the whole table.
 */
export interface CountableStorage {
  count?: (query?: RuleQuery) => Promise<number>;
}

export interface RuleApiOptions {
  storage: StoragePlugin & CountableStorage;
  /** Needed to refuse a rule this deployment could not run. */
  registry: Registry;
  /**
   * Who may do what.
   *
   * REQUIRED, and not optional with a permissive default. Deny by default is
   * the rule the constitution states, and the way an unauthenticated rules API
   * reaches production is a factory that worked without being told about auth.
   */
  authorize: Authorize;
  /** Where a fault goes. The caller never sees it. */
  onError?: (scope: string, error: unknown) => void;
  /** The clock for an evaluation, when a request does not supply one. */
  now?: () => number;
}

export interface RouteParams {
  id?: string | undefined;
  version?: string | undefined;
}

export type RuleRoute = (request: Request, params?: RouteParams) => Promise<Response>;

export interface RuleApi {
  /** `GET /rules` */
  list: RuleRoute;
  /** `GET /rules/:id` */
  get: RuleRoute;
  /** `POST /rules` - creates or updates, and answers with the stored document. */
  save: RuleRoute;
  /** `DELETE /rules/:id` */
  remove: RuleRoute;
  /** `GET /rules/:id/versions` */
  versions: RuleRoute;
  /** `POST /rules/:id/versions/:version/restore` */
  restore: RuleRoute;
  /** `POST /rules/evaluate` */
  evaluate: RuleRoute;
}

interface EvaluateBody {
  rule?: unknown;
  ruleId?: string;
  data?: JsonValue;
  variables?: Record<string, JsonValue>;
  now?: number;
  trace?: boolean;
  shortCircuit?: boolean;
}

export function createRuleApi(options: RuleApiOptions): RuleApi {
  const { storage, registry, authorize } = options;
  const report = options.onError ?? ((scope, error) => console.error(`[${scope}]`, error));

  /**
   * Run the host's check, and treat a thrown one as a refusal.
   *
   * An authorization callback that threw - a database blip, an expired key -
   * must not fall open. The one failure mode worse than refusing a legitimate
   * request is admitting an illegitimate one.
   */
  const guard = async (
    request: Request,
    action: RuleApiAction,
  ): Promise<{ actor: string | undefined } | Response> => {
    let result: Authorization;
    try {
      result = await authorize(request, action);
    } catch (error) {
      report('rules.authorize', error);
      return forbidden();
    }

    if (!result.allowed) {
      return result.status === 401 ? unauthenticated(result.message) : forbidden(result.message);
    }

    return { actor: result.actor };
  };

  const readBody = async (request: Request): Promise<unknown | Response> => {
    try {
      return (await request.json()) as unknown;
    } catch {
      return badRequest('The body is not valid JSON.');
    }
  };

  /** A `RuleError` is the caller's to fix; anything else is ours to look at. */
  const handleFault = (scope: string, error: unknown): Response => {
    if (error instanceof RuleError) return badRequest(error.message);
    report(scope, error);
    return serverError();
  };

  const requireId = (params: RouteParams | undefined): string | Response =>
    params?.id === undefined || params.id === '' ? badRequest('A rule id is required.') : params.id;

  return {
    list: async (request) => {
      const auth = await guard(request, { type: 'list' });
      if (auth instanceof Response) return auth;

      const { query, page, pageSize, error } = queryFromParams(new URL(request.url).searchParams);
      if (error !== undefined) return badRequest(error);

      try {
        const summaries = await storage.list(query);
        const total = storage.count === undefined ? undefined : await storage.count(query);
        const meta: ResponseMeta =
          total === undefined ? { page, pageSize } : metaFor(page, pageSize, total);

        return ok(summaries, 'OK', meta);
      } catch (error_) {
        return handleFault('rules.list', error_);
      }
    },

    get: async (request, params) => {
      const id = requireId(params);
      if (id instanceof Response) return id;

      const auth = await guard(request, { type: 'read', id });
      if (auth instanceof Response) return auth;

      try {
        const rule = await storage.get(id);
        return rule === null ? notFound('No rule with that id.') : ok(rule);
      } catch (error) {
        return handleFault('rules.get', error);
      }
    },

    // The id comes from the BODY here, not from the route: a save is an upsert
    // of whatever document was sent, and taking the id from the path as well
    // would invite the two to disagree about which rule is being written.
    save: async (request) => {
      const body = await readBody(request);
      if (body instanceof Response) return body;

      // Parsed, never cast. A body is untrusted input, and `parseRule` is the
      // same door an import comes through: it migrates an older document and
      // refuses one written by a newer engine.
      const parsed = parseRule(body);
      if (!parsed.ok) {
        const first = parsed.diagnostics[0];
        return badRequest(first === undefined ? 'That is not a rule.' : first.message);
      }

      const auth = await guard(request, { type: 'write', id: parsed.rule.id });
      if (auth instanceof Response) return auth;

      // A rule naming an operator this deployment does not have is a rule that
      // will error at evaluation. Refusing it here is the difference between a
      // clear message and a mystery at three in the morning.
      const missing = missingPlugins(registry, collectPluginIds(parsed.rule));
      const absent = [...missing.operators, ...missing.functions];
      if (absent.length > 0) {
        return badRequest(`This deployment has no ${absent.join(', ')}.`);
      }

      try {
        const stored = await storage.save(stampActor(parsed.rule, auth.actor));
        return ok(stored, 'Saved.');
      } catch (error) {
        return handleFault('rules.save', error);
      }
    },

    remove: async (request, params) => {
      const id = requireId(params);
      if (id instanceof Response) return id;

      const auth = await guard(request, { type: 'delete', id });
      if (auth instanceof Response) return auth;

      try {
        await storage.remove(id);
        // Idempotent: removing something already gone is a success, so a retry
        // after a lost response does not report a failure that did not happen.
        return ok(null, 'Removed.');
      } catch (error) {
        return handleFault('rules.remove', error);
      }
    },

    versions: async (request, params) => {
      const id = requireId(params);
      if (id instanceof Response) return id;

      const auth = await guard(request, { type: 'read', id });
      if (auth instanceof Response) return auth;

      if (storage.versions === undefined) {
        return ok([], 'This store does not keep versions.');
      }

      try {
        return ok(await storage.versions(id));
      } catch (error) {
        return handleFault('rules.versions', error);
      }
    },

    restore: async (request, params) => {
      const id = requireId(params);
      if (id instanceof Response) return id;

      const version = Number(params?.version);
      if (!Number.isInteger(version) || version < 1) {
        return badRequest('A version number is required.');
      }

      const auth = await guard(request, { type: 'write', id });
      if (auth instanceof Response) return auth;

      if (storage.restore === undefined) {
        return badRequest('This store cannot restore a version.');
      }

      try {
        return ok(await storage.restore(id, version), 'Restored.');
      } catch (error) {
        // A missing version is the caller naming something that is not there,
        // which is a 404 rather than a malformed request.
        if (error instanceof RuleError) return notFound(error.message);
        return handleFault('rules.restore', error);
      }
    },

    evaluate: async (request) => {
      const auth = await guard(request, { type: 'evaluate' });
      if (auth instanceof Response) return auth;

      const body = await readBody(request);
      if (body instanceof Response) return body;
      if (typeof body !== 'object' || body === null) return badRequest('A body is required.');

      const input = body as EvaluateBody;

      let rule: RuleDocument;
      if (input.ruleId !== undefined) {
        try {
          const stored = await storage.get(input.ruleId);
          if (stored === null) return notFound('No rule with that id.');
          rule = stored;
        } catch (error) {
          return handleFault('rules.evaluate.load', error);
        }
      } else {
        const parsed = parseRule(input.rule);
        if (!parsed.ok) {
          const first = parsed.diagnostics[0];
          return badRequest(first === undefined ? 'That is not a rule.' : first.message);
        }
        rule = parsed.rule;
      }

      try {
        const context = createContext(input.data ?? null, {
          ...(input.variables === undefined ? {} : { variables: input.variables }),
          now: input.now ?? options.now?.() ?? Date.now(),
        });

        return ok(
          evaluateRule(registry, rule, context, {
            ...(input.trace === undefined ? {} : { trace: input.trace }),
            ...(input.shortCircuit === undefined ? {} : { shortCircuit: input.shortCircuit }),
          }),
        );
      } catch (error) {
        return handleFault('rules.evaluate', error);
      }
    },
  };
}

/** Record who saved it, when the host's check told us. */
function stampActor(rule: RuleDocument, actor: string | undefined): RuleDocument {
  if (actor === undefined) return rule;
  return { ...rule, metadata: { ...rule.metadata, updatedBy: actor } };
}
