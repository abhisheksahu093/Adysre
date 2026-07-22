'use client';

import { Minus, Plus } from 'lucide-react';

/**
 * LUMEN - the quantity stepper.
 *
 * Two real `<button>`s around a live value, shared by the product page and every
 * basket line. The buttons carry an aria-label that names the product as well as
 * the direction, because a basket with four steppers otherwise announces
 * "Increase quantity" four times with no way to tell which row is which.
 *
 * The value is a `<span>` with `aria-live="polite"`, not an editable number
 * input: an input invites a keyboard user to type into something that has no
 * commit step, and the count is already reachable by the buttons.
 */
export function LumenQuantity({
  value,
  label,
  itemName,
  decreaseLabel,
  increaseLabel,
  onChange,
  min = 1,
  max = 9,
}: {
  value: number;
  label: string;
  itemName: string;
  decreaseLabel: string;
  increaseLabel: string;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
}) {
  const buttonClass =
    'grid h-9 w-9 place-items-center text-[var(--lum-ink-soft)] transition-colors hover:text-[var(--lum-ink)] disabled:cursor-not-allowed disabled:text-[var(--lum-ink-faint)]';

  return (
    <div className="inline-flex items-center rounded-[4px] border border-[var(--lum-rule)]">
      <button
        type="button"
        aria-label={`${decreaseLabel}: ${itemName}`}
        disabled={value <= min}
        onClick={() => onChange(value - 1)}
        className={buttonClass}
      >
        <Minus className="h-3.5 w-3.5" aria-hidden />
      </button>

      <span
        aria-live="polite"
        aria-label={`${label}: ${itemName}`}
        className="lum-price w-9 text-center text-[15px]"
      >
        {value}
      </span>

      <button
        type="button"
        aria-label={`${increaseLabel}: ${itemName}`}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className={buttonClass}
      >
        <Plus className="h-3.5 w-3.5" aria-hidden />
      </button>
    </div>
  );
}
