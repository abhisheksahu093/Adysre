import { getTranslations } from 'next-intl/server';
import { RULES_CAPABILITIES, RULES_DECISIONS } from '@/data/rules-engine';

/**
 * What the engine does, and the decisions behind it.
 *
 * Two grids over the same shape, because they answer the two questions a
 * visitor asks in order: what can it do, and why should I believe it. Both are
 * Server Components with no interaction of their own.
 */
export async function RulesCapabilitiesGrid({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'rules' });

  return (
    <ul className="grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4">
      {RULES_CAPABILITIES.map((capability) => {
        const Icon = capability.icon;

        return (
          <li
            key={capability.id}
            className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
          >
            <Icon aria-hidden className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-medium text-foreground">
              {t(`capabilities.${capability.id}.title`)}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t(`capabilities.${capability.id}.desc`)}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

export async function RulesDecisionsList({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'rules' });

  return (
    <ul className="grid list-none gap-4 p-0 sm:grid-cols-2">
      {RULES_DECISIONS.map((id) => (
        <li key={id} className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4">
          <h3 className="text-sm font-medium text-foreground">{t(`decisions.${id}.title`)}</h3>
          <p className="text-sm text-muted-foreground">{t(`decisions.${id}.desc`)}</p>
        </li>
      ))}
    </ul>
  );
}
