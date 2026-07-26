# @adysre/rules-next

Rules over HTTP.

```ts
// lib/rules/api.ts
export const api = createRuleApi({
  storage,
  registry,
  authorize: async (request, action) => {
    const session = await verify(request);
    if (session === null) return { allowed: false, status: 401 };
    return { allowed: can(session, action), actor: session.userId };
  },
});

// app/api/v1/rules/route.ts
export const GET = nextRoute(api.list);
export const POST = nextRoute(api.save);

// app/api/v1/rules/[id]/route.ts
export const GET = nextRoute(api.get);
export const DELETE = nextRoute(api.remove);
```

## It imports nothing from Next

Handlers are `(Request) => Response`, which is all the App Router asks for and
all any other Web-standard runtime asks for either. The same handlers run under
Hono, Deno, Bun or a Cloudflare Worker, and a change to Next's own helpers
cannot break them.

`nextRoute` is the only thing here that knows Next exists, and it still does not
import it. The App Router passes dynamic segments as a plain object in Next 14
and as a **promise** in Next 15; a package that hard-coded either would break on
an upgrade it has no stake in, so handlers take resolved parameters and
`nextRoute` awaits whichever shape arrived.

That is also why the tests are integration tests. A test builds a real
`Request`, reads a real `Response`, and needs no server, no Next and no mocks.

## `authorize` is required

Not optional with a permissive default. Deny by default is the rule, and the way
an unauthenticated rules API reaches production is a factory that worked without
being told about auth.

A callback that **throws** is a refusal, not a pass. A database blip or an
expired key inside the host's check must not fall open: the only failure worse
than refusing a legitimate request is admitting an illegitimate one.

The check is asked about the **specific rule**, not just the route — `{ type:
'write', id }` — so a host can decide per rule, per tenant, per owner, without
this package knowing what any of those are.

## A body is parsed, never cast

Every document arrives through `parseRule`, the same door an import uses. So a
document written by an older engine is migrated on the way in, one written by a
**newer** engine is refused rather than half-understood, and anything that is
not a rule is a 400 with the reason.

A rule naming an operator this deployment does not have is refused too. Storing
it would move the failure from a clear message at save time to an `errored`
verdict at three in the morning.

## The envelope

ADYSRE's, from [`API_STANDARDS.md`](../../documents/API_STANDARDS.md) — a rules
endpoint answering differently from every other endpoint in the platform would
make the client that consumes both carry two readers.

```jsonc
{ "success": true,  "message": "OK", "data": {}, "meta": { "page": 1, "pageSize": 25 } }
{ "success": false, "code": "VALIDATION_ERROR", "message": "…" }
```

Filtering is `?filter[kind]=validation`, `?filter[tags]=a,b` (repeatable or
comma separated — both are what a caller reasonably writes). Paging is `page`
and `pageSize`, capped, so one request cannot ask a store for everything.

A malformed `page` is **ignored** rather than rejected: a stale bookmark with a
typo should show page 1, not an error screen. A `filter[kind]` naming something
that is not a kind **is** rejected, because that is a closed set and answering
with the whole list reads as "the filter does nothing".

`total` appears only when the adapter can count without paging. The other way to
produce it is to load every row, which is not something a handler should do
quietly.

## Server actions

`ruleAction` runs the same handler behind an action, so a route and an action
cannot drift into disagreeing about who may save a rule. The `'use server'`
directive belongs to the file that declares the action, so the host writes it:

```ts
// app/rules/actions.ts
'use server';
export const saveRule = ruleAction(api.save);
```

A failure comes back as a **value**, not an exception. An action's caller is a
component, and a component needs something it can render.

See [`documents/RULES_ENGINE.md`](../../documents/RULES_ENGINE.md).
