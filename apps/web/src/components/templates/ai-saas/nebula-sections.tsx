'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, Menu, Minus, Play, Plus, Sparkles, X } from 'lucide-react';
import {
  NEBULA_CONTENT,
  NEBULA_FEATURES,
  NEBULA_INTEGRATIONS,
  NEBULA_LABELS,
  NEBULA_NAV,
  NEBULA_PLANS,
  NEBULA_STATS,
  NEBULA_STEPS,
  type NebulaMasthead as NebulaMastheadData,
  type NebulaPageId,
} from '@/data/templates/ai-saas-content';
import { Counter, Line, LiftLines, Reveal, RevealGroup, useMagnetic } from './nebula-motion';

/**
 * NEBULA - the section library. A single source composed into pages by
 * `nebula-pages.tsx`; no section holds copy of its own. Navigation is by
 * `?page=`, so links work in any host.
 */

/** The shell most bands share. */
function Band({
  eyebrow,
  title,
  subtitle,
  children,
  id,
  center,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  id?: string;
  center?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <div className={`mx-auto max-w-6xl ${center ? 'text-center' : ''}`}>
        <Reveal>
          <p className={`neb-mono inline-flex items-center gap-2 rounded-full border border-[var(--neb-line)] bg-[var(--neb-panel)] px-3 py-1 text-[var(--neb-neon)] ${center ? 'mx-auto' : ''}`}>
            <Sparkles className="h-3 w-3" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className={`neb-display mt-5 text-[clamp(1.9rem,4.4vw,3.2rem)] ${center ? 'mx-auto max-w-3xl' : 'max-w-4xl'}`} delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className={`mt-5 text-pretty text-[16.5px] leading-[1.75] text-[var(--neb-ink-soft)] ${center ? 'mx-auto max-w-[62ch]' : 'max-w-[62ch]'}`}>
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** The brand lockup. */
function BrandMark() {
  return (
    <a href="?page=home" className="flex items-center gap-2.5">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--neb-violet)] to-[var(--neb-neon)]" aria-hidden>
        <Sparkles className="h-4 w-4 text-[#06060f]" />
      </span>
      <span className="neb-display text-[1.2rem]">{NEBULA_CONTENT.brand}</span>
    </a>
  );
}

