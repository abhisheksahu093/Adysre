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

## Phases

| Phase | Scope | State |
| --- | --- | --- |
| 1 | Architecture: types, constants, schemas, permissions | **done** |
| 2 | Database: `api_studio_*` tables, indexes, migration | **done** |
| 3 | Stores: collections, tabs, environments, history, UI state | next |
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
