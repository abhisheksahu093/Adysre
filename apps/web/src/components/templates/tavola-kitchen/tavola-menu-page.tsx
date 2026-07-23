'use client';

import { useMemo, useState } from 'react';
import { TavolaDishCard } from './tavola-dish-card';
import { TavolaSectionHeading } from './tavola-section-heading';
import { useTavolaSettings } from './tavola-settings';
import type { TavolaCart } from './tavola-use-cart';

/**
 * TAVOLA - the full menu, filtered by category.
 *
 * The filter is keyed by category ID, never by label: labels are localised, so
 * filtering on one would silently stop matching the moment the language
 * changed. This is the contract the parity test protects.
 */
export function TavolaMenuPage({ cart }: { cart: TavolaCart }) {
  const { data } = useTavolaSettings();
  const { copy, categories, dishes } = data;
  const [active, setActive] = useState<string | null>(null);

  const shown = useMemo(
    () => (active === null ? dishes : dishes.filter((dish) => dish.categoryId === active)),
    [active, dishes],
  );

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <TavolaSectionHeading title={copy.menu.title} subtitle={copy.menu.subtitle} align="left" />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {[{ id: null, label: copy.menu.all }, ...categories.map((c) => ({ id: c.id, label: c.label }))].map(
          (option) => {
            const selected = option.id === active;
            return (
              <button
                key={option.id ?? 'all'}
                type="button"
                aria-pressed={selected}
                onClick={() => setActive(option.id)}
                className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  selected
                    ? 'bg-[var(--tv-accent)] text-white'
                    : 'bg-[var(--tv-paper-3)] text-[var(--tv-ink-soft)] hover:text-[var(--tv-ink)]'
                }`}
              >
                {option.label}
              </button>
            );
          },
        )}
        <span className="ml-auto text-[13px] text-[var(--tv-ink-faint)]">
          {copy.menu.count.replace('{count}', String(shown.length))}
        </span>
      </div>

      {shown.length === 0 ? (
        <p className="mt-10 rounded-[var(--tv-radius)] border border-dashed border-[var(--tv-rule-strong)] p-10 text-center text-[14px] text-[var(--tv-ink-soft)]">
          {copy.menu.empty}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((dish) => (
            <TavolaDishCard key={dish.id} dish={dish} copy={copy} onAdd={cart.add} />
          ))}
        </div>
      )}
    </section>
  );
}
