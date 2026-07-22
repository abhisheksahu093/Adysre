'use client';

import type { TemplateContent } from '@/data/templates/types';
import { VantaFaq } from './vanta-faq';
import { VantaMasthead } from './vanta-masthead';
import { VantaPricing } from './vanta-pricing';

/**
 * VANTA - the pricing page: masthead, the plan ladder and the full fee
 * schedule, closing on the FAQ because the first question after a price is
 * always "and how are you actually paid".
 */
export function VantaPricingPage({ content }: { content: TemplateContent }) {
  return (
    <>
      <VantaMasthead page="pricing" />
      <VantaPricing />
      <VantaFaq content={content} />
    </>
  );
}
