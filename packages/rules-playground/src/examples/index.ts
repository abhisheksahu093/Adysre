import { accessControl } from './access-control.ts';
import { discountTier } from './discount-tier.ts';
import { hiddenFault } from './hidden-fault.ts';
import { orderApproval } from './order-approval.ts';
import type { Example } from '../types.ts';

/**
 * Every example, in the order somebody should meet them.
 *
 * Approval first because it is the spec's own, then permission and calculation
 * to show the same constructs doing different work, and the broken one last -
 * it only makes sense once a reader knows what a working rule looks like.
 */
export const EXAMPLES: readonly Example[] = [
  orderApproval,
  accessControl,
  discountTier,
  hiddenFault,
];

export function exampleById(id: string): Example | undefined {
  return EXAMPLES.find((example) => example.id === id);
}

export { accessControl, discountTier, hiddenFault, orderApproval };
