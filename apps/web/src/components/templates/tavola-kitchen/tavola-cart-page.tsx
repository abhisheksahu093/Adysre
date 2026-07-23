'use client';

import { Minus, Plus, Trash2 } from 'lucide-react';
import { tavolaHref } from '@/data/templates/tavola-kitchen-content';
import { TavolaSectionHeading } from './tavola-section-heading';
import { useTavolaSettings } from './tavola-settings';
import type { TavolaCart } from './tavola-use-cart';

/** Free delivery above this figure, in the base currency. */
const FREE_DELIVERY_OVER = 40;
const DELIVERY_FEE = 3.5;

/**
 * TAVOLA - the basket.
 *
 * Lines store an ID and a quantity, so the name shown here comes from the
 * ACTIVE locale bundle and the money through `formatPrice`. Switching language
 * or currency re-renders the whole basket rather than leaving it in whatever
 * state it was filled in.
 */
export function TavolaCartPage({ cart }: { cart: TavolaCart }) {
  const { data, formatPrice } = useTavolaSettings();
  const { copy, dishes } = data;

  const lines = cart.lines
    .map((line) => {
      const dish = dishes.find((entry) => entry.id === line.dishId);
      return dish ? { ...line, dish } : null;
    })
    .filter((line): line is NonNullable<typeof line> => line !== null);

  const subtotal = lines.reduce((total, line) => total + line.dish.price * line.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;

  return (
    <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8">
      <TavolaSectionHeading title={copy.cart.title} align="left" />

      {lines.length === 0 ? (
        <div className="mt-10 rounded-[var(--tv-radius-lg)] border border-dashed border-[var(--tv-rule-strong)] p-12 text-center">
          <p className="text-[15px] text-[var(--tv-ink-soft)]">{copy.cart.empty}</p>
          <a href={tavolaHref('menu')} className="tv-btn tv-btn--solid mt-5">
            {copy.cart.emptyCta}
          </a>
        </div>
      ) : (
        <>
          <ul className="mt-8 divide-y divide-[var(--tv-rule)]">
            {lines.map((line) => (
              <li key={line.dishId} className="flex items-center gap-4 py-4">
                <span aria-hidden className="tv-plate h-16 w-16 shrink-0" data-food={line.dish.palette} />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-[15px] font-bold">{line.dish.name}</h2>
                  <p className="tv-num mt-0.5 text-[13px] text-[var(--tv-ink-soft)]">
                    {formatPrice(line.dish.price)}
                  </p>
                </div>

                <div
                  role="group"
                  aria-label={copy.cart.quantity}
                  className="flex items-center gap-1 rounded-full bg-[var(--tv-paper-3)] p-1"
                >
                  <button
                    type="button"
                    aria-label={`${copy.cart.quantity} −`}
                    onClick={() => cart.setQuantity(line.dishId, line.quantity - 1)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-white text-[var(--tv-ink-soft)] transition-colors hover:text-[var(--tv-ink)]"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <span className="tv-num w-7 text-center text-[14px] font-bold">{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`${copy.cart.quantity} +`}
                    onClick={() => cart.setQuantity(line.dishId, line.quantity + 1)}
                    className="grid h-7 w-7 place-items-center rounded-full bg-white text-[var(--tv-ink-soft)] transition-colors hover:text-[var(--tv-ink)]"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>

                <span className="tv-num hidden w-24 text-right text-[15px] font-bold sm:block">
                  {formatPrice(line.dish.price * line.quantity)}
                </span>

                <button
                  type="button"
                  aria-label={`${copy.cart.remove} ${line.dish.name}`}
                  onClick={() => cart.remove(line.dishId)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--tv-ink-faint)] transition-colors hover:bg-[var(--tv-accent-soft)] hover:text-[var(--tv-accent-deep)]"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <dl className="tv-card mt-8 space-y-3 p-6">
            <div className="flex items-center justify-between text-[14px]">
              <dt className="text-[var(--tv-ink-soft)]">{copy.cart.subtotal}</dt>
              <dd className="tv-num font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <dt className="text-[var(--tv-ink-soft)]">{copy.cart.delivery}</dt>
              <dd className="tv-num font-semibold">
                {delivery === 0 ? copy.cart.deliveryFree : formatPrice(delivery)}
              </dd>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--tv-rule)] pt-3 text-[17px]">
              <dt className="font-bold">{copy.cart.total}</dt>
              <dd className="tv-num font-extrabold">{formatPrice(subtotal + delivery)}</dd>
            </div>
          </dl>

          <a href={tavolaHref('contact')} className="tv-btn tv-btn--solid mt-6 w-full">
            {copy.cart.checkout}
          </a>
          <p className="mt-3 text-center text-[12px] text-[var(--tv-ink-faint)]">{copy.cart.note}</p>
        </>
      )}
    </section>
  );
}
