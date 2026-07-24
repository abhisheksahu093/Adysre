'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Menu, Minus, Plus, X } from 'lucide-react';
import {
  VESPER_CONTENT,
  VESPER_FACTS,
  VESPER_LABELS,
  VESPER_NAV,
  VESPER_PROJECTS,
  VESPER_SERVICES,
  VESPER_STACK,
  type VesperMasthead as VesperMastheadData,
  type VesperPageId,
} from '@/data/templates/vesper-portfolio-content';
import {
  Counter,
  Line,
  LiftLines,
  MagneticButton,
  Reveal,
  RevealGroup,
  Spotlight,
  TiltCard,
} from './vesper-motion';

/**
 * VESPER - the section library.
 *
 * Every section on every page lives here. Page compositions live in
 * `vesper-pages.tsx`; this file only knows how one band looks.
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
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="ves-mono text-[var(--ves-violet)]">{eyebrow}</p>
        </Reveal>
        <LiftLines className="ves-display mt-6 max-w-4xl text-[clamp(2rem,5vw,3.6rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[58ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--ves-ink-soft)]">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** The header. */
export function VesperHeader({ page }: { page: VesperPageId }) {
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
        'sticky top-0 z-50 transition-colors',
        scrolled ? 'ves-glass' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="ves-display text-[1.2rem]">
          <span className="ves-serif-accent">Vesper</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {VESPER_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'ves-mono transition-colors',
                  current ? 'text-[var(--ves-ink)]' : 'text-[var(--ves-ink-faint)] hover:text-[var(--ves-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <MagneticButton
          href="?page=contact"
          className="ves-mono relative hidden items-center gap-1.5 overflow-hidden rounded-full px-4 py-2.5 text-[var(--ves-bg)] transition-opacity hover:opacity-90 md:inline-flex"
        >
          <span className="pointer-events-none absolute inset-0 rounded-full ves-grad-fill" aria-hidden />
          <span className="relative">{VESPER_LABELS.cta}</span>
        </MagneticButton>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="ves-mobile-nav"
          aria-label={open ? VESPER_LABELS.close : VESPER_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="ves-mobile-nav" aria-label="Primary" className="ves-glass border-t border-[var(--ves-rule)] px-5 py-2 md:hidden">
          {VESPER_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block py-3 text-[15px]',
                item.id === page ? 'text-[var(--ves-ink)]' : 'text-[var(--ves-ink-faint)]',
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

/** The opening screen. The cursor lights a spotlight behind the type. */
export function VesperHero() {
  const { hero } = VESPER_CONTENT;

  return (
    <Spotlight className="relative overflow-hidden rounded-b-[var(--ves-radius)] px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="ves-mono inline-flex items-center gap-2 rounded-full border border-[var(--ves-rule)] px-3 py-1.5 text-[var(--ves-ink-faint)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ves-cyan)]" aria-hidden />
            {VESPER_LABELS.available}
          </p>
        </Reveal>

        <LiftLines as="h1" className="ves-display mt-8 text-[clamp(2.6rem,9vw,7rem)]" delay={0.06}>
          <Line>{hero.title}</Line>
          <Line>
            <span className="ves-serif-accent">{hero.titleAccent}</span>
          </Line>
        </LiftLines>

        <div className="mt-12 grid gap-10 border-t border-[var(--ves-rule)] pt-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Reveal delay={0.2}>
            <p className="max-w-[48ch] text-pretty text-[17px] leading-[1.75] text-[var(--ves-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="flex flex-wrap gap-3">
              <MagneticButton
                href="?page=work"
                className="ves-mono relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[var(--ves-bg)]"
              >
                <span className="pointer-events-none absolute inset-0 ves-grad-fill" aria-hidden />
                <span className="relative">{hero.ctaPrimary}</span>
                <ArrowUpRight className="relative h-3.5 w-3.5" aria-hidden />
              </MagneticButton>
              <MagneticButton
                href="?page=contact"
                className="ves-mono inline-flex items-center rounded-full border border-[var(--ves-rule-strong)] px-6 py-3.5 transition-colors hover:bg-[var(--ves-panel)]"
              >
                {hero.ctaSecondary}
              </MagneticButton>
            </div>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-[var(--ves-rule)] pt-8">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="ves-display text-[clamp(2rem,4.4vw,3rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="ves-mono mt-2 text-[var(--ves-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </Spotlight>
  );
}

/** A page's opening band. */
export function VesperMasthead({ masthead }: { masthead: VesperMastheadData }) {
  return (
    <section className="px-5 pb-6 pt-14 sm:px-8 sm:pb-10 sm:pt-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="ves-mono text-[var(--ves-violet)]">{masthead.eyebrow}</p>
        </Reveal>
        <LiftLines as="h1" className="ves-display mt-6 text-[clamp(2.4rem,7vw,5rem)]" delay={0.05}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-[56ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--ves-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The word strip. CSS keyframes: no scroll relationship. */
export function VesperMarquee() {
  const words = VESPER_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--ves-rule)] py-4">
      <div className="flex w-max animate-[ves-marquee_38s_linear_infinite] gap-10 pr-10">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="ves-mono flex items-center gap-10 text-[var(--ves-ink-faint)]">
            {word}
            <span className="h-1 w-1 rounded-full bg-[var(--ves-violet)]" />
          </span>
        ))}
      </div>
      <style>{`@keyframes ves-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[ves-marquee_38s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** The work grid. Each card tilts toward the cursor. */
export function VesperWork() {
  return (
    <Band
      eyebrow="Selected work"
      title="Things I shipped"
      subtitle="Six projects where the interface was the product. Role, stack and the number that actually moved."
    >
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2" step={0.06}>
        {VESPER_PROJECTS.map((project) => (
          <TiltCard key={project.name}>
            <article className="ves-glass group h-full overflow-hidden rounded-[var(--ves-radius)]">
              <div className={`relative aspect-[16/10] overflow-hidden ves-plate-${project.accent}`}>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <span className="ves-display text-[clamp(2rem,5vw,3.2rem)] leading-none">{project.metric}</span>
                  <span className="ves-mono max-w-[9rem] text-right text-[var(--ves-ink-soft)]">{project.metricLabel}</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="ves-display flex items-center gap-2 text-[1.5rem]">
                    {project.name}
                    <ArrowUpRight className="h-4 w-4 -translate-x-1 text-[var(--ves-cyan)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </h3>
                  <span className="ves-mono text-[var(--ves-ink-faint)]">{project.year}</span>
                </div>
                <p className="ves-mono mt-1 text-[var(--ves-violet)]">{project.role}</p>
                <p className="mt-3 max-w-[46ch] text-[14.5px] leading-[1.7] text-[var(--ves-ink-soft)]">{project.body}</p>
                <ul className="mt-5 flex flex-wrap gap-2 border-t border-[var(--ves-rule)] pt-4">
                  {project.stack.map((tech) => (
                    <li key={tech} className="ves-mono rounded-full border border-[var(--ves-rule)] px-2.5 py-1 text-[var(--ves-ink-faint)]">
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </TiltCard>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The approach, as a glass grid. */
export function VesperApproach() {
  const { why } = VESPER_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
        {why.items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="ves-glass rounded-[var(--ves-radius)] p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full ves-grad-border">
                  <Icon className="h-4 w-4 text-[var(--ves-cyan)]" aria-hidden />
                </span>
                <span className="ves-mono text-[var(--ves-ink-faint)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-5 text-[17px] font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--ves-ink-faint)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The about narrative, with count-up figures. */
export function VesperAbout() {
  const { about } = VESPER_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 max-w-[52ch] text-[16.5px] leading-[1.85] text-[var(--ves-ink-soft)]">
              {paragraph}
            </p>
          ))}
        </Reveal>
        <RevealGroup className="border-t border-[var(--ves-rule)]" delay={0.08}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-3 border-b border-[var(--ves-rule)] py-4 text-[15px]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ves-cyan)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>

      <Reveal className="mt-16 grid grid-cols-2 gap-8 border-t border-[var(--ves-rule)] pt-10 lg:grid-cols-4">
        {VESPER_FACTS.map((fact) => (
          <div key={fact.label}>
            <p className="ves-display text-[clamp(1.9rem,3.6vw,2.8rem)] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="ves-mono mt-2 text-[var(--ves-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </Band>
  );
}

/** The four capabilities. */
export function VesperServices() {
  const { services } = VESPER_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" step={0.07}>
        {VESPER_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article key={service.title} className="ves-glass rounded-[var(--ves-radius)] p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full ves-grad-border">
                <Icon className="h-5 w-5 text-[var(--ves-cyan)]" aria-hidden />
              </span>
              <h3 className="ves-display mt-5 text-[1.5rem]">{service.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-[var(--ves-ink-soft)]">{service.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-[var(--ves-rule)] pt-5">
                {service.deliverables.map((item) => (
                  <li key={item} className="ves-mono rounded-full border border-[var(--ves-rule)] px-2.5 py-1 text-[var(--ves-ink-faint)]">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The grouped tech stack. */
export function VesperStack() {
  return (
    <Band eyebrow="Stack" title="What I reach for" subtitle="The tools I know well enough to know their limits.">
      <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2" step={0.06}>
        {VESPER_STACK.map((group) => (
          <div key={group.title} className="ves-glass rounded-[var(--ves-radius)] p-7">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="ves-display text-[1.4rem]">{group.title}</h3>
              <span className="ves-mono text-[var(--ves-ink-faint)]">{group.note}</span>
            </div>
            <ul className="mt-5 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="ves-mono rounded-full border border-[var(--ves-rule)] bg-[var(--ves-panel)] px-3 py-1.5 text-[var(--ves-ink-soft)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The FAQ. */
export function VesperFaq() {
  const { faq } = VESPER_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--ves-rule)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--ves-rule)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`ves-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--ves-cyan)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--ves-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`ves-faq-${i}`} className="max-w-[60ch] pb-6 text-[15px] leading-[1.85] text-[var(--ves-ink-soft)]">
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
export function VesperContact() {
  const { contact } = VESPER_CONTENT;
  const [sent, setSent] = useState(false);

  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form
            className="ves-glass space-y-6 rounded-[var(--ves-radius)] p-7"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`ves-${field}`} className="ves-mono block text-[var(--ves-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`ves-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y rounded-[10px] border border-[var(--ves-rule)] bg-[var(--ves-panel)] px-4 py-3 text-[16px] text-[var(--ves-ink)] focus:border-[var(--ves-cyan)]"
                  />
                ) : (
                  <input
                    id={`ves-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full rounded-[10px] border border-[var(--ves-rule)] bg-[var(--ves-panel)] px-4 py-3 text-[16px] text-[var(--ves-ink)] focus:border-[var(--ves-cyan)]"
                  />
                )}
              </div>
            ))}

            <MagneticButton
              as="button"
              type="submit"
              className="ves-mono relative inline-flex items-center gap-2 overflow-hidden rounded-full px-6 py-3.5 text-[var(--ves-bg)]"
            >
              <span className="pointer-events-none absolute inset-0 ves-grad-fill" aria-hidden />
              <span className="relative">{contact.submit}</span>
              <ArrowUpRight className="relative h-3.5 w-3.5" aria-hidden />
            </MagneticButton>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--ves-cyan)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--ves-rule)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--ves-rule)] py-5">
              <p className="ves-mono text-[var(--ves-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function VesperFooter() {
  const { footer, brand } = VESPER_CONTENT;
  return (
    <footer className="border-t border-[var(--ves-rule)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="ves-display text-[1.6rem]">
            <span className="ves-serif-accent">{brand}</span>
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--ves-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="ves-mono text-[var(--ves-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--ves-ink-soft)] hover:text-[var(--ves-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--ves-rule)] pt-7 text-[12.5px] text-[var(--ves-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
