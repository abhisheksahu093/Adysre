'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Check, Menu, Minus, Plus, Triangle, X } from 'lucide-react';
import {
  CRESTLINE_CHECKS,
  CRESTLINE_CONTENT,
  CRESTLINE_HERO_STAT,
  CRESTLINE_LABELS,
  CRESTLINE_NAV,
  CRESTLINE_ORBIT,
  CRESTLINE_SERVICES,
  CRESTLINE_STATS,
  CRESTLINE_STEP_ICONS,
  CRESTLINE_STEPS,
  CRESTLINE_VALUES,
  type CrestlineMasthead as CrestlineMastheadData,
  type CrestlinePageId,
} from '@/data/templates/crestline-advisory-content';
import { Counter, Line, LiftLines, Reveal, RevealGroup } from './crestline-motion';

/**
 * CRESTLINE - the section library.
 *
 * A single-page site: every section lives here and the page is composed in
 * `crestline-template.tsx`. No section holds copy - everything reads from the
 * content module. Navigation is by in-page hash anchors, not routes.
 */

/** The shell most bands share. */
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
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="crl-mono inline-flex items-center gap-2 rounded-full border border-[var(--crl-line)] bg-[var(--crl-panel)] px-3 py-1 text-[var(--crl-green)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--crl-green)]" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className="crl-display mt-5 max-w-4xl text-[clamp(1.9rem,4.6vw,3.2rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[60ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--crl-ink-soft)]">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** The brand lockup: a green peak mark beside the wordmark. */
function BrandMark() {
  return (
    <a href="?page=home" className="flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--crl-green)]" aria-hidden>
        <Triangle className="h-4 w-4 fill-white text-white" />
      </span>
      <span className="leading-none">
        <span className="crl-display block text-[1.15rem]">{CRESTLINE_CONTENT.brand}</span>
        <span className="crl-mono block text-[0.58rem] text-[var(--crl-green)]">Management</span>
      </span>
    </a>
  );
}

