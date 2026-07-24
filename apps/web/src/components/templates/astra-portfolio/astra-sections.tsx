'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Menu, Minus, Plus, Star, X } from 'lucide-react';
import {
  ASTRA_CONTENT,
  ASTRA_JOURNAL,
  ASTRA_LABELS,
  ASTRA_NAV,
  ASTRA_PROJECTS,
  ASTRA_SERVICES,
  ASTRA_STATS,
} from '@/data/templates/astra-portfolio-content';
import { Counter, Line, LiftLines, Reveal, RevealGroup } from './astra-motion';

/**
 * ASTRA - the section library.
 *
 * A single-page site: every section lives here and the page is composed in
 * `astra-template.tsx`. No section holds copy - everything reads from the
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
    <section id={id} className="scroll-mt-20 px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="ast-mono flex items-center gap-2 text-[var(--ast-blue)]">
            <Star className="h-3 w-3 fill-current" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className="ast-display mt-5 max-w-4xl text-[clamp(2rem,5.2vw,3.8rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[60ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--ast-ink-soft)]">
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** A small rotating star badge. */
function StarBadge({ className }: { className?: string }) {
  return (
    <span aria-hidden className={`ast-star-spin inline-flex ${className ?? ''}`}>
      <Star className="h-full w-full fill-[var(--ast-blue)] text-[var(--ast-blue)]" />
    </span>
  );
}

