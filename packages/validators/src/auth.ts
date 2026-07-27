import { z } from 'zod';
import { emailSchema, passwordSchema, slugSchema } from './common.ts';

export const loginSchema = z.object({
  email: emailSchema,
  // No policy check on sign-in. The rules in `passwordSchema` apply when a
  // password is CHOSEN; applying them here would reject an older password that
  // predates the policy, and would leak the policy to anyone probing the form.
  password: z.string().min(1),
  /**
   * Which workspace to sign in to.
   *
   * Optional, because users are unique on `(tenantId, email)` rather than on
   * email alone, so one address can hold accounts in several tenants. The
   * common case resolves to exactly one and needs no slug; when it does not,
   * the endpoint answers 409 TENANT_AMBIGUOUS with the candidates and the
   * client re-posts with this field.
   */
  tenantSlug: slugSchema.optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1).max(120),
  organizationName: z.string().min(2).max(120),
  organizationSlug: slugSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).optional(),
});
export type RefreshInput = z.infer<typeof refreshSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Changing a password while signed in.
 *
 * `currentPassword` is required even though the caller already holds a valid
 * session, because the threat here is an unlocked laptop rather than a forged
 * token. Without it, anyone who walks up to an open browser owns the account
 * permanently.
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Your current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'The new password must be different from the current one',
    path: ['newPassword'],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Editing your own profile.
 *
 * Email is deliberately absent. Changing an address needs a verification round
 * trip through `email_verifications`, so accepting the field here and silently
 * ignoring it would be worse than not accepting it: the UI would report success
 * while the address never changed. `.strict()` makes an unexpected key a 400
 * rather than a silent no-op.
 */
export const updateProfileSchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    avatarUrl: z.string().url().max(2048).nullable().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/** OAuth providers the platform is wired for (AUTHENTICATION_RBAC.md). */
export const OAUTH_PROVIDERS = ['google', 'microsoft', 'github'] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
