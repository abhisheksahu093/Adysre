# BACKEND_ARCHITECTURE

## Style
Modular Monolith using NestJS.

## Layers
Controller
Service
Repository
Database

## Modules
Auth
Organization
User
Role
Permission
Dashboard
Notification
Audit
Files
Settings
AI

## Database
Prisma + PostgreSQL
Redis cache
BullMQ queues

Base fields:
- id
- tenant_id
- created_at
- updated_at
- created_by
- updated_by
- deleted_at

## API
REST (/api/v1)
GraphQL-ready
Swagger

## Rules
- Thin controllers
- Business logic in services
- Repository owns Prisma access
- RBAC on every endpoint
- Structured logging
