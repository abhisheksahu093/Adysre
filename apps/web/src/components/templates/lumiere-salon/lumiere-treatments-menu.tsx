'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  formatLumiereDuration,
  formatLumierePrice,
  lumiereHref,
} from '@/data/templates/lumiere-salon-content';
import { useLumiereSettings } from './lumiere-settings';

/**
 * LUMIERE - the treatments menu.
 *
 * A salon's menu IS its product, so the header exposes it directly rather than
 * making a visitor load the services page to find out what is offered. Every
 * category and treatment here comes from the same data the services page
 * renders, so the two can never disagree.
 *
 * Interaction mirrors the app's own `NavMenu` (landing-header.tsx): opens on
 * hover or click, closes on outside click, blur-out and Escape. The trigger is
 * a real button with `aria-expanded`, and choosing an item navigates to that
 * category's anchor on the services page.
 */
export function LumiereTreatmentsMenu({
  label,
  active,
  linkClassName,
}: {
  label: string;
  active: boolean;
  linkClassName: string;
}) {
  const { data } = useLumiereSettings();
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

  const anchorFor = (categoryId: string) => `${lumiereHref('services')}#treatments-${categoryId}`;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => event.key === 'Escape' && setOpen(false)}
        className={`inline-flex items-center gap-1.5 ${linkClassName}`}
        {...(active ? { 'aria-current': 'page' as const } : {})}
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-1/2 top-full z-50 w-[min(58rem,90vw)] -translate-x-1/2 pt-4"
        >
          <div className="grid gap-8 rounded-[32px] border border-[var(--lumi-rule)] bg-[var(--lumi-paper-2)] p-8 shadow-[0_30px_80px_-40px_rgb(44_27_46/45%)] sm:grid-cols-2 lg:grid-cols-4">
            {data.serviceCategories.map((category) => (
              <div key={category.id}>
                <a
                  href={anchorFor(category.id)}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="font-[family-name:var(--lumi-serif)] text-[19px] text-[var(--lumi-ink)] transition-colors hover:text-[var(--lumi-accent-deep)]"
                >
                  {category.name}
                </a>

                <ul className="mt-4 space-y-3">
                  {category.treatments.map((treatment) => (
                    <li key={treatment.id}>
                      <a
                        href={anchorFor(category.id)}
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="group block text-[13px] leading-snug text-[var(--lumi-ink-soft)] transition-colors hover:text-[var(--lumi-ink)]"
                      >
                        {treatment.name}
                        <span className="mt-0.5 block text-[12px] text-[var(--lumi-ink-faint)]">
                          {formatLumiereDuration(treatment.duration)} ·{' '}
                          {formatLumierePrice(treatment.price)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
