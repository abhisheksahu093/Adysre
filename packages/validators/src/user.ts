import { z } from 'zod';
import { emailSchema } from './common';

export const createUserSchema = z.object({
  email: emailSchema,
  name: z.string().min(1).max(120),
  roleIds: z.array(z.string().uuid()).default([]),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().nullable().optional(),
  isActive: z.boolean().optional(),
  roleIds: z.array(z.string().uuid()).optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
