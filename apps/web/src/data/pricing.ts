/**
 * Pricing plans and FAQ.
 *
 * ─── Adjusting this ─────────────────────────────────────────────────────────
 * Everything here is structure, never copy: `*Key` fields are translation keys
 * resolved against `messages/<locale>.json` under the `pricing` namespace, so
 * changing wording is a catalogue edit and never touches a component.
 *
 * To change a price, edit `price` / `originalPrice` below - they're plain
 * numbers, formatted per locale at render (digit grouping differs by language).
 * Set `originalPrice` to undefined to hide the strikethrough.
 *
 * To add a plan: append to PRICING_PLANS and add `plans.<id>.*` keys to all
 * four catalogues. The grid lays itself out from the array length.
 *
 * NOTE: these figures are placeholders pending real pricing.
 */

export interface PricingPlan {
  id: string;
  /** Rendered in the accent style and given the "Most popular" badge. */
  highlighted?: boolean;
  /**
   * Subscription cadence. Omit for a one-time purchase - it decides whether
   * checkout promises a renewal or a single payment, so it must be right.
   */
  billingInterval?: 'year';
  /**
   * Plans that aren't bought: the CTA navigates here instead of opening
   * checkout. Only the free tier uses this.
   */
  href?: string;
  /** Amount in USD. 0 renders as the free tier. */
  price: number;
  /** Shown struck through beside the price. Omit for no discount. */
  originalPrice?: number;
  /** Keys under `pricing.features.*`. */
  featureKeys: string[];
  /** Keys under `pricing.features.*`, shown below a `+` divider. */
  inheritsKeys?: string[];
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    price: 0,
    originalPrice: 0,
    href: '/prompt-library',
    featureKeys: ['freePrompts', 'copyPaste', 'allCategories', 'fourModels', 'noCard'],
  },
  {
    id: 'annual',
    price: 39,
    originalPrice: 59,
    billingInterval: 'year',
    featureKeys: [
      'allPrompts',
      'allCategories',
      'yearUpdates',
      'fourModels',
      'promptEditor',
      'emailSupport',
      'copyPaste',
      'cancelAnytime',
    ],
  },
  {
    id: 'lifetime',
    highlighted: true,
    price: 79,
    originalPrice: 129,
    featureKeys: [
      'allPrompts',
      'lifetimeUpdates',
      'futureModules',
      'earlyAccess',
      'prioritySupport',
      'promptEditor',
      'copyPaste',
    ],
    inheritsKeys: ['everythingAnnual'],
  },
  {
    id: 'team',
    price: 249,
    originalPrice: 399,
    featureKeys: [
      'tenSeats',
      'allPrompts',
      'lifetimeUpdates',
      'futureModules',
      'sharedWorkspace',
      'rolesPermissions',
      'prioritySupport',
    ],
    inheritsKeys: ['everythingAnnual', 'everythingLifetime'],
  },
];

/** Keys under `pricing.faq.items.*`; order is display order. */
export const FAQ_KEYS = [
  'lifetimeIncludes',
  'purchaseFlow',
  'freeVsPremium',
  'models',
  'refunds',
  'help',
] as const;

/** True when the plan is bought - i.e. its CTA opens checkout. */
export function isPurchasable(plan: PricingPlan): boolean {
  return plan.href === undefined && plan.price > 0;
}
