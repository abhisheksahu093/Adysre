'use client';

import { useState } from 'react';
import { PRICING_PLANS, type PricingPlan } from '@/data/pricing';
import { PricingCard } from './pricing-card';
import { CheckoutDialog } from './checkout-dialog';

/**
 * Owns which plan is checking out, so a single dialog serves every card
 * rather than each card mounting its own.
 */
export function PricingGrid() {
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);

  return (
    <>
      {/* 1 / 2 / 4 columns. `items-stretch` keeps every card the same height so
          the CTAs and footers line up across differing feature counts. */}
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PRICING_PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} onCheckout={setCheckoutPlan} />
        ))}
      </div>

      <CheckoutDialog plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} />
    </>
  );
}
