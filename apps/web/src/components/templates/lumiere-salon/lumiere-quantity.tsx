'use client';

import { useLumiereSettings } from './lumiere-settings';
import { Minus, Plus } from 'lucide-react';

/**
 * LUMIERE - the quantity stepper.
 *
 * Two buttons and a live figure rather than a number input: a spinner on mobile
 * opens a numeric keypad for a value that is almost always one or two, and a
 * free-text field then needs clamping, parsing and an error state for no gain.
 *
 * The current value is announced through the group's accessible name, so a
 * screen reader hears "Quantity, 2" instead of an unlabelled numeral between two
 * unlabelled buttons.
 */
export function LumiereQuantity({
  value,
  onChange,
  max = 9,
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
}) {
  const { data } = useLumiereSettings();
  const { product } = data.salon;

  return (
    <div
      role="group"
      aria-label={`${product.quantityLabel}, ${value}`}
      className="inline-flex items-center gap-1 rounded-full bg-[var(--lumi-paper-2)] p-1 shadow-[inset_0_0_0_1px_var(--lumi-rule)]"
    >
      <button
        type="button"
        aria-label={product.decrease}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[var(--lumi-paper-3)] disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>

      <span aria-hidden className="lumi-num w-8 text-center text-[15px]">
        {value}
      </span>

      <button
        type="button"
        aria-label={product.increase}
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-[var(--lumi-paper-3)] disabled:opacity-35 disabled:hover:bg-transparent"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
