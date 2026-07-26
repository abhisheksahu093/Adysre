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
| Client module | `apps/web/src/modules/api-studio` |
| Server module | `apps/web/src/lib/api-studio` (session, guard, crypto, repositories) |
| Route handlers | `apps/web/src/app/api/api-studio/*` |
| Tables | `packages/database/prisma/schema.prisma`, `api_studio_*` |

The module follows the pattern Website Intelligence established: a Next.js app
module with its own route handlers and Prisma-backed storage, rather than a
NestJS service. The runner is server-side because it must be: a browser cannot
set `Host`, `Cookie` or `User-Agent`, cannot read timings or redirect chains,
and is blocked by CORS on most targets.

## Layers

Data flows one way, and no layer imports from a layer above it.

```
modules/api-studio/          the client module
  types/        the domain vocabulary. Depends on nothing but @adysre/types.
  constants/    limits, lookup tables, defaults, the keyboard map.
  schemas/      Zod parsers. Turn untrusted JSON into the types above.
  utils/        pure functions (ids, tree, url merge, redaction).
  stores/       Zustand state and synchronous reducers. No IO.
  services/     IO: the API client, import/export, codegen.
  hooks/        React glue between stores, services and components.
  components/   presentation. No business logic.

lib/api-studio/              the server module
  session.ts    resolve the verified principal (cookies, env, dev fallback)
  auth-policy.ts  pure: role to module permission, deny by default
  guard.ts      one call at the top of every route handler
  crypto.ts     envelope encryption for secrets and cookie values
  mappers.ts    row to DTO. The only place a Prisma row is seen.
  repositories/ the only place Prisma is touched.
```

Three rules keep the boundaries honest: `stores` never perform IO (a service
does), `components` never reach past a hook into a service, and only
`repositories` touch Prisma.

Pure rules that both sides need live in the client module and are imported by
the server, never copied: the tree helpers and redaction are the examples.

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

## Data model

Ten tables, all prefixed `api_studio_`, all partitioned by `tenant_id`, all
reachable from `Organization` so a tenant purge finds every row.

| Table | Holds | Notable indexes |
| --- | --- | --- |
| `api_studio_workspaces` | the unit users switch between and share | unique `(tenant_id, slug)` |
| `api_studio_workspace_members` | who may use a workspace, and as what role | unique `(workspace_id, user_id)` |
| `api_studio_collections` | collection root: inherited auth, scripts, variables | `(tenant_id, workspace_id, deleted_at, updated_at)` |
| `api_studio_nodes` | the flat tree: folders and requests | `(collection_id, parent_id, position)` |
| `api_studio_environments` | named variable sets (dev, staging, prod) | `(tenant_id, workspace_id, deleted_at)` |
| `api_studio_variables` | every layer of the resolution stack, secrets included | `(tenant_id, workspace_id, scope, deleted_at)` |
| `api_studio_history` | one row per send | `(tenant_id, workspace_id, executed_at)` |
| `api_studio_responses` | the body and headers for a history row | unique `(history_id)` |
| `api_studio_request_versions` | immutable save-point snapshots | unique `(node_id, version)` |
| `api_studio_cookies` | the jar, per workspace | unique `(workspace_id, domain, path, name)` |

Four storage decisions carry the rest:

- **A request definition is JSONB, not a table per header.** The builder loads
  and saves a request whole; a row per header would turn one save into dozens of
  statements and buy no query anyone runs. `method` and `url` are denormalised
  onto the node so the sidebar can draw a 5,000-node tree without reading a
  single JSONB document.
- **Variables are rows, not JSON.** Secrets need their own encrypted column,
  their own audit trail, and one indexed query that loads every layer at once.
- **Secrets are ciphertext or nothing.** A secret row carries `value_cipher`
  only, in the self-describing form `v<n>:<key id>:<base64 iv>:<base64
  ciphertext+tag>` (AES-256-GCM), so keys rotate without a schema change. A
  CHECK constraint makes plaintext on a secret row unstorable.
- **History is hard-deleted.** "Clear history" means gone. The record that has
  to survive is the audit log, which is a different table with a different
  lifetime.

### Constraints Prisma cannot model

Prisma has no notion of CHECK constraints, so they are written once in the
migration, where Prisma will also never diff them away. They are the difference
between "the repository is supposed to keep this true" and "the database will
not store it otherwise":

