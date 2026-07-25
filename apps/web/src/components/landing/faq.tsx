import { getTranslations } from 'next-intl/server';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { FAQ_ITEMS, LANDING_LINKS } from '@/data/landing';

/**
 * Frequently asked questions, in a two-column layout: a sticky heading and a
 * "still stuck?" contact card on the left, the questions on the right. Built on
 * native `<details>`/`<summary>`, so it stays keyboard accessible and needs no
 * client JavaScript - the chevron and the open-state accent come from the
 * `open:`/`group-open:` variants. Each question is its own card that lights up
 * with a primary accent when expanded.
 */
export async function Faq() {
  const t = await getTranslations('landing');

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      {/* Soft brand glow behind the section for depth. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 -z-10 mx-auto h-72 max-w-4xl rounded-full bg-primary/10 blur-3xl"
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16">
        {/* Left: heading + contact card, sticky on desktop. */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            {t('faq.badge')}
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{t('faq.title')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {t('faq.subtitle')}
          </p>
          <div className="mt-6 rounded-2xl border border-border bg-card p-5">
            <p className="text-sm leading-relaxed text-muted-foreground">{t('faq.help')}</p>
            <Link
              href={LANDING_LINKS.contact}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              {t('faq.helpCta')}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>

        {/* Right: the questions. */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((id) => (
            <details
              key={id}
              className="group rounded-xl border border-border bg-card px-5 transition-colors hover:border-muted-foreground/30 open:border-primary/40 open:bg-primary/[0.04] [&_summary]:list-none"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-sm font-medium sm:text-[15px]">
                <span>{t(`faq.items.${id}.q`)}</span>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all group-open:rotate-180 group-open:border-primary/50 group-open:bg-primary/10 group-open:text-primary">
                  <ChevronDown className="h-4 w-4" aria-hidden />
                </span>
              </summary>
              <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {t(`faq.items.${id}.a`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
