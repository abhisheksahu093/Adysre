'use client';

import { LUMEN_SHOP } from '@/data/templates/lumen-store-content';
import { LumenAccountForm } from './lumen-account-form';

/**
 * LUMEN - sign in.
 *
 * A page composer rather than a page of markup: the account form is shared with
 * "create account", and all this file decides is which copy it is given and that
 * the row under the fields is the forgotten-password link.
 */
export function LumenLoginPage() {
  return <LumenAccountForm copy={LUMEN_SHOP.login} extra="forgot" />;
}
