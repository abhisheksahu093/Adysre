'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { LUMEN_SHOP, formatLumenPrice, lumenHref } from '@/data/templates/lumen-store-content';
import { LumenField } from './lumen-field';
import { LumenProductVisual } from './lumen-product-visual';
import { LumenSectionHeading } from './lumen-section-heading';
import { LumenSummary } from './lumen-summary';
import type { LumenCart } from './lumen-use-cart';

/**
 * LUMEN - checkout.
 *
 * THE PAYMENT BLOCK IS DELIBERATELY INERT AND MUST STAY THAT WAY.
 *
 * This is a design template, not a shop. A checkout page that looks real is the
 * one page in a template set that can do actual harm, so three things are true
 * here and none of them are cosmetic:
 *
 *   1. Every payment input is `disabled`, so it cannot receive a keystroke.
 *   2. No payment field carries a `cc-*` autocomplete token - they are all
 *      `autocomplete="off"`, so no browser or password manager will ever offer a
 *      stored card to this form.
 *   3. A notice sits directly above the block, in the UI rather than in a
 *      comment, saying that nothing is collected and nothing is processed.
 *
 * Submitting calls `preventDefault` and swaps in a confirmation panel. There is
 * no endpoint, no fetch and no state left anywhere afterwards. Anyone turning
 * this into a real store starts by deleting this block and integrating a payment
 * provider's own hosted fields, which is the only correct way to take a card.
 */
export function LumenCheckoutPage({ cart }: { cart: LumenCart }) {
  const copy = LUMEN_SHOP.checkout;
  const [placed, setPlaced] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPlaced(true);
  };

  if (placed) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center sm:px-10 sm:py-32">
        <div aria-live="polite">
          <CheckCircle2 className="mx-auto h-9 w-9 text-[var(--lum-accent-deep)]" aria-hidden />
          <h1 className="mt-6 text-[34px] font-medium leading-[1.15] tracking-[-0.02em]">
            {copy.confirmedTitle}
          </h1>
          <p className="lum-label mt-4">{copy.orderReference}</p>
          <p className="mx-auto mt-6 max-w-md text-[16px] leading-[1.8] text-[var(--lum-ink-soft)]">
            {copy.confirmedBody}
          </p>
        </div>
        <a href={lumenHref('shop')} className="lum-btn lum-btn--outline mt-9">
          {LUMEN_SHOP.common.continueShopping}
        </a>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
      <LumenSectionHeading eyebrow={copy.eyebrow} title={copy.title} as="h1" />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <form onSubmit={onSubmit} noValidate={false}>
          <fieldset className="border-0 p-0">
            <legend className="lum-eyebrow">{copy.contactTitle}</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {copy.contactFields.map((field) => (
                <LumenField key={field.id} field={field} />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-12 border-0 p-0">
            <legend className="lum-eyebrow">{copy.shippingTitle}</legend>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {copy.shippingFields.map((field) => (
                <LumenField key={field.id} field={field} />
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-12 border-0 p-0">
            <legend className="lum-eyebrow">{copy.paymentTitle}</legend>

            <p className="lum-notice mt-5 flex gap-3 p-4 text-[14px] leading-[1.7]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--lum-accent-deep)]" aria-hidden />
              <span>{copy.paymentNotice}</span>
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {copy.paymentFields.map((field) => (
                <LumenField key={field.id} field={field} disabled required={false} />
              ))}
            </div>
          </fieldset>

          <button type="submit" className="lum-btn lum-btn--solid mt-10 w-full sm:w-auto">
            {copy.place}
          </button>
        </form>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <LumenSummary cart={cart} title={copy.summaryTitle} />

          <ul aria-label={copy.summaryTitle} className="mt-6 space-y-4">
            {cart.entries.map((entry) => (
              <li key={entry.key} className="grid grid-cols-[56px_1fr] items-center gap-4">
                <LumenProductVisual art={entry.art} aspect="aspect-square" label={entry.name} />
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[14px]">
                    {entry.name} × {entry.quantity}
                  </span>
                  <span className="lum-price text-[14px] text-[var(--lum-ink-soft)]">
                    {formatLumenPrice(entry.lineTotal)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
