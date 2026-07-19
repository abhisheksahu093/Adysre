# BOOTSTRAP_PROJECT

## Goal
Bootstrap ADYSRE as an enterprise AI-first Business Operating System.

## Stack
- pnpm + Turborepo
- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- shadcn/ui
- TanStack Query
- Zustand
- React Hook Form + Zod
- NestJS + Prisma
- PostgreSQL + Redis + BullMQ
- Docker + Docker Compose

## Repository
apps/
- web
- api
- worker

packages/
- ui
- database
- sdk
- config
- theme
- validators
- types
- logger

## Frontend
- App Router only
- Server Components first
- Theme (Light/Dark/System)
- Responsive dashboard shell
- Sidebar, Topbar, Command Palette
- next-intl
- Lucide icons

## Backend
Modules:
- Auth
- Organization
- User
- Role
- Permission
- Settings
- Notification
- File
- Audit
- Health

## Deliverable
Project runs with:
pnpm install
pnpm dev
