'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, CalendarCheck, Check, Menu, Minus, Phone, Plus, Star, X } from 'lucide-react';
import {
  ASTER_CONTENT,
  ASTER_DEPARTMENTS,
  ASTER_DOCTORS,
  ASTER_LABELS,
  ASTER_NAV,
  ASTER_POSTS,
  ASTER_STATS,
  ASTER_STEPS,
  ASTER_TESTIMONIALS,
  type AsterMasthead as AsterMastheadData,
  type AsterPageId,
} from '@/data/templates/healthcare-content';
import { Counter, Line, LiftLines, Reveal, RevealGroup } from './aster-motion';

/**
 * ASTER - the section library. A single source composed into pages by
 * `aster-pages.tsx`; no section holds copy of its own. Navigation is by
 * `?page=`, so links work in any host.
 */

function Band({
  eyebrow,
  title,
  subtitle,
  children,
  id,
  center,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
  id?: string;
  center?: boolean;
}) {
  return (
    <section id={id} className="scroll-mt-28 px-5 py-24 sm:px-8 sm:py-28">
      <div className={`mx-auto max-w-6xl ${center ? 'text-center' : ''}`}>
        <Reveal>
          <p className={`as-mono inline-flex items-center gap-2 rounded-full bg-[var(--as-teal-soft)] px-3 py-1 text-[var(--as-teal)] ${center ? 'mx-auto' : ''}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--as-teal)]" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className={`as-display mt-5 text-[clamp(1.9rem,4.4vw,3.2rem)] ${center ? 'mx-auto max-w-3xl' : 'max-w-4xl'}`} delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className={`mt-5 text-[16.5px] leading-[1.75] text-[var(--as-ink-soft)] ${center ? 'mx-auto max-w-[62ch]' : 'max-w-[62ch]'}`}>{subtitle}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

function BrandMark() {
  return (
    <a href="?page=home" className="flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--as-blue)]" aria-hidden>
        <Plus className="h-5 w-5 text-white" strokeWidth={3} />
      </span>
      <span className="as-display text-[1.3rem]">{ASTER_CONTENT.brand}</span>
    </a>
  );
}

/** Header with an emergency line. */
export function AsterHeader({ page }: { page: AsterPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-[var(--as-blue)] text-white">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-between px-5 text-[12.5px] sm:px-8">
          <span className="inline-flex items-center gap-2">
            <Phone className="h-3.5 w-3.5" aria-hidden />
            {ASTER_LABELS.emergency}
          </span>
          <span className="hidden sm:inline">Patient portal</span>
        </div>
      </div>
      <div className={['transition-colors duration-300', scrolled ? 'border-b border-[var(--as-line)] bg-[color-mix(in_srgb,var(--as-bg)_88%,transparent)] backdrop-blur-md' : 'bg-[var(--as-bg)]'].join(' ')}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
          <BrandMark />
          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {ASTER_NAV.map((item) => {
              const active = item.id === page;
              return (
                <a key={item.id} href={`?page=${item.id}`} aria-current={active ? 'page' : undefined} className={['rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors', active ? 'bg-[var(--as-blue-soft)] text-[var(--as-blue)]' : 'text-[var(--as-ink-soft)] hover:text-[var(--as-ink)]'].join(' ')}>
                  {item.label}
                </a>
              );
            })}
          </nav>
          <a href="?page=appointments" className="hidden items-center gap-2 rounded-full bg-[var(--as-blue)] px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-[var(--as-blue-deep)] lg:inline-flex">
            {ASTER_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="as-mobile" aria-label={open ? ASTER_LABELS.close : ASTER_LABELS.menu} className="lg:hidden">
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="as-mobile" aria-label="Primary" className="border-t border-[var(--as-line)] bg-[var(--as-bg)] px-5 py-2 lg:hidden">
          {ASTER_NAV.map((item) => (
            <a key={item.id} href={`?page=${item.id}`} onClick={() => setOpen(false)} className="block py-3 text-[15px] text-[var(--as-ink-soft)]">
              {item.label}
            </a>
          ))}
          <a href="?page=appointments" onClick={() => setOpen(false)} className="my-2 inline-flex items-center gap-2 rounded-full bg-[var(--as-blue)] px-5 py-2.5 text-[14px] font-medium text-white">
            {ASTER_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}

/** The floating "next available appointment" card. */
function AppointmentCard() {
  return (
    <div className="relative mx-auto w-full max-w-sm" aria-hidden>
      <div className="rounded-[24px] border border-[var(--as-line)] bg-[var(--as-bg)] p-6 shadow-[0_30px_70px_-30px_rgb(31_122_224/45%)]">
        <div className="flex items-center gap-3">
          <span className="as-plate-b h-12 w-12 shrink-0 rounded-full" />
          <div>
            <p className="text-[15px] font-semibold">Dr. Amara Okafor</p>
            <p className="text-[12.5px] text-[var(--as-ink-faint)]">Cardiology</p>
          </div>
          <span className="relative ml-auto inline-flex h-2.5 w-2.5">
            <span className="as-pulse absolute inset-0 rounded-full" />
            <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--as-teal)]" />
          </span>
        </div>
        <div className="mt-5 rounded-2xl bg-[var(--as-soft)] p-4">
          <p className="as-mono text-[var(--as-ink-faint)]">Next available</p>
          <p className="mt-1 text-[17px] font-semibold">Today, 3:40 PM</p>
          <div className="mt-3 flex gap-2">
            {['9:00', '11:20', '15:40', '17:00'].map((t, i) => (
              <span key={t} className={['rounded-lg px-2.5 py-1 text-[12px]', i === 2 ? 'bg-[var(--as-blue)] text-white' : 'bg-[var(--as-bg)] text-[var(--as-ink-soft)]'].join(' ')}>{t}</span>
            ))}
          </div>
        </div>
        <div className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--as-blue)] px-5 py-3 text-[14px] font-medium text-white">
          <CalendarCheck className="h-4 w-4" /> Book this slot
        </div>
      </div>
    </div>
  );
}

/** The hero. */
export function AsterHero() {
  const { hero } = ASTER_CONTENT;
  return (
    <section id="top" className="relative isolate overflow-hidden px-5 pb-20 pt-40 sm:px-8 sm:pb-28 sm:pt-48">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--as-soft)] to-[var(--as-bg)]" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="as-mono inline-flex items-center gap-2 rounded-full bg-[var(--as-teal-soft)] px-3.5 py-1.5 text-[var(--as-teal)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--as-teal)]" aria-hidden />
              {hero.badge}
            </p>
          </Reveal>
          <LiftLines as="h1" className="as-display mt-7 text-[clamp(2.6rem,6.5vw,4.6rem)]" delay={0.06}>
            <Line>{hero.title}</Line>
            <Line>
              <span className="as-accent">{hero.titleAccent}</span>
            </Line>
          </LiftLines>
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[var(--as-ink-soft)]">{hero.subtitle}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="?page=appointments" className="inline-flex items-center gap-2 rounded-full bg-[var(--as-blue)] px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[var(--as-blue-deep)]">
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="?page=doctors" className="inline-flex items-center gap-2 rounded-full border border-[var(--as-line)] px-6 py-3.5 text-[14.5px] font-medium transition-colors hover:bg-[var(--as-panel)]">
                {hero.ctaSecondary}
                <ArrowUpRight className="h-4 w-4 text-[var(--as-blue)]" aria-hidden />
              </a>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid max-w-md grid-cols-3 gap-6" delay={0.1}>
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <p className="as-display text-[clamp(1.6rem,3vw,2.1rem)] tabular-nums text-[var(--as-blue)]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="as-mono mt-1 text-[10px] text-[var(--as-ink-faint)]">{stat.label}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
        <Reveal delay={0.18}>
          <AppointmentCard />
        </Reveal>
      </div>
    </section>
  );
}

/** Inner-page masthead. */
export function AsterMasthead({ masthead }: { masthead: AsterMastheadData }) {
  return (
    <section id="top" className="relative isolate overflow-hidden px-5 pb-14 pt-40 sm:px-8 sm:pb-16 sm:pt-48">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--as-soft)] to-[var(--as-bg)]" aria-hidden />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="as-mono inline-flex items-center gap-2 rounded-full bg-[var(--as-teal-soft)] px-3.5 py-1.5 text-[var(--as-teal)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--as-teal)]" aria-hidden />
            {masthead.eyebrow}
          </p>
        </Reveal>
        <LiftLines as="h1" className="as-display mt-6 max-w-4xl text-[clamp(2.4rem,5.5vw,4rem)]" delay={0.04}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.75] text-[var(--as-ink-soft)]">{masthead.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Accreditation marquee. */
export function AsterMarquee() {
  const words = ASTER_CONTENT.marquee;
  return (
    <section className="border-y border-[var(--as-line)] bg-[var(--as-panel)] py-8">
      <p className="as-mono mb-5 text-center text-[var(--as-ink-faint)]">Most major insurance accepted</p>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="as-marquee as-display flex w-max items-center gap-14 pr-14 text-[clamp(1.1rem,2.2vw,1.5rem)] text-[var(--as-ink-faint)]">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="whitespace-nowrap">{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** About the hospital. */
export function AsterAbout() {
  const { about } = ASTER_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-14 lg:grid-cols-2">
        <Reveal>
          {about.body.map((p) => (
            <p key={p} className="mb-5 max-w-[54ch] text-[16.5px] leading-[1.85] text-[var(--as-ink-soft)]">{p}</p>
          ))}
        </Reveal>
        <RevealGroup className="grid gap-3 sm:grid-cols-2" delay={0.06}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-2.5 rounded-2xl bg-[var(--as-panel)] p-4 text-[14.5px]">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--as-teal)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Departments grid. */
export function AsterDepartments() {
  const { services } = ASTER_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="departments">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={0.06}>
        {ASTER_DEPARTMENTS.map((dept) => {
          const Icon = dept.icon;
          return (
            <a key={dept.title} href="?page=departments" className="as-card group flex flex-col rounded-[var(--as-radius)] border border-[var(--as-line)] bg-[var(--as-bg)] p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--as-blue-soft)]">
                <Icon className="h-6 w-6 text-[var(--as-blue)]" aria-hidden />
              </span>
              <h3 className="as-display mt-5 text-[1.3rem]">{dept.title}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-[1.7] text-[var(--as-ink-soft)]">{dept.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--as-blue)]">
                Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </a>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Why Aster. */
export function AsterWhy() {
  const { why } = ASTER_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} id="why">
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {why.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[var(--as-radius)] bg-[var(--as-panel)] p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--as-teal-soft)]">
                <Icon className="h-5 w-5 text-[var(--as-teal)]" aria-hidden />
              </span>
              <h3 className="as-display mt-5 text-[1.2rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--as-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Featured doctors. */
export function AsterDoctors() {
  return (
    <Band eyebrow="Our doctors" title="Meet a few of the team." id="doctors">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
        {ASTER_DOCTORS.map((doctor) => (
          <a key={doctor.name} href="?page=doctors" className="as-card as-frame group block overflow-hidden rounded-[var(--as-radius)] border border-[var(--as-line)] bg-[var(--as-bg)]">
            <div className="overflow-hidden">
              <div className={`as-zoom ${doctor.plate} aspect-[4/5]`} aria-hidden />
            </div>
            <div className="p-5">
              <h3 className="as-display text-[1.2rem]">{doctor.name}</h3>
              <p className="as-mono mt-1 text-[var(--as-blue)]">{doctor.specialty}</p>
            </div>
          </a>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** How it works, three steps. */
export function AsterSteps() {
  return (
    <Band eyebrow="How it works" title="Care in three simple steps." center>
      <RevealGroup className="mt-12 grid gap-5 text-left md:grid-cols-3" step={0.1}>
        {ASTER_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-[var(--as-radius)] border border-[var(--as-line)] bg-[var(--as-bg)] p-7">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--as-blue-soft)]">
                  <Icon className="h-6 w-6 text-[var(--as-blue)]" aria-hidden />
                </span>
                <span className="as-display text-[1.4rem] text-[var(--as-line)]">{`0${i + 1}`}</span>
              </div>
              <h3 className="as-display mt-6 text-[1.35rem]">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[var(--as-ink-soft)]">{step.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Discreet numbers. */
export function AsterStats() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4" step={0.08}>
        {ASTER_STATS.map((stat) => (
          <div key={stat.label} className="rounded-[var(--as-radius)] bg-[var(--as-panel)] p-6 text-center">
            <p className="as-display text-[clamp(2rem,4vw,2.8rem)] tabular-nums text-[var(--as-blue)]">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="as-mono mt-2 text-[var(--as-ink-faint)]">{stat.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}

/** Patient voices. */
export function AsterTestimonials() {
  return (
    <Band eyebrow="Patient voices" title="In their words." id="testimonials">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {ASTER_TESTIMONIALS.map((t) => (
          <figure key={t.author} className="flex flex-col rounded-[var(--as-radius)] border border-[var(--as-line)] bg-[var(--as-bg)] p-7">
            <div className="flex gap-0.5 text-[var(--as-teal)]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden />)}
            </div>
            <blockquote className="mt-4 flex-1 text-[15.5px] leading-[1.7] text-[var(--as-ink-soft)]">{t.quote}</blockquote>
            <figcaption className="mt-6 border-t border-[var(--as-line)] pt-4">
              <p className="text-[15px] font-semibold">{t.author}</p>
              <p className="as-mono mt-1 text-[var(--as-ink-faint)]">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** Health blog teaser. */
export function AsterBlog() {
  return (
    <Band eyebrow="Health blog" title="Advice you can trust." id="blog">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.07}>
        {ASTER_POSTS.map((post) => (
          <a key={post.title} href="?page=blog" className="as-card as-frame group flex flex-col overflow-hidden rounded-[var(--as-radius)] border border-[var(--as-line)] bg-[var(--as-bg)]">
            <div className="overflow-hidden">
              <div className={`as-zoom ${post.plate} aspect-[16/9]`} aria-hidden />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center gap-3">
                <span className="as-mono rounded-full bg-[var(--as-blue-soft)] px-2.5 py-1 text-[var(--as-blue)]">{post.tag}</span>
                <span className="as-mono text-[var(--as-ink-faint)]">{post.date}</span>
              </div>
              <h3 className="as-display mt-4 text-[1.25rem]">{post.title}</h3>
              <p className="mt-2 flex-1 text-[14.5px] leading-[1.7] text-[var(--as-ink-soft)]">{post.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[var(--as-blue)]">
                Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </span>
            </div>
          </a>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** FAQ. */
export function AsterFaq() {
  const { faq } = ASTER_CONTENT;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Band eyebrow={faq.eyebrow} title={faq.title} center>
      <div className="mx-auto mt-10 max-w-3xl text-left">
        <RevealGroup className="space-y-3" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="rounded-[var(--as-radius)] border border-[var(--as-line)] bg-[var(--as-bg)] px-5">
                <h3>
                  <button type="button" onClick={() => setOpen(expanded ? null : i)} aria-expanded={expanded} aria-controls={`as-faq-${i}`} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium">
                    {item.question}
                    {expanded ? <Minus className="h-4 w-4 shrink-0 text-[var(--as-blue)]" aria-hidden /> : <Plus className="h-4 w-4 shrink-0 text-[var(--as-ink-faint)]" aria-hidden />}
                  </button>
                </h3>
                {expanded && <div id={`as-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.8] text-[var(--as-ink-soft)]">{item.answer}</div>}
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Contact. */
export function AsterContact() {
  const { contact } = ASTER_CONTENT;
  const [sent, setSent] = useState(false);
  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`as-${field}`} className="as-mono block text-[var(--as-ink-faint)]">{contact.fields[field]}</label>
                {field === 'message' ? (
                  <textarea id={`as-${field}`} name={field} rows={4} required className="mt-3 w-full resize-y rounded-[14px] border border-[var(--as-line)] bg-[var(--as-panel)] px-4 py-3 text-[16px] text-[var(--as-ink)] outline-none focus:border-[var(--as-blue)]" />
                ) : (
                  <input id={`as-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} required className="mt-3 w-full rounded-[14px] border border-[var(--as-line)] bg-[var(--as-panel)] px-4 py-3 text-[16px] text-[var(--as-ink)] outline-none focus:border-[var(--as-blue)]" />
                )}
              </div>
            ))}
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[var(--as-blue)] px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[var(--as-blue-deep)]">
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--as-teal)]">{sent ? 'This is a template. Wire the form to your own inbox.' : ''}</p>
          </form>
        </Reveal>
        <RevealGroup className="grid gap-3" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="rounded-2xl bg-[var(--as-panel)] p-5">
              <p className="as-mono text-[var(--as-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Closing invitation. */
export function AsterCta() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[28px] bg-[var(--as-blue)] px-6 py-16 text-center text-white sm:px-12">
          <LiftLines className="as-display mx-auto max-w-2xl text-[clamp(1.9rem,4vw,3rem)]">
            <Line>Feeling better starts with a call.</Line>
          </LiftLines>
          <p className="mx-auto mt-5 max-w-[50ch] text-[16px] text-[color-mix(in_srgb,white_84%,transparent)]">Book online in under a minute, or speak to reception any hour of the day.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="?page=appointments" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-medium text-[var(--as-blue)] transition-opacity hover:opacity-90">
              Book appointment <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="?page=contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-white/10">
              <Phone className="h-4 w-4" aria-hidden /> Contact us
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** Footer. */
export function AsterFooter() {
  const { footer } = ASTER_CONTENT;
  return (
    <footer className="border-t border-[var(--as-line)] bg-[var(--as-panel)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.7] text-[var(--as-ink-faint)]">{footer.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="as-mono text-[var(--as-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--as-ink-soft)] hover:text-[var(--as-ink)]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--as-line)] pt-7 text-[12.5px] text-[var(--as-ink-faint)]">{footer.legal}</p>
    </footer>
  );
}
