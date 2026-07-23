'use client';

import { TAVOLA_STEP_ICONS, tavolaHref } from '@/data/templates/tavola-kitchen-content';
import { TavolaSectionHeading } from './tavola-section-heading';
import { useTavolaSettings } from './tavola-settings';

/** TAVOLA - how the kitchen reaches you, plus the questions that precede an order. */
export function TavolaServicesPage() {
  const { data } = useTavolaSettings();
  const { content, copy, steps } = data;

  return (
    <>
      <section className="tv-wash">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <TavolaSectionHeading
            title={copy.services.title}
            subtitle={copy.services.subtitle}
            align="left"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {steps.map((step) => {
            const Icon = TAVOLA_STEP_ICONS[step.id as keyof typeof TAVOLA_STEP_ICONS];
            return (
              <article key={step.id} className="tv-card flex gap-4 p-6">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--tv-accent-soft)] text-[var(--tv-accent-deep)]">
                  {Icon ? <Icon className="h-5 w-5" aria-hidden /> : null}
                </span>
                <div>
                  <h3 className="text-[16px] font-bold">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--tv-ink-soft)]">
                    {step.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-[var(--tv-paper-2)] py-14">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <TavolaSectionHeading eyebrow={content.faq.eyebrow} title={content.faq.title} />
          <dl className="mt-8 divide-y divide-[var(--tv-rule)]">
            {content.faq.items.map((item) => (
              <div key={item.question} className="py-5">
                <dt className="text-[15px] font-bold">{item.question}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-[var(--tv-ink-soft)]">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 text-center">
            <a href={tavolaHref('contact')} className="tv-btn tv-btn--solid">
              {content.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
