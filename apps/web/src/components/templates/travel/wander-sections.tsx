'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Clock, Compass, MapPin, Menu, Minus, Plus, Search, Star, X } from 'lucide-react';
import {
  WANDER_CONTENT,
  WANDER_DESTINATIONS,
  WANDER_GALLERY,
  WANDER_LABELS,
  WANDER_MAP_PINS,
  WANDER_NAV,
  WANDER_REVIEWS,
  WANDER_STATS,
  WANDER_STEPS,
  WANDER_TOURS,
  type WanderMasthead as WanderMastheadData,
  type WanderPageId,
} from '@/data/templates/travel-content';
import { Counter, ImageReveal, Line, LiftLines, Reveal, RevealGroup } from './wander-motion';

/**
 * WANDER - the section library. A single source composed into pages by
 * `wander-pages.tsx`; no section holds copy of its own. Navigation is by
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
    <section id={id} className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <div className={`mx-auto max-w-6xl ${center ? 'text-center' : ''}`}>
        <Reveal>
          <p className={`wa-mono inline-flex items-center gap-2 rounded-full bg-[var(--wa-orange-soft)] px-3 py-1 text-[var(--wa-orange)] ${center ? 'mx-auto' : ''}`}>
            <Compass className="h-3.5 w-3.5" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className={`wa-display mt-5 text-[clamp(2rem,4.6vw,3.4rem)] ${center ? 'mx-auto max-w-3xl' : 'max-w-4xl'}`} delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className={`mt-5 text-[16.5px] leading-[1.75] text-[var(--wa-ink-soft)] ${center ? 'mx-auto max-w-[62ch]' : 'max-w-[62ch]'}`}>{subtitle}</p>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

function BrandMark({ light }: { light?: boolean }) {
  return (
    <a href="?page=home" className="flex items-center gap-2.5">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--wa-orange)] to-[var(--wa-cyan)]" aria-hidden>
        <Compass className="h-5 w-5 text-white" />
      </span>
      <span className={`wa-display text-[1.3rem] ${light ? 'text-white' : ''}`}>{WANDER_CONTENT.brand}</span>
    </a>
  );
}

/** Header, transparent over the hero, solid on scroll. */
export function WanderHeader({ page }: { page: WanderPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const light = !scrolled;

  return (
    <header className={['fixed inset-x-0 top-0 z-50 transition-colors duration-500', scrolled ? 'border-b border-[var(--wa-line)] bg-[color-mix(in_srgb,var(--wa-bg)_88%,transparent)] backdrop-blur-md' : 'bg-transparent'].join(' ')}>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <BrandMark light={light} />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {WANDER_NAV.map((item) => {
            const active = item.id === page;
            return (
              <a
                key={item.id}
                href={`?page=${item.id}`}
                aria-current={active ? 'page' : undefined}
                className={['rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors', light ? 'text-white/80 hover:text-white' : active ? 'bg-[var(--wa-orange-soft)] text-[var(--wa-orange)]' : 'text-[var(--wa-ink-soft)] hover:text-[var(--wa-ink)]'].join(' ')}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <a href="?page=contact" className="wa-btn-primary hidden items-center gap-2 rounded-full px-5 py-2.5 text-[13.5px] font-semibold lg:inline-flex">
          {WANDER_LABELS.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="wa-mobile" aria-label={open ? WANDER_LABELS.close : WANDER_LABELS.menu} className={light ? 'text-white lg:hidden' : 'lg:hidden'}>
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      {open && (
        <nav id="wa-mobile" aria-label="Primary" className="border-t border-[var(--wa-line)] bg-[var(--wa-bg)] px-5 py-2 lg:hidden">
          {WANDER_NAV.map((item) => (
            <a key={item.id} href={`?page=${item.id}`} onClick={() => setOpen(false)} className="block py-3 text-[15px] text-[var(--wa-ink-soft)]">
              {item.label}
            </a>
          ))}
          <a href="?page=contact" onClick={() => setOpen(false)} className="wa-btn-primary my-2 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] font-semibold">
            {WANDER_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}

/** Full-bleed immersive hero with a search bar. */
export function WanderHero() {
  const { hero } = WANDER_CONTENT;
  return (
    <section id="top" className="relative isolate flex min-h-[92vh] items-center overflow-hidden px-5 pb-20 pt-32 sm:px-8">
      <div className="wa-plate-a absolute inset-0 -z-20" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgb(32_26_20/72%)] via-[rgb(32_26_20/28%)] to-[rgb(32_26_20/40%)]" aria-hidden />
      <div className="mx-auto w-full max-w-6xl text-white">
        <Reveal>
          <p className="wa-mono inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
            {hero.badge}
          </p>
        </Reveal>
        <LiftLines as="h1" className="wa-display mt-6 max-w-4xl text-[clamp(3rem,8vw,6rem)]" delay={0.06}>
          <Line>{hero.title}</Line>
          <Line>
            <span className="wa-accent">{hero.titleAccent}</span>
          </Line>
        </LiftLines>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-[54ch] text-[17.5px] leading-[1.7] text-white/85">{hero.subtitle}</p>
        </Reveal>

        <Reveal delay={0.28}>
          <form onSubmit={(e) => e.preventDefault()} className="mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl bg-white/95 p-2 text-[var(--wa-ink)] shadow-2xl backdrop-blur sm:flex-row sm:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
              <MapPin className="h-4 w-4 text-[var(--wa-orange)]" aria-hidden />
              <input type="text" placeholder="Where to?" className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--wa-ink-faint)]" />
            </label>
            <span className="hidden h-8 w-px bg-[var(--wa-line)] sm:block" aria-hidden />
            <label className="flex flex-1 items-center gap-2 rounded-xl px-3 py-2.5">
              <Clock className="h-4 w-4 text-[var(--wa-cyan)]" aria-hidden />
              <input type="text" placeholder="When?" className="w-full bg-transparent text-[15px] outline-none placeholder:text-[var(--wa-ink-faint)]" />
            </label>
            <button type="submit" className="wa-btn-primary inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[14px] font-semibold">
              <Search className="h-4 w-4" aria-hidden /> Search
            </button>
          </form>
        </Reveal>

        <RevealGroup className="mt-10 flex flex-wrap gap-x-10 gap-y-4" delay={0.12}>
          {hero.stats.map((stat) => (
            <div key={stat.label}>
              <p className="wa-display text-[clamp(1.6rem,3vw,2.2rem)] tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="wa-mono mt-1 text-[10px] text-white/70">{stat.label}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

/** Inner-page masthead, full-bleed. */
export function WanderMasthead({ masthead }: { masthead: WanderMastheadData }) {
  return (
    <section id="top" className="relative isolate flex min-h-[52vh] items-end overflow-hidden px-5 pb-14 pt-40 sm:px-8">
      <div className="wa-plate-c absolute inset-0 -z-20" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgb(32_26_20/74%)] to-[rgb(32_26_20/30%)]" aria-hidden />
      <div className="mx-auto w-full max-w-6xl text-white">
        <Reveal>
          <p className="wa-mono inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 backdrop-blur">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            {masthead.eyebrow}
          </p>
        </Reveal>
        <LiftLines as="h1" className="wa-display mt-6 max-w-4xl text-[clamp(2.4rem,6vw,4.4rem)]" delay={0.04}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.14}>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.7] text-white/85">{masthead.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Partner marquee. */
export function WanderMarquee() {
  const words = WANDER_CONTENT.marquee;
  return (
    <section className="border-b border-[var(--wa-line)] bg-[var(--wa-panel)] py-8">
      <p className="wa-mono mb-5 text-center text-[var(--wa-ink-faint)]">Loved by travellers and the press</p>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="wa-marquee wa-display flex w-max items-center gap-14 pr-14 text-[clamp(1.1rem,2.2vw,1.5rem)] text-[var(--wa-ink-faint)]">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="whitespace-nowrap">{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** About the company. */
export function WanderAbout() {
  const { about } = WANDER_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-14 lg:grid-cols-2">
        <Reveal>
          {about.body.map((p) => (
            <p key={p} className="mb-5 max-w-[54ch] text-[16.5px] leading-[1.85] text-[var(--wa-ink-soft)]">{p}</p>
          ))}
        </Reveal>
        <RevealGroup className="grid gap-3 sm:grid-cols-2" delay={0.06}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-2.5 rounded-2xl bg-[var(--wa-panel)] p-4 text-[14.5px]">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--wa-cyan)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Interactive destinations grid. */
export function WanderDestinations() {
  return (
    <Band eyebrow="Destinations" title="Places worth the flight." id="destinations">
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {WANDER_DESTINATIONS.map((dest, i) => (
          <ImageReveal key={dest.name} delay={(i % 3) * 0.05}>
            <a href="?page=tours" className="wa-frame group block overflow-hidden rounded-[var(--wa-radius)]">
              <div className="relative aspect-[4/5] overflow-hidden">
                <div className={`wa-zoom absolute inset-0 ${dest.plate}`} aria-hidden />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgb(32_26_20/70%)] to-transparent" aria-hidden />
                <span className="wa-mono absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[var(--wa-orange)]">{dest.tag}</span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white">
                  <div>
                    <h3 className="wa-display text-[1.6rem]">{dest.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/80"><MapPin className="h-3.5 w-3.5" aria-hidden />{dest.country}</p>
                  </div>
                  <span className="text-[13px] font-semibold">{dest.price}</span>
                </div>
              </div>
            </a>
          </ImageReveal>
        ))}
      </div>
    </Band>
  );
}

/** Ways to travel. */
export function WanderExperiences() {
  const { services } = WANDER_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="experiences">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {services.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[var(--wa-radius)] border border-[var(--wa-line)] bg-[var(--wa-panel)] p-6">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--wa-cyan-soft)]">
                <Icon className="h-6 w-6 text-[var(--wa-cyan)]" aria-hidden />
              </span>
              <h3 className="wa-display mt-5 text-[1.25rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--wa-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Featured tours. */
export function WanderTours() {
  return (
    <Band eyebrow="Tours" title="Small groups, big country." id="tours">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {WANDER_TOURS.map((tour) => (
          <a key={tour.name} href="?page=packages" className="wa-frame group flex flex-col overflow-hidden rounded-[var(--wa-radius)] border border-[var(--wa-line)] bg-[var(--wa-bg)]">
            <div className="relative overflow-hidden">
              <div className={`wa-zoom ${tour.plate} aspect-[16/10]`} aria-hidden />
              <span className="wa-mono absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[var(--wa-orange)]">
                <Star className="h-3 w-3 fill-current" aria-hidden />{tour.rating}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="wa-display text-[1.35rem]">{tour.name}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[var(--wa-ink-faint)]"><Clock className="h-3.5 w-3.5" aria-hidden />{tour.duration}</p>
              <div className="mt-5 flex items-center justify-between border-t border-[var(--wa-line)] pt-4">
                <span className="text-[13px] text-[var(--wa-ink-faint)]">from <span className="wa-display text-[1.2rem] text-[var(--wa-ink)]">{tour.price}</span></span>
                <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-[var(--wa-orange)]">View <ArrowUpRight className="h-4 w-4" aria-hidden /></span>
              </div>
            </div>
          </a>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** Stylised map with pulsing pins. */
export function WanderMap() {
  return (
    <Band eyebrow="Where we go" title="Ninety countries and counting." center>
      <Reveal delay={0.1}>
        <div className="wa-map-grid relative mx-auto mt-12 aspect-[2/1] w-full max-w-4xl overflow-hidden rounded-[var(--wa-radius)] border border-[var(--wa-line)] bg-[var(--wa-panel)]" aria-hidden>
          {WANDER_MAP_PINS.map((pin) => (
            <span key={pin.label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${pin.x}%`, top: `${pin.y}%` }}>
              <span className="relative inline-flex h-3 w-3">
                <span className="wa-pin absolute inset-0 rounded-full" />
                <span className="relative h-3 w-3 rounded-full bg-[var(--wa-orange)] ring-2 ring-white" />
              </span>
              <span className="wa-mono absolute left-4 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-[10px] text-[var(--wa-ink-soft)] sm:inline">{pin.label}</span>
            </span>
          ))}
        </div>
      </Reveal>
    </Band>
  );
}

/** Why book with us. */
export function WanderWhy() {
  const { why } = WANDER_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} id="why">
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {why.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--wa-orange-soft)]">
                <Icon className="h-5 w-5 text-[var(--wa-orange)]" aria-hidden />
              </span>
              <h3 className="wa-display mt-5 text-[1.2rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--wa-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** How it works. */
export function WanderSteps() {
  return (
    <Band eyebrow="How it works" title="Three steps to gone." center>
      <RevealGroup className="mt-12 grid gap-5 text-left md:grid-cols-3" step={0.1}>
        {WANDER_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-[var(--wa-radius)] border border-[var(--wa-line)] bg-[var(--wa-panel)] p-7">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--wa-cyan-soft)]">
                  <Icon className="h-6 w-6 text-[var(--wa-cyan)]" aria-hidden />
                </span>
                <span className="wa-display text-[1.4rem] text-[var(--wa-line)]">{`0${i + 1}`}</span>
              </div>
              <h3 className="wa-display mt-6 text-[1.35rem]">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[var(--wa-ink-soft)]">{step.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** Gallery masonry. */
export function WanderGallery() {
  return (
    <Band eyebrow="Gallery" title="Frames from the road." id="gallery">
      <div className="mt-12 grid auto-rows-[13rem] grid-cols-2 gap-4 lg:grid-cols-4">
        {WANDER_GALLERY.map((item, i) => {
          const span = item.span === 'tall' ? 'row-span-2' : item.span === 'wide' ? 'col-span-2' : '';
          return (
            <ImageReveal key={i} delay={i * 0.04} className={span}>
              <div className="wa-frame group h-full overflow-hidden rounded-[var(--wa-radius)]">
                <div className={`wa-zoom h-full ${item.plate}`} aria-hidden />
              </div>
            </ImageReveal>
          );
        })}
      </div>
    </Band>
  );
}

/** Numbers. */
export function WanderStats() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4" step={0.08}>
        {WANDER_STATS.map((stat) => (
          <div key={stat.label} className="rounded-[var(--wa-radius)] bg-[var(--wa-panel)] p-6 text-center">
            <p className="wa-display text-[clamp(2rem,4vw,2.8rem)] tabular-nums text-[var(--wa-orange)]">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="wa-mono mt-2 text-[var(--wa-ink-faint)]">{stat.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}

/** Traveller reviews. */
export function WanderReviews() {
  return (
    <Band eyebrow="Reviews" title="In their own words." id="reviews">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {WANDER_REVIEWS.map((r) => (
          <figure key={r.author} className="flex flex-col rounded-[var(--wa-radius)] border border-[var(--wa-line)] bg-[var(--wa-bg)] p-7">
            <div className="flex gap-0.5 text-[var(--wa-orange)]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden />)}
            </div>
            <blockquote className="mt-4 flex-1 text-[15.5px] leading-[1.7] text-[var(--wa-ink-soft)]">{r.quote}</blockquote>
            <figcaption className="mt-6 border-t border-[var(--wa-line)] pt-4">
              <p className="text-[15px] font-semibold">{r.author}</p>
              <p className="wa-mono mt-1 text-[var(--wa-ink-faint)]">{r.role}</p>
            </figcaption>
          </figure>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** FAQ. */
export function WanderFaq() {
  const { faq } = WANDER_CONTENT;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Band eyebrow={faq.eyebrow} title={faq.title} center>
      <div className="mx-auto mt-10 max-w-3xl text-left">
        <RevealGroup className="space-y-3" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="rounded-[var(--wa-radius)] border border-[var(--wa-line)] bg-[var(--wa-bg)] px-5">
                <h3>
                  <button type="button" onClick={() => setOpen(expanded ? null : i)} aria-expanded={expanded} aria-controls={`wa-faq-${i}`} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium">
                    {item.question}
                    {expanded ? <Minus className="h-4 w-4 shrink-0 text-[var(--wa-orange)]" aria-hidden /> : <Plus className="h-4 w-4 shrink-0 text-[var(--wa-ink-faint)]" aria-hidden />}
                  </button>
                </h3>
                {expanded && <div id={`wa-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.8] text-[var(--wa-ink-soft)]">{item.answer}</div>}
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Contact. */
export function WanderContact() {
  const { contact } = WANDER_CONTENT;
  const [sent, setSent] = useState(false);
  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`wa-${field}`} className="wa-mono block text-[var(--wa-ink-faint)]">{contact.fields[field]}</label>
                {field === 'message' ? (
                  <textarea id={`wa-${field}`} name={field} rows={4} required className="mt-3 w-full resize-y rounded-[14px] border border-[var(--wa-line)] bg-[var(--wa-panel)] px-4 py-3 text-[16px] text-[var(--wa-ink)] outline-none focus:border-[var(--wa-orange)]" />
                ) : (
                  <input id={`wa-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} required className="mt-3 w-full rounded-[14px] border border-[var(--wa-line)] bg-[var(--wa-panel)] px-4 py-3 text-[16px] text-[var(--wa-ink)] outline-none focus:border-[var(--wa-orange)]" />
                )}
              </div>
            ))}
            <button type="submit" className="wa-btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[14.5px] font-semibold">
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--wa-orange)]">{sent ? 'This is a template. Wire the form to your own inbox.' : ''}</p>
          </form>
        </Reveal>
        <RevealGroup className="grid gap-3" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="rounded-2xl bg-[var(--wa-panel)] p-5">
              <p className="wa-mono text-[var(--wa-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Closing invitation, full-bleed. */
export function WanderCta() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative isolate overflow-hidden rounded-[28px] px-6 py-20 text-center text-white sm:px-12">
          <div className="wa-plate-b absolute inset-0 -z-20" aria-hidden />
          <div className="absolute inset-0 -z-10 bg-[rgb(32_26_20/34%)]" aria-hidden />
          <LiftLines className="wa-display mx-auto max-w-2xl text-[clamp(2rem,4.5vw,3.4rem)]">
            <Line>Your next story is out there.</Line>
          </LiftLines>
          <p className="mx-auto mt-5 max-w-[48ch] text-[16px] text-white/85">Tell us the feeling you are chasing. We will find the place, and handle the rest.</p>
          <a href="?page=contact" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-semibold text-[var(--wa-ink)] transition-opacity hover:opacity-90">
            Plan a trip <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/** Footer. */
export function WanderFooter() {
  const { footer } = WANDER_CONTENT;
  return (
    <footer className="border-t border-[var(--wa-line)] bg-[var(--wa-panel)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.7] text-[var(--wa-ink-faint)]">{footer.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="wa-mono text-[var(--wa-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--wa-ink-soft)] hover:text-[var(--wa-ink)]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--wa-line)] pt-7 text-[12.5px] text-[var(--wa-ink-faint)]">{footer.legal}</p>
    </footer>
  );
}
