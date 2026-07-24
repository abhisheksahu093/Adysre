'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Menu, Minus, Plus, X } from 'lucide-react';
import {
  PRISM_CONTENT,
  PRISM_FACTS,
  PRISM_LABELS,
  PRISM_NAV,
  PRISM_PROCESS,
  PRISM_PROJECTS,
  PRISM_SERVICES,
  type PrismMasthead,
  type PrismPageId,
} from '@/data/templates/prism-studio-content';
import {
  Counter,
  Line,
  LiftLines,
  MotionPathTrack,
  Reveal,
  RevealGroup,
  ScrollRail,
} from './prism-motion';

/**
 * PRISM - the section library.
 *
 * Every section on every page lives here. Page compositions live in
 * `prism-pages.tsx`; this file only knows how one band looks.
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
          <p className="pri-mono text-[var(--pri-acid)]">{eyebrow}</p>
        </Reveal>
        <LiftLines className="pri-display mt-6 max-w-4xl text-[clamp(2rem,5.4vw,4rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[58ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--pri-ink-soft)]">
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
export function PrismHeader({ page }: { page: PrismPageId }) {
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
        'sticky top-0 z-50 bg-[var(--pri-bg)] transition-colors',
        scrolled ? 'border-b border-[var(--pri-rule)]' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="pri-display text-[1.15rem]">
          Prism
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {PRISM_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'pri-mono transition-colors',
                  current ? 'text-[var(--pri-acid)]' : 'text-[var(--pri-ink-faint)] hover:text-[var(--pri-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="?page=contact"
          className="pri-mono hidden rounded-[var(--pri-radius)] bg-[var(--pri-acid)] px-4 py-2.5 text-[var(--pri-bg)] transition-opacity hover:opacity-90 md:inline-block"
        >
          Start something
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="pri-mobile-nav"
          aria-label={open ? PRISM_LABELS.close : PRISM_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="pri-mobile-nav" aria-label="Primary" className="border-t border-[var(--pri-rule)] px-5 py-2 md:hidden">
          {PRISM_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block py-3 text-[15px]',
                item.id === page ? 'text-[var(--pri-acid)]' : 'text-[var(--pri-ink-faint)]',
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

/** The opening screen. Type is the layout. */
export function PrismHero() {
  const { hero } = PRISM_CONTENT;

  return (
    <section className="px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="pri-mono text-[var(--pri-ink-faint)]">{hero.badge}</p>
        </Reveal>

        <LiftLines as="h1" className="pri-display mt-8 text-[clamp(3rem,12vw,9rem)]" delay={0.06}>
          <Line>{hero.title}</Line>
          <Line>
            <span className="pri-serif-accent text-[var(--pri-acid)]">{hero.titleAccent}</span>
          </Line>
        </LiftLines>

        <div className="mt-12 grid gap-10 border-t border-[var(--pri-rule)] pt-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Reveal delay={0.2}>
            <p className="max-w-[48ch] text-pretty text-[17px] leading-[1.75] text-[var(--pri-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="flex flex-wrap gap-3">
              <a
                href="?page=work"
                className="pri-mono inline-flex items-center gap-2 rounded-[var(--pri-radius)] bg-[var(--pri-acid)] px-6 py-3.5 text-[var(--pri-bg)] transition-opacity hover:opacity-90"
              >
                {hero.ctaPrimary}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href="?page=contact"
                className="pri-mono inline-flex items-center rounded-[var(--pri-radius)] border border-[var(--pri-rule-strong)] px-6 py-3.5 transition-colors hover:bg-[var(--pri-bg-2)]"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-[var(--pri-rule)] pt-8">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="pri-display text-[clamp(2rem,4.4vw,3rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="pri-mono mt-2 text-[var(--pri-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A page's opening band. */
export function PrismMasthead({ masthead }: { masthead: PrismMasthead }) {
  return (
    <section className="px-5 pb-6 pt-14 sm:px-8 sm:pb-10 sm:pt-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="pri-mono text-[var(--pri-acid)]">{masthead.eyebrow}</p>
        </Reveal>
        <LiftLines as="h1" className="pri-display mt-6 text-[clamp(2.4rem,7vw,5rem)]" delay={0.05}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-[56ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--pri-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The word strip. CSS keyframes: no scroll relationship. */
export function PrismMarquee() {
  const words = PRISM_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--pri-rule)] py-4">
      <div className="flex w-max animate-[pri-marquee_34s_linear_infinite] gap-12 pr-12">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="pri-mono text-[var(--pri-ink-faint)]">
            {word}
          </span>
        ))}
      </div>
      <style>{`@keyframes pri-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[pri-marquee_34s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/**
 * The work rail: vertical scroll turned into horizontal travel.
 *
 * The section is 320vh so there is scroll distance to spend; the row inside is
 * sticky and translated on the playhead. Under reduced motion it degrades to an
 * ordinary scrollable row (see prism.css), so nothing becomes unreachable.
 */
export function PrismWorkRail() {
  return (
    <section aria-labelledby="pri-work-title" className="relative">
      <div className="px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="pri-mono text-[var(--pri-acid)]">Selected work</p>
          </Reveal>
          <LiftLines
            as="h2"
            id="pri-work-title"
            className="pri-display mt-6 text-[clamp(2rem,5.4vw,4rem)]"
            delay={0.04}
          >
            <Line>Eight we would</Line>
            <Line>
              show you <span className="pri-serif-accent text-[var(--pri-acid)]">in a room</span>
            </Line>
          </LiftLines>
        </div>
      </div>

      <ScrollRail className="relative h-[320vh]">
        {PRISM_PROJECTS.map((project) => (
          <article
            key={project.name}
            className="w-[78vw] shrink-0 sm:w-[46vw] lg:w-[32vw]"
          >
            <div className={`pri-grain relative aspect-[4/5] overflow-hidden rounded-[var(--pri-radius)] ${project.plate}`} />
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="pri-display text-[1.5rem]">{project.name}</h3>
              <span className="pri-mono text-[var(--pri-ink-faint)]">{project.year}</span>
            </div>
            <p className="pri-mono mt-1.5 text-[var(--pri-ink-faint)]">{project.client}</p>
            <p className="mt-3 max-w-[38ch] text-[14.5px] leading-[1.7] text-[var(--pri-ink-soft)]">
              {project.body}
            </p>
            <p className="mt-4 flex flex-wrap gap-2">
              {project.disciplines.map((discipline) => (
                <span
                  key={discipline}
                  className="pri-mono rounded-full border border-[var(--pri-rule)] px-2.5 py-1 text-[var(--pri-ink-faint)]"
                >
                  {discipline}
                </span>
              ))}
            </p>
          </article>
        ))}
      </ScrollRail>
    </section>
  );
}

/** The work list. The rail's accessible, ordinary twin, used on the work page. */
export function PrismWorkList() {
  return (
    <Band
      eyebrow="Index"
      title="Every project, listed"
      subtitle="The same eight, as a list rather than a rail — because sometimes you want to scan rather than travel."
    >
      <RevealGroup className="mt-12 border-t border-[var(--pri-rule)]" step={0.04}>
        {PRISM_PROJECTS.map((project) => (
          <article
            key={project.name}
            className="grid gap-3 border-b border-[var(--pri-rule)] py-6 sm:grid-cols-[1fr_1fr_auto] sm:items-baseline sm:gap-8"
          >
            <h3 className="pri-display text-[1.4rem]">{project.name}</h3>
            <p className="text-[14.5px] text-[var(--pri-ink-soft)]">{project.client}</p>
            <p className="pri-mono text-[var(--pri-ink-faint)]">
              {project.disciplines.join(' · ')} · {project.year}
            </p>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The process, plotted along the motion path. */
export function PrismProcess() {
  const { why } = PRISM_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title="Four steps, in this order" subtitle={why.subtitle}>
      <MotionPathTrack steps={PRISM_PROCESS} className="mt-14" />
    </Band>
  );
}

/** The studio narrative. */
export function PrismStudio() {
  const { about } = PRISM_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 max-w-[52ch] text-[16.5px] leading-[1.85] text-[var(--pri-ink-soft)]">
              {paragraph}
            </p>
          ))}
        </Reveal>
        <RevealGroup className="border-t border-[var(--pri-rule)]" delay={0.08}>
          {about.points.map((point) => (
            <p key={point} className="border-b border-[var(--pri-rule)] py-4 text-[15px]">
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>

      <Reveal className="mt-16 grid grid-cols-2 gap-8 border-t border-[var(--pri-rule)] pt-10 lg:grid-cols-4">
        {PRISM_FACTS.map((fact) => (
          <div key={fact.label}>
            <p className="pri-display text-[clamp(1.9rem,3.6vw,2.8rem)] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="pri-mono mt-2 text-[var(--pri-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </Band>
  );
}

/** The four services, with deliverables. */
export function PrismServices() {
  const { services } = PRISM_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" step={0.07}>
        {PRISM_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="rounded-[var(--pri-radius)] border border-[var(--pri-rule)] bg-[var(--pri-bg-2)] p-7"
            >
              <Icon className="h-5 w-5 text-[var(--pri-acid)]" aria-hidden />
              <h3 className="pri-display mt-5 text-[1.5rem]">{service.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-[var(--pri-ink-soft)]">{service.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-[var(--pri-rule)] pt-5">
                {service.deliverables.map((item) => (
                  <li key={item} className="pri-mono rounded-full border border-[var(--pri-rule)] px-2.5 py-1 text-[var(--pri-ink-faint)]">
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

/** The FAQ. */
export function PrismFaq() {
  const { faq } = PRISM_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--pri-rule)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--pri-rule)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`pri-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--pri-acid)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--pri-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`pri-faq-${i}`} className="max-w-[60ch] pb-6 text-[15px] leading-[1.85] text-[var(--pri-ink-soft)]">
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
export function PrismContact() {
  const { contact } = PRISM_CONTENT;
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
                <label htmlFor={`pri-${field}`} className="pri-mono block text-[var(--pri-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`pri-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y border-b border-[var(--pri-rule)] bg-transparent pb-3 text-[16px] text-[var(--pri-ink)] focus:border-[var(--pri-acid)]"
                  />
                ) : (
                  <input
                    id={`pri-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full border-b border-[var(--pri-rule)] bg-transparent pb-3 text-[16px] text-[var(--pri-ink)] focus:border-[var(--pri-acid)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="pri-mono inline-flex items-center gap-2 rounded-[var(--pri-radius)] bg-[var(--pri-acid)] px-6 py-3.5 text-[var(--pri-bg)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--pri-acid)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--pri-rule)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--pri-rule)] py-5">
              <p className="pri-mono text-[var(--pri-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function PrismFooter() {
  const { footer, brand } = PRISM_CONTENT;
  return (
    <footer className="border-t border-[var(--pri-rule)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="pri-display text-[1.6rem]">{brand}</p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--pri-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="pri-mono text-[var(--pri-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--pri-ink-soft)] hover:text-[var(--pri-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--pri-rule)] pt-7 text-[12.5px] text-[var(--pri-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
