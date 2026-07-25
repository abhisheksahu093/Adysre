'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowUpRight, Menu, Minus, Plus, Quote, X } from 'lucide-react';
import {
  SOLENE_CONTENT,
  SOLENE_LABELS,
  SOLENE_NAV,
  SOLENE_PORTFOLIO,
  SOLENE_PROJECTS,
  SOLENE_SERVICES,
  SOLENE_STATS,
  SOLENE_TESTIMONIALS,
  type SoleneMasthead as SoleneMastheadData,
  type SolenePageId,
} from '@/data/templates/interior-content';
import { Counter, ImageReveal, Line, LiftLines, Reveal, RevealGroup } from './solene-motion';

/**
 * SOLÈNE - the section library. A single source composed into pages by
 * `solene-pages.tsx`; no section holds copy of its own. Navigation is by
 * `?page=`, so links work in any host.
 */

/** The editorial band most sections share. */
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
          <p className="sol-mono flex items-center gap-3 text-[var(--sol-gold)]">
            <span className="h-px w-8 bg-[var(--sol-gold)]" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className="sol-display mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.4rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-5 max-w-[58ch] text-[16.5px] leading-[1.8] text-[var(--sol-ink-soft)]">{subtitle}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** The serif wordmark. */
function BrandMark() {
  return (
    <a href="?page=home" className="sol-display text-[1.5rem] leading-none">
      {SOLENE_CONTENT.brand}
    </a>
  );
}

/** Minimal header. */
export function SoleneHeader({ page }: { page: SolenePageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={['fixed inset-x-0 top-0 z-50 transition-colors duration-500', scrolled ? 'border-b border-[var(--sol-line)] bg-[color-mix(in_srgb,var(--sol-paper)_86%,transparent)] backdrop-blur-md' : 'border-b border-transparent'].join(' ')}>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {SOLENE_NAV.map((item) => {
            const active = item.id === page;
            return (
              <a key={item.id} href={`?page=${item.id}`} aria-current={active ? 'page' : undefined} className={['sol-mono transition-colors', active ? 'text-[var(--sol-ink)]' : 'text-[var(--sol-ink-faint)] hover:text-[var(--sol-ink)]'].join(' ')}>
                {item.label}
              </a>
            );
          })}
        </nav>

        <a href="?page=contact" className="hidden items-center gap-2 rounded-full border border-[var(--sol-ink)] px-5 py-2.5 text-[13px] transition-colors hover:bg-[var(--sol-ink)] hover:text-[var(--sol-paper)] md:inline-flex">
          {SOLENE_LABELS.cta}
        </a>

        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="sol-mobile" aria-label={open ? SOLENE_LABELS.close : SOLENE_LABELS.menu} className="md:hidden">
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="sol-mobile" aria-label="Primary" className="border-t border-[var(--sol-line)] bg-[var(--sol-paper)] px-5 py-2 md:hidden">
          {SOLENE_NAV.map((item) => (
            <a key={item.id} href={`?page=${item.id}`} onClick={() => setOpen(false)} className="block py-3 text-[15px] text-[var(--sol-ink-soft)]">
              {item.label}
            </a>
          ))}
          <a href="?page=contact" onClick={() => setOpen(false)} className="my-2 inline-flex rounded-full border border-[var(--sol-ink)] px-5 py-2.5 text-[14px]">
            {SOLENE_LABELS.cta}
          </a>
        </nav>
      )}
    </header>
  );
}

