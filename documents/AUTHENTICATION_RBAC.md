# AUTHENTICATION_RBAC

## Authentication
- JWT access token
- Refresh token rotation
- HTTP-only cookies
- OAuth ready: Google, Microsoft, GitHub
- Passkeys roadmap

## Authorization
RBAC + ABAC

Roles:
- Owner
- Admin
- Manager
- Member
- Custom

Permission format:
module:resource:action
Example: crm:lead:read

## Guards
- AuthGuard
- TenantGuard
- PermissionGuard

## Claude Rules
- Check tenant before permissions
- Deny by default
- Audit privileged actions
