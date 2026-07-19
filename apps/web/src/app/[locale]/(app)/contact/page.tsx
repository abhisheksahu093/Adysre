import type { Metadata } from 'next';
import { LifeBuoy, Mail, BookOpen, Code2, MessageSquare, ChevronDown } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pages.helpCentre' });
  return { title: t('title'), description: t('description') };
}

/** Support channels: labels come from i18n, hrefs/icons stay in code. */
const CHANNELS = [
  { key: 'email', icon: Mail, href: SUPPORT_MAILTO, external: true },
  { key: 'docs', icon: BookOpen, href: '/docs', external: false },
  { key: 'api', icon: Code2, href: '/docs/api', external: false },
  { key: 'community', icon: MessageSquare, href: '/components', external: false },
] as const;

interface Faq {
  q: string;
  a: string;
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'pages.helpCentre' });
  const faqs = (t.raw('faqs') as Faq[] | undefined) ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-10">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
            aria-hidden
          >
            <LifeBuoy className="h-5 w-5" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('title')}</h1>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground">{t('description')}</p>
      </header>

      {/* Channels */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {CHANNELS.map(({ key, icon: Icon, href, external }) => {
          const inner = (
            <>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground transition-colors group-hover/ch:bg-primary/10 group-hover/ch:text-primary"
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">
                  {t(`channels.${key}.title`)}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                  {t(`channels.${key}.body`)}
                </span>
                <span className="mt-2 inline-block text-xs font-medium text-primary">
                  {t(`channels.${key}.cta`)}
                </span>
              </span>
            </>
          );
          const className =
            'group/ch flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
          return external ? (
            <a key={key} href={href} className={className}>
              {inner}
            </a>
          ) : (
            <Link key={key} href={href} className={className}>
              {inner}
            </Link>
          );
        })}
      </section>

      {/* Direct email callout */}
      <section className="rounded-xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold tracking-tight sm:text-base">{t('emailTitle')}</h2>
            <p className="text-xs text-muted-foreground sm:text-sm">{t('emailBody')}</p>
          </div>
          <a
            href={SUPPORT_MAILTO}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mail className="h-4 w-4" aria-hidden />
            {SUPPORT_EMAIL}
          </a>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold tracking-tight">{t('faqTitle')}</h2>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
            {faqs.map((faq, i) => (
              <details key={i} className="group/faq">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted">
                  {faq.q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open/faq:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
