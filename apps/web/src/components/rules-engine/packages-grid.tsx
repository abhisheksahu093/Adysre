import { getTranslations } from 'next-intl/server';
import { RULES_PACKAGES } from '@/data/rules-engine';

/**
 * The package matrix.
 *
 * A Server Component: it renders a static list and owns no interaction, so
 * shipping it to the browser would cost a chunk to achieve nothing.
 *
 * The name, version and summary come from each package's own manifest, so this
 * grid cannot describe a package as something it has stopped being. Only the
 * ROLE label - "the vocabulary", "the engine" - is a translation key, because
 * that is the page speaking rather than the package.
 */
export async function RulesPackagesGrid({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'rules' });

  return (
    <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {RULES_PACKAGES.map((entry) => {
        const Icon = entry.icon;

        return (
          <li
            key={entry.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-2">
              <Icon aria-hidden className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t(`packages.${entry.id}`)}
              </span>
            </div>

            <code className="font-mono text-sm text-foreground">{entry.name}</code>
            <p className="text-sm text-muted-foreground">{entry.description}</p>

            <span className="mt-auto font-mono text-xs text-muted-foreground">
              v{entry.version}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
