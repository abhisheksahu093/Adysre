# API Studio

A self-hosted HTTP client inside ADYSRE: collections, environments, a request
runner, a response viewer, imports, exports and code generation. Comparable in
scope to Postman, Insomnia, Bruno and Hoppscotch, with **no paid API, no SaaS
dependency and no cloud service**. Everything runs on the ADYSRE stack the repo
already has.

> Rule 0 still applies: read this before touching anything under
> `apps/web/src/modules/api-studio`, `apps/web/src/app/[locale]/(app)/api-studio`
> or `apps/web/src/app/api/api-studio`.

## Placement

| Thing | Where |
| --- | --- |
| Route | `/api-studio` (sidebar entry `apiStudio` in `config/navigation.ts`) |
| Module code | `apps/web/src/modules/api-studio` |
| Server runner | `apps/web/src/app/api/api-studio/*` (Next route handlers) |
| Tables | `packages/database/prisma/schema.prisma`, `api_studio_*` |

The module follows the pattern Website Intelligence established: a Next.js app
module with its own route handlers and Prisma-backed storage, rather than a
NestJS service. The runner is server-side because it must be: a browser cannot
set `Host`, `Cookie` or `User-Agent`, cannot read timings or redirect chains,
and is blocked by CORS on most targets.

## Layers

Data flows one way, and no layer imports from a layer above it.

```
types/        the domain vocabulary. Depends on nothing but @adysre/types.
constants/    limits, lookup tables, defaults, the keyboard map.
schemas/      Zod parsers. Turn untrusted JSON into the types above.
utils/        pure functions (url merge, variable resolution, formatting).
services/     IO: persistence, the runner client, import/export, codegen.
stores/       Zustand state and synchronous reducers. No IO.
hooks/        React glue between stores, services and components.
components/   presentation. No business logic.
```

Two rules keep the boundary honest: `stores` never perform IO (a service does),
and `components` never reach past a hook into a service.

## Key decisions

**The tree is flat.** Folders and requests are rows carrying `parentId` and a
sparse `position` (see `POSITION_STEP`), not nested JSON. Unlimited nesting
comes for free, a drag-and-drop move updates two fields instead of rewriting a
document, concurrent edits to different branches do not collide, and a huge
collection can be paged in a branch at a time.

**Headers and params are ordered arrays, not maps.** HTTP allows repeated keys,
order is observable, and a disabled row has to survive a save. A
`Record<string, string>` destroys all three.

**Body and auth are discriminated unions.** Each variant carries exactly its own
fields, so no layer has to guess which of thirty nullable columns apply. File,
image, video, PDF and ZIP uploads are not variants: one file is `binary`, files
with fields are `multipart`, and the media kind is the file's MIME type.

**The browser resolves, the runner sends.** Variables, inherited auth and
templates are resolved client-side into an `ExecutionRequest` that is entirely
literal. The runner therefore has no strategies to interpret, which keeps it
small enough to audit, and a future desktop agent can implement the same
contract to reach a developer's `localhost` without the frontend changing.

**Secrets are variables.** A variable flagged `secret` is encrypted at rest,
masked behind a reveal toggle, redacted from history and omitted from exports.
One entity means auth fields, headers and bodies all reference secrets with the
same `{{name}}` syntax they already use.

**Protocols are adapters.** Every request node carries a `protocol` discriminant
and everything protocol-specific sits behind `ProtocolAdapter`. GraphQL,
WebSocket, SSE, gRPC, MQTT and SOAP are reserved ids that register an adapter;
they never reshape collections, tabs or history.

## Variable resolution

Layers, least specific first: `global`, `environment`, `collection`, `folder`,
`request`. Resolution walks the stack backwards and takes the first enabled
definition. Templates may reference templates; `MAX_VARIABLE_DEPTH` plus a cycle
check guarantee termination. Resolution never throws: an unresolved `{{name}}`
is left in place and reported as a `VariableIssue`, so the user sees the request
that would actually be sent.

## Security

| Risk | Control |
| --- | --- |
| SSRF | Host policy applied by the runner **after DNS resolution**, so a hostname cannot resolve its way past the check. Policy is deployment-configured, because reaching `localhost` is the point of a developer tool and a liability everywhere else. |
| Header injection | `wireHeaderSchema` enforces the RFC 9110 token grammar on names and rejects CR, LF and NUL in values. |
| Request smuggling | `RUNNER_MANAGED_HEADERS` are computed by the runner and refused from the client. |
| Resource exhaustion | Every ceiling lives in `constants/limits.ts` and is enforced by `executionRequestSchema` on the server, never trusted from the client. |
| Secret disclosure | Secrets encrypted at rest, masked by default, `api-studio:secret:read` audited on every reveal, redacted from history and exports. |
| Tenant isolation | Every query is partitioned by `tenantId`; the workspace id in a request is checked against the session's tenant before anything else. |
| Privilege | Deny by default. Executing a request is `api-studio:request:execute`, separate from reading it, so a reviewer can read a collection without firing it at production. |
| XSS | HTML and SVG response previews render in a sandboxed iframe with no same-origin access. |

## Phases

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Architecture: types, constants, schemas, permissions | **done** |
| 2 | Database: `api_studio_*` tables, indexes, migration | next |
| 3 | Stores: collections, tabs, environments, history, UI state | |
| 4 | Routes and API contracts under `/api/api-studio` | |
| 5 | Main UI: sidebar, tabs, request builder, response viewer | |
| 6 | Request engine: runner, SSRF policy, timings, cancellation | |
| 7 | Auth strategies, cookies, scripts and assertions | |
| 8 | Import (Postman, OpenAPI, HAR, cURL), export, code generation | |
| 9 | Docs generator, offline queue, search, shortcuts, a11y pass | |

## Phase 1 file map

```
apps/web/src/modules/api-studio/
  types/
    http.ts          methods, key-value entries, body and auth unions, settings
    collection.ts    workspace, collection, flat tree nodes, moves
    environment.ts   variables, scopes, environments, resolution contracts
    execution.ts     the runner contract: wire request, response, timings, errors
    testing.ts       assertions and test-run results
    session.ts       tabs, drafts, history, layout, settings
    protocol.ts      ProtocolAdapter extension point
  constants/
    http.ts          methods without body, common headers, content types, statuses
    limits.ts        every ceiling, storage keys, POSITION_STEP
    defaults.ts      the blank request, default settings and layout (frozen)
    shortcuts.ts     the keyboard map
  schemas/
    common.ts        Parser<T>, ids, names, key-value entries, variables
    request.ts       forgiving: imports and restored drafts
    collection.ts    forgiving: persisted entities
    execution.ts     strict: the runner boundary
  permissions.ts     api-studio:* RBAC vocabulary and role sets
```

Types are hand-written and schemas are annotated `Parser<T>`, which pins each
schema's output to its type. Adding a field to a type without adding it to the
schema fails the build, so the two cannot drift while the domain model stays
readable.
