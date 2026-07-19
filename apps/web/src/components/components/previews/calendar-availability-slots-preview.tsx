'use client';

/**
 * Live preview for `calendar-availability-slots`. Mirrors the `typescript` variant and renders a
 * fixed July 2026 so the stage is deterministic. Keep in step with
 * `src/data/components/calendar.ts`.
 */
interface Slot {
  time: string;
  booked?: boolean;
}

interface CalendarAvailabilitySlotsProps {
  heading?: string;
  subheading?: string;
  slots?: Slot[];
  selected?: string;
  onSelect?: (time: string) => void;
  className?: string;
}

const DEFAULT_SLOTS: Slot[] = [
  { time: '9:00 AM' }, { time: '9:30 AM' }, { time: '10:00 AM', booked: true },
  { time: '10:30 AM' }, { time: '11:00 AM' }, { time: '1:00 PM', booked: true },
  { time: '1:30 PM' }, { time: '2:00 PM' }, { time: '3:00 PM' }, { time: '4:00 PM' },
];

function CalendarAvailabilitySlots({
  heading = 'Tuesday, July 21',
  subheading = 'Select a 30-minute slot',
  slots = DEFAULT_SLOTS,
  selected = '10:30 AM',
  onSelect,
  className = '',
}: CalendarAvailabilitySlotsProps) {
  return (
    <div className={['w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{heading}</h2>
      <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">{subheading}</p>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {slots.map((s) => {
          if (s.booked) {
            return (
              <li key={s.time}>
                <button type="button" disabled aria-disabled="true" className="w-full cursor-not-allowed rounded-lg border border-gray-100 py-2 text-sm text-gray-300 line-through dark:border-gray-800 dark:text-gray-600">
                  {s.time}
                </button>
              </li>
            );
          }
          const isSelected = s.time === selected;
          return (
            <li key={s.time}>
              <button
                type="button"
                aria-pressed={isSelected}
                onClick={() => onSelect?.(s.time)}
                className={['w-full rounded-lg border py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:focus-visible:ring-blue-400',
                  isSelected
                    ? 'border-transparent bg-blue-600 text-white'
                    : 'border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-200 dark:hover:border-blue-400 dark:hover:text-blue-300',
                ].join(' ')}
              >
                {s.time}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function CalendarAvailabilitySlotsPreview() {
  return <CalendarAvailabilitySlots />;
}

export const minHeight = 300;
