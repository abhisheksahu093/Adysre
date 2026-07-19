import { z } from 'zod';
import { slugSchema } from './common';

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugSchema,
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
