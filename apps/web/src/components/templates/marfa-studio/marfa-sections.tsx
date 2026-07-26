'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Menu, Minus, Plus, X } from 'lucide-react';
import {
  MARFA_CONTENT,
  MARFA_ESSAYS,
  MARFA_FACTS,
  MARFA_LABELS,
  MARFA_NAV,
  MARFA_PROJECTS,
  MARFA_SERVICES,
  type MarfaMasthead as MarfaMastheadData,
  type MarfaPageId,
} from '@/data/templates/marfa-studio-content';
import {
  Counter,
  MagneticThumb,
  Parallax,
  Reveal,
  RevealGroup,
  WordMask,
} from './marfa-motion';

/**
 * MARFA - the section library.
 *
 * Every section on every page lives here. Page compositions live in
 * `marfa-pages.tsx`; this file only knows how one band looks.
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
          <p className="mar-mono text-[var(--mar-terra)]">{eyebrow}</p>
        </Reveal>
        <WordMask className="mar-display mt-6 max-w-4xl text-[clamp(2.2rem,6vw,4.6rem)]" text={title} delay={0.04} />
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[60ch] text-pretty text-[17px] leading-[1.8] text-[var(--mar-ink-soft)]">
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
export function MarfaHeader({ page }: { page: MarfaPageId }) {
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
        scrolled
          ? 'border-b border-[var(--mar-rule)] bg-[color-mix(in_srgb,var(--mar-paper)_88%,transparent)] backdrop-blur-md'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="mar-display text-[1.5rem] leading-none">
          Marfa
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {MARFA_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'mar-mono transition-colors',
                  current ? 'text-[var(--mar-terra)]' : 'text-[var(--mar-ink-faint)] hover:text-[var(--mar-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="?page=contact"
          className="mar-mono hidden items-center gap-1.5 rounded-full bg-[var(--mar-ink)] px-4 py-2.5 text-[var(--mar-paper)] transition-opacity hover:opacity-90 md:inline-flex"
        >
          {MARFA_LABELS.cta}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mar-mobile-nav"
          aria-label={open ? MARFA_LABELS.close : MARFA_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="mar-mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--mar-rule)] bg-[var(--mar-paper)] px-5 py-2 md:hidden"
        >
          {MARFA_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block py-3 text-[15px]',
                item.id === page ? 'text-[var(--mar-terra)]' : 'text-[var(--mar-ink-faint)]',
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

/** The opening screen. The headline rises word by word. */
export function MarfaHero() {
  const { hero } = MARFA_CONTENT;

  return (
    <section className="px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mar-mono text-[var(--mar-ink-faint)]">{hero.badge}</p>
        </Reveal>

        <h1 className="mar-display mt-8 text-[clamp(2.8rem,10vw,7.5rem)]">
          <WordMask as="span" className="block" text={hero.title} delay={0.05} />
          <WordMask as="span" className="mar-italic block" text={hero.titleAccent} delay={0.24} />
        </h1>

        <div className="mt-14 grid gap-10 border-t border-[var(--mar-rule)] pt-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Reveal delay={0.2}>
            <p className="max-w-[52ch] text-pretty text-[18px] leading-[1.8] text-[var(--mar-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="flex flex-wrap gap-3">
              <a
                href="?page=work"
                className="mar-mono inline-flex items-center gap-2 rounded-full bg-[var(--mar-ink)] px-6 py-3.5 text-[var(--mar-paper)] transition-opacity hover:opacity-90"
              >
                {hero.ctaPrimary}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href="?page=contact"
                className="mar-mono inline-flex items-center rounded-full border border-[var(--mar-rule-strong)] px-6 py-3.5 transition-colors hover:bg-[var(--mar-paper-2)]"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-3 gap-8 border-t border-[var(--mar-rule)] pt-8">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="mar-display text-[clamp(2.2rem,4.6vw,3.2rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mar-mono mt-2 text-[var(--mar-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A page's opening band. */
export function MarfaMasthead({ masthead }: { masthead: MarfaMastheadData }) {
  return (
    <section className="px-5 pb-6 pt-16 sm:px-8 sm:pb-10 sm:pt-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="mar-mono text-[var(--mar-terra)]">{masthead.eyebrow}</p>
        </Reveal>
        <WordMask as="h1" className="mar-display mt-6 text-[clamp(2.6rem,7.5vw,5.4rem)]" text={masthead.title} delay={0.05} />
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-[58ch] text-pretty text-[17px] leading-[1.8] text-[var(--mar-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The word strip. CSS keyframes: no scroll relationship. */
export function MarfaMarquee() {
  const words = MARFA_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--mar-rule)] py-5">
      <div className="mar-display flex w-max animate-[mar-marquee_40s_linear_infinite] items-center gap-8 pr-8 text-[clamp(1.6rem,4vw,2.6rem)]">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-8">
            {word}
            <span className="mar-italic">&amp;</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes mar-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[mar-marquee_40s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** Featured work on the home page: alternating rows with parallax plates. */
export function MarfaFeatured() {
  const featured = MARFA_PROJECTS.slice(0, 3);
  return (
    <section aria-labelledby="mar-featured-title" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mar-mono text-[var(--mar-terra)]">Selected work</p>
        </Reveal>
        <WordMask
          as="h2"
          id="mar-featured-title"
          className="mar-display mt-6 max-w-4xl text-[clamp(2.2rem,6vw,4.6rem)]"
          text="Three we are proud of"
          delay={0.04}
        />

        <div className="mt-16 space-y-24 sm:space-y-32">
          {featured.map((project, i) => (
            <article
              key={project.name}
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>a]:order-2' : ''}`}
            >
              <MagneticThumb href="?page=work" className="group relative">
                <Parallax className="aspect-[4/3] rounded-[var(--mar-radius)]" plate={project.plate} />
                <span className="mar-mono absolute bottom-4 left-4 z-10 rounded-full bg-[var(--mar-paper)] px-3 py-1 text-[var(--mar-ink)]">
                  {project.category}
                </span>
              </MagneticThumb>

              <Reveal delay={0.08}>
                <p className="mar-mono text-[var(--mar-ink-faint)]">
                  {project.client} · {project.year}
                </p>
                <h3 className="mar-display mt-3 text-[clamp(1.8rem,4vw,3rem)]">{project.name}</h3>
                <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.8] text-[var(--mar-ink-soft)]">{project.body}</p>
                <a
                  href="?page=work"
                  className="mar-mono mt-6 inline-flex items-center gap-2 text-[var(--mar-terra)] hover:opacity-80"
                >
                  View project
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The full work index: magnetic thumbnails with parallax plates. */
export function MarfaWorkIndex() {
  return (
    <section aria-labelledby="mar-index-title" className="px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mar-mono text-[var(--mar-terra)]">Index</p>
        </Reveal>
        <WordMask
          as="h2"
          id="mar-index-title"
          className="mar-display mt-6 max-w-4xl text-[clamp(2.2rem,6vw,4.6rem)]"
          text="Every project, in order"
          delay={0.04}
        />

        <RevealGroup className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2" step={0.06}>
          {MARFA_PROJECTS.map((project) => (
            <article key={project.name}>
              <MagneticThumb href="?page=work" className="group">
                <Parallax className="aspect-[4/3] rounded-[var(--mar-radius)]" plate={project.plate} distance={10} />
              </MagneticThumb>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="mar-display text-[1.7rem]">{project.name}</h3>
                <span className="mar-mono text-[var(--mar-ink-faint)]">{project.year}</span>
              </div>
              <p className="mar-mono mt-1 text-[var(--mar-terra)]">{project.category}</p>
              <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.75] text-[var(--mar-ink-soft)]">{project.body}</p>
            </article>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/** The approach, as a numbered list. */
export function MarfaApproach() {
  const { why } = MARFA_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-[var(--mar-radius)] border border-[var(--mar-rule)] bg-[var(--mar-rule)] sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
        {why.items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-[var(--mar-panel)] p-7">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-[var(--mar-terra)]" aria-hidden />
                <span className="mar-mono text-[var(--mar-ink-faint)]">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mar-display mt-6 text-[1.5rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.75] text-[var(--mar-ink-faint)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The studio narrative, with a parallax portrait and count-up figures. */
export function MarfaStudio() {
  const { about } = MARFA_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <Reveal>
            {about.body.map((paragraph) => (
              <p key={paragraph} className="mb-5 max-w-[52ch] text-[17px] leading-[1.9] text-[var(--mar-ink-soft)]">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <RevealGroup className="mt-4 border-t border-[var(--mar-rule)]" delay={0.08}>
            {about.points.map((point) => (
              <p key={point} className="border-b border-[var(--mar-rule)] py-4 text-[15px]">
                {point}
              </p>
            ))}
          </RevealGroup>
        </div>

        <Parallax className="aspect-[4/5] rounded-[var(--mar-radius)]" plate="mar-plate-b" />
      </div>

      <Reveal className="mt-16 grid grid-cols-2 gap-8 border-t border-[var(--mar-rule)] pt-10 lg:grid-cols-4">
        {MARFA_FACTS.map((fact) => (
          <div key={fact.label}>
            <p className="mar-display text-[clamp(2rem,3.8vw,3rem)] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="mar-mono mt-2 text-[var(--mar-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </Band>
  );
}

/** The four capabilities. */
export function MarfaServices() {
  const { services } = MARFA_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" step={0.07}>
        {MARFA_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="rounded-[var(--mar-radius)] border border-[var(--mar-rule)] bg-[var(--mar-panel)] p-7"
            >
              <Icon className="h-5 w-5 text-[var(--mar-terra)]" aria-hidden />
              <h3 className="mar-display mt-5 text-[1.7rem]">{service.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-[var(--mar-ink-soft)]">{service.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-[var(--mar-rule)] pt-5">
                {service.deliverables.map((item) => (
                  <li key={item} className="mar-mono rounded-full border border-[var(--mar-rule)] px-2.5 py-1 text-[var(--mar-ink-faint)]">
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

/** The essays. */
export function MarfaWords() {
  return (
    <Band eyebrow="Words" title="On making things well" subtitle="Short essays on typography, editing and the quiet parts of the craft.">
      <RevealGroup className="mt-12 border-t border-[var(--mar-rule)]" step={0.05}>
        {MARFA_ESSAYS.map((essay) => (
          <article
            key={essay.title}
            className="group grid gap-4 border-b border-[var(--mar-rule)] py-8 transition-colors hover:bg-[var(--mar-panel)] sm:grid-cols-[auto_1fr] sm:gap-10"
          >
            <div className="mar-mono text-[var(--mar-ink-faint)] sm:w-28">
              <p>{essay.date}</p>
              <p className="mt-2">{essay.readingTime}</p>
            </div>
            <div>
              <h3 className="mar-display flex items-start gap-3 text-[clamp(1.5rem,3vw,2.2rem)]">
                {essay.title}
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--mar-terra)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </h3>
              <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.85] text-[var(--mar-ink-soft)]">{essay.excerpt}</p>
            </div>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The FAQ. */
export function MarfaFaq() {
  const { faq } = MARFA_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--mar-rule)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--mar-rule)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`mar-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--mar-terra)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--mar-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`mar-faq-${i}`} className="max-w-[62ch] pb-6 text-[15.5px] leading-[1.85] text-[var(--mar-ink-soft)]">
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
export function MarfaContact() {
  const { contact } = MARFA_CONTENT;
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
                <label htmlFor={`mar-${field}`} className="mar-mono block text-[var(--mar-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`mar-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y border-b border-[var(--mar-rule-strong)] bg-transparent pb-3 text-[16px] text-[var(--mar-ink)] focus:border-[var(--mar-terra)]"
                  />
                ) : (
                  <input
                    id={`mar-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full border-b border-[var(--mar-rule-strong)] bg-transparent pb-3 text-[16px] text-[var(--mar-ink)] focus:border-[var(--mar-terra)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="mar-mono inline-flex items-center gap-2 rounded-full bg-[var(--mar-ink)] px-6 py-3.5 text-[var(--mar-paper)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--mar-terra)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--mar-rule)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--mar-rule)] py-5">
              <p className="mar-mono text-[var(--mar-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function MarfaFooter() {
  const { footer, brand } = MARFA_CONTENT;
  return (
    <footer className="border-t border-[var(--mar-rule)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="mar-display text-[2rem]">{brand}</p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--mar-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="mar-mono text-[var(--mar-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--mar-ink-soft)] hover:text-[var(--mar-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--mar-rule)] pt-7 text-[12.5px] text-[var(--mar-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