| Constraint | Prevents |
| --- | --- |
| `nodes_kind_check` | a folder carrying a request definition, or a request without one |
| `variables_scope_owner_check` | a row whose `scope` contradicts its foreign keys |
| `variables_secret_check` | a secret persisted in plaintext |
| `variables_key_check` | a key the `{{name}}` grammar could never reference |
| `history_outcome_check` | a row that is neither a response nor a failure |
| `cookies_path_check` | a `SameSite=None` cookie without `Secure` |
| `workspace_members_role_check`, `responses_encoding_check`, `cookies_same_site_check`, `nodes_method_check` | string columns drifting outside their declared sets |

Partial unique indexes are deliberately absent: Prisma models indexes, so one
added by hand would be dropped by the next `migrate dev`. The two rules that
would have used them (one default environment per workspace, unique variable key
per layer) are enforced in the repository instead.

## State

Six Zustand stores, split by lifetime rather than by screen, so a keystroke in
the URL bar cannot re-render the sidebar.

| Store | Owns |
| --- | --- |
| `use-workspace-store` | workspaces, environments, globals, the outer two variable layers |
| `use-collections-store` | collections, the flat node map, selection, expansion, search |
| `use-tabs-store` | open tabs, their drafts, dirty flags, pins, the closed-tab stack |
| `use-execution-store` | per-tab send status, response, error, progress, abort handle |
| `use-history-store` | history rows, filters, favourite-aware eviction |
| `use-settings-store` | settings and layout, both persisted, both clamped on the way in |

Three rules hold across all of them:

- **No store performs IO.** Services do, and hand results in. A store that could
  fetch would be a store nobody can test without a network.
- **No store reads another store.** State spanning two of them is composed in a
  hook. The full variable stack is the example: the workspace store supplies the
  global and environment layers, the collection, folder and request layers come
  from the nodes being edited, and the hook stitches them.
- **There is no auth store.** The session is the platform's; a module-level copy
  would be a second source of truth for who you are.

Two behaviours worth knowing because the UI depends on them. Derived trees are
memoised on the identity of the `nodes` map, which reducers replace immutably,
so an unchanged map returns the previously built tree. And the URL and the
params table are kept in step inside `updateDraft`: editing the address rebuilds
the table, editing the table rebuilds the address, and disabled rows survive
both because they were never in the URL to begin with.

## API

All under `/api/api-studio`, all answering the standard envelope
(`{ success, message, data, meta }` / `{ success, code, message }`).

| Method | Path | Permission |
| --- | --- | --- |
| GET / POST | `/workspaces` | `workspace:read` / `workspace:manage` |
| GET / PATCH / DELETE | `/workspaces/{id}` | `workspace:read` / `workspace:manage` |
| POST | `/execute` | `request:execute` |
| GET / POST | `/collections?workspaceId=` | `collection:read` / `collection:create` |
| GET / PATCH / DELETE | `/collections/{id}` | `collection:read` / `update` / `delete` |
| GET / POST | `/nodes?collectionId=` | `request:read` / `request:create` |
| GET / PATCH / DELETE | `/nodes/{id}` | `request:read` / `update` / `delete` |
| POST | `/nodes/{id}/move` | `request:update` |
| POST | `/nodes/{id}/duplicate` | `request:create` |
| GET / POST | `/environments?workspaceId=` | `environment:read` / `environment:manage` |
| GET / PATCH / DELETE | `/environments/{id}` | `environment:read` / `environment:manage` |
| GET / POST / DELETE | `/history` | `history:read` / `request:execute` / `history:delete` |
| PATCH | `/history/{id}` | `history:read` |

Every handler runs the same three steps in the same order: authenticate, check
the permission, then scope every query by `session.tenantId`. The tenant is
never a parameter, so no request shape can point at another tenant's rows, and a
row that belongs to someone else answers 404 rather than 403 (telling a caller
"this exists but is not yours" is a way to enumerate ids).

**Layers.** Server-side code lives in `apps/web/src/lib/api-studio` (session,
guard, crypto, mappers, repositories), following the convention Website
Intelligence and Design Playground already set; `apps/web/src/modules/api-studio`
stays the client-side module. Only repositories touch Prisma, and nothing
outside `mappers.ts` sees a Prisma row.

