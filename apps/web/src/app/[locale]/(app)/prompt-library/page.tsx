import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { PromptGrid } from '@/components/prompt-library/prompt-grid';
import { getPrompts } from '@/data/prompts';
import { getAccessLevel } from '@/lib/access-server';
import { redactLockedPrompts } from '@/lib/access';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'nav' });
  return { title: t('promptLibrary') };
}

/**
 * Server Component shell. Prompt text is resolved here for the active locale
 * and handed to the client grid, so a visitor only downloads their own
 * language's catalogue rather than all four.
 */
export default async function PromptLibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, all, accessLevel] = await Promise.all([
    getTranslations({ locale, namespace: 'nav' }),
    getPrompts(locale),
    getAccessLevel(),
  ]);

  // Enforced here, not in the card: the list is serialised into the RSC
  // payload, so a body that reaches the client is readable regardless of what
  // the UI shows. Withhold it at the source.
  const prompts = redactLockedPrompts(all, accessLevel);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{t('promptLibrary')}</h1>
        <p className="text-sm text-muted-foreground">{t('descriptions.promptLibrary')}</p>
      </div>
      <PromptGrid prompts={prompts} />
    </div>
  );
}