/** The header. */
export function CrestlineHeader({ page }: { page: CrestlinePageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
        scrolled
          ? 'border-b border-[var(--crl-line)] bg-[color-mix(in_srgb,var(--crl-bg)_82%,transparent)] backdrop-blur-md'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {CRESTLINE_NAV.map((item) => {
            const active = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={active ? 'page' : undefined}
                className={[
                  'rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors',
                  active
                    ? 'bg-[var(--crl-green-soft)] text-[var(--crl-green)]'
                    : 'text-[var(--crl-ink-soft)] hover:text-[var(--crl-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="?page=contact"
          className="hidden items-center gap-2 rounded-full bg-[var(--crl-green)] px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-[var(--crl-green-deep)] md:inline-flex"
        >
          {CRESTLINE_LABELS.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="crl-mobile-nav"
          aria-label={open ? CRESTLINE_LABELS.close : CRESTLINE_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="crl-mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--crl-line)] bg-[var(--crl-bg)] px-5 py-2 md:hidden"
        >
          {CRESTLINE_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-[15px] text-[var(--crl-ink-soft)]"
            >
              {item.label}
            </a>
          ))}
          <a
            href="?page=contact"
            onClick={() => setOpen(false)}
            className="my-2 inline-flex items-center gap-2 rounded-full bg-[var(--crl-green)] px-5 py-2.5 text-[14px] font-medium text-white"
          >
            {CRESTLINE_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}

/** The orbit figure: rings, floating pills, an orbiting dot, a central card. */
function OrbitFigure() {
  const stat = CRESTLINE_HERO_STAT;
  const positions = ['-left-2 top-[16%] crl-float', '-right-3 top-[44%] crl-float-slow', 'left-[22%] -bottom-1 crl-float'];
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden>
      <div className="crl-ring absolute inset-0" />
      <div className="crl-ring absolute inset-[15%]" />
      <div className="crl-ring absolute inset-[30%]" />

      <div className="crl-orbit-spin absolute inset-0">
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-[var(--crl-green)] shadow-[0_0_0_6px_var(--crl-green-soft)]" />
      </div>

      <div className="absolute left-1/2 top-1/2 w-36 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--crl-line)] bg-white p-5 text-center shadow-xl shadow-[rgb(21_126_73/10%)]">
        <p className="crl-mono text-[var(--crl-ink-faint)]">{stat.brand}</p>
        <p className="crl-display mt-1 text-[2.4rem] text-[var(--crl-green)]">
          <Counter value={stat.value} suffix={stat.suffix} />
        </p>
        <p className="mt-0.5 text-[12.5px] text-[var(--crl-ink-faint)]">{stat.caption}</p>
      </div>

      {CRESTLINE_ORBIT.map((pill, i) => {
        const Icon = pill.icon;
        return (
          <div
            key={pill.label}
            className={`absolute flex items-center gap-2 rounded-full border border-[var(--crl-line)] bg-white px-3.5 py-2 shadow-lg shadow-[rgb(14_26_19/6%)] ${positions[i]}`}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--crl-green-soft)]">
              <Icon className="h-3.5 w-3.5 text-[var(--crl-green)]" />
            </span>
            <span className="whitespace-nowrap text-[12.5px] font-medium">{pill.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/** The opening screen. */
export function CrestlineHero() {
  const { hero } = CRESTLINE_CONTENT;
  return (
    <section id="top" className="crl-particles relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="crl-mono inline-flex items-center gap-2 rounded-full border border-[var(--crl-line)] bg-[color-mix(in_srgb,var(--crl-panel)_70%,transparent)] px-3.5 py-1.5 text-[var(--crl-green)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--crl-green)]" aria-hidden />
              {hero.badge}
            </p>
          </Reveal>

          <LiftLines as="h1" className="crl-display mt-7 text-[clamp(3rem,8vw,5.5rem)]" delay={0.06}>
            <Line>{hero.title}</Line>
            <Line>
              <span className="crl-accent">{hero.titleAccent}</span>
            </Line>
          </LiftLines>

          <Reveal delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-pretty text-[17px] leading-[1.75] text-[var(--crl-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="?page=contact"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--crl-green)] px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[var(--crl-green-deep)]"
              >
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="?page=services"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--crl-line-strong)] px-6 py-3.5 text-[14.5px] font-medium transition-colors hover:bg-[var(--crl-panel)]"
              >
                {hero.ctaSecondary}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {CRESTLINE_CHECKS.map((check) => (
                <li key={check} className="flex items-center gap-2 text-[14px] text-[var(--crl-ink-soft)]">
                  <Check className="h-4 w-4 text-[var(--crl-green)]" aria-hidden />
                  {check}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <OrbitFigure />
        </Reveal>
      </div>
    </section>
  );
}

/** The trusted-by marquee. */
export function CrestlineMarquee() {
  const words = CRESTLINE_CONTENT.marquee;
  return (
    <section className="border-y border-[var(--crl-line)] bg-[var(--crl-panel)] py-10">
      <p className="crl-mono mb-6 text-center text-[var(--crl-ink-faint)]">Built for modern commerce teams</p>
      <div aria-hidden className="overflow-hidden">
        <div className="crl-marquee crl-display flex w-max items-center gap-14 pr-14 text-[clamp(1.1rem,2.4vw,1.6rem)] text-[var(--crl-ink-faint)]">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="whitespace-nowrap">
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The page header that opens every page except home. */
export function CrestlineMasthead({ masthead }: { masthead: CrestlineMastheadData }) {
  return (
    <section id="top" className="crl-particles relative isolate overflow-hidden px-5 pb-14 pt-36 sm:px-8 sm:pb-16 sm:pt-44">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="crl-mono inline-flex items-center gap-2 rounded-full border border-[var(--crl-line)] bg-[color-mix(in_srgb,var(--crl-panel)_70%,transparent)] px-3.5 py-1.5 text-[var(--crl-green)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--crl-green)]" aria-hidden />
            {masthead.eyebrow}
          </p>
        </Reveal>
        <LiftLines as="h1" className="crl-display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.2rem)]" delay={0.04}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.75] text-[var(--crl-ink-soft)]">{masthead.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** The four principles, for the About page. */
export function CrestlineValues() {
  return (
    <Band eyebrow="Our values" title="Four principles that shape every engagement.">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {CRESTLINE_VALUES.map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title} className="rounded-[var(--crl-radius)] border border-[var(--crl-line)] bg-[var(--crl-panel)] p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--crl-green-soft)]">
                <Icon className="h-5 w-5 text-[var(--crl-green)]" aria-hidden />
              </span>
              <h3 className="crl-display mt-5 text-[1.3rem]">{value.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--crl-ink-soft)]">{value.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The approach band with the four-step process. */
export function CrestlineAbout() {
  const { about } = CRESTLINE_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-14 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 max-w-[54ch] text-[16.5px] leading-[1.85] text-[var(--crl-ink-soft)]">
              {paragraph}
            </p>
          ))}
          <RevealGroup className="mt-2" delay={0.06}>
            {about.points.map((point) => (
              <p key={point} className="flex items-start gap-3 py-2 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--crl-green)]" aria-hidden />
                {point}
              </p>
            ))}
          </RevealGroup>
        </Reveal>

        <RevealGroup className="relative border-l border-[var(--crl-line)] pl-8" step={0.08}>
          {CRESTLINE_STEPS.map((step, i) => {
            const Icon = CRESTLINE_STEP_ICONS[i]!;
            return (
              <div key={step.title} className="relative pb-8 last:pb-0">
                <span className="absolute -left-[3.05rem] inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--crl-line)] bg-white text-[var(--crl-green)]">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <p className="crl-mono text-[var(--crl-ink-faint)]">{`0${i + 1}`}</p>
                <h3 className="crl-display mt-1 text-[1.35rem]">{step.title}</h3>
                <p className="mt-2 max-w-[42ch] text-[14.5px] leading-[1.7] text-[var(--crl-ink-soft)]">{step.body}</p>
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The numbered services. */
export function CrestlineServices() {
  const { services } = CRESTLINE_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="services">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2" step={0.07}>
        {CRESTLINE_SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <a
              key={service.title}
              href="?page=contact"
              className="group flex flex-col rounded-[var(--crl-radius)] border border-[var(--crl-line)] bg-[var(--crl-panel)] p-7 transition-colors hover:border-[var(--crl-green)]"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--crl-green-soft)]">
                  <Icon className="h-5 w-5 text-[var(--crl-green)]" aria-hidden />
                </span>
                <span className="crl-display text-[1.5rem] text-[var(--crl-line-strong)]">{`0${i + 1}`}</span>
              </div>
              <h3 className="crl-display mt-6 text-[1.5rem]">{service.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-[var(--crl-ink-soft)]">{service.body}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--crl-green)]">
                Learn more
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </a>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The dark "why" panel: counters and reasons. */
export function CrestlineWhy() {
  const { why } = CRESTLINE_CONTENT;
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[var(--crl-radius)] bg-[var(--crl-dark)] px-6 py-16 text-white sm:px-12">
        <Reveal>
          <p className="crl-mono inline-flex items-center gap-2 text-[color-mix(in_srgb,var(--crl-green)_80%,white)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--crl-green)]" aria-hidden />
            {why.eyebrow}
          </p>
        </Reveal>
        <LiftLines className="crl-display mt-5 max-w-3xl text-[clamp(1.8rem,4vw,3rem)]" delay={0.04}>
          <Line>{why.title}</Line>
        </LiftLines>

        <RevealGroup className="mt-12 grid grid-cols-2 gap-8 border-b border-white/10 pb-12 lg:grid-cols-4" step={0.08}>
          {CRESTLINE_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="crl-display text-[clamp(2.4rem,5vw,3.4rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="crl-mono mt-2 text-[var(--crl-dark-soft)]">{stat.label}</p>
            </div>
          ))}
        </RevealGroup>

        <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
          {why.items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5 text-[color-mix(in_srgb,var(--crl-green)_80%,white)]" aria-hidden />
                </span>
                <h3 className="crl-display mt-5 text-[1.3rem]">{item.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.7] text-[var(--crl-dark-soft)]">{item.body}</p>
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}

/** The FAQ. */
export function CrestlineFaq() {
  const { faq } = CRESTLINE_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--crl-line)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--crl-line)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`crl-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--crl-green)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--crl-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`crl-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.85] text-[var(--crl-ink-soft)]">
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

/** The contact CTA with a form. */
export function CrestlineContact() {
  const { contact } = CRESTLINE_CONTENT;
  const [sent, setSent] = useState(false);

  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`crl-${field}`} className="crl-mono block text-[var(--crl-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`crl-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y rounded-[12px] border border-[var(--crl-line)] bg-[var(--crl-panel)] px-4 py-3 text-[16px] text-[var(--crl-ink)] focus:border-[var(--crl-green)]"
                  />
                ) : (
                  <input
                    id={`crl-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full rounded-[12px] border border-[var(--crl-line)] bg-[var(--crl-panel)] px-4 py-3 text-[16px] text-[var(--crl-ink)] focus:border-[var(--crl-green)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--crl-green)] px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[var(--crl-green-deep)]"
            >
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--crl-green)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--crl-line)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--crl-line)] py-5">
              <p className="crl-mono text-[var(--crl-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function CrestlineFooter() {
  const { footer } = CRESTLINE_CONTENT;
  return (
    <footer className="border-t border-[var(--crl-line)] bg-[var(--crl-panel)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.7] text-[var(--crl-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="crl-mono text-[var(--crl-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--crl-ink-soft)] hover:text-[var(--crl-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--crl-line)] pt-7 text-[12.5px] text-[var(--crl-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
