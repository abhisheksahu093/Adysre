'use client';

import { useState, type FormEvent } from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';
import { TavolaSectionHeading } from './tavola-section-heading';
import { useTavolaSettings } from './tavola-settings';

/**
 * TAVOLA - booking a table.
 *
 * The form is local state and never posts: a template must not imply a backend
 * it does not ship. Submitting swaps in a confirmation so the flow reads end to
 * end, and the restaurant wires it to their own booking service.
 */
export function TavolaContactPage() {
  const { data } = useTavolaSettings();
  const { copy } = data;
  const [sent, setSent] = useState(false);

  const fieldClass =
    'mt-1.5 w-full rounded-[14px] border border-[var(--tv-rule-strong)] bg-white px-3.5 py-2.5 text-[14px] text-[var(--tv-ink)] outline-none transition-colors focus:border-[var(--tv-accent)]';
  const labelClass = 'block text-[13px] font-semibold';

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_1fr]">
      <div>
        <TavolaSectionHeading title={copy.contact.title} subtitle={copy.contact.subtitle} align="left" />

        {sent ? (
          <p
            role="status"
            className="mt-8 rounded-[var(--tv-radius)] bg-[var(--tv-accent-soft)] p-6 text-[14px] font-semibold text-[var(--tv-accent-deep)]"
          >
            {copy.contact.sent}
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={labelClass}>{copy.contact.name}</span>
              <input required name="name" className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>{copy.contact.email}</span>
              <input required type="email" name="email" className={fieldClass} />
            </label>
            <label>
              <span className={labelClass}>{copy.contact.guests}</span>
              <input type="number" min={1} max={20} defaultValue={2} name="guests" className={`tv-num ${fieldClass}`} />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>{copy.contact.date}</span>
              <input type="date" name="date" className={fieldClass} />
            </label>
            <label className="sm:col-span-2">
              <span className={labelClass}>{copy.contact.notes}</span>
              <textarea name="notes" rows={4} className={fieldClass} />
            </label>
            <button type="submit" className="tv-btn tv-btn--solid sm:col-span-2 sm:justify-self-start">
              {copy.contact.submit}
            </button>
          </form>
        )}
      </div>

      <aside className="tv-card h-fit p-6">
        <ul className="space-y-6">
          <li className="flex gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tv-accent)]" aria-hidden />
            <div>
              <h2 className="text-[14px] font-bold">{copy.contact.hours}</h2>
              <ul className="mt-1.5 space-y-1 text-[13px] text-[var(--tv-ink-soft)]">
                {copy.contact.hoursValue.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          </li>
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tv-accent)]" aria-hidden />
            <div>
              <h2 className="text-[14px] font-bold">{copy.contact.address}</h2>
              <p className="mt-1.5 text-[13px] text-[var(--tv-ink-soft)]">
                {copy.contact.addressValue}
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[var(--tv-accent)]" aria-hidden />
            <div>
              <h2 className="text-[14px] font-bold">{copy.contact.phone}</h2>
              <p className="tv-num mt-1.5 text-[13px] text-[var(--tv-ink-soft)]">
                {copy.contact.phoneValue}
              </p>
            </div>
          </li>
        </ul>
      </aside>
    </section>
  );
}
