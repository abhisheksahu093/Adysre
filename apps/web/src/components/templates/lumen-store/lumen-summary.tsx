'use client';

import type { ReactNode } from 'react';
import { LUMEN_SHOP, formatLumenPrice } from '@/data/templates/lumen-store-content';
import type { LumenCart } from './lumen-use-cart';

/**
 * LUMEN - the order summary.
 *
 * The basket and the checkout both need subtotal, shipping and total, and they
 * must agree to the penny; sharing the block is the only way to guarantee that
 * when the shipping rule changes. `children` is the call to action, which is the
 * one thing that differs between the two pages.
 *
 * Marked up as a `<dl>` because it is genuinely a list of labelled values, and a
 * table of two columns would announce far more structure than it earns.
 */
export function LumenSummary({
  cart,
  title,
  children,
}: {
  cart: LumenCart;
  title: string;
  children?: ReactNode;
}) {
  const copy = LUMEN_SHOP.cart;

  return (
    <div className="lum-panel p-6 sm:p-7">
      <h2 className="lum-eyebrow">{title}</h2>

      <dl className="mt-6 space-y-3 border-b border-[var(--lum-rule)] pb-5">
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[15px] text-[var(--lum-ink-soft)]">{copy.subtotal}</dt>
          <dd className="lum-price text-[15px]">{formatLumenPrice(cart.subtotal)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <dt className="text-[15px] text-[var(--lum-ink-soft)]">{copy.shipping}</dt>
          <dd className="lum-price text-[15px]">
            {cart.shipping === 0 ? LUMEN_SHOP.common.free : formatLumenPrice(cart.shipping)}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-baseline justify-between gap-4">
        <p className="text-[15px] font-medium">{copy.total}</p>
        <p className="lum-price text-[22px] font-medium">{formatLumenPrice(cart.total)}</p>
      </div>

      <p className="mt-4 text-[13px] leading-[1.6] text-[var(--lum-ink-faint)]">
        {copy.shippingNote}
      </p>

      {children}
    </div>
  );
}
