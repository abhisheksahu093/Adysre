'use client';

import { ArrowRight, Clock, Search, Sparkles } from 'lucide-react';
import { TAVOLA_STEP_ICONS, tavolaHref } from '@/data/templates/tavola-kitchen-content';
import { TavolaDishCard } from './tavola-dish-card';
import { TavolaSectionHeading } from './tavola-section-heading';
import { TavolaStars } from './tavola-stars';
import { useTavolaSettings } from './tavola-settings';
import type { TavolaCart } from './tavola-use-cart';

/**
 * TAVOLA - the home page.
 *
 * Follows the reference layout top to bottom: hero, popular dishes, how it
 * works, the "simple way" split, latest blog and customer reactions. Every
 * string and every dish comes from the ACTIVE locale bundle, and every price
 * through `formatPrice`, so the whole page answers to the two header pickers.
 */
export function TavolaHomePage({ cart }: { cart: TavolaCart }) {
  const { data } = useTavolaSettings();
  const { content, copy, dishes, steps, posts, reviews } = data;
  const popular = dishes.slice(0, 4);

  return (
    <>
      {/* ------------------------------------------------------------- hero */}
      <section className="tv-wash relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:py-20">
          <div className="tv-rise">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--tv-accent-deep)] shadow-[0_1px_0_var(--tv-rule)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {content.hero.badge}
            </p>

            <h1 className="mt-5 text-[42px] font-extrabold sm:text-[56px] lg:text-[60px]">
              {/* No separator here: English carries its own trailing space in
                  the content module, and Japanese must not have one after 「、」. */}
              {content.hero.title}
              <span className="text-[var(--tv-accent)]">{content.hero.titleAccent}</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-[var(--tv-ink-soft)]">
              {content.hero.subtitle}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a href={tavolaHref('menu')} className="tv-btn tv-btn--solid">
                {content.hero.ctaPrimary}
              </a>
              <a href={tavolaHref('contact')} className="tv-btn tv-btn--ghost">
                <Search className="h-4 w-4" aria-hidden />
                {content.hero.ctaSecondary}
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <span aria-hidden className="flex -space-x-2">
                {['tomato', 'herb', 'saffron', 'berry'].map((tone) => (
                  <span
                    key={tone}
                    data-food={tone}
                    className="tv-plate h-8 w-8 ring-2 ring-white"
                  />
                ))}
              </span>
              <span className="flex items-center gap-2">
                <TavolaStars rating={4.9} label="4.9" />
                <span className="text-[13px] text-[var(--tv-ink-soft)]">
                  {copy.home.heroReviews}
                </span>
              </span>
            </div>
          </div>

          {/* The plated hero, with the two floating cards from the reference. */}
          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="tv-plate aspect-square w-full" data-food="herb" aria-hidden />

            <div className="tv-card absolute left-0 top-6 flex items-center gap-2 px-3 py-2 sm:-left-6">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--tv-accent)] text-white">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <span className="max-w-[7.5rem] text-[12px] font-semibold leading-tight">
                {copy.home.heroDiscount}
              </span>
            </div>

            <div className="tv-card absolute bottom-8 right-0 flex items-center gap-2 px-3 py-2 sm:-right-4">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--tv-navy)] text-white">
                <Clock className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-[12px] font-semibold leading-tight">
                {copy.home.heroDelivery}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------- popular dishes */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-4">
          <TavolaSectionHeading
            eyebrow={copy.home.dishesEyebrow}
            title={copy.home.dishesTitle}
            align="left"
          />
          <a
            href={tavolaHref('menu')}
            className="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[var(--tv-accent)] hover:text-[var(--tv-accent-deep)] sm:inline-flex"
          >
            {copy.common.viewAll}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popular.map((dish, index) => (
            <TavolaDishCard
              key={dish.id}
              dish={dish}
              copy={copy}
              onAdd={cart.add}
              featured={index === 1}
            />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ how it works */}
      <section className="bg-[var(--tv-paper-2)] py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TavolaSectionHeading
            eyebrow={copy.home.stepsEyebrow}
            title={copy.home.stepsTitle}
            subtitle={copy.home.stepsSubtitle}
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = TAVOLA_STEP_ICONS[step.id as keyof typeof TAVOLA_STEP_ICONS];
              return (
                <article key={step.id} className="tv-card p-6 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--tv-accent-soft)] text-[var(--tv-accent-deep)]">
                    {Icon ? <Icon className="h-6 w-6" aria-hidden /> : null}
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold">{step.title}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-[var(--tv-ink-soft)]">
                    {step.body}
                  </p>
                  <a
                    href={tavolaHref('services')}
                    className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-[var(--tv-accent)]"
                  >
                    {copy.common.readMore}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- simple way split */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div>
          <TavolaSectionHeading
            eyebrow={copy.home.simpleEyebrow}
            title={copy.home.simpleTitle}
            align="left"
          />
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--tv-ink-soft)]">
            {copy.home.simpleBody}
          </p>
          <a href={tavolaHref('services')} className="tv-btn tv-btn--solid mt-6">
            {copy.common.readMore}
          </a>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div
            aria-hidden
            className="h-56 flex-1 rounded-[var(--tv-radius-lg)] bg-[linear-gradient(140deg,#2b3054,#4a3a3a_45%,#8a5a3c)] shadow-[0_30px_60px_-34px_rgb(20_21_43/50%)]"
          />
          <ul className="flex w-full shrink-0 flex-col gap-2.5 sm:w-52">
            {copy.home.simplePoints.map((point, index) => (
              <li
                key={point}
                className="tv-card flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold"
              >
                <span
                  aria-hidden
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--tv-accent-soft)] text-[12px] font-bold text-[var(--tv-accent-deep)]"
                >
                  {index + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- the blog */}
      <section className="bg-[var(--tv-paper-2)] py-16">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <TavolaSectionHeading
              eyebrow={copy.home.blogEyebrow}
              title={copy.home.blogTitle}
              align="left"
            />
            <a
              href={tavolaHref('blog')}
              className="hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-[var(--tv-accent)] sm:inline-flex"
            >
              {copy.common.readMore}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="tv-card overflow-hidden">
                <div
                  aria-hidden
                  data-food={post.palette}
                  className="tv-plate !rounded-none h-40 w-full"
                />
                <div className="p-5">
                  <p className="text-[13px] leading-relaxed text-[var(--tv-ink-soft)]">
                    {post.excerpt}
                  </p>
                  <p className="mt-4 text-[12px] text-[var(--tv-ink-faint)]">
                    {post.date} · {post.readMinutes} {copy.blog.readTime}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- customer reviews */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <TavolaSectionHeading
          eyebrow={copy.home.reviewsEyebrow}
          title={copy.home.reviewsTitle}
          align="left"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.id} className="tv-card flex h-full flex-col p-6">
              <div className="flex items-center justify-between gap-2">
                <TavolaStars rating={review.rating} label={`${review.rating}`} />
                <span className="text-[12px] text-[var(--tv-ink-faint)]">{review.date}</span>
              </div>
              <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--tv-ink-soft)]">
                {review.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span aria-hidden className="tv-plate h-9 w-9" data-food="cream" />
                <span>
                  <span className="block text-[13px] font-bold">{review.name}</span>
                  <span className="block text-[12px] text-[var(--tv-ink-faint)]">
                    {review.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* The hero counters, reused as a closing proof strip. */}
        <dl className="mt-12 grid gap-5 rounded-[var(--tv-radius-lg)] bg-[var(--tv-navy)] px-6 py-8 text-white sm:grid-cols-3">
          {content.hero.stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="tv-num block text-[30px] font-extrabold">
                  {stat.value.toLocaleString('en-US')}
                  {stat.suffix}
                </span>
                <span className="mt-1 block text-[13px] text-white/60">{stat.label}</span>
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-center text-[12px] text-[var(--tv-ink-faint)]">
          {copy.cart.note}
        </p>
      </section>
    </>
  );
}
