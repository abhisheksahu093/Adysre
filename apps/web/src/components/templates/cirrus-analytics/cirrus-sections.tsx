'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, Menu, Minus, Plus, X } from 'lucide-react';
import {
  CIRRUS_BREAKS_SERIES,
  CIRRUS_CAPABILITIES,
  CIRRUS_CONTENT,
  CIRRUS_CONTROLS,
  CIRRUS_LABELS,
  CIRRUS_METRICS,
  CIRRUS_NAV,
  CIRRUS_PLANS,
  CIRRUS_VOLUME_SERIES,
  type CirrusMasthead,
  type CirrusPageId,
} from '@/data/templates/cirrus-analytics-content';
import { Counter, Reveal, RevealGroup, ScrollBars, ScrollChart } from './cirrus-motion';

/**
 * CIRRUS - the section library.
 *
 * Every section on every page lives here, because they share one shell (a mono
 * eyebrow, a tight display title, hairline structure). Page compositions live
 * in `cirrus-pages.tsx`.
 *
 * No section holds copy - everything reads from the content module.
 */

/** The shell every band shares. */
function Band({
  eyebrow,
  title,
  subtitle,
  children,
  id,
  dark,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  id?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={[
        'px-5 py-24 sm:px-8 sm:py-28',
        dark ? 'bg-[var(--cir-deep)] text-[var(--cir-on-deep)]' : '',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className={dark ? 'cir-mono text-[var(--cir-on-deep-soft)]' : 'cir-mono text-[var(--cir-accent)]'}>
            {eyebrow}
          </p>
          <h2 className="cir-display mt-4 max-w-3xl text-[clamp(1.8rem,3.8vw,2.9rem)]">{title}</h2>
          {subtitle && (
            <p
              className={[
                'mt-5 max-w-[64ch] text-pretty text-[16px] leading-[1.7]',
                dark ? 'text-[var(--cir-on-deep-soft)]' : 'text-[var(--cir-ink-soft)]',
              ].join(' ')}
            >
              {subtitle}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/**
 * A signed movement. The arrow is not decoration: it carries the sign for
 * anyone who cannot distinguish the two colours.
 */
function Delta({ value }: { value: number }) {
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className="inline-flex items-center gap-1 text-[13px] font-medium"
      style={{ color: up ? 'var(--cir-up)' : 'var(--cir-down)' }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      <span className="cir-figure">
        {up ? '+' : ''}
        {value.toFixed(1)}%
      </span>
    </span>
  );
}

/** The header. A hairline bar; nothing moves except the rule appearing. */
export function CirrusHeader({ page }: { page: CirrusPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [page]);

  return (
    <header
      className={[
        'sticky top-0 z-50 bg-[var(--cir-bg)]/90 backdrop-blur transition-colors',
        scrolled ? 'border-b border-[var(--cir-rule)]' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span aria-hidden className="h-5 w-5 rounded-[5px] bg-[var(--cir-accent)]" />
          Cirrus
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {CIRRUS_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'text-[13.5px] transition-colors',
                  current ? 'text-[var(--cir-ink)]' : 'text-[var(--cir-ink-faint)] hover:text-[var(--cir-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href="?page=contact" className="text-[13.5px] text-[var(--cir-ink-faint)] hover:text-[var(--cir-ink)]">
            Sign in
          </a>
          <a
            href="?page=contact"
            className="rounded-[var(--cir-radius)] bg-[var(--cir-ink)] px-4 py-2 text-[13.5px] font-medium text-[var(--cir-bg)] transition-opacity hover:opacity-90"
          >
            Book a walkthrough
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="cir-mobile-nav"
          aria-label={open ? CIRRUS_LABELS.close : CIRRUS_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="cir-mobile-nav" aria-label="Primary" className="border-t border-[var(--cir-rule)] px-5 py-2 md:hidden">
          {CIRRUS_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block py-3 text-[15px]',
                item.id === page ? 'text-[var(--cir-ink)]' : 'text-[var(--cir-ink-faint)]',
              ].join(' ')}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/** The opening screen, with the scroll-drawn chart as its subject. */
export function CirrusHero() {
  const { hero } = CIRRUS_CONTENT;

  return (
    <section className="px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="cir-mono inline-flex items-center gap-2 rounded-full border border-[var(--cir-rule)] px-3 py-1.5 text-[var(--cir-ink-faint)]">
            {hero.badge}
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="cir-display mt-7 max-w-4xl text-[clamp(2.4rem,6vw,4.6rem)]">
            {hero.title}{' '}
            <span className="text-[var(--cir-accent)]">{hero.titleAccent}</span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[62ch] text-pretty text-[17px] leading-[1.75] text-[var(--cir-ink-soft)]">
            {hero.subtitle}
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="?page=contact"
              className="inline-flex items-center gap-2 rounded-[var(--cir-radius)] bg-[var(--cir-ink)] px-5 py-3 text-[14.5px] font-medium text-[var(--cir-bg)] transition-opacity hover:opacity-90"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="?page=product"
              className="inline-flex items-center rounded-[var(--cir-radius)] border border-[var(--cir-rule-strong)] px-5 py-3 text-[14.5px] transition-colors hover:bg-[var(--cir-bg-2)]"
            >
              {hero.ctaSecondary}
            </a>
          </div>
        </Reveal>

        {/* The one lifted element on the page. */}
        <Reveal delay={0.2}>
          <div className="cir-panel cir-lift mt-14 overflow-hidden">
            <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--cir-rule)] px-6 py-5">
              <div>
                <p className="cir-mono text-[var(--cir-ink-faint)]">Settled volume</p>
                <p className="cir-display cir-figure mt-1.5 text-[2rem]">
                  <Counter value={4.82} prefix="$" suffix="B" decimals={2} />
                </p>
              </div>
              <Delta value={12.4} />
            </div>

            <div className="cir-grid px-6 py-8">
              <ScrollChart
                values={CIRRUS_VOLUME_SERIES}
                label="Settled volume trending upward over twenty periods. Sample data."
                caption="Sample data · draws as you scroll"
                className="h-52"
              />
            </div>
          </div>
        </Reveal>

        <dl className="mt-14 grid grid-cols-1 gap-8 border-t border-[var(--cir-rule)] pt-10 sm:grid-cols-3">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="cir-display cir-figure text-[2rem]">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mt-1.5 text-[13.5px] text-[var(--cir-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A page's opening band. */
export function CirrusMasthead({ masthead }: { masthead: CirrusMasthead }) {
  return (
    <section className="px-5 pb-4 pt-16 sm:px-8 sm:pb-8 sm:pt-20">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="cir-mono text-[var(--cir-accent)]">{masthead.eyebrow}</p>
          <h1 className="cir-display mt-4 text-[clamp(2rem,4.8vw,3.4rem)]">{masthead.title}</h1>
          <p className="mt-5 max-w-[64ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--cir-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The scrolling word strip. CSS keyframes: no scroll relationship. */
export function CirrusMarquee() {
  const words = CIRRUS_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--cir-rule)] py-3.5">
      <div className="flex w-max animate-[cir-marquee_40s_linear_infinite] gap-12 pr-12">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="cir-mono text-[var(--cir-ink-faint)]">
            {word}
          </span>
        ))}
      </div>
      <style>{`@keyframes cir-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[cir-marquee_40s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** The metric tiles, each with a sparkline. */
export function CirrusMetrics() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <RevealGroup className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CIRRUS_METRICS.map((metric) => (
          <article key={metric.label} className="cir-panel p-5">
            <p className="cir-mono text-[var(--cir-ink-faint)]">{metric.label}</p>
            <p className="cir-display cir-figure mt-2 text-[1.75rem]">
              <Counter
                value={metric.value}
                {...(metric.prefix ? { prefix: metric.prefix } : {})}
                {...(metric.suffix ? { suffix: metric.suffix } : {})}
                {...(metric.decimals ? { decimals: metric.decimals } : {})}
              />
            </p>
            <div className="mt-2">
              <Delta value={metric.delta} />
            </div>
            <ScrollChart
              values={metric.series}
              label={`${metric.label} over twelve periods. Sample data.`}
              className="mt-5 h-12"
            />
          </article>
        ))}
      </RevealGroup>
    </section>
  );
}

/** The narrative band with the bar chart. */
export function CirrusAbout() {
  const { about } = CIRRUS_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 max-w-[58ch] text-[16px] leading-[1.8] text-[var(--cir-ink-soft)]">
              {paragraph}
            </p>
          ))}
          <RevealGroup className="mt-8 border-t border-[var(--cir-rule)]" delay={0.06}>
            {about.points.map((point) => (
              <p key={point} className="flex items-start gap-3 border-b border-[var(--cir-rule)] py-3.5 text-[14.5px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cir-accent)]" aria-hidden />
                {point}
              </p>
            ))}
          </RevealGroup>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="cir-panel p-6">
            <p className="cir-mono text-[var(--cir-ink-faint)]">Unmatched breaks, by month</p>
            <p className="cir-display cir-figure mt-1.5 text-[1.6rem]">
              <Counter value={12} />
              <span className="ml-2 text-[14px] font-normal text-[var(--cir-ink-faint)]">this month</span>
            </p>
            <ScrollBars
              values={CIRRUS_BREAKS_SERIES}
              label="Unmatched breaks falling from 64 to 12 over twelve months. Sample data."
              className="mt-6 h-44"
            />
            <p className="cir-mono mt-4 text-[var(--cir-ink-faint)]">Sample data</p>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}

/** The product capability grid. */
export function CirrusProduct() {
  const { services } = CIRRUS_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {CIRRUS_CAPABILITIES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="border-t border-[var(--cir-rule)] pt-5">
              <Icon className="h-[18px] w-[18px] text-[var(--cir-accent)]" aria-hidden />
              <h3 className="mt-4 text-[15.5px] font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--cir-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The security controls, on the dark band, each mapped to a clause. */
export function CirrusSecurity() {
  const { why } = CIRRUS_CONTENT;
  return (
    <Band dark eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CIRRUS_CONTROLS.map((control) => {
          const Icon = control.icon;
          return (
            <article
              key={control.title}
              className="rounded-[var(--cir-radius-lg)] border border-[var(--cir-on-deep-rule)] bg-[var(--cir-deep-2)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <Icon className="h-[18px] w-[18px] text-[var(--cir-accent-soft)]" aria-hidden />
                <span className="cir-mono text-[var(--cir-on-deep-soft)]">{control.standard}</span>
              </div>
              <h3 className="mt-5 text-[15.5px] font-medium tracking-tight">{control.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--cir-on-deep-soft)]">{control.body}</p>
            </article>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The pricing ladder. */
export function CirrusPricing() {
  return (
    <Band
      eyebrow="Pricing"
      title="Priced on volume, not seats"
      subtitle="Everyone at your company can have a login. You pay for what we reconcile."
    >
      <RevealGroup className="mt-12 grid items-start gap-5 lg:grid-cols-3" step={0.06}>
        {CIRRUS_PLANS.map((plan) => (
          <article
            key={plan.name}
            className={['cir-panel p-7', plan.featured ? 'cir-lift border-[var(--cir-accent)]' : ''].join(' ')}
          >
            {plan.featured && <p className="cir-mono text-[var(--cir-accent)]">Most chosen</p>}
            <h3 className="mt-1 text-[15px] font-medium tracking-tight">{plan.name}</h3>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="cir-display cir-figure text-[2.2rem]">{plan.price}</span>
              <span className="text-[13px] text-[var(--cir-ink-faint)]">{plan.cadence}</span>
            </p>
            <p className="mt-3 text-[14px] leading-[1.7] text-[var(--cir-ink-soft)]">{plan.summary}</p>
            <ul className="mt-6 space-y-2.5 border-t border-[var(--cir-rule)] pt-5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-[14px] leading-[1.6]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--cir-accent)]" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="?page=contact"
              className={[
                'mt-7 inline-flex w-full items-center justify-center gap-2 rounded-[var(--cir-radius)] px-5 py-2.5 text-[14px] font-medium transition-opacity hover:opacity-90',
                plan.featured
                  ? 'bg-[var(--cir-accent)] text-white'
                  : 'border border-[var(--cir-rule-strong)]',
              ].join(' ')}
            >
              {plan.cta}
            </a>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The FAQ. */
export function CirrusFaq() {
  const { faq } = CIRRUS_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--cir-rule)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--cir-rule)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`cir-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[15.5px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--cir-accent)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--cir-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`cir-faq-${i}`} className="max-w-[62ch] pb-6 text-[14.5px] leading-[1.8] text-[var(--cir-ink-soft)]">
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

/** The contact band. The form posts nowhere and says so. */
export function CirrusContact() {
  const { contact } = CIRRUS_CONTENT;
  const [sent, setSent] = useState(false);

  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form
            className="cir-panel space-y-4 p-7"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`cir-${field}`} className="cir-mono block text-[var(--cir-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`cir-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="cir-well mt-2 w-full resize-y px-3.5 py-2.5 text-[15px] text-[var(--cir-ink)]"
                  />
                ) : (
                  <input
                    id={`cir-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="cir-well mt-2 w-full px-3.5 py-2.5 text-[15px] text-[var(--cir-ink)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-[var(--cir-radius)] bg-[var(--cir-ink)] px-5 py-2.5 text-[14.5px] font-medium text-[var(--cir-bg)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13px] text-[var(--cir-accent)]">
              {sent ? 'This is a template. Wire the form to your own endpoint.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--cir-rule)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--cir-rule)] py-4">
              <p className="cir-mono text-[var(--cir-ink-faint)]">{detail.label}</p>
              <p className="mt-1.5 text-[15px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function CirrusFooter() {
  const { footer, brand } = CIRRUS_CONTENT;
  return (
    <footer className="border-t border-[var(--cir-rule)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span aria-hidden className="h-5 w-5 rounded-[5px] bg-[var(--cir-accent)]" />
            {brand}
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--cir-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="cir-mono text-[var(--cir-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--cir-ink-soft)] hover:text-[var(--cir-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--cir-rule)] pt-7 text-[12.5px] text-[var(--cir-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