/** Sticky glass header. */
export function NebulaHeader({ page }: { page: NebulaPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={['fixed inset-x-0 top-0 z-50 transition-all duration-500', scrolled ? 'py-2' : 'py-4'].join(' ')}>
      <div className={['mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 rounded-full px-4 transition-all duration-500 sm:px-5', scrolled ? 'neb-glass-strong' : 'border border-transparent'].join(' ')}>
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NEBULA_NAV.map((item) => {
            const active = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={active ? 'page' : undefined}
                className={['rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors', active ? 'bg-[var(--neb-violet-soft)] text-[var(--neb-ink)]' : 'text-[var(--neb-ink-faint)] hover:text-[var(--neb-ink)]'].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="?page=contact" className="rounded-full px-3.5 py-1.5 text-[13.5px] text-[var(--neb-ink-faint)] transition-colors hover:text-[var(--neb-ink)]">
            {NEBULA_LABELS.signIn}
          </a>
          <a href="?page=contact" className="neb-btn-primary inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13.5px] font-semibold">
            {NEBULA_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="neb-mobile" aria-label={open ? NEBULA_LABELS.close : NEBULA_LABELS.menu} className="lg:hidden">
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="neb-mobile" aria-label="Primary" className="neb-glass-strong mx-4 mt-2 rounded-2xl px-3 py-2 lg:hidden">
          {NEBULA_NAV.map((item) => (
            <a key={item.id} href={`?page=${item.id}`} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-[15px] text-[var(--neb-ink-soft)]">
              {item.label}
            </a>
          ))}
          <a href="?page=contact" onClick={() => setOpen(false)} className="neb-btn-primary mt-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[14px] font-semibold">
            {NEBULA_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}

/** The floating live-dashboard glass panel beside the hero. Decorative. */
function DashboardPanel() {
  const bars = [0.5, 0.8, 0.62, 0.95, 0.7, 0.85, 0.6];
  return (
    <div className="relative mx-auto w-full max-w-md" aria-hidden>
      <div className="neb-glass-strong neb-float rounded-2xl p-5 shadow-2xl shadow-[rgb(124_92_255/25%)]">
        <div className="flex items-center justify-between">
          <span className="neb-mono text-[var(--neb-ink-faint)]">Tasks / min</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--neb-violet-soft)] px-2 py-0.5 text-[11px] text-[var(--neb-neon)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--neb-neon)]" /> live
          </span>
        </div>
        <p className="neb-display mt-2 text-[2.6rem] text-[var(--neb-ink)]">
          <Counter value={2480} />
        </p>
        <div className="mt-4 flex h-24 items-end gap-2">
          {bars.map((h, i) => (
            <span
              key={i}
              className="neb-bar flex-1 rounded-t-md bg-gradient-to-t from-[var(--neb-violet)] to-[var(--neb-neon)]"
              style={{ height: `${h * 100}%`, animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {['GPT', 'Claude', 'Llama', 'Mistral'].map((m) => (
            <span key={m} className="rounded-full border border-[var(--neb-line)] px-2.5 py-1 text-[11px] text-[var(--neb-ink-soft)]">{m}</span>
          ))}
        </div>
      </div>

      {/* Floating chips */}
      <div className="neb-glass neb-float-slow absolute -left-6 top-8 hidden items-center gap-2 rounded-full px-3 py-2 sm:flex">
        <span className="h-2 w-2 rounded-full bg-[var(--neb-neon)]" />
        <span className="text-[12px]">Routed to fastest model</span>
      </div>
      <div className="neb-glass neb-float absolute -right-4 bottom-6 hidden items-center gap-2 rounded-full px-3 py-2 sm:flex">
        <Check className="h-3.5 w-3.5 text-[var(--neb-neon)]" />
        <span className="text-[12px]">Grounded in your data</span>
      </div>
    </div>
  );
}

/** The hero. */
export function NebulaHero() {
  const { hero } = NEBULA_CONTENT;
  const magnetic = useMagnetic<HTMLAnchorElement>(0.28);
  return (
    <section id="top" className="neb-mesh neb-grid relative isolate overflow-hidden px-5 pb-24 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="neb-glass neb-mono inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[var(--neb-neon)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {hero.badge}
            </p>
          </Reveal>

          <LiftLines as="h1" className="neb-display mt-7 text-[clamp(2.8rem,7vw,5rem)]" delay={0.06}>
            <Line>{hero.title}</Line>
            <Line>
              <span className="neb-accent">{hero.titleAccent}</span>
            </Line>
          </LiftLines>

          <Reveal delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-pretty text-[17px] leading-[1.75] text-[var(--neb-ink-soft)]">{hero.subtitle}</p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a ref={magnetic} href="?page=contact" className="neb-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-semibold">
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="?page=features" className="neb-glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium transition-colors hover:border-[var(--neb-line-strong)]">
                <Play className="h-4 w-4 text-[var(--neb-neon)]" aria-hidden />
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>

          <RevealGroup className="mt-12 grid max-w-md grid-cols-3 gap-6" delay={0.1}>
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <p className="neb-display text-[clamp(1.6rem,3vw,2.1rem)] tabular-nums text-[var(--neb-ink)]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="neb-mono mt-1 text-[10px] text-[var(--neb-ink-faint)]">{stat.label}</p>
              </div>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.18}>
          <DashboardPanel />
        </Reveal>
      </div>
    </section>
  );
}

/** Inner-page masthead. */
export function NebulaMasthead({ masthead }: { masthead: NebulaMastheadData }) {
  return (
    <section id="top" className="neb-mesh relative isolate overflow-hidden px-5 pb-14 pt-36 sm:px-8 sm:pb-16 sm:pt-44">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="neb-glass neb-mono inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[var(--neb-neon)]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {masthead.eyebrow}
          </p>
        </Reveal>
        <LiftLines as="h1" className="neb-display mt-6 max-w-4xl text-[clamp(2.4rem,5.5vw,4rem)]" delay={0.04}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.75] text-[var(--neb-ink-soft)]">{masthead.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Client logo marquee. */
export function NebulaMarquee() {
  const words = NEBULA_CONTENT.marquee;
  return (
    <section className="border-y border-[var(--neb-line)] py-10">
      <p className="neb-mono mb-6 text-center text-[var(--neb-ink-faint)]">Trusted by teams shipping AI in production</p>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="neb-marquee neb-display flex w-max items-center gap-14 pr-14 text-[clamp(1.2rem,2.6vw,1.7rem)] text-[var(--neb-ink-faint)]">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="whitespace-nowrap">{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Animated stat counters. */
export function NebulaStats() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4" step={0.08}>
        {NEBULA_STATS.map((stat) => (
          <div key={stat.label} className="neb-glass rounded-2xl p-6 text-center">
            <p className="neb-display text-[clamp(2rem,4vw,2.8rem)] tabular-nums">
              <span className="neb-accent"><Counter value={stat.value} suffix={stat.suffix} /></span>
            </p>
            <p className="neb-mono mt-2 text-[var(--neb-ink-faint)]">{stat.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}

/** Feature grid of glass cards. */
export function NebulaFeatures() {
  const { services } = NEBULA_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="features">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
        {NEBULA_FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="neb-glass neb-card rounded-[var(--neb-radius)] p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--neb-violet-soft)]">
                <Icon className="h-5 w-5 text-[var(--neb-neon)]" aria-hidden />
              </span>
              <h3 className="neb-display mt-5 text-[1.35rem]">{feature.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[var(--neb-ink-soft)]">{feature.body}</p>
            </article>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** How it works, three steps. */
export function NebulaHowItWorks() {
  const { about } = NEBULA_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="how">
      <RevealGroup className="mt-12 grid gap-5 md:grid-cols-3" step={0.1}>
        {NEBULA_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="neb-glass rounded-[var(--neb-radius)] p-7">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--neb-violet-soft)]">
                  <Icon className="h-5 w-5 text-[var(--neb-neon)]" aria-hidden />
                </span>
                <span className="neb-display text-[1.4rem] text-[var(--neb-line-strong)]">{`0${i + 1}`}</span>
              </div>
              <h3 className="neb-display mt-6 text-[1.4rem]">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[var(--neb-ink-soft)]">{step.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Why / benefits. */
export function NebulaWhy() {
  const { why } = NEBULA_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} id="why">
      <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {why.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--neb-violet-soft)]">
                <Icon className="h-5 w-5 text-[var(--neb-neon)]" aria-hidden />
              </span>
              <h3 className="neb-display mt-5 text-[1.25rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--neb-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Integrations grid. */
export function NebulaIntegrations() {
  return (
    <Band eyebrow="Integrations" title="Plugs into the stack you already run." subtitle="A hundred and more native connectors, plus an API and webhooks for the rest." id="integrations">
      <RevealGroup className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" step={0.04}>
        {NEBULA_INTEGRATIONS.map((name) => (
          <div key={name} className="neb-glass neb-card flex items-center gap-3 rounded-2xl px-4 py-4">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--neb-violet-soft)] text-[13px] font-bold text-[var(--neb-neon)]">
              {name.slice(0, 1)}
            </span>
            <span className="text-[14px] font-medium">{name}</span>
          </div>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** Pricing, three plans. */
export function NebulaPricing() {
  return (
    <Band eyebrow="Pricing" title="Priced for teams, not seats." subtitle="Start free, scale when it pays off. Every plan includes the full model router and unlimited members." id="pricing" center>
      <RevealGroup className="mt-12 grid gap-5 lg:grid-cols-3" step={0.09}>
        {NEBULA_PLANS.map((plan) => (
          <div
            key={plan.name}
            className={['rounded-[var(--neb-radius)] p-7 text-left', plan.featured ? 'neb-glass-strong ring-1 ring-[var(--neb-violet)]' : 'neb-glass'].join(' ')}
          >
            <div className="flex items-center justify-between">
              <h3 className="neb-display text-[1.3rem]">{plan.name}</h3>
              {plan.featured && <span className="neb-mono rounded-full bg-[var(--neb-violet-soft)] px-2.5 py-1 text-[10px] text-[var(--neb-neon)]">Popular</span>}
            </div>
            <p className="mt-4">
              <span className="neb-display text-[2.4rem]">{plan.price}</span>
              <span className="ml-1.5 text-[13px] text-[var(--neb-ink-faint)]">{plan.cadence}</span>
            </p>
            <p className="mt-2 text-[14px] text-[var(--neb-ink-soft)]">{plan.blurb}</p>
            <a href="?page=contact" className={['mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold', plan.featured ? 'neb-btn-primary' : 'neb-glass hover:border-[var(--neb-line-strong)]'].join(' ')}>
              {plan.cta}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <ul className="mt-7 space-y-3 border-t border-[var(--neb-line)] pt-6">
              {plan.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5 text-[14px] text-[var(--neb-ink-soft)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--neb-neon)]" aria-hidden />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** FAQ accordion. */
export function NebulaFaq() {
  const { faq } = NEBULA_CONTENT;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Band eyebrow={faq.eyebrow} title={faq.title} center>
      <div className="mx-auto mt-10 max-w-3xl text-left">
        <RevealGroup className="border-t border-[var(--neb-line)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--neb-line)]">
                <h3>
                  <button type="button" onClick={() => setOpen(expanded ? null : i)} aria-expanded={expanded} aria-controls={`neb-faq-${i}`} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium">
                    {item.question}
                    {expanded ? <Minus className="h-4 w-4 shrink-0 text-[var(--neb-neon)]" aria-hidden /> : <Plus className="h-4 w-4 shrink-0 text-[var(--neb-ink-faint)]" aria-hidden />}
                  </button>
                </h3>
                {expanded && <div id={`neb-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.85] text-[var(--neb-ink-soft)]">{item.answer}</div>}
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Closing CTA band over the mesh. */
export function NebulaCta() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="neb-mesh neb-glass-strong relative isolate overflow-hidden rounded-[28px] px-6 py-16 text-center sm:px-12">
          <LiftLines className="neb-display mx-auto max-w-2xl text-[clamp(1.9rem,4vw,3rem)]">
            <Line>Ship your first AI workflow today.</Line>
          </LiftLines>
          <p className="mx-auto mt-5 max-w-[52ch] text-[16px] text-[var(--neb-ink-soft)]">Free to start, no card required. A senior engineer helps you get the first one live.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="?page=contact" className="neb-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-semibold">
              Start for free <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="?page=pricing" className="neb-glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-medium">
              See pricing <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** Contact form. */
export function NebulaContact() {
  const { contact } = NEBULA_CONTENT;
  const [sent, setSent] = useState(false);
  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`neb-${field}`} className="neb-mono block text-[var(--neb-ink-faint)]">{contact.fields[field]}</label>
                {field === 'message' ? (
                  <textarea id={`neb-${field}`} name={field} rows={4} required className="neb-glass mt-3 w-full resize-y rounded-[12px] px-4 py-3 text-[16px] text-[var(--neb-ink)] outline-none focus:border-[var(--neb-neon)]" />
                ) : (
                  <input id={`neb-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} required className="neb-glass mt-3 w-full rounded-[12px] px-4 py-3 text-[16px] text-[var(--neb-ink)] outline-none focus:border-[var(--neb-neon)]" />
                )}
              </div>
            ))}
            <button type="submit" className="neb-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-semibold">
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--neb-neon)]">{sent ? 'This is a template. Wire the form to your own inbox.' : ''}</p>
          </form>
        </Reveal>
        <RevealGroup className="border-t border-[var(--neb-line)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--neb-line)] py-5">
              <p className="neb-mono text-[var(--neb-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Footer. */
export function NebulaFooter() {
  const { footer } = NEBULA_CONTENT;
  return (
    <footer className="border-t border-[var(--neb-line)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.7] text-[var(--neb-ink-faint)]">{footer.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="neb-mono text-[var(--neb-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--neb-ink-soft)] hover:text-[var(--neb-ink)]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--neb-line)] pt-7 text-[12.5px] text-[var(--neb-ink-faint)]">{footer.legal}</p>
    </footer>
  );
}