**Shared, not copied.** Three things were promoted rather than duplicated for
this module: token verification (`lib/auth/access-token`, now used by Website
Intelligence too), the response envelope (`lib/api/response`), and the
permission manifest (`@adysre/types`, which the database seed also reads so the
strings it inserts and the strings the module checks cannot drift).

**Structural rules run once.** Move and duplicate use the same pure tree helpers
as the client store, so the server cannot accept a drop the UI would have
refused, or order a node differently than the UI would have drawn it.

**Secrets.** Reads mask secret variables; `?reveal=1` needs
`api-studio:secret:read` and is audited. A secret submitted with an empty value
keeps its existing ciphertext, which is what lets a UI that only ever saw a
masked field save without wiping the credential. If no encryption key is
configured, a secret is refused (400) rather than stored in the clear.

## The runner

`POST /api/api-studio/execute` is the one endpoint that opens an outbound
connection on a user's behalf, so it has the most between the caller and the
socket: a verified session holding `request:execute`, a per-tenant rate limit,
the strict `executionRequestSchema`, and the host policy applied to the
**resolved address** of every hop.

Built on `node:http`/`node:https` rather than `fetch`, for three things fetch
cannot give an API client:

- **Real timings.** DNS, TCP and TLS are socket events. A response viewer that
  invented those numbers would be lying, so anything unmeasurable stays `null`.
- **Address pinning.** The policy is decided on a resolved IP and the connection
  is made to that IP with the hostname carried in `Host` and TLS `servername`.
  A name therefore cannot resolve to something allowed for the check and
  something private for the connection (DNS rebinding).
- **Per-request TLS.** "Ignore certificate errors" is a real need on a staging
  box with a self-signed cert, and must be per request rather than a
  process-wide flag that would silently weaken every other call.

Redirects are followed manually, so each hop is re-checked against the policy,
recorded for the user, stripped of `Authorization` and `Cookie` when the host
changes, and turned from POST into GET on 303 (and on 301/302, as every client
does). Bodies stream through a size cap and stop being read at the ceiling
rather than being buffered and discarded. Responses that are not valid UTF-8
come back base64.

The answer is always 200 with a result envelope, even when the exchange failed:
"the connection was refused" is a fact about the target, not a failure of this
endpoint, and it belongs in the response pane rather than an error toast. Only
auth, rate limiting and validation - failures about the CALL - answer non-200.

**Not yet sendable, by name rather than silently:** digest, OAuth 2, JWT and AWS
signature auth (each needs a round trip or a signing step), and binary and
multipart bodies (each needs the file store). Both produce a typed refusal
(`unsupported_auth`, `unsupported_body`) so nothing is ever sent
unauthenticated or missing the file the user attached.

## Configuration

| Variable | Effect |
| --- | --- |
| `JWT_ACCESS_SECRET` | Verifies the platform access token. Required in production; its absence there throws rather than waving requests through. |
| `API_STUDIO_SECRET_KEY` | Base64 32-byte key for secret variables and cookie values (`openssl rand -base64 32`). Without it, storing a secret is refused rather than done in plaintext. |
| `API_STUDIO_SECRET_KEYS_PREVIOUS` | Retired keys, comma separated, kept readable during a rotation. |
| `API_STUDIO_STRICT_AUTH` | `true` disables the development session fallback, to rehearse production behaviour locally or in CI. |
| `API_STUDIO_ALLOW_PRIVATE_HOSTS` | Opts a deployment into reaching loopback and private ranges. Defaults to on outside production and off in it. Cloud metadata and link-local are refused under every setting. |

Outside production and without a token, a development session is resolved
against the seeded `demo` tenant. It differs from the Website Intelligence
fallback in one way that matters: API Studio writes rows with a tenant foreign
key, so the dev session carries the seeded tenant's real UUID. With no seeded
database there is no honest tenant to attribute writes to, and the routes say so
(503) rather than inventing one.

## Phases

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Architecture: types, constants, schemas, permissions | **done** |
| 2 | Database: `api_studio_*` tables, indexes, migration | **done** |
| 3 | Stores: collections, tabs, environments, history, UI state | **done** |
| 4 | Routes and API contracts under `/api/api-studio` | **done** |
| 5 | Request engine: runner, SSRF policy, timings, cancellation | **done** |
| 6 | Main UI: sidebar, tabs, request builder, response viewer | next |
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
