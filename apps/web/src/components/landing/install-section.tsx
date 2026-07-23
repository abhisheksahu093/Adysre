import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight, Package, Terminal } from 'lucide-react';
import { cn } from 'adysre';
import { highlight } from '@/lib/highlight';
import {
  ENTRY_POINTS,
  PACKAGE_LICENSE,
  PACKAGE_NAME,
  PACKAGE_URL,
  PACKAGE_VERSION,
  PACKAGE_MANAGERS,
  SETUP_SNIPPET,
  USAGE_SNIPPET,
} from '@/data/install';
import { LandingBackdrop } from './landing-backdrop';
import { SectionHeading } from './section-heading';
import { InstallCommand } from './install-command';
import { InstallSnippet } from './install-snippet';

/**
 * "Install it" — the section that turns a visitor browsing the catalogue into
 * someone with the package in their project.
 *
 * Server Component. Both snippets are highlighted here, at render, and handed to
 * the client pieces as HTML; only the tab strip and the two copy buttons need a
 * browser bundle. The package name, version and every count are read from the
 * package and the catalogues rather than typed, so a release or a new gradient
 * updates this section on its own.
 */
export async function InstallSection() {
  const t = await getTranslations('landing.install');
  const format = await getFormatter();

  const [setupHtml, usageHtml] = await Promise.all([
    highlight(SETUP_SNIPPET, 'css'),
    highlight(USAGE_SNIPPET, 'tsx'),
  ]);

  return (
    <section id="install" className="relative overflow-hidden border-y border-border">
      <LandingBackdrop />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          className="max-w-3xl"
        />

        {/* Package identity: name, current version, licence. */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 font-mono text-foreground">
            <Package className="h-3.5 w-3.5 text-primary" aria-hidden />
            {PACKAGE_NAME}
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1 font-mono text-muted-foreground">
            v{PACKAGE_VERSION}
          </span>
          <span className="rounded-full border border-border bg-card px-3 py-1 text-muted-foreground">
            {t('license', { license: PACKAGE_LICENSE })}
          </span>
        </div>

        <div className="mt-8">
          <InstallCommand managers={PACKAGE_MANAGERS} />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <InstallSnippet
            step={1}
            title={t('steps.styles.title')}
            description={t('steps.styles.desc')}
            filename="app/globals.css"
            code={SETUP_SNIPPET}
            html={setupHtml}
          />
          <InstallSnippet
            step={2}
            title={t('steps.use.title')}
            description={t('steps.use.desc')}
            filename="app/page.tsx"
            code={USAGE_SNIPPET}
            html={usageHtml}
          />
        </div>

        {/* What each subpath gives you. Counts come from the catalogues. */}
        <div className="mt-14">
          <h3 className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            {t('entriesTitle')}
          </h3>

          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENTRY_POINTS.map((entry) => (
              <li key={entry.id}>
                <Link
                  href={entry.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5',
                    'transition-colors hover:border-primary/40 hover:bg-muted/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <Terminal className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-xs text-foreground">
                      {entry.specifier}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {t(`entries.${entry.id}`)}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-primary">
                    {format.number(entry.count)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a
            href={PACKAGE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              'inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground',
              'transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {t('cta.npm')}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <Link
            href="/components"
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium',
              'transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            {t('cta.browse')}
          </Link>
        </div>
      </div>
    </section>
  );
}
