'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRight, Check, Menu, Minus, Plus, Quote, X } from 'lucide-react';
import {
  MARLOWE_CONTENT,
  MARLOWE_LABELS,
  MARLOWE_NAV,
  MARLOWE_PRICING,
  MARLOWE_PROJECTS,
  MARLOWE_RESUME,
  MARLOWE_SERVICES,
  MARLOWE_SKILLS,
  MARLOWE_TESTIMONIALS,
} from '@/data/templates/marlowe-portfolio-content';
import {
  Counter,
  Line,
  LiftLines,
  Reveal,
  RevealGroup,
  SkillBar,
} from './marlowe-motion';

/**
 * MARLOWE - the section library.
 *
 * A single-page site: every section lives here and the page is composed in
 * `marlowe-template.tsx`. No section holds copy - everything reads from the
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
          <p className="mlw-mono text-[var(--mlw-coral)]">{eyebrow}</p>
        </Reveal>
        <LiftLines className="mlw-display mt-5 max-w-4xl text-[clamp(1.9rem,4.6vw,3.4rem)]" delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[60ch] text-pretty text-[16.5px] leading-[1.75] text-[var(--mlw-ink-soft)]">
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
export function MarloweHeader() {
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
          ? 'border-b border-[var(--mlw-line)] bg-[color-mix(in_srgb,var(--mlw-bg)_86%,transparent)] backdrop-blur-md'
          : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="#top" className="mlw-display text-[1.3rem] leading-none">
          Marlowe<span className="mlw-accent">.</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {MARLOWE_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="mlw-mono text-[var(--mlw-ink-faint)] transition-colors hover:text-[var(--mlw-ink)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="mlw-mono hidden items-center gap-1.5 rounded-full bg-[var(--mlw-coral)] px-4 py-2.5 text-[var(--mlw-bg)] transition-opacity hover:opacity-90 md:inline-flex"
        >
          {MARLOWE_LABELS.cta}
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mlw-mobile-nav"
          aria-label={open ? MARLOWE_LABELS.close : MARLOWE_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav
          id="mlw-mobile-nav"
          aria-label="Primary"
          className="border-t border-[var(--mlw-line)] bg-[var(--mlw-bg)] px-5 py-2 md:hidden"
        >
          {MARLOWE_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              className="block py-3 text-[15px] text-[var(--mlw-ink-faint)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

/** The opening screen: name, role, headline and stats over drifting orbs. */
export function MarloweHero() {
  const { hero } = MARLOWE_CONTENT;

  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-16 sm:px-8 sm:pb-24 sm:pt-24">
      {/* Ambient orbs. Decorative; they stop drifting under reduced motion. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <span className="mlw-orb mlw-orb-coral left-[8%] top-[6%] h-72 w-72" />
        <span className="mlw-orb mlw-orb-indigo right-[6%] top-[28%] h-80 w-80" />
      </div>

      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mlw-mono inline-flex items-center gap-2 rounded-full border border-[var(--mlw-line)] px-3 py-1.5 text-[var(--mlw-ink-faint)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--mlw-coral)]" aria-hidden />
            {MARLOWE_LABELS.available}
          </p>
        </Reveal>

        <LiftLines as="h1" className="mlw-display mt-8 text-[clamp(2.8rem,10vw,7.5rem)]" delay={0.06}>
          <Line>{hero.title}</Line>
          <Line>
            <span className="mlw-accent">{hero.titleAccent}</span>
          </Line>
        </LiftLines>

        <div className="mt-12 grid gap-10 border-t border-[var(--mlw-line)] pt-10 lg:grid-cols-[1fr_auto] lg:items-start">
          <Reveal delay={0.2}>
            <p className="max-w-[48ch] text-pretty text-[17.5px] leading-[1.75] text-[var(--mlw-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className="mlw-mono inline-flex items-center gap-2 rounded-full bg-[var(--mlw-coral)] px-6 py-3.5 text-[var(--mlw-bg)] transition-opacity hover:opacity-90"
              >
                {hero.ctaPrimary}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href="#work"
                className="mlw-mono inline-flex items-center rounded-full border border-[var(--mlw-line-strong)] px-6 py-3.5 transition-colors hover:bg-[var(--mlw-bg-2)]"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <dl className="mt-14 grid grid-cols-2 gap-8 border-t border-[var(--mlw-line)] pt-8 sm:grid-cols-3">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="mlw-display text-[clamp(2rem,4.4vw,3rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="mlw-mono mt-2 text-[var(--mlw-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** The skills strip. CSS keyframes: no scroll relationship. */
export function MarloweMarquee() {
  const words = MARLOWE_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--mlw-line)] py-4">
      <div className="flex w-max animate-[mlw-marquee_36s_linear_infinite] gap-10 pr-10">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="mlw-mono flex items-center gap-10 text-[var(--mlw-ink-faint)]">
            {word}
            <span className="h-1 w-1 rounded-full bg-[var(--mlw-coral)]" />
          </span>
        ))}
      </div>
      <style>{`@keyframes mlw-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[mlw-marquee_36s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** About: profile plate beside the narrative. */
export function MarloweAbout() {
  const { about } = MARLOWE_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <Reveal>
          <div className="mlw-plate-a relative aspect-[4/5] overflow-hidden rounded-[var(--mlw-radius)]">
            <span className="mlw-mono absolute bottom-4 left-4 rounded-full bg-[var(--mlw-bg)] px-3 py-1 text-[var(--mlw-ink)]">
              Marlowe Reid
            </span>
          </div>
        </Reveal>

        <div>
          <Reveal>
            {about.body.map((paragraph) => (
              <p key={paragraph} className="mb-5 max-w-[54ch] text-[16.5px] leading-[1.85] text-[var(--mlw-ink-soft)]">
                {paragraph}
              </p>
            ))}
          </Reveal>
          <RevealGroup className="mt-4 border-t border-[var(--mlw-line)]" delay={0.08}>
            {about.points.map((point) => (
              <p key={point} className="flex items-start gap-3 border-b border-[var(--mlw-line)] py-4 text-[15px]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mlw-coral)]" aria-hidden />
                {point}
              </p>
            ))}
          </RevealGroup>
        </div>
      </div>
    </Band>
  );
}

/** The résumé: two timeline columns. */
export function MarloweResume() {
  return (
    <Band eyebrow="Résumé" title="Where I have been" id="resume">
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        {MARLOWE_RESUME.map((column) => (
          <div key={column.title}>
            <h3 className="mlw-display text-[1.5rem]">{column.title}</h3>
            <RevealGroup className="mt-6 border-l border-[var(--mlw-line)]" step={0.06}>
              {column.items.map((item) => (
                <div key={`${item.role}-${item.period}`} className="relative pb-8 pl-6 last:pb-0">
                  <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--mlw-coral)]" aria-hidden />
                  <p className="mlw-mono text-[var(--mlw-ink-faint)]">{item.period}</p>
                  <h4 className="mt-2 text-[17px] font-medium tracking-tight">{item.role}</h4>
                  <p className="mlw-mono mt-1 text-[var(--mlw-coral)]">{item.org}</p>
                  <p className="mt-2 max-w-[46ch] text-[14.5px] leading-[1.7] text-[var(--mlw-ink-soft)]">{item.body}</p>
                </div>
              ))}
            </RevealGroup>
          </div>
        ))}
      </div>
    </Band>
  );
}

/** The three services, each with a project count. */
export function MarloweServices() {
  const { services } = MARLOWE_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="services">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {MARLOWE_SERVICES.map((service) => {
          const Icon = service.icon;
          return (
            <article
              key={service.title}
              className="flex h-full flex-col rounded-[var(--mlw-radius)] border border-[var(--mlw-line)] bg-[var(--mlw-bg-2)] p-7"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--mlw-bg-3)]">
                  <Icon className="h-5 w-5 text-[var(--mlw-coral)]" aria-hidden />
                </span>
                <span className="mlw-mono text-[var(--mlw-ink-faint)]">{service.count}</span>
              </div>
              <h3 className="mlw-display mt-6 text-[1.5rem]">{service.title}</h3>
              <p className="mt-3 text-[14.5px] leading-[1.75] text-[var(--mlw-ink-soft)]">{service.body}</p>
              <ul className="mt-6 flex flex-wrap gap-2 border-t border-[var(--mlw-line)] pt-5">
                {service.deliverables.map((item) => (
                  <li key={item} className="mlw-mono rounded-full border border-[var(--mlw-line)] px-2.5 py-1 text-[var(--mlw-ink-faint)]">
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

/** The animated skill bars. */
export function MarloweSkills() {
  return (
    <Band eyebrow="Skills" title="Tools I know cold" subtitle="A self-assessment, honestly calibrated — the high numbers are the ones I would stake a deadline on.">
      <RevealGroup className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2" step={0.06}>
        {MARLOWE_SKILLS.map((skill) => (
          <SkillBar key={skill.name} name={skill.name} level={skill.level} />
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The filterable work grid. */
export function MarloweWork() {
  const categories = useMemo(() => {
    const set = new Set(MARLOWE_PROJECTS.map((project) => project.category));
    return [MARLOWE_LABELS.allFilter, ...set];
  }, []);
  const [active, setActive] = useState<string>(MARLOWE_LABELS.allFilter);

  const shown = useMemo(
    () =>
      active === MARLOWE_LABELS.allFilter
        ? MARLOWE_PROJECTS
        : MARLOWE_PROJECTS.filter((project) => project.category === active),
    [active],
  );

  return (
    <Band eyebrow="Work" title="Selected projects" subtitle="Six recent pieces. Filter by what you need — most clients want two of the three." id="work">
      <Reveal className="mt-10 flex flex-wrap gap-2" delay={0.08}>
        {categories.map((category) => {
          const current = category === active;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActive(category)}
              aria-pressed={current}
              className={[
                'mlw-mono rounded-full px-4 py-2 transition-colors',
                current
                  ? 'bg-[var(--mlw-coral)] text-[var(--mlw-bg)]'
                  : 'border border-[var(--mlw-line)] text-[var(--mlw-ink-faint)] hover:text-[var(--mlw-ink)]',
              ].join(' ')}
            >
              {category}
            </button>
          );
        })}
      </Reveal>

      {/* `key` remounts the grid on filter change, so the reveal replays. */}
      <RevealGroup key={active} className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" step={0.05}>
        {shown.map((project) => (
          <article key={project.name} className="group overflow-hidden rounded-[var(--mlw-radius)] border border-[var(--mlw-line)] bg-[var(--mlw-bg-2)]">
            <div className={`relative aspect-[4/3] overflow-hidden ${project.plate}`}>
              <span className="mlw-mono absolute left-4 top-4 rounded-full bg-[var(--mlw-bg)] px-3 py-1 text-[var(--mlw-coral)]">
                {project.category}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="mlw-display flex items-center gap-2 text-[1.35rem]">
                  {project.name}
                  <ArrowUpRight className="h-4 w-4 -translate-x-1 text-[var(--mlw-coral)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                </h3>
                <span className="mlw-mono text-[var(--mlw-ink-faint)]">{project.year}</span>
              </div>
              <p className="mlw-mono mt-1 text-[var(--mlw-ink-faint)]">{project.client}</p>
              <p className="mt-3 text-[14px] leading-[1.7] text-[var(--mlw-ink-soft)]">{project.body}</p>
            </div>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The testimonials. */
export function MarloweTestimonials() {
  return (
    <Band eyebrow="Testimonials" title="What clients say">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {MARLOWE_TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex h-full flex-col rounded-[var(--mlw-radius)] border border-[var(--mlw-line)] bg-[var(--mlw-bg-2)] p-7"
          >
            <Quote className="h-6 w-6 text-[var(--mlw-coral)]" aria-hidden />
            <blockquote className="mt-4 flex-1 text-[15.5px] leading-[1.8] text-[var(--mlw-ink-soft)]">
              “{testimonial.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--mlw-line)] pt-5">
              <span className="mlw-mono inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--mlw-bg-3)] text-[var(--mlw-coral)]">
                {testimonial.initials}
              </span>
              <span>
                <span className="block text-[15px] font-medium">{testimonial.name}</span>
                <span className="mlw-mono block text-[var(--mlw-ink-faint)]">{testimonial.title}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The two-tier pricing table. */
export function MarlowePricing() {
  return (
    <Band eyebrow="Pricing" title="Two ways to hire me" subtitle="A fixed-scope project, or a standing slice of my week. No hourly billing, no surprises." id="pricing">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-2" step={0.1}>
        {MARLOWE_PRICING.map((plan) => (
          <article
            key={plan.name}
            className={[
              'flex h-full flex-col rounded-[var(--mlw-radius)] p-8',
              plan.featured
                ? 'border border-[var(--mlw-coral)] bg-[var(--mlw-bg-2)]'
                : 'border border-[var(--mlw-line)] bg-[var(--mlw-bg-2)]',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <h3 className="mlw-display text-[1.6rem]">{plan.name}</h3>
              {plan.featured && (
                <span className="mlw-mono rounded-full bg-[var(--mlw-coral)] px-3 py-1 text-[var(--mlw-bg)]">Most popular</span>
              )}
            </div>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="mlw-display text-[clamp(2rem,4vw,2.8rem)]">{plan.price}</span>
              <span className="mlw-mono text-[var(--mlw-ink-faint)]">{plan.cadence}</span>
            </p>
            <p className="mt-3 text-[14.5px] leading-[1.7] text-[var(--mlw-ink-soft)]">{plan.summary}</p>
            <ul className="mt-6 flex-1 space-y-3 border-t border-[var(--mlw-line)] pt-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-[15px]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--mlw-coral)]" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className={[
                'mlw-mono mt-8 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 transition-opacity hover:opacity-90',
                plan.featured
                  ? 'bg-[var(--mlw-coral)] text-[var(--mlw-bg)]'
                  : 'border border-[var(--mlw-line-strong)] text-[var(--mlw-ink)]',
              ].join(' ')}
            >
              {plan.cta}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </article>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** The FAQ. */
export function MarloweFaq() {
  const { faq } = MARLOWE_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-10 max-w-3xl">
        <RevealGroup className="border-t border-[var(--mlw-line)]" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--mlw-line)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`mlw-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--mlw-coral)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--mlw-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`mlw-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.85] text-[var(--mlw-ink-soft)]">
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
export function MarloweContact() {
  const { contact } = MARLOWE_CONTENT;
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
                <label htmlFor={`mlw-${field}`} className="mlw-mono block text-[var(--mlw-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`mlw-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y rounded-[12px] border border-[var(--mlw-line)] bg-[var(--mlw-bg-2)] px-4 py-3 text-[16px] text-[var(--mlw-ink)] focus:border-[var(--mlw-coral)]"
                  />
                ) : (
                  <input
                    id={`mlw-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full rounded-[12px] border border-[var(--mlw-line)] bg-[var(--mlw-bg-2)] px-4 py-3 text-[16px] text-[var(--mlw-ink)] focus:border-[var(--mlw-coral)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="mlw-mono inline-flex items-center gap-2 rounded-full bg-[var(--mlw-coral)] px-6 py-3.5 text-[var(--mlw-bg)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--mlw-coral)]">
              {sent ? 'This is a template. Wire the form to your own inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--mlw-line)]" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--mlw-line)] py-5">
              <p className="mlw-mono text-[var(--mlw-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function MarloweFooter() {
  const { footer, brand } = MARLOWE_CONTENT;
  return (
    <footer className="border-t border-[var(--mlw-line)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="mlw-display text-[1.7rem]">
            {brand}
            <span className="mlw-accent">.</span>
          </p>
          <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--mlw-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="mlw-mono text-[var(--mlw-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#top" className="text-[14px] text-[var(--mlw-ink-soft)] hover:text-[var(--mlw-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--mlw-line)] pt-7 text-[12.5px] text-[var(--mlw-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
