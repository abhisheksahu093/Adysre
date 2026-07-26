'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Menu, Minus, Plus, X } from 'lucide-react';
import {
  NOCTIS_CONTENT,
  NOCTIS_FACTS,
  NOCTIS_JOURNAL,
  NOCTIS_LABELS,
  NOCTIS_NAV,
  NOCTIS_SERIES,
  NOCTIS_SERVICES,
  type NoctisMasthead as NoctisMastheadData,
  type NoctisPageId,
} from '@/data/templates/noctis-folio-content';
import {
  Counter,
  CurtainReveal,
  LetterCascade,
  Line,
  LiftLines,
  Reveal,
  RevealGroup,
  FilmStrip,
} from './noctis-motion';

/**
 * NOCTIS - the section library.
 *
 * Every section on every page lives here. Page compositions live in
 * `noctis-pages.tsx`; this file only knows how one band looks.
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
          <p className="noc-mono text-[var(--noc-amber)]">{eyebrow}</p>
        </Reveal>
        <LiftLines className="noc-display mt-6 max-w-4xl text-[clamp(2rem,5.2vw,3.8rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[58ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--noc-ink-soft)]">
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
export function NoctisHeader({ page }: { page: NoctisPageId }) {
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
        'sticky top-0 z-50 backdrop-blur-md transition-colors',
        scrolled
          ? 'border-b border-[var(--noc-rule)] bg-[color-mix(in_srgb,var(--noc-bg)_86%,transparent)]'
          : 'border-b border-transparent bg-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="noc-display text-[1.15rem] tracking-[-0.02em]">
          Noctis<span className="text-[var(--noc-amber)]">.</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NOCTIS_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'noc-mono transition-colors',
                  current ? 'text-[var(--noc-amber)]' : 'text-[var(--noc-ink-faint)] hover:text-[var(--noc-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="?page=contact"
          className="noc-mono hidden items-center gap-1.5 rounded-[var(--noc-radius)] bg-[var(--noc-amber)] px-4 py-2.5 text-[var(--noc-bg)] transition-opacity hover:opacity-90 md:inline-flex"
        >
          {NOCTIS_LABELS.cta}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="noc-mobile-nav"
          aria-label={open ? NOCTIS_LABELS.close : NOCTIS_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="noc-mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--noc-rule)] bg-[var(--noc-bg)] px-5 py-2 md:hidden"
        >
          {NOCTIS_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block py-3 text-[15px]',
                item.id === page ? 'text-[var(--noc-amber)]' : 'text-[var(--noc-ink-faint)]',
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

/** The opening screen. The headline cascades letter by letter. */
export function NoctisHero() {
  const { hero } = NOCTIS_CONTENT;

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      {/* A single full-bleed plate behind the type, drawn open on load. */}
      <CurtainReveal
        from="bottom"
        className="noc-grain pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] noc-plate-c opacity-70"
      >
        <span className="sr-only">Decorative night field</span>
      </CurtainReveal>

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="noc-mono text-[var(--noc-ink-faint)]">{hero.badge}</p>
        </Reveal>

        <h1 className="noc-display mt-8 text-[clamp(2.8rem,11vw,8.5rem)]">
          <LetterCascade as="span" className="block" text={hero.title} delay={0.05} />
          <span className="noc-serif-accent block text-[var(--noc-amber)]">
            <LetterCascade as="span" text={hero.titleAccent} delay={0.28} />
          </span>
        </h1>

        <div className="mt-12 grid gap-10 border-t border-[var(--noc-rule)] pt-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Reveal delay={0.2}>
            <p className="max-w-[48ch] text-pretty text-[17px] leading-[1.75] text-[var(--noc-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="flex flex-wrap gap-3">
              <a
                href="?page=work"
                className="noc-mono inline-flex items-center gap-2 rounded-[var(--noc-radius)] bg-[var(--noc-amber)] px-6 py-3.5 text-[var(--noc-bg)] transition-opacity hover:opacity-90"
              >
                {hero.ctaPrimary}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href="?page=contact"
                className="noc-mono inline-flex items-center rounded-[var(--noc-radius)] border border-[var(--noc-rule-strong)] px-6 py-3.5 transition-colors hover:bg-[var(--noc-bg-2)]"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-[var(--noc-rule)] pt-8">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="noc-display text-[clamp(2rem,4.4vw,3rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="noc-mono mt-2 text-[var(--noc-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A page's opening band. */
export function NoctisMasthead({ masthead }: { masthead: NoctisMastheadData }) {
  return (
    <section className="px-5 pb-6 pt-14 sm:px-8 sm:pb-10 sm:pt-20">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="noc-mono text-[var(--noc-amber)]">{masthead.eyebrow}</p>
        </Reveal>
        <LiftLines as="h1" className="noc-display mt-6 text-[clamp(2.4rem,7vw,5rem)]" delay={0.05}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-[56ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--noc-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The word strip. CSS keyframes: no scroll relationship. */
export function NoctisMarquee() {
  const words = NOCTIS_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--noc-rule)] py-4">
      <div className="flex w-max animate-[noc-marquee_36s_linear_infinite] gap-12 pr-12">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="noc-mono text-[var(--noc-ink-faint)]">
            {word}
            <span className="ml-12 text-[var(--noc-amber)]">/</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes noc-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[noc-marquee_36s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/**
 * The film strip: vertical scroll turned into horizontal travel, with each
 * plate drawn open by a curtain wipe as it enters.
 *
 * The section is 340vh so there is scroll distance to spend; the strip inside
 * is sticky and translated on the playhead. Under reduced motion it degrades to
 * an ordinary scrollable row (see noctis.css), so nothing becomes unreachable.
 */
export function NoctisFilmStrip() {
  return (
    <section aria-labelledby="noc-strip-title" className="relative">
      <div className="px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="noc-mono text-[var(--noc-amber)]">Selected series</p>
          </Reveal>
          <LiftLines
            as="h2"
            id="noc-strip-title"
            className="noc-display mt-6 text-[clamp(2rem,5.2vw,3.8rem)]"
            delay={0.04}
          >
            <Line>Eight places I</Line>
            <Line>
              kept <span className="noc-serif-accent text-[var(--noc-amber)]">returning to</span>
            </Line>
          </LiftLines>
        </div>
      </div>

      <FilmStrip className="relative h-[340vh]">
        {NOCTIS_SERIES.map((series, i) => (
          <article key={series.name} className="w-[80vw] shrink-0 sm:w-[48vw] lg:w-[34vw]">
            <CurtainReveal from={i % 2 === 0 ? 'bottom' : 'left'}>
              <div className={`noc-grain relative aspect-[4/5] overflow-hidden rounded-[var(--noc-radius)] ${series.plate}`}>
                <span className="noc-mono absolute left-4 top-4 text-[var(--noc-ink)]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="noc-mono absolute bottom-4 right-4 text-[var(--noc-ink-faint)]">
                  {series.frames}
                </span>
              </div>
            </CurtainReveal>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <h3 className="noc-display text-[1.6rem]">{series.name}</h3>
              <span className="noc-mono text-[var(--noc-ink-faint)]">
                {series.place} · {series.year}
              </span>
            </div>
            <p className="mt-3 max-w-[38ch] text-[14.5px] leading-[1.7] text-[var(--noc-ink-soft)]">
              {series.body}
            </p>
            <p className="mt-4 flex flex-wrap gap-2">
              {series.tags.map((tag) => (
                <span
                  key={tag}
                  className="noc-mono rounded-full border border-[var(--noc-rule)] px-2.5 py-1 text-[var(--noc-ink-faint)]"
                >
                  {tag}
                </span>
              ))}
            </p>
          </article>
        ))}
      </FilmStrip>
    </section>
  );
}

/** The series list. The strip's accessible, ordinary twin, used on the work page. */
export function NoctisSeriesList() {
  return (
    <Band
      eyebrow="Index"
      title="Every series, listed"
      subtitle="The same eight, as a list rather than a strip — because sometimes you want to scan for the one you half-remember."
    >
      <RevealGroup className="mt-12 border-t border-[var(--noc-rule)]" step={0.04}>
        {NOCTIS_SERIES.map((series) => (
          <article
            key={series.name}
            className="group grid gap-3 border-b border-[var(--noc-rule)] py-6 transition-colors hover:bg-[var(--noc-bg-2)] sm:grid-cols-[1fr_1fr_auto] sm:items-baseline sm:gap-8"
          >
            <h3 className="noc-display flex items-center gap-3 text-[1.4rem]">
              {series.name}
              <ArrowUpRight className="h-4 w-4 -translate-x-1 text-[var(--noc-amber)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
            </h3>
            <p className="text-[14.5px] text-[var(--noc-ink-soft)]">
              {series.place} — {series.frames}
            </p>
            <p className="noc-mono text-[var(--noc-ink-faint)]">
              {series.tags.join(' · ')} · {series.year}
            </p>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The approach, as a numbered grid. */
export function NoctisApproach() {
  const { why } = NOCTIS_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[var(--noc-radius)] border border-[var(--noc-rule)] bg-[var(--noc-rule)] sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
        {why.items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-[var(--noc-bg)] p-7">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-[var(--noc-amber)]" aria-hidden />
                <span className="noc-mono text-[var(--noc-ink-faint)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-6 text-[17px] font-medium tracking-tight">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--noc-ink-faint)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The studio narrative, with a curtain plate and count-up figures. */
export function NoctisStudio() {
  const { about } = NOCTIS_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <Reveal>
            {about.body.map((paragraph) => (
              <p key={paragraph} className="mb-5 max-w-[52ch] text-[16.5px] leading-[1.85] text-[var(--noc-ink-soft)]">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <RevealGroup className="mt-4 border-t border-[var(--noc-rule)]" delay={0.08}>
            {about.points.map((point) => (
              <p key={point} className="border-b border-[var(--noc-rule)] py-4 text-[15px]">
                {point}
              </p>
            ))}
          </RevealGroup>
        </div>

        <CurtainReveal from="right">
          <div className="noc-grain relative aspect-[4/5] overflow-hidden rounded-[var(--noc-radius)] noc-plate-a" />
        </CurtainReveal>
      </div>

      <Reveal className="mt-16 grid grid-cols-2 gap-8 border-t border-[var(--noc-rule)] pt-10 lg:grid-cols-4">
        {NOCTIS_FACTS.map((fact) => (
          <div key={fact.label}>
            <p className="noc-display text-[clamp(1.9rem,3.6vw,2.8rem)] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="noc-mono mt-2 text-[var(--noc-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </Band>
  );
}

/** The four capabilities. */
export function NoctisServices() {
  const { services } = NOCTIS_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" step={0.07}>
        {NOCTIS_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="rounded-[var(--noc-radius)] border border-[var(--noc-rule)] bg-[var(--noc-bg-2)] p-7"
            >
              <Icon className="h-5 w-5 text-[var(--noc-amber)]" aria-hidden />
              <h3 className="noc-display mt-5 text-[1.5rem]">{service.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-[var(--noc-ink-soft)]">{service.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-[var(--noc-rule)] pt-5">
                {service.deliverables.map((item) => (
                  <li key={item} className="noc-mono rounded-full border border-[var(--noc-rule)] px-2.5 py-1 text-[var(--noc-ink-faint)]">
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

/** The journal. Short field notes. */
export function NoctisJournal() {
  return (
    <Band eyebrow="Journal" title="Notes from the field" subtitle="Where a series came from and what the shoot was actually like.">
      <RevealGroup className="mt-12 border-t border-[var(--noc-rule)]" step={0.05}>
        {NOCTIS_JOURNAL.map((entry) => (
          <article
            key={entry.title}
            className="group grid gap-4 border-b border-[var(--noc-rule)] py-8 transition-colors hover:bg-[var(--noc-bg-2)] sm:grid-cols-[auto_1fr] sm:gap-10"
          >
            <div className="noc-mono text-[var(--noc-ink-faint)] sm:w-32">
              <p>{entry.date}</p>
              <p className="mt-2 text-[var(--noc-amber)]">{entry.tag}</p>
              <p className="mt-2">{entry.readingTime}</p>
            </div>
            <div>
              <h3 className="noc-display flex items-start gap-3 text-[clamp(1.4rem,2.6vw,2rem)]">
                {entry.title}
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--noc-amber)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </h3>
              <p className="mt-3 max-w-[60ch] text-[15.5px] leading-[1.8] text-[var(--noc-ink-soft)]">{entry.excerpt}</p>
            </div>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The FAQ. */
export function NoctisFaq() {
  const { faq } = NOCTIS_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--noc-rule)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--noc-rule)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`noc-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--noc-amber)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--noc-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`noc-faq-${i}`} className="max-w-[60ch] pb-6 text-[15px] leading-[1.85] text-[var(--noc-ink-soft)]">
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
export function NoctisContact() {
  const { contact } = NOCTIS_CONTENT;
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
                <label htmlFor={`noc-${field}`} className="noc-mono block text-[var(--noc-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`noc-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y border-b border-[var(--noc-rule)] bg-transparent pb-3 text-[16px] text-[var(--noc-ink)] focus:border-[var(--noc-amber)]"
                  />
                ) : (
                  <input
                    id={`noc-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full border-b border-[var(--noc-rule)] bg-transparent pb-3 text-[16px] text-[var(--noc-ink)] focus:border-[var(--noc-amber)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="noc-mono inline-flex items-center gap-2 rounded-[var(--noc-radius)] bg-[var(--noc-amber)] px-6 py-3.5 text-[var(--noc-bg)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--noc-amber)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--noc-rule)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--noc-rule)] py-5">
              <p className="noc-mono text-[var(--noc-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function NoctisFooter() {
  const { footer, brand } = NOCTIS_CONTENT;
  return (
    <footer className="border-t border-[var(--noc-rule)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="noc-display text-[1.6rem]">
            {brand}
            <span className="text-[var(--noc-amber)]">.</span>
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--noc-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="noc-mono text-[var(--noc-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--noc-ink-soft)] hover:text-[var(--noc-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--noc-rule)] pt-7 text-[12.5px] text-[var(--noc-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
