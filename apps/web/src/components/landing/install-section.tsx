import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowUpRight, Terminal } from 'lucide-react';
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
import { CTA_ARROW, ctaClass } from './cta';
import { WorkbenchSection } from './workbench/section';
import { Hud, Panel } from './workbench/panel';
import { InstallCommand } from './install-command';
import { InstallSnippet } from './install-snippet';

/**
 * "Install it" - the section that turns a visitor browsing the catalogue into
 * someone with the package in their project.
 *
 * Everything the old section carried is still here: the package identity, the
 * manager tabs, both snippets, all six subpath entry points with their live
 * counts, and both calls to action. What changed is the frame - one package
 * panel whose title bar states name, version and licence the way a manifest
 * does, rather than three pills floating over a glow.
 *
 * Server Component. Both snippets are highlighted here, at render, and handed
 * to the client pieces as HTML; only the tab strip and the two copy buttons
 * need a browser bundle. The package name, version and every count are read
 * from the package and the catalogues rather than typed, so a release or a new
 * gradient updates this section on its own.
 */
export async function InstallSection() {
  const [t, format] = await Promise.all([getTranslations('landing.install'), getFormatter()]);

  const [setupHtml, usageHtml] = await Promise.all([
    highlight(SETUP_SNIPPET, 'css'),
    highlight(USAGE_SNIPPET, 'tsx'),
  ]);

  return (
    <WorkbenchSection
      id="install"
      label={t('eyebrow')}
      title={t('title')}
      description={t('subtitle')}
      actions={
        <>
          {/* Both were hand-built ink buttons; they use the page's shared
              actions now, so this pair matches every other section CTA. */}
          <a
            href={PACKAGE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={ctaClass({ size: 'sm', className: 'gap-1.5' })}
          >
            {t('cta.npm')}
            <ArrowUpRight className={cn('h-4 w-4', CTA_ARROW)} aria-hidden />
          </a>
          <Link href="/components" className={ctaClass({ tone: 'quiet', size: 'sm' })}>
            {t('cta.browse')}
          </Link>
        </>
      }
    >
      <Panel
        title={<span className="font-hud text-[13px] font-medium">{PACKAGE_NAME}</span>}
        actions={
          <span className="flex items-center gap-4">
            <Hud strong>v{PACKAGE_VERSION}</Hud>
            <Hud>{t('license', { license: PACKAGE_LICENSE })}</Hud>
          </span>
        }
      >
        <InstallCommand managers={PACKAGE_MANAGERS} />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
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
        <div className="mt-8 border-t border-line pt-5">
          <h3>
            <Hud>{t('entriesTitle')}</Hud>
          </h3>

          <ul className="mt-3 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {ENTRY_POINTS.map((entry) => (
              <li key={entry.id} className="bg-panel">
                <Link
                  href={entry.href}
                  className={cn(
                    'group flex h-full items-center gap-3 px-3.5 py-3 transition-colors hover:bg-panel-raised',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  )}
                >
                  <Terminal className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-hud text-xs text-foreground">
                      {entry.specifier}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {t(`entries.${entry.id}`)}
                    </span>
                  </span>
                  <span className="shrink-0 font-hud text-[13px] font-medium tabular-nums text-foreground">
                    {format.number(entry.count)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </WorkbenchSection>
  );
}
