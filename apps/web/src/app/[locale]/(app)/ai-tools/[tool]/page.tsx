import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { AI_TOOL_BY_ID } from '@/modules/ai-tools/tools/registry';
import { ToolIcon } from '@/modules/ai-tools/components/tool-icon';
import { ToolWorkspace } from '@/modules/ai-tools/components/tool-workspace';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tool: string }>;
}): Promise<Metadata> {
  const { locale, tool } = await params;
  if (!AI_TOOL_BY_ID[tool]) return {};
  const t = await getTranslations({ locale, namespace: 'aiTools' });
  return { title: `${t(`tools.${tool}.name`)} · ${t('title')}`, description: t(`tools.${tool}.desc`) };
}

/**
 * A single AI tool. The registry (with its client-side `process`/panel) is
 * resolved in the client `ToolWorkspace`; this server shell only validates the
 * id, sets metadata and renders the header.
 */
export default async function AiToolPage({ params }: { params: Promise<{ locale: string; tool: string }> }) {
  const { locale, tool } = await params;
  setRequestLocale(locale);
  const def = AI_TOOL_BY_ID[tool];
  if (!def) notFound();

  const t = await getTranslations({ locale, namespace: 'aiTools' });

  return (
    <div className="mx-auto max-w-6xl space-y-6 py-4 sm:py-8">
      <header className="space-y-3">
        <Link href="/ai-tools" className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t('backToTools')}
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ToolIcon name={def.icon} className="h-6 w-6" />
          </span>
          <div className="space-y-0.5">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{t(`tools.${tool}.name`)}</h1>
            <p className="text-sm text-muted-foreground">{t(`tools.${tool}.desc`)}</p>
          </div>
        </div>
      </header>

      <ToolWorkspace toolId={tool} />
    </div>
  );
}