/** The editorial hero. */
export function SoleneHero() {
  const { hero } = SOLENE_CONTENT;
  return (
    <section id="top" className="px-5 pb-16 pt-36 sm:px-8 sm:pb-24 sm:pt-44">
      <div className="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal>
            <p className="sol-mono flex items-center gap-3 text-[var(--sol-gold)]">
              <span className="h-px w-8 bg-[var(--sol-gold)]" aria-hidden />
              {hero.badge}
            </p>
          </Reveal>
          <LiftLines as="h1" className="sol-display mt-7 text-[clamp(2.8rem,7.5vw,5.6rem)]" delay={0.06}>
            <Line>{hero.title}</Line>
            <Line>
              <span className="sol-accent sol-italic">{hero.titleAccent}</span>
            </Line>
          </LiftLines>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[46ch] text-[17.5px] leading-[1.8] text-[var(--sol-ink-soft)]">{hero.subtitle}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="?page=contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--sol-ink)] px-6 py-3.5 text-[14px] text-[var(--sol-paper)] transition-opacity hover:opacity-90">
                {hero.ctaPrimary}
              </a>
              <a href="?page=projects" className="sol-frame inline-flex items-center gap-1.5 text-[14px] text-[var(--sol-ink)]">
                <span className="sol-underline pb-1">{hero.ctaSecondary}</span>
                <ArrowUpRight className="h-4 w-4 text-[var(--sol-gold)]" aria-hidden />
              </a>
            </div>
          </Reveal>
          <RevealGroup className="mt-14 grid max-w-md grid-cols-3 gap-8 border-t border-[var(--sol-line)] pt-8" delay={0.1}>
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <p className="sol-display text-[clamp(1.8rem,3.4vw,2.4rem)] tabular-nums">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="sol-mono mt-2 text-[var(--sol-ink-faint)]">{stat.label}</p>
              </div>
            ))}
          </RevealGroup>
        </div>

        <ImageReveal className="sol-frame overflow-hidden rounded-[var(--sol-radius)]">
          <div className="sol-zoom sol-plate-a aspect-[3/4]" aria-hidden />
        </ImageReveal>
      </div>
    </section>
  );
}

