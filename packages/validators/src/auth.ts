import { z } from 'zod';
import { emailSchema, passwordSchema, slugSchema } from './common';

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
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

/** OAuth providers the platform is wired for (AUTHENTICATION_RBAC.md). */
export const OAUTH_PROVIDERS = ['google', 'microsoft', 'github'] as const;
export type OAuthProvider = (typeof OAUTH_PROVIDERS)[number];
