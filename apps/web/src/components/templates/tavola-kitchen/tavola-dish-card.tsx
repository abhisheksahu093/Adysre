'use client';

import { useState } from 'react';
import { Heart, Plus, Timer } from 'lucide-react';
import type { TavolaCopy, TavolaDish } from '@/data/templates/tavola-kitchen-content';
import { TavolaStars } from './tavola-stars';
import { useTavolaSettings } from './tavola-settings';

/**
 * TAVOLA - one dish.
 *
 * The price is formatted through the settings context on every render rather
 * than stored, so changing currency in the header moves this figure with every
 * other one on the page. The plate is CSS, not a photograph: the template ships
 * with no image assets, so it looks the same in a downloaded zip with no
 * network.
 */
export function TavolaDishCard({
  dish,
  copy,
  onAdd,
  featured = false,
}: {
  dish: TavolaDish;
  copy: TavolaCopy;
  onAdd: (dishId: string) => void;
  /** Lifts one card in a rail, as the reference layout does for the hero dish. */
  featured?: boolean;
}) {
  const { formatPrice } = useTavolaSettings();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);

  return (
    <article
      className={`tv-card relative flex h-full flex-col p-4 transition-transform duration-300 ${
        featured ? 'md:-translate-y-3 md:shadow-[0_30px_70px_-40px_rgb(20_21_43/45%)]' : ''
      }`}
    >
      <button
        type="button"
        aria-pressed={liked}
        aria-label={dish.name}
        onClick={() => setLiked((value) => !value)}
        className={`absolute right-4 top-4 z-10 grid h-8 w-8 place-items-center rounded-full transition-colors ${
          liked ? 'bg-[var(--tv-accent)] text-white' : 'bg-white text-[var(--tv-ink-faint)] shadow-[0_1px_0_var(--tv-rule)]'
        }`}
      >
        <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-current' : ''}`} aria-hidden />
      </button>

      <div className="relative mx-auto aspect-square w-full max-w-[190px]">
        <div className="tv-plate h-full w-full" data-food={dish.palette} aria-hidden />
      </div>

      {dish.badge && (
        <span className="mt-3 self-start rounded-full bg-[var(--tv-accent-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--tv-accent-deep)]">
          {dish.badge}
        </span>
      )}

      <h3 className="mt-3 text-[16px] font-bold">{dish.name}</h3>

      <div className="mt-1.5 flex items-center gap-2">
        <TavolaStars rating={dish.rating} label={`${dish.rating}`} />
        <span className="text-[12px] text-[var(--tv-ink-faint)]">
          {dish.reviews} {copy.common.reviews}
        </span>
      </div>

      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[var(--tv-ink-soft)]">
        {dish.blurb}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-[12px] text-[var(--tv-ink-faint)]">
        <Timer className="h-3.5 w-3.5" aria-hidden />
        {dish.minutes} {copy.common.minutes}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="tv-num text-[19px] font-bold">{formatPrice(dish.price)}</span>
        <button
          type="button"
          onClick={() => {
            onAdd(dish.id);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1200);
          }}
          className={`tv-btn !px-4 !py-2 text-[13px] ${added ? 'tv-btn--ghost' : 'tv-btn--solid'}`}
        >
          {added ? (
            copy.common.added
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {copy.common.addToCart}
            </>
          )}
        </button>
      </div>
    </article>
  );
}
