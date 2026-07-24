'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, Check, Menu, Minus, Plus, X } from 'lucide-react';
import {
  SCULPT_ARTICLES,
  SCULPT_CONTENT,
  SCULPT_FACTS,
  SCULPT_LABELS,
  SCULPT_NAV,
  SCULPT_PRODUCTS,
  SCULPT_TECH,
  type SculptMasthead,
  type SculptPageId,
} from '@/data/templates/sculpt-audio-content';
import { Counter, DragSlider, PressSurface, Reveal, RevealGroup, useHeroIntro } from './sculpt-motion';

/**
 * SCULPT - the section library.
 *
 * Every section on every page lives here, because they share one shell (a mono
 * eyebrow, a display title, a soft body) and splitting them across a dozen
 * files would mean a dozen copies of that shell. Page compositions live in
 * `sculpt-pages.tsx`; this file only knows how one band looks.
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
          <p className="scu-mono text-[var(--scu-accent)]">{eyebrow}</p>
          <h2 className="scu-display mt-4 max-w-3xl text-[clamp(1.9rem,4vw,3rem)]">{title}</h2>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-pretty text-[16px] leading-[1.75] text-[var(--scu-ink-soft)]">
              {subtitle}
            </p>
          )}
        </Reveal>
        {children}
      </div>
    </section>
  );
}

/** The header. A raised bar that sinks into the page once you scroll past it. */
export function SculptHeader({ page }: { page: SculptPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [page]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={[
          'mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 transition-shadow duration-500',
          scrolled ? 'scu-raised !rounded-full' : '',
        ].join(' ')}
      >
        <a href="?page=home" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
          <span aria-hidden className="scu-raised h-7 w-7 !rounded-full" />
          Sculpt
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {SCULPT_NAV.map((item) => {
            const current = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={current ? 'page' : undefined}
                className={[
                  'rounded-full px-4 py-2 text-[13.5px] transition-colors',
                  current ? 'scu-sunk !rounded-full' : 'text-[var(--scu-ink-faint)] hover:text-[var(--scu-ink)]',
                ].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <PressSurface
          as="a"
          className="scu-raised hidden !rounded-full px-5 py-2.5 text-[13.5px] font-medium md:inline-flex"
        >
          Find a stockist
        </PressSurface>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="scu-mobile-nav"
          aria-label={open ? SCULPT_LABELS.close : SCULPT_LABELS.menu}
          className="md:hidden"
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>

      {open && (
        <nav id="scu-mobile-nav" aria-label="Primary" className="scu-raised mx-auto mt-3 max-w-7xl p-2 md:hidden">
          {SCULPT_NAV.map((item) => (
            <a
              key={item.id}
              href={`?page=${item.id}`}
              aria-current={item.id === page ? 'page' : undefined}
              className={[
                'block rounded-xl px-4 py-3 text-[15px]',
                item.id === page ? 'scu-sunk' : 'text-[var(--scu-ink-soft)]',
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

/**
 * The opening screen, and the only place the draggable control appears.
 *
 * The slider is a listening-level demo: it does nothing to any audio, and the
 * copy says so rather than implying the page is playing something.
 */
export function SculptHero() {
  const ref = useHeroIntro<HTMLElement>();
  const [level, setLevel] = useState(62);
  const { hero } = SCULPT_CONTENT;

  return (
    <section ref={ref} className="px-5 pb-24 pt-14 sm:px-8 sm:pb-32 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p data-scu-intro className="scu-sunk inline-flex !rounded-full px-4 py-1.5 text-[12.5px] text-[var(--scu-ink-soft)]">
            {hero.badge}
          </p>

          <h1 data-scu-intro className="scu-display mt-7 text-[clamp(2.5rem,6vw,4.4rem)]">
            {hero.title}{' '}
            <span className="text-[var(--scu-accent)]">{hero.titleAccent}</span>
          </h1>

          <p data-scu-intro className="mt-6 max-w-xl text-pretty text-[16.5px] leading-[1.75] text-[var(--scu-ink-soft)]">
            {hero.subtitle}
          </p>

          <div data-scu-intro className="mt-9 flex flex-wrap gap-3">
            <PressSurface
              as="a"
              className="scu-raised inline-flex items-center gap-2 !rounded-full px-6 py-3 text-[14.5px] font-medium"
            >
              {hero.ctaPrimary}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </PressSurface>
            <PressSurface
              as="a"
              className="scu-sunk inline-flex items-center !rounded-full px-6 py-3 text-[14.5px]"
            >
              {hero.ctaSecondary}
            </PressSurface>
          </div>

          <dl data-scu-intro className="mt-12 grid max-w-lg grid-cols-3 gap-6">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="scu-display text-[1.9rem] tabular-nums">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-1 text-[12.5px] text-[var(--scu-ink-faint)]">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>

        <div data-scu-intro className="scu-raised scu-raised-lg p-8 sm:p-10">
          <p className="scu-mono text-[var(--scu-ink-faint)]">Listening level</p>
          <p className="mt-3 text-[14px] leading-[1.7] text-[var(--scu-ink-soft)]">
            Drag the control, or focus it and use the arrow keys. It is a demonstration of the
            physical UI, not a volume control — nothing on this page plays audio.
          </p>

          <div className="mt-8">
            <DragSlider label="Output" value={level} onChange={setLevel} suffix="%" />
          </div>

          {/* A visual response to the value, so the control is seen to do something. */}
          <div className="mt-8 flex h-24 items-end gap-1.5" aria-hidden>
            {Array.from({ length: 24 }, (_, i) => {
              const active = (i / 23) * 100 <= level;
              const height = 22 + Math.round(Math.sin((i / 23) * Math.PI) * 62);
              return (
                <span
                  key={i}
                  style={{ height: `${height}%` }}
                  className={[
                    'flex-1 rounded-full transition-colors duration-300',
                    active ? 'bg-[var(--scu-accent)]' : 'bg-[var(--scu-shade)]',
                  ].join(' ')}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/** A page's opening band. */
export function SculptMasthead({ masthead }: { masthead: SculptMasthead }) {
  return (
    <section className="px-5 pb-6 pt-16 sm:px-8 sm:pb-10 sm:pt-24">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="scu-mono text-[var(--scu-accent)]">{masthead.eyebrow}</p>
          <h1 className="scu-display mt-4 text-[clamp(2.1rem,5vw,3.7rem)]">{masthead.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[16.5px] leading-[1.75] text-[var(--scu-ink-soft)]">
            {masthead.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/** The scrolling word strip. CSS keyframes, not anime.js: see halcyon's note. */
export function SculptMarquee() {
  const words = SCULPT_CONTENT.marquee;
  return (
    <div aria-hidden className="overflow-hidden py-4">
      <div className="flex w-max animate-[scu-marquee_36s_linear_infinite] gap-10 pr-10">
        {[...words, ...words].map((word, i) => (
          <span key={`${word}-${i}`} className="scu-mono text-[var(--scu-ink-faint)]">
            {word}
          </span>
        ))}
      </div>
      <style>{`@keyframes scu-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media (prefers-reduced-motion: reduce){.animate-\\[scu-marquee_36s_linear_infinite\\]{animation:none}}`}</style>
    </div>
  );
}

/** The product range, with spec tables. */
export function SculptProducts() {
  const { services } = SCULPT_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle}>
      <RevealGroup className="mt-14 grid gap-6 lg:grid-cols-2" step={0.08}>
        {SCULPT_PRODUCTS.map((product) => {
          const Icon = product.icon;
          return (
            <article key={product.name} className="scu-raised p-8">
              <div className="flex items-start justify-between gap-6">
                <span aria-hidden className="scu-sunk inline-flex h-12 w-12 items-center justify-center !rounded-2xl text-[var(--scu-accent)]">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="scu-mono text-[var(--scu-ink-faint)]">{product.role}</p>
              </div>

              <h3 className="scu-display mt-6 text-[1.5rem]">{product.name}</h3>
              <p className="mt-1 text-[15px] font-medium text-[var(--scu-accent)]">{product.price}</p>
              <p className="mt-3 text-[14.5px] leading-[1.7] text-[var(--scu-ink-soft)]">{product.body}</p>

              <dl className="mt-6 space-y-2.5 border-t border-[var(--scu-edge)] pt-5">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="flex items-baseline justify-between gap-6">
                    <dt className="text-[13px] text-[var(--scu-ink-faint)]">{spec.label}</dt>
                    <dd className="text-right text-[13.5px]">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The engineering claims, each with one hard figure. */
export function SculptTechnology() {
  const { why } = SCULPT_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle}>
      <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SCULPT_TECH.map((tech) => {
          const Icon = tech.icon;
          return (
            <article key={tech.title} className="scu-raised p-7">
              <span aria-hidden className="scu-sunk inline-flex h-11 w-11 items-center justify-center !rounded-2xl text-[var(--scu-accent)]">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <h3 className="mt-5 text-[16px] font-medium tracking-tight">{tech.title}</h3>
              <p className="mt-2.5 text-[14px] leading-[1.7] text-[var(--scu-ink-faint)]">{tech.body}</p>
              <p className="mt-6 border-t border-[var(--scu-edge)] pt-4">
                <span className="scu-display text-[1.5rem]">{tech.figure}</span>
                <span className="ml-2 text-[12.5px] text-[var(--scu-ink-faint)]">{tech.figureLabel}</span>
              </p>
            </article>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The narrative band with a checklist. */
export function SculptAbout() {
  const { about } = SCULPT_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title}>
      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <Reveal>
          {about.body.map((paragraph) => (
            <p key={paragraph} className="mb-5 text-[16px] leading-[1.8] text-[var(--scu-ink-soft)]">
              {paragraph}
            </p>
          ))}
        </Reveal>
        <RevealGroup className="scu-sunk space-y-4 p-8" delay={0.08}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-3 text-[14.5px] leading-[1.7]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--scu-accent)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Support articles, plus the company figures. */
export function SculptSupport() {
  return (
    <Band
      eyebrow="Guides"
      title="Everything you might need to open"
      subtitle="Written by the people who designed the part you are about to remove."
    >
      <RevealGroup className="mt-14 grid gap-5 sm:grid-cols-2">
        {SCULPT_ARTICLES.map((article) => {
          const Icon = article.icon;
          return (
            <PressSurface key={article.title} as="article" className="scu-raised cursor-pointer p-7">
              <div className="flex items-start gap-4">
                <span aria-hidden className="scu-sunk inline-flex h-11 w-11 shrink-0 items-center justify-center !rounded-2xl text-[var(--scu-accent)]">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div>
                  <h3 className="text-[15.5px] font-medium tracking-tight">{article.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.7] text-[var(--scu-ink-faint)]">{article.body}</p>
                  <p className="scu-mono mt-3 text-[var(--scu-ink-faint)]">{article.minutes}</p>
                </div>
              </div>
            </PressSurface>
          );
        })}
      </RevealGroup>

      <Reveal className="scu-sunk mt-14 grid grid-cols-2 gap-8 p-10 lg:grid-cols-4">
        {SCULPT_FACTS.map((fact) => (
          <div key={fact.label}>
            <p className="scu-display text-[2rem] tabular-nums">
              <Counter value={fact.value} suffix={fact.suffix} />
            </p>
            <p className="mt-1.5 text-[12.5px] text-[var(--scu-ink-faint)]">{fact.label}</p>
          </div>
        ))}
      </Reveal>
    </Band>
  );
}

/** The FAQ. */
export function SculptFaq() {
  const { faq } = SCULPT_CONTENT;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Band eyebrow={faq.eyebrow} title={faq.title}>
      <div className="mt-12 max-w-3xl">
        <RevealGroup className="space-y-3" step={0.05}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className={expanded ? 'scu-sunk' : 'scu-raised'}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : i)}
                    aria-expanded={expanded}
                    aria-controls={`scu-faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left text-[15.5px] font-medium"
                  >
                    {item.question}
                    {expanded ? (
                      <Minus className="h-4 w-4 shrink-0 text-[var(--scu-ink-faint)]" aria-hidden />
                    ) : (
                      <Plus className="h-4 w-4 shrink-0 text-[var(--scu-ink-faint)]" aria-hidden />
                    )}
                  </button>
                </h3>
                {expanded && (
                  <div id={`scu-faq-${i}`} className="px-6 pb-6 text-[14.5px] leading-[1.8] text-[var(--scu-ink-soft)]">
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
export function SculptContact() {
  const { contact } = SCULPT_CONTENT;
  const [sent, setSent] = useState(false);

  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <Reveal>
          <form
            className="scu-raised space-y-4 p-8"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`scu-${field}`} className="scu-mono block text-[var(--scu-ink-faint)]">
                  {contact.fields[field]}
                </label>
                {field === 'message' ? (
                  <textarea
                    id={`scu-${field}`}
                    name={field}
                    rows={4}
                    required
                    className="scu-sunk mt-2 w-full resize-y px-4 py-3 text-[15px] text-[var(--scu-ink)]"
                  />
                ) : (
                  <input
                    id={`scu-${field}`}
                    name={field}
                    type={field === 'email' ? 'email' : 'text'}
                    required
                    className="scu-sunk mt-2 w-full px-4 py-3 text-[15px] text-[var(--scu-ink)]"
                  />
                )}
              </div>
            ))}

            <PressSurface
              as="button"
              className="scu-raised inline-flex items-center gap-2 !rounded-full px-6 py-3 text-[14.5px] font-medium"
            >
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </PressSurface>

            <p aria-live="polite" className="min-h-5 text-[13px] text-[var(--scu-accent)]">
              {sent ? 'This is a template. Wire the form to your own endpoint.' : ''}
            </p>
          </form>
        </Reveal>

        <RevealGroup className="space-y-6" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="border-t border-[var(--scu-edge)] pt-4">
              <p className="scu-mono text-[var(--scu-ink-faint)]">{detail.label}</p>
              <p className="mt-1.5 text-[15px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** The footer. */
export function SculptFooter() {
  const { footer, brand } = SCULPT_CONTENT;
  return (
    <footer className="px-5 pb-14 pt-8 sm:px-8">
      <div className="scu-raised mx-auto max-w-6xl p-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <p className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
              <span aria-hidden className="scu-sunk h-7 w-7 !rounded-full" />
              {brand}
            </p>
            <p className="mt-4 max-w-xs text-[14px] leading-[1.7] text-[var(--scu-ink-faint)]">{footer.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footer.columns.map((column) => (
              <div key={column.title}>
                <p className="scu-mono text-[var(--scu-ink-faint)]">{column.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="?page=home" className="text-[14px] text-[var(--scu-ink-soft)] hover:text-[var(--scu-ink)]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 border-t border-[var(--scu-edge)] pt-7 text-[12.5px] text-[var(--scu-ink-faint)]">
          {footer.legal}
        </p>
      </div>
    </footer>
  );
}
