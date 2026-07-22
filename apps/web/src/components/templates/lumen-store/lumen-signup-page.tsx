'use client';

import { LUMEN_SHOP } from '@/data/templates/lumen-store-content';
import { LumenAccountForm } from './lumen-account-form';

/**
 * LUMEN - create an account.
 *
 * The sign-in page's twin: same shared form, three fields instead of two, and a
 * required terms checkbox in place of the forgotten-password link.
 */
export function LumenSignupPage() {
  return <LumenAccountForm copy={LUMEN_SHOP.signup} extra="terms" />;
}
