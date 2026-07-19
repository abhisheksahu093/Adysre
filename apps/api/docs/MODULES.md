# API Modules

The API is a modular monolith (BACKEND_ARCHITECTURE.md). Each module follows
**Controller → Service → Repository**, is tenant-scoped, and enforces RBAC via
`@RequirePermissions(...)`.

## Implemented (reference slices)

- **Health** — liveness + DB probe (`GET /api/v1/health`, public).
- **Auth** — register/login/refresh/logout, JWT + rotating refresh in HTTP-only
  cookies, session table, argon2 hashing. Wires the global guard chain.
- **Users** — list/get/soft-delete, demonstrates RBAC + DTO mapping.

## To scaffold next (same pattern)

| Module        | Key permissions                     | Notes                                  |
| ------------- | ----------------------------------- | -------------------------------------- |
| Organization  | `org:organization:manage`           | Tenant settings, slug, branding        |
| Role          | `org:role:manage`                   | CRUD roles + assign permissions        |
| Permission    | `org:role:manage`                   | Catalog of `module:resource:action`    |
| Dashboard     | `org:dashboard:read`                | Aggregations / metrics                 |
| Notification  | `org:notification:read`             | In-app; emits BullMQ jobs to worker    |
| Audit         | `org:audit:read`                    | Append-only; writes on privileged acts |
| Files         | `org:file:manage`                   | Upload/download, S3-compatible         |
| Settings      | `org:setting:manage`                | Key/value per tenant                   |
| AI            | `org:ai:use`                        | Anthropic-backed assist endpoints      |

### Recipe for a new module

1. `apps/api/src/modules/<name>/` with `*.module.ts`, `*.controller.ts`,
   `*.service.ts`, `*.repository.ts`.
2. Register in `app.module.ts`.
3. Add Zod schemas to `@adysre/validators`, DTOs to `@adysre/types`.
4. Guard every route with `@RequirePermissions('<module>:<resource>:<action>')`.
5. Tenant-scope every query (`tenantScope(tenantId)`); soft-delete only.
6. Write privileged mutations to the Audit log.
7. Add tests. Update this file.
