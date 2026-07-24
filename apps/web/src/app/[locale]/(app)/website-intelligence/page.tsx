import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Radar } from 'lucide-react';
import { redirect } from '@/i18n/navigation';
import { getSession } from '@/lib/website-intel/auth/session';
import { INTEL_DASHBOARD_SECTIONS, INTEL_STATS } from '@/data/website-intelligence';
import { IntelCapabilitiesGrid } from '@/components/website-intelligence/capabilities-grid';
import { ScanConsole } from '@/components/website-intelligence/scan-console';
import { ScheduleManager } from '@/components/website-intelligence/schedule-manager';
import { NotificationChannels } from '@/components/website-intelligence/notification-channels';
import { ReportExport } from '@/components/website-intelligence/report-export';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'websiteIntel' });
  return { title: t('meta.title'), description: t('meta.description') };
}

/**
 * Website Intelligence - the in-app overview.
 *
 * The scanning engine (Playwright + Lighthouse + axe-core, a BullMQ queue and a
 * 500+ rule engine) is a separate build; this page is the honest front of it -
 * what the platform analyses, the dashboard it produces and the stack it runs
 * on - with the scan bar shown as a preview rather than a working form, so
 * nothing here pretends to return a result it cannot yet produce.
 *
 * Server Component. Copy is translation keys under `websiteIntel.*`; the
 * capability list, dashboard sections, report formats and stack all come from
 * `@/data/website-intelligence`, so extending the platform updates this page.
 */
export default async function WebsiteIntelligencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Website Intelligence is behind auth: the interactive panels below drive the
  // gated `/api/website-intelligence/*` endpoints, so an unauthenticated visitor
  // gets sent to sign in rather than a page whose every action would 401.
  if (!(await getSession())) redirect({ href: '/login', locale });

  const t = await getTranslations({ locale, namespace: 'websiteIntel' });

  return (
    <div className="mx-auto max-w-6xl space-y-16 py-4 sm:py-8">
      {/* ── Header + scan-bar preview ─────────────────────────────────────── */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Radar className="h-3.5 w-3.5 text-primary" aria-hidden />
            {t('badge')}
          </span>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {t('comingSoon')}
          </span>
        </div>

        <div className="max-w-3xl space-y-3">
          <h1 className="text-2xl font-bold tracking-tight sm:text-4xl">{t('title')}</h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{t('subtitle')}</p>
        </div>

        {/* The working scan console: SEO, security, HTML, assets and best
            practices run today; the browser-driven analyses land in a later
            phase (the console says so under the score). Full-width so the score
            card, findings and history use the space rather than a narrow column. */}
        <ScanConsole placeholder={t('scan.placeholder')} />

        {/* Stats */}
        <dl className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
          {INTEL_STATS.map((stat) => (
            <div key={stat.id} className="rounded-xl border border-border bg-card p-4">
              <dd className="text-2xl font-bold tabular-nums sm:text-3xl">
                {stat.value}
                {stat.suffix}
              </dd>
              <dt className="mt-1 text-xs text-muted-foreground">{t(`stats.${stat.id}`)}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Scheduled scans ───────────────────────────────────────────────── */}
      <section>
        <header className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('schedule.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('schedule.subtitle')}</p>
        </header>
        <div className="mt-6">
          <ScheduleManager placeholder={t('scan.placeholder')} />
        </div>
      </section>

      {/* ── Notifications ─────────────────────────────────────────────────── */}
      <section>
        <header className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('notify.title')}</h2>
          <p className="text-sm text-muted-foreground">{t('notify.subtitle')}</p>
        </header>
        <div className="mt-6">
          <NotificationChannels />
        </div>
      </section>

      {/* ── Capabilities ──────────────────────────────────────────────────── */}
      <section>
        <header className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('capabilitiesTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('capabilitiesSubtitle')}</p>
        </header>
        <IntelCapabilitiesGrid className="mt-8" />
      </section>

      {/* ── Dashboard sections ────────────────────────────────────────────── */}
      <section>
        <header className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('dashboardTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('dashboardSubtitle')}</p>
        </header>
        <ul className="mt-6 flex flex-wrap gap-2">
          {INTEL_DASHBOARD_SECTIONS.map((id) => (
            <li
              key={id}
              className="rounded-lg border border-border bg-card px-3.5 py-2 text-sm text-foreground"
            >
              {t(`dashboard.${id}`)}
            </li>
          ))}
        </ul>
      </section>

      {/* ── Export any report ─────────────────────────────────────────────── */}
      <section>
        <header className="max-w-2xl space-y-2">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t('reportsTitle')}</h2>
          <p className="text-sm text-muted-foreground">{t('reportsSubtitle')}</p>
        </header>
        {/* Working buttons: they export the most recent scan (PDF opens the
            printable report, the rest download) — the same wiring the scan
            result offers up top. */}
        <ReportExport />
      </section>
    </div>
  );
}