/** Inner-page masthead. */
export function SoleneMasthead({ masthead }: { masthead: SoleneMastheadData }) {
  return (
    <section id="top" className="px-5 pb-8 pt-36 sm:px-8 sm:pb-12 sm:pt-44">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="sol-mono flex items-center gap-3 text-[var(--sol-gold)]">
            <span className="h-px w-8 bg-[var(--sol-gold)]" aria-hidden />
            {masthead.eyebrow}
          </p>
        </Reveal>
        <LiftLines as="h1" className="sol-display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.4rem)]" delay={0.04}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.8] text-[var(--sol-ink-soft)]">{masthead.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Press marquee. */
export function SoleneMarquee() {
  const words = SOLENE_CONTENT.marquee;
  return (
    <section className="border-y border-[var(--sol-line)] py-8">
      <p className="sol-mono mb-6 text-center text-[var(--sol-ink-faint)]">As seen in</p>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="sol-marquee sol-display flex w-max items-center gap-16 pr-16 text-[clamp(1.1rem,2.2vw,1.5rem)] text-[var(--sol-ink-faint)]">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="whitespace-nowrap italic">{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Studio philosophy, two columns. */
export function SoleneAbout() {
  const { about } = SOLENE_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-14 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-6 max-w-[52ch] text-[17px] leading-[1.9] text-[var(--sol-ink-soft)]">{paragraph}</p>
          ))}
        </Reveal>
        <RevealGroup className="border-t border-[var(--sol-line)]" delay={0.06}>
          {about.points.map((point) => (
            <p key={point} className="flex items-baseline gap-4 border-b border-[var(--sol-line)] py-4 text-[15.5px]">
              <span className="sol-mono text-[var(--sol-gold)]">—</span>
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Featured projects grid, with clip-reveal plates and hover zoom. */
export function SoleneProjects() {
  return (
    <Band eyebrow="Selected work" title="Projects that feel inevitable." id="projects">
      <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {SOLENE_PROJECTS.map((project, i) => (
          <ImageReveal key={project.name} delay={i * 0.05}>
            <a href="?page=portfolio" className="sol-frame group block">
              <div className="overflow-hidden rounded-[var(--sol-radius)]">
                <div className={`sol-zoom ${project.plate} aspect-[4/3]`} aria-hidden />
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h3 className="sol-display text-[1.5rem]">
                    <span className="sol-underline pb-1">{project.name}</span>
                  </h3>
                  <p className="sol-mono mt-1 text-[var(--sol-ink-faint)]">{project.place}</p>
                </div>
                <span className="sol-mono text-[var(--sol-ink-faint)]">{project.year}</span>
              </div>
            </a>
          </ImageReveal>
        ))}
      </div>
    </Band>
  );
}

/** Services as a numbered editorial list. */
export function SoleneServices() {
  const { services } = SOLENE_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="services">
      <RevealGroup className="mt-12 border-t border-[var(--sol-line)]" step={0.06}>
        {SOLENE_SERVICES.map((service, i) => {
          const Icon = service.icon;
          return (
            <div key={service.title} className="grid items-start gap-4 border-b border-[var(--sol-line)] py-8 sm:grid-cols-[auto_1fr_1.4fr] sm:gap-10">
              <p className="sol-display text-[1.6rem] text-[var(--sol-gold)]">{`0${i + 1}`}</p>
              <h3 className="sol-display flex items-center gap-3 text-[1.6rem]">
                <Icon className="h-5 w-5 text-[var(--sol-gold)]" aria-hidden />
                {service.title}
              </h3>
              <p className="text-[15.5px] leading-[1.8] text-[var(--sol-ink-soft)]">{service.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Our approach, four principles. */
export function SoleneApproach() {
  const { why } = SOLENE_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} id="approach">
      <RevealGroup className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" step={0.08}>
        {why.items.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="border-t border-[var(--sol-line)] pt-6">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-[var(--sol-gold)]" aria-hidden />
                <span className="sol-mono text-[var(--sol-ink-faint)]">{`0${i + 1}`}</span>
              </div>
              <h3 className="sol-display mt-5 text-[1.35rem]">{item.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.75] text-[var(--sol-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Portfolio masonry. */
export function SolenePortfolio() {
  return (
    <Band eyebrow="Portfolio" title="A closer look." id="portfolio">
      <div className="mt-12 grid auto-rows-[13rem] grid-cols-2 gap-4 lg:grid-cols-4">
        {SOLENE_PORTFOLIO.map((item, i) => {
          const span = item.span === 'tall' ? 'row-span-2' : item.span === 'wide' ? 'col-span-2' : '';
          return (
            <ImageReveal key={item.name} delay={i * 0.04} className={span}>
              <a href="?page=portfolio" className="sol-frame group block h-full overflow-hidden rounded-[var(--sol-radius)]">
                <div className={`sol-zoom relative h-full ${item.plate}`} aria-hidden>
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(26_23_18/50%)] to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="sol-mono block text-[var(--sol-paper)]">{item.category}</span>
                    <span className="sol-display block text-[1.1rem] text-[var(--sol-paper)]">{item.name}</span>
                  </span>
                </div>
              </a>
            </ImageReveal>
          );
        })}
      </div>
    </Band>
  );
}

/** Discreet numbers. */
export function SoleneStats() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-8 border-y border-[var(--sol-line)] py-12 lg:grid-cols-4" step={0.08}>
        {SOLENE_STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="sol-display text-[clamp(2.4rem,5vw,3.4rem)] tabular-nums">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="sol-mono mt-2 text-[var(--sol-ink-faint)]">{stat.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}

/** Client voices. */
export function SoleneTestimonials() {
  return (
    <Band eyebrow="Voices" title="In their words." id="testimonials">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {SOLENE_TESTIMONIALS.map((t) => (
          <figure key={t.author} className="flex flex-col rounded-[var(--sol-radius)] border border-[var(--sol-line)] bg-[var(--sol-panel)] p-7">
            <Quote className="h-6 w-6 text-[var(--sol-gold)]" aria-hidden />
            <blockquote className="sol-display mt-4 flex-1 text-[1.2rem] leading-[1.5]">{t.quote}</blockquote>
            <figcaption className="mt-6 border-t border-[var(--sol-line)] pt-4">
              <p className="text-[15px] font-medium">{t.author}</p>
              <p className="sol-mono mt-1 text-[var(--sol-ink-faint)]">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** FAQ. */
export function SoleneFaq() {
  const { faq } = SOLENE_CONTENT;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--sol-line)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--sol-line)]">
                <h3>
                  <button type="button" onClick={() => setOpen(expanded ? null : i)} aria-expanded={expanded} aria-controls={`sol-faq-${i}`} className="sol-display flex w-full items-center justify-between gap-6 py-5 text-left text-[1.15rem]">
                    {item.question}
                    {expanded ? <Minus className="h-4 w-4 shrink-0 text-[var(--sol-gold)]" aria-hidden /> : <Plus className="h-4 w-4 shrink-0 text-[var(--sol-ink-faint)]" aria-hidden />}
                  </button>
                </h3>
                {expanded && <div id={`sol-faq-${i}`} className="max-w-[60ch] pb-6 text-[15.5px] leading-[1.85] text-[var(--sol-ink-soft)]">{item.answer}</div>}
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Contact. */
export function SoleneContact() {
  const { contact } = SOLENE_CONTENT;
  const [sent, setSent] = useState(false);
  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`sol-${field}`} className="sol-mono block text-[var(--sol-ink-faint)]">{contact.fields[field]}</label>
                {field === 'message' ? (
                  <textarea id={`sol-${field}`} name={field} rows={4} required className="mt-3 w-full resize-y rounded-[var(--sol-radius)] border border-[var(--sol-line)] bg-[var(--sol-panel)] px-4 py-3 text-[16px] text-[var(--sol-ink)] outline-none focus:border-[var(--sol-gold)]" />
                ) : (
                  <input id={`sol-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} required className="mt-3 w-full rounded-[var(--sol-radius)] border border-[var(--sol-line)] bg-[var(--sol-panel)] px-4 py-3 text-[16px] text-[var(--sol-ink)] outline-none focus:border-[var(--sol-gold)]" />
                )}
              </div>
            ))}
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[var(--sol-ink)] px-6 py-3.5 text-[14px] text-[var(--sol-paper)] transition-opacity hover:opacity-90">
              {contact.submit}
            </button>
            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--sol-gold)]">{sent ? 'This is a template. Wire the form to your own inbox.' : ''}</p>
          </form>
        </Reveal>
        <RevealGroup className="border-t border-[var(--sol-line)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--sol-line)] py-5">
              <p className="sol-mono text-[var(--sol-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Closing invitation over a duotone plate. */
export function SoleneCta() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="sol-frame relative isolate overflow-hidden rounded-[var(--sol-radius)] px-6 py-24 text-center sm:px-12">
          <div className="sol-plate-d absolute inset-0 -z-10" aria-hidden />
          <LiftLines className="sol-display mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--sol-paper)]">
            <Line>Let us design your quiet.</Line>
          </LiftLines>
          <p className="mx-auto mt-5 max-w-[46ch] text-[16px] leading-[1.8] text-[color-mix(in_srgb,var(--sol-paper)_78%,transparent)]">A few projects a year, each given everything. If ours is the right fit, tell us about your space.</p>
          <a href="?page=contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--sol-paper)] px-6 py-3.5 text-[14px] text-[var(--sol-ink)] transition-opacity hover:opacity-90">
            Start a project
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** Footer. */
export function SoleneFooter() {
  const { footer } = SOLENE_CONTENT;
  return (
    <footer className="border-t border-[var(--sol-line)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.7] text-[var(--sol-ink-faint)]">{footer.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="sol-mono text-[var(--sol-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--sol-ink-soft)] hover:text-[var(--sol-ink)]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--sol-line)] pt-7 text-[12.5px] text-[var(--sol-ink-faint)]">{footer.legal}</p>
    </footer>
  );
}
