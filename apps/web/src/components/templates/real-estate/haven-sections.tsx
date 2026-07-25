'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, ArrowUpRight, Bath, BedDouble, Heart, Home, MapPin, Maximize, Menu, Minus, Plus, Star, X } from 'lucide-react';
import {
  HAVEN_AGENTS,
  HAVEN_CONTENT,
  HAVEN_LABELS,
  HAVEN_MORTGAGE,
  HAVEN_NAV,
  HAVEN_PROPERTIES,
  HAVEN_STATS,
  HAVEN_STEPS,
  HAVEN_TESTIMONIALS,
  type HavenMasthead as HavenMastheadData,
  type HavenPageId,
} from '@/data/templates/real-estate-content';
import { Counter, ImageReveal, Line, LiftLines, Reveal, RevealGroup } from './haven-motion';

/**
 * HAVEN - the section library. A single source composed into pages by
 * `haven-pages.tsx`; no section holds copy of its own. Navigation is by
 * `?page=`, so links work in any host.
 */

const money = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`;

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
          <p className={`hv-mono inline-flex items-center gap-2 rounded-full bg-[var(--hv-green-soft)] px-3 py-1 text-[var(--hv-green)] ${center ? 'mx-auto' : ''}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--hv-green)]" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <LiftLines className={`hv-display mt-5 text-[clamp(1.9rem,4.4vw,3.2rem)] ${center ? 'mx-auto max-w-3xl' : 'max-w-4xl'}`} delay={0.04}>
          <Line>{title}</Line>
        </LiftLines>
        {subtitle && (
          <Reveal delay={0.12}>
            <p className={`mt-5 text-[16.5px] leading-[1.75] text-[var(--hv-ink-soft)] ${center ? 'mx-auto max-w-[62ch]' : 'max-w-[62ch]'}`}>{subtitle}</p>
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
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--hv-green)]" aria-hidden>
        <Home className="h-5 w-5 text-white" />
      </span>
      <span className="hv-display text-[1.3rem]">{HAVEN_CONTENT.brand}</span>
    </a>
  );
}

/** Header. */
export function HavenHeader({ page }: { page: HavenPageId }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={['fixed inset-x-0 top-0 z-50 transition-colors duration-300', scrolled ? 'border-b border-[var(--hv-line)] bg-[color-mix(in_srgb,var(--hv-bg)_88%,transparent)] backdrop-blur-md' : 'bg-[var(--hv-bg)]'].join(' ')}>
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <BrandMark />
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {HAVEN_NAV.map((item) => {
            const active = item.id === page;
            return (
              <a key={item.id} href={`?page=${item.id}`} aria-current={active ? 'page' : undefined} className={['rounded-full px-3.5 py-1.5 text-[13.5px] transition-colors', active ? 'bg-[var(--hv-green-soft)] text-[var(--hv-green)]' : 'text-[var(--hv-ink-soft)] hover:text-[var(--hv-ink)]'].join(' ')}>
                {item.label}
              </a>
            );
          })}
        </nav>
        <a href="?page=contact" className="hidden items-center gap-2 rounded-full bg-[var(--hv-green)] px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors hover:bg-[var(--hv-green-deep)] lg:inline-flex">
          {HAVEN_LABELS.cta}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </a>
        <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="hv-mobile" aria-label={open ? HAVEN_LABELS.close : HAVEN_LABELS.menu} className="lg:hidden">
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      {open && (
        <nav id="hv-mobile" aria-label="Primary" className="border-t border-[var(--hv-line)] bg-[var(--hv-bg)] px-5 py-2 lg:hidden">
          {HAVEN_NAV.map((item) => (
            <a key={item.id} href={`?page=${item.id}`} onClick={() => setOpen(false)} className="block py-3 text-[15px] text-[var(--hv-ink-soft)]">
              {item.label}
            </a>
          ))}
          <a href="?page=contact" onClick={() => setOpen(false)} className="my-2 inline-flex items-center gap-2 rounded-full bg-[var(--hv-green)] px-5 py-2.5 text-[14px] font-medium text-white">
            {HAVEN_LABELS.cta}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </nav>
      )}
    </header>
  );
}

