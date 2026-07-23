import { getTranslations } from 'next-intl/server';
import { Check, Package } from 'lucide-react';
import { cn } from 'adysre';
import { highlight } from '@/lib/highlight';
import {
  MODULE_USAGE,
  PACKAGE_NAME,
  PACKAGE_URL,
  PACKAGE_VERSION,
  PACKAGE_MANAGERS,
  REQUIREMENT_IDS,
  SETUP_SNIPPET,
} from '@/data/install';
import { InstallCommand } from '@/components/landing/install-command';
import { InstallSnippet } from '@/components/landing/install-snippet';

/**
 * "Use this from npm" — the panel that closes every catalogue page.
 *
 * A visitor who has just browsed 448 icons has exactly one question left, and it
 * is not "what else do you have": it is "how do I get these into my project".
 * This answers it in place, with the install line, what the package needs, and a
 * snippet for the module they were actually looking at.
 *
 * Server Component: both snippets are highlighted at render and only the tab
 * strip and copy buttons reach the browser. The snippet is selected by `module`,
 * which is the page's own id, so a page can never advertise the wrong import.
 */
export async function NpmUsage({ module }: { module: keyof typeof MODULE_USAGE }) {
  const t = await getTranslations('npm');
  const usage = MODULE_USAGE[module];
  if (!usage) return null;

  const [setupHtml, usageHtml] = await Promise.all([
    highlight(SETUP_SNIPPET, 'css'),
    highlight(usage.snippet, 'tsx'),
  ]);

  return (
    <section
      aria-labelledby="npm-usage-title"
      className="mt-16 overflow-hidden rounded-2xl border border-border bg-muted/20"
    >
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-primary">
              {t('eyebrow')}
            </p>
            <h2 id="npm-usage-title" className="mt-1.5 text-xl font-semibold tracking-tight">
              {t(`modules.${module}.title`)}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t(`modules.${module}.desc`)}
            </p>
          </div>

          <a
            href={PACKAGE_URL}
            target="_blank"
            rel="noreferrer noopener"
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs',
              'transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            <Package className="h-3.5 w-3.5 text-primary" aria-hidden />
            {PACKAGE_NAME}
            <span className="text-muted-foreground">v{PACKAGE_VERSION}</span>
          </a>
        </div>

        <div className="mt-7 max-w-2xl sm:mx-0">
          <InstallCommand managers={PACKAGE_MANAGERS} />
        </div>

        {/* What has to be true before the snippet below runs. */}
        <ul className="mt-7 grid gap-2 sm:grid-cols-3">
          {REQUIREMENT_IDS.map((id) => (
            <li key={id} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden />
              <span>
                <span className="font-medium">{t(`requirements.${id}.title`)}</span>
                <span className="block text-xs leading-relaxed text-muted-foreground">
                  {t(`requirements.${id}.desc`)}
                </span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
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
            title={t('steps.use.title', { specifier: usage.specifier })}
            description={t('steps.use.desc')}
            filename="app/page.tsx"
            code={usage.snippet}
            html={usageHtml}
          />
        </div>
      </div>
    </section>
  );
}
