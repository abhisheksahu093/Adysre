'use client';

/**
 * Live preview for `time-picker-slots-grid`.
 *
 * Mirrors the `typescript` code variant. Fixed sample slots; no `new Date()`.
 * Keep in step with `src/data/components/time-pickers.ts`.
 */
import { useState } from 'react';

interface TimePickerSlotsGridProps {
  slots: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

function to12h(hour24: number, minute: number): string {
  const period = hour24 < 12 ? 'AM' : 'PM';
  const h = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return h + ':' + pad2(minute) + ' ' + period;
}

function formatSlot(hm: string): string {
  const parts = hm.split(':');
  return to12h(Number(parts[0] ?? '0') || 0, Number(parts[1] ?? '0') || 0);
}

function TimePickerSlotsGrid({ slots, value, onChange, label = 'Available times', className = '' }: TimePickerSlotsGridProps) {
  return (
    <fieldset className={'w-full ' + className}>
      <legend className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</legend>
      <div role="radiogroup" className="grid grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] gap-2">
        {slots.map((slot) => {
          const active = slot === value;
          return (
            <button
              key={slot}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(slot)}
              className={
                'rounded-lg border px-2 py-2 text-sm font-medium tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900 ' +
                (active
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600')
              }
            >
              {formatSlot(slot)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const SLOTS: string[] = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '15:30'];

export default function TimePickerSlotsGridPreview() {
  const [value, setValue] = useState<string>('10:00');
  return <TimePickerSlotsGrid slots={SLOTS} value={value} onChange={setValue} className="max-w-md" />;
}
