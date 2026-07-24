'use client';

import { useState } from 'react';
import { ArrowRight, Check, Minus, Plus } from 'lucide-react';
import {
  HALCYON_CAPABILITIES,
  HALCYON_CONTENT,
  HALCYON_FACTS,
  HALCYON_MILESTONES,
  HALCYON_MODELS,
  HALCYON_PLANS,
  type HalcyonMasthead,
} from '@/data/templates/halcyon-ai-content';
import { Counter, Reveal, RevealGroup } from './halcyon-motion';

/**
 * HALCYON - the section library.
 *
 * Every section on every page lives here, because they share one shell (a
 * mono eyebrow, a display title, a glass body) and splitting them across twelve
 * files would mean twelve copies of that shell. Page compositions live in
 * `halcyon-pages.tsx`; this file only knows how one band looks.
 *
 * No section holds copy. Everything reads from the content module, so rewording
 * the template never touches a component.
 */

/** The shell every band shares: eyebrow, title, optional lede. */
function Band({
  eyebrow,
  title,
  subtitle,
  children,
  id,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="hal-mono text-[var(--hal-violet-bright)]">{eyebrow}</p>
          <h2 className="hal-display mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3.1rem)]">{title}</h2>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-pretty text-[16px] leading-[1.75] text-[var(--hal-ink-soft)]">
              {subtitle}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** A page's opening band. Interior pages only; home has the hero instead. */
export function HalcyonMasthead({ masthead }: { masthead: HalcyonMasthead }) {
  return (
    <section className="relative px-5 pb-8 pt-20 sm:px-8 sm:pb-12 sm:pt-28">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="hal-mono text-[var(--hal-violet-bright)]">{masthead.eyebrow}</p>
          <h1 className="hal-display mt-4 text-[clamp(2.2rem,5.5vw,4rem)]">{masthead.title}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-[16.5px] leading-[1.75] text-[var(--hal-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * The scrolling word strip.
 *
 * CSS animation rather than anime.js on purpose: it is a continuous, unending
 * marquee with no scroll relationship and no sequencing, which is precisely
 * what a keyframe loop is for. Reaching for the JS engine here would cost a
 * rAF callback for the life of the page and buy nothing.
 */
export function HalcyonMarquee() {
  const words = HALCYON_CONTENT.marquee;
  return (
    <div aria-hidden className="relative overflow-hidden border-y border-[var(--hal-glass-line)] py-4">
      <div className="flex w-max animate-[hal-marquee_38s_linear_infinite] gap-10 pr-10">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="hal-mono text-[var(--hal-ink-faint)]">
            {word}
          </span>
        ))}
      </div>
      <style>{`@keyframes hal-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[hal-marquee_38s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** The six-capability grid. */
export function HalcyonCapabilities() {
  const { services } = HALCYON_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" delay={0.05}>
        {HALCYON_CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <article key={cap.title} className="hal-glass relative p-7">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--hal-glass-strong)] text-[var(--hal-violet-bright)]"
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-5 text-[16px] font-medium tracking-tight">{cap.title}</h3>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-[var(--hal-ink-faint)]">{cap.body}</p>
              <p className="mt-6 border-t border-[var(--hal-glass-line)] pt-4">
                <span className="hal-display text-[1.6rem] text-[var(--hal-ink)]">{cap.metric}</span>
                <span className="ml-2 text-[12.5px] text-[var(--hal-ink-faint)]">{cap.metricLabel}</span>
              </p>
            </article>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The adoption grid. */
export function HalcyonWhy() {
  const { why } = HALCYON_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {why.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title}>
              <Icon className="h-5 w-5 text-[var(--hal-cyan-bright)]" aria-hidden />
              <h3 className="mt-4 text-[15.5px] font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--hal-ink-faint)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The two-column narrative with a checklist. */
export function HalcyonAbout() {
  const { about } = HALCYON_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 text-[16px] leading-[1.8] text-[var(--hal-ink-soft)]">
              {paragraph}
            </p>
          ))}
        </Reveal>
        <RevealGroup className="hal-glass relative space-y-4 p-8" delay={0.1}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-3 text-[14.5px] leading-[1.7]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hal-cyan-bright)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The model roster. A table, because it is tabular data. */
export function HalcyonModels() {
  return (
    <Band
      eyebrow="Routes"
      title="Every model behind one endpoint"
      subtitle="Add a provider or your own checkpoint and it becomes a candidate route immediately. Latencies are illustrative first-token figures."
    >
      <Reveal className="hal-glass relative mt-12 overflow-x-auto p-1.5">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <caption className="sr-only">Models available through the Halcyon router</caption>
          <thead>
            <tr className="hal-mono text-[var(--hal-ink-faint)]">
              <th scope="col" className="px-5 py-4 font-normal">Model</th>
              <th scope="col" className="px-5 py-4 font-normal">Vendor</th>
              <th scope="col" className="px-5 py-4 font-normal">Context</th>
              <th scope="col" className="px-5 py-4 font-normal">First token</th>
              <th scope="col" className="px-5 py-4 font-normal">Strengths</th>
            </tr>
          </thead>
          <tbody>
            {HALCYON_MODELS.map((model) => (
              <tr key={model.name} className="border-t border-[var(--hal-glass-line)]">
                <th scope="row" className="px-5 py-4 text-[14.5px] font-medium">{model.name}</th>
                <td className="px-5 py-4 text-[14px] text-[var(--hal-ink-faint)]">{model.vendor}</td>
                <td className="px-5 py-4 text-[14px] tabular-nums text-[var(--hal-ink-soft)]">{model.context}</td>
                <td className="px-5 py-4 text-[14px] tabular-nums text-[var(--hal-ink-soft)]">{model.latency}</td>
                <td className="px-5 py-4">
                  <span className="flex flex-wrap gap-1.5">
                    {model.strengths.map((s) => (
                      <span key={s} className="rounded-full bg-[var(--hal-glass-strong)] px-2.5 py-1 text-[11.5px] text-[var(--hal-ink-soft)]">
                        {s}
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Band>
  );
}

/** The pricing ladder. */
export function HalcyonPricing() {
  return (
    <Band
      eyebrow="Plans"
      title="Every plan is the whole platform"
      subtitle="Tiers differ in throughput, retention and support. None of them withhold a feature."
    >
      <RevealGroup className="mt-14 grid items-start gap-5 lg:grid-cols-3" step={0.09}>
        {HALCYON_PLANS.map((plan) => (
          <article
            key={plan.name}
            className={[
              'hal-glass relative p-8',
              plan.featured ? 'hal-glass-strong lg:-mt-4 lg:pb-12' : '',
            ].join(' ')}
          >
            {plan.featured && (
              <span className="hal-mono absolute right-6 top-6 text-[var(--hal-cyan-bright)]">
                Recommended
              </span>
            )}
            <h3 className="text-[15px] font-medium tracking-tight">{plan.name}</h3>
            <p className="mt-5 flex items-baseline gap-2">
              <span className="hal-display text-[2.6rem]">{plan.price}</span>
              <span className="text-[13px] text-[var(--hal-ink-faint)]">{plan.cadence}</span>
            </p>
            <p className="mt-3 text-[14px] leading-[1.7] text-[var(--hal-ink-faint)]">{plan.summary}</p>
            <ul className="mt-7 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[14px] leading-[1.65]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--hal-cyan-bright)]" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="?page=contact"
              className={[
                'mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium transition-transform hover:-translate-y-0.5',
                plan.featured
                  ? 'bg-[var(--hal-ink)] text-[var(--hal-bg)]'
                  : 'border border-[var(--hal-glass-line-strong)] text-[var(--hal-ink)]',
              ].join(' ')}
            >
              {plan.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The company timeline plus its headline figures. */
export function HalcyonStory() {
  return (
    <Band eyebrow="Story" title="Built because we kept building it">
      <RevealGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {HALCYON_MILESTONES.map((milestone) => (
          <div key={milestone.year} className="border-t border-[var(--hal-glass-line)] pt-5">
            <p className="hal-mono text-[var(--hal-violet-bright)]">{milestone.year}</p>
            <h3 className="mt-3 text-[15.5px] font-medium tracking-tight">{milestone.title}</h3>
            <p className="mt-2 text-[14px] leading-[1.7] text-[var(--hal-ink-faint)]">{milestone.body}</p>
          </div>
        ))}
      </RevealGroup>

      <Reveal className="hal-glass hal-glass-strong relative mt-14 grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
        {HALCYON_FACTS.map((fact) => (
          <div key={fact.label} className="px-6 py-8">
            <p className="hal-display text-[2.2rem] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="mt-1.5 text-[13px] text-[var(--hal-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </Band>
  );
}

/**
 * The FAQ. Native `<details>` under the hood would be simpler, but the panel
 * needs a controlled open state to keep only one expanded, so this is a real
 * disclosure pattern with `aria-expanded` and a labelled region.
 */
export function HalcyonFaq() {
  const { faq } = HALCYON_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-12 max-w-3xl">
        <RevealGroup className="space-y-3" step={0.05}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="hal-glass relative overflow-hidden">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`hal-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[15.5px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--hal-ink-faint)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--hal-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`hal-faq-${i}`} className="px-6 pb-6 text-[14.5px] leading-[1.8] text-[var(--hal-ink-faint)]">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/**
 * The contact band.
 *
 * The form does not post anywhere - a template ships no backend - so it says so
 * on submit rather than pretending to have sent something.
 */
export function HalcyonContact() {
  const { contact } = HALCYON_CONTENT;
  const [sent, setSent] = useState(false);

  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <form
            className="hal-glass relative space-y-4 p-8"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`hal-${field}`} className="hal-mono block text-[var(--hal-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`hal-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-2 w-full resize-y rounded-xl border border-[var(--hal-glass-line)] bg-[rgb(255_255_255/4%)] px-4 py-3 text-[15px] text-[var(--hal-ink)] placeholder:text-[var(--hal-ink-faint)]"
                  />
                ) : (
                  <input
                    id={`hal-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-2 w-full rounded-xl border border-[var(--hal-glass-line)] bg-[rgb(255_255_255/4%)] px-4 py-3 text-[15px] text-[var(--hal-ink)] placeholder:text-[var(--hal-ink-faint)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--hal-ink)] px-6 py-3 text-[14.5px] font-medium text-[var(--hal-bg)] transition-transform hover:-translate-y-0.5"
            >
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>

            {/* Announced, not just shown: the visual change is off-screen for
                anyone using a screen reader. */}
            <p aria-live="polite" className="min-h-5 text-[13px] text-[var(--hal-cyan-bright)]">
              {sent ? 'This is a template. Wire the form to your own endpoint.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="space-y-6" delay={0.1}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-t border-[var(--hal-glass-line)] pt-4">
              <p className="hal-mono text-[var(--hal-ink-faint)]">{detail.label}</p>
              <p className="mt-1.5 text-[15px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function HalcyonFooter() {
  const { footer, brand } = HALCYON_CONTENT;
  return (
    <footer className="border-t border-[var(--hal-glass-line)] px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
            <span aria-hidden className="h-7 w-7 rounded-lg bg-[linear-gradient(135deg,var(--hal-violet),var(--hal-cyan))]" />
            {brand}
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--hal-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="hal-mono text-[var(--hal-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--hal-ink-soft)] hover:text-[var(--hal-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-6xl border-t border-[var(--hal-glass-line)] pt-8 text-[12.5px] text-[var(--hal-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
