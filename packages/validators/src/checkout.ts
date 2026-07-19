import { z } from 'zod';
import { emailSchema } from './common';

/**
 * Checkout email capture.
 *
 * The client never sends a price — only the plan id, which the server resolves
 * to a real amount. A price in the request body would be trivially tampered
 * with.
 */
export const checkoutSchema = z.object({
  email: emailSchema,
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