/** Small property spec row. */
function Specs({ beds, baths, area, className }: { beds: number; baths: number; area: string; className?: string }) {
  return (
    <div className={`flex items-center gap-4 text-[13px] text-[var(--hv-ink-soft)] ${className ?? ''}`}>
      <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4 text-[var(--hv-green)]" aria-hidden />{beds}</span>
      <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4 text-[var(--hv-green)]" aria-hidden />{baths}</span>
      <span className="inline-flex items-center gap-1.5"><Maximize className="h-4 w-4 text-[var(--hv-green)]" aria-hidden />{area}</span>
    </div>
  );
}

/** The floating featured-property card. */
function FeaturedCard() {
  const p = HAVEN_PROPERTIES[0]!;
  return (
    <div className="hv-card3d relative mx-auto w-full max-w-sm overflow-hidden rounded-[22px] border border-[var(--hv-line)] bg-[var(--hv-bg)]" aria-hidden>
      <div className={`${p.plate} relative aspect-[4/3]`}>
        <span className="hv-mono absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[var(--hv-green)]">{p.tag}</span>
        <span className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--hv-green)]"><Heart className="h-4 w-4" /></span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="hv-display text-[1.3rem]">{p.name}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[var(--hv-ink-faint)]"><MapPin className="h-3.5 w-3.5" aria-hidden />{p.location}</p>
          </div>
          <span className="hv-display text-[1.15rem] text-[var(--hv-green)]">{p.price}</span>
        </div>
        <Specs beds={p.beds} baths={p.baths} area={p.area} className="mt-4 border-t border-[var(--hv-line)] pt-4" />
      </div>
    </div>
  );
}

/** Hero. */
export function HavenHero() {
  const { hero } = HAVEN_CONTENT;
  return (
    <section id="top" className="relative isolate overflow-hidden px-5 pb-20 pt-36 sm:px-8 sm:pb-28 sm:pt-44">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--hv-soft)] to-[var(--hv-bg)]" aria-hidden />
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <p className="hv-mono inline-flex items-center gap-2 rounded-full bg-[var(--hv-sand-soft)] px-3.5 py-1.5 text-[var(--hv-sand)]">
              <Star className="h-3.5 w-3.5 fill-current" aria-hidden />
              {hero.badge}
            </p>
          </Reveal>
          <LiftLines as="h1" className="hv-display mt-7 text-[clamp(2.6rem,6.5vw,4.6rem)]" delay={0.06}>
            <Line>{hero.title}</Line>
            <Line>
              <span className="hv-accent">{hero.titleAccent}</span>
            </Line>
          </LiftLines>
          <Reveal delay={0.2}>
            <p className="mt-7 max-w-[52ch] text-[17px] leading-[1.75] text-[var(--hv-ink-soft)]">{hero.subtitle}</p>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="?page=properties" className="inline-flex items-center gap-2 rounded-full bg-[var(--hv-green)] px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[var(--hv-green-deep)]">
                {hero.ctaPrimary}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <a href="?page=contact" className="inline-flex items-center gap-2 rounded-full border border-[var(--hv-line)] px-6 py-3.5 text-[14.5px] font-medium transition-colors hover:bg-[var(--hv-panel)]">
                {hero.ctaSecondary}
                <ArrowUpRight className="h-4 w-4 text-[var(--hv-green)]" aria-hidden />
              </a>
            </div>
          </Reveal>
          <RevealGroup className="mt-12 grid max-w-md grid-cols-3 gap-6" delay={0.1}>
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <p className="hv-display text-[clamp(1.6rem,3vw,2.1rem)] tabular-nums text-[var(--hv-green)]">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="hv-mono mt-1 text-[10px] text-[var(--hv-ink-faint)]">{stat.label}</p>
              </div>
            ))}
          </RevealGroup>
        </div>
        <Reveal delay={0.18}>
          <FeaturedCard />
        </Reveal>
      </div>
    </section>
  );
}

/** Inner-page masthead. */
export function HavenMasthead({ masthead }: { masthead: HavenMastheadData }) {
  return (
    <section id="top" className="relative isolate overflow-hidden px-5 pb-14 pt-40 sm:px-8 sm:pb-16 sm:pt-48">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[var(--hv-soft)] to-[var(--hv-bg)]" aria-hidden />
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="hv-mono inline-flex items-center gap-2 rounded-full bg-[var(--hv-sand-soft)] px-3.5 py-1.5 text-[var(--hv-sand)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--hv-sand)]" aria-hidden />
            {masthead.eyebrow}
          </p>
        </Reveal>
        <LiftLines as="h1" className="hv-display mt-6 max-w-4xl text-[clamp(2.4rem,5.5vw,4rem)]" delay={0.04}>
          <Line>{masthead.title}</Line>
        </LiftLines>
        <Reveal delay={0.14}>
          <p className="mt-6 max-w-[62ch] text-[17px] leading-[1.75] text-[var(--hv-ink-soft)]">{masthead.subtitle}</p>
        </Reveal>
      </div>
    </section>
  );
}