/** The header. */
export function AstraHeader() {
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
        'sticky top-0 z-50 transition-colors',
        scrolled
          ? 'border-b border-[var(--ast-line)] bg-[color-mix(in_srgb,var(--ast-paper)_88%,transparent)] backdrop-blur-md'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="#top" className="ast-display flex items-center gap-1.5 text-[1.4rem] leading-none">
          Astra
          <Star className="h-3.5 w-3.5 fill-[var(--ast-blue)] text-[var(--ast-blue)]" aria-hidden />
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {ASTRA_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="ast-mono text-[var(--ast-ink-faint)] transition-colors hover:text-[var(--ast-ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="ast-mono hidden items-center gap-1.5 rounded-full bg-[var(--ast-blue)] px-4 py-2.5 text-[var(--ast-panel)] transition-opacity hover:opacity-90 md:inline-flex"
        >
          {ASTRA_LABELS.cta}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="ast-mobile-nav"
          aria-label={open ? ASTRA_LABELS.close : ASTRA_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="ast-mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--ast-line)] bg-[var(--ast-paper)] px-5 py-2 md:hidden"
        >
          {ASTRA_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-[15px] text-[var(--ast-ink-faint)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/** The opening screen: portrait block beside the name, role and stats. */
export function AstraHero() {
  const { hero } = ASTRA_CONTENT;

  return (
    <section className="px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <Reveal>
              <p className="ast-mono flex items-center gap-2 text-[var(--ast-ink-faint)]">
                <Star className="h-3 w-3 fill-current text-[var(--ast-blue)]" aria-hidden />
                {hero.badge}
              </p>
            </Reveal>

            <LiftLines as="h1" className="ast-display mt-7 text-[clamp(2.8rem,9vw,7rem)]" delay={0.06}>
              <Line>{hero.title}</Line>
              <Line>
                <span className="ast-accent">{hero.titleAccent}</span>
              </Line>
            </LiftLines>

            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[48ch] text-pretty text-[17.5px] leading-[1.75] text-[var(--ast-ink-soft)]">
                {hero.subtitle}
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="ast-mono inline-flex items-center gap-2 rounded-full bg-[var(--ast-blue)] px-6 py-3.5 text-[var(--ast-panel)] transition-opacity hover:opacity-90"
                >
                  {hero.ctaPrimary}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
                <a
                  href="#work"
                  className="ast-mono inline-flex items-center rounded-full border border-[var(--ast-line-strong)] px-6 py-3.5 transition-colors hover:bg-[var(--ast-paper-2)]"
                >
                  {hero.ctaSecondary}
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="ast-plate-c aspect-[4/5] overflow-hidden rounded-[var(--ast-radius)]" />
              {/* The rotating star badge, overlapping the portrait corner. */}
              <StarBadge className="absolute -left-5 -top-5 h-16 w-16 drop-shadow" />
            </div>
          </Reveal>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-[var(--ast-line)] pt-8 sm:grid-cols-3">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="ast-display text-[clamp(2rem,4.4vw,3rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="ast-mono mt-2 text-[var(--ast-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** The disciplines marquee, punctuated by stars. */
export function AstraMarquee() {
  const words = ASTRA_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--ast-line)] bg-[var(--ast-ink)] py-5 text-[var(--ast-paper)]">
      <div className="ast-marquee ast-display flex w-max items-center gap-6 pr-6 text-[clamp(1.5rem,3.6vw,2.4rem)]">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-6">
            {word}
            <Star className="h-5 w-5 shrink-0 fill-[var(--ast-blue)] text-[var(--ast-blue)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** About: narrative beside a checklist. */
export function AstraAbout() {
  const { about } = ASTRA_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 max-w-[54ch] text-[16.5px] leading-[1.85] text-[var(--ast-ink-soft)]">
              {paragraph}
            </p>
          ))}
        </Reveal>
        <RevealGroup className="border-t border-[var(--ast-line)]" delay={0.08}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-3 border-b border-[var(--ast-line)] py-4 text-[15px]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ast-blue)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The bento work grid. */
export function AstraWork() {
  return (
    <Band eyebrow="Work" title="Selected projects" subtitle="Six recent pieces, sized by how much they have to say. Hover to bring one forward." id="work">
      <RevealGroup className="ast-bento mt-12" step={0.06}>
        {ASTRA_PROJECTS.map((project) => (
          <a
            key={project.name}
            href="#contact"
            className={`ast-bento-block ast-span-${project.span} group relative block overflow-hidden rounded-[var(--ast-radius)] border border-[var(--ast-line)]`}
          >
            <div className={`ast-bento-img absolute inset-0 ${project.plate}`} aria-hidden />
            <div className="relative flex h-full min-h-[13rem] flex-col justify-between p-6">
              <span className="ast-mono inline-flex w-fit items-center gap-1.5 rounded-full bg-[var(--ast-paper)] px-3 py-1 text-[var(--ast-blue)]">
                <Star className="h-2.5 w-2.5 fill-current" aria-hidden />
                {project.category}
              </span>
              <div className="flex items-end justify-between gap-4">
                <h3 className="ast-display text-[clamp(1.4rem,2.6vw,2.2rem)]">{project.name}</h3>
                <span className="ast-mono flex items-center gap-1 text-[var(--ast-ink-soft)]">
                  {project.year}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 text-[var(--ast-blue)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                </span>
              </div>
            </div>
          </a>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The journal highlight. */
export function AstraJournal() {
  return (
    <Band eyebrow="Journal" title="Words on the work" subtitle="Occasional notes on process, craft and the business of freelancing well." id="journal">
      <RevealGroup className="mt-12 border-t border-[var(--ast-line)]" step={0.05}>
        {ASTRA_JOURNAL.map((entry) => (
          <article
            key={entry.title}
            className="group grid gap-4 border-b border-[var(--ast-line)] py-8 transition-colors hover:bg-[var(--ast-panel)] sm:grid-cols-[auto_1fr] sm:gap-10"
          >
            <div className="ast-mono text-[var(--ast-ink-faint)] sm:w-28">
              <p>{entry.date}</p>
              <p className="mt-2 text-[var(--ast-blue)]">{entry.tag}</p>
              <p className="mt-2">{entry.readingTime}</p>
            </div>
            <div>
              <h3 className="ast-display flex items-start gap-3 text-[clamp(1.4rem,3vw,2.2rem)]">
                {entry.title}
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-[var(--ast-blue)] opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </h3>
              <p className="mt-3 max-w-[62ch] text-[16px] leading-[1.8] text-[var(--ast-ink-soft)]">{entry.excerpt}</p>
            </div>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The four services. */
export function AstraServices() {
  const { services } = ASTRA_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="services">
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2" step={0.07}>
        {ASTRA_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="rounded-[var(--ast-radius)] border border-[var(--ast-line)] bg-[var(--ast-panel)] p-7"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ast-paper-2)]">
                <Icon className="h-5 w-5 text-[var(--ast-blue)]" aria-hidden />
              </span>
              <h3 className="ast-display mt-5 text-[1.6rem]">{service.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-[var(--ast-ink-soft)]">{service.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-[var(--ast-line)] pt-5">
                {service.deliverables.map((item) => (
                  <li key={item} className="ast-mono rounded-full border border-[var(--ast-line)] px-2.5 py-1 text-[var(--ast-ink-faint)]">
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

/** The stats callout: big figures with a rotating star. */
export function AstraStats() {
  return (
    <section className="px-5 py-24 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl rounded-[var(--ast-radius)] bg-[var(--ast-ink)] px-6 py-14 text-[var(--ast-paper)] sm:px-12">
        <div className="flex items-center justify-between">
          <Reveal>
            <p className="ast-mono flex items-center gap-2 text-[var(--ast-blue)]">
              <Star className="h-3 w-3 fill-current" aria-hidden />
              By the numbers
            </p>
          </Reveal>
          <StarBadge className="h-12 w-12" />
        </div>

        <RevealGroup className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4" step={0.08}>
          {ASTRA_STATS.map((stat) => (
            <div key={stat.label}>
              <p className="ast-display text-[clamp(2.4rem,5vw,3.6rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="ast-mono mt-2 text-[color-mix(in_srgb,var(--ast-paper)_60%,transparent)]">{stat.label}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/** The FAQ. */
export function AstraFaq() {
  const { faq } = ASTRA_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--ast-line)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--ast-line)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`ast-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--ast-blue)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--ast-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`ast-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.85] text-[var(--ast-ink-soft)]">
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
export function AstraContact() {
  const { contact } = ASTRA_CONTENT;
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
                <label htmlFor={`ast-${field}`} className="ast-mono block text-[var(--ast-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`ast-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y rounded-[12px] border border-[var(--ast-line)] bg-[var(--ast-panel)] px-4 py-3 text-[16px] text-[var(--ast-ink)] focus:border-[var(--ast-blue)]"
                  />
                ) : (
                  <input
                    id={`ast-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full rounded-[12px] border border-[var(--ast-line)] bg-[var(--ast-panel)] px-4 py-3 text-[16px] text-[var(--ast-ink)] focus:border-[var(--ast-blue)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="ast-mono inline-flex items-center gap-2 rounded-full bg-[var(--ast-blue)] px-6 py-3.5 text-[var(--ast-panel)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--ast-blue)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--ast-line)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--ast-line)] py-5">
              <p className="ast-mono text-[var(--ast-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function AstraFooter() {
  const { footer, brand } = ASTRA_CONTENT;
  return (
    <footer className="border-t border-[var(--ast-line)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="ast-display flex items-center gap-1.5 text-[1.7rem]">
            {brand}
            <Star className="h-4 w-4 fill-[var(--ast-blue)] text-[var(--ast-blue)]" aria-hidden />
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--ast-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="ast-mono text-[var(--ast-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="text-[14px] text-[var(--ast-ink-soft)] hover:text-[var(--ast-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--ast-line)] pt-7 text-[12.5px] text-[var(--ast-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
