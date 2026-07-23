'use client';

import { useState, type FormEvent } from 'react';
import {
  formatLumiereDuration,
} from '@/data/templates/lumiere-salon-content';
import { LumiereField } from './lumiere-field';
import { LumiereMasthead } from './lumiere-masthead';
import { useLumiereSettings } from './lumiere-settings';
import { Reveal } from './lumiere-reveal';

/**
 * LUMIERE - the appointment request.
 *
 * Front-end only, and honest about it: `preventDefault` stops the submission, the
 * confirmation is announced in an `aria-live` region, and there is no payment
 * field anywhere in the form or in the copy that feeds it. A salon wiring this up
 * replaces one handler.
 *
 * The treatment options are grouped by category with the duration and price in
 * the option text, so choosing a treatment is choosing a known commitment of time
 * and money rather than a name. Both lists are derived from the menu and the
 * team, so the form can never offer something the salon does not do.
 */
export function LumiereBookingPage() {
  const { data } = useLumiereSettings();
  const { formatPrice } = useLumiereSettings();
  const { booking } = data.salon;
  const [sent, setSent] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <>
      <LumiereMasthead copy={booking.masthead} />

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-10 sm:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20">
          <Reveal>
            <form onSubmit={onSubmit} className="lumi-panel px-8 py-10 sm:px-12">
              <h2 className="lumi-subtitle">{booking.detailsTitle}</h2>

              <div className="mt-8 space-y-7">
                <LumiereField field={booking.serviceField}>
                  {data.serviceCategories.map((category) => (
                    <optgroup key={category.id} label={category.name}>
                      {category.treatments.map((treatment) => (
                        <option key={treatment.id} value={treatment.id}>
                          {treatment.name}, {formatLumiereDuration(treatment.duration)},{' '}
                          {formatPrice(treatment.price)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </LumiereField>

                <LumiereField field={booking.stylistField}>
                  {data.stylists.map((stylist) => (
                    <option key={stylist.id} value={stylist.id}>
                      {stylist.name}, {stylist.role}
                    </option>
                  ))}
                </LumiereField>

                <div className="grid gap-7 sm:grid-cols-2">
                  <LumiereField field={booking.dateField} />
                  <LumiereField field={booking.timeField}>
                    {(booking.timeField.options ?? []).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </LumiereField>
                </div>
              </div>

              <h2 className="lumi-subtitle mt-14">{booking.aboutYouTitle}</h2>

              <div className="mt-8 space-y-7">
                {booking.personFields.map((field) => (
                  <LumiereField key={field.id} field={field} />
                ))}
                {/* Optional: someone with nothing to declare should not be made
                    to type a sentence to send the form. */}
                <LumiereField field={booking.notesField} required={false} />
              </div>

              <button type="submit" className="lumi-btn lumi-btn--solid mt-10 w-full sm:w-auto">
                {booking.submit}
              </button>

              {/*
                Always rendered, empty until the form is sent: a live region
                inserted at the moment it gains text is frequently missed,
                because there was nothing there to watch.
              */}
              <p
                aria-live="polite"
                className="mt-6 min-h-[1.5rem] text-[15px] leading-[1.75] text-[var(--lumi-accent-deep)]"
              >
                {sent ? booking.confirmed : ''}
              </p>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="lumi-panel px-8 py-10 lg:sticky lg:top-28">
              <h2 className="lumi-subtitle">{booking.policyTitle}</h2>
              <ul className="mt-7 space-y-5">
                {booking.policyPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-[15px] leading-[1.75]">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-[var(--lumi-accent)]"
                    />
                    <span className="text-[var(--lumi-ink-soft)]">{point}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
