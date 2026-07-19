import { api } from './api-client';

/**
 * Checkout - the single seam between the pricing UI and a payment backend.
 *
 * ─── STATUS: NOT CONNECTED ──────────────────────────────────────────────────
 * `POST /checkout/session` does not exist yet. Until it does, `startCheckout`
 * rejects and the dialog surfaces an error - it never pretends to have taken a
 * payment or saved an address.
 *
 * To turn this on, the API needs to:
 *   1. Validate the email and the plan id server-side (never trust the client
 *      for price - read it from the plan record, not the request body).
 *   2. Persist the email as a lead / pending account.
 *   3. Create the provider's checkout session for that plan.
 *   4. Return `{ url }` for the hosted payment page.
 *   5. Handle the provider's webhook to actually grant access on payment -
 *      the redirect back is NOT proof of payment and must never grant it.
 *
 * The client only ever sends `planId`; the price shown is display-only.
 */

export interface CheckoutRequest {
  /** Plan id from PRICING_PLANS - the server resolves the real price from it. */
  planId: string;
  email: string;
}

export interface CheckoutSession {
  /** Provider-hosted payment page to redirect to. */
  url: string;
}

export function startCheckout(input: CheckoutRequest): Promise<CheckoutSession> {
  return api.post<CheckoutSession>('/checkout/session', input);
}
