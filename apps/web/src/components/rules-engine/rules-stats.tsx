import { getFormatter, getTranslations } from 'next-intl/server';
import { IMPORT_FORMATS, RULES_STATS } from '@/data/rules-engine';

/**
 * The figures the page leads with.
 *
 * Every one derives from the engine - the operator count is
 * `builtinOperators.length` - so this band cannot claim a number the registry
 * does not have. Locale-formatted, because a figure with the wrong digit
 * grouping reads as a typo in every language that does not group in threes.
 */
export async function RulesStats({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'rules' });
  const format = await getFormatter({ locale });

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
        {RULES_STATS.map((stat) => (
          <div
            key={stat.id}
            className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4"
          >
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {t(`stats.${stat.id}`)}
            </dt>
            <dd className="text-2xl font-semibold tabular-nums text-foreground">
              {format.number(stat.value)}
            </dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-muted-foreground">
        {/* Format names are proper nouns, so they ship as data rather than keys. */}
        {t('importsFrom')} {IMPORT_FORMATS.join(', ')}.
      </p>
    </div>
  );
}