/** Press marquee. */
export function HavenMarquee() {
  const words = HAVEN_CONTENT.marquee;
  return (
    <section className="border-y border-[var(--hv-line)] bg-[var(--hv-panel)] py-8">
      <p className="hv-mono mb-5 text-center text-[var(--hv-ink-faint)]">Featured in</p>
      <div aria-hidden className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="hv-marquee hv-display flex w-max items-center gap-14 pr-14 text-[clamp(1.1rem,2.2vw,1.5rem)] text-[var(--hv-ink-faint)]">
          {[...words, ...words].map((word, i) => (
            <span key={`${word}-${i}`} className="whitespace-nowrap">{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/** About. */
export function HavenAbout() {
  const { about } = HAVEN_CONTENT;
  return (
    <Band eyebrow={about.eyebrow} title={about.title} id="about">
      <div className="mt-12 grid gap-14 lg:grid-cols-2">
        <Reveal>
          {about.body.map((p) => (
            <p key={p} className="mb-5 max-w-[54ch] text-[16.5px] leading-[1.85] text-[var(--hv-ink-soft)]">{p}</p>
          ))}
        </Reveal>
        <RevealGroup className="grid gap-3 sm:grid-cols-2" delay={0.06}>
          {about.points.map((point) => (
            <p key={point} className="flex items-start gap-2.5 rounded-2xl bg-[var(--hv-panel)] p-4 text-[14.5px]">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hv-sand)]" aria-hidden />
              {point}
            </p>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Curated properties, 3D cards. */
export function HavenProperties() {
  return (
    <Band eyebrow="Featured" title="A curated collection." id="properties">
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {HAVEN_PROPERTIES.map((p, i) => (
          <ImageReveal key={p.name} delay={(i % 3) * 0.05}>
            <a href="?page=details" className="hv-card3d hv-frame group block overflow-hidden rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)]">
              <div className="relative overflow-hidden">
                <div className={`hv-zoom ${p.plate} aspect-[4/3]`} aria-hidden />
                <span className="hv-mono absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[var(--hv-green)]">{p.tag}</span>
                <span className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--hv-green)]"><Heart className="h-4 w-4" aria-hidden /></span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="hv-display text-[1.3rem]">{p.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-[var(--hv-ink-faint)]"><MapPin className="h-3.5 w-3.5" aria-hidden />{p.location}</p>
                  </div>
                  <span className="hv-display text-[1.1rem] text-[var(--hv-green)]">{p.price}</span>
                </div>
                <Specs beds={p.beds} baths={p.baths} area={p.area} className="mt-4 border-t border-[var(--hv-line)] pt-4" />
              </div>
            </a>
          </ImageReveal>
        ))}
      </div>
    </Band>
  );
}

/** What we do. */
export function HavenServices() {
  const { services } = HAVEN_CONTENT;
  return (
    <Band eyebrow={services.eyebrow} title={services.title} subtitle={services.subtitle} id="services">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {services.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)] p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--hv-green-soft)]">
                <Icon className="h-5 w-5 text-[var(--hv-green)]" aria-hidden />
              </span>
              <h3 className="hv-display mt-5 text-[1.2rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--hv-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The interactive mortgage calculator. */
export function HavenMortgage() {
  const [price, setPrice] = useState(HAVEN_MORTGAGE.price);
  const [downPercent, setDownPercent] = useState(HAVEN_MORTGAGE.downPercent);
  const [rate, setRate] = useState(HAVEN_MORTGAGE.ratePercent);
  const [years, setYears] = useState(HAVEN_MORTGAGE.years);

  const { monthly, deposit, loan } = useMemo(() => {
    const dep = price * (downPercent / 100);
    const principal = price - dep;
    const r = rate / 100 / 12;
    const n = years * 12;
    const m = r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return { monthly: m, deposit: dep, loan: principal };
  }, [price, downPercent, rate, years]);

  return (
    <Band eyebrow="Mortgage calculator" title="See the monthly, before you fall in love." center>
      <Reveal delay={0.1}>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)] p-6 text-left shadow-[0_20px_50px_-30px_rgb(31_77_54/40%)] sm:p-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="hv-price" className="hv-mono text-[var(--hv-ink-faint)]">Property price</label>
                <span className="hv-display text-[1.1rem]">{money(price)}</span>
              </div>
              <input id="hv-price" type="range" min={HAVEN_MORTGAGE.priceMin} max={HAVEN_MORTGAGE.priceMax} step={10000} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="hv-range mt-3 w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="hv-down" className="hv-mono text-[var(--hv-ink-faint)]">Deposit</label>
                <span className="hv-display text-[1.1rem]">{downPercent}% · {money(deposit)}</span>
              </div>
              <input id="hv-down" type="range" min={5} max={60} step={1} value={downPercent} onChange={(e) => setDownPercent(Number(e.target.value))} className="hv-range mt-3 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="hv-rate" className="hv-mono text-[var(--hv-ink-faint)]">Rate</label>
                  <span className="hv-display text-[1.05rem]">{rate.toFixed(1)}%</span>
                </div>
                <input id="hv-rate" type="range" min={1} max={10} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="hv-range mt-3 w-full" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="hv-years" className="hv-mono text-[var(--hv-ink-faint)]">Term</label>
                  <span className="hv-display text-[1.05rem]">{years} yrs</span>
                </div>
                <input id="hv-years" type="range" min={5} max={35} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} className="hv-range mt-3 w-full" />
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center rounded-2xl bg-[var(--hv-green)] p-6 text-white">
            <p className="hv-mono text-white/70">Estimated monthly</p>
            <p className="hv-display mt-1 text-[clamp(2.4rem,5vw,3rem)] tabular-nums">{money(monthly)}</p>
            <div className="mt-5 space-y-2 border-t border-white/15 pt-4 text-[13px] text-white/80">
              <p className="flex justify-between"><span>Loan amount</span><span>{money(loan)}</span></p>
              <p className="flex justify-between"><span>Deposit</span><span>{money(deposit)}</span></p>
            </div>
            <p className="mt-5 text-[11.5px] text-white/60">A guide, not a quote. Your lender confirms the real figures.</p>
          </div>
        </div>
      </Reveal>
    </Band>
  );
}

/** Featured agents. */
export function HavenAgents() {
  return (
    <Band eyebrow="Our agents" title="People, not portals." id="agents">
      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" step={0.06}>
        {HAVEN_AGENTS.map((agent) => (
          <div key={agent.name} className="hv-card3d hv-frame group overflow-hidden rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)]">
            <div className="overflow-hidden">
              <div className={`hv-zoom ${agent.plate} aspect-[4/5]`} aria-hidden />
            </div>
            <div className="p-5">
              <h3 className="hv-display text-[1.2rem]">{agent.name}</h3>
              <p className="mt-1 text-[13px] text-[var(--hv-ink-faint)]">{agent.title}</p>
              <p className="hv-mono mt-3 text-[var(--hv-green)]">{agent.deals}</p>
            </div>
          </div>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** Why Haven. */
export function HavenWhy() {
  const { why } = HAVEN_CONTENT;
  return (
    <Band eyebrow={why.eyebrow} title={why.title} subtitle={why.subtitle} id="why">
      <RevealGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={0.07}>
        {why.items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-[var(--hv-radius)] bg-[var(--hv-panel)] p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--hv-sand-soft)]">
                <Icon className="h-5 w-5 text-[var(--hv-sand)]" aria-hidden />
              </span>
              <h3 className="hv-display mt-5 text-[1.2rem]">{item.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.7] text-[var(--hv-ink-soft)]">{item.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** How it works. */
export function HavenSteps() {
  return (
    <Band eyebrow="How it works" title="Search, tour, own." center>
      <RevealGroup className="mt-12 grid gap-5 text-left md:grid-cols-3" step={0.1}>
        {HAVEN_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={step.title} className="rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)] p-7">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--hv-green-soft)]">
                  <Icon className="h-6 w-6 text-[var(--hv-green)]" aria-hidden />
                </span>
                <span className="hv-display text-[1.4rem] text-[var(--hv-line)]">{`0${i + 1}`}</span>
              </div>
              <h3 className="hv-display mt-6 text-[1.35rem]">{step.title}</h3>
              <p className="mt-2 text-[14.5px] leading-[1.7] text-[var(--hv-ink-soft)]">{step.body}</p>
            </div>
          );
        })}
      </RevealGroup>
    </Band>
  );
}

/** The single-residence showcase, for the details page. */
export function HavenResidence() {
  const p = HAVEN_PROPERTIES[0]!;
  const amenities = ['Wine cellar', 'Heated pool', 'Home office', 'Two-car garage', 'Landscaped acre', 'Smart home'];
  return (
    <section className="px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <ImageReveal>
          <div className={`hv-frame ${p.plate} relative aspect-[16/9] overflow-hidden rounded-[var(--hv-radius)]`} aria-hidden>
            <span className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[rgb(20_35_26/60%)] to-transparent p-6 text-white">
              <span>
                <span className="hv-display block text-[1.8rem]">{p.name}</span>
                <span className="mt-1 flex items-center gap-1.5 text-[13px] text-white/85"><MapPin className="h-3.5 w-3.5" aria-hidden />{p.location}</span>
              </span>
              <span className="hv-display text-[1.6rem]">{p.price}</span>
            </span>
          </div>
        </ImageReveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
          <Reveal>
            <Specs beds={p.beds} baths={p.baths} area={p.area} className="border-b border-[var(--hv-line)] pb-6" />
            <p className="mt-6 max-w-[62ch] text-[16.5px] leading-[1.85] text-[var(--hv-ink-soft)]">
              A house built around its light. Oak floors, plastered walls and a wall of glass that opens the living room onto an acre of quiet. The kind of home that photographs well and lives better.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {amenities.map((a) => (
                <p key={a} className="flex items-center gap-2 rounded-xl bg-[var(--hv-panel)] px-4 py-3 text-[14px]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--hv-green)]" aria-hidden />{a}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-panel)] p-6">
              <p className="hv-mono text-[var(--hv-ink-faint)]">Your agent</p>
              <div className="mt-3 flex items-center gap-3">
                <span className={`${HAVEN_AGENTS[0]!.plate} h-12 w-12 shrink-0 rounded-full`} />
                <div>
                  <p className="text-[15px] font-semibold">{HAVEN_AGENTS[0]!.name}</p>
                  <p className="text-[12.5px] text-[var(--hv-ink-faint)]">{HAVEN_AGENTS[0]!.title}</p>
                </div>
              </div>
              <a href="?page=contact" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--hv-green)] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[var(--hv-green-deep)]">
                Book a viewing <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Numbers. */
export function HavenStats() {
  return (
    <section className="px-5 py-16 sm:px-8">
      <RevealGroup className="mx-auto grid max-w-6xl grid-cols-2 gap-4 lg:grid-cols-4" step={0.08}>
        {HAVEN_STATS.map((stat) => (
          <div key={stat.label} className="rounded-[var(--hv-radius)] bg-[var(--hv-panel)] p-6 text-center">
            <p className="hv-display text-[clamp(2rem,4vw,2.8rem)] tabular-nums text-[var(--hv-green)]">
              <Counter value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="hv-mono mt-2 text-[var(--hv-ink-faint)]">{stat.label}</p>
          </div>
        ))}
      </RevealGroup>
    </section>
  );
}

/** Testimonials. */
export function HavenTestimonials() {
  return (
    <Band eyebrow="Owners" title="In their words." id="testimonials">
      <RevealGroup className="mt-12 grid gap-6 lg:grid-cols-3" step={0.08}>
        {HAVEN_TESTIMONIALS.map((t) => (
          <figure key={t.author} className="flex flex-col rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)] p-7">
            <div className="flex gap-0.5 text-[var(--hv-sand)]">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden />)}
            </div>
            <blockquote className="mt-4 flex-1 text-[15.5px] leading-[1.7] text-[var(--hv-ink-soft)]">{t.quote}</blockquote>
            <figcaption className="mt-6 border-t border-[var(--hv-line)] pt-4">
              <p className="text-[15px] font-semibold">{t.author}</p>
              <p className="hv-mono mt-1 text-[var(--hv-ink-faint)]">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </RevealGroup>
    </Band>
  );
}

/** FAQ. */
export function HavenFaq() {
  const { faq } = HAVEN_CONTENT;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Band eyebrow={faq.eyebrow} title={faq.title} center>
      <div className="mx-auto mt-10 max-w-3xl text-left">
        <RevealGroup className="space-y-3" step={0.04}>
          {faq.items.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.question} className="rounded-[var(--hv-radius)] border border-[var(--hv-line)] bg-[var(--hv-bg)] px-5">
                <h3>
                  <button type="button" onClick={() => setOpen(expanded ? null : i)} aria-expanded={expanded} aria-controls={`hv-faq-${i}`} className="flex w-full items-center justify-between gap-6 py-5 text-left text-[16px] font-medium">
                    {item.question}
                    {expanded ? <Minus className="h-4 w-4 shrink-0 text-[var(--hv-green)]" aria-hidden /> : <Plus className="h-4 w-4 shrink-0 text-[var(--hv-ink-faint)]" aria-hidden />}
                  </button>
                </h3>
                {expanded && <div id={`hv-faq-${i}`} className="max-w-[62ch] pb-6 text-[15px] leading-[1.8] text-[var(--hv-ink-soft)]">{item.answer}</div>}
              </div>
            );
          })}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Contact. */
export function HavenContact() {
  const { contact } = HAVEN_CONTENT;
  const [sent, setSent] = useState(false);
  return (
    <Band eyebrow={contact.eyebrow} title={contact.title} subtitle={contact.subtitle} id="contact">
      <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            {(['name', 'email', 'message'] as const).map((field) => (
              <div key={field}>
                <label htmlFor={`hv-${field}`} className="hv-mono block text-[var(--hv-ink-faint)]">{contact.fields[field]}</label>
                {field === 'message' ? (
                  <textarea id={`hv-${field}`} name={field} rows={4} required className="mt-3 w-full resize-y rounded-[14px] border border-[var(--hv-line)] bg-[var(--hv-panel)] px-4 py-3 text-[16px] text-[var(--hv-ink)] outline-none focus:border-[var(--hv-green)]" />
                ) : (
                  <input id={`hv-${field}`} name={field} type={field === 'email' ? 'email' : 'text'} required className="mt-3 w-full rounded-[14px] border border-[var(--hv-line)] bg-[var(--hv-panel)] px-4 py-3 text-[16px] text-[var(--hv-ink)] outline-none focus:border-[var(--hv-green)]" />
                )}
              </div>
            ))}
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[var(--hv-green)] px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[var(--hv-green-deep)]">
              {contact.submit}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <p aria-live="polite" className="min-h-5 text-[13.5px] text-[var(--hv-green)]">{sent ? 'This is a template. Wire the form to your own inbox.' : ''}</p>
          </form>
        </Reveal>
        <RevealGroup className="grid gap-3" delay={0.08}>
          {contact.details.map((detail) => (
            <div key={detail.label} className="rounded-2xl bg-[var(--hv-panel)] p-5">
              <p className="hv-mono text-[var(--hv-ink-faint)]">{detail.label}</p>
              <p className="mt-2 text-[15.5px]">{detail.value}</p>
            </div>
          ))}
        </RevealGroup>
      </div>
    </Band>
  );
}

/** Closing invitation. */
export function HavenCta() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <Reveal className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[28px] bg-[var(--hv-green)] px-6 py-16 text-center text-white sm:px-12">
          <LiftLines className="hv-display mx-auto max-w-2xl text-[clamp(1.9rem,4vw,3rem)]">
            <Line>Your next address is waiting.</Line>
          </LiftLines>
          <p className="mx-auto mt-5 max-w-[50ch] text-[16px] text-[color-mix(in_srgb,white_84%,transparent)]">Book a viewing or a valuation. A senior agent gets back to you, usually the same day.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="?page=contact" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-medium text-[var(--hv-green)] transition-opacity hover:opacity-90">
              Book a viewing <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href="?page=properties" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-white/10">
              Browse residences <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/** Footer. */
export function HavenFooter() {
  const { footer } = HAVEN_CONTENT;
  return (
    <footer className="border-t border-[var(--hv-line)] bg-[var(--hv-panel)] px-5 py-14 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <BrandMark />
          <p className="mt-5 max-w-xs text-[14px] leading-[1.7] text-[var(--hv-ink-faint)]">{footer.tagline}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="hv-mono text-[var(--hv-ink-faint)]">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="?page=home" className="text-[14px] text-[var(--hv-ink-soft)] hover:text-[var(--hv-ink)]">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-[var(--hv-line)] pt-7 text-[12.5px] text-[var(--hv-ink-faint)]">{footer.legal}</p>
    </footer>
  );
}
