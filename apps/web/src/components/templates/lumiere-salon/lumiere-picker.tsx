'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

/**
 * LUMIERE - the header's currency and language pickers.
 *
 * One component for both, because they are the same control: a labelled button
 * that opens a short list of mutually exclusive options. Built as a real menu
 * rather than a `<select>` so it can carry the template's own type and radii,
 * with the same open/close contract as the treatments menu - outside click,
 * blur-out and Escape all close it.
 */
export function LumierePicker<T extends string>({
  label,
  value,
  options,
  onChange,
  align = 'right',
}: {
  /** Names the control for assistive tech; the button shows the short value. */
  label: string;
  value: T;
  options: readonly { id: T; label: string; short?: string }[];
  onChange: (value: T) => void;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const current = options.find((option) => option.id === value);

  return (
    <div
      ref={ref}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((state) => !state)}
        onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
        className="inline-flex items-center gap-1 rounded-[var(--lumi-radius-pill,9999px)] px-2.5 py-1.5 text-[13px] text-[var(--lumi-ink-soft)] transition-colors hover:text-[var(--lumi-ink)]"
      >
        {current?.short ?? current?.label ?? value}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="menu"
          aria-label={label}
          className={`absolute top-full z-50 mt-2 min-w-[9rem] overflow-hidden rounded-[20px] border border-[var(--lumi-rule)] bg-[var(--lumi-paper-2)] py-1.5 shadow-[0_24px_60px_-32px_rgb(44_27_46/45%)] ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {options.map((option) => {
            const selected = option.id === value;
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={selected}
                  onClick={() => {
                    onChange(option.id);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-[13px] text-[var(--lumi-ink-soft)] transition-colors hover:bg-[var(--lumi-paper-3)] hover:text-[var(--lumi-ink)]"
                >
                  {option.label}
                  {selected && <Check className="h-3.5 w-3.5 text-[var(--lumi-accent-deep)]" aria-hidden />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
