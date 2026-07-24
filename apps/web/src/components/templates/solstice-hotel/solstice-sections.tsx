'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Menu, Minus, Plus, X } from 'lucide-react';
import {
  SOLSTICE_CONTENT,
  SOLSTICE_EXPERIENCES,
  SOLSTICE_FACTS,
  SOLSTICE_LABELS,
  SOLSTICE_MENU,
  SOLSTICE_NAV,
  SOLSTICE_ROOMS,
  type SolsticeMasthead,
  type SolsticePageId,
} from '@/data/templates/solstice-hotel-content';
import { Counter, PlateReveal, Reveal, RevealGroup, SplitLines } from './solstice-motion';

/**
 * SOLSTICE - the section library.
 *
 * Every section on every page lives here, because they share one shell (small
 * caps, a serif title, a great deal of space) and splitting them across a dozen
 * files would mean a dozen copies of that shell. Page compositions live in
 * `solstice-pages.tsx`.
 *
 * No section holds copy - everything reads from the content module.
 */

/** The shell every band shares. `SplitLines` is used on the title only. */
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
        'px-5 py-28 sm:px-8 sm:py-36',
        dark ? 'bg-[var(--sol-bg-deep)] text-[var(--sol-on-deep)]' : '',
      ].join(' ')}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className={dark ? 'sol-caps text-[var(--sol-on-deep-soft)]' : 'sol-caps text-[var(--sol-clay)]'}>
            {eyebrow}
          </p>
        </Reveal>
        <SplitLines
          as="h2"
          delay={0.05}
          className="sol-display mt-6 max-w-3xl text-[clamp(2rem,4.4vw,3.4rem)]"
        >
          {title}
        </SplitLines>
        {subtitle && (
          <Reveal delay={0.15}>
            <p
              className={[
                'mt-7 max-w-[62ch] text-pretty text-[17px] leading-[1.85]',
                dark ? 'text-[var(--sol-on-deep-soft)]' : 'text-[var(--sol-ink-soft)]',
              ].join(' ')}
            >
              {subtitle}
            </p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/** The header. Transparent over the hero, paper once you scroll. */
export function SolsticeHeader({ page }: { page: SolsticePageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [page]);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-colors duration-700',
        scrolled ? 'border-b border-[var(--sol-rule)] bg-[var(--sol-bg)]' : 'border-b border-transparent',
      ].join(' ')}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <a href="?page=home" className="sol-display text-[1.35rem] tracking-tight">
          Solstice
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {SOLSTICE_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'sol-caps pb-1 transition-colors',
                  current
                    ? 'border-b border-[var(--sol-clay)] text-[var(--sol-clay)]'
                    : 'text-[var(--sol-ink-faint)] hover:text-[var(--sol-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <a
          href="?page=contact"
          className="sol-caps hidden border border-[var(--sol-ink)] px-5 py-2.5 transition-colors hover:bg-[var(--sol-ink)] hover:text-[var(--sol-bg)] md:inline-block"
        >
          Check dates
        </a>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="sol-mobile-nav"
          aria-label={open ? SOLSTICE_LABELS.close : SOLSTICE_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="sol-mobile-nav" aria-label="Primary" className="border-t border-[var(--sol-rule)] bg-[var(--sol-bg)] px-5 py-3 md:hidden">
          {SOLSTICE_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block py-3 text-[16px]',
                item.id === page ? 'text-[var(--sol-clay)]' : 'text-[var(--sol-ink-soft)]',
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

/** The opening screen: a full-bleed plate with the title set over it. */
export function SolsticeHero() {
  const { hero } = SOLSTICE_CONTENT;

  return (
    <section className="px-5 pb-6 pt-10 sm:px-8 sm:pb-10 sm:pt-14">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="sol-caps text-[var(--sol-clay)]">{hero.badge}</p>
        </Reveal>

        <SplitLines as="h1" delay={0.1} className="sol-display mt-7 max-w-4xl text-[clamp(2.6rem,7vw,5.4rem)]">
          {`${hero.title} ${hero.titleAccent}`}
        </SplitLines>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <Reveal delay={0.25}>
            <p className="max-w-[54ch] text-pretty text-[17.5px] leading-[1.85] text-[var(--sol-ink-soft)]">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="flex flex-wrap gap-3">
              <a
                href="?page=contact"
                className="sol-caps inline-flex items-center gap-2 bg-[var(--sol-ink)] px-6 py-3.5 text-[var(--sol-bg)] transition-opacity hover:opacity-90"
              >
                {hero.ctaPrimary}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </a>
              <a
                href="?page=rooms"
                className="sol-caps inline-flex items-center border border-[var(--sol-ink)] px-6 py-3.5 transition-colors hover:bg-[var(--sol-ink)] hover:text-[var(--sol-bg)]"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </Reveal>
        </div>

        <PlateReveal
          plate="sol-plate-warm"
          className="relative mt-14 h-[clamp(20rem,52vh,34rem)] overflow-hidden"
        />

        <dl className="mt-14 grid grid-cols-3 gap-8 border-t border-[var(--sol-rule)] pt-10">
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <dd className="sol-display text-[clamp(2rem,4vw,2.8rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="sol-caps mt-2 text-[var(--sol-ink-faint)]">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/** A page's opening band. */
export function SolsticeMasthead({ masthead }: { masthead: SolsticeMasthead }) {
  return (
    <section className="px-5 pb-4 pt-16 sm:px-8 sm:pb-8 sm:pt-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="sol-caps text-[var(--sol-clay)]">{masthead.eyebrow}</p>
        </Reveal>
        <SplitLines as="h1" delay={0.06} className="sol-display mt-6 text-[clamp(2.2rem,5.2vw,3.9rem)]">
          {masthead.title}
        </SplitLines>
        <Reveal delay={0.18}>
          <p className="mt-7 max-w-[62ch] text-pretty text-[17px] leading-[1.85] text-[var(--sol-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The scrolling word strip. CSS keyframes: it has no scroll relationship. */
export function SolsticeMarquee() {
  const words = SOLSTICE_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden border-y border-[var(--sol-rule)] py-5">
      <div className="flex w-max animate-[sol-marquee_44s_linear_infinite] gap-14 pr-14">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="sol-caps text-[var(--sol-ink-faint)]">
            {word}
          </span>
        ))}
      </div>
      <style>{`@keyframes sol-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[sol-marquee_44s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** The house narrative, set against a tall plate. */
export function SolsticeAbout() {
  const { about } = SOLSTICE_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-14 grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <Reveal>
            {about.body.map((paragraph) => (
              <p key={paragraph} className="mb-6 max-w-[58ch] text-[17px] leading-[1.9] text-[var(--sol-ink-soft)]">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <RevealGroup className="mt-10 border-t border-[var(--sol-rule)]" delay={0.1}>
            {about.points.map((point) => (
              <p key={point} className="border-b border-[var(--sol-rule)] py-4 text-[15.5px]">
                {point}
              </p>
            ))}
          </RevealGroup>
        </div>

        <PlateReveal plate="sol-plate-cool" className="relative h-[26rem] overflow-hidden lg:h-full lg:min-h-[30rem]" />
      </div>
    </Band>
  );
}

/** The rooms, alternating side to side. */
export function SolsticeRooms() {
  return (
    <Band
      eyebrow="The rooms"
      title="Fourteen rooms, no two the same"
      subtitle="The building refused to divide evenly, so we stopped trying. Each room kept the proportions the walls gave it."
    >
      <div className="mt-16 space-y-20">
        {SOLSTICE_ROOMS.map((room, i) => (
          <article
            key={room.name}
            className={[
              'grid gap-10 lg:grid-cols-2 lg:items-center',
              i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : '',
            ].join(' ')}
          >
            <PlateReveal plate={room.plate} className="relative h-[20rem] overflow-hidden sm:h-[26rem]" />

            <div>
              <Reveal>
                <p className="sol-caps text-[var(--sol-clay)]">{room.aspect}</p>
                <h3 className="sol-display mt-4 text-[clamp(1.8rem,3.2vw,2.6rem)]">{room.name}</h3>
                <p className="mt-3 text-[15px] text-[var(--sol-ink-faint)]">{room.rate} a night</p>
                <p className="mt-5 max-w-[52ch] text-[16.5px] leading-[1.85] text-[var(--sol-ink-soft)]">
                  {room.body}
                </p>
              </Reveal>

              <RevealGroup className="mt-8 flex flex-wrap gap-x-8 gap-y-3" delay={0.1} step={0.05}>
                {room.details.map((detail) => (
                  <span key={detail} className="sol-caps text-[var(--sol-ink-faint)]">
                    {detail}
                  </span>
                ))}
              </RevealGroup>
            </div>
          </article>
        ))}
      </div>
    </Band>
  );
}

/** The menu, on the dark band — the one inversion on the site. */
export function SolsticeDining() {
  return (
    <Band
      dark
      eyebrow="The table"
      title="One menu, written each morning"
      subtitle="What arrives from the valley decides what is served. The kitchen writes the card after the delivery, not before."
    >
      <RevealGroup className="mt-16 grid gap-x-14 gap-y-12 sm:grid-cols-2">
        {SOLSTICE_MENU.map((dish) => {
          const Icon = dish.icon;
          return (
            <div key={dish.title} className="border-t border-[var(--sol-on-deep-rule)] pt-7">
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-[var(--sol-clay-soft)]" aria-hidden />
                <p className="sol-caps text-[var(--sol-on-deep-soft)]">{dish.course}</p>
              </div>
              <h3 className="sol-display mt-4 text-[1.6rem]">{dish.title}</h3>
              <p className="mt-3 max-w-[46ch] text-[15.5px] leading-[1.85] text-[var(--sol-on-deep-soft)]">
                {dish.body}
              </p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The things to do. */
export function SolsticeExperiences() {
  const { why } = SOLSTICE_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-16 grid gap-x-12 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
        {SOLSTICE_EXPERIENCES.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="border-t border-[var(--sol-rule)] pt-6">
              <div className="flex items-center justify-between gap-4">
                <Icon className="h-4 w-4 text-[var(--sol-clay)]" aria-hidden />
                <span className="sol-caps text-[var(--sol-ink-faint)]">{item.duration}</span>
              </div>
              <h3 className="sol-serif mt-4 text-[1.3rem] leading-snug">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.8] text-[var(--sol-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The figures. */
export function SolsticeFacts() {
  return (
    <section className="px-5 pb-8 sm:px-8">
      <Reveal className="mx-auto grid max-w-6xl grid-cols-2 gap-8 border-y border-[var(--sol-rule)] py-14 lg:grid-cols-4">
        {SOLSTICE_FACTS.map((fact) => (
          <div key={fact.label}>
            <p className="sol-display text-[clamp(1.9rem,3.4vw,2.6rem)] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="sol-caps mt-2 text-[var(--sol-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

/** The FAQ. */
export function SolsticeFaq() {
  const { faq } = SOLSTICE_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-14 max-w-3xl">
        <RevealGroup className="border-t border-[var(--sol-rule)]" step={0.05}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="border-b border-[var(--sol-rule)]">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`sol-faq-${i}`}
                    className="sol-serif flex w-full items-center justify-between gap-6 py-6 text-left text-[1.15rem]"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--sol-clay)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--sol-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`sol-faq-${i}`} className="max-w-[60ch] pb-7 text-[15.5px] leading-[1.9] text-[var(--sol-ink-soft)]">
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

/** The enquiry band. The form posts nowhere and says so. */
export function SolsticeContact() {
  const { contact } = SOLSTICE_CONTENT;
  const [sent, setSent] = useState(false);

  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-14 grid gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form
            className="space-y-7"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`sol-${field}`} className="sol-caps block text-[var(--sol-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`sol-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="mt-3 w-full resize-y border-b border-[var(--sol-rule)] bg-transparent pb-3 text-[16px] text-[var(--sol-ink)] focus:border-[var(--sol-clay)]"
                  />
                ) : (
                  <input
                    id={`sol-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="mt-3 w-full border-b border-[var(--sol-rule)] bg-transparent pb-3 text-[16px] text-[var(--sol-ink)] focus:border-[var(--sol-clay)]"
                  />
                )}
              </div>
            ))}

            <button
              type="submit"
              className="sol-caps inline-flex items-center gap-2 bg-[var(--sol-ink)] px-7 py-3.5 text-[var(--sol-bg)] transition-opacity hover:opacity-90"
            >
              {contact.submit}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>

            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--sol-clay)]">
              {sent ? 'This is a template. Wire the form to your own reservations inbox.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="border-t border-[var(--sol-rule)]" delay={0.1}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-b border-[var(--sol-rule)] py-5">
              <p className="sol-caps text-[var(--sol-ink-faint)]">{detail.label}</p>
              <p className="sol-serif mt-2 text-[1.05rem]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function SolsticeFooter() {
  const { footer, brand } = SOLSTICE_CONTENT;
  return (
    <footer className="border-t border-[var(--sol-rule)] px-5 py-16 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="sol-display text-[1.5rem]">{brand}</p>
          <p className="mt-4 max-w-xs text-[14.5px] leading-[1.8] text-[var(--sol-ink-faint)]">{footer.tagline}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="sol-caps text-[var(--sol-ink-faint)]">{column.title}</p>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14.5px] text-[var(--sol-ink-soft)] hover:text-[var(--sol-ink)]">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-14 max-w-6xl border-t border-[var(--sol-rule)] pt-8 text-[12.5px] text-[var(--sol-ink-faint)]">
        {footer.legal}
      </p>
    </footer>
  );
}
