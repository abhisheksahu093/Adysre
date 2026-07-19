import { z } from 'zod';

/** Reusable primitives shared across all validation schemas. */

export const uuidSchema = z.string().uuid();

export const emailSchema = z.string().email().max(320);

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128)
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[0-9]/, 'Must contain a number');

export const slugSchema = z
  .string()
  .min(2)
  .max(63)
  .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only');

/** `?sort=field:asc|desc` */
export const sortSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_]+:(asc|desc)$/)
  .optional();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
