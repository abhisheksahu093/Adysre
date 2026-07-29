# UI_DESIGN_SYSTEM

## Design Philosophy
Premium, minimal, enterprise.

Inspired by:
- Linear
- Stripe
- Notion
- Vercel

## Colors
Primary: #2563EB
Secondary: #6366F1
Accent: #06B6D4
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444

## Typography
Inter Variable
Fluid typography

## Components
Button
Input
Card
Dialog
Drawer
Table
Tabs
Command Palette
Toast
Charts
Calendar

## Feedback

Three surfaces, and they are not interchangeable.

**Toast** (`components/toast/toaster.tsx`, fired through `lib/toast`) reports what
just happened: signed in, account created, a quota running low. Auto-dismisses
after 4s, holds while hovered or focused, and can always be closed by hand. One
viewport for the whole app, mounted in `providers.tsx` and mounted *always*, so
its `role="status"` live region exists before its contents change. Polite, never
`role="alert"`.

**Inline alert** (`components/auth/form-alert.tsx`) is for a failure the user has
to act on. It stays on screen, next to the control that failed. A form error
belongs here and not in a toast, which would take the message away while they
are still fixing the field.

**Paywall** (`components/entitlements/premium-modal.tsx`) is for a refusal, not a
warning: the server said no. The quota toast is what warns you before it does.

**Route progress** (`components/route-progress.tsx`) is a 2px accent bar for
navigations slower than 140ms. Decoration, so `aria-hidden`; the new page
announces itself.

## Layout
- Persistent sidebar
- Sticky topbar
- Breadcrumbs
- Workspace switcher
- Theme switcher

## Rules
- No inline styles
- Token-based colors
- WCAG AA
- Dark mode first
