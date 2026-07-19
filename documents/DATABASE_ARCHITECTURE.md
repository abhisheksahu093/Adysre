# DATABASE_ARCHITECTURE

## Goals
- PostgreSQL + Prisma as single source of truth
- Shared-schema multi-tenancy using `tenant_id`
- UUIDv7 primary keys
- Soft deletes (`deleted_at`)
- Audit fields on every table
- Prisma migrations only

## Base Columns
- id
- tenant_id
- created_at
- updated_at
- created_by
- updated_by
- deleted_at

## Conventions
- snake_case DB, camelCase TS
- Foreign keys indexed
- Composite indexes for tenant_id + lookup fields
- No raw SQL unless performance-critical
- Use transactions for multi-step writes

## Initial Models
Organization, User, Role, Permission, UserRole, Session,
AuditLog, Notification, File, Setting

## Backups
- Daily full backup
- PITR enabled
- Quarterly restore test

## Claude Code Rules
- Never bypass Prisma
- Never expose DB entities directly
- Every migration reviewed
